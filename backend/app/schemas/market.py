from pydantic import BaseModel, Field


class SkillTrendItem(BaseModel):
    id: int
    name: str
    category: str
    demand_trend: str
    automation_risk: int


class RoleMarketSummary(BaseModel):
    id: int
    title: str
    city: str
    salary_min_lpa: float
    salary_max_lpa: float
    required_skills: list[str]
    exp_min: int
    exp_max: int
    remote: bool
    posted_month: str


class TrendsResponse(BaseModel):
    rising: list[SkillTrendItem]
    declining: list[SkillTrendItem]
    stable: list[SkillTrendItem]
    total_skills: int
    top_demanded_skills: list[str] = Field(default_factory=list)
    salary_by_city: dict[str, float] = Field(default_factory=dict)
    best_fit_roles: list[str] = Field(default_factory=list)
