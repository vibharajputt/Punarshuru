import json
from pathlib import Path
from typing import Any

from app.models.profile import Profile
from app.schemas.pathway import MilestoneCourse, PathwayOption, PathwayResponse, PathwayStep
from app.services.gap import analyze_skill_gap
from app.services.llm import complete

DATA_DIR = Path(__file__).parent.parent / "data"


def _load_json(filename: str) -> Any:
    path = DATA_DIR / filename
    if path.exists():
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return []


async def _generate_motivation_quote(profile_name: str, target_role: str, user_type: str) -> str:
    """Call unified LLM service with fallback for personalized motivation line."""
    fallback_quotes = {
        "returner": f"Your foundation hasn't vanished, {profile_name}. Career breaks bring perspective — now modern tech will meet your seasoned discipline.",
        "gig": f"Every route optimized and customer served built unmatched resilience, {profile_name}. Turning that operational grit into tech mastery is your next win.",
        "laid_off": f"A setback is just market recalibration, {profile_name}. The industry is hiring for tomorrow's automation skills — let's build them.",
        "stagnant": f"Tenure gave you deep domain intuition, {profile_name}. Upgrading to AI-era tools will unlock the career leap you deserve.",
        "student": f"The entire tech landscape is resetting around AI, {profile_name}. You are graduating at the most exciting turning point — step in boldly.",
    }
    default_quote = fallback_quotes.get(
        user_type,
        f"{profile_name}, every master was once a beginner. With focused milestones, your transition to {target_role} is well within reach.",
    )

    prompt = (
        f"Write a short, powerful, 1-2 sentence inspiring motivation line for {profile_name}, "
        f"a '{user_type}' candidate in India working toward becoming a '{target_role}'. "
        f"Be authentic, culturally resonant for Bharat, encouraging, and actionable without cheesy cliches."
    )

    try:
        quote = await complete(prompt, json=False)
        if quote and isinstance(quote, str) and len(quote.strip()) > 10:
            return quote.strip().strip('"')
    except Exception:
        pass

    return default_quote


def _find_matching_courses(
    all_courses: list[dict], skills_or_keywords: list[str], limit: int = 2
) -> list[MilestoneCourse]:
    """Finds courses from courses.json matching given skill keywords."""
    found: list[MilestoneCourse] = []
    seen_ids = set()

    for keyword in skills_or_keywords:
        kw_lower = keyword.lower().strip()
        if not kw_lower:
            continue
        for c in all_courses:
            if c["id"] in seen_ids:
                continue
            title_lower = c["title"].lower()
            if kw_lower in title_lower or any(
                w in title_lower for w in kw_lower.split() if len(w) > 3
            ):
                found.append(
                    MilestoneCourse(
                        id=c["id"],
                        title=c["title"],
                        provider=c["provider"],
                        weeks=c["weeks"],
                        lang=c["lang"],
                        url=c["url"],
                        level=c["level"],
                        certificate=c["certificate"],
                    )
                )
                seen_ids.add(c["id"])
                if len(found) >= limit:
                    return found

    # Fallback to general high quality foundational courses if none matched
    if not found and all_courses:
        for c in all_courses[:limit]:
            found.append(
                MilestoneCourse(
                    id=c["id"],
                    title=c["title"],
                    provider=c["provider"],
                    weeks=c["weeks"],
                    lang=c["lang"],
                    url=c["url"],
                    level=c["level"],
                    certificate=c["certificate"],
                )
            )

    return found


def _get_job_market_salary(jobs: list[dict], role_title: str, fallback_salary: float) -> float:
    """Calculates realistic median market salary in LPA for a given role from jobs_snapshot."""
    title_lower = role_title.lower()
    matched_salaries = []

    for job in jobs:
        j_title = job["title"].lower()
        if (
            title_lower in j_title
            or j_title in title_lower
            or any(w in j_title for w in title_lower.split() if len(w) > 3)
        ):
            avg_sal = (job.get("salary_min_lpa", 0) + job.get("salary_max_lpa", 0)) / 2.0
            if avg_sal > 0:
                matched_salaries.append(avg_sal)

    if matched_salaries:
        return round(float(sum(matched_salaries) / len(matched_salaries)), 1)

    return fallback_salary


