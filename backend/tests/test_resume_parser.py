import io
import pytest
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


@pytest.mark.asyncio
async def test_upload_resume_txt_endpoint(client):
    resume_content = (
        "Sneha Patel\n"
        "Email: sneha.patel@example.com\n"
        "City: Noida\n"
        "Experience: 5 years in Customer Support, Zendesk, CRM, Communication Skills\n"
    )
    files = {"file": ("resume.txt", io.BytesIO(resume_content.encode("utf-8")), "text/plain")}
    response = await client.post("/api/profile/upload-resume", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Sneha Patel"
    assert data["city"] == "Noida"
    assert any("Customer Support" in s or "CRM" in s for s in data["skills"])


@pytest.mark.asyncio
async def test_upload_resume_oversized_file(client):
    # Create file > 5MB
    large_content = b"A" * (5 * 1024 * 1024 + 1024)
    files = {"file": ("large_resume.txt", io.BytesIO(large_content), "text/plain")}
    response = await client.post("/api/profile/upload-resume", files=files)
    assert response.status_code == 413


@pytest.mark.asyncio
async def test_upload_resume_unsupported_format(client):
    files = {"file": ("malicious.exe", io.BytesIO(b"dummy binary data"), "application/octet-stream")}
    response = await client.post("/api/profile/upload-resume", files=files)
    assert response.status_code == 400
