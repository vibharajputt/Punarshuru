# UX SPEC v3 (overrides older UI decisions)

## Principles
- One job per page. One primary button per screen.
- Plain language, no jargon. Max 3 cards above the fold.
- Resume upload exists ONLY in the onboarding agent.
- Every page answers: "What is this?" (1 line) and "What do I do next?" (1 button).

## Flow
Landing → /signup → /onboarding (agent) → /home
/login → /home (if profile incomplete → /onboarding)
App routes require login OR demo mode.

## Auth (real)
Backend: POST /api/auth/signup {name,email,password}, POST /api/auth/login, GET /api/auth/me. JWT (python-jose) + bcrypt (passlib). Profile linked to user_id.
Frontend: /signup and /login as clean centered cards (name, email, password; show/hide password; inline errors). Token in zustand persist. Protected routes.

## Navigation (app)
Left sidebar desktop, bottom nav mobile. Exactly 5 items:
Home /home | My Skills /skills | My Path /path | Jobs & Salary /jobs | Skill Passport /passport
Top bar: page title, language EN/हिं, theme, avatar menu (Edit profile → /onboarding, Logout).

## Pages
- Landing: Hero (headline, 1 line, buttons "Get started free" + "Try a demo") → 3 steps (Upload/Chat → See your score → Follow your path) → 5 "Who it's for" cards → final CTA → footer. Nothing else.
- Onboarding: full-screen agent chat + live profile card. Starts EMPTY for new users. Ends with confirm screen → /home.
- Home: greeting; Career Risk Score card (ring + 1-sentence meaning + "See why" expand for 5 factors); "Your next step" card (1 action + button); 3 shortcut cards (Skills match %, Best path, Real salary).
- My Skills: match % for target role, role selector, Have / Learning needed / Missing lists, hidden strengths.
- My Path: 3 path cards (Safe / Stretch / Switch) → selected roadmap timeline with free courses.
- Jobs & Salary: tabs [Jobs for you | Real salary calculator | Check company fit]. Company fit uses saved profile, no resume upload; company categories, not brand names.
- Skill Passport: card + share buttons.

## Demo mode
Landing "Try a demo" → modal with 5 persona cards → loads persona → /home. Thin top strip "Demo: <name> · Switch · Exit demo". Remove FloatingDemoSwitcher and PersonaSwitcher everywhere else.

## Copy glossary (replace everywhere)
Disruption Index/Score → Career Risk Score | Skill Obsolescence → Outdated skills | Automation Exposure → Automation risk | CoL / Arbitrage → Real salary (after rent & travel) | Market Radar → Jobs & Salary | Pivot → Switch | Deterministic AI Model, AI Shield, Gamified → remove

## Delete
Dashboard tabs, DashboardCompanyBanner, QuickResumeParserCard, CareerSimulatorWidget, PersonaSwitcher, FloatingDemoSwitcher, ModuleNavCards, company brand names/logos.

## Agent v2 (overrides earlier agent behaviour)
- Architecture: slot-filling state machine. Code decides next question and done. LLM only (a) extracts fields as JSON, (b) phrases the reply. Never let LLM set done.
- Slots in order: current_role, skills (≥3), target_role, city, career_gap (optional, ask only if experience>0, offer "Skip"), expected_salary (optional).
- name and email come from logged-in user (GET /api/auth/me). Never ask name.
- Done = all required slots filled (current_role, skills, target_role, city) AND user taps the Confirm button. Confirm is an action field in the request, never text matching.
- "Skip" skips only the current optional slot.
- Validate LLM output with a Pydantic model; drop unknown keys; coerce types; ignore empty values.
- Pass last 6 messages of history to the LLM.
- Resume: never invent missing fields (no default city/target/name). Extract gap from date ranges. After resume, ask only missing slots.
- Rule-based fallback: word-boundary regex, supports English + Hinglish patterns ("mera naam", "main ... hun/karta hun", "... banna hai", "... me kaam"). Replies in user's language using templates (en + hi).
- Sessions persisted in DB table onboarding_sessions keyed by user_id; resume chat after refresh.
- LLM timeouts: 5s per provider, total ≤ 10s. Log provider failures at WARNING.
- Rate limit /api/onboarding/chat: 20 requests/min per user.
- Quick replies: generic examples only, no persona names, no brand names.
- Frontend: render markdown in bubbles; onboarding is full-screen (no sidebar).