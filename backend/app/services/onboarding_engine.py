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

from datetime import datetime
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
    "Kochi", "Mohali", "Chandigarh", "Bhopal", "Nagpur", "Patna", "Surat", "Vadodara", "Coimbatore",
    "Visakhapatnam", "Thiruvananthapuram", "Bhubaneswar", "Dehradun", "Mysuru", "Kanpur", "Ranchi",
    "Ghaziabad", "Faridabad", "Ludhiana", "Amritsar", "Guwahati", "Varanasi", "Remote",
]
CITY_ALIASES = {
    "bangalore": "Bengaluru",
    "gurgaon": "Gurugram",
    "new delhi": "Delhi",
    "delhi ncr": "Delhi",
    "bombay": "Mumbai",
    "poona": "Pune",
    "calcutta": "Kolkata",
    "madras": "Chennai",
    "baroda": "Vadodara",
    "cochin": "Kochi",
    "vizag": "Visakhapatnam",
    "trivandrum": "Thiruvananthapuram",
    "mysore": "Mysuru",
}

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
    r"^(?:i\s*am\s*(?:currently\s*)?(?:a|an)?|i'm\s*(?:currently\s*)?(?:a|an)?|"
    r"currently\s*(?:working\s*as\s*(?:a|an)?|a|an)?|"
    r"(?:i\s*)?work\s*as\s*(?:a|an)?|working\s*as\s*(?:a|an)?|worked\s*as\s*(?:a|an)?|"
    r"as\s*(?:a|an)?|"
    r"i\s*have\s*been\s*(?:working\s*as\s*(?:a|an)?)?|"
    r"my\s*(?:current\s*)?(?:role|job|designation|title)\s*(?:is)?(?:\s*(?:a|an))?|"
    r"current\s*role\s*:?|role\s*:?|"
    r"i\s*want\s*to\s*(?:be|become)\s*(?:a|an)?|i\s*want\s*(?:a|an)?|want\s*to\s*be\s*(?:a|an)?|"
    r"my\s*(?:goal|aim|target)\s*is\s*(?:to\s*be(?:come)?)?\s*(?:a|an)?|mujhe|main|mai|mera\s*role(?:\s*hai)?)\s+",
    re.I,
)
_ROLE_SUFFIX = re.compile(
    r"\s+(hun|hoon|hu|hai|tha|thi|ka\s*kaam\s*karta\s*hun|karta\s*hun|karti\s*hun|banna\s*hai|bnna\s*hai|"
    r"banna\s*chahta\s*hun|banna\s*chahti\s*hun)\.?$",
    re.I,
)
_ROLE_TRAILING_EXP = re.compile(
    r"\s+\b(with|having|for|experiencing)\s+\d+(?:\.\d+)?\s*(?:\+)?\s*(?:years?|yrs?|yr|saal|sal)?\s*(?:of\s*)?(?:exp|experience|anubhav|work\s*experience)?\b.*$",
    re.I,
)
_ROLE_TRAILING_SKILLS = re.compile(
    r"\s+\b(with\s*skills\s*(?:in|like)?|skilled\s*in|skills\s*(?:in|like)?|having\s*skills\s*(?:in|like)?|proficient\s*in|expert\s*in|tools?\s*(?:in|like)?)\s+.*$",
    re.I,
)

COMMON_ROLE_NOUNS = {
    "engineer", "developer", "analyst", "consultant", "manager", "designer", "tester",
    "lead", "architect", "partner", "executive", "intern", "specialist", "technician",
    "officer", "scientist", "administrator", "associate", "operator", "mechanic",
    "driver", "teacher", "professor", "educator", "rider", "agent", "representative",
    "coordinator", "recruiter", "accountant", "auditor", "writer", "marketer", "director",
    "vp", "head", "freelancer", "fresher", "student", "trainee", "programmer", "coder",
    "sdet", "devops", "sysadmin", "dba", "sre"
}

