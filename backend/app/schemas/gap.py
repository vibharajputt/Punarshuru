from pydantic import BaseModel, Field


class PartialSkill(BaseModel):
    skill: str
    matched_with: str
    similarity: float


class CategoryRadar(BaseModel):
    category: str
    have: int
    required: int
    pct: float


class HiddenStrength(BaseModel):
    strength: str
    crossover: str
    target: str


class SkillGapResponse(BaseModel):
    profile_id: str
    target_role: str
    match_pct: float = Field(..., description="Percentage of required skills met")
    have_skills: list[str] = Field(default_factory=list)
    partial_skills: list[PartialSkill] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    radar: list[CategoryRadar] = Field(default_factory=list)
    role_required_skills: list[str] = Field(default_factory=list)
    recommended_focus_areas: list[str] = Field(default_factory=list)
    hidden_strengths: list[HiddenStrength] = Field(default_factory=list)
