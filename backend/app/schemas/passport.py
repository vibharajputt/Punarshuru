from pydantic import BaseModel, Field


class PassportCreate(BaseModel):
    slug: str | None = None
    is_public: bool = True
    evidence: list[dict] = Field(default_factory=list)


class PassportResponse(BaseModel):
    id: str
    profile_id: str
    slug: str
    is_public: bool
    profile_name: str
    user_type: str
    city: str | None = None
    current_role: str | None = None
    target_role: str | None = None
    disruption_score: float | None = None
    verified_skills: list[str] = Field(default_factory=list)
    evidence: list[dict] = Field(default_factory=list)
    qr_data: str
    created_at: str
    email: str | None = None
    phone: str | None = None
    linkedin: str | None = None
    github: str | None = None
    portfolio: str | None = None
    summary: str | None = None
    skills_breakdown: dict[str, list[str]] | None = None
    certifications: list[dict] = Field(default_factory=list)
    projects: list[dict] = Field(default_factory=list)
    experience: list[dict] = Field(default_factory=list)
    education: list[dict] = Field(default_factory=list)
    verification_hash: str | None = None

