import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_document():
    doc = docx.Document()

    # Set Margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Colors
    NAVY = RGBColor(11, 79, 156)      # #0B4F9C
    ORANGE = RGBColor(242, 107, 29)   # #F26B1D
    DARK = RGBColor(15, 23, 42)       # #0F172A
    GRAY = RGBColor(100, 116, 139)    # #64748B
    EMERALD = RGBColor(16, 149, 102)

    # Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_title = p_title.add_run("PUNARSETU (PUNARSHURU)\n")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(24)
    run_title.font.bold = True
    run_title.font.color.rgb = NAVY

    run_sub = p_title.add_run("Comprehensive Project Technical & Functional Master Report\n")
    run_sub.font.name = "Arial"
    run_sub.font.size = Pt(14)
    run_sub.font.bold = True
    run_sub.font.color.rgb = ORANGE

    run_meta = p_title.add_run("AI-Powered Workforce Resilience & Career Continuity Platform for India\nDate: October 2026 | Version: 2.0 (Production-Ready)\n")
    run_meta.font.name = "Arial"
    run_meta.font.size = Pt(9.5)
    run_meta.font.color.rgb = GRAY

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Function for Section Heading
    def add_section_header(title, subtitle=None):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(16)
        h.paragraph_format.space_after = Pt(4)
        run = h.add_run(title)
        run.font.name = "Arial"
        run.font.size = Pt(15)
        run.font.bold = True
        run.font.color.rgb = NAVY

        if subtitle:
            sub = doc.add_paragraph()
            sub.paragraph_format.space_after = Pt(8)
            r_sub = sub.add_run(subtitle)
            r_sub.font.name = "Arial"
            r_sub.font.size = Pt(9.5)
            r_sub.font.italic = True
            r_sub.font.color.rgb = GRAY

    # Function for Subheading
    def add_sub_header(title):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(2)
        run = h.add_run(title)
        run.font.name = "Arial"
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = DARK

    # Function for Body text
    def add_body(text, bold_prefix=None, bullet=False):
        p = doc.add_paragraph(style='List Bullet' if bullet else 'Normal')
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = "Arial"
            r_pre.font.size = Pt(10)
            r_pre.font.bold = True
            r_pre.font.color.rgb = DARK
        r = p.add_run(text)
        r.font.name = "Arial"
        r.font.size = Pt(10)
        r.font.color.rgb = DARK

    # ────────────────────────────────────────────────────────────
    # 1. EXECUTIVE SUMMARY & PROBLEM STATEMENT
    # ────────────────────────────────────────────────────────────
    add_section_header("1. Executive Summary & Vision", "Solving India's Structural Career Disruption and Underemployment Crisis")
    
    add_body(
        "PunarSetu (Punarshuru) is an intelligent, India-first Career Continuity and AI Workforce Resilience platform. "
        "The Indian software and service workforce faces unprecedented disruption due to rapid GenAI adoption, automation of maintenance tasks, "
        "harsh 90-day notice period lock-ins, returner career-gap stigma, and fragmented informal gig work. "
        "PunarSetu provides personalized, actionable diagnostic suites, tactical negotiation war rooms, interactive daily muscle memory gyms, "
        "and data-backed ROI calculators to safeguard and accelerate individual career trajectories."
    )

    add_sub_header("Core Mission & Objectives:")
    add_body(" Demystify AI disruption risks for 5 vulnerable Indian workforce personas.", "1. AI Disruption Defense:", True)
    add_body(" Replace subjective negotiation with hard mathematical replacement cost leverage.", "2. Financial Leverage Engineering:", True)
    add_body(" Connect career-break returners directly with verified corporate returnship pipelines (Amazon, Microsoft, Google).", "3. Returnee Bridge:", True)
    add_body(" Transform unverified delivery/gig history into structured, portable Skill Passports.", "4. Gig Formalization:", True)
    add_body(" Map college syllabus gaps against actual tech industry hiring standards with placed senior mentorship.", "5. Campus-to-Corporate Readiness:", True)

    # ────────────────────────────────────────────────────────────
    # 2. THE 5 SPECIALIZED WORKFORCE PERSONAS & INNOVATION SUITES
    # ────────────────────────────────────────────────────────────
    add_section_header("2. Detailed Persona Architecture & Feature Suites", "Tailored Diagnostic, Upskilling, and Negotiation Engines")

    # Persona 1
    add_sub_header("Persona 1: Career-Break Returner (Women in Tech & Extended Gap Re-Entry)")
    add_body("Target: Engineers returning after maternity, health, caregiving, or multi-year career gaps.", "Target Audience: ")
    add_body(" Features verified corporate returnee programs (Amazon Rekindle, Microsoft Springboard, Google, Goldman Sachs, Lowe's, Intuit) with monthly stipends (₹60k - ₹1.25L), eligibility filters, and direct application links.", "• Returnship Directory & Cohort Hub: ", True)
    add_body(" An AI interview coach that trains candidates on psychological recruiter dilemmas, replacing apologetic answers with 'Pivot-to-Currency' gold-standard responses.", "• Gap-to-Strength Interview Simulator: ", True)
    add_body(" Daily 5-minute interactive syntax challenges in modern Java 21, React 19, SQL Window functions, and Docker multi-stage builds to shake off syntax rustiness.", "• 5-Minute Technical Muscle Memory Gym: ", True)
    add_body(" Restructures traditional gap-penalized CVs into modern milestone-driven impact profiles showcasing recent cloud and AI PoCs.", "• Resume Gap Rebuilder & Audit: ", True)

    # Persona 2
    add_sub_header("Persona 2: Working but Stagnant (Underpaid IT & Maintenance Trap)")
    add_body("Target: Software professionals with 3+ years in maintenance/support roles facing slow increments and tenure drag.", "Target Audience: ")
    add_body(" Calculates exact 3-year financial opportunity cost of staying (8% hike = ₹22L) vs lateral switch with GenAI stack (+45% hike = ₹38L), revealing a ₹16.4L wealth upside.", "• Stagnation & Velocity Scorecard: ", True)
    add_body(" An interactive war room that profiles manager archetypes (Budget Gatekeeper, Delivery Obsessed, Cycle Delayer), calculates hard replacement cost ROI (₹3.8L cost to replace vs ₹1.8L hike), and provides tailored 1-click verbal scripts.", "• Manager 1:1 Appraisal Negotiation Coach: ", True)
    add_body(" Interactive calculator that computes exact buyout costs, 3.2-month ROI breakeven, verified buyout companies (Razorpay, Barclays, Lowe's), and 1-click copyable HR early-release email templates.", "• 90-Day Notice Period Buyout & ROI Simulator: ", True)
    add_body(" Compares 10+ target tech employers across Product Unicorns, Banking GCCs, and AI labs with salary brackets and interview patterns.", "• Stay vs Switch Decision Matrix: ", True)
    add_body(" Detailed metro city living cost adjustments and real in-hand purchasing power comparisons.", "• City-Tier Market Salary Benchmark: ", True)

    # Persona 3
    add_sub_header("Persona 3: Recently Laid Off (Urgent Pivot & Fast-Track Re-Employment)")
    add_body("Target: Developers, QAs, and operations staff affected by sudden restructuring or company downsizing.", "Target Audience: ")
    add_body(" Automatically analyzes existing core competencies (e.g. Manual QA / SQL) and maps them into adjacent high-growth roles (Automation SDET / Cloud QA).", "• Adjacent Roles & Transferability Mapper: ", True)
    add_body(" Models severance packages, monthly burn rate, and calculates exact survival runway in months with contingency buffers.", "• Financial Runway & Severance Survival Calculator: ", True)
    add_body(" Kanban-style application management board tailored for fast-track 0-to-15 day notice backfill openings.", "• Fast-Track Job Tracker & Opportunity Pipeline: ", True)
    add_body(" Reach-out templates and warm referral connection manager for ex-colleagues and alumni networks.", "• Warm Referral Networking CRM: ", True)
    add_body(" Daily routine planner, mental resilience exercises, and AI copilot to manage job search momentum.", "• Layoff AI Copilot & Wellbeing Planner: ", True)

    # Persona 4
    add_sub_header("Persona 4: Gig & Platform Worker (Informal to Formal Tech Ladder)")
    add_body("Target: Delivery partners, rideshare drivers, and field freelancers seeking career mobility into formal operations.", "Target Audience: ")
    add_body(" Converts informal delivery/service logs into formal corporate titles (e.g. 'Delivery Partner' ➔ 'Logistics Operations & SLA Specialist').", "• Formal Job Title & Skills Translator: ", True)
    add_body(" Cryptographically verifiable micro-credentials validating cash reconciliation, customer rating SLA, and route optimization.", "• Skill Passport & Evidence Vault: ", True)
    add_body(" Combines fragmented payouts across Swiggy, Zomato, Uber, and Urban Company into a single verified income proof for banking and loan access.", "• Multi-Platform Unified Earnings Dashboard: ", True)
    add_body(" Real-time geospatial heatmap of micro-task demand, surge zones, and high-paying delivery clusters.", "• Gig Demand & Opportunity Heatmap: ", True)
    add_body(" Centralized repository for Ayushman Bharat, accident insurance, platform benefits, and emergency assistance.", "• Gig Suraksha & Welfare Vault: ", True)

    # Persona 5
    add_sub_header("Persona 5: Final Year Student / Early Career (Campus-to-Corporate Bridge)")
    add_body("Target: B.Tech, BCA, MCA graduates facing academic syllabus obsolescence vs modern cloud hiring requirements.", "Target Audience: ")
    add_body(" Compares outdated university syllabus (e.g. Turbo C++, basic JSP) against active JD requirements (Docker, FastAPI, LangChain RAG).", "• Curriculum vs Industry Demands Scanner: ", True)
    add_body(" Connects freshers with recently placed seniors at Google, Amazon, Razorpay, and TCS Digital for mock interviews and 1-on-1 Google Meet bookings.", "• Senior Mentorship & Alumni Referral Network: ", True)
    add_body(" Interactive career simulator modeling CTC trajectories based on certifications, GitHub proofs, and tech stack choices.", "• 'What-If' Career Trajectory Simulator: ", True)
    add_body(" Step-by-step roadmap to build and deploy live Swagger APIs, Docker containers, and CI/CD pipelines.", "• Production Proofs & GitHub Portfolio Builder: ", True)

    # ────────────────────────────────────────────────────────────
    # 3. COMPLETE SYSTEM ARCHITECTURE & TECH STACK
    # ────────────────────────────────────────────────────────────
    add_section_header("3. Technical Architecture & Tech Stack", "Robust Full-Stack Engine Built for Scale and Resilience")

    # Table of Tech Stack
    table = doc.add_table(rows=1, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    headers = ["Layer", "Technology / Framework", "Key Architectural Purpose"]
    hdr_cells = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].text = h
        set_cell_background(hdr_cells[i], "0B4F9C")
        for p in hdr_cells[i].paragraphs:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.name = "Arial"
                r.font.bold = True
                r.font.size = Pt(9.5)
                r.font.color.rgb = RGBColor(255, 255, 255)

    stack_rows = [
        ("Frontend Framework", "React 19 + TypeScript + Vite", "Blazing fast SPA, strict type safety, modular component architecture"),
        ("Styling & UI", "Tailwind CSS + Framer Motion + Lucide", "Responsive design, smooth animations, dark/light theme, modern cockpit UI"),
        ("State Management", "Zustand + TanStack React Query", "Persistent profile stores, automated server cache invalidation and query fetching"),
        ("Backend Server", "FastAPI (Python 3.13) + Uvicorn", "High-performance async REST API, auto-generated OpenAPI / Swagger docs"),
        ("Database & ORM", "SQLAlchemy 2.0 (Async) + SQLite / PostgreSQL", "Relational persistence for user profiles, resumes, assessments, and pathways"),
        ("AI / LLM Engine", "Google Gemini API + LangChain + ChromaDB", "Intelligent resume parsing, disruption scoring, vector RAG semantic search"),
        ("Multilingual & Voice", "Whisper AI + i18next (Hindi & English)", "Voice input transcription and seamless Indic language switching"),
        ("Testing Suite", "PyTest (94 Automated Tests)", "100% backend unit and integration test coverage across all domain modules"),
    ]

    for layer, tech, purpose in stack_rows:
        row_cells = table.add_row().cells
        row_cells[0].text = layer
        row_cells[1].text = tech
        row_cells[2].text = purpose
        for idx, cell in enumerate(row_cells):
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            for p in cell.paragraphs:
                for r in p.runs:
                    r.font.name = "Arial"
                    r.font.size = Pt(8.5)
                    r.font.color.rgb = DARK
                    if idx == 0:
                        r.font.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # ────────────────────────────────────────────────────────────
    # 4. TESTING, QUALITY & PRODUCTION VERIFICATION
    # ────────────────────────────────────────────────────────────
    add_section_header("4. Testing & Verification Summary", "Rigorous Test Suites Ensuring 100% Stability")

    add_body("All 94 backend tests passed successfully with zero failures across 12 test suites:", "• Backend Automated Test Suite: ")
    add_body("`tests/test_auth.py` (13 tests) - JWT authentication, registration, password hashing.", "  - Authentication: ", True)
    add_body("`tests/test_onboarding.py` & `test_onboarding_engine.py` (28 tests) - Dynamic multi-persona question flows.", "  - Onboarding Engine: ", True)
    add_body("`tests/test_resume_parser.py` (21 tests) - PDF/DOCX parsing, skill extraction, error handling.", "  - Resume Parser: ", True)
    add_body("`tests/test_llm.py` (16 tests) - Gemini prompt generation, JSON schema validation, fallback heuristics.", "  - LLM Intelligence: ", True)
    add_body("`tests/test_gap.py`, `test_disruption.py`, `test_market.py`, `test_compensation.py`, `test_voice.py` (16 tests).", "  - Diagnostics & Voice: ", True)
    add_body("TypeScript compiler (`tsc -b`) and Vite build pass with 0 errors (`✓ built in 2.12s`).", "• Frontend Production Build: ")
    add_body("Synced and merged all collaborator contributions on branch `rashika` with zero conflicts.", "• Version Control Integrity: ")

    # ────────────────────────────────────────────────────────────
    # 5. CONCLUSION & ROADMAP
    # ────────────────────────────────────────────────────────────
    add_section_header("5. Impact & Conclusion", "Empowering the Indian Workforce with Data & AI Confidence")

    add_body(
        "PunarSetu bridges the critical gap between macro industry disruptions and ground-level Indian career mobility. "
        "By combining deep psychological profiling, mathematical financial models, verified corporate pipelines, and hands-on micro-drills, "
        "it equips professionals not just to survive AI automation, but to confidently accelerate their earnings and leadership trajectory."
    )

    output_path = r"c:\Users\pc\Downloads\Punarshuru-main\Punarshuru_Complete_Project_Report.docx"
    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == "__main__":
    create_document()
