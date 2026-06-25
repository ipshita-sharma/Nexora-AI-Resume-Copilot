from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.assistant import router as assistant_router
from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.db.init_db import create_tables
from app.db.session import engine
from app.middleware.rate_limit import InMemoryRateLimitMiddleware

settings = get_settings()
configure_logging(settings.log_level)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.app_env in {"development", "test"}:
        await create_tables(engine)
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="AI-native resume analysis, job matching, interviews, and learning recommendations.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(InMemoryRateLimitMiddleware, requests_per_minute=settings.rate_limit_per_minute)


@app.get("/health")
async def health():
    return {"status": "ok", "service": settings.app_name, "env": settings.app_env}


app.include_router(api_router, prefix=settings.api_v1_prefix)
app.include_router(assistant_router)