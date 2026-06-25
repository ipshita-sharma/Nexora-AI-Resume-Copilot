from fastapi import APIRouter
from sqlalchemy import delete
from app.api.deps import CurrentUser, DbSession
from app.models.learning import LearningRecommendation
from app.schemas.learning import LearningRoadmapRequest, LearningRoadmapResponse
from app.services.ai.learning_engine import LearningEngine
from app.services.security.users import ensure_user

router = APIRouter()


@router.post("/roadmap", response_model=LearningRoadmapResponse)
async def roadmap(payload: LearningRoadmapRequest, current_user: CurrentUser, db: DbSession):
    user = await ensure_user(db, current_user)
    result = await LearningEngine().roadmap(
    target_role=payload.target_role,
    timeline=payload.timeline,
    resume_context=payload.resume_context,

    resume_skills=payload.resume_skills,
    missing_skills=payload.missing_skills,
    jd_missing_skills=payload.jd_missing_skills,

    interview_weak_areas=payload.interview_weak_areas,
    resume_weak_sections=payload.resume_weak_sections,

    job_match_score=payload.job_match_score,
)
    await db.execute(
     delete(LearningRecommendation)
     .where(
        LearningRecommendation.user_id == user.id
    )
)
    for rec in result["recommendations"]:
        db.add(
            LearningRecommendation(
                user_id=user.id,
                topic=rec["topic"],
                source_type="generated_roadmap",
                priority=rec["priority"],
                reason=rec["reason"],
                actions=rec["actions"],
            )
        )
    await db.commit()
    return result
