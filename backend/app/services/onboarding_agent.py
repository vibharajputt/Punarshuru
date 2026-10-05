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

from datetime import datetime
import difflib
import json
import logging
from pathlib import Path
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
    if re.search(r"\b(delivery|swiggy|zomato|uber|ola|gig|driver|courier|freelanc|logistics\s*operations)\b", t):
        return "gig"
    if re.search(r"\b(laid.?off|downsized|fired|retrench|let.?go|company\s*shut)\b", t):
        return "laid_off"
    if gap_years >= 0.5 or re.search(r"\b(maternity|career.?gap|career.?break|sabbatical|family\s*care)\b", t):
        return "returner"
    if re.search(r"\b(student|college|fresher|b\.?tech|graduate|final\s*year|intern)\b", t):
        return "student"
    if re.search(r"\b(stagnant|support|customer.?care|bpo|no.?growth|call.?centre)\b", t) or current_role:
        return "stagnant"
    return "detecting"


# ─────────────────────────────────────────────────────────────────────────────
# Rule-based extraction helpers (Hinglish + English, word-boundary regex)
# ─────────────────────────────────────────────────────────────────────────────
# Skills Taxonomy Loading & Fuzzy Matcher (fuzzy ratio >= 0.85)
# ─────────────────────────────────────────────────────────────────────────────

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _load_taxonomy_skills() -> list[dict]:
    p = DATA_DIR / "skills_taxonomy.json"
    if p.exists():
        try:
            with open(p, encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.warning("Failed to load skills_taxonomy.json: %s", e)
    return []


_TAXONOMY_DATA = _load_taxonomy_skills()
_TAXONOMY_MAP: dict[str, str] = {}
for _item in _TAXONOMY_DATA:
    _name = _item.get("name", "").strip()
    if not _name:
        continue
    _TAXONOMY_MAP[_name.lower()] = _name
    for _alias in _item.get("aliases", []):
        if _alias and str(_alias).strip():
            _TAXONOMY_MAP[str(_alias).strip().lower()] = _name

_KNOWN_ROLE_TERMS = {
    "student", "engineer", "developer", "tester", "partner", "executive",
    "manager", "lead", "architect", "intern", "fresher", "consultant", "analyst"
}

_FILENAME_EXTS = (".pdf", ".docx", ".doc", ".txt", ".rtf", ".odt")


def _fuzzy_match_taxonomy_skill(raw_token: str) -> str | None:
    """
    Match raw_token against skills taxonomy with fuzzy ratio >= 0.85 (85%).
    Never returns filenames, roles, sentences, or noise.
    """
    token = raw_token.strip().strip(".,;:|/()[]{}'\"“”‘’")
    if not token or len(token) < 2:
        return None

    t_lower = token.lower()

    # Reject filenames
    if any(t_lower.endswith(ext) for ext in _FILENAME_EXTS) or "/" in token or "\\" in token:
        return None
    if any(word in t_lower for word in ["resume", "uploaded", "curriculum", "attachment"]):
        return None

    # Reject sentences (> 4 words)
    words = token.split()
    if len(words) > 4:
        return None

    # Reject conversational sentence starters
    if any(starter in t_lower for starter in [
        "i am", "my role", "my name", "i have", "i work", "working as", "looking for",
        "i'm", "mera", "main", "mujhe", "karta"
    ]):
        return None

    # Reject pure role descriptions unless the term is explicitly in the taxonomy
    if any(r in t_lower for r in _KNOWN_ROLE_TERMS):
        if t_lower not in _TAXONOMY_MAP:
            return None

    # 1. Exact match against canonical name or alias (case-insensitive)
    if t_lower in _TAXONOMY_MAP:
        return _TAXONOMY_MAP[t_lower]

    # 2. Fuzzy match against canonical names and aliases (ratio >= 0.85)
    best_canonical = None
    best_ratio = 0.0

    for term, canonical in _TAXONOMY_MAP.items():
        if len(term) <= 3:
            if t_lower == term:
                return canonical
            continue

        if abs(len(t_lower) - len(term)) > 3:
            continue

        ratio = difflib.SequenceMatcher(None, t_lower, term).ratio()
        if ratio >= 0.85 and ratio > best_ratio:
            best_ratio = ratio
            best_canonical = canonical

    return best_canonical


def _extract_taxonomy_skills_from_text(msg: str) -> list[str]:
    """Extract skills matching taxonomy with fuzzy ratio >= 0.85. Never returns filenames, roles, sentences."""
    tokens = re.split(r"[,/|;•\n]|\band\b", msg, flags=re.I)
    results: list[str] = []
    for raw in tokens:
        clean = raw.strip()
        if not clean:
            continue
        skill = _fuzzy_match_taxonomy_skill(clean)
        if skill and skill not in results:
            results.append(skill)
    return results


def _normalize_current_role(msg: str) -> str | None:
    """Clean conversational phrasing from current role."""
    s = msg.strip().strip(".,!?:")
    if not s:
        return None
    # Remove leading conversational prefixes
    s = re.sub(
        r"^(?:i\s+am\s+(?:a(?:n)?\s+)?|i'm\s+(?:a(?:n)?\s+)?|working\s+as\s+(?:a(?:n)?\s+)?|worked\s+as\s+(?:a(?:n)?\s+)?|i\s+work\s+as\s+(?:a(?:n)?\s+)?|my\s+(?:current\s+)?role\s+(?:is|of)\s+|role\s*:\s*|main\s+|mera\s+(?:kaam|role)\s+(?:hai\s+|he\s+)?|mera\s+kaam\s+)",
        "",
        s,
        flags=re.I,
    ).strip()
    # Remove trailing Hinglish verbs
    s = re.sub(
        r"\s+(?:karta\s+hun|karti\s+hun|karta\s+hoon|karti\s+hoon|karta|karti|hun|hoon|hai|he)$",
        "",
        s,
        flags=re.I,
    ).strip()
    if not s or any(w in s.lower() for w in ["naam", "lucknow", "pune", "delhi", "mumbai"]):
        return None
    if s.lower() == "delivery":
        return "Delivery Partner"
    if s.lower() in ("student", "final year student", "college student"):
        return "Final Year Student"
    if len(s.split()) <= 5:
        return s.title()
    return None


def _normalize_target_role(msg: str) -> str | None:
    """Clean conversational phrasing from target role."""
    s = msg.strip().strip(".,!?:")
    if not s:
        return None
    s = re.sub(
        r"^(?:i\s+want\s+to\s+(?:be|become)\s+(?:a(?:n)?\s+)?|aiming\s+for\s+(?:a(?:n)?\s+)?|target\s+(?:role\s+)?(?:is\s+)?|looking\s+(?:for|to\s+become)\s+(?:a(?:n)?\s+)?|role\s*:\s*|mujhe\s+|main\s+)",
        "",
        s,
        flags=re.I,
    ).strip()
    s = re.sub(
        r"\s+(?:banna\s+chahta\s+hun|banna\s+chahti\s+hun|chahta\s+hun|chahti\s+hun|karna\s+hai)$",
        "",
        s,
        flags=re.I,
    ).strip()
    if not s:
        return None
    if len(s.split()) <= 5:
        return s.title()
    return None


def _normalize_city(msg: str) -> str | None:
    extracted = _rule_extract_city(msg)
    if extracted:
        return extracted
    cleaned = msg.strip().strip(".,!?:")
    cleaned = re.sub(r"^(?:in\s+|at\s+|based\s+in\s+|living\s+in\s+|mein\s+|me\s+)", "", cleaned, flags=re.I).strip()
    cleaned = re.sub(r"\s+(?:me|mein|se)\s*$", "", cleaned, flags=re.I).strip()
    if len(cleaned.split()) <= 2 and len(cleaned) >= 3 and not any(ch.isdigit() for ch in cleaned):
        return _CITY_NORM.get(cleaned.title(), cleaned.title())
    return None


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
            if role and len(role) > 2 and not any(
                w in role.lower() for w in ["naam", "name", "lucknow", "pune", "delhi", "mumbai"]
            ):
                if role.lower() == "delivery":
                    return "Delivery Partner"
                return role.title()
    return _normalize_current_role(msg)


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
    """Extract only items matching taxonomy with fuzzy ratio >= 0.85."""
    extracted = _extract_taxonomy_skills_from_text(msg)
    return list(dict.fromkeys(existing + extracted))


def _rule_extract_gap_from_dates(msg: str) -> float | None:
    """
    Extract career gap from date ranges like '2020-2024' or calendar years like '2023 tak', 'till 2023'.
    Calculates dynamic gap based on current system year (e.g. 2026 - 2023 = 3.0)!
    """
    current_year = datetime.now().year

    # Negative / no break
    if re.search(r"\b(no|none|zero|never|nahi|nhi|koi\s*nahi|continuous)\b", msg, re.I):
        return 0.0

    # Explicit gap mention: "X year gap/break"
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?|yr|saal)?\s*(?:career\s*)?(?:gap|break)", msg, re.I)
    if m:
        try:
            val = float(m.group(1))
            if val > 50:
                if 1980 <= val <= current_year:
                    return float(current_year - int(val))
            else:
                return val
        except ValueError:
            pass

    # Date range: YYYY-YYYY or YYYY – YYYY (gap period or work period)
    m = re.search(r"\b(20\d{2})\s*[-–—]\s*(20\d{2})\b", msg)
    if m:
        try:
            start, end = int(m.group(1)), int(m.group(2))
            if end > start:
                # If end is in the past (e.g. 2020 - 2023), post-work gap is current_year - 2023
                if end < current_year and not re.search(r"\b(present|current|now)\b", msg, re.I):
                    return float(current_year - end)
                return float(end - start)
        except ValueError:
            pass

    # Single calendar year: e.g. "2023 tak", "till 2023", "graduated in 2023", "2023 passout", "2023 se", "2023"
    cal_m = re.search(r"\b(19\d{2}|20\d{2})\b", msg)
    if cal_m:
        try:
            y = int(cal_m.group(1))
            if 1980 <= y <= current_year:
                if not re.search(r"\b(present|current|now|till\s*date|ongoing)\b", msg, re.I):
                    return float(current_year - y)
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
        "To build your AI career intelligence, what is your **current or most recent role**?"
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
        "Aapka **abhi ka ya pichla role** kya hai?"
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
    if not skills or len(skills) < 3:
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
        if slot == "skills":
            skills = draft.get("skills_raw", [])
            if not skills or len(skills) < 3:
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
    current_year = datetime.now().year
    prompt = (
        f"You are Punarshuru, an AI career onboarding assistant for Indian professionals. Current year is {current_year}.\n"
        "TASK: Extract career info from the user message, compute gaps relative to the current system year, categorize into the appropriate demo persona archetype, and phrase an encouraging reply tailored to their background.\n"
        "LANGUAGE RULE: Reply in the SAME language/dialect as the user (English, Hindi, or Hinglish).\n"
        f"CAREER GAP RULE: If user says their last job was in past year (e.g. 2023) or graduation was in 2023 without current work, compute career_gap_years = ({current_year} - past_year) (e.g. {current_year} - 2023 = 3.0), and set segment to 'returner'.\n"
        "PERSONA CATEGORIES (segment):\n"
        "- 'returner': Has career gap >= 0.5 yrs (maternity, sabbatical, last role in past year like 2023).\n"
        "- 'gig': Gig platform worker (Swiggy, Zomato, Uber, Ola, delivery partner, driver, courier).\n"
        "- 'laid_off': Laid-off, downsized, retrenched, company shutdown.\n"
        "- 'student': Student, fresher, final year, recent graduate with <= 1 year exp and no gap.\n"
        "- 'stagnant': Currently employed professional (1+ years experience, no gap) looking to switch.\n\n"
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

def _apply_to_draft(draft: dict, ext: _LLMExtract | None, rule: dict, pending_slot: str = "") -> None:
    """Merge rule-based extractions first, then LLM (LLM wins on non-empty)."""

    def _set(key: str, val: Any) -> None:
        if val is not None and val != "" and val != []:
            draft[key] = val

    _set("current_role", rule.get("current_role"))
    _set("city", rule.get("city"))
    _set("target_role", rule.get("target_role"))
    if rule.get("experience_years") is not None:
        draft["experience_years"] = rule["experience_years"]
    if rule.get("career_gap_years") is not None:
        draft["career_gap_years"] = rule["career_gap_years"]
    # Only merge skills if pending_slot == "skills"
    if rule.get("skills") and pending_slot == "skills":
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
    # Skills from LLM only if pending_slot == "skills", filtered through taxonomy
    if ext.skills and pending_slot == "skills":
        valid_llm_skills = []
        for s in ext.skills:
            matched = _fuzzy_match_taxonomy_skill(s)
            if matched and matched not in valid_llm_skills:
                valid_llm_skills.append(matched)
        if valid_llm_skills:
            draft["skills_raw"] = list(dict.fromkeys(
                draft.get("skills_raw", []) + valid_llm_skills
            ))
    if ext.expected_salary_lpa is not None:
        draft["expected_salary_lpa"] = ext.expected_salary_lpa


def _apply_rule_extractions(msg: str, draft: dict, pending_slot: str = "") -> dict:
    """Pure rule-based extraction — no LLM. Returns dict of extracted values."""
    extracted: dict = {}
    r = _rule_extract_current_role(msg)
    if r:
        extracted["current_role"] = r
    c = _rule_extract_city(msg)
    if c:
        extracted["city"] = c
    # Skills: ONLY if pending_slot == "skills"
    if pending_slot == "skills":
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
    if not extracted.get("target_role") and pending_slot == "target_role":
        tr_norm = _normalize_target_role(msg)
        if tr_norm:
            extracted["target_role"] = tr_norm
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
        question = "Welcome! " + question
    elif slot == "current_role" and lang == "hi":
        question = "Namaste! " + question
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
        if parsed.name and parsed.name not in ("Candidate", ""):
            draft["name"] = parsed.name
        if parsed.email:
            draft["email"] = parsed.email
        # city: extract if actually present in resume_text, never invent
        resume_city = _rule_extract_city(resume_text)
        if resume_city:
            draft["city"] = resume_city
        elif parsed.city and parsed.city != "Bengaluru":
            draft["city"] = _CITY_NORM.get(parsed.city, parsed.city)
        if parsed.current_role:
            draft["current_role"] = parsed.current_role
        if parsed.target_role:
            draft["target_role"] = parsed.target_role
        if parsed.experience_years:
            draft["experience_years"] = parsed.experience_years
        if parsed.career_gap_years:
            draft["career_gap_years"] = parsed.career_gap_years
        
        # Keep all parsed skills (validate through taxonomy)
        if parsed.skills:
            valid_resume_skills = []
            for s in parsed.skills:
                m = _fuzzy_match_taxonomy_skill(s)
                if m and m not in valid_resume_skills:
                    valid_resume_skills.append(m)
                elif not m and s and len(s) > 1 and s not in valid_resume_skills:
                    # Keep resume-extracted skill
                    valid_resume_skills.append(s)
            if valid_resume_skills:
                draft["skills_raw"] = list(dict.fromkeys(
                    draft.get("skills_raw", []) + valid_resume_skills
                ))

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

    pending_slot = row.current_slot or "current_role"
    slot_attempts = draft.setdefault("_slot_attempts", {})
    attempts = slot_attempts.get(pending_slot, 0)
    llm_ext: _LLMExtract | None = None

    # Skip detection: word-boundary "skip" — skips CURRENT optional slot only
    is_skip = bool(re.search(r"\bskip\b", message, re.I))

    if is_skip and pending_slot in OPTIONAL_SLOTS:
        slot_attempts[pending_slot] = 0
        row.current_slot = _advance_slot(draft, pending_slot, True)
    else:
        # Fills pending_slot directly (light normalization)
        if pending_slot == "current_role":
            role = _normalize_current_role(message)
            if role:
                draft["current_role"] = role
            elif attempts >= 1:
                raw_ans = message.strip().strip(".,!?")
                if raw_ans:
                    draft["current_role"] = raw_ans.title()

        elif pending_slot == "skills":
            matched_skills = _extract_taxonomy_skills_from_text(message)
            if matched_skills:
                existing = draft.get("skills_raw", [])
                draft["skills_raw"] = list(dict.fromkeys(existing + matched_skills))
            elif attempts >= 1:
                raw_tokens = [s.strip().title() for s in re.split(r"[,/|;]|\band\b", message) if s.strip() and len(s.strip()) > 1]
                if raw_tokens:
                    existing = draft.get("skills_raw", [])
                    draft["skills_raw"] = list(dict.fromkeys(existing + raw_tokens))

        elif pending_slot == "target_role":
            target = _normalize_target_role(message)
            if target:
                draft["target_role"] = target
            elif attempts >= 1:
                raw_ans = message.strip().strip(".,!?")
                if raw_ans:
                    draft["target_role"] = raw_ans.title()

        elif pending_slot == "city":
            city = _normalize_city(message)
            if city:
                draft["city"] = city
            elif attempts >= 1:
                raw_ans = message.strip().strip(".,!?")
                if raw_ans:
                    draft["city"] = raw_ans.title()

        elif pending_slot == "career_gap":
            gap = _rule_extract_gap_from_dates(message)
            if gap is not None:
                draft["career_gap_years"] = gap
            elif re.search(r"\b(no|none|zero|never|0)\b", message, re.I):
                draft["career_gap_years"] = 0.0
            elif attempts >= 1:
                draft["career_gap_years"] = 0.0

        elif pending_slot == "expected_salary":
            sal_matches = re.findall(r"(\d+(?:\.\d+)?)", message)
            if sal_matches:
                try:
                    draft["expected_salary_lpa"] = float(sal_matches[0])
                except ValueError:
                    pass
            elif attempts >= 1:
                draft["expected_salary_lpa"] = 0.0

        # Rule-based extractions for any additional fields in a compound message
        rule_ext = _apply_rule_extractions(message, draft, pending_slot=pending_slot)
        _apply_to_draft(draft, None, rule_ext, pending_slot=pending_slot)

        # Try LLM extraction (enrichment only)
        llm_ext: _LLMExtract | None = None
        try:
            llm_ext = await _llm_extract(
                user_msg=message,
                draft=draft,
                history=list(row.history),
                current_slot=pending_slot,
            )
            if llm_ext:
                _apply_to_draft(draft, llm_ext, {}, pending_slot=pending_slot)
        except Exception as exc:
            logger.warning("LLM call error: %s", exc)

        # Check if pending slot is now filled
        slot_filled = False
        if pending_slot == "skills":
            slot_filled = len(draft.get("skills_raw", [])) >= 3
        elif pending_slot in ("current_role", "target_role", "city"):
            slot_filled = bool(draft.get(pending_slot))
        elif pending_slot in ("career_gap", "expected_salary"):
            slot_filled = True

        if slot_filled:
            slot_attempts[pending_slot] = 0
        else:
            slot_attempts[pending_slot] = attempts + 1

        next_slot = _advance_slot(draft, pending_slot, is_skip)

        # Loop guard: never ask the same slot twice in a row; on second attempt accept raw answer
        if next_slot == pending_slot and slot_attempts.get(pending_slot, 0) >= 1:
            raw_val = message.strip().strip(".,!?").title() or "General"
            if pending_slot == "current_role":
                draft["current_role"] = raw_val
            elif pending_slot == "target_role":
                draft["target_role"] = raw_val
            elif pending_slot == "city":
                draft["city"] = raw_val
            elif pending_slot == "skills":
                cur_skills = draft.get("skills_raw", [])
                toks = [t.strip().title() for t in message.split(",") if t.strip()]
                for t in toks:
                    if t not in cur_skills:
                        cur_skills.append(t)
                draft["skills_raw"] = cur_skills
            slot_attempts[pending_slot] = 0
            next_slot = _advance_slot(draft, pending_slot, is_skip)

        row.current_slot = next_slot

    # Re-classify segment
    new_seg = _classify_segment(
        f"{message} {draft.get('current_role', '')}",
        draft.get("current_role", ""),
        draft.get("career_gap_years", 0.0),
    )
    if new_seg != "detecting" or row.segment in ("detecting", "", None):
        row.segment = new_seg
        draft["user_type"] = new_seg

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

