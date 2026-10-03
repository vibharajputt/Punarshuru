from fastapi import APIRouter
from app.schemas.onboarding import OnboardingChatRequest, OnboardingChatResponse
from app.services.onboarding_agent import handle_onboarding_chat

router = APIRouter(prefix="/onboarding", tags=["Onboarding Agent"])


@router.post("/chat", response_model=OnboardingChatResponse)
async def chat_onboarding(req: OnboardingChatRequest) -> OnboardingChatResponse:
    """
    Conversational onboarding agent endpoint.
    Processes resume or text chat messages, maintains session draft,
    classifies segment into 5 archetypes, and returns next question + quick replies.
    """
    return await handle_onboarding_chat(
        session_id=req.session_id,
        message=req.message,
        resume_text=req.resume_text,
    )
