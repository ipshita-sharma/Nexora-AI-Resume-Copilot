from fastapi import APIRouter

from app.api.v1 import analytics, interviews, job_matches, learning, reports, resumes, users

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(resumes.router, prefix="/resumes", tags=["resumes"])
api_router.include_router(job_matches.router, prefix="/job-matches", tags=["job-matches"])
api_router.include_router(interviews.router, prefix="/interviews", tags=["interviews"])
api_router.include_router(learning.router, prefix="/learning", tags=["learning"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
