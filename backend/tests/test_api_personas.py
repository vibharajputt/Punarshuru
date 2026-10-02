import pytest


@pytest.mark.asyncio
async def test_full_api_workflow_all_5_personas(client, personas_data):
    """
    Test complete lifecycle via API for all 5 personas:
    1. Load persona from demo
    2. Create profile via POST /api/profile
    3. Query Disruption score via GET /api/assess/{id}/disruption
    4. Query Skill Gap via GET /api/assess/{id}/gap
    5. Generate Pathways via GET /api/pathway/{id}
    6. Generate Passport via POST /api/passport/{id}
    7. Fetch public Passport via GET /api/passport/{slug}
    """
    assert len(personas_data) == 5

    for persona in personas_data:
        key = persona["key"]

        # 1. Load demo persona
        demo_resp = await client.post(f"/api/demo/load/{key}")
        assert demo_resp.status_code == 200
        p_data = demo_resp.json()

        # 2. Create profile
        profile_payload = {
            "name": p_data["name"],
            "email": f"{key}@demo.punarshuru.in",
            "user_type": p_data["user_type"],
            "city": p_data["city"],
            "current_role": p_data["current_role"],
            "target_role": p_data["target_role"],
            "experience_years": p_data["experience_years"],
            "career_gap_years": p_data["career_gap_years"],
            "current_salary_lpa": p_data.get("current_salary_lpa"),
            "skills_raw": p_data["skills_raw"],
            "skills_taxonomy_ids": p_data.get("skills_taxonomy_ids", []),
        }
        create_resp = await client.post("/api/profile", json=profile_payload)
        assert create_resp.status_code == 201
        created_profile = create_resp.json()
        profile_id = created_profile["id"]
        assert created_profile["disruption_score"] is not None

        # 3. GET /api/assess/{id}/disruption
        disrupt_resp = await client.get(f"/api/assess/{profile_id}/disruption")
        assert disrupt_resp.status_code == 200
        d_json = disrupt_resp.json()
        assert 0 <= d_json["score"] <= 100
        assert "breakdown" in d_json

        # 4. GET /api/assess/{id}/gap
        gap_resp = await client.get(f"/api/assess/{profile_id}/gap")
        assert gap_resp.status_code == 200
        g_json = gap_resp.json()
        assert 0 <= g_json["match_pct"] <= 100
        assert len(g_json["radar"]) > 0

        # 5. GET /api/pathway/{id}
        path_resp = await client.get(f"/api/pathway/{profile_id}")
        assert path_resp.status_code == 200
        pw_json = path_resp.json()
        assert len(pw_json["pathways"]) == 3

        # 6. POST /api/passport/{id}
        pass_resp = await client.post(f"/api/passport/{profile_id}", json={"is_public": True})
        assert pass_resp.status_code == 200
        pass_json = pass_resp.json()
        assert pass_json["slug"]
        assert pass_json["qr_data"]

        # 7. GET /api/passport/{slug}
        slug = pass_json["slug"]
        pub_resp = await client.get(f"/api/passport/{slug}")
        assert pub_resp.status_code == 200
        assert pub_resp.json()["profile_name"] == p_data["name"]


@pytest.mark.asyncio
async def test_compensation_endpoints(client):
    # POST /api/compensation/real
    real_resp = await client.post(
        "/api/compensation/real",
        json={"salary_lpa": 15.0, "city": "Bengaluru", "bhk": 1},
    )
    assert real_resp.status_code == 200
    r_json = real_resp.json()
    assert r_json["real_salary_lpa"] > 0

    # POST /api/compensation/compare
    cmp_resp = await client.post(
        "/api/compensation/compare",
        json={
            "offers": [
                {"offer_name": "Bangalore FinTech", "city": "Bengaluru", "salary_lpa": 22.0, "bhk": 1},
                {"offer_name": "Mohali SaaS", "city": "Mohali", "salary_lpa": 14.0, "bhk": 1},
            ]
        },
    )
    assert cmp_resp.status_code == 200
    c_json = cmp_resp.json()
    assert len(c_json["comparisons"]) == 2
