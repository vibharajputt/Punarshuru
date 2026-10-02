from fastapi import APIRouter
from app.schemas.compensation import (
    RealCompRequest,
    RealCompResponse,
    CompareRequest,
    CompareResponse,
)
from app.services.compensation import calculate_real_compensation, compare_offers

router = APIRouter(prefix="/compensation", tags=["Compensation"])


@router.post("/real", response_model=RealCompResponse)
async def get_real_compensation(req: RealCompRequest) -> RealCompResponse:
    """Calculate Real Purchasing Power salary factoring rent, commute & city cost of living index."""
    return calculate_real_compensation(req)


@router.post("/compare", response_model=CompareResponse)
async def compare_compensation_offers(req: CompareRequest) -> CompareResponse:
    """Compare multiple job offers across Indian cities with 5-year wealth projection."""
    return compare_offers(req)
