from pydantic import BaseModel, Field


class RealCompRequest(BaseModel):
    salary_lpa: float
    city: str
    bhk: int = 1


class RealCompResponse(BaseModel):
    city: str
    nominal_salary_lpa: float
    col_index: float
    annual_rent_inr: float
    annual_commute_inr: float
    real_salary_lpa: float = Field(..., description="Real = (Salary - Rent - Commute) / CoL")
    in_hand_monthly_inr: float
    monthly_savings_potential_inr: float
    cost_breakdown: dict[str, float]


class OfferItem(BaseModel):
    offer_name: str
    city: str
    salary_lpa: float
    bhk: int = 1


class CityCompareItem(BaseModel):
    city: str
    offer_name: str | None = None
    nominal_salary_lpa: float
    col_index: float
    rent_monthly_inr: float
    commute_monthly_inr: float
    real_salary_lpa: float
    in_hand_monthly_inr: float
    monthly_savings_inr: float
    purchasing_power_score: float


class CompareRequest(BaseModel):
    offers: list[OfferItem]


class CompareResponse(BaseModel):
    best_offer_by_real_income: str
    comparisons: list[CityCompareItem]
    five_year_projection: list[dict]
