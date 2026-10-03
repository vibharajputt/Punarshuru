from pydantic import BaseModel
from typing import Optional


class TranscriptionResponse(BaseModel):
    text: str
    language: Optional[str] = None
