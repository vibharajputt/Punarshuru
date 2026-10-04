"""
Punarshuru onboarding engine (deterministic slot-filling).

Pure logic, no DB / HTTP / LLM. The router keeps `state` (a JSON-serialisable dict)
in the session store and calls:

    state = new_state(name, email)
    state = apply_resume(state, parsed_resume_dict)      # after resume upload
    state = handle_message(state, user_message)          # every chat turn
    out   = build_response(state)                        # -> reply, quick_replies, profile_draft, ...

Rules:
- The answer to the question just asked ALWAYS fills that slot (pending_slot).
- Skills only come from the skills question or the resume, and must match the taxonomy.
- Never asks the same slot more than twice; second time accepts the raw answer.
- Name/email come from the logged-in user, never asked.
- Replies in English, Hindi or Hinglish based on the user's last message.
"""

from __future__ import annotations

import json
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

from rapidfuzz import fuzz, process

TAXONOMY_PATH = Path(__file__).resolve().parent.parent / "data" / "skills_taxonomy.json"

REQUIRED_SLOTS = ["current_role", "skills", "target_role", "city"]
MIN_SKILLS = 3
MAX_ASKS_PER_SLOT = 2

CITIES = [
    "Bengaluru", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Delhi", "New Delhi", "Noida",
    "Gurugram", "Gurgaon", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Indore",
    "Kochi", "Mohali", "Chandigarh", "Bhopal", "Nagpur", "Patna", "Surat", "Coimbatore",
    "Ludhiana", "Dehradun", "Remote",
]
CITY_ALIASES = {"bangalore": "Bengaluru", "gurgaon": "Gurugram", "new delhi": "Delhi"}

HINGLISH_WORDS = {
    "mera", "meri", "main", "mai", "hun", "hoon", "hai", "hain", "karta", "karti", "kar",
    "chahiye", "banna", "bnna", "chahta", "chahti", "naam", "kaam", "nahi", "nhi", "haan",
    "me", "mein", "abhi", "pehle", "saal", "koi", "kya", "tha", "thi", "bhi", "kuch", "liya",
}
SKIP_WORDS = {"skip", "no", "none", "nahi", "nhi", "na", "no gap", "no break", "koi nahi", "0"}
LAID_OFF_RE = re.compile(r"\b(laid\s*off|layoff|lay\s*off|fired|downsized|job\s*(chali|gayi|gai)|nikal\s*diya)\b", re.I)
FILENAME_RE = re.compile(r"\.(pdf|docx?|txt)\b", re.I)


# ── taxonomy ──────────────────────────────────────────────────────────────────

@lru_cache(maxsize=1)
def _skill_index() -> dict[str, str]:
    """lower-case name/alias -> canonical skill name"""
    data = json.loads(TAXONOMY_PATH.read_text(encoding="utf-8"))
    idx: dict[str, str] = {}
    for s in data:
        idx[s["name"].lower()] = s["name"]
        for a in s.get("aliases", []) or []:
            idx[str(a).lower()] = s["name"]
    return idx


def match_skill(text: str, threshold: int = 85) -> str | None:
    t = text.strip().lower()
    if len(t) < 1 or FILENAME_RE.search(t):
        return None
    idx = _skill_index()
    if t in idx:
        return idx[t]
    if len(t) < 3:  # avoid "c" -> "css" style false matches
        return None
    hit = process.extractOne(t, list(idx.keys()), scorer=fuzz.ratio, score_cutoff=threshold)  # type: ignore
    return idx[hit[0]] if hit else None


def split_items(text: str) -> list[str]:
    parts = re.split(r",|/|\||;|\n|\band\b|\baur\b|&", text, flags=re.I)
    return [p.strip(" .-") for p in parts if p.strip(" .-")]


# ── language ──────────────────────────────────────────────────────────────────

def detect_lang(text: str) -> str:
    if re.search(r"[\u0900-\u097F]", text):
        return "hi"
    words = set(re.findall(r"[a-z]+", text.lower()))
    return "hinglish" if len(words & HINGLISH_WORDS) >= 2 else "en"


# ── normalisers ───────────────────────────────────────────────────────────────

