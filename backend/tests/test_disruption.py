import pytest
from app.services.disruption import calculate_disruption_score


def test_disruption_all_5_personas(personas_data):
    """Verify disruption scoring works accurately for all 5 personas from SPEC."""
    assert len(personas_data) == 5

    for p in personas_data:
        res = calculate_disruption_score(p)
        assert 0 <= res.score <= 100
        assert res.risk_level in ["Low", "Moderate", "High"]
        assert res.breakdown.skill_decay >= 0
        assert res.breakdown.automation_risk >= 0
        assert res.breakdown.career_gap >= 0
        assert res.breakdown.stagnation >= 0
        assert res.breakdown.market_mismatch >= 0
        assert len(res.breakdown.reasons) == 5
        assert len(res.breakdown.top_risks) > 0
        assert len(res.breakdown.strengths) > 0


def test_disruption_specific_cases(personas_data):
    # Priya: 4-year career gap returner
    priya = next(p for p in personas_data if p["key"] == "priya")
    res_priya = calculate_disruption_score(priya)
    assert res_priya.breakdown.career_gap >= 15
    assert res_priya.score >= 50

    # Rohit: Student with fresh skills and no gap
    rohit = next(p for p in personas_data if p["key"] == "rohit")
    res_rohit = calculate_disruption_score(rohit)
    assert res_rohit.breakdown.career_gap == 0
    assert res_rohit.score < 40
    assert res_rohit.risk_level in ["Low", "Moderate"]

    # Ramesh: Gig worker with high automation vulnerability
    ramesh = next(p for p in personas_data if p["key"] == "ramesh")
    res_ramesh = calculate_disruption_score(ramesh)
    assert res_ramesh.breakdown.automation_risk >= 25
    assert res_ramesh.score >= 60
