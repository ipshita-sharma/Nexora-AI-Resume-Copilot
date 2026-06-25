from pydantic import BaseModel, Field


class InterviewStartRequest(BaseModel):
    role: str
    difficulty: str = Field(default="medium", pattern="^(easy|medium|hard|senior)$")
    interview_type: str = Field(default="mixed")
    company_type: str = Field(default="startup")
    resume_context: str | None = None
    focus_skills: list[str] = []


class InterviewQuestion(BaseModel):
    id: str
    type: str
    question: str
    rubric: list[str]


class InterviewStartResponse(BaseModel):
    interview_id: str | None = None
    role: str
    difficulty: str
    interview_type: str
    company_type: str
    questions: list[InterviewQuestion]
    current_question: InterviewQuestion


class InterviewAnswerRequest(BaseModel):
    interview_id: str | None = None
    question: str
    answer: str
    role: str
    difficulty: str = "medium"
    transcript: list[dict] = []


class InterviewAnswerResponse(BaseModel):
    score: float
    communication_score: float
    technical_score: float
    confidence_score: float
    strengths: list[str]
    improvements: list[str]
    follow_up_question: str


class InterviewFeedbackResponse(BaseModel):
    overall_score: float
    communication_score: float
    technical_score: float
    confidence_score: float
    weak_areas: list[str]
    strengths: list[str]
    improvement_plan: list[str]
    summary: str
