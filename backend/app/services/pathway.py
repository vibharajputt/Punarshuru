import asyncio
import json
from pathlib import Path
from typing import Any
from app.core.config import get_settings
from app.models.profile import Profile, UserType
from app.schemas.pathway import PathwayResponse, PathwayOption, PathwayStep, MilestoneCourse

DATA_DIR = Path(__file__).parent.parent / "data"
settings = get_settings()


def _load_json(filename: str) -> Any:
    path = DATA_DIR / filename
    if path.exists():
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return []


async def _generate_motivation_quote(profile_name: str, target_role: str, user_type: str) -> str:
    """
    Call Gemini API with 8s timeout for personalized motivation line.
    Falls back gracefully if no API key or on error/timeout.
    """
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

    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
        return default_quote

    try:
        import google.generativeai as genai  # type: ignore

        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")

        async def _call():
            loop = asyncio.get_running_loop()
            prompt = (
                f"Write a short, powerful, 1-2 sentence inspiring motivation line for {profile_name}, "
                f"a '{user_type}' candidate in India working toward becoming a '{target_role}'. "
                f"Be authentic, culturally resonant for Bharat, encouraging, and actionable without cheesy cliches."
            )
            resp = await loop.run_in_executor(None, lambda: model.generate_content(prompt))
            return resp.text.strip().replace('"', '')

        # 8 second timeout per SPEC
        return await asyncio.wait_for(_call(), timeout=8.0)
    except Exception:
        return default_quote


def generate_pathways(profile: Profile | dict) -> PathwayResponse:
    """Synchronous generator with default quote (async caller can attach AI quote)"""
    return generate_pathways_sync(profile, None)


async def generate_pathways_async(profile: Profile | dict) -> PathwayResponse:
    if isinstance(profile, dict):
        p_name = profile.get("name", "Learner")
        p_target = profile.get("target_role") or "Software Engineer"
        u_type = profile.get("user_type", "stagnant")
    else:
        p_name = profile.name or "Learner"
        p_target = profile.target_role or "Software Engineer"
        u_type = profile.user_type.value if hasattr(profile.user_type, "value") else str(profile.user_type)

    quote = await _generate_motivation_quote(p_name, p_target, u_type)
    return generate_pathways_sync(profile, quote)