ROLE_DECL_RE = re.compile(
    r"\b(?:i\s*am\s*(?:currently\s*)?(?:a|an)?|i'm\s*(?:currently\s*)?(?:a|an)?|"
    r"currently\s*(?:working\s*as\s*(?:a|an)?|a|an)?|"
    r"(?:i\s*)?work\s*as\s*(?:a|an)?|working\s*as\s*(?:a|an)?|worked\s*as\s*(?:a|an)?|"
    r"as\s*(?:a|an)?|"
    r"i\s*have\s*been\s*(?:working\s*as\s*(?:a|an)?)?|"
    r"my\s*(?:current\s*)?(?:role|job|designation|title)\s*(?:is)?(?:\s*(?:a|an))?|"
    r"main\s*(?:ek)?|mai\s*(?:ek)?|role\s*:|current\s*role\s*:)\s*"
    r"([a-zA-Z0-9\+\#\.\s\/\-\&]+?)"
    r"(?=(?:\s+\b(?:with|having|for|at|in|experiencing|holding|possessing|and|\baur\b|\,|\.|\;|\!)|\s*$))",
    re.I,
)

TARGET_ROLE_DECL_RE = re.compile(
    r"\b(?:i\s*want\s*to\s*(?:be|become)\s*(?:a|an)?|"
    r"want\s*to\s*be\s*(?:a|an)?|"
    r"target\s*(?:role|job|position)\s*(?:is)?\s*(?:a|an)?|"
    r"aiming\s*(?:for|to\s*be)\s*(?:a|an)?|"
    r"looking\s*for\s*(?:a|an)?|"
    r"interested\s*in\s*(?:a|an)?|"
    r"future\s*role\s*(?:is)?\s*(?:a|an)?|"
    r"dream\s*(?:role|job)\s*(?:is)?\s*(?:a|an)?|"
    r"banna\s*(?:chahta|chahti|hai)\s*(?:ek)?)\s*"
    r"([a-zA-Z0-9\+\#\.\s\/\-\&]+?)"
    r"(?=(?:\s+\b(?:with|having|for|at|in|and|\baur\b|\,|\.|\;|\!)|\s*$))",
    re.I,
)

ACRONYMS = {"qa", "sdet", "ai", "ml", "ui", "ux", "devops", "aws", "sre", "dba", "iot", "api", "rpa", "hld", "lld", "hr", "it", "bpo", "genai"}


def format_role_title(text: str) -> str:
    words = text.split()
    out = []
    for w in words:
        low = w.lower().strip(".,/-")
        if low in ACRONYMS:
            if low == "ui":
                out.append("UI")
            elif low == "ux":
                out.append("UX")
            elif low == "ai":
                out.append("AI")
            elif low == "ml":
                out.append("ML")
            elif low == "devops":
                out.append("DevOps")
            elif low == "iot":
                out.append("IoT")
            elif low == "genai":
                out.append("GenAI")
            else:
                out.append(low.upper())
        elif "/" in w:
            parts = [format_role_title(p) for p in w.split("/")]
            out.append("/".join(parts))
        else:
            out.append(w.capitalize())
    return " ".join(out)


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
    # Strip experience clauses first (e.g. "with 5 years experience")
    t = _ROLE_TRAILING_EXP.sub("", t).strip()
    # Strip skills clauses (e.g. "skilled in solidworks and autocad")
    t = _ROLE_TRAILING_SKILLS.sub("", t).strip()
    city = find_city(t)
    if city:
        names = [c for c in CITIES if c.lower() == city.lower()] + [a for a, c in CITY_ALIASES.items() if c == city]
        for n in names + [city]:
            t = re.sub(rf"\b(in|at|from)?\s*{re.escape(n)}\s*(me|mein|se)?\b", " ", t, flags=re.I)
    for _ in range(3):
        t = _ROLE_PREFIX.sub("", t).strip()
        t = _ROLE_SUFFIX.sub("", t).strip()
        t = re.sub(r"^(?:a|an)\s+", "", t, flags=re.I).strip()
    t = re.sub(r"\s+", " ", t).strip(" .,!")
    return format_role_title(t) if t else ""


