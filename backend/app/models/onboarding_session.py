"""Onboarding session persistence — keyed by user_id (Agent v2)."""
from datetime import datetime
from sqlalchemy import String, JSON, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class OnboardingSession(Base):
    __tablename__ = "onboarding_sessions"

    # PK is the auth user_id so there is at most one active session per user
    user_id: Mapped[str] = mapped_column(String(36), primary_key=True)

    # Slot-filling state: dict of collected field values
    profile_draft: Mapped[dict] = mapped_column(JSON, default=dict)

    # Which slot the state machine is currently waiting on
    current_slot: Mapped[str] = mapped_column(String(64), default="current_role")

    # Detected segment (no default "returner" - detecting until classified)
    segment: Mapped[str] = mapped_column(String(32), default="detecting")

    # Whether the confirm action has been received
    done: Mapped[bool] = mapped_column(default=False)

    # Last 6 turns of conversation (list of {role, content})
    history: Mapped[list] = mapped_column(JSON, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
