import pytest
from app.services.onboarding_agent import handle_onboarding_chat


@pytest.mark.asyncio
async def test_onboarding_chat_initial_greeting():
    session_id = "test-session-init-123"
    res = await handle_onboarding_chat(session_id=session_id, message="Hello")
    assert res.reply
    assert len(res.quick_replies) > 0
    assert res.done is False
    assert res.segment in ["returner", "gig", "laid_off", "stagnant", "student"]


@pytest.mark.asyncio
async def test_onboarding_chat_resume_text_first():
    session_id = "test-session-resume-456"
    sample_resume = (
        "Priya Sharma\n"
        "Email: priya.sharma@example.com\n"
        "Pune, Maharashtra\n"
        "5 years Java Developer with Spring Boot, MySQL, REST APIs, Git. 4 years career break."
    )
    res = await handle_onboarding_chat(
        session_id=session_id,
        message="",
        resume_text=sample_resume,
    )
    assert res.profile_draft["name"] == "Priya Sharma"
    assert res.segment == "returner"
    assert len(res.profile_draft["skills_raw"]) >= 3
    assert res.done is False


@pytest.mark.asyncio
async def test_onboarding_chat_rule_based_progression():
    session_id = "test-session-prog-789"
    # Turn 1: Name and role
    r1 = await handle_onboarding_chat(session_id=session_id, message="I am Arjun Mehta, worked as Manual QA Tester")
    assert r1.profile_draft.get("name") == "Arjun Mehta" or "Arjun" in r1.profile_draft.get("name", "")
    assert r1.segment == "laid_off"

    # Turn 2: Skills
    r2 = await handle_onboarding_chat(session_id=session_id, message="Manual Testing, JIRA, SQL, Selenium")
    assert len(r2.profile_draft.get("skills_raw", [])) >= 2

    # Turn 3: Target Role and City
    r3 = await handle_onboarding_chat(session_id=session_id, message="Automation QA / SDET in Bengaluru")
    assert r3.profile_draft.get("city") == "Bengaluru"

    # Turn 4: Gap (Skip)
    r4 = await handle_onboarding_chat(session_id=session_id, message="Skip gap")
    assert r4.done is True


@pytest.mark.asyncio
async def test_onboarding_chat_api_endpoint(client):
    payload = {
        "session_id": "api-test-session-999",
        "message": "Swiggy delivery partner in Lucknow",
    }
    response = await client.post("/api/onboarding/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "quick_replies" in data
    assert "profile_draft" in data
    assert "done" in data
