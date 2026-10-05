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


def _detect_user_type(
    resume_text: str,
    current_role: str | None,
    exp_years: int,
    gap_years: float,
) -> str:
    """
    Classifies candidate into one of the 5 demo persona categories:
    1. 'returner': Career break returner (career gap >= 0.5 years or explicit break/maternity)
    2. 'gig': Gig platform worker (Swiggy, Zomato, Uber, Ola, delivery partner, driver, courier)
    3. 'laid_off': Laid-off / downsized professional seeking rapid re-entry
    4. 'student': Student / fresher / recent graduate (exp <= 1 year and no career gap)
    5. 'stagnant': Experienced professional stuck in current role seeking upskilling/switch
    """
    text_lower = resume_text.lower()
    role_lower = (current_role or "").lower()

    # 1. Gig worker
    gig_pat = r"\b(swiggy|zomato|uber|ola|zepto|blinkit|dunzo|porter|shadowfax|rapido|delivery\s*(?:partner|boy|executive)?|driver|cab\s*driver|rider|courier|gig\s*worker|logistics\s*operations)\b"
    if re.search(gig_pat, role_lower) or re.search(gig_pat, text_lower):
        return "gig"

    # 2. Laid-off
    laidoff_pat = r"\b(laid\s*off|layoff|lay\s*off|downsized|retrenched|job\s*(?:cut|loss)|company\s*(?:shut|closed)|restructuring)\b"
    if re.search(laidoff_pat, role_lower) or re.search(laidoff_pat, text_lower):
        return "laid_off"

    # 3. Returner: career gap >= 0.5 years or explicit break
    break_pat = r"\b(career\s*(?:gap|break)|maternity\s*(?:leave|break)|sabbatical|family\s*care)\b"
    if gap_years >= 0.5 or re.search(break_pat, text_lower) or re.search(break_pat, role_lower):
        return "returner"

    # 4. Student: student/fresher/graduate with exp <= 1 and no gap
    student_pat = r"\b(student|fresher|intern|undergraduate|final\s*year|batch\s*of|recent\s*graduate|college|b\.?tech)\b"
    if exp_years <= 1 and (re.search(student_pat, role_lower) or re.search(student_pat, text_lower)):
        return "student"

    # 5. Stagnant / traditional professional
    return "stagnant"


