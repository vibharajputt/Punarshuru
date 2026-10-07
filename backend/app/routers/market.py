from fastapi import APIRouter, HTTPException, Query
from app.schemas.market import (
    TrendsResponse,
    PredictSalaryRequest,
    PredictSalaryResponse,
    ModelInfoResponse,
)
from app.services.market import get_market_trends, get_role_details, get_all_roles
from app.services.salary_ml import predict_salary, get_model_metadata

router = APIRouter(prefix="/market", tags=["Market"])


@router.get("/trends", response_model=TrendsResponse)
async def market_trends() -> TrendsResponse:
    """Rising, declining, and stable skills, salary benchmarks by city and top roles."""
    return get_market_trends()


@router.post("/predict-salary", response_model=PredictSalaryResponse)
async def predict_salary_endpoint(req: PredictSalaryRequest) -> PredictSalaryResponse:
    """Predict LPA compensation, bracket probabilities, confidence and percentile using ML model."""
    result = predict_salary(
        role=req.role,
        experience_years=req.experience_years,
        skills=req.skills,
        city=req.city,
    )
    return PredictSalaryResponse(**result)


@router.get("/model-info", response_model=ModelInfoResponse)
async def model_info_endpoint() -> ModelInfoResponse:
    """Returns training metrics, accuracy, and metadata of the salary ML model."""
    meta = get_model_metadata()
    return ModelInfoResponse(**meta)


@router.get("/roles")
async def list_roles(
    q: str = Query("", description="Search term for job title or skills"),
    city: str = Query("", description="Filter by city"),
    limit: int = Query(50, ge=1, le=200, description="Max roles to return"),
) -> list[dict]:
    """Retrieve jobs snapshot from the 15,841 dataset with filtering."""
    return get_all_roles(query=q, city=city, limit=limit)


@router.get("/roles/{role_id}")
async def role_market(role_id: int) -> dict:
    """Market snapshot for a specific job role by ID."""
    job = get_role_details(role_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Role ID {role_id} not found")
    return job

