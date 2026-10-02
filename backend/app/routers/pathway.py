from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.profile import Profile
from app.schemas.pathway import PathwayResponse
from app.services.pathway import generate_pathways_async

router = APIRouter(tags=["Pathways"])


@router.get("/pathway/{profile_id}", response_model=PathwayResponse)
async def get_pathways_for_profile(
    profile_id: str,
    db: AsyncSession = Depends(get_db),
) -> PathwayResponse:
    """Generate Safe, Stretch, and Pivot learning pathways tailored to profile."""
    stmt = select(Profile).where(Profile.id == profile_id)
    res = await db.execute(stmt)
    profile = res.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail=f"Profile '{profile_id}' not found")

    return await generate_pathways_async(profile)
