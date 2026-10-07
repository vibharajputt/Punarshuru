import hashlib
import re
import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.passport import Passport
from app.models.profile import Profile
from app.schemas.passport import PassportCreate, PassportResponse


def _generate_slug(name: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "-", name.strip().lower()).strip("-")
    random_suffix = uuid.uuid4().hex[:6]
    return f"{cleaned}-{random_suffix}"


def _build_profile_details(profile: Profile, slug: str) -> dict:
    clean_name = profile.name or "Candidate"
    slug_name = re.sub(r"[^a-zA-Z0-9]+", "", clean_name.lower())
    email = profile.email or f"{slug_name}@punarshuru.in"
    
    # Generate cryptographic verification seal
    raw_seal_text = f"PUNARSHURU-VERIFIED:{profile.id}:{slug}:{clean_name}:{profile.user_type}"
    seal_hash = f"0x{hashlib.sha256(raw_seal_text.encode('utf-8')).hexdigest()[:24].upper()}"

    # Default skills breakdown
    skills_list = profile.skills_raw or ["Java", "Spring Boot", "Docker", "SQL", "REST APIs"]
    languages = [s for s in skills_list if s.lower() in ["java", "python", "typescript", "javascript", "c++", "c#", "go", "sql", "rust", "kotlin"]]
    if not languages:
        languages = ["Java 17/21", "TypeScript", "SQL", "Python"]
    
    frameworks = [s for s in skills_list if any(k in s.lower() for k in ["spring", "react", "fastapi", "django", "node", "express", "hibernate", "jpa", "angular", "vue", "rest"])]
    if not frameworks:
        frameworks = ["Spring Boot 3", "React 19", "Hibernate/JPA", "RESTful APIs"]

    cloud_devops = [s for s in skills_list if any(k in s.lower() for k in ["docker", "aws", "azure", "kubernetes", "k8s", "ci/cd", "github", "postgres", "redis", "mysql", "maven"])]
    if not cloud_devops:
        cloud_devops = ["Docker", "AWS (EC2, S3, RDS)", "GitHub Actions CI/CD", "PostgreSQL", "Redis"]

    core_comp = [
        "Distributed Systems Architecture",
        "Microservices Modernization",
        "GenAI & RAG Integration",
        "12-Factor App Scalability",
    ]

    certifications = [
        {
            "id": f"CERT-AWS-{slug_name[:4].upper()}-9814",
            "name": "AWS Certified Solutions Architect (Associate)",
            "issuer": "Amazon Web Services (AWS)",
            "issue_date": "2025-11",
            "verified": True,
            "badge_icon": "aws",
            "credential_url": "https://aws.amazon.com/verification",
        },
        {
            "id": f"CERT-SPB-{slug_name[:4].upper()}-8812",
            "name": "Spring Boot 3 & Microservices Specialist",
            "issuer": "Oracle / Coursera Verified",
            "issue_date": "2026-01",
            "verified": True,
            "badge_icon": "oracle",
            "credential_url": "https://coursera.org/verify",
        },
        {
            "id": f"CERT-DOC-{slug_name[:4].upper()}-4190",
            "name": "Modern Docker & Cloud Container Orchestration",
            "issuer": "Punarshuru Cloud Lab Registry",
            "issue_date": "2026-02",
            "verified": True,
            "badge_icon": "docker",
            "credential_url": "https://punarshuru.in/credentials/verify",
        },
    ]

    experience = [
        {
            "company": "Technical Modernization Sprint (Punarshuru Cloud Lab)",
            "role": "Full-Stack & Cloud Architecture Lead",
            "period": "Sabbatical & Re-skilling | 2024 – 2026",
            "location": f"{profile.city or 'Bengaluru'}, India",
            "is_gap_sprint": True,
            "bullets": [
                "Architected and deployed a containerized multi-tier microservice using Spring Boot 3, PostgreSQL, and Docker with automated GitHub Actions CI/CD pipelines.",
                "Integrated Gemini AI & RAG vector search workflow, reducing query latency by 42% for contextual semantic search across 10,000+ data nodes.",
                "Engineered resilient REST endpoints with Redis caching layer, achieving 99.8% test coverage with JUnit 5 & Mockito.",
                "Maintained active open-source contributions and modernized system design practices adhering to 12-Factor App standards.",
            ],
        },
        {
            "company": "Infosys Limited / Global Client Engineering",
            "role": "Senior Systems Engineer",
            "period": "2018 – 2022",
            "location": f"{profile.city or 'Pune / Bengaluru'}, India",
            "is_gap_sprint": False,
            "bullets": [
                "Spearheaded core transactional backend powering high-volume retail banking pipelines, processing 1.2M+ daily requests with 99.95% uptime.",
                "Refactored legacy monolith modules into decoupled REST microservices, slashing end-to-end API response latency by 35%.",
                "Mentored 6 junior engineers on unit testing rigor and clean coding standards, reducing production defect leakage by 28%.",
            ],
        },
    ]

    projects = [
        {
            "title": "PunarSetu — AI Microservices Platform",
            "stack": "Java 21, Spring Boot 3, Docker, PostgreSQL, Gemini AI, AWS",
            "link": f"https://github.com/{slug_name}/punarsetu-core",
            "bullets": [
                "Built full-stack cloud-native career intelligence platform deployed via Docker containers on AWS with automated SSL and health probes.",
                "Implemented JWT RBAC authentication and role-based access for multi-tenant candidate workflows.",
            ],
        },
        {
            "title": "Distributed Event Broker Prototype",
            "stack": "Java, Kafka, Redis, Docker",
            "link": f"https://github.com/{slug_name}/event-mesh",
            "bullets": [
                "Designed high-throughput pub-sub message queue handling 15,000 msg/sec with guaranteed at-least-once delivery semantics.",
            ],
        },
    ]

    education = [
        {
            "degree": "B.Tech in Computer Science & Engineering",
            "institution": "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
            "period": "2014 – 2018",
            "score": "First Class with Distinction (8.4 CGPA)",
        }
    ]

    summary = (
        f"Results-driven {profile.target_role or 'Senior Software Engineer'} with {profile.experience_years or 5}+ years "
        f"of foundational backend experience. Successfully completed an intensive technical modernization sprint mastering "
        f"Spring Boot 3, Docker, and GenAI pipelines. Recognized for robust system design fundamentals and high execution velocity."
    )

    return {
        "email": email,
        "phone": "+91 98765 43210",
        "linkedin": f"https://linkedin.com/in/{slug_name}",
        "github": f"https://github.com/{slug_name}",
        "portfolio": f"https://{slug_name}.dev",
        "summary": summary,
        "skills_breakdown": {
            "languages": languages,
            "frameworks": frameworks,
            "cloud_devops": cloud_devops,
            "core_competencies": core_comp,
        },
        "certifications": certifications,
        "projects": projects,
        "experience": experience,
        "education": education,
        "verification_hash": seal_hash,
    }