def generate_pathways_sync(profile: Profile | dict, quote: str | None = None) -> PathwayResponse:
    """
    Data-driven pathway generation based on jobs_snapshot + gap engine:
    - Safe, Stretch, and Pivot roles, target salaries, and time horizons are calculated from live job data
    - Dynamic roadmap milestones and courses mapped to actual skill gaps
    """
    if isinstance(profile, dict):
        profile_id = str(profile.get("id", "temp-id"))
        p_name = profile.get("name", "Learner")
        p_role = profile.get("current_role") or "Software Professional"
        p_target = profile.get("target_role") or "Software Engineer"
        u_type = str(profile.get("user_type", "stagnant"))
        skills_raw = profile.get("skills_raw", []) or []
    else:
        profile_id = str(profile.id)
        p_name = profile.name or "Learner"
        p_role = profile.current_role or "Software Professional"
        p_target = profile.target_role or "Software Engineer"
        u_type = profile.user_type.value if hasattr(profile.user_type, "value") else str(profile.user_type)
        skills_raw = profile.skills_raw or []

    all_jobs: list[dict] = _load_json("jobs_snapshot.json")
    all_courses: list[dict] = _load_json("courses.json")

    skills_joined = " ".join(skills_raw).lower()
    role_joined = p_role.lower()

    # -------------------------------------------------------------
    # 1. Determine Role Archetypes & Specific Targets from Data
    # -------------------------------------------------------------
    if u_type == "gig" or "delivery" in role_joined:
        safe_role = "Delivery Operations & Dispatch Lead"
        safe_base_salary = 5.0
        stretch_role = p_target if p_target != "Software Engineer" else "Logistics Tech Analyst"
        stretch_base_salary = 12.0
        pivot_role = "Supply Chain Analyst"
        pivot_base_salary = 12.0
        safe_skills = ["Delivery Operations", "Route Optimization", "Communication Skills"]
        pivot_skills = ["Supply Chain", "SQL", "Excel", "Data Analysis"]

    elif u_type == "laid_off" or "qa" in role_joined or "testing" in skills_joined:
        safe_role = "Manual QA Engineer" if "manual" in role_joined else "Senior QA Test Analyst"
        safe_base_salary = 7.5
        stretch_role = p_target if p_target != "Software Engineer" else "Automation QA Engineer"
        stretch_base_salary = 14.0
        pivot_role = "DevOps Engineer"
        pivot_base_salary = 20.0
        safe_skills = ["Manual Testing", "JIRA", "Agile", "Test Case Writing"]
        pivot_skills = ["Docker", "Kubernetes", "Linux", "CI/CD"]

    elif u_type == "returner" or "java" in skills_joined or "spring" in skills_joined:
        safe_role = "Java Backend Developer"
        safe_base_salary = 17.0
        stretch_role = p_target if p_target != "Software Engineer" else "GenAI Engineer"
        stretch_base_salary = 33.5
        pivot_role = "Data Engineer"
        pivot_base_salary = 22.0
        safe_skills = ["Java", "Spring Boot", "MySQL", "REST APIs", "Git"]
        pivot_skills = ["Python", "Apache Spark", "SQL", "Kafka", "AWS"]

    elif u_type == "stagnant" or "support" in role_joined or "crm" in skills_joined:
        safe_role = "Senior Customer Support Executive"
        safe_base_salary = 5.5
        stretch_role = p_target if p_target != "Software Engineer" else "AI Chatbot Trainer / Product Analyst"
        stretch_base_salary = 14.0
        pivot_role = "Data Analyst"
        pivot_base_salary = 12.0
        safe_skills = ["Customer Support", "Communication Skills", "CRM", "Zendesk"]
        pivot_skills = ["SQL", "Python", "Power BI", "Excel"]

    else:  # student or general engineer
        safe_role = "Junior Software Engineer"
        safe_base_salary = 8.0
        stretch_role = p_target if p_target != "Software Engineer" else "ML Engineer"
        stretch_base_salary = 29.0
        pivot_role = "Full Stack Developer (React + Node)"
        pivot_base_salary = 19.0
        safe_skills = ["Python", "Data Structures", "Algorithms", "Git", "SQL"]
        pivot_skills = ["React", "TypeScript", "Node.js", "REST APIs", "MongoDB"]

    # -------------------------------------------------------------
    # 2. Derive Market Salaries from jobs_snapshot
    # -------------------------------------------------------------
    safe_salary = _get_job_market_salary(all_jobs, safe_role, safe_base_salary)
    stretch_salary = _get_job_market_salary(all_jobs, stretch_role, stretch_base_salary)
    pivot_salary = _get_job_market_salary(all_jobs, pivot_role, pivot_base_salary)

    # -------------------------------------------------------------
    # 3. Analyze Skill Gaps via Gap Engine for Data-Driven Milestones
    # -------------------------------------------------------------
    stretch_gap = analyze_skill_gap(profile, target_role=stretch_role)
    pivot_gap = analyze_skill_gap(profile, target_role=pivot_role)

    missing_stretch = stretch_gap.missing_skills if stretch_gap.missing_skills else ["Python", "GenAI", "Prompt Engineering"]
    missing_pivot = pivot_gap.missing_skills if pivot_gap.missing_skills else pivot_skills

    # Calculate data-driven durations based on gap size
    stretch_months = max(3, min(6, round(len(missing_stretch) * 0.7) + 2))
    pivot_months = max(2, min(5, round(len(missing_pivot) * 0.6) + 1))
    safe_months = 2

    # -------------------------------------------------------------
    # 4. Construct Data-Driven Roadmaps
    # -------------------------------------------------------------
    # Safe Pathway Roadmap
    safe_courses_1 = _find_matching_courses(all_courses, safe_skills[:2])
    safe_courses_2 = _find_matching_courses(all_courses, safe_skills[2:])
    safe_pathway = PathwayOption(
        type="Safe",
        title=f"Refresh & Strengthen: {safe_role}",
        target_role=safe_role,
        estimated_months=safe_months,
        target_salary_lpa=safe_salary,
        difficulty="Low",
        description=f"Directly leverages your {p_role} foundation. Fast-track recovery and immediate market employability.",
        roadmap=[
            PathwayStep(
                week_range="Weeks 1-4",
                title="Foundations & Tooling Alignment",
                description=f"Validate core competencies in {', '.join(safe_skills[:2])}.",
                skills_covered=safe_skills[:2],
                courses=safe_courses_1,
            ),
            PathwayStep(
                week_range="Weeks 5-8",
                title="Hands-on Portfolio & Micro-Certification",
                description=f"Execute end-to-end practical deliverables utilizing {', '.join(safe_skills[2:4])}.",
                skills_covered=safe_skills[2:4],
                courses=safe_courses_2,
            ),
        ],
    )

    # Stretch Pathway Roadmap
    part1_skills = missing_stretch[:2] if len(missing_stretch) >= 2 else missing_stretch
    part2_skills = missing_stretch[2:4] if len(missing_stretch) >= 4 else missing_stretch[1:3]
    part3_skills = missing_stretch[4:] if len(missing_stretch) > 4 else ["Portfolio Capstone", "System Architecture"]

    stretch_courses_1 = _find_matching_courses(all_courses, part1_skills)
    stretch_courses_2 = _find_matching_courses(all_courses, part2_skills if part2_skills else part1_skills)
    stretch_courses_3 = _find_matching_courses(all_courses, part3_skills)

    stretch_pathway = PathwayOption(
        type="Stretch",
        title=f"High Growth Leap: {stretch_role}",
        target_role=stretch_role,
        estimated_months=stretch_months,
        target_salary_lpa=stretch_salary,
        difficulty="High",
        description=f"Target frontier high-demand opportunities with comprehensive project proofs in {stretch_role}.",
        roadmap=[
            PathwayStep(
                week_range="Weeks 1-4",
                title="Foundational Competencies & Architecture",
                description=f"Bridge essential concepts: {', '.join(part1_skills)}.",
                skills_covered=part1_skills,
                courses=stretch_courses_1,
            ),
            PathwayStep(
                week_range="Weeks 5-10",
                title="Framework Implementation & Deep Execution",
                description=f"Build production-grade applications with {', '.join(part2_skills)}.",
                skills_covered=part2_skills,
                courses=stretch_courses_2,
            ),
            PathwayStep(
                week_range="Weeks 11-16",
                title="Production Deployment & AI Talent Passport",
                description=f"Deploy live capstone project showcasing {', '.join(part3_skills)}.",
                skills_covered=part3_skills,
                courses=stretch_courses_3,
            ),
        ],
    )

    # Pivot Pathway Roadmap
    pivot_part1 = missing_pivot[:2]
    pivot_part2 = missing_pivot[2:4] if len(missing_pivot) > 2 else pivot_skills[:2]

    pivot_courses_1 = _find_matching_courses(all_courses, pivot_part1)
    pivot_courses_2 = _find_matching_courses(all_courses, pivot_part2)

    pivot_pathway = PathwayOption(
        type="Pivot",
        title=f"Cross-Domain Transition: {pivot_role}",
        target_role=pivot_role,
        estimated_months=pivot_months,
        target_salary_lpa=pivot_salary,
        difficulty="Medium",
        description=f"Translate transferable intuition from {p_role} into the expanding {pivot_role} ecosystem.",
        roadmap=[
            PathwayStep(
                week_range="Weeks 1-6",
                title="Crossover Fundamentals & Core Pipeline",
                description=f"Master fundamental domain tooling in {', '.join(pivot_part1)}.",
                skills_covered=pivot_part1,
                courses=pivot_courses_1,
            ),
            PathwayStep(
                week_range="Weeks 7-12",
                title="Domain Project & Transition Proof",
                description=f"Apply advanced workflows using {', '.join(pivot_part2)}.",
                skills_covered=pivot_part2,
                courses=pivot_courses_2,
            ),
        ],
    )

    if not quote:
        quote = f"{p_name}, every master was once a beginner. With focused milestones, your transition to {stretch_role} is well within reach."

    return PathwayResponse(
        profile_id=profile_id,
        motivation_quote=quote,
        pathways=[safe_pathway, stretch_pathway, pivot_pathway],
    )


def generate_pathways(profile: Profile | dict) -> PathwayResponse:
    """Synchronous entrypoint."""
    return generate_pathways_sync(profile, None)


async def generate_pathways_async(profile: Profile | dict) -> PathwayResponse:
    """Asynchronous entrypoint attaching personalized motivation quote from LLM."""
    if isinstance(profile, dict):
        p_name = profile.get("name", "Learner")
        p_target = profile.get("target_role") or "Software Engineer"
        u_type = str(profile.get("user_type", "stagnant"))
    else:
        p_name = profile.name or "Learner"
        p_target = profile.target_role or "Software Engineer"
        u_type = profile.user_type.value if hasattr(profile.user_type, "value") else str(profile.user_type)

    quote = await _generate_motivation_quote(p_name, p_target, u_type)
    return generate_pathways_sync(profile, quote)
