"""
Onboarding chat and session endpoints (engine v2 — no LLM in chat path).

POST  /api/onboarding/chat    auth-required, rate-limited 20 req/min
GET   /api/onboarding/session auth-required
DELETE /api/onboarding/session auth-required (reset / start-over)
"""
import re
import time
from collections import defaultdict
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.user import User
from app.models.profile import Profile, UserType
from app.models.onboarding_session import OnboardingSession
from app.routers.auth import get_current_user
from app.schemas.onboarding import (
    OnboardingChatRequest,
    OnboardingChatResponse,
    OnboardingSessionResponse,
)
from app.services.onboarding_engine import (
    new_state,
    apply_resume,
    handle_message,
    build_response,
    confirm as engine_confirm,
    is_complete,
)
from app.services.resume_parser import parse_resume_text

router = APIRouter(prefix="/onboarding", tags=["Onboarding Agent"])

# ── In-process rate limit: 20 requests / 60 s per user_id ────────────────────
_rate_store: dict[str, list[float]] = defaultdict(list)
_RATE_LIMIT = 20
_RATE_WINDOW = 60.0


def _check_rate_limit(user_id: str) -> None:
    now = time.monotonic()
    window_start = now - _RATE_WINDOW
    _rate_store[user_id] = [t for t in _rate_store[user_id] if t > window_start]
    if len(_rate_store[user_id]) >= _RATE_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded: 20 requests per minute. Please slow down.",
            headers={"Retry-After": "60"},
        )
    _rate_store[user_id].append(now)


async def _load_state(user: User, db: AsyncSession) -> dict:
    """Load engine state from DB, or create a fresh one."""
    result = await db.execute(
        select(OnboardingSession).where(OnboardingSession.user_id == user.id)
    )
    sess = result.scalar_one_or_none()
    if sess and sess.engine_state:
        return dict(sess.engine_state)
    return new_state(user.name, user.email)


async def _save_state(user: User, db: AsyncSession, state: dict) -> None:
    """Persist engine state to DB (upsert)."""
    result = await db.execute(
        select(OnboardingSession).where(OnboardingSession.user_id == user.id)
    )
    sess = result.scalar_one_or_none()
    out = build_response(state)
    draft = out["profile_draft"]

    if sess is None:
        sess = OnboardingSession(user_id=user.id)
        db.add(sess)

    sess.engine_state = state
    sess.profile_draft = draft
    sess.segment = out["segment"]
    sess.done = out["done"]
    # Keep a rolling history of the last 12 assistant messages
    if not sess.history:
        sess.history = []
    await db.commit()


async def _upsert_profile(user: User, db: AsyncSession, draft: dict) -> Profile:
    """Create or update the Profile row from confirmed draft data."""
    result = await db.execute(select(Profile).where(Profile.user_id == user.id))
    profile = result.scalar_one_or_none()

    raw_type = draft.get("user_type") or "stagnant"
    try:
        utype = UserType(raw_type)
    except ValueError:
        utype = UserType.stagnant

    cur_city = draft.get("current_city") or draft.get("city") or ""
    pref_city = draft.get("preferred_city") or ""
    gap_reason = draft.get("gap_reason") or None
    achievements = draft.get("achievements") or []

    if profile is None:
        profile = Profile(
            name=draft.get("name") or user.name,
            email=draft.get("email") or user.email,
            user_id=user.id,
            user_type=utype,
            city=cur_city,
            current_city=cur_city,
            preferred_city=pref_city,
            gap_reason=gap_reason,
            achievements=achievements,
            current_role=draft.get("current_role") or "",
            target_role=draft.get("target_role") or "",
            experience_years=int(draft.get("experience_years") or 0),
            career_gap_years=float(draft.get("career_gap_years") or 0.0),
            skills_raw=draft.get("skills_raw") or [],
            skills_taxonomy_ids=[],
        )
        db.add(profile)
    else:
        profile.user_type = utype
        profile.city = cur_city or profile.city
        profile.current_city = cur_city or profile.current_city
        profile.preferred_city = pref_city or profile.preferred_city
        if gap_reason:
            profile.gap_reason = gap_reason
        if achievements:
            profile.achievements = achievements
        profile.current_role = draft.get("current_role") or profile.current_role
        profile.target_role = draft.get("target_role") or profile.target_role
        profile.experience_years = int(draft.get("experience_years") or profile.experience_years)
        profile.career_gap_years = float(draft.get("career_gap_years") or profile.career_gap_years)
        profile.skills_raw = draft.get("skills_raw") or profile.skills_raw

    from app.services.disruption import calculate_disruption_score
    disruption_res = calculate_disruption_score(profile)
    profile.disruption_score = disruption_res.score
    profile.disruption_breakdown = disruption_res.breakdown.model_dump()

    await db.commit()
    await db.refresh(profile)
    return profile


