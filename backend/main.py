import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from database import Base, engine
import models

from routers import (
    auth,
    assessment,
    careers,
    roadmap,
    mentor,
    resume,
)

from rate_limit import limiter


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="CareerVerse AI API",
    version="0.2.0",
)


# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)


# CORS
_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in _origins
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Existing API routes
app.include_router(auth.router)
app.include_router(assessment.router)
app.include_router(careers.router)
app.include_router(roadmap.router)
app.include_router(mentor.router)

# New Resume Analyzer API
app.include_router(resume.router)


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "CareerVerse AI API"
    }