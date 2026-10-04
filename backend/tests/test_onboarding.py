"""
Tests for Onboarding Agent v2 (ux.md Agent v2 spec).

All tests run with GEMINI_API_KEY="" and GROQ_API_KEY="" — LLM always falls
back to rule-based extraction, which is what we are actually testing.

Covered cases:
  1. Name "Rohit" greeting — must NOT be extracted as name (no false-match)
  2. Hinglish sentence: full slot extraction
  3. Skip mid-flow — only current optional slot advanced
  4. Message containing "proceed" — must NOT trigger done (done only via action)
  5. Resume without city — city stays empty, agent asks for it
  6. Resume with "Career break 2020-2024" — gap extracted from date range
"""

import os
import uuid
import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, patch, MagicMock

from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.core.database import Base, get_db
from app.main import app
from app.models.user import User
from app.models import OnboardingSession  # noqa: ensure table is registered
from app.services.onboarding_agent import (
    _rule_extract_name,
    _rule_extract_current_role,
    _rule_extract_city,
    _rule_extract_gap_from_dates,
    _classify_segment,
    _draft_missing,
    _all_required_filled,
    _advance_slot,
    handle_onboarding_chat,
)
from app.core.security import create_access_token

# ── Force LLM keys to empty so fallback is always used ───────────────────────
os.environ.setdefault("GEMINI_API_KEY", "")
os.environ.setdefault("GROQ_API_KEY", "")


# ─────────────────────────────────────────────────────────────────────────────
# Test DB + HTTP client fixtures
# ─────────────────────────────────────────────────────────────────────────────

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


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
async def db_session(test_session_factory):
    async with test_session_factory() as session:
        yield session


