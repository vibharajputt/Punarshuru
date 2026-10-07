import logging
from typing import Any
from fastapi import APIRouter
from pydantic import BaseModel
from app.services import llm

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Copilot"])


class CopilotChatRequest(BaseModel):
    message: str
    profile: dict[str, Any] | None = None
    history: list[dict[str, Any]] | None = None


class CopilotChatResponse(BaseModel):
    reply: str
    actions: list[str] = []
    quick_replies: list[str] = []


def _generate_contextual_fallback(
    message: str, profile: dict[str, Any] | None
) -> CopilotChatResponse:
    p = profile or {}
    name = p.get("name", "Candidate")
    city = p.get("city", "Bengaluru")
    current_role = p.get("current_role", "Software Professional")
    target_role = p.get("target_role", "GenAI Engineer")
    skills = p.get("skills_raw") or ["Problem Solving", "Core Tech", "Communication"]
    skills_str = ", ".join(skills[:4])
    salary = p.get("current_salary_lpa")
    user_type = p.get("user_type", "returner")

    lower = message.lower()

    if any(k in lower for k in ["salary", "pay", "underpaid", "compensation", "earn", "ctc"]):
        from app.services.salary_ml import predict_salary
        exp_val = float(p.get("experience_years") or 3.0)
        ml_res = predict_salary(
            role=target_role or current_role,
            experience_years=exp_val,
            skills=skills if isinstance(skills, list) else [],
            city=city,
        )
        pred_lpa = ml_res["predicted_salary_lpa"]
        min_lpa = ml_res["salary_min_lpa"]
        max_lpa = ml_res["salary_max_lpa"]
        bracket = ml_res["salary_bracket"]
        pct = ml_res["percentile"]
        
        return CopilotChatResponse(
            reply=f"Here is your ML-verified compensation diagnostic for {target_role or current_role} in {city} (based on 15,841 real Indian job postings):",
            actions=[
                f"ML Predicted Compensation: ₹{pred_lpa} LPA (Expected bracket: ₹{min_lpa}–{max_lpa} LPA, {bracket}).",
                f"Market Standing: At ₹{pred_lpa} LPA, you rank in the top {round(100 - pct, 1)}% of tech earners in {city}.",
                f"Immediate Leverage: Adding modern AI workflows to your existing skills ({skills_str}) commands a 30–40% premium.",
            ],
            quick_replies=[
                "What adjacent roles can I target?",
                "What should I learn this month?",
                "How to prepare for tech interviews?",
            ],
        )


    if any(k in lower for k in ["adjacent", "role", "switch", "pivot", "career change", "target"]):
        if user_type == "laid_off" or "qa" in current_role.lower():
            role_suggestions = [
                "1. Automation QA / SDET (Master Playwright & CI/CD)",
                "2. QA Ops / Release Engineer (Docker & GitHub Actions)",
                "3. API Test Automation Lead (Postman, RestAssured & Python)",
            ]
        elif user_type == "gig" or "delivery" in current_role.lower() or "swiggy" in current_role.lower():
            role_suggestions = [
                "1. Logistics Tech Operations Lead (Route & Dispatch Optimization)",
                "2. Supply Chain Data Specialist (SQL & Warehouse Tech)",
                "3. Customer Experience Operations Associate (B2B SaaS / D2C)",
            ]
        elif user_type == "stagnant" or "support" in current_role.lower():
            role_suggestions = [
                "1. AI Chatbot Operations / Trainer (Prompt Eval & LLM Tuning)",
                "2. Product Operations Associate (Customer telemetry & Jira workflows)",
                "3. Tier-2 Technical Account Manager (SaaS integrations & API triage)",
            ]
        elif user_type == "student":
            role_suggestions = [
                "1. Junior Software / ML Engineer (Python, FastEmbed, LangChain)",
                "2. Full Stack Developer (Next.js, FastAPI, PostgreSQL)",
                "3. Cloud DevOps Intern (Docker, Linux & AWS fundamentals)",
            ]
        else:
            role_suggestions = [
                f"1. {target_role} (Leverage your {skills_str} base)",
                "2. Cloud Backend Architect (Spring Boot 3 / Microservices)",
                "3. Technical Product Specialist (Bridge engineering & domain ops)",
            ]

        return CopilotChatResponse(
            reply=f"Based on your profile as {current_role}, here are your highest-velocity adjacent career pathways:",
            actions=role_suggestions,
            quick_replies=[
                "Am I underpaid for my experience?",
                "What should I learn this month?",
                "How to bridge my skill gap?",
            ],
        )

    if any(k in lower for k in ["learn", "month", "30 days", "roadmap", "study", "skills", "upskill"]):
        return CopilotChatResponse(
            reply=f"Here is your focused 30-day sprint plan to bridge toward {target_role}:",
            actions=[
                "Week 1: Audit foundations & modernize syntax (Python 3.12 / Modern Java 21)",
                "Week 2: Build REST / FastAPI endpoints with Docker containerization",
                "Week 3: Integrate Vector Embeddings, RAG or modern SDET automation pipelines",
                "Week 4: Publish 1 production GitHub repo with live demo URL and verifiable readme",
            ],
            quick_replies=[
                "What adjacent roles can I target?",
                "Am I underpaid for my experience?",
                "How can I frame my resume gap?",
            ],
        )

    if any(k in lower for k in ["gap", "resume", "break", "maternity", "rebuild"]):
        return CopilotChatResponse(
            reply=f"Here is how to frame your career timeline for Indian recruiters:",
            actions=[
                "Functional Framing: Highlight technical capabilities and durable problem solving upfront before chronology.",
                "Upskilling Evidence: Explicitly list modern courses, certificates, and GitHub links in a 'Recent Upgrades' section.",
                "Confidence Stance: Frame gaps neutrally in one sentence; anchor the interview on what you built this month.",
            ],
            quick_replies=[
                "What should I learn this month?",
                "What adjacent roles can I target?",
                "Am I underpaid for my experience?",
            ],
        )

    # Default thoughtful advisory response
    return CopilotChatResponse(
        reply=f"Here is actionable advice tailored to your active profile ({name} · {target_role} in {city}):",
        actions=[
            f"Transferable Strengths: Your background in {skills_str} provides a durable springboard.",
            f"Strategic Target: Focus on {target_role} opportunities with high hiring velocity in {city}.",
            "Verifiable Proof: Completing the Skill Passport gives recruiters cryptographic verification of your abilities.",
        ],
        quick_replies=[
            "What adjacent roles can I target?",
            "Am I underpaid for my experience?",
            "What should I learn this month?",
        ],
    )


