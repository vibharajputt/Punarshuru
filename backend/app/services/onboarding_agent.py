"""
Onboarding Agent v2 — slot-filling state machine (ux.md Agent v2).

Architecture:
  - Code controls slot ordering and 'done'. LLM only extracts fields + phrases reply.
  - Pydantic model validates/coerces LLM JSON output; unknown keys dropped.
  - Last 6 messages of history passed to LLM.
  - Sessions persisted in DB table onboarding_sessions keyed by user_id.
  - Rule-based Hinglish fallback with word-boundary regex.
  - Resume: never invents city/target/name. Gap extracted from date ranges.
  - 'done' only when all required slots filled AND action == 'confirm'.
  - 'Skip' advances past the current optional slot only.
  - name/email come from authenticated user — never asked.
"""

import json
import logging
import re
from typing import Any

from pydantic import BaseModel, ValidationError, field_validator
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.onboarding_session import OnboardingSession
from app.models.user import User
from app.schemas.onboarding import OnboardingChatResponse
from app.services.llm import complete
from app.services.resume_parser import parse_resume_text

logger = logging.getLogger(__name__)

# ── Slot ordering (ux.md Agent v2) ───────────────────────────────────────────
# Required slots
REQUIRED_SLOTS: list[str] = ["current_role", "skills", "target_role", "city"]
# Optional slots — asked only if experience > 0; "Skip" skips only current optional
OPTIONAL_SLOTS: list[str] = ["career_gap", "expected_salary"]

VALID_SEGMENTS = {"returner", "gig", "laid_off", "stagnant", "student"}

# ── Known cities (rule-based) ─────────────────────────────────────────────────
_CITIES = [
    "Pune", "Bengaluru", "Bangalore", "Lucknow", "Noida", "Mohali", "Mumbai",
    "Hyderabad", "Delhi", "Gurugram", "Chennai", "Jaipur", "Ahmedabad",
    "Kolkata", "Chandigarh", "Bhopal", "Nagpur", "Indore", "Coimbatore",
    "Kochi", "Visakhapatnam", "Surat", "Vadodara",
]
# Normalise Bangalore → Bengaluru
_CITY_NORM: dict[str, str] = {"Bangalore": "Bengaluru"}


# ─────────────────────────────────────────────────────────────────────────────
# Pydantic model for LLM extraction output — validates & coerces
# ─────────────────────────────────────────────────────────────────────────────

class _LLMExtract(BaseModel):
    """Validated extraction from LLM JSON. Unknown keys silently dropped."""

    model_config = {"extra": "ignore"}

    reply: str = ""
    quick_replies: list[str] = []
    current_role: str | None = None
    skills: list[str] | None = None
    target_role: str | None = None
    city: str | None = None
    experience_years: int | None = None
    career_gap_years: float | None = None
    expected_salary_lpa: float | None = None
    segment: str | None = None

    @field_validator("segment")
    @classmethod
    def validate_segment(cls, v: str | None) -> str | None:
        if v and v not in VALID_SEGMENTS:
            return None
        return v

    @field_validator("experience_years", mode="before")
    @classmethod
    def coerce_exp(cls, v: Any) -> int | None:
        if v is None or v == "":
            return None
        try:
            return int(float(v))
        except (TypeError, ValueError):
            return None

    @field_validator("career_gap_years", mode="before")
    @classmethod
    def coerce_gap(cls, v: Any) -> float | None:
        if v is None or v == "":
            return None
        try:
            return float(v)
        except (TypeError, ValueError):
            return None

    @field_validator("skills", mode="before")
    @classmethod
    def coerce_skills(cls, v: Any) -> list[str] | None:
        if v is None:
            return None
        if isinstance(v, list):
            return [str(s).strip() for s in v if str(s).strip()]
        if isinstance(v, str):
            items = re.split(r"[,/|;]|\band\b", v, flags=re.I)
            return [s.strip() for s in items if s.strip()]
        return None