def extract_roles_from_text(text: str) -> tuple[str | None, str | None]:
    """
    NLU role extraction: extracts (current_role, target_role) from unstructured message.
    """
    curr_role = None
    tgt_role = None

    # 1. Target role check
    tm = TARGET_ROLE_DECL_RE.search(text)
    if tm:
        cand = clean_role(tm.group(1))
        if cand and len(cand) >= 2 and len(cand.split()) <= 6:
            tgt_role = cand

    # 2. Current role explicit declaration check
    cm = ROLE_DECL_RE.search(text)
    if cm:
        cand = clean_role(cm.group(1))
        if cand and len(cand) >= 2 and len(cand.split()) <= 6:
            curr_role = cand

    # 3. If no explicit prefix matched, check if text head before experience/city is a role
    if not curr_role:
        cleaned = clean_role(text)
        words = [w.lower().strip(".,/-") for w in cleaned.split()]
        if any(w in COMMON_ROLE_NOUNS for w in words):
            if 1 <= len(cleaned.split()) <= 5:
                curr_role = cleaned

    return curr_role, tgt_role


def extract_skills_from_text(text: str) -> list[str]:
    """
    Extracts canonical skills from free text using taxonomy matching & explicit skill clauses.
    """
    idx = _skill_index()
    found: list[str] = []

    # 1. Check explicit skills clauses (e.g. "skills: python, sql", "in solidworks and autocad")
    m = re.search(
        r"\b(?:skills?\s*(?:are|is|include|like|in|such\s*as)?|"
        r"skilled\s*in|technologies|tools?|proficient\s*in|know|knowing|experience\s*in|"
        r"worked\s*on|working\s*on|hands-on\s*with)\s*[:\-]?\s*([^\.\n;!]+)",
        text,
        re.I,
    )
    if m:
        candidates = split_items(m.group(1))
        for cand in candidates:
            if re.search(r"\b\d+\s*(?:years?|yrs?|saal)\b", cand, re.I):
                continue
            c_skill = match_skill(cand)
            if c_skill and c_skill not in found:
                found.append(c_skill)
            elif 2 <= len(cand.strip()) <= 30 and not re.search(r"\b(year|years|saal|exp|experience|engineer|developer|role)\b", cand, re.I):
                raw = cand.strip().title()
                if raw not in found:
                    found.append(raw)

    # 2. General taxonomy scan across n-grams (up to 3 words)
    clean_txt = re.sub(r"[^\w\s\+\#\.\/]", " ", text.lower())
    words = clean_txt.split()
    n = len(words)

    i = 0
    while i < n:
        matched = False
        for k in (3, 2, 1):
            if i + k <= n:
                phrase = " ".join(words[i : i + k]).strip()
                if phrase in ("me", "in", "it", "at", "as", "is", "or", "and", "c", "to", "of", "on", "am", "ml", "ai", "qa", "hr", "pm", "ui", "ux", "lead", "engineer", "developer", "tester", "analyst"):
                    continue
                if phrase in idx:
                    canonical = idx[phrase]
                    if canonical not in found:
                        found.append(canonical)
                    matched = True
                    i += k
                    break
        if not matched:
            i += 1

    return found


def parse_years(text: str) -> float | None:
    """
    Parses career gap years or experience years from text.
    Handles:
    - 4-digit calendar year (e.g. 2023, 2022, '2023 tak', 'till 2023', 'graduated 2023', '2023 se'):
      Computes dynamic gap relative to current system year (e.g. 2026 - 2023 = 3.0)!
    - Duration: '3 years', '3 saal', '3.5 yrs', '3'
    - Negatives: 'no break', 'nahi', 'none', '0' -> 0.0
    """
    current_year = datetime.now().year

    # 1. Check for negative / continuous working
    if re.search(r"\b(no|none|zero|never|nahi|nhi|koi\s*nahi|continuous)\b", text, re.I):
        return 0.0

    # 2. Check for 4-digit calendar year (e.g. 2023, 2022, 2024, or '2023 tak', 'till 2023', '2023 se')
    cal_m = re.search(r"\b(19\d{2}|20\d{2})\b", text)
    if cal_m:
        y = int(cal_m.group(1))
        if 1980 <= y <= current_year:
            # If not explicitly marked as present/current
            if not re.search(r"\b(present|current|now|till\s*date|ongoing|chal\s*raha)\b", text, re.I):
                return float(current_year - y)

    # 3. Check for year duration expressions like "3 years", "3.5 yrs", "3 saal", "3 sal"
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?|yr|saal|sal|y)\b", text, re.I)
    if m:
        val = float(m.group(1))
        if val > 50:
            if 1980 <= val <= current_year:
                return float(current_year - int(val))
            return None
        return val

    # 4. Bare number: "3", "3.5"
    m = re.fullmatch(r"\s*(\d+(?:\.\d+)?)\s*", text)
    if m:
        val = float(m.group(1))
        if 1980 <= val <= current_year:
            return float(current_year - int(val))
        if val <= 50:
            return val

    return None


