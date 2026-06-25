import re

from app.services.ai.embeddings import EmbeddingService
from app.services.ai.llm import LLMGateway
from app.services.ai.resume_parser import extract_sections
from app.services.ai.skills import ALL_SKILLS, extract_skills


ROLE_SKILL_HINTS = {
    "software": ["data structures", "algorithms", "system design", "sql", "rest api", "docker"],
    "frontend": ["react", "next.js", "typescript", "tailwind", "accessibility", "web performance"],
    "backend": ["python", "fastapi", "postgresql", "microservices", "docker", "system design"],
    "data": ["python", "sql", "machine learning", "nlp", "embeddings"],
    "ai": [
    "python",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "nlp",
    "computer vision",
    "rag",
    "langchain",
    "fastapi",
    "sql",
    "git",
]
}


class ResumeAnalyzer:
    def __init__(self) -> None:
        self.embeddings = EmbeddingService()
        self.llm = LLMGateway()

    async def analyze(
        self,
        text: str,
        target_role: str | None = None,
        job_description: str | None = None,
    ) -> dict:
        sections = extract_sections(text)
        extracted_skills = extract_skills(text)
        role_skills = self._role_skills(target_role or "")
        jd_skills = extract_skills(job_description or "")
        expected_skills = sorted(set(role_skills + jd_skills))
        extracted_lower = {
          skill.lower()
         for skill in extracted_skills
}

        missing_skills = [
            skill
            for skill in expected_skills
            if skill.lower()
            not in extracted_lower
]
        missing_keywords = self._missing_keywords(text, job_description or "", extracted_skills)
        weak_sections = self._weak_sections(sections)

        if job_description:

         semantic_reference = job_description

        else:

         semantic_reference = f"""
         Ideal candidate profile for {target_role}.

         Required technical skills:
          {", ".join(expected_skills)}

         Candidate should demonstrate:
    - relevant projects
    - technical implementation experience
    - problem solving ability
    - engineering knowledge
    - measurable achievements
    - tools and technologies usage
    """
        semantic_score = self.embeddings.similarity(text, semantic_reference) if semantic_reference else 72.0
        keyword_score = self._coverage(extracted_skills, expected_skills)
        formatting_score = self._formatting_score(text, sections)
        grammar_score = self._grammar_score(text)
        ats_score = round(
            (semantic_score * 0.34)
            + (keyword_score * 0.24)
            + (formatting_score * 0.24)
            + (grammar_score * 0.18),
            2,
        )

        fallback = {
            "summary": self._summary(ats_score, target_role, missing_skills),
            "suggestions": self._suggestions(missing_skills, weak_sections, formatting_score, grammar_score),
        }
        llm_insights = await self.llm.structured_insights(
            "resume_analysis",
            {
                "target_role": target_role,
                "sections": sections,
                "scores": {
                    "ats": ats_score,
                    "semantic": semantic_score,
                    "keyword": keyword_score,
                    "formatting": formatting_score,
                    "grammar": grammar_score,
                },
                "missing_skills": missing_skills,
                "weak_sections": weak_sections,
            },
            fallback,
        )

        return {
            "sections": sections,
            "extracted_skills": extracted_skills,
            "missing_skills": missing_skills,
            "missing_keywords": missing_keywords,
            "weak_sections": weak_sections,
            "scores": {
                "ats": ats_score,
                "semantic": semantic_score,
                "keyword": keyword_score,
                "formatting": formatting_score,
                "grammar": grammar_score,
            },
            "suggestions": llm_insights.get("suggestions", fallback["suggestions"])[:8],
            "summary": llm_insights.get("summary", fallback["summary"]),
        }

    @staticmethod
    def _role_skills(target_role: str) -> list[str]:
        lower = target_role.lower()
        skills: set[str] = set()
        for keyword, hints in ROLE_SKILL_HINTS.items():
            if keyword in lower:
                skills.update(hints)
        if not skills and target_role:
            skills.update(["communication", "problem solving", "sql", "system design"])
        return sorted(skills)

    @staticmethod
    def _coverage(
    found: list[str],
    expected: list[str]
) -> float:

        if not expected:
          return 70.0


        aliases = {
        "ml": "machine learning",
        "ai": "artificial intelligence",
        "sklearn": "scikit-learn",
        "react.js": "react",
        "next.js": "next",
        "rest apis": "rest api",
        "postgres": "postgresql",
    }


        def normalize(skill):

            skill = skill.lower().strip()

            return aliases.get(
            skill,
            skill
        )


        found_set = {
          normalize(skill)
          for skill in found
    }


        expected_set = {
          normalize(skill)
          for skill in expected
    }


        matches = (
          found_set
          &
          expected_set
    )


        return round(
        (
            len(matches)
            /
            len(expected_set)
        )
        * 100,
        2
    )

    @staticmethod
    def _missing_keywords(text: str, job_description: str, extracted_skills: list[str]) -> list[str]:
        if not job_description:
            return []
        resume_lower = text.lower()
        jd_tokens = set(re.findall(r"[a-zA-Z][a-zA-Z0-9+#.-]{2,}", job_description.lower()))
        known = set(ALL_SKILLS) | set(extracted_skills)
        relevant = sorted(token for token in jd_tokens if token in known or len(token) > 8)
        return [token for token in relevant if token not in resume_lower][:16]

    @staticmethod
    def _weak_sections(sections: dict[str, str]) -> list[str]:
        weak: list[str] = []
        required = ["summary", "experience", "skills", "education"]
        for section in required:
            if section not in sections:
                weak.append(section)
            elif len(sections[section].split()) < 20 and section != "skills":
                weak.append(section)
        return weak

    @staticmethod
    def _formatting_score(text: str, sections: dict[str, str]) -> float:
        score = 100.0
        if len(text.split()) < 250:
            score -= 18
        if len(text.split()) > 1100:
            score -= 12
        if not re.search(r"[\w.-]+@[\w.-]+", text):
            score -= 8
        if not re.search(r"(\+?\d[\d\s().-]{8,})", text):
            score -= 6
        if len(sections) < 4:
            score -= 14
        if text.count("•") + text.count("- ") < 4:
            score -= 8
        return round(max(35.0, min(100.0, score)), 2)

    @staticmethod
    def _grammar_score(text: str) -> float:
        score = 94.0
        cliches = ["hardworking", "go-getter", "team player", "responsible for"]
        score -= sum(4 for phrase in cliches if phrase in text.lower())
        long_sentences = [sentence for sentence in re.split(r"[.!?]", text) if len(sentence.split()) > 35]
        score -= min(18, len(long_sentences) * 3)
        repeated_spaces = len(re.findall(r" {2,}", text))
        score -= min(10, repeated_spaces)
        return round(max(45.0, score), 2)

    @staticmethod
    def _suggestions(
        missing_skills: list[str],
        weak_sections: list[str],
        formatting_score: float,
        grammar_score: float,
    ) -> list[dict]:
        suggestions: list[dict] = []
        if missing_skills:
            suggestions.append(
                {
                    "title": "Close role-critical skill gaps",
                    "impact": "Improves ATS matching and recruiter confidence.",
                    "priority": "high",
                    "action": f"Add evidence for {', '.join(missing_skills[:5])} through projects, metrics, or coursework.",
                }
            )
        for section in weak_sections[:3]:
            suggestions.append(
                {
                    "title": f"Strengthen {section.title()} section",
                    "impact": "Makes the resume easier to parse and evaluate.",
                    "priority": "high" if section in {"experience", "skills"} else "medium",
                    "action": "Use concise bullets with action verbs, scope, technical choices, and measurable outcomes.",
                }
            )
        if formatting_score < 80:
            suggestions.append(
                {
                    "title": "Improve ATS-readable formatting",
                    "impact": "Reduces parsing failures in applicant tracking systems.",
                    "priority": "medium",
                    "action": "Use simple headings, consistent bullets, standard contact info, and avoid tables or image-only layouts.",
                }
            )
        if grammar_score < 85:
            suggestions.append(
                {
                    "title": "Tighten language quality",
                    "impact": "Improves perceived communication quality.",
                    "priority": "medium",
                    "action": "Replace vague phrases with specific verbs, numbers, and project outcomes.",
                }
            )
        return suggestions or [
            {
                "title": "Add more quantified wins",
                "impact": "Raises credibility even when the structure is already strong.",
                "priority": "medium",
                "action": "Add metrics like latency reduced, users supported, accuracy improved, or time saved.",
            }
        ]

    @staticmethod
    def _summary(score: float, target_role: str | None, missing_skills: list[str]) -> str:
        role = target_role or "your target role"
        if score >= 85:
            return f"Strong resume alignment for {role}. Focus next on tailoring keywords and sharper impact metrics."
        if score >= 70:
            return f"Good foundation for {role}, with clear upside from closing {len(missing_skills)} visible gaps."
        return f"The resume needs targeted optimization for {role}, especially skills coverage, structure, and evidence quality."