# ─────────────────────────────────────────────────────────────────────────────
# Segment classifier
# ─────────────────────────────────────────────────────────────────────────────

def _classify_segment(text: str, current_role: str, gap_years: float) -> str:
    t = f"{text} {current_role}".lower()
    if re.search(r"\b(student|college|fresher|b\.?tech|graduate)\b", t):
        return "student"
    if re.search(r"\b(delivery|swiggy|zomato|uber|ola|gig|driver|courier|freelanc)\b", t):
        return "gig"
    if re.search(r"\b(laid.?off|downsized|fired|retrench|let.?go)\b", t):
        return "laid_off"
    if gap_years >= 0.5 or re.search(r"\b(maternity|career.?gap|career.?break|sabbatical)\b", t):
        return "returner"
    if re.search(r"\b(stagnant|support|customer.?care|bpo|no.?growth|call.?centre)\b", t):
        return "stagnant"
    return "detecting"


# ─────────────────────────────────────────────────────────────────────────────
# Rule-based extraction helpers (Hinglish + English, word-boundary regex)
# ─────────────────────────────────────────────────────────────────────────────

def _rule_extract_current_role(msg: str) -> str | None:
    """Word-boundary patterns for current role in English + Hinglish."""
    patterns = [
        # English: "I am a/an X", "worked as X", "working as X", "I work as X"
        r"(?:i\s+am\s+a(?:n)?\s+|worked?\s+as\s+|working\s+as\s+|i\s+work\s+as\s+|role\s+(?:is|of)\s+)([\w\s/]+?)(?:\s+in\b|\s+at\b|,|\.|$)",
        # Hinglish: "main X hun/karta hun/karti hun"
        r"\bmain\s+([\w\s]+?)\s+(?:hun|karta\s+hun|karti\s+hun|karta|karti|hoon)\b",
        # Hinglish: "mera kaam X hai"
        r"\bmera\s+kaam\s+([\w\s]+?)\s+(?:hai|he)\b",
        # "delivery karta hun" — occupation verb form
        r"\b([\w]+)\s+karta\s+hun\b",
    ]
    for pat in patterns:
        m = re.search(pat, msg, re.I)
        if m:
            role = m.group(1).strip().strip(",.")
            # Filter out noise
            if role and len(role) > 2 and not any(
                w in role.lower() for w in ["naam", "name", "lucknow", "pune", "delhi", "mumbai"]
            ):
                return role.title()
    return None


def _rule_extract_city(msg: str) -> str | None:
    for city in _CITIES:
        if re.search(r"\b" + re.escape(city) + r"\b", msg, re.I):
            return _CITY_NORM.get(city, city)
    # Hinglish: "X me kaam" / "X mein"
    m = re.search(r"\b([\w]+)\s+me(?:in)?\s+(?:kaam|rehta|rehti|hun|hoon|karta)", msg, re.I)
    if m:
        candidate = m.group(1).strip().title()
        for city in _CITIES:
            if city.lower() == candidate.lower():
                return _CITY_NORM.get(city, city)
    return None


def _rule_extract_skills(msg: str, existing: list[str]) -> list[str]:
    # Split on commas / slashes / semicolons / "and"
    items = re.split(r"[,/|;]|\band\b", msg, flags=re.I)
    skills = []
    noise = {
        "i", "am", "a", "an", "the", "in", "at", "my", "me", "is", "are",
        "was", "were", "will", "have", "has", "had", "this", "that",
        "skip", "yes", "no", "hi", "hello", "hey",
        # Hinglish noise
        "mera", "naam", "main", "hun", "karta", "karti", "hoon", "hai", "me", "mein",
    }
    for item in items:
        token = item.strip().strip(".,!?")
        if (
            token
            and len(token) > 1
            and token.lower() not in noise
            and not any(char.isdigit() for char in token)
        ):
            skills.append(token.title())
    merged = list(dict.fromkeys(existing + skills))
    return merged


