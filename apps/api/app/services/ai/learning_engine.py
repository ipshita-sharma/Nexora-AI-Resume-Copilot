from app.services.ai.llm import LLMGateway

class LearningEngine:
    def __init__(self) -> None:
        self.llm = LLMGateway()

    async def roadmap(
    self,
    target_role: str,
    timeline: str,
    resume_context: str | None,

    resume_skills: list[str],
    missing_skills: list[str],
    jd_missing_skills: list[str],

    interview_weak_areas: list[str],
    resume_weak_sections: list[str],

    job_match_score: float | None,
) -> dict:

      fallback = {
        "target_role": target_role,
        "recommendations": [
            {
                "topic": skill.title(),
                "priority": 1,
                "reason": f"{skill} is important for {target_role}",
                "actions": [
                    {
                        "label": f"Learn {skill}",
                        "type": "learn",
                        "effort": "2h",
                    }
                ],
            }
            for skill in missing_skills[:5]
        ],
        "weekly_plan": [],
      }

      print("ROADMAP INPUT:")
      print("ROLE =", target_role)
      print("TIMELINE =", timeline)
      print("RESUME_CONTEXT =", (resume_context or "")[:500])
      print("MISSING =", missing_skills)
      print("JD_MISSING_SKILLS =", jd_missing_skills)
      print("RESUME_SKILLS =", resume_skills)
      print("INTERVIEW =", interview_weak_areas)
      print("RESUME =", resume_weak_sections)
      print("JOB_MATCH_SCORE =", job_match_score)

      resume_summary = {
    "skills": resume_skills
}
      
      timeline_to_weeks = {
    "2 Weeks": 2,
    "1 Month": 4,
    "2 Months": 8,
    "3 Months": 12,
    "6 Months": 24,
}

      if (
    not target_role
    and not resume_context
    and not resume_skills
    and not missing_skills
    and not jd_missing_skills
    and not interview_weak_areas
    and not resume_weak_sections
):
       return {
        "target_role": "",
        "recommendations": [],
        "weekly_plan": [],
    }
      if (
    not missing_skills
    and not jd_missing_skills
    and not interview_weak_areas
    and not resume_weak_sections
):
       return {
        "target_role": target_role,
        "recommendations": [],
        "weekly_plan": [],
    }

      return await self.llm.structured_insights(
        "learning_roadmap",
        {
            "instruction": """
Generate a personalized learning roadmap.

Return JSON only.

{
  "target_role":"",
  "recommendations":[
    {
      "topic":"",
      "priority":1,
      "reason":"",
      "actions":[
        {
          "label":"",
          "type":"",
          "effort":""
        }
      ]
    }
  ],
  "weekly_plan":[
    {
      "day":"",
      "focus":"",
      "task":"",
      "outcome":""
    }
  ]
}

CRITICAL:

Do not generate generic recommendations.

Bad recommendations:
- Learn algorithms
- Learn data structures
- Take a course
- Review concepts
- Practice LeetCode

Good recommendations:
- Improve an existing project
- Add a missing feature
- Deploy an application
- Add testing
- Add monitoring
- Quantify impact on resume
- Prepare STAR interview stories
- Create portfolio evidence

Weekly plans must be execution-focused.

Avoid:
- Study X
- Learn X
- Review X

Prefer:
- Implement X
- Deploy X
- Refactor X
- Measure X
- Add X feature
- Publish X

If target_role differs from the candidate's previous experience:

Generate recommendations that bridge the gap between
current experience and target_role.

Focus on demonstrating role-relevant evidence rather than learning theory.

Every recommendation must produce a tangible artifact.

Rules:

Priority 1:
JD missing skills

Priority 2:
Interview weak areas

Priority 3:
Resume weak sections

Do NOT recommend learning skills already present
in resume_skills.

If existing projects are present in resume_context:

ALWAYS attempt to use an existing project before proposing a new one.

For each missing skill:

1. Check whether an existing project can be enhanced to demonstrate the skill.
2. If yes, recommend a project enhancement.
3. If no, recommend a new focused project.

Prefer:
- feature additions
- scalability improvements
- deployment
- testing
- monitoring
- performance optimization
- database improvements
- architecture improvements

over creating new projects.

Timeline Rules:

Generate exactly weeks_required milestones.

Each milestone represents one week.

Always use:

Week 1
Week 2
Week 3
...

Never use:
- Monday
- Tuesday
- Wednesday
- Daily plans

Examples:

2 Weeks -> 2 weekly milestones
1 Month -> 4 weekly milestones
2 Months -> 8 weekly milestones
3 Months -> 12 weekly milestones
6 Months -> 24 weekly milestones

Candidate Maturity Rules

If resume_summary indicates:
- has_projects = true
- has_internship = true
- has_open_source = true

Do not generate beginner-level recommendations.

Assume the candidate already understands software development fundamentals.

Focus on:
- production readiness
- deployment
- architecture improvements
- scalability
- testing
- monitoring
- resume positioning
- interview readiness

instead of basic learning activities.

Each week must contain:

- Learning Goal
- Project Goal
- Resume Goal
- Interview Goal
- Deliverable

Use technologies, projects, and experience found in resume_context.

For AI/ML roles:
- Prefer project-based learning.
- Suggest deployment, MLOps, APIs, model serving,
  computer vision, NLP, LLM, or deep learning work
  when relevant.

For Backend roles:
- Prefer APIs, databases, system design,
  deployment, scalability.

For Frontend roles:
- Prefer UI, performance, accessibility,
  state management, deployment.

If the resume already contains a project:
- Suggest improving that project first.
- Do not suggest creating a completely new project
  unless necessary.

Avoid:
- Generic advice.
- Generic course recommendations.
- "Learn Git"
- "Take online course"
- Repeating the same action multiple times.

Focus on:
- Portfolio outcomes
- Deployments
- Resume improvements
- Interview readiness
- Measurable achievements

Analyze the candidate's resume_context.

If the candidate already has:
- internships
- projects
- open source contributions
- certifications
- relevant coursework
- work experience

Do NOT primarily recommend beginner learning activities.

Instead create a balanced roadmap across:

1. Skill Development
2. Project Improvements
3. Resume Improvements
4. Interview Preparation
5. Portfolio Improvements

A roadmap must not focus entirely on projects.

Recommended distribution:

- 30% Skill Development
- 25% Project Improvements
- 20% Resume Improvements
- 15% Interview Preparation
- 10% Portfolio Improvements

Generate recommendations across multiple categories.

Each recommendation must belong to one of:

- Skill Development
- Project Improvement
- Resume Improvement
- Interview Preparation
- Portfolio Improvement

Do not generate all recommendations from the same category.

Only recommend entirely new projects when existing projects cannot be adapted to demonstrate the missing skills.

For each missing skill:

First check whether the skill can be demonstrated by improving an existing project.

If yes:
- Recommend project enhancement.

If no:
- Recommend a focused project specifically designed to demonstrate that skill.

Always produce:
- Project Goal
- Resume Goal
- Interview Goal
- Deliverable

Avoid generic recommendations such as:
- Learn X
- Take a course
- Watch tutorials

Prefer outcome-driven recommendations.

Return valid JSON only.
""",
            "target_role": target_role,
            "timeline": timeline,
            "resume_context": (resume_context or "")[:5000],
            "resume_summary": resume_summary,
            "resume_skills": resume_skills,
            "jd_missing_skills": jd_missing_skills,
            "job_match_score": job_match_score,
            "missing_skills": missing_skills,
            "interview_weak_areas": interview_weak_areas,
            "resume_weak_sections": resume_weak_sections,
        },
        fallback,
    )

    @staticmethod
    def _weekly_plan(recommendations: list[dict]) -> list[dict]:
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        plan = []
        for index, rec in enumerate(recommendations):
            plan.append(
                {
                    "day": days[index % len(days)],
                    "focus": rec["topic"],
                    "task": rec["actions"][0]["label"],
                    "outcome": "Visible resume/interview evidence",
                }
            )
        return plan
