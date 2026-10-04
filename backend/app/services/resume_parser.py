import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any

from app.schemas.resume import ResumeParseResponse
from app.services.llm import complete

DATA_DIR = Path(__file__).parent.parent / "data"


def _load_json(filename: str) -> Any:
    path = DATA_DIR / filename
    if path.exists():
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return []


def _compute_experience_and_gap_from_dates(resume_text: str) -> tuple[int, float]:
    """
    Computes experience_years and career_gap_years from date ranges in resume text.
    Handles:
    - Explicit break periods: 'Career break: 2020 - 2024' -> 4.0 years gap
    - Job date ranges: '2015 - 2020' -> 5 years exp
    - Gaps between jobs: e.g. Job 1 ends 2020, Job 2 starts 2022 -> 2.0 years gap
    - Unemployed gap up to current year when last role ended in past without present role
    """
    current_year = datetime.now().year
    lines = resume_text.splitlines()

    work_periods: list[tuple[float, float]] = []
    gap_periods: list[tuple[float, float]] = []

    # 1. Explicit career break date patterns
    break_date_patterns = [
        r"(?:career\s*(?:gap|break)|gap|break|sabbatical|maternity)[^\n\.\,]*?\b(19\d{2}|20\d{2})\s*(?:to|[-–—])\s*(19\d{2}|20\d{2}|present|current)\b",
        r"\b(19\d{2}|20\d{2})\s*(?:to|[-–—])\s*(19\d{2}|20\d{2}|present|current)[^\n\.\,]*?(?:career\s*(?:gap|break)|gap|break|sabbatical)",
    ]
    for pat in break_date_patterns:
        for m in re.finditer(pat, resume_text, re.I):
            s_str, e_str = m.group(1), m.group(2)
            try:
                s = float(s_str)
                e = float(current_year) if re.search(r"present|current", e_str, re.I) else float(e_str)
                if e > s:
                    gap_periods.append((s, e))
            except Exception:
                pass

    # 2. Work periods from date ranges
    in_education = False
    for line in lines:
        l_strip = line.strip()
        if not l_strip:
            continue
        if re.match(r"^(?:education|academics|qualifications)\b", l_strip, re.I):
            in_education = True
            continue
        if re.match(r"^(?:experience|work|employment|career\s+history|projects)\b", l_strip, re.I):
            in_education = False

        if in_education:
            continue

        if re.search(r"\b(b\.?tech|b\.?e|m\.?tech|m\.?e|bca|mca|b\.?sc|m\.?sc|b\.?com|mba|degree|college|university|school)\b", l_strip, re.I):
            continue

        if re.search(r"\b(career\s*(?:gap|break)|sabbatical)\b", l_strip, re.I):
            continue

        range_matches = re.finditer(
            r"\b(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(19\d{2}|20\d{2})\s*(?:[-–—]|to)\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(19\d{2}|20\d{2}|present|current|now|till\s*date)\b",
            l_strip,
            re.I
        )
        for rm in range_matches:
            s_val = float(rm.group(1))
            e_str = rm.group(2).lower()
            if any(p in e_str for p in ["present", "current", "now", "till"]):
                e_val = float(current_year)
            else:
                e_val = float(e_str)
            if e_val >= s_val and (e_val - s_val) <= 40:
                work_periods.append((s_val, e_val))

    # Calculate experience
    exp_calc = 0.0
    if work_periods:
        work_periods.sort(key=lambda p: (p[0], p[1]))
        merged: list[tuple[float, float]] = []
        for s, e in work_periods:
            if not merged:
                merged.append((s, e))
            else:
                last_s, last_e = merged[-1]
                if s <= last_e:
                    merged[-1] = (last_s, max(last_e, e))
                else:
                    merged.append((s, e))
        for s, e in merged:
            dur = e - s
            exp_calc += max(dur, 0.5 if dur == 0 else dur)

    # Calculate career gap
    gap_calc = 0.0
    if gap_periods:
        for s, e in gap_periods:
            gap_calc = max(gap_calc, e - s)

    if len(work_periods) >= 2:
        work_periods.sort(key=lambda p: p[0])
        for i in range(len(work_periods) - 1):
            gap_between = work_periods[i+1][0] - work_periods[i][1]
            if gap_between >= 0.5:
                gap_calc = max(gap_calc, gap_between)

    if work_periods and not gap_periods:
        last_end = max(p[1] for p in work_periods)
        has_present = any(p[1] >= current_year for p in work_periods)
        if not has_present and (current_year - last_end) >= 1.0:
            gap_calc = max(gap_calc, float(current_year - last_end))

    return int(round(exp_calc)), float(gap_calc)


