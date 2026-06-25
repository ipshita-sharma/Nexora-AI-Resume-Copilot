from fastapi import APIRouter

from app.api.deps import CurrentUser, DbSession
from app.models.job_match import JobMatch
from app.schemas.job_match import JobMatchRequest, JobMatchResponse
from app.services.ai.job_matcher import JobDescriptionMatcher
from app.services.security.users import ensure_user

router = APIRouter()


@router.post("/analyze", response_model=JobMatchResponse)
async def analyze_match(payload: JobMatchRequest, current_user: CurrentUser, db: DbSession):
    user = await ensure_user(db, current_user)
    result = await JobDescriptionMatcher().match(
        resume_text=payload.resume_text,
        job_description=payload.job_description,
        title=payload.title,
    )
    match = JobMatch(
        user_id=user.id,
        resume_id=payload.resume_id,
        title=payload.title,
        job_description=payload.job_description,
        match_score=result["match_score"],
        semantic_score=result["semantic_score"],
        keyword_score=result["keyword_score"],
        missing_skills=result["missing_skills"],
        suggested_keywords=result["suggested_keywords"],
        roadmap=result["roadmap"],
    )
    db.add(match)
    await db.commit()
    await db.refresh(match)
    return {"match_id": match.id, **result}
