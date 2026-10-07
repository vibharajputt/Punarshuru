import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.salary_ml import predict_salary, get_model_metadata, get_city_averages


def test_predict_salary_service():
    """Verify ML model predict_salary service returns calibrated outputs."""
    res = predict_salary(
        role="Data Scientist",
        experience_years=4.0,
        skills=["Python", "SQL", "Machine Learning"],
        city="Bengaluru",
    )
    assert "predicted_salary_lpa" in res
    assert res["predicted_salary_lpa"] > 0
    assert "salary_bracket" in res
    assert res["salary_bracket"] in ["0to3", "3to6", "6to10", "10to15", "15to25", "25to50"]
    assert "bracket_probabilities" in res
    assert len(res["bracket_probabilities"]) == 6
    assert "percentile" in res
    assert 0 <= res["percentile"] <= 100
    assert res["salary_min_lpa"] <= res["predicted_salary_lpa"] <= res["salary_max_lpa"] + 2.0


def test_model_metadata():
    """Verify model metadata reports metrics from 15,841 jobs."""
    meta = get_model_metadata()
    assert meta["dataset_records"] == 15841
    assert meta["within_bracket_accuracy_pct"] >= 80.0
    assert meta["mae_lpa"] < 5.0
    assert meta["r2_score"] > 0.5


def test_city_averages():
    """Verify city averages contain top Indian tech hubs."""
    avgs = get_city_averages()
    assert "Bengaluru" in avgs
    assert "Mumbai" in avgs
    assert "Pune" in avgs
    assert "Hyderabad" in avgs
    assert avgs["Bengaluru"] > 10.0


@pytest.mark.asyncio
async def test_api_predict_salary():
    """Verify /api/market/predict-salary endpoint."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post(
            "/api/market/predict-salary",
            json={
                "role": "Machine Learning Engineer",
                "experience_years": 5.0,
                "skills": ["Python", "PyTorch", "Docker"],
                "city": "Bengaluru",
            },
        )
        assert res.status_code == 200
        data = res.json()
        assert data["predicted_salary_lpa"] > 0
        assert data["salary_bracket"] in ["0to3", "3to6", "6to10", "10to15", "15to25", "25to50"]
        assert len(data["bracket_probabilities"]) == 6


@pytest.mark.asyncio
async def test_api_model_info():
    """Verify /api/market/model-info endpoint."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/market/model-info")
        assert res.status_code == 200
        data = res.json()
        assert data["dataset_records"] == 15841
        assert data["within_bracket_accuracy_pct"] >= 80.0


@pytest.mark.asyncio
async def test_api_list_roles():
    """Verify /api/market/roles endpoint returns filtered jobs from dataset."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/market/roles?limit=10")
        assert res.status_code == 200
        roles = res.json()
        assert len(roles) > 0
        assert "title" in roles[0]
        assert "salary_min_lpa" in roles[0]
