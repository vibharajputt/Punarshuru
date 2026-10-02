import asyncio
import json
import re
from pathlib import Path
from typing import Any
from app.core.config import get_settings
from app.schemas.resume import ResumeParseResponse

DATA_DIR = Path(__file__).parent.parent / "data"
settings = get_settings()


def _load_json(filename: str) -> Any:
    path = DATA_DIR / filename
    if path.exists():
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return []


def _fallback_parse(resume_text: str) -> ResumeParseResponse:
    """Regex and taxonomy-based robust fallback parser"""
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
        if len(first) < 40 and not any(k in first.lower() for k in ["resume", "curriculum", "cv", "profile"]):
            name = first

    # Experience years
    exp_years = 0
    exp_matches = re.findall(r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?|yr)\s*(?:of)?\s*(?:exp|experience)", resume_text, re.I)
    if exp_matches:
        try:
            exp_years = int(float(exp_matches[0]))
        except Exception:
            exp_years = 2

    # Career gap
    gap_years = 0.0
    gap_matches = re.findall(r"(\d+(?:\.\d+)?)\+?[\s\-]*(?:years?|yrs?|yr)?[\s\-]*(?:career[\s\-]*(?:gap|break)|gap|break)", resume_text, re.I)
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
        # Search word boundary for skill
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
    cities = ["Bengaluru", "Mumbai", "Pune", "Hyderabad", "Noida", "Gurugram", "Delhi", "Chennai", "Jaipur", "Lucknow", "Mohali", "Ahmedabad"]
    detected_city = None
    for city in cities:
        if re.search(r"\b" + re.escape(city.lower()) + r"\b", text_lower):
            detected_city = city
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
        education="B.Tech / Bachelor's Degree",
        summary=lines[0] if lines else "Experienced professional",
        confidence_score=0.82,
    )


async def parse_resume_text(resume_text: str) -> ResumeParseResponse:
    """
    Parses resume text using Gemini AI with fallback to regex+taxonomy.
    Has strict 8-second timeout.
    """
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
        return _fallback_parse(resume_text)

    try:
        import google.generativeai as genai  # type: ignore

        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")

        async def _call():
            loop = asyncio.get_running_loop()
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
            resp = await loop.run_in_executor(None, lambda: model.generate_content(prompt))
            raw_txt = resp.text.strip()
            # Clean markdown codeblocks if any
            if raw_txt.startswith("```"):
                raw_txt = re.sub(r"^```(?:json)?\n", "", raw_txt)
                raw_txt = re.sub(r"\n```$", "", raw_txt)
            data = json.loads(raw_txt)
            return ResumeParseResponse(
                name=data.get("name"),
                email=data.get("email"),
                phone=data.get("phone"),
                city=data.get("city"),
                current_role=data.get("current_role"),
                target_role=data.get("target_role"),
                experience_years=int(data.get("experience_years", 0) or 0),
                career_gap_years=float(data.get("career_gap_years", 0.0) or 0.0),
                skills=data.get("skills", []),
                education=data.get("education"),
                summary=data.get("summary"),
                confidence_score=0.95,
            )

        return await asyncio.wait_for(_call(), timeout=8.0)
    except Exception:
        return _fallback_parse(resume_text)