def generate_pathways_sync(profile: Profile | dict, quote: str | None = None) -> PathwayResponse:
    if isinstance(profile, dict):
        profile_id = str(profile.get("id", "temp-id"))
        p_name = profile.get("name", "Learner")
        p_role = profile.get("current_role") or "Professional"
        p_target = profile.get("target_role") or "Software Engineer"
        u_type = profile.get("user_type", "stagnant")
        skills_raw = profile.get("skills_raw", []) or []
    else:
        profile_id = str(profile.id)
        p_name = profile.name or "Learner"
        p_role = profile.current_role or "Professional"
        p_target = profile.target_role or "Software Engineer"
        u_type = profile.user_type.value if hasattr(profile.user_type, "value") else str(profile.user_type)
        skills_raw = profile.skills_raw or []

    all_courses = _load_json("courses.json")

    # Helper to find courses for skills
    def find_courses(keywords: list[str], limit: int = 2) -> list[MilestoneCourse]:
        found = []
        for c in all_courses:
            title_lower = c["title"].lower()
            if any(k.lower() in title_lower for k in keywords):
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
                if len(found) >= limit:
                    break
        if not found and all_courses:
            # Fallback to high rated general course
            c = all_courses[0]
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

    # 1. Safe Pathway: Low friction, building directly on existing strengths
    safe_target = f"Modern {p_role}" if "student" not in u_type else "Junior Software Engineer"
    safe_courses_1 = find_courses(["python", "java", "sql", "git"])
    safe_courses_2 = find_courses(["docker", "fastapi", "spring", "agile"])
    safe_option = PathwayOption(
        type="Safe",
        title=f"Refresh & Strengthen: {safe_target}",
        target_role=safe_target,
        estimated_months=2,
        target_salary_lpa=8.5,
        difficulty="Low",
        description="Re-validate existing foundations with modern tooling and quick micro-certifications.",
        roadmap=[
            PathwayStep(
                week_range="Weeks 1-4",
                title="Core Stack Refresh & Modernization",
                description="Bridge version gaps and practice hands-on coding in modern environment.",
                skills_covered=["Core Fundamentals", "Git & GitHub", "Clean Code"],
                courses=safe_courses_1,
            ),
            PathwayStep(
                week_range="Weeks 5-8",
                title="Mini-Project & Proof of Execution",
                description="Build 1 production-ready sample application with CI/CD deployment.",
                skills_covered=["REST APIs", "Docker Basics", "Testing"],
                courses=safe_courses_2,
            ),
        ],
    )

    # 2. Stretch Pathway: Ambitious target role (e.g. GenAI, Fullstack, Cloud)
    stretch_target = p_target or "GenAI Engineer"
    stretch_courses_1 = find_courses(["python", "machine learning", "data science"])
    stretch_courses_2 = find_courses(["deep learning", "ai", "cloud", "natural language"])
    stretch_courses_3 = find_courses(["full stack", "react", "fastapi"])
    stretch_option = PathwayOption(
        type="Stretch",
        title=f"High Growth Leap: {stretch_target}",
        target_role=stretch_target,
        estimated_months=4,
        target_salary_lpa=16.0,
        difficulty="High",
        description="Target high-demand frontier roles with comprehensive hands-on project artifacts.",
        roadmap=[
            PathwayStep(
                week_range="Weeks 1-4",
                title="AI & Modern Backend Foundations",
                description="Master Python data structures, vector embeddings, and API fundamentals.",
                skills_covered=["Python", "Vector Databases", "Prompt Engineering"],
                courses=stretch_courses_1,
            ),
            PathwayStep(
                week_range="Weeks 5-10",
                title="LLM Frameworks & RAG Architecture",
                description="Implement Retrieval Augmented Generation systems with LangChain/LlamaIndex.",
                skills_covered=["LangChain", "RAG Pipelines", "Embeddings"],
                courses=stretch_courses_2,
            ),
            PathwayStep(
                week_range="Weeks 11-16",
                title="Capstone Deployment & AI Talent Passport",
                description="Deploy a full-stack GenAI application and publish live demo with verified code proofs.",
                skills_covered=["System Design", "Cloud Hosting", "Evaluation Metrics"],
                courses=stretch_courses_3,
            ),
        ],
    )

    # 3. Pivot Pathway: Adjacent domain with high hiring demand
    pivot_target = "Automation & Tech Operations" if u_type in ["gig", "stagnant"] else "DevOps & Cloud Engineer"
    pivot_courses_1 = find_courses(["devops", "linux", "cloud computing"])
    pivot_courses_2 = find_courses(["agile", "analytics", "power bi", "cybersecurity"])
    pivot_option = PathwayOption(
        type="Pivot",
        title=f"Cross-Domain Transition: {pivot_target}",
        target_role=pivot_target,
        estimated_months=3,
        target_salary_lpa=12.0,
        difficulty="Medium",
        description="Leverage your domain intuition while pivoting into a rapidly expanding tech function.",
        roadmap=[
            PathwayStep(
                week_range="Weeks 1-6",
                title="Operational Tools & Cloud Fundamentals",
                description="Learn Linux administration, cloud infrastructure, and automated scripting.",
                skills_covered=["Linux", "Cloud Basics", "Scripting"],
                courses=pivot_courses_1,
            ),
            PathwayStep(
                week_range="Weeks 7-12",
                title="Workflow Automation & Metrics Dashboarding",
                description="Set up end-to-end monitoring pipelines and cross-functional operations.",
                skills_covered=["Automation", "Monitoring", "Process Optimization"],
                courses=pivot_courses_2,
            ),
        ],
    )

    if not quote:
        quote = f"{p_name}, every career transition is built one verified milestone at a time. Pick your pace and start building."

    return PathwayResponse(
        profile_id=profile_id,
        motivation_quote=quote,
        pathways=[safe_option, stretch_option, pivot_option],
    )
