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


class PredictSalaryRequest(BaseModel):
    role: str
    experience_years: float = 3.0
    skills: list[str] = Field(default_factory=list)
    city: str = "Bengaluru"


class PredictSalaryResponse(BaseModel):
    predicted_salary_lpa: float
    salary_min_lpa: float
    salary_max_lpa: float
    salary_bracket: str
    confidence_score: float
    bracket_probabilities: dict[str, float] = Field(default_factory=dict)
    percentile: float
    city_benchmark: float | None = None
    top_skills: list[str] = Field(default_factory=list)
    role: str
    city: str
    experience_years: float


class ModelInfoResponse(BaseModel):
    dataset_records: int
    exact_bracket_accuracy_pct: float
    within_bracket_accuracy_pct: float
    mae_lpa: float
    r2_score: float
    trained_at: str
    model_version: str

