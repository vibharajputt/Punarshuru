# Punarshuru × SAS Hackathon — Phase 1: Data Audit & Cleaning Log
**Execution Timestamp:** 2026-10-07T11:03:03.024381Z  
**Random State:** 42  
**Author:** Vibha Rajput (Punarshuru Core Team)  
**Deliverable Context:** Round 2 Approach Note (Section 3: Data Exploration & Manipulation, 25 Marks)

---

## Executive Summary of Data Integrity Audits

| Dataset | Raw Records | Cleaned Records | Key Flaws Detected | Remediation Strategy |
| :--- | :---: | :---: | :--- | :--- |
| **DataScience_Jobs** | 1,602 | 1,602 | 142 duplicate `reference_no`s; salary strings with `'L'`; extreme right-skew in `num_of_jobs` (max 4,200). | Parsed strings to float LPA; verified `reference_no` is non-unique batch key (0 exact duplicates); retained all rows with surrogate `ds_job_id`. |
| **Analytics_Jobs** | 15,841 | 14,689 | 1,001 exact content duplicates; 157 junk spam/data-entry postings; 76% missing `job_type`; messy multi-city strings. | Dropped 1,001 exact duplicates & 157 spam postings; mapped ordinal salary bands (0..5); extracted experience bounds; normalized cities into Primary Hubs & Metro Tiers. |
| **JDS_Skill_Traits** | 139 | 139 | 2 duplicate IDs; small sample ($N=139$). | Verified ID collisions had different test scores; assigned unique `jds_id`; confirmed balanced target ({1: 73, 0: 66}); mandated Stratified 5-Fold CV. |
| **SDS_Personality_Traits** | 161 | 161 | 9 duplicate IDs; stray whitespace in column names (`' extraversion'`); small sample ($N=161$). | Stripped whitespace in column names; verified distinct trait measurements; assigned `sds_id`; confirmed balanced target ({1: 85, 0: 76}); mandated Stratified 5-Fold CV. |

---

## Detailed Dataset Audits & Justifications

### 1. DataScience_Jobs.csv (Macro Hiring Demand)
- **Raw Dimensions:** 1602 rows × 8 columns
- **Salary String Parsing:** Converted string expressions (`min_salary`, `avg_salary`, `max_salary`) containing `'L'` into clean numeric LPA floats (`min_salary_lpa`, `avg_salary_lpa`, `max_salary_lpa`).
- **Duplicate ID Analysis:** Exactly 142 duplicate `reference_no` values found. Content verification proved that duplicate IDs represent completely different enterprise employers (e.g. ID `1024` was assigned to both *Exl India* and *IHS Markit*). Exactly **0** rows were duplicates across content.
  - *Decision:* Retain all 1,602 rows; archive `raw_reference_no`; assign unique primary key `ds_job_id`.
- **Hiring Volume Right-Skewness:** `num_of_jobs` exhibits extreme skewness (**12.8**), with a median of **22.0** and max of **4,200.0** (TCS Business Analyst).
  - *Decision:* In all market analyses, compute both **unweighted listing medians** and **vacancy-weighted medians** to capture true economic absorption.
- **Experience Outlier Verification:** 19 rows had `min_experience > 10` (up to 21 years).
  - *Decision:* All 19 rows represent verified enterprise *Data Architect* postings at Tier-1 companies (Deloitte, Shell, Barclays) commanding up to 40 LPA. Preserved as valid senior-tier observations.

### 2. Analytics_Jobs.csv (Granular Skills & Salaries)
- **Raw Dimensions:** 15,841 rows × 8 columns
- **Exact Duplicate Deduplication:** 1,001 rows were exact content duplicates across job description, designation, skills, location, and salary.
  - *Decision:* Deduplicated, reducing dataset to 14,840 unique postings.
- **Spam / Non-Tech Removal:** Detected 151 rows advertising "Data Entry Operator", "Home Based Job", or "Freelance Content Writer".
  - *Decision:* Filtered out to avoid contaminating high-value data science and analytics salary modeling. Final clean count: **14,689** postings.
- **Salary Categorization:** Transformed binned salary strings into ordinal ranks (0 = `0to3`, 1 = `3to6`, 2 = `6to10`, 3 = `10to15`, 4 = `15to25`, 5 = `25to50`), as well as lower, upper, and midpoint numeric LPA estimates.
- **Experience Extraction:** Extracted `exp_min`, `exp_max`, and `exp_mid` from textual ranges (e.g. `"6-10 yrs"` $	o$ 6, 10, 8).
- **Location Normalization:** Parsed messy comma-separated locations into:
  - `primary_city` (e.g. Bengaluru, Mumbai, Gurugram, Pune, Hyderabad, Delhi NCR, Noida, Chennai, etc.)
  - `metro_tier` (Tier-1 vs Tier-2/3 vs Remote)
  - `is_multi_city` (Boolean flag)

### 3. JDS_Skill_Traits.xlsx (Junior Data Scientist Technical Competencies)
- **Raw Dimensions:** 139 rows × 7 columns
- **Sample Integrity:** Balanced binary target (73 High Hike vs 66 Low Hike).
- **Competency Score Means (1.0–5.0 Scale):**
{
  "big_data_skills": 3.85,
  "maths_stats_skills": 4.29,
  "coding_skills": 4.27,
  "ai_and_ml_skills": 4.57,
  "dashboard_and_storytelling_skills": 4.36
}
- **Methodological Safeguard:** Small sample size ($N=139$) renders single train/test splits statistically fragile. **Stratified 5-Fold Cross-Validation** and L2/ElasticNet regularization will be strictly enforced in Phase 2 modeling.

### 4. SDS_Personality_Traits.xlsx (Senior Data Scientist Big Five Traits)
- **Raw Dimensions:** 161 rows × 7 columns
- **Column Standardization:** Fixed malformed column names including leading spaces in `' extraversion'` and irregular spacing in `'success_ classification_ high_low'`.
- **Sample Integrity:** Balanced binary target (85 High Success vs 76 Low Success).
- **OCEAN Trait Score Means (Normalized 0–100 Scale):**
{
  "neuroticism": 36.19,
  "extraversion": 43.2,
  "openness_to_experience": 41.33,
  "agreeableness": 44.6,
  "conscientiousness": 45.21
}
- **Methodological Safeguard:** Small sample size ($N=161$) strictly requires cross-validated logistic regression and permutation significance tests to avoid overfitting.

---
*Cleaned data files are stored in `analytics/data/processed/` ready for Phase 2 Statistical & Machine Learning Modeling.*