def _rule_extract_gap_from_dates(msg: str) -> float | None:
    """Extract career gap from date ranges like '2020-2024' or 'Career break 2020-2024'."""
    # Explicit gap mention: "X year gap/break"
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?|yr)?\s*(?:career\s*)?(?:gap|break)", msg, re.I)
    if m:
        try:
            return float(m.group(1))
        except ValueError:
            pass
    # Date range: YYYY-YYYY or YYYY – YYYY (gap period)
    m = re.search(r"\b(20\d{2})\s*[-–—]\s*(20\d{2})\b", msg)
    if m:
        try:
            start, end = int(m.group(1)), int(m.group(2))
            if end > start:
                return float(end - start)
        except ValueError:
            pass
    return None


def _rule_extract_experience(msg: str) -> int | None:
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:\+\s*)?(?:years?|yrs?|yr)\s*(?:of\s+)?(?:exp(?:erience)?)?", msg, re.I)
    if m:
        try:
            return int(float(m.group(1)))
        except ValueError:
            pass
    return None


def _rule_extract_name(msg: str) -> str | None:
    """
    Extract name ONLY from explicit 'my name is X' patterns.
    Does NOT treat bare words as names (prevents 'Rohit' as a greeting being caught).
    """
    patterns = [
        # English
        r"\bmy\s+name\s+is\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)\b",
        r"\bI\s+am\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b",
        r"\bthis\s+is\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)\b",
        # Hinglish: "mera naam [hai] <Name> [hai]"
        r"\bmera\s+naam\s+(?:hai\s+|he\s+)?([A-Za-z]+(?:\s+[A-Za-z]+)?)\b",
        r"\bmain\s+([A-Z][a-z]+)\s+(?:hun|hoon|hai)\b",
    ]
    for pat in patterns:
        m = re.search(pat, msg, re.I)
        if m:
            name = m.group(1).strip()
            # Strip trailing Hinglish words if captured (e.g. "hai", "he", "hun", "hoon")
            words = [w for w in name.split() if w.lower() not in {"hai", "he", "hun", "hoon"}]
            if not words:
                continue
            name = " ".join(words)
            if (
                len(name.split()) <= 4
                and not any(w in name.lower() for w in [
                    "delivery", "developer", "engineer", "student", "working", "karta",
                    "going", "trying", "looking", "skip", "proceed", "confirm",
                ])
            ):
                return name.title()
    return None


# ─────────────────────────────────────────────────────────────────────────────
# Slot definitions and question templates
# ─────────────────────────────────────────────────────────────────────────────

_SLOT_QUESTIONS_EN = {
    "current_role": (
        "Welcome! To build your AI career intelligence, what is your **current or most recent role**?"
    ),
    "skills": (
        "Great! What are your **top skills** (list at least 3 — e.g. Python, Selenium, MS Excel)?"
    ),
    "target_role": (
        "What **target role or career direction** are you aiming for next?"
    ),
    "city": (
        "Which **city** are you based in (or targeting for work)?"
    ),
    "career_gap": (
        "Have you had any **career break or gap**? If yes, roughly how long? (You can Skip this.)"
    ),
    "expected_salary": (
        "What is your **expected salary** (LPA)? (Optional — you can Skip this.)"
    ),
}

_SLOT_QUESTIONS_HI = {
    "current_role": (
        "Namaste! Aapka **abhi ka ya pichla role** kya hai?"
    ),
    "skills": (
        "Bahut achha! Aapki **top skills** kya hain? (Kam se kam 3 batayein — jaise Python, Excel, Testing)"
    ),
    "target_role": (
        "Aap **kaunsa role** paana chahte hain aage?"
    ),
    "city": (
        "Aap kis **shehar** mein hain ya kaam karna chahte hain?"
    ),
    "career_gap": (
        "Kya aapne koi **career break** liya hai? Kitne saal ka? (Skip kar sakte hain.)"
    ),
    "expected_salary": (
        "Aapki **expected salary** (LPA mein) kya hai? (Optional — Skip kar sakte hain.)"
    ),
}

