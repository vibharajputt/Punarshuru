import json
import logging
from pathlib import Path

import numpy as np
from rapidfuzz import fuzz

from app.core.config import get_settings
from app.schemas.gap import PartialSkill

logger = logging.getLogger(__name__)
settings = get_settings()

DATA_DIR = Path(__file__).parent.parent / "data"
VECTORS_PATH = DATA_DIR / "skill_vectors.npy"

_embedding_model = None


def get_embedding_model():
    """Lazy-load fastembed model."""
    global _embedding_model
    if _embedding_model is None:
        try:
            from fastembed import TextEmbedding

            # Use configured multilingual model
            _embedding_model = TextEmbedding(model_name=settings.EMBEDDING_MODEL)
            logger.info(f"Loaded fastembed model: {settings.EMBEDDING_MODEL}")
        except Exception as e:
            logger.warning(f"Could not load fastembed TextEmbedding ({e}), using fuzzy fallback")
            _embedding_model = None
    return _embedding_model


def embed_texts(texts: list[str]) -> np.ndarray:
    """Generate normalized embedding vectors for a list of strings."""
    if not texts:
        return np.empty((0, 384), dtype=np.float32)

    model = get_embedding_model()
    if model is not None:
        try:
            vectors = list(model.embed(texts))
            arr = np.array(vectors, dtype=np.float32)
            # Normalize vectors for cosine similarity via dot product
            norms = np.linalg.norm(arr, axis=1, keepdims=True)
            norms[norms == 0] = 1.0
            return arr / norms
        except Exception as e:
            logger.warning(f"Embedding computation failed: {e}")

    # Fallback dummy vectors if fastembed fails
    return np.zeros((len(texts), 384), dtype=np.float32)


def compute_similarity(text1: str, text2: str) -> float:
    """
    Computes semantic cosine similarity between text1 and text2 using fastembed,
    with rapidfuzz token similarity as robust blended fallback.
    """
    if not text1 or not text2:
        return 0.0

    t1_clean = text1.strip().lower()
    t2_clean = text2.strip().lower()

    if t1_clean == t2_clean:
        return 1.0

    # Quick fuzzy match first
    fuzzy_sim = fuzz.token_sort_ratio(t1_clean, t2_clean) / 100.0
    if fuzzy_sim >= 0.95:
        return round(fuzzy_sim, 2)

    model = get_embedding_model()
    if model is not None:
        try:
            vecs = embed_texts([text1, text2])
            if len(vecs) == 2:
                cos_sim = float(np.dot(vecs[0], vecs[1]))
                # Clamp between 0.0 and 1.0
                cos_sim = max(0.0, min(1.0, cos_sim))
                # Combine embedding similarity with token similarity
                blended = max(cos_sim, fuzzy_sim)
                return round(blended, 2)
        except Exception as e:
            logger.debug(f"Cosine similarity error: {e}")

    return round(fuzzy_sim, 2)


def precompute_taxonomy_vectors() -> np.ndarray | None:
    """Precompute and save taxonomy skill vectors to data/skill_vectors.npy at startup if missing."""
    if VECTORS_PATH.exists():
        try:
            return np.load(str(VECTORS_PATH))
        except Exception:
            pass

    tax_path = DATA_DIR / "skills_taxonomy.json"
    if not tax_path.exists():
        return None

    try:
        with open(tax_path, encoding="utf-8") as f:
            taxonomy = json.load(f)

        texts = []
        for item in taxonomy:
            name = item.get("name", "")
            aliases = " ".join(item.get("aliases", []))
            cat = item.get("category", "")
            texts.append(f"{name} ({cat}) {aliases}".strip())

        vectors = embed_texts(texts)
        if len(vectors) > 0:
            np.save(str(VECTORS_PATH), vectors)
            logger.info(f"Precomputed and saved {len(vectors)} skill vectors to {VECTORS_PATH}")
            return vectors
    except Exception as e:
        logger.warning(f"Failed to precompute taxonomy vectors: {e}")

    return None


# Precompute on module import
precompute_taxonomy_vectors()


