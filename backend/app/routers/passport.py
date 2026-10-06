from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.profile import Profile
from app.schemas.passport import PassportCreate, PassportResponse
from app.services.passport import create_or_update_passport, get_passport_by_slug

router = APIRouter(prefix="/passport", tags=["AI Talent Passport"])


@router.post("/{profile_id}", response_model=PassportResponse)
async def generate_passport(
    profile_id: str,
    passport_data: PassportCreate | None = None,
    db: AsyncSession = Depends(get_db),
) -> PassportResponse:
    """Generate or update an AI Talent Passport for a candidate."""
    stmt = select(Profile).where(Profile.id == profile_id)
    res = await db.execute(stmt)
    profile = res.scalars().first()
    if not profile:
        demo_key = profile_id.replace("demo-", "").lower()
        from app.routers.demo import _load
        personas = _load("personas.json")
        p_data = next((p for p in personas if p["key"] == demo_key), None)
        if p_data:
            stmt = select(Profile).where(Profile.email == f"{demo_key}@demo.punarshuru.in")
            res = await db.execute(stmt)
            profile = res.scalars().first()
            if not profile:
                profile = Profile(
                    id=f"demo-{demo_key}",
                    name=p_data["name"],
                    email=f"{demo_key}@demo.punarshuru.in",
                    user_type=p_data["user_type"],
                    city=p_data["city"],
                    current_role=p_data["current_role"],
                    target_role=p_data["target_role"],
                    experience_years=p_data.get("experience_years", 3),
                    career_gap_years=p_data.get("career_gap_years", 0),
                    current_salary_lpa=p_data.get("current_salary_lpa", 8.0),
                    skills_raw=p_data.get("skills", []),
                    skills_taxonomy_ids=[1, 2, 3],
                    disruption_score=p_data.get("disruption_score", 70.0),
                )
                db.add(profile)
                await db.commit()
                await db.refresh(profile)
        else:
            raise HTTPException(status_code=404, detail=f"Profile '{profile_id}' not found")

    return await create_or_update_passport(profile, db, passport_data)


@router.get("/{slug}", response_model=PassportResponse)
async def get_passport(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> PassportResponse:
    """Retrieve public AI Talent Passport by unique URL slug."""
    passport = await get_passport_by_slug(slug, db)
    if not passport:
        raise HTTPException(status_code=404, detail=f"Passport with slug '{slug}' not found")
    return passport
