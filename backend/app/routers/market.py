from fastapi import APIRouter, HTTPException
from app.schemas.market import TrendsResponse
from app.services.market import get_market_trends, get_role_details

router = APIRouter(prefix="/market", tags=["Market"])


@router.get("/trends", response_model=TrendsResponse)
async def market_trends() -> TrendsResponse:
    """Rising, declining, and stable skills, salary benchmarks by city and top roles."""
    return get_market_trends()


@router.get("/roles/{role_id}")
async def role_market(role_id: int) -> dict:
    """Market snapshot for a specific job role by ID."""
    job = get_role_details(role_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Role ID {role_id} not found")
    return job
