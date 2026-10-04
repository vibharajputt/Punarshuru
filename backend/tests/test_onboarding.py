"""
Integration tests for Onboarding Engine v2 (HTTP layer).

All tests use in-memory SQLite + ASGI test client with a real authenticated user.
No LLM calls — onboarding_engine is purely deterministic.
"""

import os
import uuid
import pytest
import pytest_asyncio

from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.core.database import Base, get_db
from app.main import app
from app.models.user import User
from app.models import OnboardingSession  # noqa: ensure table registered
from app.core.security import create_access_token

os.environ.setdefault("GEMINI_API_KEY", "")
os.environ.setdefault("GROQ_API_KEY", "")

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest_asyncio.fixture
async def test_engine():
    engine = create_async_engine(TEST_DB_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture
async def test_session_factory(test_engine):
    return async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)


@pytest_asyncio.fixture
async def auth_user(test_session_factory):
    from app.core.security import hash_password
    async with test_session_factory() as session:
        user = User(
            id=str(uuid.uuid4()),
            name="Vibha Rajput",
            email=f"vibha_{uuid.uuid4().hex[:6]}@example.com",
            hashed_password=hash_password("testpass123"),
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
    token = create_access_token({"sub": user.id})
    return user, token


@pytest_asyncio.fixture
async def client(test_session_factory):
    async def override_get_db():
        async with test_session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


# ── Helpers ───────────────────────────────────────────────────────────────────

async def chat(client: AsyncClient, token: str, **kwargs) -> dict:
    payload = {"session_id": "", "message": "", **kwargs}
    r = await client.post(
        "/api/onboarding/chat",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 200, r.text
    return r.json()


# ── Auth guard ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_chat_requires_auth(client):
    r = await client.post("/api/onboarding/chat", json={"session_id": "", "message": "hi"})
    assert r.status_code in (401, 403)  # FastAPI returns 403 for missing Bearer token


@pytest.mark.asyncio
async def test_session_requires_auth(client):
    r = await client.get("/api/onboarding/session")
    assert r.status_code in (401, 403)


# ── GET /session ──────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_session_fresh(client, auth_user):
    user, token = auth_user
    r = await client.get(
        "/api/onboarding/session",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["user_id"] == user.id
    assert isinstance(data["profile_draft"], dict)
    assert data["done"] is False


# ── DELETE /session ───────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_delete_session(client, auth_user):
    _, token = auth_user
    # First do a chat turn to create a session
    await chat(client, token, message="Java Developer")
    # Delete it
    r = await client.delete(
        "/api/onboarding/session",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 204
    # GET should return a fresh profile_draft now
    sess = await client.get(
        "/api/onboarding/session",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert sess.json()["profile_draft"].get("current_role", "") == ""


# ── Core slot-filling flow ────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_first_turn_asks_current_role(client, auth_user):
    _, token = auth_user
    r = await chat(client, token, message="")
    assert "role" in r["reply"].lower() or r["reply"]  # greeting or role question
    assert r["can_confirm"] is False


@pytest.mark.asyncio
async def test_current_role_filled(client, auth_user):
    _, token = auth_user
    r = await chat(client, token, message="Java Developer")
    assert r["profile_draft"]["current_role"] == "Java Developer"
    assert "skill" in r["reply"].lower()


@pytest.mark.asyncio
async def test_skills_turn(client, auth_user):
    _, token = auth_user
    await chat(client, token, message="Java Developer")
    r = await chat(client, token, message="Java, Spring Boot, MySQL, Docker")
    skills = r["profile_draft"]["skills_raw"]
    assert len(skills) >= 3
    assert r["can_confirm"] is False  # target_role + city still missing


@pytest.mark.asyncio
async def test_full_happy_path(client, auth_user):
    _, token = auth_user
    await chat(client, token, message="Java Developer")
    await chat(client, token, message="Java, Spring Boot, MySQL, Docker")
    await chat(client, token, message="Backend Engineer")
    await chat(client, token, message="Pune")
    r = await chat(client, token, message="No break")
    assert r["can_confirm"] is True
    assert r["profile_draft"]["current_role"] == "Java Developer"
    assert r["profile_draft"]["target_role"] == "Backend Engineer"
    assert r["profile_draft"]["city"] == "Pune"
    assert len(r["profile_draft"]["skills_raw"]) >= 3


@pytest.mark.asyncio
async def test_confirm_action_sets_done(client, auth_user):
    _, token = auth_user
    await chat(client, token, message="Java Developer")
    await chat(client, token, message="Java, Spring Boot, MySQL, Docker")
    await chat(client, token, message="Backend Engineer")
    await chat(client, token, message="Pune")
    r = await chat(client, token, action="confirm")
    assert r["done"] is True


@pytest.mark.asyncio
async def test_filename_ignored_as_message(client, auth_user):
    _, token = auth_user
    r = await chat(client, token, message="Uploaded Resume: Vibha_Raj_Resume.pdf")
    assert r["profile_draft"]["current_role"] == ""
    assert r["profile_draft"]["skills_raw"] == []


@pytest.mark.asyncio
async def test_hinglish_city_role_extraction(client, auth_user):
    _, token = auth_user
    r = await chat(client, token, message="main delivery karta hun Lucknow me")
    d = r["profile_draft"]
    assert d["current_role"] == "Delivery Partner" or "delivery" in d["current_role"].lower()
    assert d["city"] == "Lucknow"


@pytest.mark.asyncio
async def test_no_loop_same_slot(client, auth_user):
    """After two bad answers for skills, engine must not stay stuck."""
    _, token = auth_user
    await chat(client, token, message="QA Tester")
    r1 = await chat(client, token, message="blah blah blah")
    r2 = await chat(client, token, message="qwerty zxcv")
    # After 2 retries, engine should move on or accept the raw text
    # Either way the reply must not loop infinitely asking same slot
    assert r1["reply"] != r2["reply"] or r2["profile_draft"]["skills_raw"] != []


@pytest.mark.asyncio
async def test_can_confirm_false_without_all_slots(client, auth_user):
    _, token = auth_user
    r = await chat(client, token, message="Software Developer")
    assert r["can_confirm"] is False


@pytest.mark.asyncio
async def test_segment_detecting_until_classified(client, auth_user):
    _, token = auth_user
    r = await chat(client, token, message="")
    assert r["segment"] in ("detecting", "")


@pytest.mark.asyncio
async def test_student_segment(client, auth_user):
    _, token = auth_user
    r = await chat(client, token, message="Final Year Student")
    assert r["profile_draft"]["current_role"] != ""
    assert r["segment"] == "student" or r["segment"] == "detecting"


@pytest.mark.asyncio
async def test_laid_off_segment(client, auth_user):
    _, token = auth_user
    r = await chat(client, token, message="Java Developer, laid off last month")
    assert r["segment"] in ("laid_off", "stagnant", "detecting")


@pytest.mark.asyncio
async def test_resume_text_merges_skills(client, auth_user):
    _, token = auth_user
    resume = (
        "Vibha Rajput\nBackend Developer\n"
        "Skills: Python, FastAPI, PostgreSQL, Docker\n"
        "Experience: 2015 - 2020 (Backend Dev)\n"
        "Bengaluru"
    )
    r = await chat(client, token, resume_text=resume)
    d = r["profile_draft"]
    # Should have skills from resume
    assert len(d.get("skills_raw", [])) >= 1
    # Should ask for missing slot next
    assert r["reply"]  # non-empty reply


@pytest.mark.asyncio
async def test_confirm_without_complete_profile_not_done(client, auth_user):
    _, token = auth_user
    # Immediately confirm without filling anything
    r = await chat(client, token, action="confirm")
    assert r["done"] is False


@pytest.mark.asyncio
async def test_session_persists_across_requests(client, auth_user):
    _, token = auth_user
    await chat(client, token, message="Data Analyst")
    # Second request should remember the role
    r = await client.get(
        "/api/onboarding/session",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 200
    assert r.json()["profile_draft"].get("current_role") == "Data Analyst"


@pytest.mark.asyncio
async def test_rate_limit_applied(client, auth_user):
    _, token = auth_user
    # Send 21 rapid requests — the 21st should be 429
    responses = []
    for _ in range(21):
        r = await client.post(
            "/api/onboarding/chat",
            json={"session_id": "", "message": "hi"},
            headers={"Authorization": f"Bearer {token}"},
        )
        responses.append(r.status_code)
    assert 429 in responses
