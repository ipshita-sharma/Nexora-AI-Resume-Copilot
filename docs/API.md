# API Documentation

Base URL: `http://localhost:8000`

Authentication: pass a Clerk bearer token in `Authorization: Bearer <token>`. In local demo mode, the backend accepts anonymous requests when `ALLOW_ANONYMOUS_DEMO=true`.

## Health

`GET /health`

Returns service status.

## Users

`GET /api/v1/users/me`

Returns the current user profile.

`PATCH /api/v1/users/me`

Body:

```json
{
  "full_name": "Candidate Name",
  "target_role": "Software Engineer Intern",
  "skills": ["React", "Python", "SQL"]
}
```

## Resumes

`POST /api/v1/resumes/analyze`

Content type: `multipart/form-data`

Fields:

- `file`: optional PDF or text file
- `resume_text`: optional fallback text
- `target_role`: optional role
- `job_description`: optional JD for targeted scoring

Returns ATS score, semantic score, keyword score, formatting score, grammar score, extracted skills, missing skills, weak sections, and suggestions.

`GET /api/v1/resumes/history`

Returns recent resume versions.

`GET /api/v1/resumes/{resume_id}`

Returns a stored resume analysis.

## Job Matches

`POST /api/v1/job-matches/analyze`

```json
{
  "title": "AI Product Engineering Intern",
  "resume_text": "...",
  "job_description": "...",
  "resume_id": "optional"
}
```

Returns match percentage, semantic and keyword scores, missing skills, suggested keywords, and optimization roadmap.

## Interviews

`POST /api/v1/interviews/start`

```json
{
  "role": "Software Engineer Intern",
  "difficulty": "medium",
  "interview_type": "mixed",
  "company_type": "startup",
  "focus_skills": ["React", "SQL"]
}
```

`POST /api/v1/interviews/answer`

```json
{
  "interview_id": "optional",
  "question": "...",
  "answer": "...",
  "role": "Software Engineer Intern",
  "difficulty": "medium",
  "transcript": []
}
```

`POST /api/v1/interviews/{interview_id}/feedback`

Generates final interview feedback.

## Learning

`POST /api/v1/learning/roadmap`

```json
{
  "target_role": "Software Engineer Intern",
  "missing_skills": ["DBMS joins", "system design"],
  "interview_weak_areas": ["quantified impact"],
  "resume_weak_sections": ["experience"]
}
```

## Analytics

`GET /api/v1/analytics/overview`

Returns dashboard trends, weak areas, roadmap recommendations, and summary cards.

## Reports

`POST /api/v1/reports/export`

Returns a PDF stream.