_QUICK_REPLIES: dict[str, list[str]] = {
    "current_role": [
        "Software Engineer",
        "Delivery Partner",
        "Manual QA Tester",
        "Customer Support Executive",
        "Final Year Student",
    ],
    "skills": [
        "Java, Spring Boot, MySQL, REST APIs",
        "Manual Testing, JIRA, SQL, Selenium",
        "Python, Data Analysis, Excel, SQL",
        "Customer Service, CRM, Excel, Communication",
    ],
    "target_role": [
        "GenAI Engineer",
        "Automation QA / SDET",
        "Data Analyst",
        "Full Stack Developer",
        "Logistics Tech Analyst",
    ],
    "city": [
        "Bengaluru",
        "Pune",
        "Noida",
        "Lucknow",
        "Mumbai",
    ],
    "career_gap": ["No gap", "1-2 years", "3-4 years", "Skip"],
    "expected_salary": ["Skip", "6 LPA", "10 LPA", "15 LPA"],
}


def _detect_lang(msg: str) -> str:
    """Heuristic: if message has Devanagari or common Hinglish tokens → 'hi', else 'en'."""
    if re.search(r"[\u0900-\u097F]", msg):
        return "hi"
    hinglish_tokens = r"\b(mera|naam|main|hun|karta|karti|hoon|hai|banna|chahta|chahti|me\s+kaam|kya|aap|mujhe|mein)\b"
    if re.search(hinglish_tokens, msg, re.I):
        return "hi"
    return "en"


def _slot_question(slot: str, lang: str) -> str:
    if lang == "hi":
        return _SLOT_QUESTIONS_HI.get(slot, _SLOT_QUESTIONS_EN[slot])
    return _SLOT_QUESTIONS_EN[slot]


# ─────────────────────────────────────────────────────────────────────────────
# Draft completeness helpers
# ─────────────────────────────────────────────────────────────────────────────

def _draft_missing(draft: dict) -> list[str]:
    """Returns list of required slots that are not yet filled."""
    missing = []
    if not draft.get("current_role"):
        missing.append("current_role")
    skills = draft.get("skills_raw", [])
    if not skills or len(skills) < 1:
        missing.append("skills")
    if not draft.get("target_role"):
        missing.append("target_role")
    if not draft.get("city"):
        missing.append("city")
    return missing


def _all_required_filled(draft: dict) -> bool:
    return len(_draft_missing(draft)) == 0


def _next_required_slot(draft: dict) -> str | None:
    for slot in REQUIRED_SLOTS:
        key = "skills_raw" if slot == "skills" else slot
        if slot == "skills":
            if not draft.get("skills_raw"):
                return "skills"
        elif not draft.get(slot):
            return slot
    return None


# ─────────────────────────────────────────────────────────────────────────────
# DB helpers
# ─────────────────────────────────────────────────────────────────────────────

async def _load_session(db: AsyncSession, user_id: str) -> OnboardingSession:
    result = await db.execute(
        select(OnboardingSession).where(OnboardingSession.user_id == user_id)
    )
    row = result.scalars().first()
    if row is None:
        row = OnboardingSession(
            user_id=user_id,
            profile_draft={},
            current_slot="current_role",
            segment="detecting",
            done=False,
            history=[],
        )
        db.add(row)
        await db.flush()
    return row


async def _save_session(db: AsyncSession, row: OnboardingSession) -> None:
    await db.commit()


def _append_history(row: OnboardingSession, role: str, content: str) -> None:
    history = list(row.history or [])
    history.append({"role": role, "content": content})
    row.history = history[-12:]  # keep last 12 turns (6 pairs)


# ─────────────────────────────────────────────────────────────────────────────
# LLM extraction (optional enrichment only; does NOT control done)
# ─────────────────────────────────────────────────────────────────────────────