def _compute_experience_and_gap_from_dates(resume_text: str) -> tuple[int, float]:
    """
    Computes experience_years and career_gap_years from date ranges in resume text.
    Dynamically aligns with the current system date/year (e.g. 2026):
    - Explicit break periods: 'Career break: 2020 - 2024' -> 4.0 years gap
    - Job date ranges: '2015 - 2020' -> 5 years exp
    - Gaps between jobs: e.g. Job 1 ends 2020, Job 2 starts 2022 -> 2.0 years gap
    - Unemployed gap up to current system year (e.g. 2026):
      If last work experience ended in a past year (e.g. 2023) with no active present role:
      -> current_year - 2023 = 3.0 years gap!
      If last education ended in a past year (e.g. 2023) with no subsequent work experience:
      -> current_year - 2023 = 3.0 years gap!
    """
    current_year = datetime.now().year
    lines = resume_text.splitlines()

    work_periods: list[tuple[float, float]] = []
    edu_periods: list[tuple[float, float]] = []
    gap_periods: list[tuple[float, float]] = []

    # 1. Explicit career break date patterns
    break_date_patterns = [
        r"(?:career\s*(?:gap|break)|gap|break|sabbatical|maternity)[^\n\.\,]*?\b(19\d{2}|20\d{2})\s*(?:to|[-–—]|till|until)\s*(19\d{2}|20\d{2}|present|current)\b",
        r"\b(19\d{2}|20\d{2})\s*(?:to|[-–—]|till|until)\s*(19\d{2}|20\d{2}|present|current)[^\n\.\,]*?(?:career\s*(?:gap|break)|gap|break|sabbatical)",
        r"(?:career\s*(?:gap|break)|gap|break|sabbatical|maternity)[^\n\.\,]*?\b(\d+(?:\.\d+)?)\s*(?:years?|yrs?|saal)\b",
    ]
    for pat in break_date_patterns:
        for m in re.finditer(pat, resume_text, re.I):
            if m.lastindex == 2:
                s_str, e_str = m.group(1), m.group(2)
                try:
                    s = float(s_str)
                    e = float(current_year) if re.search(r"present|current", e_str, re.I) else float(e_str)
                    if e > s:
                        gap_periods.append((s, e))
                except Exception:
                    pass
            elif m.lastindex == 1:
                try:
                    dur = float(m.group(1))
                    if 0.5 <= dur <= 30:
                        gap_periods.append((float(current_year - dur), float(current_year)))
                except Exception:
                    pass

    # 2. Work periods and education periods from date ranges
    in_education = False
    for line in lines:
        l_strip = line.strip()
        if not l_strip:
            continue

        # If line is purely a section header, switch state and continue
        if re.match(r"^(?:education|academics|qualifications|academic\s+background)\s*[:\-–]?\s*$", l_strip, re.I):
            in_education = True
            continue
        if re.match(r"^(?:experience|work|employment|career\s+history|projects|work\s+history)\s*[:\-–]?\s*$", l_strip, re.I):
            in_education = False
            continue

        # Clean leading section tags like "Experience: " or "Work: " or "Education: "
        if re.match(r"^(?:education|academics|qualifications|academic\s+background)\s*[:\-–]\s*", l_strip, re.I):
            in_education = True
            l_strip = re.sub(r"^(?:education|academics|qualifications|academic\s+background)\s*[:\-–]\s*", "", l_strip, flags=re.I).strip()
        elif re.match(r"^(?:experience|work|employment|career\s+history|projects|work\s+history)\s*[:\-–]\s*", l_strip, re.I):
            in_education = False
            l_strip = re.sub(r"^(?:experience|work|employment|career\s+history|projects|work\s+history)\s*[:\-–]\s*", "", l_strip, flags=re.I).strip()

        if re.search(r"\b(career\s*(?:gap|break)|sabbatical|maternity)\b", l_strip, re.I):
            continue

        # Check if line relates to education
        is_edu_line = in_education or bool(
            re.search(
                r"\b(b\.?tech|b\.?e|m\.?tech|m\.?e|bca|mca|b\.?sc|m\.?sc|b\.?com|mba|degree|college|university|school|high\s*school|graduat(?:e|ed|ion)|passing\s*year|batch\s*of|passout|academics|class\s*of)\b",
                l_strip,
                re.I,
            )
        )

        range_matches = list(
            re.finditer(
                r"\b(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(19\d{2}|20\d{2})\s*(?:[-–—]|to)\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(19\d{2}|20\d{2}|present|current|now|till\s*date|ongoing)\b",
                l_strip,
                re.I,
            )
        )

        if is_edu_line:
            if range_matches:
                for rm in range_matches:
                    s_val = float(rm.group(1))
                    e_str = rm.group(2).lower()
                    e_val = (
                        float(current_year)
                        if any(p in e_str for p in ["present", "current", "now", "till", "ongoing"])
                        else float(e_str)
                    )
                    if e_val >= s_val and (e_val - s_val) <= 10:
                        edu_periods.append((s_val, e_val))
            else:
                # Single graduation year, e.g. "Graduated: 2023", "Graduated in 2023", "Passing Year: 2023", "2023 passout", "(2023)"
                yr_matches = re.findall(r"\b(19\d{2}|20\d{2})\b", l_strip)
                for ym in yr_matches:
                    y_val = float(ym)
                    if 1980 <= y_val <= current_year + 5:
                        edu_periods.append((y_val - 4.0, y_val))
            continue

        # Not education -> Work experience line
        if range_matches:
            for rm in range_matches:
                s_val = float(rm.group(1))
                e_str = rm.group(2).lower()
                if any(p in e_str for p in ["present", "current", "now", "till", "ongoing"]):
                    e_val = float(current_year)
                else:
                    e_val = float(e_str)
                if e_val >= s_val and (e_val - s_val) <= 40:
                    work_periods.append((s_val, e_val))
        else:
            # Check for "till 2023", "until 2023", "ended in 2023", "tak 2023", "2023 tak", "left in 2023"
            till_matches = list(re.finditer(
                r"\b(?:till|until|up\s*to|ended\s*in|left\s*in|over\s*in|tak|tk|last\s*(?:job|role|experience|company)?\s*(?:in|was|till|tk)?)\s*(19\d{2}|20\d{2})\b",
                l_strip,
                re.I,
            ))
            # Also "2023 tak", "2023 tk", "2023 me ended"
            reverse_till = list(re.finditer(
                r"\b(19\d{2}|20\d{2})\s*(?:tak|tk|me\s*(?:khatam|over|ended|left)|se)\b",
                l_strip,
                re.I,
            ))
            for tm in till_matches:
                e_val = float(tm.group(1))
                work_periods.append((e_val - 1.0, e_val))
            for rtm in reverse_till:
                e_val = float(rtm.group(1))
                work_periods.append((e_val - 1.0, e_val))

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

    # Calculate career gap from explicit break periods
    gap_calc = 0.0
    if gap_periods:
        for s, e in gap_periods:
            gap_calc = max(gap_calc, e - s)

    # Calculate gap between consecutive jobs
    if len(work_periods) >= 2:
        work_periods.sort(key=lambda p: p[0])
        for i in range(len(work_periods) - 1):
            gap_between = work_periods[i + 1][0] - work_periods[i][1]
            if gap_between >= 0.5:
                gap_calc = max(gap_calc, gap_between)

    # Calculate post-job or post-education gap up to current system year
    has_present_work = any(p[1] >= current_year for p in work_periods)
    has_present_in_text = bool(
        re.search(r"\b(present|currently\s*(?:working|employed)|till\s*date|ongoing|now)\b", resume_text, re.I)
    )

    if not (has_present_work or has_present_in_text):
        if work_periods:
            last_work_end = max(p[1] for p in work_periods)
            if (current_year - last_work_end) >= 0.5:
                gap_calc = max(gap_calc, float(current_year - last_work_end))
        elif edu_periods:
            last_edu_end = max(p[1] for p in edu_periods)
            if (current_year - last_edu_end) >= 0.5:
                gap_calc = max(gap_calc, float(current_year - last_edu_end))

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
        if len(first) < 40 and not any(
            k in first.lower() for k in ["resume", "curriculum", "cv", "profile", "contact"]
        ):
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

    detected_role = _detect_role(resume_text)
    detected_city = _detect_city(resume_text)
    detected_gap_reason = _detect_gap_reason(resume_text)
    detected_achievements = _detect_achievements(resume_text)

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

    # Detect user type / persona category
    detected_user_type = _detect_user_type(resume_text, detected_role, exp_years, gap_years)

    return ResumeParseResponse(
        name=name or "Candidate",
        email=email,
        phone=phone,
        city=detected_city,
        current_city=detected_city,
        preferred_city=None,
        gap_reason=detected_gap_reason,
        achievements=detected_achievements,
        current_role=detected_role,
        target_role=None,
        experience_years=exp_years,
        career_gap_years=gap_years,
        skills=list(dict.fromkeys(matched_skills)),
        education=education,
        summary=lines[0] if lines else "Experienced professional profile",
        resume_text=resume_text,
        user_type=detected_user_type,
        confidence_score=0.82,
    )


