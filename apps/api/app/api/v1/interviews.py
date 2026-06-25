from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.api.deps import CurrentUser, DbSession
from app.models.interview import Interview
from app.schemas.interview import (
    InterviewAnswerRequest,
    InterviewAnswerResponse,
    InterviewFeedbackResponse,
    InterviewStartRequest,
    InterviewStartResponse,
)
from app.services.ai.interview_engine import InterviewEngine
from app.services.security.users import ensure_user

router = APIRouter()


@router.post("/start", response_model=InterviewStartResponse)
async def start_interview(payload: InterviewStartRequest, current_user: CurrentUser, db: DbSession):
    user = await ensure_user(db, current_user)
    result = await InterviewEngine().start(
        role=payload.role,
        difficulty=payload.difficulty,
        interview_type=payload.interview_type,
        company_type=payload.company_type,
        resume_context=payload.resume_context,
        focus_skills=payload.focus_skills,
    )
    interview = Interview(
        user_id=user.id,
        role=payload.role,
        difficulty=payload.difficulty,
        interview_type=payload.interview_type,
        company_type=payload.company_type,
        questions=result["questions"],
        transcript=[],
    )
    db.add(interview)
    await db.commit()
    await db.refresh(interview)
    return {"interview_id": interview.id, **result}


@router.post("/answer", response_model=InterviewAnswerResponse)
async def answer_question(payload: InterviewAnswerRequest, current_user: CurrentUser, db: DbSession):
    await ensure_user(db, current_user)
    result = await InterviewEngine().evaluate_answer(
        question=payload.question,
        answer=payload.answer,
        role=payload.role,
        difficulty=payload.difficulty,
        transcript=payload.transcript,
    )
    if payload.interview_id:
        interview = await db.get(Interview, payload.interview_id)
        if not interview or interview.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Interview not found")
        transcript = interview.transcript or []
        transcript.append(
            {
                "question": payload.question,
                "answer": payload.answer,
                "score": result.get("score", 0),
                "feedback": result,
                "created_at": datetime.utcnow().isoformat(),
            }
        )
        interview.transcript = transcript
        interview.current_question_index = min(
            len(interview.questions or []) - 1,
            interview.current_question_index + 1,
        )
        interview.overall_score = result.get("score", interview.overall_score)
        interview.communication_score = result.get("communication_score", interview.communication_score)
        interview.technical_score = result.get("technical_score", interview.technical_score)
        interview.confidence_score = result.get("confidence_score", interview.confidence_score)
        await db.commit()
    return result


@router.post("/{interview_id}/feedback", response_model=InterviewFeedbackResponse)
async def final_feedback(interview_id: str, current_user: CurrentUser, db: DbSession):
    interview = await db.get(Interview, interview_id)
    if not interview or interview.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Interview not found")
    feedback = await InterviewEngine().final_feedback(interview.transcript or [], interview.role)
    interview.feedback = feedback
    interview.status = "completed"
    interview.completed_at = datetime.utcnow()
    interview.overall_score = feedback.get("overall_score", interview.overall_score)
    interview.communication_score = feedback.get("communication_score", interview.communication_score)
    interview.technical_score = feedback.get("technical_score", interview.technical_score)
    interview.confidence_score = feedback.get("confidence_score", interview.confidence_score)
    await db.commit()
    return feedback
