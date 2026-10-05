import asyncio
import json
import logging
import uuid
from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest

from app.core.config import Settings
from app.services.llm import (
    _call_gemini,
    _call_groq,
    _get_cache,
    _hash_prompt,
    complete,
    get_active_provider,
)


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


# ── Agent v2 LLM Tests (5s timeout, empty response, WARNING logs, caching rules) ─


@pytest.mark.asyncio
async def test_gemini_5s_timeout():
    """Verify Gemini provider raises TimeoutError mentioning 5s on timeout."""
    async def mock_wait_for(coro, timeout):
        try:
            coro.close()
        except Exception:
            pass
        raise asyncio.TimeoutError()

    with patch("app.services.llm.get_settings") as mock_settings, \
         patch("google.genai.Client"), \
         patch("asyncio.wait_for", side_effect=mock_wait_for):
        mock_settings.return_value = Settings(
            GEMINI_API_KEY="AIzaSyDummy1234567890",
            GEMINI_MODEL="gemini-2.0-flash",
        )
        with pytest.raises(TimeoutError, match="timed out after 5s"):
            await _call_gemini("test prompt", is_json=False)


@pytest.mark.asyncio
async def test_groq_5s_timeout():
    """Verify Groq provider raises TimeoutError mentioning 5s on httpx timeout."""
    with patch("app.services.llm.get_settings") as mock_settings:
        mock_settings.return_value = Settings(
            GROQ_API_KEY="gsk_DummyGroqKey1234567890",
            GROQ_MODEL="llama-3.3-70b-versatile",
        )
        with patch("httpx.AsyncClient.post", side_effect=httpx.TimeoutException("ReadTimeout")):
            with pytest.raises(TimeoutError, match="timed out after 5s"):
                await _call_groq("test prompt", is_json=False)


@pytest.mark.asyncio
async def test_call_gemini_empty_response_raises():
    """Verify _call_gemini raises ValueError when returned text is empty."""
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.text = "   "
    mock_client.models.generate_content.return_value = mock_resp

    with patch("app.services.llm.get_settings") as mock_settings, \
         patch("google.genai.Client", return_value=mock_client):
        mock_settings.return_value = Settings(
            GEMINI_API_KEY="AIzaSyDummy1234567890",
            GEMINI_MODEL="gemini-2.0-flash",
        )
        with pytest.raises(ValueError, match="empty response"):
            await _call_gemini("test prompt", is_json=False)


@pytest.mark.asyncio
async def test_call_groq_empty_response_raises():
    """Verify _call_groq raises ValueError when returned choice content is empty."""
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {"choices": [{"message": {"content": ""}}]}
    mock_resp.raise_for_status = MagicMock()

    with patch("app.services.llm.get_settings") as mock_settings:
        mock_settings.return_value = Settings(
            GROQ_API_KEY="gsk_DummyGroqKey1234567890",
            GROQ_MODEL="llama-3.3-70b-versatile",
        )
        with patch("httpx.AsyncClient.post", AsyncMock(return_value=mock_resp)):
            with pytest.raises(ValueError, match="empty response"):
                await _call_groq("test prompt", is_json=False)


@pytest.mark.asyncio
async def test_empty_response_treated_as_failure_and_falls_back():
    """Verify empty Gemini response causes failover to Groq."""
    groq_output = json.dumps({"role": "Software Engineer"})
    with patch("app.services.llm._call_gemini", AsyncMock(return_value="")), \
         patch("app.services.llm._call_groq", AsyncMock(return_value=groq_output)) as mock_groq:

        prompt = f"Prompt testing empty gemini fallback {uuid.uuid4()}"
        res = await complete(prompt, json=True)
        assert res == {"role": "Software Engineer"}
        assert mock_groq.call_count == 1


@pytest.mark.asyncio
async def test_provider_failures_logged_at_warning(caplog):
    """Verify failures from Gemini and Groq are logged at WARNING level."""
    with caplog.at_level(logging.WARNING), \
         patch("app.services.llm._call_gemini", side_effect=ValueError("Gemini connection error")), \
         patch("app.services.llm._call_groq", side_effect=RuntimeError("Groq 503 error")):

        prompt = f"Prompt for warning log test {uuid.uuid4()}"
        await complete(prompt, json=False)

        warnings = [record.message for record in caplog.records if record.levelno >= logging.WARNING]
        assert any("Gemini provider failed" in w for w in warnings)
        assert any("Groq provider failed" in w for w in warnings)


@pytest.mark.asyncio
async def test_do_not_cache_empty_response():
    """Verify empty responses are never persisted in SQLite cache."""
    prompt = f"Prompt for empty cache test {uuid.uuid4()}"
    h = _hash_prompt(prompt, is_json=False)
    with patch("app.services.llm._call_gemini", AsyncMock(return_value="")), \
         patch("app.services.llm._call_groq", side_effect=Exception("Groq down")):

        await complete(prompt, json=False)
        assert _get_cache(h) is None


@pytest.mark.asyncio
async def test_do_not_cache_invalid_json():
    """Verify invalid JSON text is not stored in SQLite cache."""
    prompt = f"Prompt for invalid json test {uuid.uuid4()}"
    h = _hash_prompt(prompt, is_json=True)
    with patch("app.services.llm._call_gemini", AsyncMock(return_value="Not valid json {test:")), \
         patch("app.services.llm._call_groq", side_effect=Exception("Groq down")):

        res = await complete(prompt, json=True)
        assert res == {}
        assert _get_cache(h) is None


@pytest.mark.asyncio
async def test_do_not_cache_empty_json():
    """Verify empty JSON '{}' is treated as failure and not stored in cache."""
    prompt = f"Prompt for empty json dict test {uuid.uuid4()}"
    h = _hash_prompt(prompt, is_json=True)
    with patch("app.services.llm._call_gemini", AsyncMock(return_value="{}")), \
         patch("app.services.llm._call_groq", side_effect=Exception("Groq down")):

        res = await complete(prompt, json=True)
        assert res == {}
        assert _get_cache(h) is None


@pytest.mark.asyncio
async def test_cache_valid_json():
    """Verify valid non-empty JSON IS cached and reused on subsequent call."""
    prompt = f"Prompt for valid json cache test {uuid.uuid4()}"
    h = _hash_prompt(prompt, is_json=True)
    valid_data = {"skill": "FastAPI", "level": "expert"}
    valid_json_str = json.dumps(valid_data)

    mock_gemini = AsyncMock(return_value=valid_json_str)
    with patch("app.services.llm._call_gemini", mock_gemini):
        res1 = await complete(prompt, json=True)
        assert res1 == valid_data
        assert mock_gemini.call_count == 1
        assert _get_cache(h) is not None

    # Calling again should hit SQLite cache without calling Gemini
    with patch("app.services.llm._call_gemini", side_effect=Exception("Should not be called")):
        res2 = await complete(prompt, json=True)
        assert res2 == valid_data