# ── GET /session ──────────────────────────────────────────────────────────────

@router.get("/session", response_model=OnboardingSessionResponse)
async def get_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> OnboardingSessionResponse:
    """Restore session on page refresh."""
    state = await _load_state(current_user, db)
    out = build_response(state)
    return OnboardingSessionResponse(
        user_id=current_user.id,
        profile_draft=out["profile_draft"],
        current_slot=state.get("pending_slot") or "",
        segment=out["segment"],
        can_confirm=out["can_confirm"],
        done=out["done"],
        history=[],
    )


# ── DELETE /session ───────────────────────────────────────────────────────────

@router.delete("/session", status_code=204)
async def reset_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Reset (start-over) — deletes the session row; next chat will start fresh."""
    await db.execute(
        delete(OnboardingSession).where(OnboardingSession.user_id == current_user.id)
    )
    await db.commit()


# ── POST /chat ────────────────────────────────────────────────────────────────

@router.post("/chat", response_model=OnboardingChatResponse)
async def chat_onboarding(
    req: OnboardingChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> OnboardingChatResponse:
    """
    Deterministic slot-filling chat (no LLM).

    - resume_text  → apply_resume then build_response
    - action=confirm → confirm(); if done, upsert Profile
    - otherwise    → handle_message
    """
    _check_rate_limit(current_user.id)

    state = await _load_state(current_user, db)

    saved_profile: Profile | None = None
    if req.resume_text:
        parsed = await parse_resume_text(req.resume_text)
        state = apply_resume(state, parsed.model_dump())
        # Set persona category and laid_off flag detected from resume
        if parsed.user_type:
            state["draft"]["user_type"] = parsed.user_type
        if parsed.user_type == "laid_off" or re.search(r"\b(laid\s*off|layoff|fired|downsized)\b", req.resume_text, re.I):
            state["draft"]["laid_off"] = True
            state["draft"]["user_type"] = "laid_off"
        elif parsed.career_gap_years and parsed.career_gap_years >= 0.5:
            state["draft"]["user_type"] = "returner"

    elif req.action == "confirm":
        state = engine_confirm(state)
        if is_complete(state):
            out = build_response(state)
            saved_profile = await _upsert_profile(current_user, db, out["profile_draft"])

    else:
        # Check if user mentioned a calendar year for their last job/education/gap (e.g. 2023 -> 3yr gap in 2026)
        msg = (req.message or "").strip()
        current_year = datetime.now().year
        cal_year_match = re.search(r"\b(19\d{2}|20\d{2})\b", msg)
        if cal_year_match and not re.search(r"\b(present|current|now|till\s*date|ongoing)\b", msg, re.I):
            past_year = int(cal_year_match.group(1))
            if 1980 <= past_year <= current_year:
                is_gap_context = (
                    state.get("pending_slot") == "career_gap"
                    or bool(re.search(r"\b(tak|tk|till|until|left|graduated|pass\s*out|passout|khatam|over|se|since|last|ended|break|gap)\b", msg, re.I))
                )
                if is_gap_context:
                    computed_gap = float(current_year - past_year)
                    if computed_gap >= 0.5:
                        state["draft"]["career_gap_years"] = computed_gap
                        if state.get("pending_slot") == "career_gap":
                            state["pending_slot"] = None
                        if not state["draft"].get("user_type") or state["draft"]["user_type"] in ("detecting", "stagnant"):
                            state["draft"]["user_type"] = "returner"

        state = handle_message(state, msg)

    await _save_state(current_user, db, state)
    out = build_response(state)
    if saved_profile is not None:
        out["profile_draft"]["id"] = saved_profile.id
        out["profile_draft"]["disruption_score"] = saved_profile.disruption_score

    return OnboardingChatResponse(
        reply=out["reply"],
        quick_replies=out["quick_replies"],
        profile_draft=out["profile_draft"],
        missing_fields=out["missing_fields"],
        segment=out["segment"],
        can_confirm=out["can_confirm"],
        done=out["done"],
    )
