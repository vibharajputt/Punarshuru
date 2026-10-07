import json
from pathlib import Path
from typing import Any
from app.schemas.market import TrendsResponse, SkillTrendItem

DATA_DIR = Path(__file__).parent.parent / "data"


def _load_json(filename: str) -> Any:
    path = DATA_DIR / filename
    if path.exists():
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return []


def get_market_trends() -> TrendsResponse:
    """
    Market Trends Engine:
    - Analyzes rising, declining, and stable skills
    - Calculates average salaries by city
    - Aggregates top in-demand skills and trending roles
    """
    skills = _load_json("skills_taxonomy.json")
    jobs = _load_json("jobs_snapshot.json")

    rising = [
        SkillTrendItem(
            id=s["id"],
            name=s["name"],
            category=s["category"],
            demand_trend=s["demand_trend"],
            automation_risk=s["automation_risk"],
        )
        for s in skills
        if s.get("demand_trend") == "rising"
    ]

    declining = [
        SkillTrendItem(
            id=s["id"],
            name=s["name"],
            category=s["category"],
            demand_trend=s["demand_trend"],
            automation_risk=s["automation_risk"],
        )
        for s in skills
        if s.get("demand_trend") == "declining"
    ]

    stable = [
        SkillTrendItem(
            id=s["id"],
            name=s["name"],
            category=s["category"],
            demand_trend=s["demand_trend"],
            automation_risk=s["automation_risk"],
        )
        for s in skills
        if s.get("demand_trend") == "stable"
    ]

    # Skill frequency across all jobs
    skill_counter: dict[str, int] = {}
    city_salaries: dict[str, list[float]] = {}
    role_counter: dict[str, int] = {}

    for job in jobs:
        for sk in job.get("required_skills", []):
            skill_counter[sk] = skill_counter.get(sk, 0) + 1
        
        city = job.get("city", "Remote")
        avg_sal = (job.get("salary_min_lpa", 10) + job.get("salary_max_lpa", 20)) / 2.0
        if city not in city_salaries:
            city_salaries[city] = []
        city_salaries[city].append(avg_sal)

        role = job.get("title", "")
        if role:
            role_counter[role] = role_counter.get(role, 0) + 1

    top_demanded = [k for k, _ in sorted(skill_counter.items(), key=lambda x: x[1], reverse=True)[:10]]
    
    salary_by_city = {
        city: round(sum(sals) / len(sals), 1)
        for city, sals in city_salaries.items()
    }

    # Prefer high-sample ML city averages from 15,841 jobs if available
    from app.services.salary_ml import get_city_averages
    ml_city_avg = get_city_averages()
    for c_name, c_val in ml_city_avg.items():
        if c_name not in salary_by_city and c_val > 0:
            salary_by_city[c_name] = c_val


    best_fit_roles = [k for k, _ in sorted(role_counter.items(), key=lambda x: x[1], reverse=True)[:8]]

    return TrendsResponse(
        rising=rising[:25],
        declining=declining[:15],
        stable=stable[:20],
        total_skills=len(skills),
        top_demanded_skills=top_demanded,
        salary_by_city=salary_by_city,
        best_fit_roles=best_fit_roles,
    )


def get_role_details(role_id: int) -> dict | None:
    jobs = _load_json("jobs_snapshot.json")
    return next((j for j in jobs if j["id"] == role_id), None)


def get_all_roles(query: str = "", city: str = "", limit: int = 50) -> list[dict]:
    """Retrieve jobs snapshot filtered by title/skill query and city."""
    jobs = _load_json("jobs_snapshot.json")
    q = query.lower().strip()
    c = city.lower().strip()
    filtered = []
    for j in jobs:
        if q:
            title_match = q in j.get("title", "").lower()
            skill_match = any(q in s.lower() for s in j.get("required_skills", []))
            if not (title_match or skill_match):
                continue
        if c and c != "all":
            if c not in j.get("city", "").lower():
                continue
        filtered.append(j)
        if len(filtered) >= limit:
            break
    return filtered

