from app.services.ai.embeddings import EmbeddingService
from app.services.ai.llm import LLMGateway
from app.services.ai.skills import extract_skills

IMPLIED_SKILLS = {
    "fastapi": [
        "software development",
        "api design",
        "testing",
    ],
    "express": [
        "software development",
        "api design",
    ],
    "docker": [
        "deployment",
        "software development",
    ],
    "react": [
        "software development",
    ],
    "node.js": [
        "software development",
    ],
    "machine learning": [
        "problem solving",
    ],
    "java": [
        "object oriented programming",
        "oop",
        "debugging"
    ],

    "software engineering": [
        "software development",
        "debugging"
    ],

    "data structures": [
        "algorithms"
    ]
}

class JobDescriptionMatcher:
    def __init__(self) -> None:
        self.embeddings = EmbeddingService()
        self.llm = LLMGateway()

    async def match(self, resume_text: str, job_description: str, title: str | None = None) -> dict:
        if (
    not resume_text.strip()
    and not job_description.strip()
    and not (title or "").strip()
):
         return {
        "title": "",
        "match_score": 0,
        "semantic_score": 0,
        "keyword_score": 0,
        "missing_skills": [],
        "suggested_keywords": [],
        "roadmap": [],
        "summary": "",
    }
        resume_skills = extract_skills(resume_text)
        jd_skills = extract_skills(job_description)

        print("RESUME_SKILLS =", resume_skills)
        print("JD_SKILLS =", jd_skills)
        
        expanded_resume_skills = set(resume_skills)

        for skill in resume_skills:
         expanded_resume_skills.update(
         IMPLIED_SKILLS.get(skill, [])
    )

        print("EXPANDED_RESUME_SKILLS =", expanded_resume_skills)

        missing_skills = sorted(
         set(jd_skills) - expanded_resume_skills
)
        print("MISSING_SKILLS =", missing_skills)
        keyword_score = round(
    (
        len(expanded_resume_skills & set(jd_skills))
        / max(1, len(set(jd_skills)))
    ) * 100,
    2,
)
        semantic_score = self.embeddings.similarity(resume_text, job_description)
        match_score = round((semantic_score * 0.62) + (keyword_score * 0.38), 2)
        suggested_keywords = [skill for skill in jd_skills if skill not in resume_skills][:12]

        fallback = {
            "summary": self._summary(match_score, title, missing_skills),
            "roadmap": self._roadmap(missing_skills, title),
        }
        llm = await self.llm.structured_insights(
            "job_description_match",
            {
                "title": title,
                "match_score": match_score,
                "semantic_score": semantic_score,
                "keyword_score": keyword_score,
                "missing_skills": missing_skills,
                "resume_sample": resume_text[:4000],
                "job_description": job_description[:4000],
            },
            fallback,
        )

        return {
            "title": title,
            "match_score": match_score,
            "semantic_score": semantic_score,
            "keyword_score": keyword_score,
            "missing_skills": missing_skills,
            "suggested_keywords": suggested_keywords,
            "roadmap": llm.get("roadmap", fallback["roadmap"])[:6],
            "summary": llm.get("summary", fallback["summary"]),
        }

    @staticmethod
    def _summary(score: float, title: str | None, missing_skills: list[str]) -> str:
        role = title or "this role"
        if score >= 82:
            return f"Your resume is strongly aligned with {role}. Optimize the top keywords and quantify matching projects."
        if score >= 65:
            return f"You are within reach for {role}; close the most visible gaps before applying."
        return f"The resume needs deeper repositioning for {role}, starting with the missing skill evidence."

    @staticmethod
    def _roadmap(missing_skills: list[str], title: str | None) -> list[dict]:
        if not missing_skills and not title:
         return []

        if not missing_skills:
         return [
        {
            "topic": "Role-specific impact metrics",
            "reason": "You already cover the core stack; stronger evidence will differentiate the application.",
            "actions": [
                "Add 3 quantified project outcomes",
                "Mirror the job title language in your summary"
            ],
            "priority": 2,
        }
    ]

        return [
            {
                "topic": skill.title(),
                "reason": f"{skill} appears important for {title or 'the job'} but is weak or absent in the resume.",
                "actions": [
                    f"Complete one focused project or lab using {skill}.",
                    f"Add a resume bullet showing how you used {skill} to solve a concrete problem.",
                    "Prepare one interview story using the STAR format.",
                ],
                "priority": 1 if index < 3 else 2,
            }
            for index, skill in enumerate(missing_skills[:6])
        ]