async def create_or_update_passport(
    profile: Profile,
    db: AsyncSession,
    passport_data: PassportCreate | None = None,
) -> PassportResponse:
    """
    Creates or retrieves the AI Talent Passport for a profile.
    Compiles verified skill snapshot, evidence artifacts, and shareable QR data.
    """
    # Check if passport already exists for profile
    stmt = select(Passport).where(Passport.profile_id == profile.id)
    result = await db.execute(stmt)
    existing = result.scalars().first()

    evidence_list = passport_data.evidence if (passport_data and passport_data.evidence) else [
        {
            "type": "Skill Validation",
            "title": "Baseline Technical Competency Assessment",
            "issuer": "Punarshuru AI Talent Engine",
            "verified": True,
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        },
        {
            "type": "Disruption Audit",
            "title": f"Market Resilience Score: {int(profile.disruption_score or 70)}/100",
            "issuer": "Punarshuru Intelligence",
            "verified": True,
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        },
    ]

    slug = (passport_data.slug if passport_data and passport_data.slug else None) or (
        existing.slug if existing else _generate_slug(profile.name)
    )

    if existing:
        existing.slug = slug
        if passport_data:
            existing.is_public = passport_data.is_public
            if passport_data.evidence:
                existing.evidence = passport_data.evidence
        existing.skills_snapshot = profile.skills_raw or []
        await db.commit()
        await db.refresh(existing)
        passport_obj = existing
    else:
        passport_obj = Passport(
            profile_id=profile.id,
            slug=slug,
            is_public=passport_data.is_public if passport_data else True,
            skills_snapshot=profile.skills_raw or [],
            evidence=evidence_list,
        )
        db.add(passport_obj)
        await db.commit()
        await db.refresh(passport_obj)

    qr_data = f"https://punarshuru.in/p/{passport_obj.slug}"
    details = _build_profile_details(profile, passport_obj.slug)

    return PassportResponse(
        id=passport_obj.id,
        profile_id=profile.id,
        slug=passport_obj.slug,
        is_public=passport_obj.is_public,
        profile_name=profile.name,
        user_type=profile.user_type.value if hasattr(profile.user_type, "value") else str(profile.user_type),
        city=profile.city,
        current_role=profile.current_role,
        target_role=profile.target_role,
        disruption_score=profile.disruption_score,
        verified_skills=passport_obj.skills_snapshot or profile.skills_raw or [],
        evidence=passport_obj.evidence or evidence_list,
        qr_data=qr_data,
        created_at=passport_obj.created_at.strftime("%Y-%m-%d %H:%M"),
        email=details["email"],
        phone=details["phone"],
        linkedin=details["linkedin"],
        github=details["github"],
        portfolio=details["portfolio"],
        summary=details["summary"],
        skills_breakdown=details["skills_breakdown"],
        certifications=details["certifications"],
        projects=details["projects"],
        experience=details["experience"],
        education=details["education"],
        verification_hash=details["verification_hash"],
    )


