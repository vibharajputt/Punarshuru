from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.profile import Profile
from app.schemas.disruption import DisruptionResponse
from app.schemas.gap import SkillGapResponse
from app.services.disruption import calculate_disruption_score, _load_json
from app.services.gap import analyze_skill_gap

router = APIRouter(prefix="/assess", tags=["Assessment"])


@router.get("/{profile_id}/disruption", response_model=DisruptionResponse)
async def get_disruption_assessment(
    profile_id: str,
    db: AsyncSession = Depends(get_db),
) -> DisruptionResponse:
    """Evaluate career disruption index, breakdown scores, reasons, risks and strengths."""
    stmt = select(Profile).where(Profile.id == profile_id)
    res = await db.execute(stmt)
    profile = res.scalars().first()
    if not profile:
        key = profile_id.replace("demo-", "")
        personas = _load_json("personas.json")
        demo_persona = next((p for p in personas if p.get("key") == key or p.get("id") == profile_id), None)
        if demo_persona:
            return calculate_disruption_score(demo_persona)
        raise HTTPException(status_code=404, detail=f"Profile '{profile_id}' not found")

    assessment = calculate_disruption_score(profile)

    # Persist updated score on profile
    profile.disruption_score = assessment.score
    profile.disruption_breakdown = assessment.breakdown.model_dump()
    await db.commit()

    return assessment


@router.get("/{profile_id}/gap", response_model=SkillGapResponse)
async def get_skill_gap_assessment(
    profile_id: str,
    role: str | None = Query(None, description="Optional target role override"),
    db: AsyncSession = Depends(get_db),
) -> SkillGapResponse:
    """Analyze skill overlap, partial matches, missing competencies and radar distribution."""
    stmt = select(Profile).where(Profile.id == profile_id)
    res = await db.execute(stmt)
    profile = res.scalars().first()
    if not profile:
        key = profile_id.replace("demo-", "")
        personas = _load_json("personas.json")
        demo_persona = next((p for p in personas if p.get("key") == key or p.get("id") == profile_id), None)
        if demo_persona:
            target_role = role or demo_persona.get("target_role") or "Software Engineer"
            return analyze_skill_gap(demo_persona, target_role=target_role)
        raise HTTPException(status_code=404, detail=f"Profile '{profile_id}' not found")

    target_role = role or profile.target_role or "Software Engineer"
    return analyze_skill_gap(profile, target_role=target_role)
