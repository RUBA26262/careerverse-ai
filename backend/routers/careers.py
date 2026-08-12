from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from deps import get_current_user
import models
from data.careers import get_career
from scoring import compute_career_matches

router = APIRouter(prefix="/api/careers", tags=["careers"])


@router.get("/match")
def career_match(
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
        raise HTTPException(status_code=404, detail="Complete the assessment first")

    trait_scores = result.trait_scores
    matches = compute_career_matches(trait_scores, top_n=5)

    traits = [{"label": label, "score": score} for label, score in trait_scores.items()]

    return {"traits": traits, "matches": matches}


@router.get("/{career_id}")
def career_detail(career_id: str):
    career = get_career(career_id)
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")
    return career
