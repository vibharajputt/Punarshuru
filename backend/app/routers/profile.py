from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileRead, ProfileUpdate
from app.schemas.resume import ResumeParseRequest, ResumeParseResponse
from app.services.disruption import calculate_disruption_score
from app.services.resume_parser import parse_resume_text

router = APIRouter(tags=["Profile"])


@router.post("/profile", response_model=ProfileRead, status_code=status.HTTP_201_CREATED)
async def create_profile(
    profile_in: ProfileCreate,
    db: AsyncSession = Depends(get_db),
) -> ProfileRead:
    """Create a new user profile and automatically compute initial disruption score."""
    profile = Profile(**profile_in.model_dump())
    
    # Pre-calculate disruption
    disruption_res = calculate_disruption_score(profile)
    profile.disruption_score = disruption_res.score
    profile.disruption_breakdown = disruption_res.breakdown.model_dump()

    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return ProfileRead.model_validate(profile)


@router.get("/profile/{profile_id}", response_model=ProfileRead)
async def get_profile(
    profile_id: str,
    db: AsyncSession = Depends(get_db),
) -> ProfileRead:
    """Fetch user profile by ID."""
    stmt = select(Profile).where(Profile.id == profile_id)
    res = await db.execute(stmt)
    profile = res.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail=f"Profile '{profile_id}' not found")
    return ProfileRead.model_validate(profile)


@router.put("/profile/{profile_id}", response_model=ProfileRead)
async def update_profile(
    profile_id: str,
    profile_update: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
) -> ProfileRead:
    """Update profile details and re-calculate disruption score."""
    stmt = select(Profile).where(Profile.id == profile_id)
    res = await db.execute(stmt)
    profile = res.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail=f"Profile '{profile_id}' not found")

    update_data = profile_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    disruption_res = calculate_disruption_score(profile)
    profile.disruption_score = disruption_res.score
    profile.disruption_breakdown = disruption_res.breakdown.model_dump()

    await db.commit()
    await db.refresh(profile)
    return ProfileRead.model_validate(profile)


@router.post("/profile/parse-resume", response_model=ResumeParseResponse)
async def parse_resume(req: ResumeParseRequest) -> ResumeParseResponse:
    """Extract profile fields and skills from resume text using AI with regex fallback."""
    return await parse_resume_text(req.resume_text)
