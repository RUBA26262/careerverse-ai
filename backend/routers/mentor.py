from fastapi import APIRouter, Depends

from deps import get_current_user
import models
import schemas
from ai_service import get_mentor_reply

router = APIRouter(prefix="/api/mentor", tags=["mentor"])


@router.post("/chat", response_model=schemas.MentorChatResponse)
async def chat(payload: schemas.MentorChatRequest, current_user: models.User = Depends(get_current_user)):
    reply = await get_mentor_reply(payload.message, payload.history)
    return schemas.MentorChatResponse(reply=reply)
