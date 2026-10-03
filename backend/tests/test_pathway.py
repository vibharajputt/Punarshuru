import pytest
from app.services.pathway import generate_pathways_sync, generate_pathways_async


def test_pathway_generation_all_personas(personas_data):
    for p in personas_data:
        res = generate_pathways_sync(p)
        assert len(res.pathways) == 3
        types = [pw.type for pw in res.pathways]
        assert "Safe" in types
        assert "Stretch" in types
        assert "Pivot" in types

        for pw in res.pathways:
            assert len(pw.roadmap) >= 2
            assert pw.target_salary_lpa > 0
            assert pw.estimated_months >= 1
            for step in pw.roadmap:
                assert len(step.courses) > 0
                for course in step.courses:
                    assert course.title
                    assert course.provider in ["NPTEL", "SWAYAM", "Skill India", "freeCodeCamp"]


def test_different_personas_get_different_pathways(personas_data):
    """Verify two different personas receive distinct data-driven pathways."""
    priya = next(p for p in personas_data if p["key"] == "priya")
    ramesh = next(p for p in personas_data if p["key"] == "ramesh")
    arjun = next(p for p in personas_data if p["key"] == "arjun")

    res_priya = generate_pathways_sync(priya)
    res_ramesh = generate_pathways_sync(ramesh)
    res_arjun = generate_pathways_sync(arjun)

    # Safe roles should be different
    priya_safe = next(pw for pw in res_priya.pathways if pw.type == "Safe")
    ramesh_safe = next(pw for pw in res_ramesh.pathways if pw.type == "Safe")
    arjun_safe = next(pw for pw in res_arjun.pathways if pw.type == "Safe")

    assert priya_safe.target_role != ramesh_safe.target_role
    assert priya_safe.target_role != arjun_safe.target_role
    assert priya_safe.target_salary_lpa != ramesh_safe.target_salary_lpa

    # Stretch roles and salaries should be different and tailored to profile
    priya_stretch = next(pw for pw in res_priya.pathways if pw.type == "Stretch")
    ramesh_stretch = next(pw for pw in res_ramesh.pathways if pw.type == "Stretch")
    arjun_stretch = next(pw for pw in res_arjun.pathways if pw.type == "Stretch")

    assert priya_stretch.target_role == "GenAI Engineer"
    assert ramesh_stretch.target_role == "Logistics Tech Analyst"
    assert arjun_stretch.target_role == "Automation QA / SDET" or "QA" in arjun_stretch.target_role
    assert priya_stretch.target_salary_lpa > ramesh_stretch.target_salary_lpa


@pytest.mark.asyncio
async def test_async_pathway_generation_attaches_quote(personas_data):
    priya = next(p for p in personas_data if p["key"] == "priya")
    res = await generate_pathways_async(priya)
    assert res.motivation_quote
    assert len(res.motivation_quote) > 10
    assert len(res.pathways) == 3
