"""Onboarding session persistence — keyed by user_id (engine v2)."""
from datetime import datetime
from sqlalchemy import String, JSON, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class OnboardingSession(Base):
    __tablename__ = "onboarding_sessions"

    # PK is the auth user_id so there is at most one active session per user
    user_id: Mapped[str] = mapped_column(String(36), primary_key=True)

    # Full engine state dict (new_state / handle_message / apply_resume output)
    engine_state: Mapped[dict | None] = mapped_column(JSON, default=None, nullable=True)

    # Denormalised for fast reads on GET /session
    profile_draft: Mapped[dict] = mapped_column(JSON, default=dict)
    segment: Mapped[str] = mapped_column(String(32), default="detecting")
    done: Mapped[bool] = mapped_column(default=False)

    # Legacy slot field kept for migration compat (unused by engine v2)
    current_slot: Mapped[str] = mapped_column(String(64), default="current_role")

    # Last N turns of conversation (list of {role, content})
    history: Mapped[list] = mapped_column(JSON, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
