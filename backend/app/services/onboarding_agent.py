import json
import re
from typing import Any

from app.schemas.onboarding import OnboardingChatResponse
from app.services.llm import complete
from app.services.resume_parser import parse_resume_text

# In-memory session state storage (session_id -> dict)
_sessions: dict[str, dict[str, Any]] = {}

SEGMENTS = ["returner", "gig", "laid_off", "stagnant", "student"]


def _get_or_create_session(session_id: str) -> dict[str, Any]:
    if session_id not in _sessions:
        _sessions[session_id] = {
            "turn_count": 0,
            "history": [],
            "profile_draft": {
                "name": "",
                "email": "",
                "user_type": "returner",
                "city": "",
                "current_role": "",
                "target_role": "",
                "experience_years": 0,
                "career_gap_years": 0.0,
                "current_salary_lpa": None,
                "skills_raw": [],
            },
            "segment": "returner",
            "done": False,
        }
    return _sessions[session_id]


def _classify_segment_from_text(text: str, current_role: str, gap_years: float) -> str:
    """Classifies user into 1 of 5 segments per SPEC."""
    t_lower = f"{text} {current_role}".lower()

    if "student" in t_lower or "college" in t_lower or "fresher" in t_lower or "btech" in t_lower or "graduate" in t_lower:
        return "student"
    if "delivery" in t_lower or "swiggy" in t_lower or "zomato" in t_lower or "uber" in t_lower or "ola" in t_lower or "gig" in t_lower or "driver" in t_lower:
        return "gig"
    if "laid off" in t_lower or "downsized" in t_lower or "fired" in t_lower or "qa" in t_lower or "manual test" in t_lower:
        return "laid_off"
    if gap_years > 0.5 or "maternity" in t_lower or "career gap" in t_lower or "career break" in t_lower or "break" in t_lower or "return" in t_lower:
        return "returner"
    if "stagnant" in t_lower or "support" in t_lower or "customer care" in t_lower or "bpo" in t_lower or "no growth" in t_lower:
        return "stagnant"

    return "returner"


def _get_missing_fields(draft: dict[str, Any]) -> list[str]:
    missing = []
    if not draft.get("name") or draft.get("name") in ["Candidate", ""]:
        missing.append("name")
    if not draft.get("current_role"):
        missing.append("current_role")
    if not draft.get("skills_raw") or len(draft.get("skills_raw", [])) == 0:
        missing.append("skills")
    if not draft.get("target_role"):
        missing.append("target_role")
    if not draft.get("city"):
        missing.append("city")
    return missing