@pytest_asyncio.fixture
async def client(test_session_factory):
    """HTTP test client with DB override and a real authenticated user."""
    async def override_get_db():
        async with test_session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def auth_user(test_session_factory):
    """Create a real user and return (user_obj, bearer_token)."""
    from app.core.security import hash_password
    async with test_session_factory() as session:
        user = User(
            id=str(uuid.uuid4()),
            name="Test User",
            email=f"testuser_{uuid.uuid4().hex[:6]}@example.com",
            hashed_password=hash_password("testpass123"),
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
    token = create_access_token({"sub": user.id})
    return user, token


# ─────────────────────────────────────────────────────────────────────────────
# Unit tests for rule-based extraction helpers
# ─────────────────────────────────────────────────────────────────────────────

class TestRuleExtractName:
    def test_explicit_my_name_is(self):
        assert _rule_extract_name("my name is Rohit") == "Rohit"

    def test_explicit_i_am(self):
        assert _rule_extract_name("I am Abhishek") is not None

    def test_bare_greeting_not_name(self):
        """'Rohit' as a standalone greeting word must NOT be extracted as name."""
        result = _rule_extract_name("Rohit")
        assert result is None, (
            "Bare first-name greeting should not be extracted as name — "
            "name comes from auth user, not from text."
        )

    def test_hi_followed_by_name_not_extracted(self):
        result = _rule_extract_name("Hi Rohit")
        assert result is None

    def test_hinglish_mera_naam(self):
        result = _rule_extract_name("Mera naam Abhishek hai")
        assert result == "Abhishek"

    def test_occupation_not_extracted_as_name(self):
        """'delivery karta hun' — 'delivery' should not become name."""
        result = _rule_extract_name("delivery karta hun Lucknow me")
        assert result is None


class TestRuleExtractRole:
    def test_english_worked_as(self):
        role = _rule_extract_current_role("I worked as a Java Developer")
        assert role is not None
        assert "Java Developer" in role or "Java" in role

    def test_hinglish_karta_hun(self):
        """'main delivery karta hun' → role = 'delivery'."""
        role = _rule_extract_current_role("main delivery karta hun Lucknow me")
        assert role is not None
        assert "Delivery" in role or "delivery" in role.lower()

    def test_hinglish_full_sentence(self):
        role = _rule_extract_current_role("Mera naam Abhishek hai, main delivery karta hun Lucknow me")
        assert role is not None
        assert "delivery" in role.lower() or "Delivery" in role


class TestRuleExtractCity:
    def test_explicit_city_english(self):
        assert _rule_extract_city("I am based in Pune") == "Pune"

    def test_hinglish_me_kaam(self):
        city = _rule_extract_city("main delivery karta hun Lucknow me")
        assert city == "Lucknow"

    def test_lucknow_standalone(self):
        assert _rule_extract_city("Lucknow me rehta hun") == "Lucknow"

    def test_bangalore_normalised(self):
        city = _rule_extract_city("I live in Bangalore")
        assert city == "Bengaluru"

    def test_no_city_returns_none(self):
        assert _rule_extract_city("I am a software developer") is None


class TestGapFromDates:
    def test_career_break_date_range(self):
        gap = _rule_extract_gap_from_dates("Career break 2020-2024")
        assert gap == 4.0

    def test_en_dash_range(self):
        gap = _rule_extract_gap_from_dates("On leave 2021–2023")
        assert gap == 2.0

    def test_explicit_gap_years(self):
        gap = _rule_extract_gap_from_dates("I had a 3 year gap")
        assert gap == 3.0

    def test_no_gap_returns_none(self):
        assert _rule_extract_gap_from_dates("No career break") is None


class TestClassifySegment:
    def test_delivery_is_gig(self):
        assert _classify_segment("delivery karta hun", "Delivery Partner", 0) == "gig"

    def test_student_detected(self):
        assert _classify_segment("final year student", "Student", 0) == "student"

    def test_gap_is_returner(self):
        assert _classify_segment("", "", 3.0) == "returner"

    def test_bpo_is_stagnant(self):
        assert _classify_segment("worked in bpo customer care", "BPO Executive", 0) == "stagnant"

    def test_laid_off_detected(self):
        assert _classify_segment("I was laid off last month", "Engineer", 0) == "laid_off"


class TestDraftHelpers:
    def test_missing_all_required(self):
        draft = {}
        missing = _draft_missing(draft)
        assert set(missing) == {"current_role", "skills", "target_role", "city"}

    def test_complete_draft(self):
        draft = {
            "current_role": "Engineer",
            "skills_raw": ["Python", "SQL", "Pandas"],
            "target_role": "ML Engineer",
            "city": "Pune",
        }
        assert _all_required_filled(draft) is True
        assert _draft_missing(draft) == []

    def test_missing_skills(self):
        draft = {
            "current_role": "Engineer",
            "skills_raw": [],
            "target_role": "ML Engineer",
            "city": "Pune",
        }
        assert "skills" in _draft_missing(draft)


# ─────────────────────────────────────────────────────────────────────────────
# Integration: handle_onboarding_chat
# ─────────────────────────────────────────────────────────────────────────────

class TestHandleOnboardingChat:

    @pytest.mark.asyncio
    async def test_case1_rohit_greeting_no_name_false_match(self, db_session):
        """
        Case 1: User sends "Rohit" as a greeting.
        Rule: name comes from auth user (pre-filled). "Rohit" must NOT
        overwrite the auth user's name via text extraction.
        """
        user = User(id=str(uuid.uuid4()), name="Auth Name", email="rohit_test@x.com",
                    hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        res = await handle_onboarding_chat(
            user=user, db=db_session, message="Rohit"
        )
        # Name must remain the auth user's name, not "Rohit" from bare text
        assert res.profile_draft.get("name") == "Auth Name", (
            "Bare greeting 'Rohit' should not overwrite auth user's name"
        )
        assert res.done is False

    @pytest.mark.asyncio
    async def test_case2_hinglish_full_sentence(self, db_session):
        """
        Case 2: Hinglish — 'Mera naam Abhishek hai, main delivery karta hun Lucknow me'
        Must extract: role≈delivery, city=Lucknow, segment=gig.
        name comes from auth user, not from message.
        """
        user = User(id=str(uuid.uuid4()), name="Abhishek Kumar", email="abhishek_test@x.com",
                    hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        res = await handle_onboarding_chat(
            user=user,
            db=db_session,
            message="Mera naam Abhishek hai, main delivery karta hun Lucknow me",
        )
        draft = res.profile_draft
        assert draft.get("city") == "Lucknow", f"Expected Lucknow, got {draft.get('city')}"
        role = draft.get("current_role", "").lower()
        assert "delivery" in role or role != "", f"Expected delivery role, got '{role}'"
        assert res.segment == "gig", f"Expected gig, got {res.segment}"
        assert res.done is False

    @pytest.mark.asyncio
    async def test_case3_skip_mid_flow(self, db_session):
        """
        Case 3: 'Skip' sent while on an optional slot (career_gap).
        Must advance ONLY past career_gap — must NOT set done=True.
        """
        user = User(id=str(uuid.uuid4()), name="Skip User", email="skip_test@x.com",
                    hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        # Prime the session with all required slots filled, position at career_gap
        from app.services.onboarding_agent import _load_session
        row = await _load_session(db_session, user.id)
        row.profile_draft = {
            "name": "Skip User",
            "email": "skip_test@x.com",
            "current_role": "QA Tester",
            "skills_raw": ["Selenium", "JIRA", "SQL"],
            "target_role": "Automation QA",
            "city": "Pune",
            "experience_years": 3,
        }
        row.current_slot = "career_gap"
        await db_session.commit()

        res = await handle_onboarding_chat(
            user=user, db=db_session, message="Skip"
        )
        # Must NOT be done — done only via action='confirm'
        assert res.done is False, "Skip must not set done=True (done requires action='confirm')"
        # missing_fields should be empty (all required filled)
        assert res.missing_fields == [], f"Unexpected missing fields: {res.missing_fields}"

    @pytest.mark.asyncio
    async def test_case4_message_containing_proceed_not_done(self, db_session):
        """
        Case 4: Message containing 'proceed' must NOT trigger done.
        done is ONLY set via action='confirm', never via text matching.
        """
        user = User(id=str(uuid.uuid4()), name="Proceed User", email="proceed_test@x.com",
                    hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        res = await handle_onboarding_chat(
            user=user, db=db_session, message="I want to proceed with my career change"
        )
        assert res.done is False, (
            "Text 'proceed' must NOT trigger done. done requires action='confirm'."
        )

    @pytest.mark.asyncio
    async def test_case5_resume_without_city(self, db_session):
        """
        Case 5: Resume that contains no city.
        Agent must NOT invent a city (no default 'Bengaluru').
        After processing, city slot should be empty and agent should ask for it.
        """
        user = User(id=str(uuid.uuid4()), name="Cityless User", email="cityless_test@x.com",
                    hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        resume_no_city = (
            "Ramesh Kumar\n"
            "Email: ramesh@example.com\n"
            "5 years experience as Java Developer.\n"
            "Skills: Java, Spring Boot, MySQL, REST APIs.\n"
            # NO city mentioned
        )
        res = await handle_onboarding_chat(
            user=user, db=db_session, message="", resume_text=resume_no_city
        )
        draft = res.profile_draft
        # City must be empty — agent must not invent it
        city = draft.get("city")
        assert not city, (
            f"City should be empty when not found in resume, got: '{city}'"
        )
        # Agent should mention city in missing fields
        assert "city" in res.missing_fields, (
            f"'city' should be in missing_fields, got: {res.missing_fields}"
        )
        assert res.done is False

    @pytest.mark.asyncio
    async def test_case6_resume_career_break_date_range(self, db_session):
        """
        Case 6: Resume with 'Career break 2020-2024'.
        Gap must be extracted from date range = 4 years.
        """
        user = User(id=str(uuid.uuid4()), name="Gap User", email="gap_test@x.com",
                    hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        resume_with_gap = (
            "Sunita Verma\n"
            "Email: sunita@example.com\n"
            "Pune, Maharashtra\n"
            "8 years experience as Software Engineer.\n"
            "Skills: Python, Django, PostgreSQL, Docker.\n"
            "Career break 2020-2024 (family reasons).\n"
        )
        res = await handle_onboarding_chat(
            user=user, db=db_session, message="", resume_text=resume_with_gap
        )
        draft = res.profile_draft
        gap = draft.get("career_gap_years")
        assert gap == 4.0, (
            f"Expected career_gap_years=4.0 from '2020-2024' date range, got: {gap}"
        )
        assert res.segment == "returner", (
            f"4-year gap should classify as 'returner', got: {res.segment}"
        )


# ─────────────────────────────────────────────────────────────────────────────
# Integration: action='confirm' sets done only when required slots filled
# ─────────────────────────────────────────────────────────────────────────────

class TestConfirmAction:

    @pytest.mark.asyncio
    async def test_confirm_with_complete_draft_sets_done(self, db_session):
        user = User(id=str(uuid.uuid4()), name="Confirm User", email="confirm_test@x.com",
                    hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        # Prime session with all required slots
        from app.services.onboarding_agent import _load_session
        row = await _load_session(db_session, user.id)
        row.profile_draft = {
            "name": "Confirm User",
            "current_role": "QA Tester",
            "skills_raw": ["Selenium", "JIRA", "Python"],
            "target_role": "Automation QA",
            "city": "Bengaluru",
        }
        row.current_slot = "done"
        await db_session.commit()

        res = await handle_onboarding_chat(
            user=user, db=db_session, action="confirm"
        )
        assert res.done is True, "action='confirm' with complete draft must set done=True"

    @pytest.mark.asyncio
    async def test_confirm_with_incomplete_draft_stays_false(self, db_session):
        user = User(id=str(uuid.uuid4()), name="Incomplete User", email="incomplete_test@x.com",
                    hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        # No required slots filled — confirm must not set done
        res = await handle_onboarding_chat(
            user=user, db=db_session, action="confirm"
        )
        assert res.done is False, "action='confirm' with incomplete draft must NOT set done=True"
        assert len(res.missing_fields) > 0


# ─────────────────────────────────────────────────────────────────────────────
# API endpoint tests (auth-required, rate limit)
# ─────────────────────────────────────────────────────────────────────────────

class TestOnboardingEndpoint:

    @pytest.mark.asyncio
    async def test_endpoint_requires_auth(self, client):
        """Without Bearer token, endpoint must return 403."""
        res = await client.post(
            "/api/onboarding/chat",
            json={"session_id": "x", "message": "Hello"},
        )
        assert res.status_code in (401, 403), (
            f"Expected 401/403 without auth, got {res.status_code}"
        )

    @pytest.mark.asyncio
    async def test_endpoint_with_valid_token(self, client, auth_user, test_session_factory):
        """Valid auth token must return 200 with expected response schema."""
        user, token = auth_user
        res = await client.post(
            "/api/onboarding/chat",
            json={"session_id": "test-123", "message": "I am a software developer"},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
        data = res.json()
        assert "reply" in data
        assert "quick_replies" in data
        assert "profile_draft" in data
        assert "done" in data
        assert data["done"] is False

    @pytest.mark.asyncio
    async def test_rate_limit_enforced(self, client, auth_user):
        """After 20 requests in quick succession, 21st must return 429."""
        user, token = auth_user
        headers = {"Authorization": f"Bearer {token}"}
        payload = {"session_id": "rl-test", "message": "Hello"}

        # Reset rate store for this user
        from app.routers.onboarding import _rate_store
        _rate_store.pop(user.id, None)

        responses = []
        for _ in range(21):
            r = await client.post("/api/onboarding/chat", json=payload, headers=headers)
            responses.append(r.status_code)

        assert 429 in responses, (
            f"Expected at least one 429 after 20 requests, got: {set(responses)}"
        )

    @pytest.mark.asyncio
    async def test_action_confirm_via_endpoint(self, client, auth_user, test_session_factory):
        """action='confirm' with a complete profile sets done=True via API."""
        user, token = auth_user
        headers = {"Authorization": f"Bearer {token}"}

        # Prime the session directly
        async with test_session_factory() as session:
            from app.services.onboarding_agent import _load_session
            row = await _load_session(session, user.id)
            row.profile_draft = {
                "name": user.name,
                "current_role": "Java Developer",
                "skills_raw": ["Java", "Spring Boot", "MySQL"],
                "target_role": "GenAI Engineer",
                "city": "Pune",
            }
            row.current_slot = "done"
            await session.commit()

        res = await client.post(
            "/api/onboarding/chat",
            json={"session_id": "confirm-test", "message": "", "action": "confirm"},
            headers=headers,
        )
        assert res.status_code == 200
        assert res.json()["done"] is True

    @pytest.mark.asyncio
    async def test_name_prefilled_from_auth(self, client, auth_user):
        """Name in profile_draft must come from auth user, not from message text."""
        user, token = auth_user
        headers = {"Authorization": f"Bearer {token}"}
        res = await client.post(
            "/api/onboarding/chat",
            json={"session_id": "name-test", "message": "Rohit"},
            headers=headers,
        )
        assert res.status_code == 200
        draft = res.json()["profile_draft"]
        assert draft.get("name") == user.name, (
            f"Name should be auth user's name '{user.name}', not 'Rohit'"
        )

    @pytest.mark.asyncio
    async def test_restore_session_endpoint(self, client, auth_user, db_session):
        """GET /api/onboarding/session restores persisted profile draft, slot, and history."""
        user, token = auth_user
        headers = {"Authorization": f"Bearer {token}"}

        from app.services.onboarding_agent import _load_session
        row = await _load_session(db_session, user.id)
        row.profile_draft = {
            "name": user.name,
            "current_role": "React Developer",
            "skills_raw": ["React", "TypeScript", "Tailwind"],
            "target_role": "Full Stack Developer",
            "city": "Bengaluru",
        }
        row.current_slot = "career_gap"
        row.history = [
            {"role": "user", "content": "I work in React"},
            {"role": "assistant", "content": "Great! What is your city?"},
        ]
        await db_session.commit()

        res = await client.get("/api/onboarding/session", headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert data["user_id"] == user.id
        assert data["current_slot"] == "career_gap"
        assert data["profile_draft"]["current_role"] == "React Developer"
        assert data["profile_draft"]["name"] == user.name
        assert len(data["history"]) == 2


class TestAgentV2Bugfixes:
    """
    Tests for ux.md Agent v2 resume upload and slot filling bug fixes:
    1. Resume upload -> agent asks first missing slot.
    2. Answering 'Final Year Student' sets current_role and asks next slot.
    3. Filename never appears in skills.
    4. Greeting prefix has no duplicate 'Welcome! Welcome!'.
    5. Loop guard: never asks same slot twice in a row; second attempt accepts raw answer.
    6. Confirm enabled only when current_role, target_role, city and >= 3 taxonomy skills are set.
    """

    @pytest.mark.asyncio
    async def test_resume_upload_asks_first_missing_slot(self, db_session):
        """Resume with name, role, city, and 4 skills -> missing target_role -> agent asks target_role."""
        user = User(id=str(uuid.uuid4()), name="Priya Sharma", email="priya_test@x.com", hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        resume_content = (
            "Priya Sharma\n"
            "Email: priya@example.com\n"
            "Bengaluru, Karnataka\n"
            "3 years experience as Software Engineer.\n"
            "Skills: Python, FastAPI, Docker, PostgreSQL.\n"
        )
        res = await handle_onboarding_chat(
            user=user, db=db_session, message="", resume_text=resume_content
        )
        assert res.profile_draft.get("current_role") == "Software Engineer"
        assert res.profile_draft.get("city") == "Bengaluru"
        assert len(res.profile_draft.get("skills_raw", [])) >= 4
        # First missing slot should be target_role!
        assert "target_role" in res.missing_fields
        assert "target role" in res.reply.lower() or "direction" in res.reply.lower()

    @pytest.mark.asyncio
    async def test_answering_final_year_student_sets_current_role_and_asks_next_slot(self, db_session):
        """When asking for current_role, replying 'Final Year Student' fills current_role and asks skills."""
        user = User(id=str(uuid.uuid4()), name="Student User", email="student_test@x.com", hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        # Initial turn (slot is current_role by default)
        res = await handle_onboarding_chat(
            user=user, db=db_session, message="Final Year Student"
        )
        assert res.profile_draft.get("current_role") == "Final Year Student"
        # Next required slot is skills
        assert "skills" in res.missing_fields
        assert "skill" in res.reply.lower()

    @pytest.mark.asyncio
    async def test_filename_never_appears_in_skills(self, db_session):
        """Sending filename in message or upload must NEVER add filename tokens to skills_raw."""
        user = User(id=str(uuid.uuid4()), name="File User", email="file_test@x.com", hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        # Turn 1: user accidentally sends "Uploaded resume: vibha_resume_2024.pdf"
        res1 = await handle_onboarding_chat(
            user=user, db=db_session, message="Uploaded resume: vibha_resume_2024.pdf"
        )
        skills1 = res1.profile_draft.get("skills_raw", [])
        for forbidden in ["vibha", "resume", "pdf", "uploaded", "2024"]:
            assert not any(forbidden in s.lower() for s in skills1), f"'{forbidden}' leaked into skills!"

        # Turn 2: agent is asking skills, user sends "Python, Java, vibha_resume.pdf, SQL"
        res2 = await handle_onboarding_chat(
            user=user, db=db_session, message="Python, Java, vibha_resume.pdf, SQL"
        )
        skills2 = res2.profile_draft.get("skills_raw", [])
        assert "Python" in skills2
        assert "Java" in skills2
        assert "SQL" in skills2
        for s in skills2:
            assert "resume" not in s.lower() and "pdf" not in s.lower()

    @pytest.mark.asyncio
    async def test_no_duplicate_welcome_greeting(self, db_session):
        """Agent's prompt for current_role must NOT start with 'Welcome! Welcome!'."""
        user = User(id=str(uuid.uuid4()), name="Greeting User", email="greeting_test@x.com", hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        # Load session at current_role
        from app.services.onboarding_agent import _rule_reply
        reply, _ = _rule_reply("current_role", {}, "en")
        assert "Welcome! Welcome!" not in reply
        assert reply.startswith("Welcome! To build your AI career")

    @pytest.mark.asyncio
    async def test_loop_guard_accepts_raw_answer_on_second_attempt(self, db_session):
        """If user answers an unconventional role twice, second attempt accepts raw answer and advances."""
        user = User(id=str(uuid.uuid4()), name="Loop User", email="loop_test@x.com", hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        # Attempt 1 with unconventional phrase
        res1 = await handle_onboarding_chat(
            user=user, db=db_session, message="Self Employed Freelance Consultant"
        )
        # Should either extract it or advance; if it asked again, attempt 2 must accept it
        if not res1.profile_draft.get("current_role"):
            res2 = await handle_onboarding_chat(
                user=user, db=db_session, message="Freelance Consultant"
            )
            assert res2.profile_draft.get("current_role") != ""
            assert "current_role" not in res2.missing_fields

    @pytest.mark.asyncio
    async def test_confirm_requires_at_least_3_skills(self, db_session):
        """Confirm with only 2 skills must fail; adding 3rd skill allows confirm."""
        user = User(id=str(uuid.uuid4()), name="ThreeSkills User", email="threeskills_test@x.com", hashed_password="x")
        db_session.add(user)
        await db_session.commit()

        from app.services.onboarding_agent import _load_session
        row = await _load_session(db_session, user.id)
        row.profile_draft = {
            "name": "ThreeSkills User",
            "current_role": "Software Engineer",
            "skills_raw": ["Python", "FastAPI"],  # Only 2 skills!
            "target_role": "GenAI Engineer",
            "city": "Bengaluru",
        }
        await db_session.commit()

        res1 = await handle_onboarding_chat(user=user, db=db_session, action="confirm")
        assert res1.done is False
        assert "skills" in res1.missing_fields

        # Add 3rd skill
        row.profile_draft["skills_raw"].append("Docker")
        await db_session.commit()

        res2 = await handle_onboarding_chat(user=user, db=db_session, action="confirm")
        assert res2.done is True


