from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import init_db
from app.routers import health, demo, profile, assess, market, pathway, compensation, passport

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Punarshuru API",
    description="AI career intelligence for disruption, transition & growth — Bharat 2.0",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers under /api prefix per SPEC
app.include_router(health.router, prefix="/api")
app.include_router(demo.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(assess.router, prefix="/api")
app.include_router(market.router, prefix="/api")
app.include_router(pathway.router, prefix="/api")
app.include_router(compensation.router, prefix="/api")
app.include_router(passport.router, prefix="/api")


@app.get("/", include_in_schema=False)
async def root() -> dict:
    return {"message": "Punarshuru API — visit /api/docs"}