def _rule_based_turn(
    session: dict[str, Any], user_msg: str
) -> OnboardingChatResponse:
    """
    Deterministic rule-based conversational fallback that asks missing fields in order
    with max 4 follow-up questions. Gap reason is optional with 'Skip'.
    """
    draft = session["profile_draft"]
    turn = session["turn_count"]

    msg_lower = user_msg.lower().strip()

    # 1. Name extraction
    name_m = re.search(
        r"(?:i am|my name is|this is)\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)",
        user_msg,
        re.I,
    )
    if name_m:
        extracted_name = name_m.group(1).strip()
        if len(extracted_name.split()) <= 4:
            draft["name"] = extracted_name.title()
    elif not draft.get("name") and user_msg.strip() and len(user_msg.split()) <= 3 and not any(char.isdigit() for char in user_msg) and not any(w in msg_lower for w in ["hi", "hello", "hey", "skip", "yes", "no"]):
        draft["name"] = user_msg.strip().title()

    # 2. Current role extraction
    role_m = re.search(
        r"(?:worked as|working as|role is|am a|as a|role of)\s+([A-Za-z0-9\s/]+?)(?:,|$|\.|\bwith\b|\band\b|\bin\b|\bfor\b)",
        user_msg,
        re.I,
    )
    if role_m:
        draft["current_role"] = role_m.group(1).strip().title()
    else:
        for r in [
            "Manual QA Tester",
            "QA Tester",
            "Java Developer",
            "Software Engineer",
            "Delivery Partner",
            "Swiggy Delivery",
            "Customer Support",
            "BPO Executive",
            "Student",
            "Final Year Student",
        ]:
            if r.lower() in msg_lower:
                draft["current_role"] = r
                break

    # 3. Experience extraction
    exp_m = re.findall(r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?|yr)?\s*(?:of)?\s*(?:exp|experience)", user_msg, re.I)
    if exp_m:
        try:
            draft["experience_years"] = int(float(exp_m[0]))
        except Exception:
            pass

    # 4. Gap extraction or Skip
    if "skip" in msg_lower or "no gap" in msg_lower or "no break" in msg_lower or "0 gap" in msg_lower:
        draft["career_gap_years"] = 0.0
    else:
        gap_m = re.findall(r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?|yr)?\s*(?:gap|break)", user_msg, re.I)
        if gap_m:
            try:
                draft["career_gap_years"] = float(gap_m[0])
            except Exception:
                pass

    # 5. City extraction
    for c in ["Pune", "Bengaluru", "Lucknow", "Noida", "Mohali", "Mumbai", "Hyderabad", "Delhi", "Gurugram", "Chennai", "Jaipur", "Ahmedabad", "Kolkata", "Chandigarh"]:
        if c.lower() in msg_lower:
            draft["city"] = c
            break

    # 6. Target role extraction
    for tr in [
        "GenAI Engineer",
        "Logistics Tech Analyst",
        "Automation QA / SDET",
        "AI Chatbot Trainer / Product Analyst",
        "AI Chatbot Trainer",
        "Software Engineer",
        "ML Engineer",
        "Data Analyst",
        "DevOps Engineer",
        "Full Stack Developer",
    ]:
        if tr.lower() in msg_lower or (len(tr.split()) > 1 and all(w.lower() in msg_lower for w in tr.split()[:2])):
            draft["target_role"] = tr
            break

    # 7. Skills extraction from comma or "and" separated lists
    if "," in user_msg or " and " in user_msg or (len(user_msg.split()) >= 2 and any(k in msg_lower for k in ["testing", "sql", "java", "python", "jira", "selenium", "react", "html", "aws", "docker"])):
        raw_items = re.split(r"[,/|;]|\band\b", user_msg)
        potential_skills = [
            item.strip().title()
            for item in raw_items
            if item.strip() and len(item.strip()) > 1 and not any(w in item.lower() for w in ["i am", "my name", "years", "from", "in ", "worked", "working", "want to", "target", "role"])
        ]
        if potential_skills:
            existing = draft.get("skills_raw", [])
            draft["skills_raw"] = list(dict.fromkeys(existing + potential_skills))

    # Re-classify segment based on extracted info
    session["segment"] = _classify_segment_from_text(
        f"{user_msg} {draft.get('current_role', '')}",
        draft.get("current_role", ""),
        draft.get("career_gap_years", 0.0),
    )
    draft["user_type"] = session["segment"]

    missing = _get_missing_fields(draft)

    # If turn >= 4 or all key fields are filled -> finish
    if turn >= 4 or len(missing) == 0 or "skip" in msg_lower:
        session["done"] = True
        return OnboardingChatResponse(
            reply=(
                f"Thank you, {draft.get('name') or 'Candidate'}! I have gathered your career profile "
                f"for the **{session['segment'].replace('_', ' ').title()}** track. "
                "Review and edit your live profile card on the side, then confirm to generate your AI Disruption & Career Roadmap."
            ),
            quick_replies=["Review & Save Profile", "Looks Great! Let's Go"],
            profile_draft=draft,
            missing_fields=[],
            segment=session["segment"],
            done=True,
        )

    # Turn-by-turn guided questions
    if "name" in missing or "current_role" in missing:
        return OnboardingChatResponse(
            reply="Welcome to Punarshuru! To calibrate your AI career transition, what is your **name** and current (or most recent) **role**?",
            quick_replies=[
                "Priya Sharma (Java Developer)",
                "Ramesh Kumar (Swiggy Delivery)",
                "Arjun Mehta (Manual QA Tester)",
                "Sneha Patel (Customer Support)",
                "Rohit Singh (Final Year Student)",
            ],
            profile_draft=draft,
            missing_fields=missing,
            segment=session["segment"],
            done=False,
        )

    if "skills" in missing:
        return OnboardingChatResponse(
            reply=f"Great to meet you, {draft.get('name', 'there')}! What are your **top 3 to 5 core technical or operational skills**?",
            quick_replies=[
                "Java, Spring Boot, MySQL, REST APIs, Git",
                "Delivery Operations, Route Navigation, Hindi, Customer Service",
                "Manual Testing, JIRA, Agile, SQL, Bug Reporting",
                "Customer Support, CRM, Zendesk, Excel, Communication",
                "Python, C++, Data Structures, Algorithms, SQL",
            ],
            profile_draft=draft,
            missing_fields=missing,
            segment=session["segment"],
            done=False,
        )

    if "target_role" in missing or "city" in missing:
        return OnboardingChatResponse(
            reply="Understood. What **target role or career direction** are you aiming for next, and in which **city**?",
            quick_replies=[
                "GenAI Engineer in Pune",
                "Logistics Tech Analyst in Lucknow",
                "Automation QA / SDET in Bengaluru",
                "AI Chatbot Trainer in Noida",
                "ML Engineer in Mohali",
            ],
            profile_draft=draft,
            missing_fields=missing,
            segment=session["segment"],
            done=False,
        )

    # Optional gap question if not asked yet
    if draft.get("career_gap_years") is None or draft.get("career_gap_years") == 0.0:
        return OnboardingChatResponse(
            reply="Have you taken any **career break or gap years**? (Optional — helps tailor your disruption resilience index)",
            quick_replies=["No career gap", "1-2 years gap", "3-5 years break", "Skip"],
            profile_draft=draft,
            missing_fields=missing,
            segment=session["segment"],
            done=False,
        )

    # Complete if reached here
    session["done"] = True
    return OnboardingChatResponse(
        reply=f"Awesome, {draft.get('name')}! Your profile details are fully aligned. Click below to review your live profile and generate your transition roadmap.",
        quick_replies=["Review & Save Profile", "Proceed to Dashboard"],
        profile_draft=draft,
        missing_fields=[],
        segment=session["segment"],
        done=True,
    )


