import json
from pathlib import Path
from typing import Any
from rapidfuzz import fuzz
from app.models.profile import Profile
from app.schemas.gap import SkillGapResponse, PartialSkill, CategoryRadar

DATA_DIR = Path(__file__).parent.parent / "data"


def _load_json(filename: str) -> Any:
    path = DATA_DIR / filename
    if path.exists():
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return []


def analyze_skill_gap(profile: Profile | dict, target_role: str | None = None) -> SkillGapResponse:
    """
    Skill Gap Engine:
    - Extracts target role required skills from jobs snapshot frequency
    - Matches user skills: exact (have), fuzzy/partial (>=75%), missing
    - Computes match_pct and category radar breakdown
    """
    if isinstance(profile, dict):
        profile_id = str(profile.get("id", "temp-id"))
        p_target = profile.get("target_role") or "Software Engineer"
        skills_raw = profile.get("skills_raw", []) or []
    else:
        profile_id = str(profile.id)
        p_target = profile.target_role or "Software Engineer"
        skills_raw = profile.skills_raw or []

    role_to_assess = (target_role or p_target).strip()

    jobs = _load_json("jobs_snapshot.json")
    taxonomy = _load_json("skills_taxonomy.json")

    # Map skill name to category & aliases
    tax_cat_map: dict[str, str] = {}
    alias_map: dict[str, str] = {}
    for item in taxonomy:
        name = item["name"]
        cat = item.get("category", "General")
        tax_cat_map[name.lower()] = cat
        for alias in item.get("aliases", []):
            alias_map[alias.lower()] = name

    # 1. Find jobs matching target role
    matched_jobs = []
    role_lower = role_to_assess.lower()
    for job in jobs:
        title_lower = job["title"].lower()
        if role_lower in title_lower or any(word in title_lower for word in role_lower.split() if len(word) > 2):
            matched_jobs.append(job)

    if not matched_jobs:
        # Fallback to all tech jobs or general role
        matched_jobs = jobs[:10]

    # Calculate skill frequency in matched jobs
    skill_freq: dict[str, int] = {}
    for job in matched_jobs:
        for skill in job.get("required_skills", []):
            skill_freq[skill] = skill_freq.get(skill, 0) + 1

    # Sort required skills by frequency and pick top 6-10
    sorted_skills = sorted(skill_freq.keys(), key=lambda s: skill_freq[s], reverse=True)
    role_required_skills = sorted_skills[:8] if sorted_skills else ["Python", "SQL", "Git", "REST APIs", "Docker"]

    user_skills_clean = [s.strip() for s in skills_raw if s and s.strip()]
    user_skills_lower = {s.lower(): s for s in user_skills_clean}

    have_skills: list[str] = []
    partial_skills: list[PartialSkill] = []
    missing_skills: list[str] = []

    for req in role_required_skills:
        req_lower = req.lower()
        # Check exact
        if req_lower in user_skills_lower:
            have_skills.append(req)
            continue
        
        # Check aliases
        matched_alias = False
        for user_s, original in user_skills_lower.items():
            if alias_map.get(user_s) == req or alias_map.get(req_lower) == original:
                have_skills.append(req)
                matched_alias = True
                break
        if matched_alias:
            continue

        # Check fuzzy match
        best_score = 0.0
        best_match_skill = ""
        for user_s, orig_user in user_skills_lower.items():
            score = fuzz.token_sort_ratio(req_lower, user_s) / 100.0
            if score > best_score:
                best_score = score
                best_match_skill = orig_user

        if best_score >= 0.75:
            partial_skills.append(
                PartialSkill(
                    skill=req,
                    matched_with=best_match_skill,
                    similarity=round(best_score, 2),
                )
            )
        else:
            missing_skills.append(req)

    total_req = len(role_required_skills)
    match_pct = round(((len(have_skills) * 1.0 + len(partial_skills) * 0.5) / max(1, total_req)) * 100, 1)

    # Radar breakdown by category
    categories_tracker: dict[str, dict[str, int]] = {}
    for req in role_required_skills:
        cat = tax_cat_map.get(req.lower(), "Technical")
        if cat not in categories_tracker:
            categories_tracker[cat] = {"have": 0, "required": 0}
        categories_tracker[cat]["required"] += 1
        if req in have_skills:
            categories_tracker[cat]["have"] += 1
        elif any(p.skill == req for p in partial_skills):
            categories_tracker[cat]["have"] += 1  # count partial as half or round

    radar: list[CategoryRadar] = []
    for cat, stats in categories_tracker.items():
        pct = round((stats["have"] / max(1, stats["required"])) * 100, 1)
        radar.append(CategoryRadar(category=cat, have=stats["have"], required=stats["required"], pct=pct))

    recommended_focus = missing_skills[:4]

    return SkillGapResponse(
        profile_id=profile_id,
        target_role=role_to_assess,
        match_pct=match_pct,
        have_skills=have_skills,
        partial_skills=partial_skills,
        missing_skills=missing_skills,
        radar=radar,
        role_required_skills=role_required_skills,
        recommended_focus_areas=recommended_focus,
    )
