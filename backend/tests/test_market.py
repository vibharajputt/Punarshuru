import pytest
from app.services.market import get_market_trends, get_role_details


def test_market_trends():
    trends = get_market_trends()
    assert len(trends.rising) > 0
    assert len(trends.declining) > 0
    assert len(trends.stable) > 0
    assert trends.total_skills >= 200
    assert len(trends.top_demanded_skills) > 0
    assert len(trends.salary_by_city) > 0
    assert "Bengaluru" in trends.salary_by_city


def test_role_details():
    role = get_role_details(1)
    assert role is not None
    assert "title" in role
    assert "salary_min_lpa" in role
    assert "salary_max_lpa" in role
