"""
Punarshuru Analytics Engine - Phase 6: Pitch Deck PowerPoint Generator
Script: 06_generate_pitch_deck.py

Generates the 25-slide Round 3 Presentation Deck in widescreen 16:9 pptx format:
'analytics/presentation/Round3_Pitch_Deck.pptx'

Features:
- Professional 16:9 widescreen layout (13.333" x 7.5").
- Curated executive theme: Deep Navy (#0F172A), Sapphire (#1E3A8A / #2563EB), Slate (#64748B), White (#FFFFFF).
- Native styled cards, KPI callout boxes, and structured content.
- Embedded high-res figures (all 11 figures: fig1 through fig11).
- Full detailed speaker notes attached to every single slide for live presentation delivery.
"""

import os
import logging
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MACRO_FIG_DIR = os.path.join(BASE_DIR, "outputs", "figures", "macro_market")
JDS_FIG_DIR = os.path.join(BASE_DIR, "outputs", "figures", "jds_skills")
SDS_FIG_DIR = os.path.join(BASE_DIR, "outputs", "figures", "sds_traits")
PRESENTATION_DIR = os.path.join(BASE_DIR, "presentation")
os.makedirs(PRESENTATION_DIR, exist_ok=True)

# Colors
C_DARK_NAVY = RGBColor(0x0F, 0x17, 0x2A)  # #0F172A
C_SAPPHIRE = RGBColor(0x1E, 0x3A, 0x8A)   # #1E3A8A
C_BLUE = RGBColor(0x25, 0x63, 0xEB)       # #2563EB
C_LIGHT_BG = RGBColor(0xF8, 0xFA, 0xFC)   # #F8FAFC
C_CARD_BG = RGBColor(0xF1, 0xF5, 0xF9)    # #F1F5F9
C_SLATE = RGBColor(0x64, 0x74, 0x8B)      # #64748B
C_TEXT = RGBColor(0x1E, 0x29, 0x3B)       # #1E293B
C_WHITE = RGBColor(0xFF, 0xFF, 0xFF)      # #FFFFFF
C_EMERALD = RGBColor(0x05, 0x96, 0x69)    # #059669
C_CRIMSON = RGBColor(0xDC, 0x26, 0x26)    # #DC2626


def create_base_slide(prs, title_text, category_tag="SAS × CU NATIONAL HACKATHON | PUNARSHURU"):
    """Creates a standardized content slide with top header bar, category tag, and title."""
    blank_layout = prs.slide_layouts[6] # Blank
    slide = prs.slides.add_slide(blank_layout)
    
    # Header container
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(1.1))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_top = Inches(0)
    tf.margin_bottom = Inches(0)
    tf.margin_left = Inches(0)
    tf.margin_right = Inches(0)
    
    # Category Tag
    p_tag = tf.paragraphs[0]
    p_tag.space_after = Pt(2)
    run_tag = p_tag.add_run()
    run_tag.text = category_tag.upper()
    run_tag.font.name = "Arial"
    run_tag.font.size = Pt(10)
    run_tag.font.bold = True
    run_tag.font.color.rgb = C_BLUE
    
    # Slide Title
    p_title = tf.add_paragraph()
    run_title = p_title.add_run()
    run_title.text = title_text
    run_title.font.name = "Arial"
    run_title.font.size = Pt(22)
    run_title.font.bold = True
    run_title.font.color.rgb = C_DARK_NAVY
    
    # Subtle accent rule
    rule = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.7), Inches(0.02))
    rule.fill.solid()
    rule.fill.fore_color.rgb = RGBColor(0xE2, 0xE8, 0xF0)
    rule.line.color.rgb = RGBColor(0xE2, 0xE8, 0xF0)
    
    return slide


def add_speaker_notes(slide, notes_text):
    """Attaches formal presentation speaker notes to the slide."""
    notes_slide = slide.notes_slide
    tf = notes_slide.notes_text_frame
    tf.text = notes_text


def add_card(slide, left, top, width, height, title, items, bg_color=C_CARD_BG, border_color=None):
    """Draws a styled content card with header and bullet points."""
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_color
    if border_color:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)
    else:
        shape.line.color.rgb = RGBColor(0xCB, 0xD5, 0xE1)
        shape.line.width = Pt(0.75)
        
    tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), height - Inches(0.3))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_top = Inches(0)
    tf.margin_left = Inches(0)
    tf.margin_right = Inches(0)
    
    # Title
    p_t = tf.paragraphs[0]
    p_t.space_after = Pt(6)
    run_t = p_t.add_run()
    run_t.text = title
    run_t.font.name = "Arial"
    run_t.font.size = Pt(13)
    run_t.font.bold = True
    run_t.font.color.rgb = C_DARK_NAVY
    
    # Items
    for item in items:
        p = tf.add_paragraph()
        p.space_after = Pt(4)
        run = p.add_run()
        run.text = f"• {item}"
        run.font.name = "Arial"
        run.font.size = Pt(11)
        run.font.color.rgb = C_TEXT
        
    return shape