async def _llm_extract(
    user_msg: str,
    draft: dict,
    history: list,
    current_slot: str,
) -> _LLMExtract | None:
    """
    Ask the LLM to extract fields and phrase a reply.
    Returns validated _LLMExtract or None on failure / timeout.
    Never lets LLM set done — that is code's responsibility.
    """
    hist_text = "\n".join(
        f"{h['role'].upper()}: {h['content']}" for h in history[-6:]
    )
    prompt = (
        "You are Punarshuru, an AI career onboarding assistant for Indian professionals.\n"
        "TASK: Extract career info from the user message and phrase a SHORT encouraging reply.\n"
        "LANGUAGE RULE: Reply in the SAME language/dialect as the user (English, Hindi, or Hinglish).\n"
        f"Conversation so far:\n{hist_text}\n\n"
        f"Current profile draft: {json.dumps(draft, ensure_ascii=False)}\n"
        f"We are currently collecting: {current_slot}\n"
        f"User message: \"{user_msg}\"\n\n"
        "Respond ONLY with JSON (no markdown fences). Schema:\n"
        "{\n"
        '  "reply": "<brief friendly reply in user language>",\n'
        '  "quick_replies": ["<3-4 short options>"],\n'
        '  "current_role": "<string or null>",\n'
        '  "skills": ["<skill1>", "<skill2>"] or null,\n'
        '  "target_role": "<string or null>",\n'
        '  "city": "<string or null>",\n'
        '  "experience_years": <int or null>,\n'
        '  "career_gap_years": <float or null>,\n'
        '  "expected_salary_lpa": <float or null>,\n'
        '  "segment": "<returner|gig|laid_off|stagnant|student or null>"\n'
        "}\n"
        "Rules:\n"
        "- Extract ONLY what the user actually stated. Null for unknown.\n"
        "- Do NOT invent name, city, or target_role.\n"
        "- Do NOT include a 'done' field — only code controls done.\n"
        "- quick_replies: generic examples only, no persona/brand names.\n"
    )
    try:
        raw = await complete(prompt, json=True)
        if not isinstance(raw, dict) or not raw.get("reply"):
            return None
        return _LLMExtract.model_validate(raw)
    except (ValidationError, Exception) as exc:
        logger.warning("LLM extraction failed: %s", exc)
        return None


# ─────────────────────────────────────────────────────────────────────────────
# Apply extractions to draft
# ─────────────────────────────────────────────────────────────────────────────

def _apply_to_draft(draft: dict, ext: _LLMExtract | None, rule: dict) -> None:
    """Merge rule-based extractions first, then LLM (LLM wins on non-empty)."""

    def _set(key: str, val: Any) -> None:
        if val is not None and val != "" and val != []:
            draft[key] = val

    # Rule-based wins for city/role to prevent hallucination
    _set("current_role", rule.get("current_role"))
    _set("city", rule.get("city"))
    _set("target_role", rule.get("target_role"))
    if rule.get("experience_years") is not None:
        draft["experience_years"] = rule["experience_years"]
    if rule.get("career_gap_years") is not None:
        draft["career_gap_years"] = rule["career_gap_years"]
    if rule.get("skills"):
        draft["skills_raw"] = list(dict.fromkeys(
            draft.get("skills_raw", []) + rule["skills"]
        ))

    if ext is None:
        return

    # LLM supplements only what rules missed
    if ext.current_role and not draft.get("current_role"):
        draft["current_role"] = ext.current_role
    if ext.target_role and not draft.get("target_role"):
        draft["target_role"] = ext.target_role
    if ext.city and not draft.get("city"):
        norm = _CITY_NORM.get(ext.city, ext.city)
        draft["city"] = norm
    if ext.experience_years is not None and draft.get("experience_years", 0) == 0:
        draft["experience_years"] = ext.experience_years
    if ext.career_gap_years is not None and not draft.get("career_gap_years"):
        draft["career_gap_years"] = ext.career_gap_years
    if ext.skills:
        draft["skills_raw"] = list(dict.fromkeys(
            draft.get("skills_raw", []) + ext.skills
        ))
    if ext.expected_salary_lpa is not None:
        draft["expected_salary_lpa"] = ext.expected_salary_lpa


