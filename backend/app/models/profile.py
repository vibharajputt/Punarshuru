from datetime import datetime
import uuid
from sqlalchemy import String, Text, Integer, Float, JSON, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
import enum


class UserType(str, enum.Enum):
    returner = "returner"
    gig = "gig"
    laid_off = "laid_off"
    stagnant = "stagnant"
    student = "student"


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str | None] = mapped_column(String(254), nullable=True, unique=True)
    user_type: Mapped[UserType] = mapped_column(Enum(UserType))

    city: Mapped[str | None] = mapped_column(String(60), nullable=True)
    current_role: Mapped[str | None] = mapped_column(String(120), nullable=True)
    target_role: Mapped[str | None] = mapped_column(String(120), nullable=True)
    experience_years: Mapped[int] = mapped_column(Integer, default=0)
    career_gap_years: Mapped[float] = mapped_column(Float, default=0.0)
    current_salary_lpa: Mapped[float | None] = mapped_column(Float, nullable=True)

    skills_raw: Mapped[list] = mapped_column(JSON, default=list)        # list[str]
    skills_taxonomy_ids: Mapped[list] = mapped_column(JSON, default=list)  # list[int]

    resume_text: Mapped[str | None] = mapped_column(Text, nullable=True)

    disruption_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    disruption_breakdown: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