def _detect_gap_reason(resume_text: str) -> str | None:
    """Detect reason for career break if mentioned in resume."""
    text_lower = resume_text.lower()
    if re.search(r"\b(maternity|child\s*care|pregnancy|motherhood)\b", text_lower):
        return "Family & Maternity"
    if re.search(r"\b(family\s*(?:care|emergency|responsibilit|support)|elder\s*care)\b", text_lower):
        return "Family Care"
    if re.search(r"\b(medical|health|illness|recovery|surgery|treatment)\b", text_lower):
        return "Health Recovery"
    if re.search(r"\b(upskilling|course|certification|higher\s*education|studies|prep|exam|gate|cat|upsc)\b", text_lower):
        return "Upskilling & Education"
    if re.search(r"\b(relocat|relocation|moved\s*to|shifted)\b", text_lower):
        return "Relocation"
    if re.search(r"\b(sabbatical|personal\s*break|travel)\b", text_lower):
        return "Personal Sabbatical"
    return None


def _detect_achievements(resume_text: str) -> list[str]:
    """Extract hackathons, awards, certifications, or notable highlights."""
    achievements: list[str] = []
    text_lower = resume_text.lower()

    # Hackathon patterns
    hack_matches = re.findall(
        r"(?:winner|runner[- ]?up|finalist|participant|participated in|1st\s*prize|2nd\s*prize|rank\s*\d+)\s*(?:of|at|in)?\s*([A-Za-z0-9\s]{2,40}hackathon[A-Za-z0-9\s]{0,20})",
        resume_text,
        re.I,
    )
    for hm in hack_matches:
        cand = hm.strip().title()
        if len(cand) > 3 and cand not in achievements:
            achievements.append(cand)

    if not achievements and re.search(r"\b(smart\s*india\s*hackathon|sih)\b", text_lower):
        achievements.append("Smart India Hackathon")
    elif not achievements and re.search(r"\bhackathon\s*(?:winner|winner\s*of|finalist)\b", text_lower):
        achievements.append("Hackathon Winner")

    # Certifications / Honors
    cert_matches = re.findall(
        r"\b(AWS\s*Certified\s*[A-Za-z\s]{0,25}|Azure\s*Certified\s*[A-Za-z\s]{0,25}|GCP\s*Certified\s*[A-Za-z\s]{0,25}|Certified\s*Kubernetes\s*[A-Za-z\s]{0,15}|Open\s*Source\s*Contributor|National\s*(?:Level\s*)?(?:Winner|Finalist|Champion)[A-Za-z\s]{0,20})\b",
        resume_text,
        re.I,
    )
    for cm in cert_matches:
        cand = cm.strip().title()
        if len(cand) > 4 and cand not in achievements:
            achievements.append(cand)

    return achievements[:4]


