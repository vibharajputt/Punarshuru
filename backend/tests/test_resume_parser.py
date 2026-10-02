import pytest
from app.services.resume_parser import _fallback_parse


def test_resume_parser_fallback():
    sample_resume = """
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
    res = _fallback_parse(sample_resume)
    assert res.name == "Priya Sharma"
    assert res.email == "priya.sharma@example.com"
    assert res.city == "Pune"
    assert "Java" in res.skills
    assert "Spring Boot" in res.skills
    assert res.experience_years >= 4
    assert res.career_gap_years >= 3.5
