from pydantic import BaseModel, Field


class ScoreBreakdown(BaseModel):
    ats: float = Field(ge=0, le=100)
    semantic: float = Field(ge=0, le=100)
    keyword: float = Field(ge=0, le=100)
    formatting: float = Field(ge=0, le=100)
    grammar: float = Field(ge=0, le=100)


class Suggestion(BaseModel):
    title: str
    impact: str
    priority: str = "medium"
    action: str