CITIES_MAP: dict[str, str] = {
    "bangalore": "Bengaluru",
    "bengaluru": "Bengaluru",
    "mumbai": "Mumbai",
    "bombay": "Mumbai",
    "pune": "Pune",
    "poona": "Pune",
    "hyderabad": "Hyderabad",
    "secunderabad": "Hyderabad",
    "noida": "Noida",
    "greater noida": "Greater Noida",
    "gurugram": "Gurugram",
    "gurgaon": "Gurugram",
    "delhi": "Delhi",
    "new delhi": "Delhi",
    "delhi ncr": "Delhi",
    "chennai": "Chennai",
    "madras": "Chennai",
    "jaipur": "Jaipur",
    "lucknow": "Lucknow",
    "mohali": "Mohali",
    "chandigarh": "Chandigarh",
    "ahmedabad": "Ahmedabad",
    "kolkata": "Kolkata",
    "calcutta": "Kolkata",
    "indore": "Indore",
    "bhopal": "Bhopal",
    "nagpur": "Nagpur",
    "patna": "Patna",
    "surat": "Surat",
    "vadodara": "Vadodara",
    "baroda": "Vadodara",
    "kochi": "Kochi",
    "cochin": "Kochi",
    "coimbatore": "Coimbatore",
    "visakhapatnam": "Visakhapatnam",
    "vizag": "Visakhapatnam",
    "thiruvananthapuram": "Thiruvananthapuram",
    "trivandrum": "Thiruvananthapuram",
    "bhubaneswar": "Bhubaneswar",
    "dehradun": "Dehradun",
    "mysore": "Mysuru",
    "mysuru": "Mysuru",
    "kanpur": "Kanpur",
    "ranchi": "Ranchi",
    "ghaziabad": "Ghaziabad",
    "faridabad": "Faridabad",
    "ludhiana": "Ludhiana",
    "amritsar": "Amritsar",
    "guwahati": "Guwahati",
    "varanasi": "Varanasi",
    "remote": "Remote",
}


def _detect_city(resume_text: str) -> str | None:
    """Detect city from resume text. Returns None if absent (never invents)."""
    text_lower = resume_text.lower()

    # 1. Prioritize explicit location / address lines
    loc_match = re.search(
        r"(?:location|city|address|based\s*in|residing\s*in|current\s*location)\s*[:\-–]\s*([^\n\r]+)",
        resume_text,
        re.I,
    )
    if loc_match:
        loc_line = loc_match.group(1).lower()
        for k, v in CITIES_MAP.items():
            if re.search(r"\b" + re.escape(k) + r"\b", loc_line):
                return v

    # 2. Match city names in entire resume text as whole word tokens
    for k, v in CITIES_MAP.items():
        if re.search(r"\b" + re.escape(k) + r"\b", text_lower):
            return v

    # 3. If explicit "City: XYZ" line was provided for an unlisted city
    city_explicit = re.search(
        r"\b(?:city|location)\s*[:\-–]\s*([A-Za-z\s]{2,25})(?:,|[0-9]|\n|\r|$)",
        resume_text,
        re.I,
    )
    if city_explicit:
        cand = city_explicit.group(1).strip()
        cand_lower = cand.lower()
        stopwords = ["india", "street", "road", "flat", "sector", "phase", "lane", "house", "building", "floor"]
        if not any(stop in cand_lower for stop in stopwords):
            return cand.title()

    return None


