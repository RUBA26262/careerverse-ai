from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from deps import get_current_user
import models
import schemas
from data.questions import QUESTIONS
from scoring import compute_trait_scores

router = APIRouter(prefix="/api/assessment", tags=["assessment"])


@router.get("/questions")
def get_questions():
    return {"questions": QUESTIONS}


@router.post("/submit")
def submit_assessment(
    payload: schemas.AssessmentSubmit,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not payload.answers:
        raise HTTPException(status_code=400, detail="No answers submitted")

    trait_scores = compute_trait_scores(payload.answers)

    result = models.AssessmentResult(user_id=current_user.id, trait_scores=trait_scores)
    db.add(result)
    db.commit()
    db.refresh(result)

    return {"id": result.id, "trait_scores": trait_scores}


@router.get("/latest")
def latest_assessment(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    result = (
        db.query(models.AssessmentResult)
        .filter(models.AssessmentResult.user_id == current_user.id)
        .order_by(models.AssessmentResult.created_at.desc())
        .first()
    )
    if not result:
        raise HTTPException(status_code=404, detail="No assessment completed yet")

    return {"id": result.id, "trait_scores": result.trait_scores, "created_at": result.created_at}
