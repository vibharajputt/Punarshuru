from app.services.onboarding_engine import new_state, handle_message, apply_resume, build_response, confirm


def chat(state, *msgs):
    out = build_response(state)
    for m in msgs:
        state = handle_message(state, m)
        out = build_response(state)
    return state, out


def test_no_loop_student_flow():
    s, out = chat(new_state("Vibha Rajput", "v@x.in"),
                  "Final Year Student", "Python, Java, SQL", "ML Engineer", "Mohali", "No break", "Remote", "Smart India Hackathon Winner")
    d = out["profile_draft"]
    assert d["current_role"] == "Final Year Student"
    assert d["skills_raw"] == ["Python", "Java", "SQL"]
    assert d["target_role"] == "ML Engineer" and d["city"] == "Mohali"
    assert d["preferred_city"] == "Remote"
    assert "Smart India Hackathon Winner" in d["achievements"]
    assert out["segment"] == "student" and out["can_confirm"] and out["quick_replies"] == []
    assert confirm(s)["done"]


def test_role_answer_goes_to_role_not_skills():
    s, out = chat(new_state("A"), "Delivery Partner")
    assert out["profile_draft"]["current_role"] == "Delivery Partner"
    assert out["profile_draft"]["skills_raw"] == []
    assert "skill" in out["reply"].lower()


def test_filename_ignored():
    s, out = chat(new_state("A"), "Uploaded Resume: Vibha_Raj_Resume.pdf")
    assert out["profile_draft"]["skills_raw"] == []
    assert out["profile_draft"]["current_role"] == ""


def test_resume_then_asks_only_missing():
    s = new_state("Vibha Rajput")
    s = apply_resume(s, {"current_role": "Backend Developer", "skills": ["Python", "FastAPI", "PostgreSQL", "Docker"],
                         "experience_years": 2, "career_gap_years": None, "city": ""})
    out = build_response(s)
    assert "4 skills" in out["reply"] and "role do you want" in out["reply"]
    s, out = chat(s, "GenAI Engineer in Delhi")
    assert out["profile_draft"]["target_role"] == "GenAI Engineer"
    assert out["profile_draft"]["city"] == "Delhi"
    assert "career break" in out["reply"].lower()


def test_hinglish():
    s, out = chat(new_state("Abhishek"), "main delivery partner hun Lucknow me")
    d = out["profile_draft"]
    assert d["current_role"] == "Delivery Partner" and d["city"] == "Lucknow"
    assert out["segment"] == "gig" and "skills" in out["reply"].lower()


def test_never_asks_same_slot_three_times():
    s, out = chat(new_state("A"), "Final Year Student", "blah", "qwerty zxcv")
    assert len(out["profile_draft"]["skills_raw"]) >= 1
    assert out["profile_draft"]["skills_raw"] != []


def test_skip_and_proceed_dont_end():
    s, out = chat(new_state("A"), "Skip")
    assert not out["can_confirm"] and out["profile_draft"]["current_role"] == ""
    s, out = chat(s, "I want to proceed into data science")
    assert not out["done"]


def test_gap_and_laid_off():
    s, out = chat(new_state("A"), "Manual QA Tester, laid off last month", "Manual Testing, JIRA, SQL",
                  "Automation QA", "Bengaluru", "2 years")
    assert out["profile_draft"]["career_gap_years"] == 2.0
    assert out["segment"] == "laid_off"
    s, out = chat(new_state("C"), "Java Developer", "Java, Spring Boot, MySQL", "Backend Developer", "Pune", "4 years")
    assert out["segment"] == "returner"
    s, out = chat(new_state("B"), "Manual QA Tester, laid off last month", "Manual Testing, JIRA, SQL",
                  "Automation QA", "Bengaluru", "No break")
    assert out["segment"] == "laid_off"