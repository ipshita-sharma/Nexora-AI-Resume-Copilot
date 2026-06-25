from fastapi import APIRouter
from sqlalchemy import desc, select

from app.api.deps import CurrentUser, DbSession
from app.models.interview import Interview
from app.models.job_match import JobMatch
from app.models.learning import LearningRecommendation
from app.models.resume import Resume
from app.schemas.analytics import AnalyticsOverview
from app.services.security.users import ensure_user

router = APIRouter()


@router.get("/overview", response_model=AnalyticsOverview)
async def overview(current_user: CurrentUser, db: DbSession):
    await ensure_user(db, current_user)
    resumes = (
        await db.execute(
            select(Resume).where(Resume.user_id == current_user.id).order_by(desc(Resume.created_at)).limit(8)
        )
    ).scalars().all()
    interviews = (
        await db.execute(
            select(Interview).where(Interview.user_id == current_user.id).order_by(desc(Interview.created_at)).limit(8)
        )
    ).scalars().all()
    matches = (
        await db.execute(
            select(JobMatch).where(JobMatch.user_id == current_user.id).order_by(desc(JobMatch.created_at)).limit(8)
        )
    ).scalars().all()
    recs = (
        await db.execute(
            select(LearningRecommendation)
            .where(LearningRecommendation.user_id == current_user.id)
            .order_by(LearningRecommendation.priority, desc(LearningRecommendation.created_at))
            .limit(6)
        )
    ).scalars().all()
    print("USER:", current_user.id)
    print("RESUMES:", len(resumes))
    print("INTERVIEWS:", len(interviews))
    for i in interviews:
     print("INTERVIEW USER:", i.user_id)
    print("MATCHES:", len(matches))
    for m in matches:
     print("MATCH USER:", m.user_id)
    print("RECS:", len(recs))
    for r in recs:
     print("REC USER:", r.user_id)
    if (
    not resumes
    and not interviews
    and not matches
    and not recs
):
     return {
        "ats_trend": [],
        "interview_trend": [],
        "skill_progress": [],
        "match_history": [],
        "weak_areas": [],
        "recommendations": [],
        "summary_cards": [
            {"label": "Career Score", "value": 0, "delta": "Start Here"},
            {"label": "ATS Readiness", "value": 0, "delta": "Upload Resume"},
            {"label": "Interview Ready", "value": 0, "delta": "Take Mock"},
            {"label": "Role Match", "value": 0, "delta": "Analyze JD"},
        ],
    }

    weak_counts: dict[str, int] = {}
    for resume in resumes:
        for item in resume.missing_skills + resume.weak_sections:
            weak_counts[item] = weak_counts.get(item, 0) + 1
    for interview in interviews:
        for item in (interview.feedback or {}).get("weak_areas", []):
            weak_counts[item] = weak_counts.get(item, 0) + 1

    skill_counts: dict[str, int] = {}
    for resume in resumes:
        for skill in resume.extracted_skills:
            skill_counts[skill] = skill_counts.get(skill, 0) + 1

    return {
        "ats_trend": [
            {"date": resume.created_at.date().isoformat(), "score": resume.ats_score}
            for resume in reversed(resumes)
        ],
        "interview_trend": [
            {"date": item.created_at.date().isoformat(), "score": item.overall_score or 0}
            for item in reversed(interviews)
        ],
        "skill_progress": [
            {"skill": skill.title(), "value": min(100, 40 + count * 18)}
            for skill, count in sorted(skill_counts.items())[:8]
        ],
        "match_history": [
            {"date": item.created_at.date().isoformat(), "score": item.match_score, "role": item.title or "Role"}
            for item in reversed(matches)
        ],
        "weak_areas": [
            {"name": name.title(), "count": count}
            for name, count in sorted(weak_counts.items(), key=lambda pair: pair[1], reverse=True)[:8]
        ],
        "recommendations": [
            {"topic": rec.topic, "priority": rec.priority, "reason": rec.reason}
            for rec in recs
        ],
        "summary_cards": [
            {"label": "Latest ATS", "value": round(resumes[0].ats_score, 1) if resumes else 0, "delta": "+8.4"},
            {"label": "Interview Avg", "value": round(sum(i.overall_score for i in interviews) / max(1, len(interviews)), 1), "delta": "+5.1"},
            {"label": "JD Match Avg", "value": round(sum(m.match_score for m in matches) / max(1, len(matches)), 1), "delta": "+11.2"},
            {"label": "Open Roadmap Items", "value": len(recs), "delta": "active"},
        ],
    }


def _demo_overview() -> dict:
    return {
        "ats_trend": [
            {"date": "Week 1", "score": 62},
            {"date": "Week 2", "score": 70},
            {"date": "Week 3", "score": 78},
            {"date": "Week 4", "score": 86},
        ],
        "interview_trend": [
            {"date": "Mock 1", "score": 58},
            {"date": "Mock 2", "score": 68},
            {"date": "Mock 3", "score": 76},
            {"date": "Mock 4", "score": 82},
        ],
        "skill_progress": [
            {"skill": "React", "value": 82},
            {"skill": "SQL", "value": 68},
            {"skill": "System Design", "value": 54},
            {"skill": "Communication", "value": 78},
            {"skill": "Python", "value": 72},
        ],
        "match_history": [
            {"date": "Frontend Intern", "score": 74, "role": "Frontend Intern"},
            {"date": "SWE Intern", "score": 81, "role": "SWE Intern"},
            {"date": "AI Engineer", "score": 67, "role": "AI Engineer"},
        ],
        "weak_areas": [
            {"name": "System Design", "count": 4},
            {"name": "DBMS Joins", "count": 3},
            {"name": "Quantified Impact", "count": 3},
            {"name": "React State Management", "count": 2},
        ],
        "recommendations": [
            {"topic": "DBMS Joins", "priority": 1, "reason": "Frequently missing from interview answers."},
            {"topic": "React State Management", "priority": 1, "reason": "Needed for target frontend roles."},
            {"topic": "Operating Systems Scheduling", "priority": 2, "reason": "Weak CS fundamentals signal."},
        ],
        "summary_cards": [
            {"label": "Latest ATS", "value": 86, "delta": "+8.4"},
            {"label": "Interview Avg", "value": 82, "delta": "+5.1"},
            {"label": "JD Match Avg", "value": 74, "delta": "+11.2"},
            {"label": "Open Roadmap Items", "value": 9, "delta": "active"},
        ],
    }
