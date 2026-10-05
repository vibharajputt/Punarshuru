from pydantic import BaseModel, Field


class ResumeParseRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Raw text of resume")


class ResumeParseResponse(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    city: str | None = None
    current_city: str | None = None
    preferred_city: str | None = None
    gap_reason: str | None = None
    achievements: list[str] = Field(default_factory=list)
    current_role: str | None = None
    target_role: str | None = None
    experience_years: int = 0
    career_gap_years: float = 0.0
    skills: list[str] = Field(default_factory=list)
    education: str | None = None
    summary: str | None = None
    resume_text: str | None = None
    user_type: str | None = None
    confidence_score: float = Field(default=0.85)
