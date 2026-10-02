# Punarshuru

> **AI Career Intelligence for Disruption, Transition & Growth — Bharat 2.0**
>
> *Detect the disruption. Understand the gap. Find the next move.*

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, Zustand, Recharts, Framer Motion, lucide-react, react-i18next (EN/HI), qrcode.react |
| Backend | FastAPI, SQLAlchemy 2 (async), Pydantic 2, MySQL (SQLite fallback), sentence-transformers all-MiniLM-L6-v2, rapidfuzz, Gemini API |
| Database | MySQL 8.0 (Docker) |
| Ports | FE 5173 (proxy `/api`), BE 8000 |

---

## Quick Start (Local Dev — No Docker)

### 1. Backend

```bash
cd backend

# Create venv
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure env (SQLite used as fallback if DATABASE_URL not set)
copy .env.example .env           # Windows
# cp .env.example .env           # Linux/Mac

# Start the API server
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/api/docs

### 2. Seed demo data

```bash
cd backend
python -m app.scripts.seed
```

This validates all 5 JSON data files and inserts the 5 demo personas into the DB.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173  
The Vite dev server proxies `/api` → `http://localhost:8000`.

---

## Docker (MySQL + Full Stack)

```bash
# 1. Copy and edit backend env
copy backend\.env.example backend\.env

# 2. Start everything
docker compose up --build

# 3. Seed personas (in a separate terminal)
docker exec punarshuru_backend python -m app.scripts.seed
```

Services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/docs
- MySQL: localhost:3306 (user: `punarshuru`, pw: `punarshuru123`, db: `punarshuru`)

---

## Data Files (`backend/app/data/`)

| File | Count | Description |
|------|-------|-------------|
| `skills_taxonomy.json` | 250 | Skills with id, name, aliases, category, demand_trend, automation_risk |
| `jobs_snapshot.json` | 300 | Indian job postings with salary (LPA), city, skills, remote flag |
| `city_costs.json` | 12 | City cost-of-living index (Mohali = 1), rent, commute |
| `courses.json` | 120 | Free courses: NPTEL, SWAYAM, Skill India, freeCodeCamp |
| `personas.json` | 5 | Demo personas: Priya, Ramesh, Arjun, Sneha, Rohit |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Liveness probe |
| `GET` | `/api/demo/personas` | List all demo personas |
| `POST` | `/api/demo/load/{key}` | Load full persona (priya/ramesh/arjun/sneha/rohit) |
| `GET` | `/api/market/trends` | Rising/declining/stable skills |
| `GET` | `/api/market/roles/{id}` | Job role snapshot by ID |

Full API docs: http://localhost:8000/api/docs

---

## Project Structure

```
Punarshuru/
├── backend/
│   ├── app/
│   │   ├── core/           # config.py, database.py
│   │   ├── models/         # ORM: profile.py, passport.py
│   │   ├── schemas/        # Pydantic schemas (TODO)
│   │   ├── routers/        # health.py, demo.py, market.py
│   │   ├── services/       # disruption, gap, market, pathway, compensation engines (TODO)
│   │   ├── data/           # All JSON data files
│   │   └── scripts/        # seed.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/            # (future: app-level config)
│   │   ├── components/
│   │   │   ├── ui/         # shadcn/ui components (TODO)
│   │   │   ├── layout/     # Navbar.tsx, AppLayout.tsx
│   │   │   ├── charts/     # Recharts wrappers (TODO)
│   │   │   └── common/     # HealthBadge.tsx
│   │   ├── features/       # Feature modules (TODO)
│   │   ├── pages/          # LandingPage, DashboardPage, ...
│   │   ├── lib/            # api.ts, utils.ts
│   │   ├── store/          # profileStore.ts (Zustand)
│   │   ├── types/          # index.ts
│   │   └── i18n/           # EN + HI translations
│   ├── vite.config.ts
│   └── Dockerfile
├── docker/
│   └── mysql/
│       └── init.sql
├── docker-compose.yml
└── README.md
```

---

## Demo Personas

| Key | Name | Type | City | Story |
|-----|------|------|------|-------|
| `priya` | Priya Sharma | Returner | Pune | Ex-Java dev, 4yr maternity break → GenAI |
| `ramesh` | Ramesh Kumar | Gig | Lucknow | Swiggy delivery → Logistics Tech |
| `arjun` | Arjun Mehta | Laid Off | Bengaluru | Manual QA laid off → Automation SDET |
| `sneha` | Sneha Patel | Stagnant | Noida | 3yr support stagnation → AI Chatbot Trainer |
| `rohit` | Rohit Singh | Student | Mohali | Final yr BTech → SWE/ML |

---

## Rules

- Demo never breaks: every AI call has fallback + 8s timeout; works without `GEMINI_API_KEY`
- No lorem ipsum — all content is India-specific
- No `any` in TypeScript; components < 200 lines; logic in services
- Skeleton/empty/error states everywhere; responsive 375–1440px
- Salary format: ₹X LPA (Indian locale)
