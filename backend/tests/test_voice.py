import io
import pytest
from app.services.voice import transcribe_audio


@pytest.mark.asyncio
async def test_voice_transcribe_fallback_when_no_key():
    dummy_bytes = b"RIFF....WAVEfmt ...."
    res = await transcribe_audio(file_bytes=dummy_bytes, filename="test.wav", content_type="audio/wav", language="hi")
    assert res.text
    assert len(res.text) > 0


@pytest.mark.asyncio
async def test_voice_transcribe_api_endpoint(client):
    audio_content = io.BytesIO(b"fake audio data test string")
    files = {"file": ("test_recording.webm", audio_content, "audio/webm")}
    data = {"language": "hi"}

    response = await client.post("/api/voice/transcribe", files=files, data=data)
    assert response.status_code == 200
    res_data = response.json()
    assert "text" in res_data
    assert len(res_data["text"]) > 0
