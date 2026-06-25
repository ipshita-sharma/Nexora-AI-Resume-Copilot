from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.common import ScoreBreakdown, Suggestion


class ResumeAnalyzeResponse(BaseModel):
    resume_id: str | None = None
    filename: str | None = None
    target_role: str | None = None

    resume_text: str | None = None

    sections: dict[str, str]
    extracted_skills: list[str]
    missing_skills: list[str]
    missing_keywords: list[str]
    weak_sections: list[str]
    scores: ScoreBreakdown
    suggestions: list[Suggestion]
    summary: str


class ResumeHistoryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    filename: str | None = None
    target_role: str | None = None
    ats_score: float
    semantic_score: float
    keyword_score: float
    formatting_score: float
    grammar_score: float
    extracted_skills: list[str]
    missing_skills: list[str]
    created_at: datetime
