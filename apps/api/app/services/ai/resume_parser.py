import re
from io import BytesIO

from fastapi import UploadFile


SECTION_ALIASES = {
    "summary": ["summary", "profile", "objective"],
    "experience": ["experience", "work experience", "employment", "projects"],
    "education": ["education", "academics"],
    "skills": ["skills", "technical skills", "technologies"],
    "certifications": ["certifications", "certificates", "achievements"],
}


async def parse_resume_file(
    file: UploadFile | None,
    fallback_text: str | None = None,
) -> tuple[str, str | None, bytes | None]:
    if file is None:
        return (fallback_text or "").strip(), None, None

    content = await file.read()
    filename = file.filename
    if filename and filename.lower().endswith(".pdf"):
        try:
            from pypdf import PdfReader

            reader = PdfReader(BytesIO(content))
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
            return text.strip(), filename, content
        except Exception:
            return "", filename, content

    try:
        return content.decode("utf-8", errors="ignore").strip(), filename, content
    except Exception:
        return "", filename, content


def extract_sections(text: str) -> dict[str, str]:
    normalized = text.replace("\r", "\n")
    matches: list[tuple[str, int, int]] = []

    for canonical, aliases in SECTION_ALIASES.items():
        for alias in aliases:
            pattern = rf"(?im)^\s*({re.escape(alias)})\s*:?\s*$"
            for match in re.finditer(pattern, normalized):
                matches.append((canonical, match.start(), match.end()))

    matches.sort(key=lambda item: item[1])
    sections: dict[str, str] = {}
    for index, (name, _, end) in enumerate(matches):
        next_start = matches[index + 1][1] if index + 1 < len(matches) else len(normalized)
        value = normalized[end:next_start].strip()
        if value and name not in sections:
            sections[name] = value[:6000]

    if not sections:
        sections["summary"] = normalized[:6000].strip()
    return sections