def find_embedding_partial_matches(
    user_skills: list[str],
    role_required_skills: list[str],
    have_skills: list[str],
    threshold: float = 0.75,
) -> tuple[list[PartialSkill], list[str]]:
    """
    Finds partial matches (>=0.75 similarity) between user skills and role required skills
    using fastembed embeddings and returns (partial_skills, missing_skills).
    """
    user_skills_clean = [s.strip() for s in user_skills if s and s.strip()]
    if not user_skills_clean:
        missing = [req for req in role_required_skills if req not in have_skills]
        return [], missing

    have_lower = {h.lower() for h in have_skills}
    candidate_reqs = [req for req in role_required_skills if req.lower() not in have_lower]

    partial_skills: list[PartialSkill] = []
    missing_skills: list[str] = []

    for req in candidate_reqs:
        best_sim = 0.0
        best_match_skill = ""

        for u_skill in user_skills_clean:
            sim = compute_similarity(req, u_skill)
            if sim > best_sim:
                best_sim = sim
                best_match_skill = u_skill

        if best_sim >= threshold:
            partial_skills.append(
                PartialSkill(
                    skill=req,
                    matched_with=best_match_skill,
                    similarity=best_sim,
                )
            )
        else:
            missing_skills.append(req)

    return partial_skills, missing_skills


def generate_hidden_strengths(
    user_skills: list[str],
    current_role: str,
    user_type: str,
) -> list[dict[str, str]]:
    """
    Identifies hidden strengths and crossover capabilities from candidate's background
    that provide unfair advantages in modern high-demand tech roles.
    """
    skills_lower = " ".join(user_skills).lower()
    role_lower = current_role.lower()

    strengths: list[dict[str, str]] = []

    # 1. Gig / Operations
    if (
        user_type == "gig"
        or "delivery" in role_lower
        or "route" in skills_lower
        or "dispatch" in skills_lower
    ):
        strengths.append({
            "strength": "Real-Time Operational Dispatch",
            "crossover": "High transferability to Tech Operations, Logistics Dispatch Analytics, and Supply Chain Dashboards.",
            "target": "Logistics Tech Analyst",
        })
        strengths.append({
            "strength": "Bilingual Field Communication",
            "crossover": "Direct advantage for Indian Vernacular AI Chatbot Quality Assurance and Customer Success Ops.",
            "target": "AI Operations Associate",
        })

    # 2. QA / Testing
    elif (
        "qa" in role_lower
        or "test" in role_lower
        or "testing" in skills_lower
        or "selenium" in skills_lower
    ):
        strengths.append({
            "strength": "Defect Root-Cause Intuition",
            "crossover": "Deep SDLC domain knowledge makes automated Playwright/Selenium test framework authoring 3x faster than freshers.",
            "target": "Automation QA / SDET",
        })
        strengths.append({
            "strength": "Agile & JIRA Workflow Fluency",
            "crossover": "Seamless transition into Scrum Master and Quality Engineering team leadership.",
            "target": "Lead QA Engineer",
        })

    # 3. Java / Backend Returner
    elif (
        "java" in skills_lower
        or "spring" in skills_lower
        or "backend" in role_lower
        or "sql" in skills_lower
    ):
        strengths.append({
            "strength": "Object-Oriented & Concurrency Depth",
            "crossover": "Java multi-threading experience translates seamlessly into Python asynchronous pipelines and high-throughput LLM serving systems.",
            "target": "AI Infrastructure Engineer",
        })
        strengths.append({
            "strength": "Relational Database Schema Design",
            "crossover": "MySQL/PostgreSQL mastery accelerates Hybrid Search (SQL + Vector Search) implementation.",
            "target": "Backend & Data Engineer",
        })

    # 4. Support / Stagnant
    elif (
        "support" in role_lower
        or "crm" in skills_lower
        or "customer" in skills_lower
        or "communication" in skills_lower
    ):
        strengths.append({
            "strength": "User Intent & Pain-Point Diagnostics",
            "crossover": "Empathy and resolution workflows make you an exceptional AI Chatbot Evaluation & Prompt Tuning specialist.",
            "target": "AI Chatbot Trainer / Product Analyst",
        })
        strengths.append({
            "strength": "Cross-Functional Escalation Mastery",
            "crossover": "Direct crossover to Product Operations, SaaS Support Engineering, and Customer Success Management.",
            "target": "Product Operations Associate",
        })

    # 5. Student / Fresh CS
    else:
        strengths.append({
            "strength": "Foundational CS & Algorithmic Baseline",
            "crossover": "Clean data structures and algorithm foundations allow rapid mastery of modern AI frameworks and cloud architectures.",
            "target": "Junior AI / Full Stack Engineer",
        })
        strengths.append({
            "strength": "Modern Tooling Adaptability",
            "crossover": "Unencumbered by legacy code patterns; instantly adopts modern AI coding workflows and cloud-native practices.",
            "target": "Python & Cloud Developer",
        })

    return strengths
