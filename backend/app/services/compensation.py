import json
from pathlib import Path
from typing import Any
from app.schemas.compensation import (
    RealCompRequest,
    RealCompResponse,
    CompareRequest,
    CompareResponse,
    CityCompareItem,
)

DATA_DIR = Path(__file__).parent.parent / "data"


def _load_json(filename: str) -> Any:
    path = DATA_DIR / filename
    if path.exists():
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return []


def _get_city_cost_dict() -> dict[str, dict]:
    cities = _load_json("city_costs.json")
    return {c["city"].lower(): c for c in cities}


def calculate_real_compensation(req: RealCompRequest) -> RealCompResponse:
    """
    Calculates Real Purchasing Power Salary:
    Real = (Nominal Salary - Rent - Commute) / CoL Index
    """
    cost_map = _get_city_cost_dict()
    city_key = req.city.strip().lower()
    city_data = cost_map.get(
        city_key,
        {
            "city": req.city,
            "col_index": 1.5,
            "rent_1bhk_inr": 12000,
            "rent_2bhk_inr": 20000,
            "commute_monthly_inr": 2000,
            "avg_meal_inr": 80,
        },
    )

    col_index = float(city_data.get("col_index", 1.5))
    monthly_rent = float(city_data.get("rent_2bhk_inr" if req.bhk == 2 else "rent_1bhk_inr", 12000))
    monthly_commute = float(city_data.get("commute_monthly_inr", 2000))

    annual_rent_inr = monthly_rent * 12
    annual_commute_inr = monthly_commute * 12

    annual_rent_lpa = annual_rent_inr / 100000.0
    annual_commute_lpa = annual_commute_inr / 100000.0

    nominal_salary_lpa = req.salary_lpa
    disposable_lpa = max(0.0, nominal_salary_lpa - annual_rent_lpa - annual_commute_lpa)
    real_salary_lpa = round(disposable_lpa / max(0.1, col_index), 2)

    # In hand monthly calculation (approx 88% after tax/PF for standard mid-income, minus rent/commute)
    gross_monthly_inr = (nominal_salary_lpa * 100000) / 12.0
    tax_factor = 0.90 if nominal_salary_lpa <= 7 else (0.85 if nominal_salary_lpa <= 15 else 0.78)
    net_in_hand_monthly = round(gross_monthly_inr * tax_factor, 0)
    savings_potential = max(0.0, net_in_hand_monthly - monthly_rent - monthly_commute - 15000)

    return RealCompResponse(
        city=city_data.get("city", req.city),
        nominal_salary_lpa=round(nominal_salary_lpa, 2),
        col_index=col_index,
        annual_rent_inr=annual_rent_inr,
        annual_commute_inr=annual_commute_inr,
        real_salary_lpa=real_salary_lpa,
        in_hand_monthly_inr=net_in_hand_monthly,
        monthly_savings_potential_inr=round(savings_potential, 0),
        cost_breakdown={
            "monthly_rent_inr": monthly_rent,
            "monthly_commute_inr": monthly_commute,
            "avg_meal_inr": float(city_data.get("avg_meal_inr", 80)),
        },
    )


def compare_offers(req: CompareRequest) -> CompareResponse:
    cost_map = _get_city_cost_dict()
    comparisons: list[CityCompareItem] = []

    for offer in req.offers:
        city_key = offer.city.strip().lower()
        city_data = cost_map.get(
            city_key,
            {
                "city": offer.city,
                "col_index": 1.5,
                "rent_1bhk_inr": 12000,
                "rent_2bhk_inr": 20000,
                "commute_monthly_inr": 2000,
            },
        )
        col_index = float(city_data.get("col_index", 1.5))
        monthly_rent = float(city_data.get("rent_2bhk_inr" if offer.bhk == 2 else "rent_1bhk_inr", 12000))
        monthly_commute = float(city_data.get("commute_monthly_inr", 2000))

        annual_rent_lpa = (monthly_rent * 12) / 100000.0
        annual_commute_lpa = (monthly_commute * 12) / 100000.0

        disposable_lpa = max(0.0, offer.salary_lpa - annual_rent_lpa - annual_commute_lpa)
        real_lpa = round(disposable_lpa / max(0.1, col_index), 2)

        gross_monthly = (offer.salary_lpa * 100000) / 12.0
        tax_factor = 0.90 if offer.salary_lpa <= 7 else (0.85 if offer.salary_lpa <= 15 else 0.78)
        net_in_hand = round(gross_monthly * tax_factor, 0)
        savings = max(0.0, net_in_hand - monthly_rent - monthly_commute - 15000)

        # Purchasing power score 0-100 relative to Mohali baseline
        score = min(100.0, round((real_lpa / max(1.0, offer.salary_lpa)) * 100, 1))

        comparisons.append(
            CityCompareItem(
                city=city_data.get("city", offer.city),
                offer_name=offer.offer_name,
                nominal_salary_lpa=round(offer.salary_lpa, 2),
                col_index=col_index,
                rent_monthly_inr=monthly_rent,
                commute_monthly_inr=monthly_commute,
                real_salary_lpa=real_lpa,
                in_hand_monthly_inr=net_in_hand,
                monthly_savings_inr=round(savings, 0),
                purchasing_power_score=score,
            )
        )

    # Sort by real salary descending
    comparisons.sort(key=lambda c: c.real_salary_lpa, reverse=True)
    best_offer = comparisons[0].offer_name if comparisons and comparisons[0].offer_name else (comparisons[0].city if comparisons else "N/A")

    # 5-year projection: cumulative wealth growth (assuming 10% annual hike, 6% expense inflation)
    projection = []
    for year in range(1, 6):
        year_entry = {"year": f"Year {year}"}
        for item in comparisons:
            name = item.offer_name or item.city
            comp_hike = (1.10 ** (year - 1))
            exp_inflation = (1.06 ** (year - 1))
            annual_sal = item.nominal_salary_lpa * comp_hike * 100000
            annual_exp = (item.rent_monthly_inr + item.commute_monthly_inr + 15000) * 12 * exp_inflation
            net_wealth = max(0, (annual_sal * 0.85) - annual_exp)
            year_entry[name] = round(net_wealth / 100000, 2)  # in Lakhs
        projection.append(year_entry)

    return CompareResponse(
        best_offer_by_real_income=best_offer,
        comparisons=comparisons,
        five_year_projection=projection,
    )