def _apply_rule_extractions(msg: str, draft: dict) -> dict:
    """Pure rule-based extraction — no LLM. Returns dict of extracted values."""
    extracted: dict = {}
    r = _rule_extract_current_role(msg)
    if r:
        extracted["current_role"] = r
    c = _rule_extract_city(msg)
    if c:
        extracted["city"] = c
    # Skills: always try
    merged = _rule_extract_skills(msg, draft.get("skills_raw", []))
    if len(merged) > len(draft.get("skills_raw", [])):
        extracted["skills"] = [s for s in merged if s not in draft.get("skills_raw", [])]
    exp = _rule_extract_experience(msg)
    if exp is not None:
        extracted["experience_years"] = exp
    gap = _rule_extract_gap_from_dates(msg)
    if gap is not None:
        extracted["career_gap_years"] = gap
    # Target role: word-boundary check against known roles
    _known_targets = [
        "GenAI Engineer", "Automation QA", "SDET", "Data Analyst", "ML Engineer",
        "Full Stack Developer", "DevOps Engineer", "Logistics Tech Analyst",
        "AI Chatbot Trainer", "Product Analyst", "Software Engineer",
        "Backend Developer", "Frontend Developer",
    ]
    for tr in _known_targets:
        if re.search(r"\b" + re.escape(tr) + r"\b", msg, re.I):
            extracted["target_role"] = tr
            break
    return extracted


# ─────────────────────────────────────────────────────────────────────────────
# Determine current slot after draft update
# ─────────────────────────────────────────────────────────────────────────────

def _advance_slot(draft: dict, current_slot: str, skip: bool) -> str:
    """
    Returns the next slot to ask.
    'skip' only advances past the current OPTIONAL slot.
    """
    # If we're on an optional slot and user said skip → move to next optional or done
    if skip and current_slot in OPTIONAL_SLOTS:
        idx = OPTIONAL_SLOTS.index(current_slot)
        if idx + 1 < len(OPTIONAL_SLOTS):
            return OPTIONAL_SLOTS[idx + 1]
        return "done"

    # Check required slots first
    next_req = _next_required_slot(draft)
    if next_req:
        return next_req

    # All required filled — move to optional slots based on experience
    exp = draft.get("experience_years", 0)
    if exp and exp > 0:
        # Only ask career_gap if not already filled
        if draft.get("career_gap_years") is None and current_slot not in OPTIONAL_SLOTS:
            return "career_gap"
        if current_slot == "career_gap":
            return "expected_salary"
        if current_slot == "expected_salary":
            return "done"

    return "done"


# ─────────────────────────────────────────────────────────────────────────────
# Build reply when LLM fails (deterministic)
# ─────────────────────────────────────────────────────────────────────────────

def _rule_reply(slot: str, draft: dict, lang: str) -> tuple[str, list[str]]:
    """Returns (reply_text, quick_replies) for the given slot."""
    name_part = draft.get("name") or ""
    greeting = f", {name_part.split()[0]}" if name_part else ""

    if slot == "done":
        reply = (
            f"All set{greeting}! Review your profile card and tap **Confirm** when ready."
            if lang == "en"
            else f"Sab ho gaya{greeting}! Profile card check karein aur **Confirm** dabayein."
        )
        return reply, ["Confirm"]

    question = _slot_question(slot, lang)
    if slot == "current_role" and lang == "en":
        question = f"Welcome! " + question
    elif slot == "current_role" and lang == "hi":
        question = f"Namaste! " + question
    elif slot == "skills":
        question = f"Got it{greeting}. " + question if lang == "en" else f"Theek hai{greeting}. " + question

    return question, _QUICK_REPLIES.get(slot, ["Continue", "Skip"])


