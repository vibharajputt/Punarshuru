import time
from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.llm import get_active_provider

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str
    uptime_seconds: float
    active_llm: str


_start_time = time.time()


@router.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check() -> HealthResponse:
    """Liveness probe — returns 200 and indicates active LLM provider."""
    return HealthResponse(
        status="ok",
        service="punarshuru-api",
        version="0.1.0",
        timestamp=datetime.now(timezone.utc).isoformat(),
        uptime_seconds=round(time.time() - _start_time, 2),
        active_llm=get_active_provider(),
    )