@router.post("/copilot/chat", response_model=CopilotChatResponse)
async def copilot_chat(req: CopilotChatRequest) -> CopilotChatResponse:
    """Intelligent conversational career copilot endpoint."""
    user_msg = req.message.strip()
    p = req.profile or {}
    
    # Query ML salary model for ground-truth compensation benchmarks
    from app.services.salary_ml import predict_salary
    try:
        ml_bench = predict_salary(
            role=p.get('target_role') or p.get('current_role') or 'Software Engineer',
            experience_years=float(p.get('experience_years') or 3.0),
            skills=p.get('skills_raw') or [],
            city=p.get('city') or 'Bengaluru',
        )
        ml_context = f"ML Predicted Market Compensation: ₹{ml_bench['predicted_salary_lpa']} LPA (Range: ₹{ml_bench['salary_min_lpa']}-{ml_bench['salary_max_lpa']} LPA, {ml_bench['salary_bracket']}, percentile {ml_bench['percentile']}%)"
    except Exception:
        ml_context = "ML Predicted Compensation: Market standard"

    # Build prompt for LLM
    prompt = f"""You are the Punarshuru AI Career Copilot, an elite career intelligence advisor for Indian professionals in Bharat 2.0.
Candidate Profile:
- Name: {p.get('name', 'Candidate')}
- Current Role: {p.get('current_role', 'Professional')}
- Target Role: {p.get('target_role', 'Advanced Role')}
- City: {p.get('city', 'India')}
- Experience: {p.get('experience_years', 'N/A')} years
- Current Salary: ₹{p.get('current_salary_lpa', 'N/A')} LPA
- Skills: {p.get('skills_raw', [])}
- Disruption Score: {p.get('disruption_score', 65)}/100
- Grounded ML Salary Intelligence: {ml_context}

User message: "{user_msg}"


Respond with ONLY valid JSON with this exact schema:
{{
  "reply": "Clear, direct, motivating advice (1-2 sentences)",
  "actions": ["Actionable bullet 1", "Actionable bullet 2", "Actionable bullet 3"],
  "quick_replies": ["Short follow-up 1", "Short follow-up 2", "Short follow-up 3"]
}}
"""
    try:
        data = await llm.complete(prompt, json=True)
        if isinstance(data, dict) and data.get("reply") and isinstance(data.get("actions"), list):
            return CopilotChatResponse(
                reply=str(data["reply"]),
                actions=[str(a) for a in data["actions"]],
                quick_replies=[str(q) for q in data.get("quick_replies", [])][:3]
                or [
                    "What adjacent roles can I target?",
                    "Am I underpaid for my experience?",
                    "What should I learn this month?",
                ],
            )
    except Exception as e:
        logger.warning(f"Copilot LLM execution failed or returned invalid format: {e}")

    return _generate_contextual_fallback(user_msg, p)