def _detect_role(resume_text: str) -> str | None:
    """Detect current/past role from resume text. Returns None if absent (never invents)."""
    text_lower = resume_text.lower()

    # 1. Explicit role labels
    role_match = re.search(
        r"(?:role|designation|current\s*role|job\s*title|current\s*designation)\s*[:\-–]\s*([A-Za-z\s\/\&]+?)(?:,|[0-9]|\n|\r|$)",
        resume_text,
        re.I,
    )
    if role_match:
        cand_role = role_match.group(1).strip()
        if 2 <= len(cand_role) <= 40:
            return cand_role.title()

    # 2. Known role keywords
    role_keywords = [
        "Full Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Java Developer",
        "Python Developer",
        "Software Engineer",
        "Software Developer",
        "Manual QA Engineer",
        "Automation QA",
        "Automation SDET",
        "SDET",
        "QA Tester",
        "QA Engineer",
        "Data Analyst",
        "Data Scientist",
        "Machine Learning Engineer",
        "AI Engineer",
        "DevOps Engineer",
        "Cloud Engineer",
        "Customer Support",
        "Support Executive",
        "Product Manager",
        "Delivery Partner",
        "Delivery Executive",
        "Student",
    ]
    for rk in role_keywords:
        if re.search(r"\b" + re.escape(rk.lower()) + r"\b", text_lower):
            return rk

    return None


