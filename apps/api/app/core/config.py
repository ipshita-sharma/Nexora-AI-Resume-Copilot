from functools import lru_cache
from typing import Literal

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Nexora AI"
    app_env: Literal["development", "test", "staging", "production"] = "development"
    api_v1_prefix: str = "/api/v1"
    log_level: str = "INFO"

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/copilot"
    sync_database_url: str = "postgresql://postgres:postgres@localhost:5432/copilot"

    backend_cors_origins: str = "http://localhost:3000"
    rate_limit_per_minute: int = Field(default=60, ge=10, le=1000)

    clerk_jwt_issuer: str | None = None
    clerk_jwks_url: str | None = None
    allow_anonymous_demo: bool = True

    ai_provider: Literal["mock", "openai", "gemini", "groq"] = "groq"
    openai_api_key: str | None = None
    openai_model: str = "gpt-4.1-mini"
    google_api_key: str | None = None
    gemini_model: str = "gemini-2.0-flash"
    groq_api_key: str | None = None
    groq_model: str = "llama-3.3-70b-versatile"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    enable_sentence_transformers: bool = False

    storage_provider: Literal["local", "cloudinary", "s3"] = "local"
    local_upload_dir: str = "uploads"
    cloudinary_url: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
    aws_region: str = "us-east-1"
    s3_bucket: str | None = None

    @computed_field
    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
