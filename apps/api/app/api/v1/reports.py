from io import BytesIO
from sqlalchemy import select, desc
from app.services.security.users import ensure_user
from app.models.resume import Resume
from app.models.job_match import JobMatch
from app.models.interview import Interview
from app.models.learning import LearningRecommendation
from fastapi import APIRouter
from starlette.responses import StreamingResponse

from app.api.deps import CurrentUser, DbSession

router = APIRouter()


@router.post("/export")
async def export_report(
    current_user: CurrentUser,
    db: DbSession
):
    user = await ensure_user(db, current_user)
    buffer = BytesIO()
    latest_resume = (
     await db.execute(
        select(Resume)
        .where(Resume.user_id == current_user.id)
        .order_by(desc(Resume.created_at))
        .limit(1)
     )
    ).scalar_one_or_none()

    latest_match = (
     await db.execute(
        select(JobMatch)
        .where(JobMatch.user_id == current_user.id)
        .order_by(desc(JobMatch.created_at))
        .limit(1)
     )
    ).scalar_one_or_none()

    latest_interview = (
     await db.execute(
        select(Interview)
        .where(Interview.user_id == current_user.id)
        .order_by(desc(Interview.created_at))
        .limit(1)
     )
    ).scalar_one_or_none()

    learning_items = (
     await db.execute(
        select(LearningRecommendation)
        .where(LearningRecommendation.user_id == current_user.id)
        .order_by(desc(LearningRecommendation.priority))
        .limit(5)
     )
    ).scalars().all()
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas

        pdf = canvas.Canvas(buffer, pagesize=letter)
        pdf.setTitle("Nexora AI Report")
        pdf.setFont("Helvetica-Bold", 18)
        prepared_for = (
          getattr(current_user, "email", None)
          or getattr(current_user, "first_name", None)
          or current_user.id
        )
        pdf.drawString(72, 730, "Nexora AI Report")
        pdf.setFont("Helvetica", 11)
        prepared_for = (
         user.full_name
         or user.email
         or current_user.id
       )

        pdf.drawString(
         72,
         700,
         f"Prepared for: Nexora AI User"
        )

        print("PREPARED_FOR =", prepared_for)
        y = 675
        print("FULL_NAME =", user.full_name)
        print("EMAIL =", user.email)
        # Resume Analysis
        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(72, y, "Resume Analysis")
        y -= 20

        pdf.setFont("Helvetica", 11)

        if latest_resume:
           pdf.drawString(72, y, f"ATS Score: {latest_resume.ats_score}")
           y -= 15

           pdf.drawString(
           72,
           y,
           f"Weak Sections: {', '.join(latest_resume.weak_sections[:3]) or 'None'}"
           )
           y -= 15

           pdf.drawString(
           72,
           y,
           f"Missing Skills: {', '.join(latest_resume.missing_skills[:5]) or 'None'}"
           )
           y -= 30

        # Job Description Match
        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(72, y, "JD Match")
        y -= 20

        pdf.setFont("Helvetica", 11)

        if latest_match:
           pdf.drawString(
           72,
           y,
           f"Match Score: {latest_match.match_score:.1f}%"
           )
           y -= 15

           pdf.drawString(
           72,
           y,
           f"Missing Skills: {', '.join(latest_match.missing_skills[:5])}"
           )
           y -= 30
 
        #Mock Interview
        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(72, y, "Mock Interview")
        y -= 20

        pdf.setFont("Helvetica", 11)

        if latest_interview:
           pdf.drawString(
           72,
           y,
           f"Overall Score: {latest_interview.overall_score}"
           )
           y -= 15

           pdf.drawString(
           72,
           y,
           f"Technical: {latest_interview.technical_score}"
           )
           y -= 15

           pdf.drawString(
           72,
           y,
           f"Communication: {latest_interview.communication_score}"
           )
           y -= 30

        # Learning Roadmap
        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(72, y, "Learning Roadmap")
        y -= 20

        pdf.setFont("Helvetica", 11)

        for item in learning_items[:3]:
           pdf.drawString(
           72,
           y,
           f"• {item.topic}"
           )
           y -= 15   

        pdf.showPage()
        pdf.save()
    except Exception:
        buffer.write(b"Nexora AI Report\n")
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=nexora-ai-report.pdf"},
    )
