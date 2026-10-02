import pytest
from app.schemas.compensation import RealCompRequest, CompareRequest, OfferItem
from app.services.compensation import calculate_real_compensation, compare_offers


def test_real_compensation():
    # Mohali (col=1.0) vs Bengaluru (col=2.4)
    req_mohali = RealCompRequest(salary_lpa=12.0, city="Mohali", bhk=1)
    res_mohali = calculate_real_compensation(req_mohali)
    assert res_mohali.col_index == 1.0
    assert res_mohali.real_salary_lpa > 0

    req_blr = RealCompRequest(salary_lpa=12.0, city="Bengaluru", bhk=1)
    res_blr = calculate_real_compensation(req_blr)
    assert res_blr.col_index == 2.4

    # Purchasing power of 12 LPA in Mohali should exceed 12 LPA in Bengaluru
    assert res_mohali.real_salary_lpa > res_blr.real_salary_lpa


def test_compare_offers():
    req = CompareRequest(
        offers=[
            OfferItem(offer_name="Offer Bengaluru", city="Bengaluru", salary_lpa=20.0, bhk=1),
            OfferItem(offer_name="Offer Mohali", city="Mohali", salary_lpa=14.0, bhk=1),
            OfferItem(offer_name="Offer Pune", city="Pune", salary_lpa=16.0, bhk=1),
        ]
    )
    res = compare_offers(req)
    assert len(res.comparisons) == 3
    assert res.best_offer_by_real_income
    assert len(res.five_year_projection) == 5
