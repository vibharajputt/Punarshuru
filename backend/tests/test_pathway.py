import pytest
from app.services.pathway import generate_pathways_sync


def test_pathway_generation(personas_data):
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
            for step in pw.roadmap:
                assert len(step.courses) > 0
                for course in step.courses:
                    assert course.title
                    assert course.provider in ["NPTEL", "SWAYAM", "Skill India", "freeCodeCamp"]
