import io
import pytest
from httpx import AsyncClient
from app.services.resume_parser import _fallback_parse, parse_resume_text


def test_resume_parser_fallback_does_not_invent_education():
    sample_resume_no_edu = """
    Priya Sharma
    Email: priya.sharma@example.com
    Phone: +91 9876543210
    Location: Pune, Maharashtra

    Summary:
    5 years of experience in Java backend development. Took a 4-year career gap.

    Technical Skills:
    Java, Spring Boot, MySQL, REST APIs, Git, Maven, Docker

    Experience:
    Senior Java Developer at Tech Solutions (2015 - 2020)
    """
    res = _fallback_parse(sample_resume_no_edu)
    assert res.name == "Priya Sharma"
    assert res.email == "priya.sharma@example.com"
    assert res.city == "Pune"
    assert "Java" in res.skills
    assert "Spring Boot" in res.skills
    assert res.experience_years >= 4
    assert res.career_gap_years >= 3.5
    # Must NOT invent education when none is present in the resume
    assert res.education is None


def test_resume_parser_fallback_extracts_real_education():
    sample_resume_with_edu = """
    Ramesh Kumar
    Email: ramesh.k@example.com
    Phone: 9876543211
    Location: Lucknow, UP

    Education:
    B.Tech in Mechanical Engineering (2019)

    Experience:
    3 years delivery operations and route management.
    """
    res = _fallback_parse(sample_resume_with_edu)
    assert res.name == "Ramesh Kumar"
    assert res.education is not None
    assert "B.Tech" in res.education


@pytest.mark.asyncio
async def test_parse_resume_text_fallback_flow():
    sample_resume = """
    Arjun Mehta
    Email: arjun.mehta@example.com
    City: Bengaluru

    Skills:
    Manual Testing, JIRA, SQL, Selenium
    """
    res = await parse_resume_text(sample_resume)
    assert res.name == "Arjun Mehta"
    assert "Manual Testing" in res.skills or "SQL" in res.skills
    assert res.education is None


async def _get_auth_token(client: AsyncClient, email: str = "uploader@example.com") -> str:
    resp = await client.post(
        "/api/auth/signup",
        json={"name": "Uploader User", "email": email, "password": "SecretPassword123!"},
    )
    if resp.status_code == 201:
        return resp.json()["access_token"]
    login_resp = await client.post(
        "/api/auth/login",
        json={"email": email, "password": "SecretPassword123!"},
    )
    return login_resp.json()["access_token"]


def test_resume_parser_computes_experience_and_gap_from_date_ranges():
    sample_resume_dates = """
    Priya Sharma
    Email: priya.sharma@example.com
    City: Pune

    Experience:
    Senior Java Developer at Tech Solutions (2015 - 2020)
    Career break: 2020 - 2024

    Skills:
    Java, Spring Boot, MySQL, REST APIs
    """
    res = _fallback_parse(sample_resume_dates)
    assert res.experience_years >= 4
    assert res.career_gap_years >= 3.5
    assert res.resume_text is not None


def test_resume_parser_computes_gap_between_jobs():
    sample_resume_two_jobs = """
    Devendra Singh
    Email: dev@example.com
    City: Bengaluru

    Work History:
    Software Engineer: 2016 - 2019
    Senior Engineer: 2022 - 2025

    Skills:
    Python, Django, PostgreSQL
    """
    res = _fallback_parse(sample_resume_two_jobs)
    assert res.experience_years >= 5
    assert res.career_gap_years >= 2.5


@pytest.mark.asyncio
async def test_upload_resume_without_auth_returns_401(client: AsyncClient):
    files = {"file": ("resume.txt", io.BytesIO(b"Hello resume content"), "text/plain")}
    response = await client.post("/api/profile/upload-resume", files=files)
    assert response.status_code == 401
    assert "detail" in response.json()


@pytest.mark.asyncio
async def test_upload_resume_invalid_token_returns_401(client: AsyncClient):
    files = {"file": ("resume.txt", io.BytesIO(b"Hello resume content"), "text/plain")}
    response = await client.post(
        "/api/profile/upload-resume",
        files=files,
        headers={"Authorization": "Bearer invalid_bad_token_123"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_upload_resume_txt_endpoint(client: AsyncClient):
    token = await _get_auth_token(client, "sneha.upload@example.com")
    resume_content = (
        "Sneha Patel\n"
        "Email: sneha.patel@example.com\n"
        "City: Noida\n"
        "Experience: 5 years in Customer Support, Zendesk, CRM, Communication Skills\n"
    )
    files = {"file": ("resume.txt", io.BytesIO(resume_content.encode("utf-8")), "text/plain")}
    response = await client.post(
        "/api/profile/upload-resume",
        files=files,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Sneha Patel"
    assert data["city"] == "Noida"
    assert any("Customer Support" in s or "CRM" in s for s in data["skills"])
    assert data.get("resume_text") is not None


@pytest.mark.asyncio
async def test_upload_resume_oversized_file(client: AsyncClient):
    token = await _get_auth_token(client, "oversized@example.com")
    large_content = b"A" * (5 * 1024 * 1024 + 1024)
    files = {"file": ("large_resume.txt", io.BytesIO(large_content), "text/plain")}
    response = await client.post(
        "/api/profile/upload-resume",
        files=files,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 413


@pytest.mark.asyncio
async def test_upload_resume_unsupported_format(client: AsyncClient):
    token = await _get_auth_token(client, "unsupported@example.com")
    files = {"file": ("malicious.exe", io.BytesIO(b"dummy binary data"), "application/octet-stream")}
    response = await client.post(
        "/api/profile/upload-resume",
        files=files,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_onboarding_chat_with_resume_text_asks_target_role(client: AsyncClient):
    """After resume upload with role+skills+city, agent asks for next missing slot (target_role)."""
    token = await _get_auth_token(client, "resume_target@example.com")
    resume_text = (
        "Priya Sharma\n"
        "Email: resume_target@example.com\n"
        "Location: Pune\n"
        "Senior Java Developer (2015 - 2020)\n"
        "Skills: Java, Spring Boot, MySQL, REST APIs, Git\n"
    )
    resp = await client.post(
        "/api/onboarding/chat",
        json={"session_id": "test-res-sess", "message": "Uploaded resume: priya.txt", "resume_text": resume_text},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert any(phrase in data["reply"].lower() for phrase in ("target role", "aiming for", "role do you want", "which **role"))
    assert any("engineer" in qr.lower() or "analyst" in qr.lower() or "qa" in qr.lower() for qr in data["quick_replies"])

