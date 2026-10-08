from typing import Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict, field_validator
from app.models.profile import UserType


class ProfileBase(BaseModel):
    name: str
    email: str | None = None
    user_type: UserType
    city: str | None = None
    current_city: str | None = None
    preferred_city: str | None = None
    gap_reason: str | None = None
    achievements: list[str] = []
    current_role: str | None = None
    target_role: str | None = None
    experience_years: int = 0
    career_gap_years: float = 0.0
    current_salary_lpa: float | None = None
    skills_raw: list[str] = []
    skills_taxonomy_ids: list[int] = []
    resume_text: str | None = None

    @field_validator("achievements", "skills_raw", "skills_taxonomy_ids", mode="before")
    @classmethod
    def _coerce_none_to_list(cls, v: Any) -> list:
        if v is None:
            return []
        if isinstance(v, list):
            return v
        return list(v) if hasattr(v, "__iter__") and not isinstance(v, (str, bytes)) else [str(v)]



class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    user_type: UserType | None = None
    city: str | None = None
    current_city: str | None = None
    preferred_city: str | None = None
    gap_reason: str | None = None
    achievements: list[str] | None = None
    current_role: str | None = None
    target_role: str | None = None
    experience_years: int | None = None
    career_gap_years: float | None = None
    current_salary_lpa: float | None = None
    skills_raw: list[str] | None = None
    skills_taxonomy_ids: list[int] | None = None
    resume_text: str | None = None


class ProfileRead(ProfileBase):
    id: str
    user_id: str | None = None
    disruption_score: float | None = None
    disruption_breakdown: dict | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
