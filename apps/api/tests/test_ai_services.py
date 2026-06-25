import pytest

from app.services.ai.job_matcher import JobDescriptionMatcher
from app.services.ai.learning_engine import LearningEngine
from app.services.ai.resume_analyzer import ResumeAnalyzer


RESUME = """
Summary
Software engineering student building React, Next.js, Python, FastAPI and PostgreSQL applications.
Experience
- Built analytics dashboards with TypeScript and REST APIs.
- Created AI tools with LangChain, embeddings, and Docker.
Education
Computer Science
Skills
React, Next.js, TypeScript, Python, FastAPI, PostgreSQL, SQL, Docker, LangChain, embeddings
"""

JD = """
Build full-stack AI products with React, Next.js, TypeScript, Python, FastAPI, PostgreSQL,
Docker, embeddings, vector search, system design, and strong communication.
"""


@pytest.mark.asyncio
async def test_resume_analyzer_returns_structured_scores():
    result = await ResumeAnalyzer().analyze(RESUME, "Software Engineer Intern", JD)
    assert 0 <= result["scores"]["ats"] <= 100
    assert "sections" in result
    assert "python" in result["extracted_skills"]


@pytest.mark.asyncio
async def test_job_matcher_detects_missing_skills():
    result = await JobDescriptionMatcher().match(RESUME, JD, "AI Engineering Intern")
    assert 0 <= result["match_score"] <= 100
    assert isinstance(result["roadmap"], list)


def test_learning_engine_builds_weekly_plan():
    result = LearningEngine().roadmap(
        "Software Engineer Intern",
        ["dbms joins", "system design"],
        ["quantified impact"],
        ["experience"],
    )
    assert result["recommendations"]
    assert result["weekly_plan"]
