from functools import lru_cache
from typing import Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "Punarshuru"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False

    DATABASE_URL: str = "sqlite:///./punarshuru_dev.db"

    # Gemini LLM Config
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    GEMINI_TIMEOUT: int = 8

    # Groq LLM & STT Config (Addendum v2)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_STT_MODEL: str = "whisper-large-v3"

    SECRET_KEY: str = "change-me-in-production"
    ALLOWED_ORIGINS: Union[list[str], str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"
    SIMILARITY_THRESHOLD: float = 0.75

    @field_validator("ALLOWED_ORIGINS", mode="after")
    @classmethod
    def parse_allowed_origins(cls, v: Union[str, list[str]]) -> list[str]:
        if isinstance(v, str):
            v_str = v.strip()
            if v_str.startswith("[") and v_str.endswith("]"):
                import json
                try:
                    parsed = json.loads(v_str)
                    if isinstance(parsed, list):
                        return [str(origin).strip() for origin in parsed if str(origin).strip()]
                except Exception:
                    pass
            origins = [origin.strip() for origin in v_str.split(",") if origin.strip()]
            return origins if origins else ["*"]
        if isinstance(v, list):
            return [str(origin).strip() for origin in v if str(origin).strip()]
        return ["*"]


@lru_cache()
def get_settings() -> Settings:
    return Settings()
