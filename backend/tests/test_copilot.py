import pytest


@pytest.mark.asyncio
async def test_copilot_chat_endpoint(client):
    payload = {
        "message": "Am I underpaid for my experience?",
        "profile": {
            "name": "Priya Sharma",
            "current_role": "Java Developer",
            "target_role": "GenAI Engineer",
            "city": "Pune",
            "current_salary_lpa": 8.0,
            "skills_raw": ["Java", "Spring Boot", "MySQL"],
            "user_type": "returner",
        },
    }

    resp = await client.post("/api/copilot/chat", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "reply" in data
    assert len(data["reply"]) > 0
    assert "actions" in data
    assert isinstance(data["actions"], list)
    assert len(data["actions"]) > 0
    assert "quick_replies" in data
    assert isinstance(data["quick_replies"], list)


@pytest.mark.asyncio
async def test_copilot_adjacent_roles_endpoint(client):
    payload = {
        "message": "What adjacent roles can I target?",
        "profile": {
            "name": "Arjun Mehta",
            "current_role": "Manual QA",
            "target_role": "Automation QA / SDET",
            "city": "Bengaluru",
            "skills_raw": ["Manual Testing", "Jira", "SQL"],
            "user_type": "laid_off",
        },
    }

    resp = await client.post("/api/copilot/chat", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "reply" in data
    assert "actions" in data
    assert any("Automation" in a or "SDET" in a or "QA" in a for a in data["actions"])
