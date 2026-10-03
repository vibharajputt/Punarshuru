import json
import uuid
import pytest
from unittest.mock import patch, AsyncMock
from app.services.llm import complete, get_active_provider
from app.core.config import Settings


@pytest.mark.asyncio
async def test_complete_both_providers_failing_text():
    with patch("app.services.llm._call_gemini", side_effect=Exception("Gemini network error")), \
         patch("app.services.llm._call_groq", side_effect=Exception("Groq 500 error")):
        
        prompt = f"Write an inspiring motivation quote for testing failure {uuid.uuid4()}"
        result = await complete(prompt, json=False)
        assert isinstance(result, str)
        assert len(result) > 0
        assert "milestone" in result.lower() or "career" in result.lower() or "skills" in result.lower()


@pytest.mark.asyncio
async def test_complete_both_providers_failing_json():
    with patch("app.services.llm._call_gemini", side_effect=TimeoutError("Gemini timed out")), \
         patch("app.services.llm._call_groq", side_effect=Exception("Groq rate limited")):
        
        prompt = f"Extract resume json for failure test {uuid.uuid4()}"
        result = await complete(prompt, json=True)
        assert isinstance(result, dict)


@pytest.mark.asyncio
async def test_gemini_fails_groq_succeeds():
    groq_output = json.dumps({
        "name": "Priya Sharma",
        "current_role": "Senior Java Developer",
        "skills": ["Java", "Spring Boot"]
    })

    with patch("app.services.llm._call_gemini", side_effect=Exception("Gemini quota exceeded")), \
         patch("app.services.llm._call_groq", AsyncMock(return_value=groq_output)):
        
        prompt = f"Unique test prompt for groq fallback test {uuid.uuid4()}"
        result = await complete(prompt, json=True)
        assert isinstance(result, dict)
        assert result.get("name") == "Priya Sharma"
        assert "Java" in result.get("skills", [])


@pytest.mark.asyncio
async def test_prompt_hash_caching():
    unique_id = uuid.uuid4()
    prompt = f"Unique prompt for testing SQLite caching mechanism {unique_id}"
    mock_gemini = AsyncMock(return_value="Cached Gemini Response 123")

    with patch("app.services.llm._call_gemini", mock_gemini):
        first_res = await complete(prompt, json=False)
        assert first_res == "Cached Gemini Response 123"
        assert mock_gemini.call_count == 1

    # Second call - should hit SQLite cache without calling Gemini mock
    with patch("app.services.llm._call_gemini", side_effect=Exception("Should not be called")):
        cached_res = await complete(prompt, json=False)
        assert cached_res == "Cached Gemini Response 123"


def test_get_active_provider():
    # 1. Fallback when keys are empty
    with patch("app.services.llm.get_settings") as mock_settings:
        mock_settings.return_value = Settings(GEMINI_API_KEY="", GROQ_API_KEY="")
        assert get_active_provider() == "fallback"

    # 2. Gemini when GEMINI_API_KEY is present
    with patch("app.services.llm.get_settings") as mock_settings:
        mock_settings.return_value = Settings(GEMINI_API_KEY="AIzaSyDummyGeminiKey123", GROQ_API_KEY="")
        assert get_active_provider() == "gemini"

    # 3. Groq when only GROQ_API_KEY is present
    with patch("app.services.llm.get_settings") as mock_settings:
        mock_settings.return_value = Settings(GEMINI_API_KEY="", GROQ_API_KEY="gsk_DummyGroqKey123456789")
        assert get_active_provider() == "groq"


@pytest.mark.asyncio
async def test_health_endpoint_active_llm(client):
    response = await client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "active_llm" in data
    assert data["active_llm"] in ["gemini", "groq", "fallback"]
