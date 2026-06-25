from groq import Groq
from dotenv import load_dotenv
import os
import re
import json

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


class ResumeEngine:

    def preserve_keywords(
    self,
    original: str,
    improved: str
):

        important = re.findall(
        r"\b[A-Za-z][A-Za-z0-9+#./-]{2,}\b",
        original
    )

        ignore = {
        "the",
        "and",
        "for",
        "with",
        "from",
        "this",
        "that"
    }


        missing = []

        improved_lower = improved.lower()


        for word in important:

          if (
            word.lower() not in improved_lower
            and word.lower() not in ignore
        ):
            missing.append(word)

        return improved

    async def generate_resume(
        self,
        resume_text: str,
        target_role: str,
        industry: str,
        experience_level: str,
        company_types: list[str],
        priorities: list[str],
        job_description: str | None = None
    ):

        prompt = f"""
You are an elite AI Resume Optimizer.

Your task is to optimize the resume for ATS systems and recruiters.

IMPORTANT:
Preserve all existing technical skills, tools, frameworks,
certifications, projects, achievements, and keywords.

Do NOT remove relevant keywords.

Enhance wording without reducing ATS keyword density.

TARGET ROLE:
{target_role}

INDUSTRY:
{industry}

EXPERIENCE LEVEL:
{experience_level}

TARGET COMPANY TYPES:
{", ".join(company_types)}

OPTIMIZATION PRIORITIES:
{", ".join(priorities)}

JOB DESCRIPTION:
{job_description}

ORIGINAL RESUME:
{resume_text}

TASKS:

1. Preserve all important existing content
2. Improve weak bullet points using action verbs
3. Keep technical keywords from original resume
4. Add missing role-specific keywords naturally
5. Improve ATS compatibility
6. Maintain standard resume formatting
7. Add measurable impact ONLY when realistic
8. Remove only duplicate or irrelevant content
9. Optimize for target role
10. Return structured JSON

ATS OPTIMIZATION RULES:

CRITICAL ATS PRESERVATION RULE:

The optimized resume MUST achieve equal or higher ATS compatibility
than the original resume.

Never remove:
- programming languages
- frameworks
- libraries
- databases
- cloud tools
- AI/ML techniques
- certifications
- project names
- measurable achievements

Before returning:
Compare original resume vs improved_resume.

If a keyword exists in original resume and is relevant to the target role,
it MUST also exist in improved_resume.

Enhance content, do not replace technical detail with generic descriptions.

- Never decrease number of technical keywords.
- Never remove programming languages.
- Never remove frameworks.
- Never remove cloud/tools.
- Never remove certifications.
- Never remove project tech stacks.
- Preserve domain keywords like AI, ML, NLP, REST API, Database etc.

CRITICAL ATS BOOST RULES:

For AI/ML roles, actively maximize presence of:

Machine Learning
Deep Learning
Computer Vision
NLP
Generative AI
LLM
Scikit-learn
TensorFlow
PyTorch
FastAPI
REST APIs
Model Training
Model Evaluation
Feature Engineering
Data Preprocessing
Classification
Regression
Clustering
Neural Networks

If these skills are relevant to existing projects or experience,
integrate them naturally into bullet points.

Do not replace technical terms with generic soft-skill language.

Return ONLY raw valid JSON.

Do NOT use:
- markdown

Markdown symbols are forbidden.

Never use:

**
__
##
*

- ```json
- explanations
- comments

Return parsable JSON only.

IMPORTANT:
The value of improved_resume MUST be plain resume text only.

DO NOT put:
- JSON
- dictionaries
- arrays
- escaped JSON strings

inside improved_resume.

Correct:
"improved_resume": "SUMMARY\n....\nPROJECTS\n..."

Wrong:
"improved_resume": "{{ \"summary\": \"...\" }}"

STRICT RESUME FORMATTING RULES:

0. ALWAYS preserve candidate header from original resume.

Preserve the original contact information and header structure.

Do not invent missing fields.

Do not remove existing fields.

After the final contact information line, insert:

SUMMARY

on a new line.

Then continue:

SUMMARY

Never start improved_resume with SUMMARY.
Never remove name, email, phone, LinkedIn, GitHub.
Never merge header with summary.

Preserve the original header exactly as it appears.

Do not rewrite, reorder, merge, remove, or invent contact fields.

After the LAST contact information line,
insert exactly:

SUMMARY

on a new line.

The header must end before SUMMARY begins.

(blank line)

SUMMARY

ABSOLUTE RULES:

- SUMMARY must be on its own line.
- SUMMARY must never appear on the same line as GitHub.
- Every main section must start on a new line.

BAD:
Phone | Location | LinkedIn | GitHub | SUMMARY

GOOD:
Phone | Location | LinkedIn | GitHub

SUMMARY

1. Main sections MUST be uppercase:
SUMMARY
EDUCATION
EXPERIENCE
PROJECTS
TECHNICAL SKILLS
CERTIFICATIONS

SECTION SEPARATION RULE

Every section heading must be surrounded by blank lines.

Correct:

SUMMARY

Summary content

EDUCATION

Education content

Wrong:

GitHub | SUMMARY

SUMMARY | Education

Education | Experience

A section heading must never appear on the same line as any other text.

2. TECHNICAL SKILLS FORMAT IS STRICT.

You MUST convert ALL skills into exactly this format:

TECHNICAL SKILLS

Programming Languages: Python, Java, C/C++, JavaScript
AI/ML: Scikit-learn, Pandas, Regression, Classification, Clustering
Frameworks & Libraries: React.js, Spring Boot, Firebase
Databases: MySQL, Firebase Firestore, H2
Tools & Platforms: Git, GitHub, VS Code, XAMPP, SAP S/4HANA

ABSOLUTE RULES:
- NEVER use bullets inside TECHNICAL SKILLS.
- NEVER put a skill alone on a line.
- NEVER create skill categories except the five above.
- C/C++, SQL, H2, XAMPP are skills, NOT headings.
- Every skill must appear after ":" on the same line.
Tools: Git, GitHub, VS Code

3. NEVER create standalone skill headings like:
C/C++
SQL
H2
XAMPP

4. NEVER split skills into bullets.

5. Keep skills in comma-separated single-line format.

6. Experience and project achievements MUST ALWAYS use bullet points.

Every achievement line MUST start with:
•

Example:

EXPERIENCE

Company - Role

• Developed scalable APIs improving response time by 30%.
• Built AI models improving accuracy by 20%.

Never write experience or project achievements as plain paragraphs.

FINAL VALIDATION

Before returning improved_resume:

Verify that:

SUMMARY is on its own line.
EDUCATION is on its own line.
EXPERIENCE is on its own line.
PROJECTS is on its own line.
TECHNICAL SKILLS is on its own line.
CERTIFICATIONS is on its own line.

If any heading appears on the same line as other text,
rewrite the resume before returning.

FORMAT:

{{
  "summary": "...",

  "improved_resume": "...",

  "changes": [
    "...",
    "..."
  ],

  "ats_improvements": [
    "...",
    "..."
  ],

  "missing_keywords_added": [
    "...",
    "..."
  ]
}}
CRITICAL OUTPUT STRUCTURE

The improved_resume must be returned as a clean plain-text resume.

Every section heading must be on its own line.

Use exactly this structure:

Candidate Full Name

Target Role

Email

Phone | Location | LinkedIn | GitHub

SUMMARY

Summary paragraph

EDUCATION

Education details

EXPERIENCE

Experience entries

PROJECTS

Project entries

TECHNICAL SKILLS

Skills

CERTIFICATIONS

Certifications

Do not place section headings on the same line as other content.

Do not compress multiple sections into one paragraph.

Preserve natural line breaks between sections.

The output should look like a real ATS-friendly resume, not JSON, markdown, or a continuous text block.
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        content = response.choices[0].message.content

        content = content.strip()

        if content.startswith("```json"):
            content = content.replace("```json", "")

        if content.endswith("```"):
            content = content[:-3]

        content = content.strip()
        content = content.replace("\r", "")
        
        print("========= RAW GROQ RESPONSE =========")
        print(content)
        print("=====================================")

        try:
            data = json.loads(content, strict=False)

            optimized_resume = data.get(
    "improved_resume",
    ""
)

            print("========== RAW IMPROVED RESUME ==========")
            print(optimized_resume)
            print("=========================================")
# Fix broken section formatting
            optimized_resume = optimized_resume.replace("| SUMMARY", "\n\nSUMMARY")
            optimized_resume = optimized_resume.replace("| EDUCATION", "\n\nEDUCATION")
            optimized_resume = optimized_resume.replace("| EXPERIENCE", "\n\nEXPERIENCE")
            optimized_resume = optimized_resume.replace("| PROJECTS", "\n\nPROJECTS")
            optimized_resume = optimized_resume.replace("| TECHNICAL SKILLS", "\n\nTECHNICAL SKILLS")
            optimized_resume = optimized_resume.replace("| CERTIFICATIONS", "\n\nCERTIFICATIONS")

# Remove markdown artifacts if model generates them
            optimized_resume = optimized_resume.replace("**", "")
            optimized_resume = optimized_resume.replace("__", "")
            optimized_resume = optimized_resume.replace("##", "")

            optimized_resume = self.preserve_keywords(
    resume_text,
    optimized_resume
)


            return {
        "summary": data.get(
            "summary",
            ""
        ),

        "improved_resume": optimized_resume,

        "changes": data.get(
            "changes",
            []
        ),

        "ats_improvements": data.get(
            "ats_improvements",
            []
        ),

        "missing_keywords_added": data.get(
            "missing_keywords_added",
            []
        )
    }

        except Exception as e:

           print("JSON ERROR:", e)

        start = content.find("{")
        end = content.rfind("}") + 1

        try:

           fixed_json = content[start:end]

           return json.loads(
            fixed_json,
            strict=False
        )

        except Exception as final_error:

            print(
            "FINAL JSON FIX FAILED:",
            final_error
        )

            return {
            "summary": "Resume optimization completed.",

            "improved_resume": "",

            "changes": [],

            "ats_improvements": [],

            "missing_keywords_added": []
        }