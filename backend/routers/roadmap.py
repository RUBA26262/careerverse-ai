from fastapi import APIRouter, Depends, HTTPException

from deps import get_current_user
import models
from data.careers import get_career

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])


@router.get("/{career_id}")
def get_roadmap(career_id: str, current_user: models.User = Depends(get_current_user)):
    career = get_career(career_id)
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")

    return {
        "career": career["name"],
        "summary": f"A step-by-step path from where {current_user.name.split(' ')[0]} is now "
                   f"toward becoming a {career['name']}, ordered from foundation to launch.",
        "steps": career["roadmap"],
    }
