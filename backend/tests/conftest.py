import json
from pathlib import Path
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.database import Base, get_db
from app.main import app

DATA_DIR = Path(__file__).parent.parent / "app" / "data"
TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture
def personas_data():
    with open(DATA_DIR / "personas.json", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def skills_data():
    with open(DATA_DIR / "skills_taxonomy.json", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def jobs_data():
    with open(DATA_DIR / "jobs_snapshot.json", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def city_costs_data():
    with open(DATA_DIR / "city_costs.json", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def courses_data():
    with open(DATA_DIR / "courses.json", encoding="utf-8") as f:
        return json.load(f)


@pytest_asyncio.fixture
async def test_db():
    engine = create_async_engine(TEST_DB_URL, echo=False)
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield async_session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture
async def client(test_db):
    async def override_get_db():
        async with test_db() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()