def _fallback_parse(resume_text: str) -> ResumeParseResponse:
    """Regex and taxonomy-based robust fallback parser. Never invents education."""
    taxonomy = _load_json("skills_taxonomy.json")

    # Email
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", resume_text)
    email = email_match.group(0) if email_match else None

    # Phone
    phone_match = re.search(r"(?:\+91[\-\s]?)?[6789]\d{9}", resume_text)
    phone = phone_match.group(0) if phone_match else None

    # Name (heuristic: first non-empty line under 40 chars)
    lines = [line.strip() for line in resume_text.split("\n") if line.strip()]
    name = None
    if lines:
        first = lines[0]
        if len(first) < 40 and not any(k in first.lower() for k in ["resume", "curriculum", "cv", "profile", "contact"]):
            name = first

    # Experience years
    exp_years = 0
    exp_matches = re.findall(
        r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?|yr)\s*(?:of)?\s*(?:exp|experience)",
        resume_text,
        re.I,
    )
    if exp_matches:
        try:
            exp_years = int(float(exp_matches[0]))
        except Exception:
            exp_years = 0

    # Career gap
    gap_years = 0.0
    gap_matches = re.findall(
        r"(\d+(?:\.\d+)?)\+?[\s\-]*(?:years?|yrs?|yr)?[\s\-]*(?:career[\s\-]*(?:gap|break)|gap|break)",
        resume_text,
        re.I,
    )
    if gap_matches:
        try:
            gap_years = float(gap_matches[0])
        except Exception:
            gap_years = 0.0

    # Date range calculations for experience and career gap
    date_exp, date_gap = _compute_experience_and_gap_from_dates(resume_text)
    exp_years = max(exp_years, date_exp)
    gap_years = max(gap_years, date_gap)

    # Skills taxonomy matching
    matched_skills = []
    text_lower = resume_text.lower()
    for item in taxonomy:
        s_name = item["name"]
        pattern = r"\b" + re.escape(s_name.lower()) + r"\b"
        if re.search(pattern, text_lower):
            matched_skills.append(s_name)
        else:
            for alias in item.get("aliases", []):
                if re.search(r"\b" + re.escape(alias.lower()) + r"\b", text_lower):
                    matched_skills.append(s_name)
                    break

    # Current Role detection
    role_keywords = [
        "Java Developer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "Software Engineer",
        "Manual QA Engineer",
        "Automation QA",
        "Data Analyst",
        "Data Scientist",
        "Customer Support",
        "Product Manager",
        "DevOps Engineer",
        "Delivery Partner",
    ]
    detected_role = None
    for rk in role_keywords:
        if re.search(r"\b" + re.escape(rk.lower()) + r"\b", text_lower):
            detected_role = rk
            break

    # City detection
    cities = [
        "Bengaluru",
        "Mumbai",
        "Pune",
        "Hyderabad",
        "Noida",
        "Gurugram",
        "Delhi",
        "Chennai",
        "Jaipur",
        "Lucknow",
        "Mohali",
        "Ahmedabad",
    ]
    detected_city = None
    for city in cities:
        if re.search(r"\b" + re.escape(city.lower()) + r"\b", text_lower):
            detected_city = city
            break

    # Education detection — extract ONLY if explicitly present, do not invent
    education = None
    edu_patterns = [
        r"\b(?:B\.?Tech|Bachelor of Technology)\b(?:[\w\s\(\)\.\,]*(?:in [A-Za-z\s]+))?",
        r"\b(?:B\.E\.|Bachelor of Engineering)\b(?:[\w\s\(\)\.\,]*(?:in [A-Za-z\s]+))?",
        r"\b(?:M\.?Tech|Master of Technology)\b(?:[\w\s\(\)\.\,]*(?:in [A-Za-z\s]+))?",
        r"\b(?:M\.E\.|Master of Engineering)\b(?:[\w\s\(\)\.\,]*(?:in [A-Za-z\s]+))?",
        r"\b(?:B\.?Sc|BSc|Bachelor of Science)\b(?:[\w\s\(\)\.\,]*(?:in [A-Za-z\s]+))?",
        r"\b(?:M\.?Sc|MSc|Master of Science)\b(?:[\w\s\(\)\.\,]*(?:in [A-Za-z\s]+))?",
        r"\b(?:BCA|Bachelor of Computer Applications)\b",
        r"\b(?:MCA|Master of Computer Applications)\b",
        r"\b(?:MBA|Master of Business Administration)\b",
        r"\b(?:B\.?Com|Bachelor of Commerce)\b",
        r"\b(?:Diploma in [A-Za-z\s]+)\b",
        r"\b(?:Ph\.?D|Doctor of Philosophy)\b",
    ]
    for ep in edu_patterns:
        m = re.search(ep, resume_text, re.I)
        if m:
            education = m.group(0).strip()
            break

    return ResumeParseResponse(
        name=name or "Candidate",
        email=email,
        phone=phone,
        city=detected_city or "Bengaluru",
        current_role=detected_role or "Software Professional",
        target_role=None,
        experience_years=exp_years,
        career_gap_years=gap_years,
        skills=list(dict.fromkeys(matched_skills)),
        education=education,
        summary=lines[0] if lines else "Experienced professional profile",
        resume_text=resume_text,
        confidence_score=0.82,
    )