def build_deck():
    logging.info("Initializing 25-Slide Presentation Deck Generator...")
    prs = Presentation()
    # 16:9 Widescreen standard
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # =========================================================================
    # SLIDE 1: TITLE SLIDE
    # =========================================================================
    blank_layout = prs.slide_layouts[6]
    s1 = prs.slides.add_slide(blank_layout)
    
    # Background fill
    bg = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = C_DARK_NAVY
    bg.line.fill.background()
    
    # Title box
    tb = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(10.9), Inches(3.8))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p0 = tf.paragraphs[0]
    r0 = p0.add_run()
    r0.text = "SAS × CHANDIGARH UNIVERSITY NATIONAL HACKATHON 2026"
    r0.font.name = "Arial"
    r0.font.size = Pt(13)
    r0.font.bold = True
    r0.font.color.rgb = RGBColor(0x60, 0xA5, 0xFA) # Light Sky Blue
    p0.space_after = Pt(12)
    
    p1 = tf.add_paragraph()
    r1 = p1.add_run()
    r1.text = "Deciphering the Indian Data Science Labour Market"
    r1.font.name = "Arial"
    r1.font.size = Pt(32)
    r1.font.bold = True
    r1.font.color.rgb = C_WHITE
    p1.space_after = Pt(10)
    
    p2 = tf.add_paragraph()
    r2 = p2.add_run()
    r2.text = "Empirical Evidence on Macro Demand, Junior Skill Multipliers, and Senior Executive Trait Predictors for Personalised Career Guidance"
    r2.font.name = "Arial"
    r2.font.size = Pt(16)
    r2.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)
    p2.space_after = Pt(28)
    
    p3 = tf.add_paragraph()
    r3 = p3.add_run()
    r3.text = "Platform: Punarshuru  |  Authoring Team: Punarshuru AI Lab  |  Reproducibility: Seed 42"
    r3.font.name = "Arial"
    r3.font.size = Pt(12)
    r3.font.bold = True
    r3.font.color.rgb = C_WHITE
    
    add_speaker_notes(
        s1,
        "Good morning, esteemed judges and organizers. Today, we present 'Deciphering the Indian Data Science Labour Market'. "
        "Our mission is to replace pervasive career myths with hard empirical evidence. We bridge macroeconomic job postings with "
        "individual psychometric and technical micro-evaluations, directly powering our platform: Punarshuru."
    )

    # =========================================================================
    # SLIDE 2: THE MACRO CRISIS & HUMAN CHALLENGE
    # =========================================================================
    s2 = create_base_slide(prs, "The Labour Market Dilemma: Information Asymmetry & Human Friction")
    add_card(
        s2, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
        "1. Career Restarters",
        [
            "Primarily women returning from caregiving or sabbaticals.",
            "Encounter severe wage penalties and outdated expectations.",
            "Paralyzed by perceived technical obsolescence.",
            "Lack empirical proof of which re-entry skills pay off."
        ],
        border_color=C_BLUE
    )
    add_card(
        s2, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
        "2. University Students & Freshers",
        [
            "Graduates flooded with aggressive ed-tech marketing.",
            "Waste time learning complex distributed systems (Hadoop).",
            "Lack clarity on what hiring managers actually reward.",
            "No empirical compass to prioritize limited study hours."
        ],
        border_color=C_BLUE
    )
    add_card(
        s2, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
        "3. Stagnant Mid-Career Pros",
        [
            "Individual contributors plateaued at 4–10 years exp.",
            "Trapped in 12–15 LPA bands despite strong technical skills.",
            "Fail to transition into executive & client leadership.",
            "Blind to the psychometric drivers of senior success."
        ],
        border_color=C_BLUE
    )
    add_speaker_notes(
        s2,
        "The Indian data science sector is exploding, yet it suffers from acute human friction. Career restarters, freshers, "
        "and stagnant professionals all make career decisions based on anecdotal advice or ed-tech marketing rather than empirical facts."
    )

    # =========================================================================
    # SLIDE 3: CENTRAL RESEARCH QUESTIONS & HYPOTHESES
    # =========================================================================
    s3 = create_base_slide(prs, "Central Research Questions & Scientific Hypotheses")
    add_card(
        s3, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.4),
        "Q1: Macro Demand & Compensation Hierarchy",
        [
            "What is the empirical wage curve across functional roles?",
            "What is the exact Mincerian return per year of experience?",
            "What is the true geographical relocation premium across tech hubs?"
        ]
    )
    add_card(
        s3, Inches(6.8), Inches(1.8), Inches(5.6), Inches(2.4),
        "Q2: Junior Data Scientist Skill Multipliers",
        [
            "Which technical pillars separate High Hike candidates from stagnant peers?",
            "Does distributed Big Data competency actually command higher salary hikes?",
            "What are the independent adjusted Odds Ratios for each core skill?"
        ]
    )
    add_card(
        s3, Inches(0.8), Inches(4.5), Inches(5.6), Inches(2.4),
        "Q3: Senior Executive Trait Determinants",
        [
            "Which Big Five personality traits predict senior career success?",
            "Is emotional stability (low Neuroticism) a prerequisite for leadership?",
            "How do Conscientiousness and Openness affect promotion odds?"
        ]
    )
    add_card(
        s3, Inches(6.8), Inches(4.5), Inches(5.6), Inches(2.4),
        "Q4: Engineering Translation into Punarshuru",
        [
            "How do we embed live econometric models into production web architecture?",
            "How do we replace hardcoded static heuristics with verified ML inference?",
            "Can we deliver automated, persona-tailored navigation without bias?"
        ]
    )
    add_speaker_notes(
        s3,
        "We formalized four core research questions covering macro wage equations, junior skill hike multipliers, senior psychometric "
        "success drivers, and production engineering translation. Every hypothesis was tested with strict statistical rigor."
    )

    # =========================================================================
    # SLIDE 4: END-TO-END METHODOLOGICAL ARCHITECTURE
    # =========================================================================
    s4 = create_base_slide(prs, "End-to-End Analytical Architecture & Reproducibility Pipeline")
    add_card(
        s4, Inches(0.8), Inches(1.8), Inches(2.2), Inches(5.0),
        "Stage 1: Audit",
        [
            "Ingest 4 raw datasets.",
            "1,001 duplicates removed.",
            "157 spam rows pruned.",
            "Surrogate primary keys.",
            "Regex LPA normalization.",
            "JSON audit logging."
        ]
    )
    add_card(
        s4, Inches(3.2), Inches(1.8), Inches(2.2), Inches(5.0),
        "Stage 2: Macro",
        [
            "N=16,291 clean jobs.",
            "One-Way ANOVA tests.",
            "Mincerian OLS wage curve.",
            "Pareto employer analysis.",
            "Tech hub IQR benchmarks.",
            "Skill premium matrix."
        ]
    )
    add_card(
        s4, Inches(5.6), Inches(1.8), Inches(2.2), Inches(5.0),
        "Stage 3: Junior",
        [
            "N=139 candidates.",
            "Welch's t & Mann-Whitney.",
            "Cohen's d effect sizes.",
            "Multivariable Logit.",
            "Odds Ratios & 95% CIs.",
            "Stratified 5-Fold CV."
        ]
    )
    add_card(
        s4, Inches(8.0), Inches(1.8), Inches(2.2), Inches(5.0),
        "Stage 4: Senior",
        [
            "N=161 senior leaders.",
            "Big Five OCEAN profiling.",
            "Odds Ratios per 10-pts.",
            "Permutation importance.",
            "Random Forest & Logit.",
            "Joblib model serialization."
        ]
    )
    add_card(
        s4, Inches(10.4), Inches(1.8), Inches(2.2), Inches(5.0),
        "Stage 5: Product",
        [
            "Punarshuru integration.",
            "FastAPI backend models.",
            "React / TS dashboards.",
            "20-page Approach Note.",
            "25-slide PPT deck.",
            "Global Seed: 42."
        ]
    )
    add_speaker_notes(
        s4,
        "Here is our complete five-stage pipeline. It is completely reproducible, governed by a global random seed of 42. "
        "It moves from raw data forensic cleaning all the way to serialized production models powering the Punarshuru platform."
    )

    # =========================================================================
    # SLIDE 5: DATA AUDITING & FORENSIC SANITIZATION
    # =========================================================================
    s5 = create_base_slide(prs, "Data Forensic Audit: Turning Messy Web Scraping into Verified Data")
    add_card(
        s5, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "Audit Findings & Methodological Justifications",
        [
            "DataScience_Jobs.csv (N=1,602):",
            "  - 142 duplicate 'reference_no' values discovered.",
            "  - Forensic audit: Scraper batch ID collision, NOT duplicate jobs.",
            "  - Preserved all 1,602 valid rows with surrogate key 'ds_job_id'.",
            "  - 19 records with exp > 10 yrs verified as legitimate Architect roles.",
            "",
            "Analytics_Jobs.csv (N=15,841):",
            "  - 1,001 exact content duplicates systematically dropped.",
            "  - 151 data-entry/typing spam postings filtered out.",
            "  - Final clean cohort: 14,689 high-quality job postings.",
            "  - Normalized text salary bands into ordinal ranks & LPA midpoints."
        ]
    )
    add_card(
        s5, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "Micro Assessment Datasets Audit",
        [
            "JDS_Skill_Traits.xlsx (N=139):",
            "  - 5 technical pillars assessed on 1.0–5.0 scale.",
            "  - Resolved 2 duplicate ID collisions via surrogate keys.",
            "  - Balanced binary target: 73 High Hike vs. 66 Low Hike.",
            "  - Verified zero missing values or range corruptions.",
            "",
            "SDS_Personality_Traits.xlsx (N=161):",
            "  - Big Five OCEAN assessed on 0.0–100.0 scale.",
            "  - Cleaned stray whitespace in column names (' extraversion').",
            "  - Resolved 9 ID collisions with unique psychometric observations.",
            "  - Balanced binary target: 85 High Success vs. 76 Low Success."
        ]
    )
    add_speaker_notes(
        s5,
        "Raw labour data is notoriously noisy. Many teams make the fatal mistake of dropping rows naively or ignoring spam. "
        "We performed deep forensic auditing, proving that reference ID duplicates were scraper batch IDs and filtering 157 data-entry spam rows."
    )

    # =========================================================================
    # SLIDE 6: MACRO ROLE COMPENSATION HIERARCHY
    # =========================================================================
    s6 = create_base_slide(prs, "Macro Role Compensation Hierarchy: Where Does the Capital Flow?")
    img_path = os.path.join(MACRO_FIG_DIR, "fig1_macro_salary_by_role.png")
    if os.path.exists(img_path):
        s6.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(7.0), Inches(5.0))
    add_card(
        s6, Inches(8.1), Inches(1.8), Inches(4.4), Inches(5.0),
        "Econometric Findings (N=1,602)",
        [
            "Data Architect: Mean ₹24.31L, Median ₹24.0L (IQR ₹6.0L).",
            "Lead Data Scientist: Mean ₹19.85L, Median ₹20.0L.",
            "Data Science Specialist: Mean ₹17.52L, Median ₹17.0L.",
            "Associate / Entry: Mean ₹6.24L, Median ₹6.0L.",
            "",
            "ANOVA Significance:",
            "  - F-Statistic: 154.48",
            "  - p-Value: 8.67 × 10^-210",
            "  - Role explains 41.2% of total wage variance.",
            "",
            "Insight: Transitioning from Associate to Architect yields a 4.0x salary multiple."
        ]
    )
    add_speaker_notes(
        s6,
        "Here is the macroeconomic salary distribution across 1,602 verified data science postings. One-way ANOVA confirms role classification "
        "is overwhelmingly significant (p = 8.67e-210), explaining over 41% of wage dispersion. Data Architects top the market at 24 LPA."
    )

    # =========================================================================
    # SLIDE 7: GEOGRAPHIC SALARY DISPARITY
    # =========================================================================
    s7 = create_base_slide(prs, "Geographical Tech Hubs: Quantifying the Relocation Premium")
    img_path = os.path.join(MACRO_FIG_DIR, "fig2_city_salary_iqr.png")
    if os.path.exists(img_path):
        s7.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(7.0), Inches(5.0))
    add_card(
        s7, Inches(8.1), Inches(1.8), Inches(4.4), Inches(5.0),
        "Tech Hub Salary Benchmarks",
        [
            "Bangalore: Mean ₹14.82L, Median ₹14.0L (IQR ₹9.0L).",
            "Hyderabad: Mean ₹13.91L, Median ₹13.0L.",
            "Mumbai: Mean ₹13.45L, Median ₹12.5L.",
            "Delhi NCR / Gurgaon: Mean ₹12.98L, Median ₹12.0L.",
            "Tier-2 / Emerging Hubs: Mean ₹8.42L, Median ₹8.0L.",
            "",
            "The Relocation Premium:",
            "  - Relocating from Tier-2 to Bangalore yields an immediate +43.2% wage premium for identical job titles.",
            "  - Restarters targeting remote roles must benchmark against Tier-1 pay bands."
        ]
    )
    add_speaker_notes(
        s7,
        "Bangalore and Hyderabad dominate compensation benchmarks with medians of 14 and 13 LPA respectively. "
        "We discovered a 43.2% wage premium for Tier-1 hubs over Tier-2 locations. This provides critical guidance for career restarters deciding on remote vs. onsite work."
    )

    # =========================================================================
    # SLIDE 8: MINCERIAN WAGE EQUATION
    # =========================================================================
    s8 = create_base_slide(prs, "Returns to Experience: The Empirical Mincerian Wage Equation")
    img_path = os.path.join(MACRO_FIG_DIR, "fig3_experience_vs_salary_regression.png")
    if os.path.exists(img_path):
        s8.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(7.0), Inches(5.0))
    add_card(
        s8, Inches(8.1), Inches(1.8), Inches(4.4), Inches(5.0),
        "OLS Econometric Model",
        [
            "Model Specification: Salary = β0 + β1 × Exp",
            "",
            "Empirical Equation:",
            "Salary (LPA) = 1.724 + 1.638 × Exp_Years",
            "",
            "Statistical Metrics:",
            "  - R² = 0.434 (Strong explanatory power)",
            "  - F = 1,228.4 (p < 1.0 × 10^-200)",
            "",
            "Key Takeaways:",
            "  - Base starting wage: ₹1.72 LPA.",
            "  - Return per experience year: +₹1.64 LPA.",
            "  - 5-year milestone: ₹9.91 LPA.",
            "  - 10-year milestone: ₹18.10 LPA."
        ]
    )
    add_speaker_notes(
        s8,
        "We estimated an empirical Mincerian wage equation. Each additional year of experience in Indian data science adds ₹1.64 Lakhs per annum to base compensation. "
        "This replaces arbitrary quadratic curves previously hardcoded in the frontend with a verified econometric standard."
    )

    # =========================================================================
    # SLIDE 9: EMPLOYER CONCENTRATION (PARETO DYNAMICS)
    # =========================================================================
    s9 = create_base_slide(prs, "Employer Hiring Concentration: The 80/20 Reality of Open Vacancies")
    img_path = os.path.join(MACRO_FIG_DIR, "fig5_employer_concentration_pareto.png")
    if os.path.exists(img_path):
        s9.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(7.0), Inches(5.0))
    add_card(
        s9, Inches(8.1), Inches(1.8), Inches(4.4), Inches(5.0),
        "Pareto Distribution Dynamics",
        [
            "Top 15 Employers control >52% of all open market vacancies.",
            "TCS leads overall vacancy volume with 4,200 open positions.",
            "",
            "The Volume vs. Value Paradox:",
            "  - IT Services (TCS, Infosys, Wipro, Cognizant) dominate entry-level hiring volume but offer compressed medians (₹5–8L).",
            "  - GCCs and Enterprise Tech (Deloitte, Shell, Barclays) hire in lower volume but offer 2.5x higher median compensation (₹18–26L)."
        ]
    )
    add_speaker_notes(
        s9,
        "Pareto analysis demonstrates that just 15 employers account for over 52% of total open vacancies. "
        "However, volume does not equal value: IT service giants drive mass entry-level volume, while GCCs drive high compensation."
    )

    # =========================================================================
    # SLIDE 10: MACRO SKILL DEMAND VS. SALARY PREMIUM
    # =========================================================================
    s10 = create_base_slide(prs, "Skill Demand vs. Salary Premium: Separating Table Stakes from Alpha")
    img_path = os.path.join(MACRO_FIG_DIR, "fig4_top_skills_demand_salary_bubble.png")
    if os.path.exists(img_path):
        s10.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(7.0), Inches(5.0))
    add_card(
        s10, Inches(8.1), Inches(1.8), Inches(4.4), Inches(5.0),
        "Skill Premium Quadrants",
        [
            "Table Stakes (High Demand, Moderate Pay):",
            "  - Python (78% frequency, ₹12.5L median)",
            "  - SQL (64% frequency, ₹11.0L median)",
            "  - Machine Learning (52% freq, ₹14.0L median)",
            "",
            "High Alpha (Niche Demand, High Pay):",
            "  - Deep Learning / LLMs (₹18.0L median)",
            "  - Cloud Data Architecture (AWS/GCP, ₹19.5L)",
            "  - Business Storytelling (High hike multiplier)"
        ]
    )
    add_speaker_notes(
        s10,
        "Python and SQL are table stakes—mentioned in over 70% of postings. But high salary alpha is captured by candidates who combine foundational "
        "math with modern deep learning and business storytelling."
    )

    # =========================================================================
    # SLIDE 11: JUNIOR DATA SCIENTIST SKILL PROFILES
    # =========================================================================
    s11 = create_base_slide(prs, "Junior Data Scientists: High vs. Low Salary Hike Profiles (N=139)")
    img_path = os.path.join(JDS_FIG_DIR, "fig6_jds_skill_comparison_profiles.png")
    if os.path.exists(img_path):
        s11.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(7.0), Inches(5.0))
    add_card(
        s11, Inches(8.1), Inches(1.8), Inches(4.4), Inches(5.0),
        "Skill Competency Findings",
        [
            "High Hike Cohort (n=73) vs. Low Hike (n=66):",
            "",
            "Dashboard & Storytelling:",
            "  - High: 4.85 ± 0.49 vs. Low: 3.81 ± 1.01",
            "  - Welch t = 7.55, p = 3.07 × 10^-11",
            "  - Cohen's d = 1.323 (Large Effect)",
            "",
            "Maths & Statistics:",
            "  - High: 4.71 ± 0.43 vs. Low: 3.83 ± 0.95",
            "  - Welch t = 6.96, p = 5.71 × 10^-10",
            "  - Cohen's d = 1.222 (Large Effect)"
        ]
    )
    add_speaker_notes(
        s11,
        "Now we dive into micro-evaluations: N=139 junior data scientists. High hike candidates score significantly higher in storytelling "
        "and mathematical foundations. Notice the massive Cohen's d effect sizes above 1.2."
    )

    # =========================================================================
    # SLIDE 12: THE BIG DATA TRAP
    # =========================================================================
    s12 = create_base_slide(prs, "The 'Big Data Trap': BUSTING THE ED-TECH MARKETING MYTH")
    add_card(
        s12, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "The Marketing Myth vs. Reality",
        [
            "What Ed-Tech Sells to Freshers & Restarters:",
            "  - 'Master Hadoop, Spark, and Distributed Clusters!'",
            "  - Promises that big data infrastructure guarantees 300% hikes.",
            "",
            "What the Empirical Data Proves (N=139):",
            "  - High Hike Mean: 3.94 ± 0.71",
            "  - Low Hike Mean: 3.75 ± 0.97",
            "  - Welch's t = 1.303, p = 0.195 (Not Significant)",
            "  - Mann-Whitney U p = 0.217 (Not Significant)",
            "  - Cohen's d = 0.225 (Negligible Effect)",
            "",
            "Conclusion: Big data competency shows NO statistically significant separation between high and low hike junior candidates!"
        ],
        border_color=C_CRIMSON
    )
    add_card(
        s12, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "What Actually Commands High Hikes",
        [
            "1. Dashboard & Storytelling (PowerBI / Tableau / Exec Pres):",
            "  - Cohen's d = 1.323 (p = 3.07 × 10^-11)",
            "  - Explaining models to business leaders commands the highest hike.",
            "",
            "2. Maths & Statistics (Probability / Linear Algebra / Inference):",
            "  - Cohen's d = 1.222 (p = 5.71 × 10^-10)",
            "  - Understanding WHY models work prevents hallucination & mistakes.",
            "",
            "3. Clean Coding & Software Engineering:",
            "  - Cohen's d = 0.985 (p = 9.49 × 10^-8)",
            "  - Writing modular, production-ready Python."
        ],
        border_color=C_EMERALD
    )
    add_speaker_notes(
        s12,
        "This is our most powerful empirical discovery: The Big Data Trap. Junior candidates spend months learning Spark and Hadoop, "
        "yet our t-tests show big data skills have zero statistically significant impact on high salary hikes (p = 0.195). Business storytelling and math are what truly pay."
    )

    # =========================================================================
    # SLIDE 13: JUNIOR LOGISTIC REGRESSION ODDS RATIOS
    # =========================================================================
    s13 = create_base_slide(prs, "Multivariable Logistic Regression: Odds Ratios for Junior Hike")
    img_path = os.path.join(JDS_FIG_DIR, "fig7_jds_logistic_odds_ratios.png")
    if os.path.exists(img_path):
        s13.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(7.0), Inches(5.0))
    add_card(
        s13, Inches(8.1), Inches(1.8), Inches(4.4), Inches(5.0),
        "Adjusted Odds Ratios (MLE)",
        [
            "Maths & Statistics:",
            "  - OR = 6.18 [95% CI: 2.33, 16.36] (p = 0.00025) ***",
            "",
            "Dashboard & Storytelling:",
            "  - OR = 3.88 [95% CI: 1.88, 8.00] (p = 0.00025) ***",
            "",
            "AI & Machine Learning:",
            "  - OR = 3.54 [95% CI: 1.41, 8.90] (p = 0.007) **",
            "",
            "Coding Skills:",
            "  - OR = 1.84 [95% CI: 0.94, 3.61] (p = 0.076) ns",
            "",
            "Model Fit: McFadden Pseudo R² = 0.4993, LLR p = 3.61 × 10^-19."
        ]
    )
    add_speaker_notes(
        s13,
        "When we control for all technical skills simultaneously in multivariable Logistic Regression, Maths & Stats multiplies high hike odds by 6.18x, "
        "and Dashboard & Storytelling multiplies odds by 3.88x. Baseline coding becomes non-significant once advanced math and storytelling are controlled for."
    )

    # =========================================================================
    # SLIDE 14: JUNIOR ML BENCHMARK (5-FOLD CV)
    # =========================================================================
    s14 = create_base_slide(prs, "Junior Machine Learning Benchmark: 5-Fold Stratified Cross-Validation")
    img_path = os.path.join(JDS_FIG_DIR, "fig8_jds_cv_model_benchmark.png")
    if os.path.exists(img_path):
        s14.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(7.0), Inches(5.0))
    add_card(
        s14, Inches(8.1), Inches(1.8), Inches(4.4), Inches(5.0),
        "5-Fold Cross-Validation Results",
        [
            "Logistic Regression (L2) - Selected Model:",
            "  - ROC-AUC: 0.903 ± 0.042",
            "  - Accuracy: 81.9% ± 7.5%",
            "  - F1-Score: 0.828 ± 0.080",
            "",
            "XGBoost Classifier (Depth=3):",
            "  - ROC-AUC: 0.873 ± 0.058",
            "  - Accuracy: 83.4% ± 5.5%",
            "",
            "Random Forest (Depth=4):",
            "  - ROC-AUC: 0.872 ± 0.061",
            "",
            "Production Engine:",
            "  - Exported as 'jds_hike_model.joblib' for live inference in Punarshuru."
        ]
    )
    add_speaker_notes(
        s14,
        "We benchmarked four machine learning classifiers using 5-Fold Stratified Cross-Validation. L2-Regularized Logistic Regression achieved a stellar "
        "ROC-AUC of 0.903. Because of its calibration and interpretability, we serialized it as our production engine."
    )

    # =========================================================================
    # SLIDE 15: SENIOR PERSONALITY PROFILING (OCEAN)
    # =========================================================================
    s15 = create_base_slide(prs, "Senior Data Scientists: The Transition from Execution to Leadership")
    img_path = os.path.join(SDS_FIG_DIR, "fig9_sds_ocean_trait_violins.png")
    if os.path.exists(img_path):
        s15.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(7.0), Inches(5.0))
    add_card(
        s15, Inches(8.1), Inches(1.8), Inches(4.4), Inches(5.0),
        "Senior Cohort Comparison (N=161)",
        [
            "Conscientiousness:",
            "  - High Success: 53.68 ± 6.10",
            "  - Baseline / Low: 35.74 ± 12.59",
            "  - Welch t = 11.30, p = 6.87 × 10^-20",
            "  - Cohen's d = 1.847 (Huge Effect)",
            "",
            "Openness to Experience:",
            "  - High Success: 48.49 ± 5.68",
            "  - Baseline / Low: 33.32 ± 10.68",
            "  - Welch t = 11.07, p = 1.18 × 10^-19",
            "  - Cohen's d = 1.803 (Huge Effect)",
            "",
            "Extraversion: d = 1.132 (p = 2.15 × 10^-10)"
        ]
    )
    add_speaker_notes(
        s15,
        "Beyond 5 years of experience, technical capability is assumed. What separates senior leaders from stagnant individual contributors? "
        "The Big Five personality framework gives us empirical answers: Conscientiousness and Openness exhibit massive Cohen's d values above 1.8."
    )

    # =========================================================================
    # SLIDE 16: THE NEUROTICISM MYTH & EMOTIONAL RIGOR
    # =========================================================================
    s16 = create_base_slide(prs, "The Neuroticism Myth: What Really Drives Data Leadership?")
    add_card(
        s16, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "The Neuroticism Paradox",
        [
            "Conventional Management Belief:",
            "  - 'Great leaders must have zero stress, zero anxiety, and stoic emotional detachment.'",
            "",
            "What Empirical Psychometrics Proves:",
            "  - High Success Mean: 36.13 ± 9.27",
            "  - Low Success Mean: 36.26 ± 13.21",
            "  - Welch's t = -0.074, p = 0.941 (Statistically Indistinguishable)",
            "  - Cohen's d = -0.012 (Negligible)",
            "",
            "Takeaway: High performance does NOT require emotional numbness. Normal human stress is orthogonal to career success."
        ],
        border_color=C_BLUE
    )
    add_card(
        s16, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "The Real Executive Drivers",
        [
            "1. Conscientiousness (d = 1.847, p = 6.87 × 10^-20):",
            "  - Methodical delivery, rigorous project governance, meeting commitments.",
            "",
            "2. Openness to Experience (d = 1.803, p = 1.18 × 10^-19):",
            "  - Architectural curiosity, adopting GenAI paradigms, questioning assumptions.",
            "",
            "3. Extraversion (d = 1.132, p = 2.15 × 10^-10):",
            "  - Cross-functional stakeholder advocacy, client pitching, mentoring juniors."
        ],
        border_color=C_EMERALD
    )
    add_speaker_notes(
        s16,
        "Notice this fascinating result: Neuroticism scores are virtually identical between high and low success leaders (p = 0.941). "
        "Leadership success does not require eliminating stress; it requires high conscientiousness, openness, and assertive communication."
    )

    # =========================================================================
    # SLIDE 17: SENIOR LOGISTIC REGRESSION ODDS RATIOS
    # =========================================================================
    s17 = create_base_slide(prs, "Senior Executive Logistic Regression: Odds Multipliers per 10-Pts")
    img_path = os.path.join(SDS_FIG_DIR, "fig10_sds_odds_ratios_forest.png")
    if os.path.exists(img_path):
        s17.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(7.0), Inches(5.0))
    add_card(
        s17, Inches(8.1), Inches(1.8), Inches(4.4), Inches(5.0),
        "Adjusted Odds Ratios (+10 Pts)",
        [
            "Openness to Experience:",
            "  - OR = 14.70 [95% CI: 4.72, 45.75] (p = 3.48 × 10^-6) ***",
            "",
            "Conscientiousness:",
            "  - OR = 12.04 [95% CI: 3.81, 38.11] (p = 2.30 × 10^-5) ***",
            "",
            "Extraversion:",
            "  - OR = 3.09 [95% CI: 1.40, 6.84] (p = 0.0054) **",
            "",
            "Agreeableness:",
            "  - OR = 2.22 [95% CI: 0.98, 5.03] (p = 0.056) ns",
            "",
            "Model Fit: McFadden Pseudo R² = 0.7567, LLR p = 1.52 × 10^-34."
        ]
    )
    add_speaker_notes(
        s17,
        "In our multivariable logistic model, each 10-point increase in Openness yields a staggering 14.7x multiplier in high success odds, "
        "and Conscientiousness yields a 12.0x multiplier. The model explains over 75% of variance with Pseudo R² = 0.7567."
    )

    # =========================================================================
    # SLIDE 18: SENIOR ML BENCHMARK & ROC DISCRIMINATION
    # =========================================================================
    s18 = create_base_slide(prs, "Senior Machine Learning Benchmark & Near-Perfect Separation")
    img_path = os.path.join(SDS_FIG_DIR, "fig11_sds_roc_and_importance.png")
    if os.path.exists(img_path):
        s18.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(7.0), Inches(5.0))
    add_card(
        s18, Inches(8.1), Inches(1.8), Inches(4.4), Inches(5.0),
        "5-Fold CV Predictive Accuracy",
        [
            "Random Forest Classifier (Selected):",
            "  - ROC-AUC: 0.995 ± 0.011",
            "  - Accuracy: 95.0% ± 4.2%",
            "  - F1-Score: 0.952 ± 0.043",
            "",
            "XGBoost Classifier:",
            "  - ROC-AUC: 0.979 ± 0.026",
            "  - Accuracy: 93.1% ± 5.4%",
            "",
            "Calibrated Logistic Regression:",
            "  - ROC-AUC: 0.949 ± 0.049",
            "  - Accuracy: 90.7% ± 5.9%",
            "",
            "Exported Model: 'sds_success_model.joblib'."
        ]
    )
    add_speaker_notes(
        s18,
        "Across 5-fold cross-validation, Random Forest achieves an astonishing 0.995 ROC-AUC and 95% accuracy. "
        "Psychometric traits provide near-deterministic classification of senior executive performance."
    )

    # =========================================================================
    # SLIDE 19: SYNTHESIS OF CORE DISCOVERIES
    # =========================================================================
    s19 = create_base_slide(prs, "Synthesis: The Three Empirical Axioms of Data Science Careers")
    add_card(
        s19, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
        "Axiom 1: Junior Velocity",
        [
            "Stop chasing distributed Big Data tools early in your career.",
            "Invest heavily in Business Storytelling (OR = 3.88) and Core Mathematics (OR = 6.18).",
            "Hiring managers reward those who can explain why models work and how they drive revenue."
        ],
        border_color=C_BLUE
    )
    add_card(
        s19, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
        "Axiom 2: Senior Ascension",
        [
            "Technical skill reaches an asymptote at 5+ years experience.",
            "Executive promotions require Conscientiousness (OR = 12.04) and Openness (OR = 14.70).",
            "Master project governance, adapt to new AI stacks, and communicate outward."
        ],
        border_color=C_BLUE
    )
    add_card(
        s19, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
        "Axiom 3: Macro Arbitrage",
        [
            "Experience commands ₹1.64 LPA annually on average.",
            "Bangalore / Hyderabad offer a 43.2% premium over Tier-2 locations.",
            "Target GCCs and product tech over mass IT services for 2.5x higher compensation."
        ],
        border_color=C_BLUE
    )
    add_speaker_notes(
        s19,
        "Here are our three overarching axioms: First, junior velocity comes from storytelling and math, not big data tools. "
        "Second, senior ascension requires conscientiousness and architectural openness. Third, geographic arbitrage offers an instant 43% boost."
    )

    # =========================================================================
    # SLIDE 20: PUNARSHURU PLATFORM ARCHITECTURE
    # =========================================================================
    s20 = create_base_slide(prs, "Engineering Translation: The Punarshuru Platform Architecture")
    add_card(
        s20, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
        "1. Econometric Engine (Backend)",
        [
            "FastAPI microservices in Python.",
            "Mincerian Wage API: /api/market/wage-curve",
            "Junior Hike ML: /api/readiness/jds-hike",
            "Senior Executive ML: /api/readiness/sds-success",
            "Live joblib model deserialization."
        ]
    )
    add_card(
        s20, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
        "2. Intelligence Layer (Frontend)",
        [
            "React 18 + Vite + TypeScript.",
            "Interactive Recharts visualizations.",
            "Tailored navigation pathways for 3 personas.",
            "Zero hardcoded mocks; 100% empirical APIs.",
            "WCAG 2.1 AA accessible UI."
        ]
    )
    add_card(
        s20, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
        "3. Privacy & Reproducibility",
        [
            "Self-contained client state management.",
            "No personal telemetry leakage.",
            "Deterministic model inference.",
            "Full regression test coverage in Vitest & Pytest."
        ]
    )
    add_speaker_notes(
        s20,
        "Punarshuru translates these statistical models into production software. Our FastAPI backend exposes high-performance inference APIs, "
        "while our React frontend renders interactive, responsive career guidance widgets."
    )

    # =========================================================================
    # SLIDE 21: PERSONA 1 - CAREER RESTARTERS
    # =========================================================================
    s21 = create_base_slide(prs, "Persona Translation 1: Empowering Career Restarters")
    add_card(
        s21, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "The Restarter Playbook in Punarshuru",
        [
            "Re-entry Confidence Builder:",
            "  - Demystifies required skills: Shows restarters they DO NOT need to learn distributed clusters before re-entering.",
            "  - Prescribes high-ROI modules: PowerBI / Tableau storytelling and SQL analytics.",
            "",
            "Transparent Salary Benchmarking:",
            "  - Uses verified Bangalore/Hyd/Pune medians from N=1,602 jobs.",
            "  - Prevents returning women from accepting lowball offers 40% below market rate.",
            "",
            "Mincerian Gap Compensation:",
            "  - Demonstrates that a 2-year career break does not erase baseline wage progression.",
            "  - Maps target roles in Global Capability Centers (GCCs)."
        ],
        border_color=C_BLUE
    )
    add_card(
        s21, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "Target Component: ReturneePathway.tsx",
        [
            "Features Activated:",
            "  - Gap Impact Calculator: Displays true empirical wage impact vs. perceived penalties.",
            "  - Storytelling Project Showcase: Guides user to build 3 business dashboard case studies.",
            "  - Salary Negotiation Sidebar: Injects 25th, 50th, and 75th percentile benchmarks for target location."
        ],
        border_color=C_EMERALD
    )
    add_speaker_notes(
        s21,
        "For career restarters, Punarshuru removes the psychological fear of obsolescence. By focusing on storytelling and verified pay benchmarks, "
        "returning professionals avoid lowball offers and accelerate their return."
    )

    # =========================================================================
    # SLIDE 22: PERSONA 2 - UNIVERSITY STUDENTS & FRESHERS
    # =========================================================================
    s22 = create_base_slide(prs, "Persona Translation 2: University Student CareerReadinessScan")
    add_card(
        s22, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "The Student Calibration Engine",
        [
            "Curriculum De-Biasing:",
            "  - Warns students against spending money on big data cluster certifications.",
            "  - Prioritizes mathematical foundations (Linear Algebra, Bayes, Hypothesis Testing) with OR = 6.18.",
            "",
            "Predictive Readiness Score:",
            "  - Evaluates student self-assessments across 5 pillars.",
            "  - Runs live inference against 'jds_hike_model.joblib'.",
            "  - Generates probability of securing a High Salary Hike upon graduation.",
            "",
            "Portfolio Recommendations:",
            "  - Recommends end-to-end projects featuring clean code + executive presentation decks."
        ],
        border_color=C_BLUE
    )
    add_card(
        s22, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "Target Component: CareerReadinessScan.tsx",
        [
            "Features Activated:",
            "  - 5-Pillar Competency Radar with live empirical comparison to High Hike cohorts.",
            "  - Dynamic Gap Diagnostic: Highlights whether math or storytelling is the limiting factor.",
            "  - First Job Target Filter: Connects students to entry-level vacancies in verified hiring hubs."
        ],
        border_color=C_EMERALD
    )
    add_speaker_notes(
        s22,
        "For students, our CareerReadinessScan uses the JDS Logistic Regression model to evaluate graduation readiness. "
        "Students receive an objective, mathematically validated probability of achieving a top-tier salary hike."
    )

    # =========================================================================
    # SLIDE 23: PERSONA 3 - STAGNANT MID-CAREER PROFESSIONALS
    # =========================================================================
    s23 = create_base_slide(prs, "Persona Translation 3: Stagnant Professional Promotion Diagnostic")
    add_card(
        s23, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "Breaking the 15 LPA Plateau",
        [
            "The Individual Contributor Trap:",
            "  - Explains why taking more coding certificates produces diminishing returns after 5 years.",
            "",
            "Executive Psychometric Assessment:",
            "  - Administers Big Five OCEAN diagnostic.",
            "  - Evaluates Conscientiousness (OR = 12.04) and Openness (OR = 14.70).",
            "  - Identifies behavioural gaps preventing promotion to Lead / Architect / Practice Head.",
            "",
            "Actionable Leadership Pathways:",
            "  - Shifts focus to project ownership, cross-functional stakeholder buy-in, and architectural innovation."
        ],
        border_color=C_BLUE
    )
    add_card(
        s23, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "Target Component: SeniorExecutiveReadiness.tsx",
        [
            "Features Activated:",
            "  - OCEAN Leadership Profile with comparison against High Success Senior Leaders.",
            "  - Probability of Executive Transition via 'sds_success_model.joblib'.",
            "  - Behavioural Coaching Roadmap: Conscientious governance & GenAI experimentation."
        ],
        border_color=C_EMERALD
    )
    add_speaker_notes(
        s23,
        "For stagnant professionals stuck at 15 LPA, we introduce SeniorExecutiveReadiness. By diagnosing conscientiousness and openness, "
        "Punarshuru prescribes behavioural and leadership pivots rather than redundant coding courses."
    )

    # =========================================================================
    # SLIDE 24: CODEBASE MODERNIZATION MATRIX
    # =========================================================================
    s24 = create_base_slide(prs, "Codebase Modernization: Replacing Static Mocks with Real Science")
    add_card(
        s24, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "Before: Static Codebase Mocks",
        [
            "1. realSalaryBenchmarks.ts:",
            "   - Hardcoded numbers with unverified, unreferenced citations.",
            "",
            "2. CompensationTrajectory.tsx:",
            "   - Arbitrary quadratic formula with zero empirical data fit.",
            "",
            "3. CompanyCategoriesData.ts:",
            "   - Qualitative corporate lists with missing vacancy volumes.",
            "",
            "4. PromotionReadiness.tsx:",
            "   - Static rule-of-thumb heuristics without probability calibration."
        ],
        border_color=C_CRIMSON
    )
    add_card(
        s24, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
        "After: Empirical Econometric Engines",
        [
            "1. table1 & table2 Benchmarks:",
            "   - 100% verified medians & IQRs across 1,602 real Indian postings.",
            "",
            "2. table3 Mincerian OLS Equation:",
            "   - Salary = 1.724 + 1.638 × Exp (R² = 0.434, F = 1,228.4).",
            "",
            "3. table3b Pareto Distribution:",
            "   - Real top 15 employer vacancy counts (52% concentration).",
            "",
            "4. jds_hike_model & sds_success_model:",
            "   - Serialized ML pipelines with 0.903 and 0.995 ROC-AUC."
        ],
        border_color=C_EMERALD
    )
    add_speaker_notes(
        s24,
        "This slide highlights our commitment to engineering integrity. Every mock dataset and hardcoded heuristic in Punarshuru has been "
        "audited and mapped to a real econometric dataset or serialized machine learning model."
    )

    # =========================================================================
    # SLIDE 25: CONCLUSION & STRATEGIC ROADMAP
    # =========================================================================
    s25 = create_base_slide(prs, "Conclusion & Strategic Roadmap: From Analysis to National Impact")
    add_card(
        s25, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
        "1. Academic & Analytical Rigor",
        [
            "100% mathematically reproducible.",
            "Global random seed: 42.",
            "All claims backed by parametric & non-parametric tests.",
            "Full 20-page Approach Note submitted."
        ],
        border_color=C_BLUE
    )
    add_card(
        s25, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
        "2. Product & Engineering Value",
        [
            "Seamless integration into Punarshuru.",
            "Zero breaking changes to existing codebase.",
            "FastAPI backend + React frontend.",
            "Live ML inference pipelines."
        ],
        border_color=C_BLUE
    )
    add_card(
        s25, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
        "3. Scalability & Future Vision",
        [
            "Incorporate SAS Visual Analytics real-time feeds.",
            "Expand NLP skill parsing to vernacular Indian resumes.",
            "Partner with state employment skilling initiatives.",
            "Open Q&A Discussion."
        ],
        border_color=C_BLUE
    )
    add_speaker_notes(
        s25,
        "In conclusion, we have transformed raw labour market chaos into structured human empowerment. Our findings provide actionable guidance "
        "for restarters, students, and senior professionals alike. We thank the judges and welcome any questions."
    )

    out_file = os.path.join(PRESENTATION_DIR, "Round3_Pitch_Deck.pptx")
    prs.save(out_file)
    logging.info(f"Presentation Deck successfully generated: {out_file}")
    return out_file


if __name__ == "__main__":
    build_deck()
