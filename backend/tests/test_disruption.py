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


def test_disruption_factor_maxes_and_caps(personas_data):
    """
    Unit test asserting:
    1. Sum of all factor maxes == 100.
    2. For each persona and edge-case profile, each factor's value <= its max.
    """
    from app.services.disruption import DISRUPTION_FACTOR_MAXES, calculate_disruption_score

    # 1. Assert sum of all factor maxes == 100
    assert sum(DISRUPTION_FACTOR_MAXES.values()) == 100.0

    # 2. Assert each factor's value <= its max for all personas
    for p in personas_data:
        res = calculate_disruption_score(p)
        assert res.breakdown.skill_decay <= DISRUPTION_FACTOR_MAXES["skill_decay"]
        assert res.breakdown.automation_risk <= DISRUPTION_FACTOR_MAXES["automation_risk"]
        assert res.breakdown.career_gap <= DISRUPTION_FACTOR_MAXES["career_gap"]
        assert res.breakdown.stagnation <= DISRUPTION_FACTOR_MAXES["stagnation"]
        assert res.breakdown.market_mismatch <= DISRUPTION_FACTOR_MAXES["market_mismatch"]
        assert res.score <= 100.0

    # 3. Test extreme edge case profile with high numbers
    extreme_profile = {
        "user_type": "gig",
        "career_gap_years": 20.0,
        "experience_years": 30,
        "current_role": "Manual QA Tester / Delivery Partner",
        "target_role": "GenAI Architect / Senior ML Lead",
        "skills_raw": ["Legacy Tool 1", "Legacy Tool 2"],
        "skills_taxonomy_ids": [],
    }
    extreme_res = calculate_disruption_score(extreme_profile)
    assert extreme_res.breakdown.skill_decay <= DISRUPTION_FACTOR_MAXES["skill_decay"]
    assert extreme_res.breakdown.automation_risk <= DISRUPTION_FACTOR_MAXES["automation_risk"]
    assert extreme_res.breakdown.career_gap <= DISRUPTION_FACTOR_MAXES["career_gap"]
    assert extreme_res.breakdown.stagnation <= DISRUPTION_FACTOR_MAXES["stagnation"]
    assert extreme_res.breakdown.market_mismatch <= DISRUPTION_FACTOR_MAXES["market_mismatch"]
    assert extreme_res.score <= 100.0

