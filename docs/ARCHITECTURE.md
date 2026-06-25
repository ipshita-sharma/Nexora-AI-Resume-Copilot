# Architecture

## High-Level Design

The project is a two-app monorepo:

- `apps/web`: Next.js App Router dashboard using Clerk for auth, Tailwind CSS for styling, shadcn-style primitives for UI consistency, Framer Motion for subtle transitions, and Recharts for analytics.
- `apps/api`: FastAPI service using SQLAlchemy models, PostgreSQL persistence, structured AI services, rate limiting, storage adapters, and deployment-ready Docker support.

## AI Workflows

The AI layer is split by product workflow rather than exposed as a single chat endpoint.

### Resume Analyzer

1. Parse uploaded PDF or pasted text.
2. Extract semantic sections such as summary, experience, education, and skills.
3. Extract skills from a role-aware taxonomy.
4. Compute formatting and grammar heuristics.
5. Compute semantic similarity using sentence transformers when available, with a deterministic hashing vector fallback.
6. Merge scores into ATS score.
7. Generate structured recommendations through Gemini/OpenAI via LangChain when configured, otherwise deterministic coaching output.

### JD Matcher

1. Extract skills from resume and job description.
2. Compute keyword coverage.
3. Compute resume-to-JD semantic similarity.
4. Return weighted match score, missing skills, suggested keywords, and roadmap.

### Mock Interview

1. Generate role, difficulty, company-type, and skill-specific questions.
2. Score each answer on communication, technical depth, and confidence.
3. Generate follow-ups and store transcript.
4. Produce final feedback with weak areas and an improvement plan.

### Learning Engine

1. Merge missing skills, interview weak areas, and resume weak sections.
2. Deduplicate and prioritize topics.
3. Generate practice actions and a weekly schedule.

## Data Model

Core tables:

- `users`: profile, target role, avatar, skill list
- `resumes`: raw text, parsed sections, score breakdown, skill gaps, suggestions
- `job_matches`: JD text, match scores, missing skills, roadmap
- `interviews`: setup, questions, transcript, scores, feedback
- `learning_recommendations`: roadmap items and action lists
- `analytics_events`: extensible event tracking
- `reports`: generated report metadata

Indexes are included for user-history queries, trend pages, and score sorting.

## Security

- Clerk protects frontend dashboard routes.
- Backend routes accept bearer tokens and map claims to user records.
- Local demo mode can be disabled with `ALLOW_ANONYMOUS_DEMO=false`.
- CORS is environment-configured.
- API rate limiting is enabled through middleware.

## Extension Points

- Replace deterministic skill taxonomy with a larger ontology.
- Persist embedding vectors using pgvector, Pinecone, or Chroma.
- Add strict Clerk JWKS verification at the API layer.
- Add email notifications for reports.
- Add streaming responses for live interview feedback.
- Add speech-to-text for voice interview simulation.