# ─────────────────────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────────────────────

async def handle_onboarding_chat(
    *,
    user: User,
    db: AsyncSession,
    message: str = "",
    resume_text: str | None = None,
    action: str | None = None,
) -> OnboardingChatResponse:
    """
    Unified onboarding chat handler (Agent v2 spec).
    - user: authenticated User object (name + email pre-filled, never asked)
    - db: async DB session for session persistence
    - message: user's text input
    - resume_text: optional resume pasted/uploaded
    - action: 'confirm' sets done=True when all required slots filled; no text-matching
    """
    row = await _load_session(db, user.id)
    draft: dict = dict(row.profile_draft) if row.profile_draft else {}

    # Pre-fill name + email from auth user (never ask)
    draft.setdefault("name", user.name)
    draft.setdefault("email", user.email)

    lang = _detect_lang(message)

    # ── 1. Confirm action (only code sets done) ───────────────────────────────
    if action == "confirm":
        if _all_required_filled(draft):
            final_segment = row.segment
            if final_segment in ("detecting", "", None):
                if draft.get("career_gap_years", 0.0) >= 0.5:
                    final_segment = "returner"
                elif draft.get("experience_years", 0) <= 1:
                    final_segment = "student"
                else:
                    final_segment = "stagnant"
            draft["user_type"] = final_segment
            row.segment = final_segment
            row.profile_draft = draft
            row.done = True
            row.current_slot = "done"
            _append_history(row, "user", "[CONFIRM]")
            reply_text = (
                f"Profile confirmed! Welcome aboard, {draft['name'].split()[0]}. "
                "Generating your Career Risk Score and roadmap now."
            )
            _append_history(row, "assistant", reply_text)
            await _save_session(db, row)
            return OnboardingChatResponse(
                reply=reply_text,
                quick_replies=["Go to Home"],
                profile_draft=draft,
                missing_fields=[],
                segment=final_segment,
                done=True,
            )
        else:
            missing = _draft_missing(draft)
            reply_text = (
                f"Almost there! Please provide: **{', '.join(missing)}** before confirming."
            )
            return OnboardingChatResponse(
                reply=reply_text,
                quick_replies=["Continue"],
                profile_draft=draft,
                missing_fields=missing,
                segment=row.segment,
                done=False,
            )

    # ── 2. Resume processing ──────────────────────────────────────────────────
    if resume_text and len(resume_text.strip()) > 15:
        parsed = await parse_resume_text(resume_text)
        # Never invent: only apply if resume actually extracted them
        if parsed.name and parsed.name not in ("Candidate", ""):
            draft["name"] = parsed.name  # override from resume if present
        if parsed.email:
            draft["email"] = parsed.email
        # city: do NOT default — leave empty if not found so agent asks
        if parsed.city and parsed.city != "Bengaluru":
            draft["city"] = parsed.city
        # current_role: do NOT default to "Software Professional"
        if parsed.current_role and parsed.current_role != "Software Professional":
            draft["current_role"] = parsed.current_role
        if parsed.target_role:
            draft["target_role"] = parsed.target_role
        if parsed.experience_years:
            draft["experience_years"] = parsed.experience_years
        if parsed.career_gap_years:
            draft["career_gap_years"] = parsed.career_gap_years
        if parsed.skills:
            draft["skills_raw"] = list(dict.fromkeys(
                draft.get("skills_raw", []) + parsed.skills
            ))

        # Also try date-range gap extraction from raw text
        date_gap = _rule_extract_gap_from_dates(resume_text)
        if date_gap and not draft.get("career_gap_years"):
            draft["career_gap_years"] = date_gap

        new_segment = _classify_segment(
            resume_text, draft.get("current_role", ""), draft.get("career_gap_years", 0.0)
        )
        if new_segment != "detecting" or row.segment in ("detecting", "", None):
            row.segment = new_segment
            draft["user_type"] = new_segment

        missing = _draft_missing(draft)
        next_slot = _next_required_slot(draft) or "career_gap"
        row.current_slot = next_slot
        row.profile_draft = draft

        skill_names = draft.get("skills_raw", [])
        skill_preview = ", ".join(skill_names[:4]) if skill_names else "no skills yet"
        reply_text = (
            f"I've analysed your resume. Found {len(skill_names)} skills including {skill_preview}. "
        )
        if missing:
            reply_text += _slot_question(next_slot, "en")
        else:
            reply_text += "Everything looks good — check your profile card and confirm when ready."

        _append_history(row, "user", "[RESUME]")
        _append_history(row, "assistant", reply_text)
        await _save_session(db, row)
        return OnboardingChatResponse(
            reply=reply_text,
            quick_replies=_QUICK_REPLIES.get(next_slot, ["Continue", "Skip"]),
            profile_draft=draft,
            missing_fields=missing,
            segment=row.segment,
            done=False,
        )

    # ── 3. Text turn ──────────────────────────────────────────────────────────
    _append_history(row, "user", message)

    # Skip detection: word-boundary "skip" — skips CURRENT optional slot only
    is_skip = bool(re.search(r"\bskip\b", message, re.I))

    # Rule-based extractions (deterministic, no LLM)
    rule_ext = _apply_rule_extractions(message, draft)

    # Try LLM extraction (enrichment only)
    llm_ext: _LLMExtract | None = None
    try:
        llm_ext = await _llm_extract(
            user_msg=message,
            draft=draft,
            history=list(row.history),
            current_slot=row.current_slot,
        )
    except Exception as exc:
        logger.warning("LLM call error: %s", exc)

    # Merge extractions into draft
    _apply_to_draft(draft, llm_ext, rule_ext)

    # Re-classify segment
    new_seg = _classify_segment(
        f"{message} {draft.get('current_role', '')}",
        draft.get("current_role", ""),
        draft.get("career_gap_years", 0.0),
    )
    if new_seg != "detecting" or row.segment in ("detecting", "", None):
        row.segment = new_seg
        draft["user_type"] = new_seg

    # Determine next slot
    row.current_slot = _advance_slot(draft, row.current_slot, is_skip)
    row.profile_draft = draft
    missing = _draft_missing(draft)

    # Build reply
    if llm_ext and llm_ext.reply:
        reply_text = llm_ext.reply
        qr = llm_ext.quick_replies or _QUICK_REPLIES.get(row.current_slot, ["Continue"])
    else:
        reply_text, qr = _rule_reply(row.current_slot, draft, lang)

    # If all required filled + next_slot == "done", prompt for confirm
    if row.current_slot == "done" and _all_required_filled(draft):
        if lang == "hi":
            confirm_hint = " Sab theek hai to **Confirm** ka button dabaiye."
        else:
            confirm_hint = " All set — tap **Confirm** to generate your roadmap."
        if confirm_hint not in reply_text:
            reply_text += confirm_hint
        if "Confirm" not in qr:
            qr = ["Confirm"] + [r for r in qr if r != "Confirm"][:2]

    _append_history(row, "assistant", reply_text)
    await _save_session(db, row)

    return OnboardingChatResponse(
        reply=reply_text,
        quick_replies=qr,
        profile_draft=draft,
        missing_fields=missing,
        segment=row.segment,
        done=False,  # done is ONLY set via action:"confirm"
    )


async def get_session_state(*, user: User, db: AsyncSession) -> dict:
    """Retrieve the current onboarding session state for the authenticated user."""
    row = await _load_session(db, user.id)
    draft = dict(row.profile_draft) if row.profile_draft else {}
    draft.setdefault("name", user.name)
    draft.setdefault("email", user.email)
    return {
        "user_id": user.id,
        "profile_draft": draft,
        "current_slot": row.current_slot,
        "segment": row.segment,
        "done": row.done,
        "history": list(row.history or []),
    }