async def handle_onboarding_chat(
    session_id: str,
    message: str = "",
    resume_text: str | None = None,
) -> OnboardingChatResponse:
    """
    Unified conversational onboarding agent.
    - Resume-first parsing if resume provided
    - Conversational AI extraction via llm.py (JSON output in en/hi/Hinglish)
    - Max 4 follow-up turns
    - Deterministic rule-based fallback
    """
    session = _get_or_create_session(session_id)
    draft = session["profile_draft"]

    # 1. If resume text is submitted (drag-dropped or pasted at start)
    if resume_text and len(resume_text.strip()) > 15:
        parsed = await parse_resume_text(resume_text)
        draft["name"] = parsed.name or draft["name"] or "Candidate"
        draft["email"] = parsed.email or draft["email"]
        draft["city"] = parsed.city or draft["city"] or "Bengaluru"
        draft["current_role"] = parsed.current_role or draft["current_role"] or "Professional"
        draft["target_role"] = parsed.target_role or draft["target_role"] or "Software Engineer"
        draft["experience_years"] = parsed.experience_years or draft["experience_years"]
        draft["career_gap_years"] = parsed.career_gap_years or draft["career_gap_years"]
        draft["skills_raw"] = parsed.skills if parsed.skills else draft["skills_raw"]
        draft["resume_text"] = resume_text

        session["segment"] = _classify_segment_from_text(
            resume_text, draft["current_role"], draft["career_gap_years"]
        )
        draft["user_type"] = session["segment"]

        missing = _get_missing_fields(draft)
        session["turn_count"] = 1

        reply = (
            f"Namaste {draft['name']}! I've analyzed your resume and pre-filled your **{session['segment'].replace('_', ' ').title()}** profile. "
            f"Identified {len(draft['skills_raw'])} skills including {', '.join(draft['skills_raw'][:4])}. "
        )
        if missing:
            reply += f"Could you specify your preferred **{missing[0].replace('_', ' ')}**?"
            quick_replies = ["GenAI Engineer", "Automation QA", "Logistics Tech Analyst", "Looks Good!"]
        else:
            reply += "Everything looks great. What target role would you like to build a roadmap for?"
            quick_replies = ["GenAI Engineer", "Full Stack Developer", "Data Analyst", "Confirm Profile"]

        return OnboardingChatResponse(
            reply=reply,
            quick_replies=quick_replies,
            profile_draft=draft,
            missing_fields=missing,
            segment=session["segment"],
            done=False,
        )

    # 2. Process user text turn
    session["turn_count"] += 1

    # Check if user clicked final action or max 4 turns reached
    if "save" in message.lower() or "confirm" in message.lower() or "proceed" in message.lower() or session["turn_count"] >= 5:
        session["done"] = True
        return OnboardingChatResponse(
            reply=f"Profile finalized for **{draft.get('name') or 'Candidate'}**! Ready to launch your career disruption analysis.",
            quick_replies=["Generate My Disruption Audit"],
            profile_draft=draft,
            missing_fields=[],
            segment=session["segment"],
            done=True,
        )

    # Try LLM Conversational Agent
    prompt = (
        "You are the friendly, empathetic, and intelligent Punarshuru AI Career Onboarding Agent for Bharat. "
        "Your job is to conversationalize onboarding for Indian professionals, gig workers, returners, laid-off tech workers, and students. "
        "CRITICAL LANGUAGE RULE: Respond in the EXACT language and dialect used by the user. If the user talks in Hindi (Devanagari), reply in Hindi. "
        "If the user speaks/writes in Hinglish (Roman Hindi/English blend like 'Mujhe GenAI roadmap chahiye'), reply in Hinglish. "
        "If the user speaks in English, reply in English. Keep tone encouraging, practical, and clear.\n"
        f"Current turn: {session['turn_count']} / 4.\n"
        f"Existing profile draft: {json.dumps(draft)}\n"
        f"User message: \"{message}\"\n\n"
        "Extract any candidate information provided (name, current_role, target_role, city, experience_years, career_gap_years, skills_raw) "
        "and classify user into one of: 'returner', 'gig', 'laid_off', 'stagnant', 'student'. "
        "Respond ONLY with valid JSON matching this schema:\n"
        "{\n"
        '  "reply": string,\n'
        '  "quick_replies": [string],\n'
        '  "extracted_fields": {\n'
        '    "name": string | null,\n'
        '    "current_role": string | null,\n'
        '    "target_role": string | null,\n'
        '    "city": string | null,\n'
        '    "experience_years": number | null,\n'
        '    "career_gap_years": number | null,\n'
        '    "skills_raw": [string] | null\n'
        "  },\n"
        '  "detected_segment": "returner" | "gig" | "laid_off" | "stagnant" | "student",\n'
        '  "done": boolean\n'
        "}"
    )

    try:
        data = await complete(prompt, json=True)
        if isinstance(data, dict) and data.get("reply"):
            ext = data.get("extracted_fields") or {}
            for k, v in ext.items():
                if v is not None and v != "":
                    if k == "skills_raw" and isinstance(v, list):
                        draft["skills_raw"] = list(dict.fromkeys(draft.get("skills_raw", []) + v))
                    else:
                        draft[k] = v

            if data.get("detected_segment") in SEGMENTS:
                session["segment"] = data["detected_segment"]
                draft["user_type"] = session["segment"]

            is_done = bool(data.get("done") or session["turn_count"] >= 4)
            session["done"] = is_done
            missing = _get_missing_fields(draft)

            return OnboardingChatResponse(
                reply=str(data["reply"]),
                quick_replies=data.get("quick_replies", ["Continue", "Skip", "Looks Great"]),
                profile_draft=draft,
                missing_fields=missing,
                segment=session["segment"],
                done=is_done,
            )
    except Exception:
        pass

    # Fallback to deterministic rule-based flow
    return _rule_based_turn(session, message)
