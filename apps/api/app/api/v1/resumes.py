from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from sqlalchemy import desc, select
from app.services.ai.resume_engine import ResumeEngine
from app.api.deps import CurrentUser, DbSession
from app.models.resume import Resume
from app.schemas.resume import ResumeAnalyzeResponse, ResumeHistoryItem
from app.services.ai.resume_analyzer import ResumeAnalyzer
from app.services.ai.resume_parser import parse_resume_file
from app.services.security.users import ensure_user
from app.services.storage.provider import StorageProvider
import shutil
import os
import uuid
import json
from app.services.docx_exporter import export_resume_docx
from fastapi.responses import FileResponse
from app.services.resume_parser import extract_resume_text
router = APIRouter()

@router.post("/extract")
async def extract_resume(file: UploadFile = File(...)):

    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_resume_text(file_path)

    return {
        "text": text
    }

@router.post("/generate")
async def generate_resume(
    payload: dict
):

    result = await ResumeEngine().generate_resume(
        resume_text=payload.get("resume_text", ""),
        target_role=payload.get("target_role", ""),
        industry=payload.get("industry", ""),
        experience_level=payload.get("experience_level", ""),
        company_types=payload.get("company_types", []),
        priorities=payload.get("priorities", []),
        job_description=payload.get("job_description", "")
    )

    return result

@router.post("/export")
async def export_resume(
    payload: dict
):

    print("🔥 EXPORT API HIT 🔥")

    print(
        payload.get("resume", "")[:200]
    )

    content = payload.get(
        "resume",
        ""
    )


    # FIX: if AI JSON comes here,
# extract only improved resume

    try:
        parsed = json.loads(content)

        if isinstance(parsed, dict):
          content = parsed.get(
            "improved_resume",
            content
        )

    except Exception:
      pass


    os.makedirs(
        "exports",
        exist_ok=True
    )


    file_path = f"exports/{uuid.uuid4()}_resume.docx"


    export_resume_docx(
        content,
        file_path
    )


    return FileResponse(
    file_path,
    filename="AI_Optimized_Resume.docx",
    media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
)

@router.post("/analyze", response_model=ResumeAnalyzeResponse)
async def analyze_resume(
    current_user: CurrentUser,
    db: DbSession,
    file: UploadFile | None = File(default=None),
    resume_text: str | None = Form(default=None),
    target_role: str | None = Form(default=None),
    job_description: str | None = Form(default=None),
):
    user = await ensure_user(db, current_user)
    text, filename, content = await parse_resume_file(file, resume_text)
    if not text:
        raise HTTPException(status_code=400, detail="Upload a readable PDF or provide resume_text.")

    storage_url = None
    if content and filename:
        storage_url = await StorageProvider().save_bytes(content, filename)

    analysis = await ResumeAnalyzer().analyze(text, target_role=target_role, job_description=job_description)
    resume = Resume(
        user_id=user.id,
        filename=filename,
        storage_url=storage_url,
        target_role=target_role or user.target_role,
        raw_text=text,
        parsed_sections=analysis["sections"],
        extracted_skills=analysis["extracted_skills"],
        missing_skills=analysis["missing_skills"],
        missing_keywords=analysis["missing_keywords"],
        weak_sections=analysis["weak_sections"],
        suggestions=analysis["suggestions"],
        ats_score=analysis["scores"]["ats"],
        semantic_score=analysis["scores"]["semantic"],
        keyword_score=analysis["scores"]["keyword"],
        formatting_score=analysis["scores"]["formatting"],
        grammar_score=analysis["scores"]["grammar"],
    )
    db.add(resume)
    await db.commit()
    await db.refresh(resume)

    return {
    "resume_id": resume.id,
    "filename": filename,
    "target_role": resume.target_role,
    "resume_text": text,
    **analysis,
}


@router.get("/history", response_model=list[ResumeHistoryItem])
async def history(current_user: CurrentUser, db: DbSession):
    await ensure_user(db, current_user)
    result = await db.execute(
        select(Resume).where(Resume.user_id == current_user.id).order_by(desc(Resume.created_at)).limit(30)
    )
    return result.scalars().all()


@router.get("/{resume_id}", response_model=ResumeAnalyzeResponse)
async def get_resume(resume_id: str, current_user: CurrentUser, db: DbSession):
    resume = await db.get(Resume, resume_id)
    if not resume or resume.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {
        "resume_id": resume.id,
        "filename": resume.filename,
        "target_role": resume.target_role,
        "sections": resume.parsed_sections,
        "extracted_skills": resume.extracted_skills,
        "missing_skills": resume.missing_skills,
        "missing_keywords": resume.missing_keywords,
        "weak_sections": resume.weak_sections,
        "scores": {
            "ats": resume.ats_score,
            "semantic": resume.semantic_score,
            "keyword": resume.keyword_score,
            "formatting": resume.formatting_score,
            "grammar": resume.grammar_score,
        },
        "suggestions": resume.suggestions,
        "summary": "Stored resume analysis.",
    }
