import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    JSON,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    hashed_password = Column(
        String,
        nullable=False
    )

    grade = Column(
        String,
        nullable=True
    )

    role = Column(
        String,
        default="student"
    )

    created_at = Column(
        DateTime,
        default=datetime.datetime.utcnow
    )

    assessments = relationship(
        "AssessmentResult",
        back_populates="user"
    )

    resume_analyses = relationship(
        "ResumeAnalysis",
        back_populates="user"
    )


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    trait_scores = Column(
        JSON,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="assessments"
    )


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    filename = Column(
        String,
        nullable=False
    )

    target_role = Column(
        String,
        nullable=False
    )

    ats_score = Column(
        Integer,
        nullable=False
    )

    skill_score = Column(
        Integer,
        nullable=False
    )

    section_score = Column(
        Integer,
        nullable=False
    )

    word_count = Column(
        Integer,
        nullable=False
    )

    pages = Column(
        Integer,
        nullable=False
    )

    skills = Column(
        JSON,
        nullable=False
    )

    missing_skills = Column(
        JSON,
        nullable=False
    )

    suggestions = Column(
        JSON,
        nullable=False
    )

    sections = Column(
        JSON,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="resume_analyses"
    )