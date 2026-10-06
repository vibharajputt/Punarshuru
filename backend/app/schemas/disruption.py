from pydantic import BaseModel, Field


class DisruptionBreakdown(BaseModel):
    skill_decay: float = Field(..., description="Score 0-25 representing skill obsolescence (max 25)")
    automation_risk: float = Field(..., description="Score 0-30 representing automation exposure (max 30)")
    career_gap: float = Field(..., description="Score 0-15 representing penalty for career break (max 15)")
    stagnation: float = Field(..., description="Score 0-15 representing stagnation in same role (max 15)")
    market_mismatch: float = Field(..., description="Score 0-15 representing mismatch with current market demand (max 15)")
    reasons: dict[str, str] = Field(default_factory=dict, description="1-line reason for each component")
    top_risks: list[str] = Field(default_factory=list, description="Key vulnerability factors")
    strengths: list[str] = Field(default_factory=list, description="Current strengths and transferable skills")


class DisruptionResponse(BaseModel):
    profile_id: str
    score: float = Field(..., description="Overall disruption index (0-100)")
    risk_level: str = Field(..., description="Low (<30), Moderate (30-60), High (>60)")
    summary: str
    breakdown: DisruptionBreakdown
