import json
import re
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
            return ResumeParseResponse(
                name=data.get("name") or "Candidate",
                email=data.get("email"),
                phone=data.get("phone"),
                city=data.get("city") or "Bengaluru",
                current_role=data.get("current_role") or "Software Professional",
                target_role=data.get("target_role"),
                experience_years=int(data.get("experience_years", 0) or 0),
                career_gap_years=float(data.get("career_gap_years", 0.0) or 0.0),
                skills=skills_extracted,
                education=data.get("education"),
                summary=data.get("summary") or "Profile parsed successfully",
                confidence_score=0.95,
            )
    except Exception:
        pass

    return _fallback_parse(resume_text)