_ROLE_PREFIX = re.compile(
    r"^(i\s*am\s*(a|an)?|i'm\s*(a|an)?|currently\s*(a|an)?|working\s*as\s*(a|an)?|worked\s*as\s*(a|an)?|"
    r"my\s*role\s*is|i\s*want\s*to\s*(be|become)\s*(a|an)?|i\s*want\s*(a|an)?|want\s*to\s*be\s*(a|an)?|"
    r"my\s*(goal|aim|target)\s*is\s*(to\s*be(come)?)?\s*(a|an)?|mujhe|main|mai|mera\s*role)\s+",
    re.I,
)
_ROLE_SUFFIX = re.compile(
    r"\s+(hun|hoon|hu|hai|tha|thi|ka\s*kaam\s*karta\s*hun|karta\s*hun|karti\s*hun|banna\s*hai|bnna\s*hai|"
    r"banna\s*chahta\s*hun|banna\s*chahti\s*hun)\.?$",
    re.I,
)


def find_city(text: str) -> str | None:
    low = text.lower()
    for alias, canon in CITY_ALIASES.items():
        if re.search(rf"\b{alias}\b", low):
            return canon
    for c in CITIES:
        if re.search(rf"\b{re.escape(c.lower())}\b", low):
            return c
    return None


def clean_role(text: str) -> str:
    t = text.strip().split(",")[0]
    t = LAID_OFF_RE.sub("", t)
    city = find_city(t)
    if city:
        names = [c for c in CITIES if c.lower() == city.lower()] + [a for a, c in CITY_ALIASES.items() if c == city]
        for n in names + [city]:
            t = re.sub(rf"\b(in|at|from)?\s*{re.escape(n)}\s*(me|mein|se)?\b", " ", t, flags=re.I)
    for _ in range(2):
        t = _ROLE_PREFIX.sub("", t).strip()
        t = _ROLE_SUFFIX.sub("", t).strip()
    t = re.sub(r"\s+", " ", t).strip(" .,!")
    return t.title() if t.islower() or t.isupper() else t


def parse_years(text: str) -> float | None:
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?|yr|saal|sal|y)\b", text, re.I)
    if m:
        return float(m.group(1))
    m = re.fullmatch(r"\s*(\d+(?:\.\d+)?)\s*", text)
    return float(m.group(1)) if m else None


# ── state ─────────────────────────────────────────────────────────────────────

def new_state(name: str = "", email: str = "") -> dict[str, Any]:
    return {
        "draft": {
            "name": name,
            "email": email,
            "current_role": "",
            "target_role": "",
            "city": "",
            "experience_years": 0,
            "career_gap_years": None,  # None = not answered yet
            "skills_raw": [],
            "laid_off": False,
            "user_type": "",
        },
        "pending_slot": None,
        "ask_counts": {},
        "lang": "en",
        "last_note": "",
        "done": False,
    }


def _add_skills(draft: dict[str, Any], items: list[str], allow_raw: bool = False) -> int:
    added = 0
    for it in items:
        canon = match_skill(it)
        if not canon and allow_raw and 1 < len(it) <= 30 and not FILENAME_RE.search(it):
            canon = it.title() if it.islower() else it
        if canon and canon not in draft["skills_raw"]:
            draft["skills_raw"].append(canon)
            added += 1
    return added


def apply_resume(state: dict[str, Any], parsed: dict[str, Any]) -> dict[str, Any]:
    """Merge parsed resume fields. Never invents missing values."""
    d = state["draft"]
    for key in ("current_role", "target_role", "city"):
        val = (parsed.get(key) or "").strip()
        if val and not d[key]:
            d[key] = val
    if parsed.get("experience_years"):
        d["experience_years"] = parsed["experience_years"]
    if parsed.get("career_gap_years") is not None:
        d["career_gap_years"] = parsed["career_gap_years"]
    _add_skills(d, [str(s) for s in parsed.get("skills") or []], allow_raw=True)
    state["last_note"] = f"resume:{len(d['skills_raw'])}"
    state["pending_slot"] = next_slot(state)
    _classify(state)
    return state


def next_slot(state: dict[str, Any]) -> str | None:
    d = state["draft"]
    for slot in REQUIRED_SLOTS:
        if slot == "skills":
            if len(d["skills_raw"]) < MIN_SKILLS:
                return slot
        elif not d[slot]:
            return slot
    if d["career_gap_years"] is None and state["ask_counts"].get("career_gap", 0) == 0:
        return "career_gap"
    return None


