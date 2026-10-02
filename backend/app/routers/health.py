import time
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str
    uptime_seconds: float


_start_time = time.time()


@router.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check() -> HealthResponse:
    """Liveness probe — returns 200 when the service is up."""
    return HealthResponse(
        status="ok",
        service="punarshuru-api",
        version="0.1.0",
        timestamp=datetime.utcnow().isoformat() + "Z",
        uptime_seconds=round(time.time() - _start_time, 2),
    )
