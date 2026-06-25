# Deployment Guide

## Frontend on Vercel

Project root: `apps/web`

Build command:

```bash
npm run build
```

Required environment variables:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

## Backend on Render or Railway

Project root: `apps/api`

Build command:

```bash
pip install -e .
```

Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Required environment variables:

```bash
DATABASE_URL=postgresql+asyncpg://...
BACKEND_CORS_ORIGINS=https://your-domain.vercel.app
ALLOW_ANONYMOUS_DEMO=false
AI_PROVIDER=openai
OPENAI_API_KEY=...
```

For Gemini:

```bash
AI_PROVIDER=gemini
GOOGLE_API_KEY=...
```

## Database on Neon or Supabase

Use PostgreSQL. If available, enable:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

The FastAPI app creates tables automatically in development and test environments. For production, add Alembic migrations before first launch or run `Base.metadata.create_all` from a controlled release task.

## Docker

Local stack:

```bash
cp .env.example .env
docker compose up --build
```

Services:

- Web: `http://localhost:3000`
- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`
