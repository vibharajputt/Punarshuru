from pydantic import BaseModel, Field


class OnboardingChatRequest(BaseModel):
    session_id: str
    message: str = ""
    resume_text: str | None = None
    # action:"confirm" signals the user tapped the Confirm button (never text-matched)
    action: str | None = None


class OnboardingChatResponse(BaseModel):
    reply: str
    quick_replies: list[str] = Field(default_factory=list)
    profile_draft: dict = Field(default_factory=dict)
    missing_fields: list[str] = Field(default_factory=list)
    segment: str = "returner"
    done: bool = False


class OnboardingSessionResponse(BaseModel):
    user_id: str
    profile_draft: dict = Field(default_factory=dict)
    current_slot: str = "current_role"
    segment: str = "returner"
    done: bool = False
    history: list[dict] = Field(default_factory=list)
