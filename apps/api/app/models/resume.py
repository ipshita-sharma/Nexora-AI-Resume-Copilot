from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import uuid4

from sqlalchemy import DateTime, Float, ForeignKey, Index, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class Resume(Base):
    __tablename__ = "resumes"
    __table_args__ = (
        Index("ix_resumes_user_created", "user_id", "created_at"),
        Index("ix_resumes_ats_score", "ats_score"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    storage_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    target_role: Mapped[str | None] = mapped_column(String(180), nullable=True)
    raw_text: Mapped[str] = mapped_column(Text)
    parsed_sections: Mapped[dict] = mapped_column(JSON, default=dict)
    extracted_skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    missing_skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    missing_keywords: Mapped[list[str]] = mapped_column(JSON, default=list)
    suggestions: Mapped[list[dict]] = mapped_column(JSON, default=list)
    weak_sections: Mapped[list[str]] = mapped_column(JSON, default=list)
    ats_score: Mapped[float] = mapped_column(Float, default=0.0)
    semantic_score: Mapped[float] = mapped_column(Float, default=0.0)
    keyword_score: Mapped[float] = mapped_column(Float, default=0.0)
    formatting_score: Mapped[float] = mapped_column(Float, default=0.0)
    grammar_score: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="resumes")
