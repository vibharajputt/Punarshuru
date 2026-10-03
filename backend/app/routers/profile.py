import io
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileRead, ProfileUpdate
from app.schemas.resume import ResumeParseRequest, ResumeParseResponse
from app.services.disruption import calculate_disruption_score
from app.services.resume_parser import parse_resume_text

router = APIRouter(tags=["Profile"])

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB per SPEC Addendum v2


@router.post("/profile", response_model=ProfileRead, status_code=status.HTTP_201_CREATED)
async def create_profile(
    profile_in: ProfileCreate,
    db: AsyncSession = Depends(get_db),
) -> ProfileRead:
    """Create a new user profile and automatically compute initial disruption score."""
    profile = Profile(**profile_in.model_dump())

    # Pre-calculate disruption
    disruption_res = calculate_disruption_score(profile)
    profile.disruption_score = disruption_res.score
    profile.disruption_breakdown = disruption_res.breakdown.model_dump()

    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return ProfileRead.model_validate(profile)


@router.get("/profile/{profile_id}", response_model=ProfileRead)
async def get_profile(
    profile_id: str,
    db: AsyncSession = Depends(get_db),
) -> ProfileRead:
    """Fetch user profile by ID."""
    stmt = select(Profile).where(Profile.id == profile_id)
    res = await db.execute(stmt)
    profile = res.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail=f"Profile '{profile_id}' not found")
    return ProfileRead.model_validate(profile)


@router.put("/profile/{profile_id}", response_model=ProfileRead)
async def update_profile(
    profile_id: str,
    profile_update: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
) -> ProfileRead:
    """Update profile details and re-calculate disruption score."""
    stmt = select(Profile).where(Profile.id == profile_id)
    res = await db.execute(stmt)
    profile = res.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail=f"Profile '{profile_id}' not found")

    update_data = profile_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    disruption_res = calculate_disruption_score(profile)
    profile.disruption_score = disruption_res.score
    profile.disruption_breakdown = disruption_res.breakdown.model_dump()

    await db.commit()
    await db.refresh(profile)
    return ProfileRead.model_validate(profile)


@router.post("/profile/parse-resume", response_model=ResumeParseResponse)
async def parse_resume(req: ResumeParseRequest) -> ResumeParseResponse:
    """Extract profile fields and skills from resume text using AI with regex fallback."""
    return await parse_resume_text(req.resume_text)


@router.post("/profile/upload-resume", response_model=ResumeParseResponse)
async def upload_resume(file: UploadFile = File(...)) -> ResumeParseResponse:
    """
    Accept PDF/DOCX/TXT upload (max 5MB), extract text content, and parse resume.
    """
    filename = file.filename or ""
    filename_lower = filename.lower()

    content = await file.read()

    # Check file size (5MB max)
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds maximum allowed limit of 5MB.",
        )

    extracted_text = ""

    if not (
        filename_lower.endswith(".pdf")
        or filename_lower.endswith(".docx")
        or filename_lower.endswith(".txt")
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a PDF, DOCX, or TXT file.",
        )

    if filename_lower.endswith(".pdf") or file.content_type == "application/pdf":
        try:
            from pypdf import PdfReader

            reader = PdfReader(io.BytesIO(content))
            pages_text = [page.extract_text() or "" for page in reader.pages]
            extracted_text = "\n".join(pages_text).strip()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to read PDF document: {str(e)}",
            )

    elif (
        filename_lower.endswith(".docx")
        or file.content_type
        == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ):
        try:
            import docx

            doc = docx.Document(io.BytesIO(content))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            extracted_text = "\n".join(paragraphs).strip()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to read DOCX document: {str(e)}",
            )

    elif filename_lower.endswith(".txt") or file.content_type == "text/plain":
        try:
            extracted_text = content.decode("utf-8", errors="ignore").strip()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to read text file: {str(e)}",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a PDF, DOCX, or TXT file.",
        )

    if not extracted_text or len(extracted_text.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract readable text from the uploaded document.",
        )

    return await parse_resume_text(extracted_text)
