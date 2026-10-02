from pydantic import BaseModel, Field


class MilestoneCourse(BaseModel):
    id: int
    title: str
    provider: str
    weeks: int
    lang: str
    url: str
    level: str
    certificate: bool


class PathwayStep(BaseModel):
    week_range: str
    title: str
    description: str
    skills_covered: list[str]
    courses: list[MilestoneCourse]


class PathwayOption(BaseModel):
    type: str = Field(..., description="'Safe' | 'Stretch' | 'Pivot'")
    title: str
    target_role: str
    estimated_months: int
    target_salary_lpa: float
    difficulty: str = Field(..., description="'Low' | 'Medium' | 'High'")
    description: str
    roadmap: list[PathwayStep]


class PathwayResponse(BaseModel):
    profile_id: str
    motivation_quote: str
    pathways: list[PathwayOption]