async def parse_resume_text(resume_text: str) -> ResumeParseResponse:
    """
    Parses resume text using unified LLM service with fallback to regex+taxonomy.
    All AI completions route through llm.complete().
    """
    prompt = (
        "You are an expert resume parser. Extract structured information from the following resume text. "
        "Respond ONLY with valid JSON matching this schema:\n"
        "{\n"
        '  "name": string,\n'
        '  "email": string,\n'
        '  "phone": string,\n'
        '  "city": string,\n'
        '  "current_role": string,\n'
        '  "target_role": string,\n'
        '  "experience_years": number,\n'
        '  "career_gap_years": number,\n'
        '  "skills": [string],\n'
        '  "education": string,\n'
        '  "summary": string\n'
        "}\n\n"
        f"Resume text:\n{resume_text[:4000]}"
    )

    try:
        data = await complete(prompt, json=True)
        if isinstance(data, dict) and (data.get("name") or data.get("skills") or data.get("current_role")):
            skills_extracted = data.get("skills", [])
            if not isinstance(skills_extracted, list):
                skills_extracted = []
            exp_yrs = int(data.get("experience_years", 0) or 0)
            gap_yrs = float(data.get("career_gap_years", 0.0) or 0.0)
            # Date range supplement if LLM missed experience or career gap
            date_exp, date_gap = _compute_experience_and_gap_from_dates(resume_text)
            if exp_yrs == 0:
                exp_yrs = date_exp
            if gap_yrs == 0.0:
                gap_yrs = date_gap
            return ResumeParseResponse(
                name=data.get("name") or "Candidate",
                email=data.get("email"),
                phone=data.get("phone"),
                city=data.get("city") or "Bengaluru",
                current_role=data.get("current_role") or "Software Professional",
                target_role=data.get("target_role"),
                experience_years=exp_yrs,
                career_gap_years=gap_yrs,
                skills=skills_extracted,
                education=data.get("education"),
                summary=data.get("summary") or "Profile parsed successfully",
                resume_text=resume_text,
                confidence_score=0.95,
            )
    except Exception:
        pass

    return _fallback_parse(resume_text)

