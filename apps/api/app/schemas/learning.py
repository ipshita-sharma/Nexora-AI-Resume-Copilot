from pydantic import BaseModel


class LearningRoadmapRequest(BaseModel):
    target_role: str
    timeline: str = "1 Month"

    resume_context: str | None = None

    resume_skills: list[str] = []
    missing_skills: list[str] = []
    jd_missing_skills: list[str] = []

    interview_weak_areas: list[str] = []
    resume_weak_sections: list[str] = []

    job_match_score: float | None = None


class LearningAction(BaseModel):
    label: str
    type: str
    effort: str


class LearningRecommendationOut(BaseModel):
    topic: str
    priority: int
    reason: str
    actions: list[LearningAction]


class LearningRoadmapResponse(BaseModel):
    target_role: str
    recommendations: list[LearningRecommendationOut]
    weekly_plan: list[dict]