# ── state ─────────────────────────────────────────────────────────────────────

def new_state(name: str = "", email: str = "") -> dict[str, Any]:
    return {
        "draft": {
            "name": name,
            "email": email,
            "current_role": "",
            "target_role": "",
            "city": "",             # backward compatibility
            "current_city": "",     # candidate's residential city (from resume or asked)
            "preferred_city": "",   # candidate's target work city or Remote
            "experience_years": 0,
            "career_gap_years": None,  # None = not answered yet
            "gap_reason": "",       # break reason (optional, empathetic)
            "achievements": [],     # co-curricular highlights / hackathons
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
    for key in ("current_role", "target_role"):
        val = (parsed.get(key) or "").strip()
        if val and not d[key]:
            d[key] = val

    # Current/residential city
    cur_city = (parsed.get("current_city") or parsed.get("city") or "").strip()
    if cur_city and not d.get("current_city"):
        d["current_city"] = cur_city
        d["city"] = cur_city

    # Preferred/target city
    pref_city = (parsed.get("preferred_city") or "").strip()
    if pref_city and not d.get("preferred_city"):
        d["preferred_city"] = pref_city

    if parsed.get("gap_reason") and not d.get("gap_reason"):
        d["gap_reason"] = parsed["gap_reason"]

    if parsed.get("achievements"):
        for a in parsed["achievements"]:
            if a not in d["achievements"]:
                d["achievements"].append(a)

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
        elif slot in ("city", "current_city"):
            if not (d.get("current_city") or d.get("city")):
                return "city"
        elif not d.get(slot):
            return slot

    # Career gap question if not answered
    if d["career_gap_years"] is None and state["ask_counts"].get("career_gap", 0) == 0:
        return "career_gap"

    # Optional slot: gap_reason if gap detected (>= 0.5 yrs) and not asked yet
    if (d.get("career_gap_years") or 0.0) >= 0.5 and not d.get("gap_reason") and state["ask_counts"].get("gap_reason", 0) == 0:
        return "gap_reason"

    # Optional slot: preferred_city if not answered yet
    if not d.get("preferred_city_answered") and state["ask_counts"].get("preferred_city", 0) == 0:
        return "preferred_city"

    # Optional slot: achievements if not asked yet and empty
    if not d.get("achievements") and state["ask_counts"].get("achievements", 0) == 0:
        return "achievements"

    return None


def _classify(state: dict[str, Any]) -> None:
    d = state["draft"]
    role = f"{d.get('current_role', '')}".lower()
    gap = d.get("career_gap_years") or 0.0
    exp = d.get("experience_years") or 0

    if re.search(r"\b(delivery|driver|rider|gig|cab|courier|swiggy|zomato|uber|ola|zepto|blinkit|dunzo|porter|logistics\s*operations)\b", role):
        seg = "gig"
    elif d.get("laid_off") or re.search(r"\b(laid\s*off|layoff|fired|downsized|retrenched)\b", role):
        seg = "laid_off"
    elif gap >= 0.5 or re.search(r"\b(maternity|career\s*break|career\s*gap|sabbatical|family\s*care)\b", role):
        seg = "returner"
    elif exp <= 1 and re.search(r"\b(student|fresher|graduate|b\.?tech|final\s*year|college|intern)\b", role):
        seg = "student"
    elif d.get("current_role"):
        seg = "stagnant"
    else:
        seg = ""
    d["user_type"] = seg


def _fill(state: dict[str, Any], slot: str, msg: str) -> bool:
    """Fill `slot` from msg. Returns True if filled."""
    d = state["draft"]
    forced = state["ask_counts"].get(slot, 0) >= MAX_ASKS_PER_SLOT
    if slot not in ("career_gap", "gap_reason", "achievements") and msg.lower().strip() in SKIP_WORDS:
        return False

    if slot in ("current_role", "target_role"):
        city = find_city(msg)
        if city and not d.get("current_city"):
            d["current_city"] = city
            d["city"] = city
        role = clean_role(msg)
        if role and (len(role) <= 60 or forced):
            d[slot] = role[:60]
            return True
        return False

    if slot == "skills":
        _add_skills(d, split_items(msg), allow_raw=forced)
        return len(d["skills_raw"]) >= MIN_SKILLS

    if slot in ("current_city", "city"):
        city = find_city(msg)
        if not city and (forced or len(msg.split()) <= 3):
            city = msg.strip().title()[:40]
        if city:
            d["current_city"] = city
            d["city"] = city
            return True
        return False

    if slot == "preferred_city":
        d["preferred_city_answered"] = True
        low = msg.lower().strip()
        if low in SKIP_WORDS:
            return True
        if any(w in low for w in ["same", "same as current", "wahi", "vahi", "same city"]):
            d["preferred_city"] = d.get("current_city") or d.get("city") or "Remote"
            return True
        if "remote" in low:
            d["preferred_city"] = "Remote"
            return True
        city = find_city(msg)
        if city:
            d["preferred_city"] = city
            return True
        if forced or len(msg.split()) <= 3:
            d["preferred_city"] = msg.strip().title()[:40]
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
            if yrs >= 0.5 and not d.get("user_type") or d.get("user_type") in ("detecting", "stagnant"):
                d["user_type"] = "returner"
            return True
        if forced:
            d["career_gap_years"] = 0.0
            return True
        return False

    if slot == "gap_reason":
        low = msg.lower().strip()
        if low in SKIP_WORDS or any(w in low for w in ["prefer not to share", "private", "not comfortable", "comfortable", "personal"]):
            d["gap_reason"] = "Prefer not to share"
            return True
        d["gap_reason"] = msg.strip()[:150]
        return True

    if slot == "achievements":
        low = msg.lower().strip()
        if low in SKIP_WORDS or low in ("none", "no", "skip", "nahi", "nhi", "na", "nothing", "kuch nahi"):
            d["achievements"] = []
            return True
        items = split_items(msg)
        if items:
            for it in items:
                if it.strip() and it.strip().title() not in d["achievements"]:
                    d["achievements"].append(it.strip().title())
            return True
        d["achievements"] = [msg.strip()[:100]]
        return True

    return False


def _opportunistic(state: dict[str, Any], msg: str) -> None:
    """Pick up extra info mentioned in passing (roles, skills, experience, city, gaps)."""
    d = state["draft"]
    current_year = datetime.now().year

    # 1. Role extraction in passing (current & target roles)
    curr_role, tgt_role = extract_roles_from_text(msg)
    if curr_role and (not d.get("current_role") or ROLE_DECL_RE.search(msg) or len(msg.split()) >= 3):
        d["current_role"] = curr_role
    if tgt_role:
        d["target_role"] = tgt_role

    # 2. Skills extraction in passing
    found_skills = extract_skills_from_text(msg)
    if found_skills:
        _add_skills(d, found_skills, allow_raw=True)

    # 3. City in passing
    if not d.get("current_city") and not d.get("city"):
        c = find_city(msg)
        if c:
            d["current_city"] = c
            d["city"] = c

    # 4. Laid off in passing
    if LAID_OFF_RE.search(msg):
        d["laid_off"] = True
        d["user_type"] = "laid_off"

    # 5. Check for gig roles mentioned in passing
    if re.search(r"\b(swiggy|zomato|uber|ola|zepto|blinkit|dunzo|porter|delivery|rider|driver|courier)\b", msg, re.I):
        if not d.get("user_type") or d["user_type"] in ("detecting", "stagnant"):
            d["user_type"] = "gig"

    # 6. Check for student keywords in passing
    if re.search(r"\b(student|fresher|final\s*year|b\.?tech\s*student|college\s*student|intern)\b", msg, re.I):
        if not d.get("user_type") or d["user_type"] in ("detecting", "stagnant"):
            d["user_type"] = "student"

    # 7. Achievements mentioned in passing (e.g. Smart India Hackathon, hackathon winner)
    if re.search(r"\b(hackathon\s*(?:winner|winner\s*of|finalist)|smart\s*india\s*hackathon|sih)\b", msg, re.I):
        cand = "Hackathon Winner"
        if cand not in d["achievements"]:
            d["achievements"].append(cand)

    # 8. Experience in passing: "5 years exp", "5 saal experience", "5 years experience", "5+ yrs experience"
    m_exp = re.search(
        r"(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?|saal|sal)\s*(?:of\s*)?(?:exp|experience|anubhav|work\s*experience)?\b",
        msg,
        re.I,
    )
    if m_exp:
        d["experience_years"] = int(float(m_exp.group(1)))

    # 9. Calendar year in passing: e.g. "2023 tak", "2023 se", "last job 2023", "graduated in 2023", "2023 passout"
    cal_m = re.search(r"\b(19\d{2}|20\d{2})\b", msg)
    if cal_m and not re.search(r"\b(present|current|now|till\s*date|ongoing)\b", msg, re.I):
        past_year = int(cal_m.group(1))
        if 1980 <= past_year <= current_year:
            is_break_context = bool(
                re.search(r"\b(tak|tk|till|until|ended|left|graduated|passout|khatam|over|se|since|last|gap|break)\b", msg, re.I)
            )
            if is_break_context:
                gap = float(current_year - past_year)
                if gap >= 0.5:
                    d["career_gap_years"] = gap
                    d["user_type"] = "returner"

    # 10. Gap in passing
    m_gap = re.search(r"(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?|saal)\s*(?:ka\s*)?(?:gap|break)", msg, re.I)
    if m_gap:
        gap = float(m_gap.group(1))
        d["career_gap_years"] = gap
        if gap >= 0.5:
            d["user_type"] = "returner"


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
    has_role = bool(d.get("current_role") and d.get("target_role"))
    has_cur_city = bool(d.get("current_city") or d.get("city"))
    has_skills = len(d.get("skills_raw", [])) >= MIN_SKILLS
    return bool(has_role and has_cur_city and has_skills)


def missing_fields(state: dict[str, Any]) -> list[str]:
    d = state["draft"]
    out = []
    if not d.get("current_role"):
        out.append("current_role")
    if len(d.get("skills_raw", [])) < MIN_SKILLS:
        out.append("skills")
    if not d.get("target_role"):
        out.append("target_role")
    if not (d.get("current_city") or d.get("city")):
        out.append("current_city")
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
    "current_city": {
        "en": "Which city are you **currently living or based in**? (e.g. Pune, Lucknow, Delhi)",
        "hinglish": "Aap abhi **kaunse city me rehte ho**? (jaise Pune, Lucknow, Delhi)",
        "hi": "आप अभी **किस शहर में रहते हैं**? (जैसे Pune, Lucknow, Delhi)",
    },
    "preferred_city": {
        "en": "Where do you **prefer to work**? (e.g. Bengaluru, Hyderabad, Pune, or Remote)",
        "hinglish": "Aap **kahan kaam karna chahte ho**? (jaise Bengaluru, Pune, ya Remote)",
        "hi": "आप **कहाँ काम करना चाहते हैं**? (जैसे Bengaluru, Pune, या Remote)",
    },
    "city": {
        "en": "Which city are you currently located in?",
        "hinglish": "Aap abhi kaunse city me ho?",
        "hi": "आप किस शहर में हैं?",
    },
    "career_gap": {
        "en": "Have you had a **career break**? If yes, how many years? (optional)",
        "hinglish": "Kya koi **career break** liya tha? Kitne saal? (optional)",
        "hi": "क्या आपने कोई **करियर ब्रेक** लिया था? कितने साल? (वैकल्पिक)",
    },
    "gap_reason": {
        "en": "What was the context or reason for your career break? *(Sharing this is completely optional, but helps us tailor the best returner pathway, bridge courses, and supportive employers for you)*",
        "hinglish": "Career break ka kya reason tha? *(Ye share karna optional hai, par isse aapke liye best returner roadmap aur supportive companies match karne me help milti hai)*",
        "hi": "आपके करियर ब्रेक का क्या कारण था? *(यह बताना पूरी तरह से वैकल्पिक है, पर इससे आपके लिए सही रिटर्नर पाथवे और कंपनियां मैच करने में मदद मिलेगी)*",
    },
    "achievements": {
        "en": "Do you have any **notable achievements or co-curricular highlights**? (e.g. Hackathon winner, open source work, certifications, or leadership roles. Optional)",
        "hinglish": "Koi **notable achievements ya co-curricular highlights** hain? (jaise Hackathon winner, open source work, certifications. Optional)",
        "hi": "क्या आपकी कोई **उपलब्धियां या सह-पाठ्यचर्या (co-curricular)** हैं? (जैसे Hackathon विजेता, ओपन सोर्स, प्रमाणपत्र। वैकल्पिक)",
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
    "current_city": ["Pune", "Delhi", "Lucknow", "Mohali", "Bengaluru", "Mumbai"],
    "preferred_city": ["Remote", "Same as current city", "Bengaluru", "Hyderabad", "Pune"],
    "city": ["Bengaluru", "Delhi", "Pune", "Mohali", "Remote"],
    "career_gap": ["No break", "1 year", "2 years", "3+ years", "Skip"],
    "gap_reason": ["Family Care / Maternity", "Upskilling / Prep", "Health & Wellness", "Prefer not to share", "Skip"],
    "achievements": ["National Hackathon Winner", "Open Source Contributor", "Cloud / AI Certified", "None / Skip"],
}


def build_response(state: dict[str, Any]) -> dict[str, Any]:
    lang = state["lang"]
    slot = state["pending_slot"]
    note = state["last_note"]
    d = state["draft"]
    first = (d["name"] or "").split(" ")[0]
    gap = d.get("career_gap_years") or 0.0

    prefix = ""
    if note.startswith("resume:"):
        k = note.split(":")[1]
        cur_c = d.get("current_city") or d.get("city")
        city_note = f" in **{cur_c}**" if cur_c else ""
        if gap >= 0.5:
            if lang == "hi":
                prefix = f"रिज़्यूमे मिल गया: **{k} स्किल्स** मिलीं{city_note} और **{gap:.1f} साल का करियर ब्रेक** मिला। हमारा Returner प्रोग्राम आपके कमबैक के लिए तैयार है। "
            elif lang == "hinglish":
                prefix = f"Resume mil gaya: **{k} skills** mili{city_note} aur **{gap:.1f} saal ka career break** detect hua. Hamara Returner roadmap aapke safe comeback ke liye tailored hai. "
            else:
                prefix = f"Got your resume: found **{k} skills**{city_note} and detected a **{gap:.1f}-year career gap**. Our Returner pathway is tailored for your comeback. "
        else:
            prefix = RESUME_OK[lang].format(k=k)
    elif note == "more:skills":
        n = len(d["skills_raw"])
        prefix = MORE_SKILLS[lang].format(have=", ".join(d["skills_raw"]), need=MIN_SKILLS - n)
    elif note.startswith("retry:"):
        prefix = SKILL_RETRY[lang] if note == "retry:skills" else RETRY[lang]

    if slot:
        state["ask_counts"][slot] = state["ask_counts"].get(slot, 0) + 1
        reply = prefix + Q[slot][lang]

        # Tailor quick replies dynamically based on persona archetype and current system year
        user_seg = d.get("user_type") or ""
        if slot == "target_role":
            if user_seg == "returner":
                quick = ["GenAI Engineer", "Full Stack Developer", "Automation QA", "Cloud Engineer"]
            elif user_seg == "gig":
                quick = ["Logistics Tech Analyst", "Operations Coordinator", "Tech Support", "Fleet Supervisor"]
            elif user_seg == "laid_off":
                quick = ["Automation QA / SDET", "Full Stack Developer", "DevOps Engineer", "Data Engineer"]
            elif user_seg == "student":
                quick = ["Software Engineer", "ML Engineer Intern", "Data Analyst", "Junior Web Dev"]
            else:
                quick = ["AI Chatbot Trainer", "Product Analyst", "Solutions Architect", "Data Analyst"]
        elif slot == "career_gap":
            current_year = datetime.now().year
            quick = [
                "No break (Working)",
                f"Since {current_year - 3} ({current_year - (current_year - 3)} yrs)",
                f"Since {current_year - 2} ({current_year - (current_year - 2)} yrs)",
                f"Since {current_year - 1} ({current_year - (current_year - 1)} yr)",
                "Skip",
            ]
        elif slot == "preferred_city":
            cur_c = d.get("current_city") or d.get("city")
            quick = ["Remote", f"Same as {cur_c}" if cur_c else "Same as current city", "Bengaluru", "Hyderabad", "Pune"]
        else:
            quick = QUICK.get(slot, [])
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