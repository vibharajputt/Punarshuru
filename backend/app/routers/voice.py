from typing import Optional
from fastapi import APIRouter, File, Form, UploadFile
from app.schemas.voice import TranscriptionResponse
from app.services.voice import transcribe_audio

router = APIRouter(prefix="/voice", tags=["Voice"])


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_voice(
    file: UploadFile = File(...),
    language: Optional[str] = Form(None),
) -> TranscriptionResponse:
    """
    Transcribes uploaded audio (WebM, WAV, MP3, M4A, OGG) using Groq Whisper.
    Accepts audio recording from frontend voice recorder when Web Speech API is unsupported.
    """
    content = await file.read()
    return await transcribe_audio(
        file_bytes=content,
        filename=file.filename or "audio.webm",
        content_type=file.content_type or "audio/webm",
        language=language,
    )
