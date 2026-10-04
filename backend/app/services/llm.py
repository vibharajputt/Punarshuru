import asyncio
import hashlib
import json as _json
import logging
import re
import sqlite3
from pathlib import Path
from typing import Any

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)

CACHE_DB_PATH = Path(__file__).parent.parent.parent / "llm_cache.db"


def _init_cache_db() -> None:
    try:
        conn = sqlite3.connect(str(CACHE_DB_PATH))
        with conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS llm_cache (
                    prompt_hash TEXT PRIMARY KEY,
                    response_text TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
        conn.close()
    except Exception as e:
        logger.warning(f"Failed to initialize SQLite LLM cache: {e}")


def _get_cache(prompt_hash: str) -> str | None:
    try:
        conn = sqlite3.connect(str(CACHE_DB_PATH))
        cursor = conn.cursor()
        cursor.execute("SELECT response_text FROM llm_cache WHERE prompt_hash = ?", (prompt_hash,))
        row = cursor.fetchone()
        conn.close()
        return row[0] if row else None
    except Exception:
        return None


def _set_cache(prompt_hash: str, response_text: str) -> None:
    if not response_text or not response_text.strip():
        return
    try:
        conn = sqlite3.connect(str(CACHE_DB_PATH))
        with conn:
            conn.execute(
                "INSERT OR REPLACE INTO llm_cache (prompt_hash, response_text) VALUES (?, ?)",
                (prompt_hash, response_text),
            )
        conn.close()
    except Exception:
        pass


_init_cache_db()


def _hash_prompt(prompt: str, is_json: bool) -> str:
    key = f"{'json:' if is_json else 'text:'}{prompt.strip()}"
    return hashlib.sha256(key.encode("utf-8")).hexdigest()


def _clean_json_markdown(raw_text: str) -> str:
    txt = raw_text.strip()
    if "```" in txt:
        txt = re.sub(r"^```(?:json)?\s*", "", txt, flags=re.MULTILINE)
        txt = re.sub(r"\s*```$", "", txt, flags=re.MULTILINE)
    return txt.strip()


def get_active_provider() -> str:
    """Returns the active LLM provider name based on configured API keys."""
    current_settings = get_settings()
    if (
        current_settings.GEMINI_API_KEY
        and current_settings.GEMINI_API_KEY != "your_gemini_api_key_here"
        and len(current_settings.GEMINI_API_KEY.strip()) > 5
    ):
        return "gemini"
    if (
        current_settings.GROQ_API_KEY
        and current_settings.GROQ_API_KEY != "your_groq_api_key_here"
        and len(current_settings.GROQ_API_KEY.strip()) > 5
    ):
        return "groq"
    return "fallback"


async def _call_gemini(prompt: str, is_json: bool) -> str:
    """Calls Gemini using google-genai SDK with 5s timeout and 1 retry on 429."""
    current_settings = get_settings()
    api_key = current_settings.GEMINI_API_KEY
    if not api_key or api_key == "your_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY not configured")

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    config = types.GenerateContentConfig(
        response_mime_type="application/json" if is_json else "text/plain"
    )

    async def _invoke():
        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(
            None,
            lambda: client.models.generate_content(
                model=current_settings.GEMINI_MODEL,
                contents=prompt,
                config=config,
            ),
        )
        return (response.text or "").strip()

    for attempt in range(2):
        try:
            res = await asyncio.wait_for(_invoke(), timeout=5.0)
            res = (res or "").strip()
            if not res:
                raise ValueError("Gemini returned empty response")
            return res
        except asyncio.TimeoutError:
            raise TimeoutError("Gemini call timed out after 5s")
        except Exception as e:
            err_str = str(e).lower()
            if attempt == 0 and ("429" in err_str or "resource_exhausted" in err_str or "quota" in err_str):
                await asyncio.sleep(1.0)
                continue
            raise e

    raise RuntimeError("Gemini failed after retries")