async def parse_resume_text(resume_text: str) -> ResumeParseResponse:
    """
    Parses resume text using unified LLM service with fallback to regex+taxonomy.
    Extracts dates, automatically calculates gap relative to current system year (e.g. 2026),
    and assigns persona categories (returner, gig, laid_off, stagnant, student).
    """
    current_year = datetime.now().year
    prompt = (
        f"You are an expert AI career and resume intelligence analyzer. Current year is {current_year}.\n"
        "Extract structured candidate information from the following resume text.\n\n"
        "CRITICAL ANALYSIS INSTRUCTIONS:\n"
        f"1. CAREER GAP CALCULATION (Current system year is {current_year}):\n"
        f"   - If the candidate's last work experience ended in a past year (e.g. 2023) and they do NOT have a current/present role, calculate career_gap_years = ({current_year} - last_experience_year). For example, {current_year} - 2023 = 3.0 years gap!\n"
        f"   - If the candidate has no work experience and their education ended in a past year (e.g. graduated in 2023), calculate career_gap_years = ({current_year} - graduation_year). For example, {current_year} - 2023 = 3.0 years gap!\n"
        f"   - If there is an explicit career break, maternity leave, or gap between jobs, record that exact duration.\n"
        f"   - If currently employed (job shows 'Present', 'Current', or {current_year}), career_gap_years is 0.0.\n\n"
        "2. DEMO PERSONA CATEGORIZATION (user_type):\n"
        "   Classify into EXACTLY one of these 5 categories:\n"
        "   - 'returner': Has a career break / gap of >= 0.5 years (e.g., last job or graduation ended in 2023 or earlier, maternity break, sabbatical).\n"
        "   - 'gig': Gig platform worker (Swiggy, Zomato, Uber, Ola, Zepto, Blinkit, delivery partner, driver, courier, field logistics).\n"
        "   - 'laid_off': Laid-off, downsized, retrenched, company shutdown, or restructuring.\n"
        "   - 'student': College student, fresher, recent graduate with <= 1 year of experience.\n"
        "   - 'stagnant': Currently employed professional (2+ years experience, no career gap) seeking career transition or upskilling.\n\n"
        "3. ACCURATE FIELD EXTRACTION (NO HARDCODED DEFAULTS):\n"
        "   - 'current_city': Extract candidate's current residential city from resume (e.g. Pune, Lucknow, Delhi). If not mentioned in the resume, return null. DO NOT default to 'Bengaluru'.\n"
        "   - 'preferred_city': Extract preferred work location or Remote if mentioned. Otherwise return null.\n"
        "   - 'gap_reason': If resume mentions context of career break (e.g. Maternity break, family care, upskilling), extract it. Otherwise return null.\n"
        "   - 'achievements': List of co-curricular highlights, awards, hackathons (e.g. National Hackathon Winner), certifications (e.g. AWS Certified), or notable accomplishments as string array.\n"
        "   - 'current_role': Extract candidate's actual recent role from the resume. If not mentioned in the resume, return null. DO NOT default to 'Software Professional'.\n\n"
        "Respond ONLY with valid JSON matching this schema:\n"
        "{\n"
        '  "name": string,\n'
        '  "email": string,\n'
        '  "phone": string,\n'
        '  "city": string | null,\n'
        '  "current_city": string | null,\n'
        '  "preferred_city": string | null,\n'
        '  "gap_reason": string | null,\n'
        '  "achievements": [string],\n'
        '  "current_role": string | null,\n'
        '  "target_role": string | null,\n'
        '  "experience_years": number,\n'
        '  "career_gap_years": number,\n'
        '  "user_type": "returner" | "gig" | "laid_off" | "stagnant" | "student",\n'
        '  "skills": [string],\n'
        '  "education": string | null,\n'
        '  "summary": string\n'
        "}\n\n"
        f"Resume text:\n{resume_text[:4000]}"
    )

    try:
        data = await complete(prompt, json=True)
        if isinstance(data, dict) and (data.get("name") or data.get("skills") or data.get("current_role") or data.get("city") or data.get("current_city")):
            skills_extracted = data.get("skills", [])
            if not isinstance(skills_extracted, list):
                skills_extracted = []
            exp_yrs = int(data.get("experience_years", 0) or 0)
            gap_yrs = float(data.get("career_gap_years", 0.0) or 0.0)

            # Date range deterministic calculation for supplement and verification
            date_exp, date_gap = _compute_experience_and_gap_from_dates(resume_text)
            if exp_yrs == 0:
                exp_yrs = date_exp
            gap_yrs = max(gap_yrs, date_gap)

            llm_city = (data.get("current_city") or data.get("city") or "").strip()
            if not llm_city or llm_city.lower() in ("unknown", "n/a", "none", "null", "undefined", "not specified", "not mentioned"):
                llm_city = None
            else:
                llm_city = CITIES_MAP.get(llm_city.lower(), llm_city.title())

            llm_pref_city = (data.get("preferred_city") or "").strip()
            if not llm_pref_city or llm_pref_city.lower() in ("unknown", "n/a", "none", "null", "undefined", "not specified"):
                llm_pref_city = None
            else:
                llm_pref_city = CITIES_MAP.get(llm_pref_city.lower(), llm_pref_city.title())

            llm_role = (data.get("current_role") or "").strip()
            if not llm_role or llm_role.lower() in ("unknown", "n/a", "none", "null", "undefined", "not specified", "not mentioned"):
                llm_role = None

            detected_role = _detect_role(resume_text)
            detected_city = _detect_city(resume_text)
            detected_gap_reason = _detect_gap_reason(resume_text)
            detected_achievements = _detect_achievements(resume_text)

            final_city = llm_city or detected_city or None
            final_pref_city = llm_pref_city or None
            final_gap_reason = (data.get("gap_reason") or "").strip() or detected_gap_reason or None

            raw_achievements = data.get("achievements") or []
            if not isinstance(raw_achievements, list):
                raw_achievements = []
            final_achievements = list(dict.fromkeys([str(a).strip().title() for a in raw_achievements if str(a).strip()] + detected_achievements))

            final_role = llm_role or detected_role or None

            llm_user_type = data.get("user_type")
            if gap_yrs >= 0.5 and llm_user_type not in ("gig", "laid_off"):
                llm_user_type = "returner"
            elif llm_user_type not in ("returner", "gig", "laid_off", "stagnant", "student"):
                llm_user_type = _detect_user_type(
                    resume_text, final_role, exp_yrs, gap_yrs
                )

            return ResumeParseResponse(
                name=data.get("name") or "Candidate",
                email=data.get("email"),
                phone=data.get("phone"),
                city=final_city,
                current_city=final_city,
                preferred_city=final_pref_city,
                gap_reason=final_gap_reason,
                achievements=final_achievements,
                current_role=final_role,
                target_role=data.get("target_role"),
                experience_years=exp_yrs,
                career_gap_years=gap_yrs,
                skills=skills_extracted,
                education=data.get("education"),
                summary=data.get("summary") or "Profile parsed successfully",
                resume_text=resume_text,
                user_type=llm_user_type,
                confidence_score=0.95,
            )
    except Exception:
        pass

    return _fallback_parse(resume_text)
