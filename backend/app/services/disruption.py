import json
from pathlib import Path
from typing import Any
from app.models.profile import Profile
from app.schemas.disruption import DisruptionBreakdown, DisruptionResponse

DATA_DIR = Path(__file__).parent.parent / "data"


def _load_json(filename: str) -> Any:
    path = DATA_DIR / filename
    if path.exists():
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return []


def calculate_disruption_score(profile: Profile | dict) -> DisruptionResponse:
    """
    Calculate Disruption Score (0-100) per SPEC:
    score = skill_decay + automation_risk + career_gap + stagnation + market_mismatch
    Returns breakdown with 1-line reason each, top risks, strengths.
    """
    if isinstance(profile, dict):
        user_type = profile.get("user_type", "stagnant")
        career_gap_years = float(profile.get("career_gap_years", 0.0) or 0.0)
        experience_years = int(profile.get("experience_years", 0) or 0)
        current_role = profile.get("current_role", "") or ""
        target_role = profile.get("target_role", "") or ""
        skills_raw = profile.get("skills_raw", []) or []
        skills_tax_ids = profile.get("skills_taxonomy_ids", []) or []
        profile_id = str(profile.get("id", "temp-id"))
    else:
        user_type = profile.user_type.value if hasattr(profile.user_type, "value") else str(profile.user_type)
        career_gap_years = float(profile.career_gap_years or 0.0)
        experience_years = int(profile.experience_years or 0)
        current_role = profile.current_role or ""
        target_role = profile.target_role or ""
        skills_raw = profile.skills_raw or []
        skills_tax_ids = profile.skills_taxonomy_ids or []
        profile_id = str(profile.id)

    taxonomy = _load_json("skills_taxonomy.json")
    tax_by_id = {s["id"]: s for s in taxonomy}
    tax_by_name = {s["name"].lower(): s for s in taxonomy}

    # Find matched taxonomy items
    matched_skills = []
    for sid in skills_tax_ids:
        if sid in tax_by_id:
            matched_skills.append(tax_by_id[sid])
    for s_name in skills_raw:
        s_lower = s_name.lower()
        if s_lower in tax_by_name and tax_by_name[s_lower] not in matched_skills:
            matched_skills.append(tax_by_name[s_lower])

    # 1. Career Gap Score (0-20)
    gap_score = min(20.0, career_gap_years * 5.0)
    if gap_score > 0:
        gap_reason = f"{career_gap_years:.1f} year career gap creates hiring friction and potential skill disconnect"
    else:
        gap_reason = "No career gap detected; continuous work record"

    # 2. Skill Decay Score (0-25)
    # If skills are declining or user had gap, decay is higher
    declining_count = sum(1 for s in matched_skills if s.get("demand_trend") == "declining")
    stable_count = sum(1 for s in matched_skills if s.get("demand_trend") == "stable")
    rising_count = sum(1 for s in matched_skills if s.get("demand_trend") == "rising")
    
    decay_base = (career_gap_years * 4.0) + (declining_count * 5.0) + (stable_count * 1.5) - (rising_count * 2.0)
    decay_score = max(0.0, min(25.0, decay_base))
    if user_type == "returner" and decay_score < 15:
        decay_score = min(25.0, decay_score + 10.0)
    if decay_score >= 15:
        decay_reason = "Older frameworks and tools have evolved significantly during inactive periods"
    elif decay_score >= 5:
        decay_reason = "Some legacy skills present, but foundation remains functional"
    else:
        decay_reason = "Active, modern skills with minimal technological obsolescence"

    # 3. Automation Risk (0-35)
    role_lower = current_role.lower()
    high_auto_roles = ["manual qa", "qa tester", "delivery", "driver", "data entry", "customer support", "bpo", "telecaller"]
    role_auto_risk = 0.0
    for r in high_auto_roles:
        if r in role_lower:
            role_auto_risk = 30.0
            break
    
    if matched_skills:
        avg_skill_auto = sum(s.get("automation_risk", 20) for s in matched_skills) / len(matched_skills)
        auto_score = min(35.0, max(role_auto_risk, (avg_skill_auto * 0.7) + (role_auto_risk * 0.3)))
    else:
        auto_score = min(35.0, role_auto_risk if role_auto_risk > 0 else 15.0)

    if user_type in ["laid_off", "gig"] and auto_score < 25:
        auto_score = 35.0 if "qa" in role_lower or "delivery" in role_lower else 28.0

    if auto_score >= 25:
        auto_reason = f"High exposure to GenAI / autonomous automation in '{current_role or 'current role'}'"
    elif auto_score >= 15:
        auto_reason = "Moderate automation exposure; workflow assistance tools augmenting standard tasks"
    else:
        auto_reason = "Low automation vulnerability with high cognitive or creative demands"

    # 4. Stagnation (0-25)
    if user_type == "stagnant":
        stag_score = 25.0
        stag_reason = "Extended tenure in identical role without promotion or salary trajectory upgrade"
    elif user_type == "gig":
        stag_score = 25.0
        stag_reason = "Platform algorithm caps income with limited career ladder progression"
    elif user_type == "laid_off":
        stag_score = 20.0
        stag_reason = "Abrupt role termination highlights urgent need to diversify capabilities"
    elif user_type == "student":
        stag_score = 5.0
        stag_reason = "Fresher profile with zero industry lock-in"
    else:
        stag_score = min(20.0, max(0.0, (experience_years - 2) * 2.0))
        stag_reason = f"{experience_years} years in current domain; upward mobility requires skill refresh"

    # 5. Market Mismatch (0-20)
    mismatch_score = 5.0
    if target_role and target_role.lower() != current_role.lower():
        mismatch_score = 12.0
        if "genai" in target_role.lower() or "ml" in target_role.lower() or "ai" in target_role.lower():
            if not any("ai" in s.get("category", "").lower() or "ml" in s.get("name", "").lower() for s in matched_skills):
                mismatch_score = 18.0
    if user_type == "gig":
        mismatch_score = 20.0
    mismatch_reason = f"Gap between current background ({current_role or 'General'}) and target domain ({target_role or 'Modern Tech'})"

    total_score = round(min(100.0, decay_score + auto_score + gap_score + stag_score + mismatch_score), 1)

    # Top risks & strengths
    top_risks = []
    strengths = []

    if auto_score >= 25:
        top_risks.append(f"Automation pressure on {current_role or 'routine tasks'}")
    if gap_score >= 10:
        top_risks.append(f"{career_gap_years:.1f}-year career gap demands demonstrative project proof")
    if decay_score >= 15:
        top_risks.append("Rapidly deprecating toolchain and legacy framework reliance")
    if stag_score >= 20:
        top_risks.append("Role lock-in and plateauing compensation trajectory")
    if not top_risks:
        top_risks.append("Increasing competition from GenAI-native professionals")

    if rising_count > 0:
        strengths.append(f"Hands-on familiarity with in-demand skills: {', '.join(s['name'] for s in matched_skills if s.get('demand_trend') == 'rising')[:60]}")
    if experience_years > 0:
        strengths.append(f"{experience_years}+ years of problem solving and professional domain maturity")
    if user_type == "returner":
        strengths.append("Strong foundational engineering discipline and rapid relearning potential")
    elif user_type == "gig":
        strengths.append("High resilience, operational grit, and real-time navigation intelligence")
    elif user_type == "student":
        strengths.append("High agility, modern curriculum exposure, and fresh adaptability")
    else:
        strengths.append("Solid baseline tech fundamentals and domain awareness")

    risk_level = "High" if total_score >= 60 else ("Moderate" if total_score >= 30 else "Low")
    summary = f"Disruption Index: {total_score}/100 ({risk_level} Risk). Main driving factor: {top_risks[0] if top_risks else 'Market shifts'}."

    breakdown = DisruptionBreakdown(
        skill_decay=round(decay_score, 1),
        automation_risk=round(auto_score, 1),
        career_gap=round(gap_score, 1),
        stagnation=round(stag_score, 1),
        market_mismatch=round(mismatch_score, 1),
        reasons={
            "skill_decay": decay_reason,
            "automation_risk": auto_reason,
            "career_gap": gap_reason,
            "stagnation": stag_reason,
            "market_mismatch": mismatch_reason,
        },
        top_risks=top_risks[:3],
        strengths=strengths[:3],
    )

    return DisruptionResponse(
        profile_id=profile_id,
        score=total_score,
        risk_level=risk_level,
        summary=summary,
        breakdown=breakdown,
    )
