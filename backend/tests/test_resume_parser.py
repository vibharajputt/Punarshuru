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


def test_resume_parser_computes_gap_from_last_experience_2023():
    """If last experience ended in 2023 with no current job, gap is 3.0 years in 2026."""
    resume = """
    Priya Sharma
    Email: priya@example.com
    City: Pune

    Experience:
    Java Developer at Tech Corp (2020 - 2023)

    Skills:
    Java, Spring Boot, MySQL, REST APIs
    """
    res = _fallback_parse(resume)
    assert res.career_gap_years >= 3.0
    assert res.user_type == "returner"


def test_resume_parser_computes_gap_from_last_education_2023():
    """If last education was in 2023 with no work experience, gap is 3.0 years in 2026."""
    resume = """
    Rohan Gupta
    Email: rohan@example.com
    City: Delhi

    Education:
    B.Tech in Computer Science (2019 - 2023)

    Skills:
    Python, Django, PostgreSQL
    """
    res = _fallback_parse(resume)
    assert res.career_gap_years >= 3.0
    assert res.user_type == "returner"


def test_resume_parser_classifies_gig_worker():
    resume = """
    Ramesh Kumar
    Email: ramesh@example.com
    City: Lucknow

    Experience:
    Swiggy Delivery Partner (2022 - Present)

    Skills:
    Customer Service, Route Planning
    """
    res = _fallback_parse(resume)
    assert res.user_type == "gig"


def test_resume_parser_classifies_laid_off_worker():
    resume = """
    Arjun Mehta
    Email: arjun@example.com
    City: Bengaluru

    Experience:
    Manual QA Engineer at Fintech Startup (2021 - 2024)
    Laid off due to team restructuring in 2024.

    Skills:
    Manual Testing, JIRA, SQL
    """
    res = _fallback_parse(resume)
    assert res.user_type == "laid_off"


def test_resume_parser_classifies_fresher_student():
    resume = """
    Rohit Singh
    Email: rohit@example.com
    City: Mohali

    Summary:
    Final Year Student / CS Fresher graduating in 2026.

    Skills:
    Python, Machine Learning, Git
    """
    res = _fallback_parse(resume)
    assert res.user_type == "student"


def test_resume_parser_computes_gap_from_system_date_work_ended_2023():
    from datetime import datetime
    current_year = datetime.now().year
    resume = """
    Priya Sharma
    Email: priya@example.com
    City: Pune

    Experience:
    Java Developer at Tech Corp (2020 - 2023)

    Skills:
    Java, Spring Boot, MySQL
    """
    res = _fallback_parse(resume)
    expected_gap = float(current_year - 2023)
    assert res.career_gap_years == expected_gap
    assert res.user_type == "returner"


def test_resume_parser_computes_gap_from_system_date_education_ended_2023():
    from datetime import datetime
    current_year = datetime.now().year
    resume = """
    Vibha Kumari
    Email: vibha@example.com
    City: Bengaluru

    Education:
    B.Tech Computer Science (Graduated in 2023)

    Skills:
    Python, SQL, HTML
    """
    res = _fallback_parse(resume)
    expected_gap = float(current_year - 2023)
    assert res.career_gap_years == expected_gap
    assert res.user_type == "returner"


def test_resume_parser_does_not_invent_city_or_role_when_absent():
    resume_no_city_no_role = """
    Anonymous Candidate
    Email: anon@example.com
    Phone: 9988776655

    Skills:
    Python, Django, FastAPI, Docker
    """
    res = _fallback_parse(resume_no_city_no_role)
    # City and role MUST NOT be hardcoded to Bengaluru or Software Professional
    assert res.city is None
    assert res.current_role is None


def test_resume_parser_extracts_various_indian_cities_correctly():
    cities_to_test = [
        ("Location: Pune, Maharashtra", "Pune"),
        ("Current Location: Jaipur", "Jaipur"),
        ("Based in: Mohali", "Mohali"),
        ("Address: Sector 62, Noida, UP", "Noida"),
        ("Living in Lucknow", "Lucknow"),
        ("Hyderabad, Telangana", "Hyderabad"),
        ("Kolkata, WB", "Kolkata"),
    ]
    for text_snippet, expected_city in cities_to_test:
        resume = f"""
        Candidate Test
        Email: test@example.com
        {text_snippet}
        Skills: Python, SQL
        """
        res = _fallback_parse(resume)
        assert res.city == expected_city, f"Failed for snippet: {text_snippet}"


def test_onboarding_engine_prompts_for_missing_city_and_role_from_resume():
    from app.services.onboarding_engine import new_state, apply_resume, next_slot
    state = new_state("Test User", "test@example.com")
    resume_no_city = """
    Test User
    Email: test@example.com
    Role: Java Developer
    Skills: Java, Spring Boot, MySQL, REST APIs
    """
    parsed = _fallback_parse(resume_no_city)
    assert parsed.city is None
    state = apply_resume(state, parsed.model_dump())
    # Since city and target_role were not in resume, next_slot must ask for them
    slot = next_slot(state)
    assert slot in ("target_role", "city")
    assert state["draft"]["city"] == ""



