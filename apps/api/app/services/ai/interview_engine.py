import re
from uuid import uuid4

from app.services.ai.llm import LLMGateway


class InterviewEngine:
    def __init__(self) -> None:
        self.llm = LLMGateway()

    async def start(
        self,
        role: str,
        difficulty: str,
        interview_type: str,
        company_type: str,
        resume_context: str | None = None,
        focus_skills: list[str] | None = None,
    ) -> dict:
        questions = self._questions(role, difficulty, interview_type, company_type, focus_skills or [])
        fallback = {"questions": questions}

        print("Interview Start Called")
        print("Role:", role)
        print("Difficulty:", difficulty)

        print("RESUME_CONTEXT =", (resume_context or "")[:1000])
        print("FOCUS_SKILLS =", focus_skills)

        llm = await self.llm.structured_insights(
            "mock_interview_questions",
            {
    "instruction": """
Generate exactly 5 interview questions.

Question Distribution:

- 3 role-specific technical questions
- 1 project deep-dive question
- 1 behavioral or problem-solving question

The project deep-dive may reference resume_context.

The remaining questions must primarily evaluate competencies
expected for the selected role.

Return JSON only.

{
  "questions":[
    {
      "id":"1",
      "type":"technical",
      "question":"...",
      "rubric":["...","..."]
    }
  ]
}

Rules:

Decision Hierarchy:

1. role
2. focus_skills
3. company_type
4. difficulty
5. resume_context

The selected role always has the highest priority.

Resume_context is for personalization only.

Resume projects should NOT determine the interview domain.

Example:

Role = Software Developer Intern
Resume = AI/ML projects

Generate Software Developer questions
(OOP, DSA, DBMS, APIs, Backend, Frontend, System Design)

Use AI/ML projects only for project deep-dives.

Example:

Role = Data Analyst
Resume = Full Stack projects

Generate Data Analyst questions
(SQL, Analytics, Statistics, Visualization)

Use Full Stack projects only as examples.

Example:

Role = Backend Developer
Resume = AI projects

Generate Backend questions
(APIs, Databases, Scalability, Architecture)

Use AI projects only for project discussions.

CRITICAL ROLE ALIGNMENT RULES

1. The selected role determines the interview domain.

2. Generate at least 80% of technical questions from the skills,
responsibilities, tools, technologies, and concepts commonly expected
for the selected role.

3. Resume_context must NOT override the selected role.

4. Technologies, projects, internships, certifications, and skills found
in the resume should not automatically become interview topics.

5. Use resume_context only to:
   - personalize questions
   - create project deep-dives
   - generate behavioral questions
   - discuss implementation decisions
   - discuss achievements and challenges

6. If a resume contains experience from multiple domains,
interview questions should remain aligned to the selected role.

7. Cross-domain questions may be generated only if:
   - they are directly relevant to the selected role
   - they appear in focus_skills
   - the user explicitly requests a mixed interview

8. Questions must evaluate:
   - role-specific technical knowledge
   - practical problem solving
   - project execution
   - communication
   - decision making

9. Avoid overfocusing on any single project, technology, internship,
or domain mentioned in the resume.

10. The interview should remain role-centric rather than resume-centric.

Question Generation Strategy

1. The selected role is the primary source for interview question generation.

2. Generate questions that assess the skills, technologies, concepts, responsibilities, and problem-solving abilities expected for the selected role.

3. Use resume_context to personalize the interview by:

   * discussing projects
   * discussing achievements
   * discussing technologies actually used by the candidate
   * creating project-specific deep dives
   * generating behavioral questions based on experience

4. Resume_context should enhance the interview, not redefine the interview domain.

5. If the resume contains experience from multiple domains:

   * prioritize the selected role
   * use other experiences only when they provide relevant examples or transferable skills

6. Questions should naturally balance:

   * role-specific technical knowledge
   * project experience
   * problem solving
   * communication
   * practical decision making

7. Avoid generating questions that are unrelated to the selected role unless the user explicitly requests a mixed or cross-domain interview.

8. The final interview should feel personalized to the candidate while remaining aligned with the selected role and company context.

9. Role, difficulty, company type, focus_skills, and resume_context should all influence question generation, with the selected role having the highest priority.

""",

    "role": role,
    "difficulty": difficulty,
    "interview_type": interview_type,
    "company_type": company_type,
    "resume_context": (resume_context or "")[:3000],
    "focus_skills": focus_skills or [],
},
            fallback,
        )

        print("LLM RESPONSE =", llm)
        questions = llm.get("questions", questions)
        return {
            "role": role,
            "difficulty": difficulty,
            "interview_type": interview_type,
            "company_type": company_type,
            "questions": questions,
            "current_question": questions[0],
        }

    async def evaluate_answer(
        self,
        question: str,
        answer: str,
        role: str,
        difficulty: str,
        transcript: list[dict] | None = None,
    ) -> dict:
        base = self._score_answer(question, answer, role, difficulty)
        fallback = {
            **base,
            "follow_up_question": self._follow_up(question, answer),
        }
        return await self.llm.structured_insights(
    "interview_answer_feedback",
    {
        "instruction": """
Evaluate the interview answer.

Return JSON only.

{
  "score": 0,
  "communication_score": 0,
  "technical_score": 0,
  "confidence_score": 0,
  "strengths": [],
  "improvements": [],
  "follow_up_question": ""
}

Scoring Rules:
- score: overall score out of 100
- communication_score: clarity and structure
- technical_score: technical correctness and depth
- confidence_score: ownership and decisiveness

Provide realistic scores.

Do not return nested objects.
Do not return explanations outside JSON.
""",
        "question": question,
        "answer": answer,
        "role": role,
        "difficulty": difficulty,
        "transcript": transcript or [],
    },
    fallback,
)

    async def final_feedback(self, transcript: list[dict], role: str) -> dict:
        scores = [turn.get("score", 0) for turn in transcript if isinstance(turn.get("score"), (int, float))]
        average = round(sum(scores) / max(1, len(scores)), 2)
        weak = self._weak_areas(transcript)
        fallback = {
            "overall_score": average or 74,
            "communication_score": min(95, average + 4) if average else 76,
            "technical_score": max(45, average - 2) if average else 72,
            "confidence_score": min(92, average + 1) if average else 73,
            "weak_areas": weak,
            "strengths": ["Structured thinking", "Willingness to reason through tradeoffs"],
            "improvement_plan": [
                f"Prepare two project deep-dives for {role}.",
                "Practice concise STAR answers with metrics.",
                "Review fundamentals for the weakest technical areas.",
            ],
            "summary": "You show a workable baseline. The biggest gains will come from sharper evidence, clearer tradeoffs, and more precise technical vocabulary.",
        }
        return await self.llm.structured_insights(
            "interview_final_feedback",
            {"role": role, "transcript": transcript},
            fallback,
        )

    @staticmethod
    def _questions(
        role: str,
        difficulty: str,
        interview_type: str,
        company_type: str,
        focus_skills: list[str],
    ) -> list[dict]:
        skills = focus_skills[:3] or ["system design", "problem solving", "communication"]
        return [
            {
                "id": str(uuid4()),
                "type": "technical",
                "question": f"Walk me through a project that proves you are ready for a {role} role. What technical tradeoffs did you make?",
                "rubric": ["Problem clarity", "Technical depth", "Tradeoff awareness", "Measurable result"],
            },
            {
                "id": str(uuid4()),
                "type": "technical",
                "question": f"How would you debug a production issue in a {company_type} environment where latency suddenly doubled?",
                "rubric": ["Hypothesis-driven debugging", "Observability", "Prioritization", "Communication"],
            },
            {
                "id": str(uuid4()),
                "type": "skill",
                "question": f"Explain your experience with {skills[0]} and describe one mistake you learned from.",
                "rubric": ["Specificity", "Reflection", "Depth", "Ownership"],
            },
            {
                "id": str(uuid4()),
                "type": "behavioral",
                "question": f"Tell me about a time you handled ambiguity while working toward a {difficulty} technical goal.",
                "rubric": ["STAR structure", "Communication", "Decision making", "Outcome"],
            },
            {
                "id": str(uuid4()),
                "type": interview_type,
                "question": "What would you learn in the first 30 days if you joined this team?",
                "rubric": ["Role awareness", "Curiosity", "Execution plan", "Business context"],
            },
        ]

    @staticmethod
    def _score_answer(question: str, answer: str, role: str, difficulty: str) -> dict:
        words = re.findall(r"\w+", answer.lower())
        unique_words = len(set(words))
        length_score = min(30, len(words) / 5)
        specificity = min(25, sum(1 for token in words if token in {"because", "measured", "reduced", "built", "designed", "users", "latency", "tradeoff"}) * 4)
        structure = 20 if any(marker in answer.lower() for marker in ["situation", "task", "action", "result", "first", "then"]) else 10
        technical = min(25, unique_words / 4)
        score = round(min(96, length_score + specificity + structure + technical), 2)
        if difficulty in {"hard", "senior"}:
            score = max(45, score - 6)
        return {
            "score": score,
            "communication_score": round(min(95, structure + length_score + 35), 2),
            "technical_score": round(min(95, technical + specificity + 35), 2),
            "confidence_score": round(min(95, length_score + specificity + 38), 2),
            "strengths": [
                "Addresses the question directly",
                f"Connects the answer to {role} expectations",
            ],
            "improvements": [
                "Add more measurable outcomes",
                "Name explicit tradeoffs and alternatives considered",
            ],
        }

    @staticmethod
    def _follow_up(question: str, answer: str) -> str:
        if len(answer.split()) < 70:
            return "Can you give a more concrete example with the exact technical decision and measurable outcome?"
        return "What alternative approach did you reject, and how would you defend that choice in production?"

    @staticmethod
    def _weak_areas(transcript: list[dict]) -> list[str]:
        text = " ".join(str(turn) for turn in transcript).lower()
        weak = []
        if "metric" not in text and "reduced" not in text:
            weak.append("quantified impact")
        if "tradeoff" not in text:
            weak.append("technical tradeoff explanation")
        if "tested" not in text and "debug" not in text:
            weak.append("debugging and validation detail")
        return weak or ["technical depth", "concise communication"]
