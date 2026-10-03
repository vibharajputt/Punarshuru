import pytest
from app.services.gap import analyze_skill_gap
from app.services.embeddings import compute_similarity, find_embedding_partial_matches


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
        assert len(res.hidden_strengths) > 0


def test_gap_analysis_exact_and_missing(personas_data):
    priya = next(p for p in personas_data if p["key"] == "priya")
    res = analyze_skill_gap(priya, target_role="GenAI Engineer")
    assert len(res.role_required_skills) >= 5
    assert res.match_pct < 80
    assert len(res.hidden_strengths) >= 2


def test_fastembed_similarity_and_partial_matching():
    # Test semantic similarity
    sim_identical = compute_similarity("Python", "Python")
    assert sim_identical >= 0.99

    sim_related = compute_similarity("Node.js", "Express.js")
    assert sim_related > 0.4

    # Test partial match detection with fastembed
    user_skills = ["Java", "Spring Boot", "MySQL", "Selenium Testing"]
    role_skills = ["Selenium", "FastAPI", "RAG"]
    have = ["Selenium"]

    partial, missing = find_embedding_partial_matches(
        user_skills=user_skills,
        role_required_skills=role_skills,
        have_skills=have,
        threshold=0.75,
    )
    assert isinstance(partial, list)
    assert "FastAPI" in missing or "RAG" in missing
