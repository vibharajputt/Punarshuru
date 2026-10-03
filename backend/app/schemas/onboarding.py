from pydantic import BaseModel, Field


class OnboardingChatRequest(BaseModel):
    session_id: str
    message: str = ""
    resume_text: str | None = None


class OnboardingChatResponse(BaseModel):
    reply: str
    quick_replies: list[str] = Field(default_factory=list)
    profile_draft: dict = Field(default_factory=dict)
    missing_fields: list[str] = Field(default_factory=list)
    segment: str = "returner"
    done: bool = False