def _classify(state: dict[str, Any]) -> None:
    d = state["draft"]
    role = f"{d['current_role']}".lower()
    gap = d["career_gap_years"] or 0
    if re.search(r"\b(student|fresher|graduate|b\.?tech|final\s*year|college)\b", role):
        seg = "student"
    elif re.search(r"\b(delivery|driver|rider|gig|cab|courier|freelance)\b", role):
        seg = "gig"
    elif d["laid_off"]:
        seg = "laid_off"
    elif gap >= 0.5:
        seg = "returner"
    elif d["current_role"]:
        seg = "stagnant"
    else:
        seg = ""
    d["user_type"] = seg


def _fill(state: dict[str, Any], slot: str, msg: str) -> bool:
    """Fill `slot` from msg. Returns True if filled."""
    d = state["draft"]
    forced = state["ask_counts"].get(slot, 0) >= MAX_ASKS_PER_SLOT
    if slot != "career_gap" and msg.lower().strip() in SKIP_WORDS:
        return False

    if slot in ("current_role", "target_role"):
        city = find_city(msg)
        if city and not d["city"]:
            d["city"] = city
        role = clean_role(msg)
        if role and (len(role) <= 60 or forced):
            d[slot] = role[:60]
            return True
        return False

    if slot == "skills":
        _add_skills(d, split_items(msg), allow_raw=forced)
        return len(d["skills_raw"]) >= MIN_SKILLS

    if slot == "city":
        city = find_city(msg)
        if city:
            d["city"] = city
            return True
        if forced or len(msg.split()) <= 3:
            d["city"] = msg.strip().title()[:40]
            return True
        return False

    if slot == "career_gap":
        low = msg.lower().strip()
        if low in SKIP_WORDS or re.search(r"\b(no|nahi|nhi|koi nahi)\b.*\b(gap|break)\b", low):
            d["career_gap_years"] = 0.0
            return True
        yrs = parse_years(msg)
        if yrs is not None:
            d["career_gap_years"] = yrs
            return True
        if forced:
            d["career_gap_years"] = 0.0
            return True
        return False

    return False


def _opportunistic(state: dict[str, Any], msg: str) -> None:
    """Pick up extra info mentioned in passing (never skills)."""
    d = state["draft"]
    if not d["city"]:
        c = find_city(msg)
        if c:
            d["city"] = c
    if LAID_OFF_RE.search(msg):
        d["laid_off"] = True
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?|saal)\s*(?:of\s*)?(?:exp|experience|anubhav)", msg, re.I)
    if m:
        d["experience_years"] = float(m.group(1))
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?|saal)\s*(?:ka\s*)?(?:gap|break)", msg, re.I)
    if m:
        d["career_gap_years"] = float(m.group(1))


def handle_message(state: dict[str, Any], message: str) -> dict[str, Any]:
    msg = (message or "").strip()
    if not msg or msg.lower().startswith("uploaded resume") or FILENAME_RE.search(msg) and len(msg.split()) <= 4:
        state["pending_slot"] = next_slot(state)
        return state

    lang = detect_lang(msg)
    if lang != "en" or len(msg.split()) > 3:
        state["lang"] = lang
    slot = state["pending_slot"] or next_slot(state)

    _opportunistic(state, msg)
    filled = _fill(state, slot, msg) if slot else False
    state["last_note"] = "ok" if filled or not slot else f"retry:{slot}"
    if slot == "skills" and not filled and state["draft"]["skills_raw"]:
        state["last_note"] = "more:skills"

    _classify(state)
    state["pending_slot"] = next_slot(state)
    return state


def confirm(state: dict[str, Any]) -> dict[str, Any]:
    if is_complete(state):
        state["done"] = True
    return state


def is_complete(state: dict[str, Any]) -> bool:
    d = state["draft"]
    return bool(d["current_role"] and d["target_role"] and d["city"] and len(d["skills_raw"]) >= MIN_SKILLS)


def missing_fields(state: dict[str, Any]) -> list[str]:
    d = state["draft"]
    out = [s for s in ("current_role", "target_role", "city") if not d[s]]
    if len(d["skills_raw"]) < MIN_SKILLS:
        out.insert(1, "skills")
    return out


# ── copy ──────────────────────────────────────────────────────────────────────