async def _call_groq(prompt: str, is_json: bool) -> str:
    """Calls Groq using OpenAI-compatible REST API via httpx with 5s timeout and 1 retry on 429."""
    current_settings = get_settings()
    api_key = current_settings.GROQ_API_KEY
    if not api_key or api_key == "your_groq_api_key_here":
        raise ValueError("GROQ_API_KEY not configured")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload: dict[str, Any] = {
        "model": current_settings.GROQ_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
    }
    if is_json:
        payload["response_format"] = {"type": "json_object"}

    url = "https://api.groq.com/openai/v1/chat/completions"

    for attempt in range(2):
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code == 429 and attempt == 0:
                    await asyncio.sleep(1.0)
                    continue
                resp.raise_for_status()
                data = resp.json()
                content = (data.get("choices", [{}])[0].get("message", {}).get("content") or "").strip()
                if not content:
                    raise ValueError("Groq returned empty response")
                return content
        except httpx.TimeoutException:
            raise TimeoutError("Groq call timed out after 5s")
        except Exception as e:
            if attempt == 0 and "429" in str(e):
                await asyncio.sleep(1.0)
                continue
            raise e

    raise RuntimeError("Groq failed after retries")


def _template_fallback(prompt: str, is_json: bool) -> str:
    """Deterministic fallback templates when external LLM providers are unavailable."""
    lower_prompt = prompt.lower()
    if is_json:
        return _json.dumps({})

    if "motivation" in lower_prompt or "inspiring" in lower_prompt:
        return "Every career transition is built one verified milestone at a time. Focus on high-demand skills and start building."

    return "Automated analysis completed successfully."


async def complete(prompt: str, json: bool = False) -> Any:
    """
    Single unified entrypoint for all LLM calls per Addendum v2 & ux.md Agent v2.
    Cascade order: Cache -> Gemini (5s) -> Groq (5s) -> Template Fallback.
    Treats empty response as failure; logs failures at WARNING.
    Does not cache empty or invalid JSON responses.
    Returns parsed dict/list if json=True, or str if json=False.
    """
    prompt_hash = _hash_prompt(prompt, json)

    # 1. Check SQLite Cache
    cached = _get_cache(prompt_hash)
    if cached is not None:
        if json:
            try:
                parsed = _json.loads(_clean_json_markdown(cached))
                if parsed:  # Ignore empty or falsy JSON from cache
                    return parsed
            except Exception:
                pass
        else:
            if cached.strip():
                return cached

    result_text: str | None = None
    from_provider = False

    # 2. Try Gemini
    try:
        res = await _call_gemini(prompt, is_json=json)
        if not res or not res.strip():
            raise ValueError("Gemini returned empty response")
        if json:
            parsed_test = _json.loads(_clean_json_markdown(res))
            if not parsed_test:
                raise ValueError("Gemini returned empty JSON response")
        result_text = res.strip()
        from_provider = True
    except Exception as e:
        logger.warning(f"Gemini provider failed: {e}")

    # 3. Try Groq if Gemini failed
    if result_text is None:
        try:
            res = await _call_groq(prompt, is_json=json)
            if not res or not res.strip():
                raise ValueError("Groq returned empty response")
            if json:
                parsed_test = _json.loads(_clean_json_markdown(res))
                if not parsed_test:
                    raise ValueError("Groq returned empty JSON response")
            result_text = res.strip()
            from_provider = True
        except Exception as e:
            logger.warning(f"Groq provider failed: {e}")

    # 4. Fallback to Template if all providers failed
    if result_text is None:
        result_text = _template_fallback(prompt, is_json=json)
        from_provider = False
    elif from_provider:
        # Don't cache empty or invalid JSON
        if json:
            try:
                cleaned = _clean_json_markdown(result_text)
                parsed = _json.loads(cleaned)
                if parsed:
                    _set_cache(prompt_hash, result_text)
            except Exception:
                pass
        else:
            if result_text.strip():
                _set_cache(prompt_hash, result_text)

    if json:
        cleaned = _clean_json_markdown(result_text)
        try:
            parsed = _json.loads(cleaned)
            return parsed
        except Exception:
            return {}

    return result_text
