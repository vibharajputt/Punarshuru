"""
Seed script: loads all JSON data files and inserts the 5 demo personas into the DB.
Run: python -m app.scripts.seed
"""
import asyncio
import json
import uuid
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal, init_db
from app.models.profile import Profile, UserType

DATA_DIR = Path(__file__).parent.parent / "data"


def _load(filename: str):
    with open(DATA_DIR / filename, encoding="utf-8") as f:
        return json.load(f)


async def seed_personas(session: AsyncSession) -> None:
    personas = _load("personas.json")
    for p in personas:
        profile = Profile(
            id=str(uuid.uuid4()),
            name=p["name"],
            user_type=UserType(p["user_type"]),
            city=p.get("city"),
            current_role=p.get("current_role"),
            target_role=p.get("target_role"),
            experience_years=p.get("experience_years", 0),
            career_gap_years=p.get("career_gap_years", 0.0),
            current_salary_lpa=p.get("current_salary_lpa"),
            skills_raw=p.get("skills_raw", []),
            skills_taxonomy_ids=p.get("skills_taxonomy_ids", []),
            disruption_score=p.get("disruption_score"),
            disruption_breakdown=p.get("disruption_breakdown"),
        )
        session.add(profile)
    await session.commit()
    print(f"✅ Seeded {len(personas)} personas")


async def validate_data() -> None:
    skills = _load("skills_taxonomy.json")
    jobs = _load("jobs_snapshot.json")
    cities = _load("city_costs.json")
    courses = _load("courses.json")
    personas = _load("personas.json")

    assert len(skills) >= 250, f"Expected ≥250 skills, got {len(skills)}"
    assert len(jobs) >= 300, f"Expected ≥300 jobs, got {len(jobs)}"
    assert len(cities) == 12, f"Expected 12 cities, got {len(cities)}"
    assert len(courses) >= 120, f"Expected ≥120 courses, got {len(courses)}"
    assert len(personas) == 5, f"Expected 5 personas, got {len(personas)}"

    print("✅ Data validation passed:")
    print(f"   Skills: {len(skills)}, Jobs: {len(jobs)}, Cities: {len(cities)}, Courses: {len(courses)}, Personas: {len(personas)}")


async def main() -> None:
    print("🌱 Starting Punarshuru seed...")
    await validate_data()
    await init_db()
    async with AsyncSessionLocal() as session:
        await seed_personas(session)
    print("🎉 Seed complete!")


if __name__ == "__main__":
    asyncio.run(main())
