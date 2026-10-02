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