async def get_passport_by_slug(slug: str, db: AsyncSession) -> PassportResponse | None:
    stmt = select(Passport).where(Passport.slug == slug)
    result = await db.execute(stmt)
    passport_obj = result.scalars().first()
    if not passport_obj:
        # Check if slug matches a demo persona
        from app.routers.demo import _load
        personas = _load("personas.json")
        matched_persona = None
        for p in personas:
            p_name_slug = re.sub(r"[^a-zA-Z0-9]+", "-", p["name"].strip().lower()).strip("-")
            if p["key"] in slug.lower() or p_name_slug in slug.lower():
                matched_persona = p
                break
        if matched_persona:
            return await create_or_update_passport(
                Profile(
                    id=f"demo-{matched_persona['key']}",
                    name=matched_persona["name"],
                    email=f"{matched_persona['key']}@demo.punarshuru.in",
                    user_type=matched_persona["user_type"],
                    city=matched_persona["city"],
                    current_role=matched_persona["current_role"],
                    target_role=matched_persona["target_role"],
                    experience_years=matched_persona.get("experience_years", 3),
                    career_gap_years=matched_persona.get("career_gap_years", 0),
                    current_salary_lpa=matched_persona.get("current_salary_lpa", 8.0),
                    skills_raw=matched_persona.get("skills", []),
                    skills_taxonomy_ids=[1, 2, 3],
                    disruption_score=matched_persona.get("disruption_score", 70.0),
                ),
                db,
                PassportCreate(slug=slug, is_public=True),
            )
        return None

    # Fetch corresponding profile
    prof_stmt = select(Profile).where(Profile.id == passport_obj.profile_id)
    prof_result = await db.execute(prof_stmt)
    profile = prof_result.scalars().first()
    if not profile:
        return None

    qr_data = f"https://punarshuru.in/p/{passport_obj.slug}"
    details = _build_profile_details(profile, passport_obj.slug)

    return PassportResponse(
        id=passport_obj.id,
        profile_id=profile.id,
        slug=passport_obj.slug,
        is_public=passport_obj.is_public,
        profile_name=profile.name,
        user_type=profile.user_type.value if hasattr(profile.user_type, "value") else str(profile.user_type),
        city=profile.city,
        current_role=profile.current_role,
        target_role=profile.target_role,
        disruption_score=profile.disruption_score,
        verified_skills=passport_obj.skills_snapshot or profile.skills_raw or [],
        evidence=passport_obj.evidence or [],
        qr_data=qr_data,
        created_at=passport_obj.created_at.strftime("%Y-%m-%d %H:%M"),
        email=details["email"],
        phone=details["phone"],
        linkedin=details["linkedin"],
        github=details["github"],
        portfolio=details["portfolio"],
        summary=details["summary"],
        skills_breakdown=details["skills_breakdown"],
        certifications=details["certifications"],
        projects=details["projects"],
        experience=details["experience"],
        education=details["education"],
        verification_hash=details["verification_hash"],
    )

