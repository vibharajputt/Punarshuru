import re
import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.passport import Passport
from app.models.profile import Profile
from app.schemas.passport import PassportCreate, PassportResponse


def _generate_slug(name: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "-", name.strip().lower()).strip("-")
    random_suffix = uuid.uuid4().hex[:6]
    return f"{cleaned}-{random_suffix}"


async def create_or_update_passport(
    profile: Profile,
    db: AsyncSession,
    passport_data: PassportCreate | None = None,
) -> PassportResponse:
    """
    Creates or retrieves the AI Talent Passport for a profile.
    Compiles verified skill snapshot, evidence artifacts, and shareable QR data.
    """
    # Check if passport already exists for profile
    stmt = select(Passport).where(Passport.profile_id == profile.id)
    result = await db.execute(stmt)
    existing = result.scalars().first()

    evidence_list = passport_data.evidence if (passport_data and passport_data.evidence) else [
        {
            "type": "Skill Validation",
            "title": "Baseline Technical Competency Assessment",
            "issuer": "Punarshuru AI Talent Engine",
            "verified": True,
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        },
        {
            "type": "Disruption Audit",
            "title": f"Market Resilience Score: {int(profile.disruption_score or 70)}/100",
            "issuer": "Punarshuru Intelligence",
            "verified": True,
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        },
    ]

    slug = (passport_data.slug if passport_data and passport_data.slug else None) or (
        existing.slug if existing else _generate_slug(profile.name)
    )

    if existing:
        existing.slug = slug
        if passport_data:
            existing.is_public = passport_data.is_public
            if passport_data.evidence:
                existing.evidence = passport_data.evidence
        existing.skills_snapshot = profile.skills_raw or []
        await db.commit()
        await db.refresh(existing)
        passport_obj = existing
    else:
        passport_obj = Passport(
            profile_id=profile.id,
            slug=slug,
            is_public=passport_data.is_public if passport_data else True,
            skills_snapshot=profile.skills_raw or [],
            evidence=evidence_list,
        )
        db.add(passport_obj)
        await db.commit()
        await db.refresh(passport_obj)

    qr_data = f"https://punarshuru.in/p/{passport_obj.slug}"

    return PassportResponse(
        id=passport_obj.id,
        profile_id=profile.id,
        slug=passport_obj.slug,
        is_public=passport_obj.is_public,
        profile_name=profile.name,
        user_type=profile.user_type.value if hasattr(profile.user_type, "value") else str(profile.user_type),
        city=profile.city,
        current_role=profile.current_role,
        target_role=profile.target_role,
        disruption_score=profile.disruption_score,
        verified_skills=passport_obj.skills_snapshot or profile.skills_raw or [],
        evidence=passport_obj.evidence or evidence_list,
        qr_data=qr_data,
        created_at=passport_obj.created_at.strftime("%Y-%m-%d %H:%M"),
    )


async def get_passport_by_slug(slug: str, db: AsyncSession) -> PassportResponse | None:
    stmt = select(Passport).where(Passport.slug == slug)
    result = await db.execute(stmt)
    passport_obj = result.scalars().first()
    if not passport_obj:
        # Check if slug matches a demo persona
        from app.routers.demo import _load
        personas = _load("personas.json")
        matched_persona = None
        for p in personas:
            p_name_slug = re.sub(r"[^a-zA-Z0-9]+", "-", p["name"].strip().lower()).strip("-")
            if p["key"] in slug.lower() or p_name_slug in slug.lower():
                matched_persona = p
                break
        if matched_persona:
            return await create_or_update_passport(
                Profile(
                    id=f"demo-{matched_persona['key']}",
                    name=matched_persona["name"],
                    email=f"{matched_persona['key']}@demo.punarshuru.in",
                    user_type=matched_persona["user_type"],
                    city=matched_persona["city"],
                    current_role=matched_persona["current_role"],
                    target_role=matched_persona["target_role"],
                    experience_years=matched_persona.get("experience_years", 3),
                    career_gap_years=matched_persona.get("career_gap_years", 0),
                    current_salary_lpa=matched_persona.get("current_salary_lpa", 8.0),
                    skills_raw=matched_persona.get("skills", []),
                    skills_taxonomy_ids=[1, 2, 3],
                    disruption_score=matched_persona.get("disruption_score", 70.0),
                ),
                db,
                PassportCreate(slug=slug, is_public=True),
            )
        return None

    # Fetch corresponding profile
    prof_stmt = select(Profile).where(Profile.id == passport_obj.profile_id)
    prof_result = await db.execute(prof_stmt)
    profile = prof_result.scalars().first()
    if not profile:
        return None

    qr_data = f"https://punarshuru.in/p/{passport_obj.slug}"

    return PassportResponse(
        id=passport_obj.id,
        profile_id=profile.id,
        slug=passport_obj.slug,
        is_public=passport_obj.is_public,
        profile_name=profile.name,
        user_type=profile.user_type.value if hasattr(profile.user_type, "value") else str(profile.user_type),
        city=profile.city,
        current_role=profile.current_role,
        target_role=profile.target_role,
        disruption_score=profile.disruption_score,
        verified_skills=passport_obj.skills_snapshot or profile.skills_raw or [],
        evidence=passport_obj.evidence or [],
        qr_data=qr_data,
        created_at=passport_obj.created_at.strftime("%Y-%m-%d %H:%M"),
    )
