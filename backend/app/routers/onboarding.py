"""
Onboarding chat and session endpoints — auth-required, rate-limited 20 req/min per user (Agent v2).
"""
import time
from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.onboarding import (
    OnboardingChatRequest,
    OnboardingChatResponse,
    OnboardingSessionResponse,
)
from app.services.onboarding_agent import (
    get_session_state,
    handle_onboarding_chat,
)

router = APIRouter(prefix="/onboarding", tags=["Onboarding Agent"])

# ── In-process rate limit: 20 requests / 60 s per user_id ────────────────────
_rate_store: dict[str, list[float]] = defaultdict(list)
_RATE_LIMIT = 20
_RATE_WINDOW = 60.0  # seconds


def _check_rate_limit(user_id: str) -> None:
    now = time.monotonic()
    window_start = now - _RATE_WINDOW
    timestamps = _rate_store[user_id]
    # Prune timestamps outside the window
    _rate_store[user_id] = [t for t in timestamps if t > window_start]
    if len(_rate_store[user_id]) >= _RATE_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded: 20 requests per minute. Please slow down.",
            headers={"Retry-After": "60"},
        )
    _rate_store[user_id].append(now)


@router.get("/session", response_model=OnboardingSessionResponse)
async def get_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> OnboardingSessionResponse:
    """
    Restore onboarding session on refresh (Agent v2).
    Returns persisted profile_draft, current_slot, segment, done, and conversation history.
    """
    state = await get_session_state(user=current_user, db=db)
    return OnboardingSessionResponse(**state)


@router.post("/chat", response_model=OnboardingChatResponse)
async def chat_onboarding(
    req: OnboardingChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> OnboardingChatResponse:
    """
    Conversational onboarding agent — Agent v2.

    - Requires a valid Bearer token (login or signup first).
    - Rate-limited: 20 requests per minute per user.
    - session_id is accepted for API compatibility but session state is keyed by user_id in DB.
    - Set action='confirm' (not text) to finalise the profile.
    """
    _check_rate_limit(current_user.id)

    return await handle_onboarding_chat(
        user=current_user,
        db=db,
        message=req.message,
        resume_text=req.resume_text,
        action=req.action,
    )
