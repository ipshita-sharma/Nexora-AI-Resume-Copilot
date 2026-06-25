from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ai.assistant_service import ask_career_ai

router = APIRouter()


class AssistantRequest(BaseModel):
    message: str
    resume_text: str = ""


@router.post("/assistant")
async def assistant_chat(payload: AssistantRequest):

    response = ask_career_ai(
    payload.message,
    payload.resume_text
)

    return {
        "response": response
    }