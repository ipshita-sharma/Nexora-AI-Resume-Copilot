from pydantic import BaseModel


class JobMatchRequest(BaseModel):
    resume_text: str
    job_description: str
    title: str | None = None
    resume_id: str | None = None


class RoadmapStep(BaseModel):
    topic: str
    reason: str
    actions: list[str]
    priority: int


class JobMatchResponse(BaseModel):
    match_id: str | None = None
    title: str | None = None
    match_score: float
    semantic_score: float
    keyword_score: float
    missing_skills: list[str]
    suggested_keywords: list[str]
    roadmap: list[RoadmapStep]
    summary: str
