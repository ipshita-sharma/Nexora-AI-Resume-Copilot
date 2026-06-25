# Environment Setup

## Required

```bash
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/copilot
BACKEND_CORS_ORIGINS=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## AI Providers

Mock mode works without network credentials:

```bash
AI_PROVIDER=mock
ENABLE_SENTENCE_TRANSFORMERS=false
```

OpenAI:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4.1-mini
```

Gemini:

```bash
AI_PROVIDER=gemini
GOOGLE_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
```

Enable local Hugging Face sentence-transformer embeddings when the model is available or your runtime can download it:

```bash
ENABLE_SENTENCE_TRANSFORMERS=true
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

## Storage

Local:

```bash
STORAGE_PROVIDER=local
LOCAL_UPLOAD_DIR=uploads
```

Cloudinary:

```bash
STORAGE_PROVIDER=cloudinary
CLOUDINARY_URL=cloudinary://...
```

S3:

```bash
STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET=...
```

## Auth

For local demos:

```bash
ALLOW_ANONYMOUS_DEMO=true
```

For production:

```bash
ALLOW_ANONYMOUS_DEMO=false
CLERK_JWT_ISSUER=https://your-clerk-issuer
CLERK_JWKS_URL=https://your-clerk-jwks-url
```