Q = {
    "current_role": {
        "en": "What is your **current or most recent role**? (e.g. Java Developer, Delivery Partner, Student)",
        "hinglish": "Aap abhi **kya kaam karte ho** ya last job kya thi? (jaise Java Developer, Delivery Partner, Student)",
        "hi": "आप अभी **क्या काम करते हैं** या पिछली नौकरी क्या थी?",
    },
    "skills": {
        "en": "List **3 or more skills** you have, separated by commas.",
        "hinglish": "Apni **kam se kam 3 skills** comma laga ke likho.",
        "hi": "अपनी **कम से कम 3 स्किल्स** कॉमा लगाकर लिखें।",
    },
    "target_role": {
        "en": "Which **role do you want next**?",
        "hinglish": "Aage **kaunsa role** chahiye?",
        "hi": "आगे आप **कौन सा रोल** चाहते हैं?",
    },
    "city": {
        "en": "Which **city** do you want to work in? (or Remote)",
        "hinglish": "Kaunse **city** me kaam karna hai? (ya Remote)",
        "hi": "आप किस **शहर** में काम करना चाहते हैं? (या Remote)",
    },
    "career_gap": {
        "en": "Have you had a **career break**? If yes, how many years? (optional)",
        "hinglish": "Kya koi **career break** liya tha? Kitne saal? (optional)",
        "hi": "क्या आपने कोई **करियर ब्रेक** लिया था? कितने साल? (वैकल्पिक)",
    },
}
RETRY = {
    "en": "I couldn't catch that. ",
    "hinglish": "Samajh nahi aaya, ek baar aur. ",
    "hi": "समझ नहीं आया, एक बार फिर से। ",
}
SKILL_RETRY = {
    "en": "I couldn't match those to known skills. Try names like Python, Excel, Customer Service. ",
    "hinglish": "Ye skills match nahi hui. Python, Excel, Customer Service jaise naam likho. ",
    "hi": "ये स्किल्स मैच नहीं हुईं। Python, Excel जैसे नाम लिखें। ",
}
MORE_SKILLS = {
    "en": "Added: {have}. Please add **{need} more**. ",
    "hinglish": "Add ho gayi: {have}. **{need} aur** skills likho. ",
    "hi": "जोड़ दी गईं: {have}। **{need} और** स्किल्स लिखें। ",
}
DONE = {
    "en": "All set{n}! Check your profile on the right and tap **Confirm Profile**.",
    "hinglish": "Ho gaya{n}! Right side profile check karo aur **Confirm Profile** dabao.",
    "hi": "हो गया{n}! दाईं ओर प्रोफ़ाइल देखें और **Confirm Profile** दबाएँ।",
}
RESUME_OK = {
    "en": "Got your resume: found **{k} skills**. ",
    "hinglish": "Resume mil gaya: **{k} skills** mili. ",
    "hi": "रिज़्यूमे मिल गया: **{k} स्किल्स** मिलीं। ",
}
QUICK = {
    "current_role": ["Software Developer", "Delivery Partner", "Customer Support", "QA Tester", "Student"],
    "skills": [],
    "target_role": ["Data Analyst", "Full Stack Developer", "AI/ML Engineer", "Logistics Coordinator"],
    "city": ["Bengaluru", "Delhi", "Pune", "Mohali", "Remote"],
    "career_gap": ["No break", "1 year", "2 years", "3+ years", "Skip"],
}


def build_response(state: dict[str, Any]) -> dict[str, Any]:
    lang = state["lang"]
    slot = state["pending_slot"]
    note = state["last_note"]
    d = state["draft"]
    first = (d["name"] or "").split(" ")[0]

    prefix = ""
    if note.startswith("resume:"):
        prefix = RESUME_OK[lang].format(k=note.split(":")[1])
    elif note == "more:skills":
        n = len(d["skills_raw"])
        prefix = MORE_SKILLS[lang].format(have=", ".join(d["skills_raw"]), need=MIN_SKILLS - n)
    elif note.startswith("retry:"):
        prefix = SKILL_RETRY[lang] if note == "retry:skills" else RETRY[lang]

    if slot:
        state["ask_counts"][slot] = state["ask_counts"].get(slot, 0) + 1
        reply = prefix + Q[slot][lang]
        quick = QUICK[slot]
    else:
        reply = prefix + DONE[lang].format(n=f", {first}" if first else "")
        quick = []

    state["last_note"] = ""
    return {
        "reply": reply,
        "quick_replies": quick,
        "profile_draft": d,
        "missing_fields": missing_fields(state),
        "segment": d["user_type"] or "detecting",
        "can_confirm": is_complete(state),
        "done": state["done"],
    }