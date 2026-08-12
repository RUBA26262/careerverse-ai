import re
from typing import Optional, List, Dict
from pydantic import BaseModel, EmailStr, field_validator


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    grade: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Name must be at least 2 characters")
        return v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Za-z]", v) or not re.search(r"[0-9]", v):
            raise ValueError("Password must include at least one letter and one number")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    grade: Optional[str] = None
    role: str

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class AssessmentSubmit(BaseModel):
    answers: Dict[str, int]  # question_id -> 1..5


class ChatMessage(BaseModel):
    role: str
    content: str


class MentorChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None


class MentorChatResponse(BaseModel):
    reply: str
