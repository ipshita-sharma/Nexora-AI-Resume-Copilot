from pydantic import BaseModel


class AnalyticsOverview(BaseModel):
    ats_trend: list[dict]
    interview_trend: list[dict]
    skill_progress: list[dict]
    match_history: list[dict]
    weak_areas: list[dict]
    recommendations: list[dict]
    summary_cards: list[dict]
