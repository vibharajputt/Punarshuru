# PUNARSHURU SPEC
AI career intelligence for disruption, transition & growth. Build for Bharat 2.0, PS: Intelligent Talent and Workforce Ecosystem.
Tagline: Detect the disruption. Understand the gap. Find the next move.

## Users
career-break returner, gig worker, laid-off pro, stagnant employee, student

## Stack
FE: React18 TS Vite Tailwind shadcn/ui ReactRouter TanStackQuery zustand Recharts FramerMotion lucide react-i18next(en,hi) qrcode.react
BE: FastAPI SQLAlchemy2 Pydantic2, MySQL (SQLite fallback), sentence-transformers all-MiniLM-L6-v2, rapidfuzz, Gemini API
Ports: FE 5173 (proxy /api), BE 8000

## Structure
frontend/src/{app,components/{ui,layout,charts,common},features/<module>,pages,lib,store,types,i18n}
backend/app/{core,models,schemas,routers,services,data,scripts}

## Data (backend/app/data, JSON, India-specific, no scraping)
skills_taxonomy(250: id,name,aliases,category,demand_trend,automation_risk)
jobs_snapshot(300: title,city,salary_min/max_lpa,required_skills,exp,remote,posted_month; GenAI rising, manual QA/data entry declining)
city_costs(12 cities: col_index Mohali=1, rent, commute)
courses(120 free: NPTEL,SWAYAM,Skill India,freeCodeCamp; skill_ids,weeks,lang)
personas(5): Priya Pune returner ex-Java 4yr gap | Ramesh Lucknow delivery 3yr | Arjun Bengaluru laid-off manual QA | Sneha Noida support 3yr stagnant | Rohit Mohali final-yr BTech

## Engines (backend/app/services)
- disruption: score 0-100 = skill_decay + automation_risk + career_gap + stagnation + market_mismatch; return breakdown with 1-line reason each, top risks, strengths
- gap: role skills from jobs frequency; exact + embedding (>=0.75 partial); have/partial/missing, match_pct, radar by category
- market: role trend by month, rising/declining skills, salary by city, best-fit roles
- pathway: 3 paths Safe/Stretch/Pivot; weekly roadmap with free courses; Gemini motivation line
- compensation: Real = (Salary - Rent - Commute) / CoL; city compare, offer compare, 5yr projection
- passport: public slug, skills + evidence, QR
- resume_parser: Gemini JSON, fallback regex+taxonomy

## API (/api)
POST profile, GET profile/{id}, POST profile/parse-resume, GET assess/{id}/disruption, GET assess/{id}/gap?role=, GET market/trends, GET market/roles/{id}, GET pathway/{id}, POST compensation/real, POST compensation/compare, POST passport/{id}, GET passport/{slug}, GET demo/personas, POST demo/load/{key}, GET health

## Pages
/ landing, /onboarding, /dashboard, /skill-gap, /market, /pathways, /compensation, /passport, /p/:slug

## Design
Blue #0B4F9C, orange #F26B1D, sky #E8F3FF, ink #0F172A. Montserrat headings, Inter body. Premium startup feel (Linear/Stripe), 16px radius, soft shadows, gradient mesh hero, motion 200-400ms. Light default + dark. ₹/LPA Indian format.

## Rules
- Demo never breaks: every AI call has fallback + 8s timeout; works without GEMINI_API_KEY
- No lorem ipsum; real Indian content
- Skeleton/empty/error states everywhere; responsive 375-1440
- No `any`; components <200 lines; logic in services
- Output: code only + max 3-line summary. No long explanations.

## Addendum v2
- LLM: services/llm.py single entry `complete(prompt, json=False)`. Order: Gemini (google-genai SDK, model from env) → Groq (OpenAI-compatible REST via httpx, model from env) → template fallback. 8s timeout each, retry once on 429, cache by prompt hash (SQLite table). All services use only llm.py.
- Embeddings: fastembed with paraphrase-multilingual-MiniLM-L12-v2 (works for Hindi/Hinglish). Precompute taxonomy vectors to data/skill_vectors.npy at startup if missing. Remove sentence-transformers.
- Resume: accept PDF/DOCX/TXT upload (pypdf, python-docx), max 5MB.
- Onboarding agent: conversational, resume-first, max 4 follow-up questions, gap reason optional with Skip, classifies into 5 segments, confirm screen before saving. Form wizard stays as fallback.
- Voice: Web Speech API (hi-IN/en-IN) mic button in chat; fallback POST /api/voice/transcribe via Groq Whisper.
- Language: replies in user's language (en / hi / Hinglish).
- Pathways must be data-driven from jobs_snapshot + gap engine, never hardcoded salaries/roles.
- Env: GEMINI_API_KEY, GEMINI_MODEL, GROQ_API_KEY, GROQ_MODEL, GROQ_STT_MODEL, ALLOWED_ORIGINS (comma-separated).