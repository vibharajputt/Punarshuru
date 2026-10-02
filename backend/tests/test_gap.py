import pytest
from app.services.gap import analyze_skill_gap


def test_gap_analysis_all_personas(personas_data):
    for p in personas_data:
        res = analyze_skill_gap(p, target_role=p["target_role"])
        assert res.target_role == p["target_role"]
        assert 0 <= res.match_pct <= 100
        assert isinstance(res.have_skills, list)
        assert isinstance(res.partial_skills, list)
        assert isinstance(res.missing_skills, list)
        assert len(res.role_required_skills) > 0
        assert len(res.radar) > 0


def test_gap_analysis_exact_and_missing(personas_data):
    priya = next(p for p in personas_data if p["key"] == "priya")
    # Priya knows Java, MySQL, REST APIs, Git. Target: GenAI Engineer
    res = analyze_skill_gap(priya, target_role="GenAI Engineer")
    # GenAI Engineer typically requires Python, GenAI, LangChain, RAG
    assert len(res.role_required_skills) >= 5
    assert res.match_pct < 80  # wide gap for GenAI transition
