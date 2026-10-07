# Punarshuru AI Lab — Comprehensive Model Card

**Version:** 1.0.0  
**Date:** October 2026  
**License:** Evaluation Purpose Only (SAS × Chandigarh University National Hackathon)  
**Mathematical Reproducibility:** Global Seed 42

---

## 1. Executive Summary & Purpose

The Punarshuru predictive suite translates empirical labour market observations into personalised, deterministic career guidance. To maximize deployment agility, client and backend microservices can execute lightweight predictions using JSON model artifacts without requiring scikit-learn dependencies.

The suite comprises four specialized engines:
1. **Model A (JDS Salary Hike Engine):** Evaluates Junior Data Scientist technical competencies (1.0 to 5.0 scale) to predict the probability of achieving a top-quartile salary hike.
2. **Model B (SDS Executive Success Diagnostic):** Evaluates Senior Data Scientist Big Five personality traits (0 to 100 scale) to identify leadership transition readiness.
3. **Model C (Analytics Salary Band Predictor):** Estimates compensation bands (0 to 5) given experience, tech hub location, and skill profile.
4. **Model D (Skill Archetype Clustering):** Unsupervised latent semantic clustering classifying job descriptions into 5 foundational market archetypes.

---

## 2. Model Architectures & Cross-Validated Performance

All models were evaluated using rigorous cross-validation schemes:
- **Small Datasets (Models A & B):** Repeated 5x Stratified 5-Fold Cross-Validation (25 independent folds, `random_state=42`).
- **Large Dataset (Model C):** Stratified 5-Fold Cross-Validation (`random_state=42`).

### Benchmark Summary Table

| Model Group | Algorithm | Target | Accuracy (Mean ± SD) | F1-Score | ROC-AUC | Within-1-Band Acc |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Model A (JDS)** | **Logistic Regression (Std)** | `high_hike` | **81.4% ± 6.8%** | **0.824** | **0.898 ± 0.045** | N/A |
| Model A (JDS) | Decision Tree (Depth≤3) | `high_hike` | 76.9% ± 8.1% | 0.772 | 0.795 ± 0.078 | N/A |
| Model A (JDS) | Random Forest (Depth=4) | `high_hike` | 82.2% ± 7.2% | 0.831 | 0.871 ± 0.062 | N/A |
| **Model B (SDS)** | **Logistic Regression (Std)** | `high_success` | **90.4% ± 5.6%** | **0.912** | **0.951 ± 0.041** | N/A |
| Model B (SDS) | Decision Tree (Depth≤3) | `high_success` | 87.5% ± 6.4% | 0.884 | 0.894 ± 0.061 | N/A |
| Model B (SDS) | Random Forest (Depth=4) | `high_success` | 94.7% ± 4.5% | 0.951 | 0.993 ± 0.012 | N/A |
| **Model C (Bands)**| **Gradient Boosting (Depth=4)**| `salary_band` | **54.2% ± 0.8%** | **0.495** | N/A | **92.1% ± 0.4%** |
| Model C (Bands)| Random Forest (Depth=8) | `salary_band` | 51.8% ± 0.7% | 0.468 | N/A | 91.4% ± 0.5% |
| Model C (Bands)| Ordered Logistic (Baseline) | `salary_band` | 44.5% ± 1.1% | 0.392 | N/A | 87.2% ± 0.7% |

*Within-one-band accuracy indicates predictions within ±1 salary category of ground truth.*

---

## 3. Parametric Findings & Adjusted Odds Ratios

### Model A: Junior Technical Skills
Multivariable Logistic Regression (`statsmodels.Logit`) yields:
- **Maths & Statistics:** Adjusted $\text{OR} = 6.18$ ($95\%\text{ CI: } [2.33, 16.36], p = 0.00025$)
- **Dashboard & Storytelling:** Adjusted $\text{OR} = 3.88$ ($95\%\text{ CI: } [1.88, 8.00], p = 0.00025$)
- **AI & Machine Learning:** Adjusted $\text{OR} = 3.54$ ($95\%\text{ CI: } [1.41, 8.90], p = 0.0072$)
- **Coding Skills:** Adjusted $\text{OR} = 1.84$ ($p = 0.076$, non-significant once advanced math is controlled for)
- **Big Data Skills:** Adjusted $\text{OR} = 2.71$ ($p = 0.007$, though univariate separation is negligible)

### Model B: Senior Personality Dimensions
Multivariable Logistic Regression per +10 point trait increase:
- **Openness to Experience:** Adjusted $\text{OR} = 14.70$ ($95\%\text{ CI: } [4.72, 45.75], p = 3.48 \times 10^{-6}$)
- **Conscientiousness:** Adjusted $\text{OR} = 12.04$ ($95\%\text{ CI: } [3.81, 38.11], p = 2.30 \times 10^{-5}$)
- **Extraversion:** Adjusted $\text{OR} = 3.09$ ($95\%\text{ CI: } [1.40, 6.84], p = 0.0054$)
- **Agreeableness:** Non-significant ($p = 0.056$)
- **Neuroticism:** Univariate Mann-Whitney $U$ test proves **NO statistical difference** ($p = 0.368, r_{\text{rb}} = -0.085$) between high-success leaders and baseline peers.

---

## 4. Unsupervised Archetypes (Model D)

KMeans clustering on SVD-reduced TF-IDF skill representations uncovered 5 distinct clusters:
1. **Business Intelligence & SQL Analytics:** SQL, Tableau, Power BI, Excel, ETL (24.2% market share)
2. **Core Machine Learning & Data Science:** Python, Machine Learning, Scikit-learn, Deep Learning (21.5%)
3. **Cloud Data Engineering & Big Data:** AWS, Spark, Hadoop, Kafka, Airflow (18.8%)
4. **Software Engineering & Fullstack Systems:** Java, Spring, React, Microservices (19.4%)
5. **Operations, Quality & Process Analytics:** Six Sigma, Lean, Supply Chain, SAP (16.1%)

---

## 5. Critical Ethical Constraints & Model Limitations

> [!CAUTION]
> ### 1. Strict Prohibition on Automated Hiring / Gatekeeping Use
> **The Senior Personality Model (Model B) MUST NEVER BE USED AS A HIRING, SCREENING, CANDIDATE EVALUATION, OR FIRING FILTER.**  
> Using psychometric models for employment gatekeeping violates employment law, ethical AI guidelines, and EEOC fairness standards. In Punarshuru, Model B is strictly restricted to **candidate-facing personal self-reflection and voluntary coaching**.

### 2. Sample Size Constraints
The micro-assessment datasets comprise $N=137$ (JDS) and $N=152$ (SDS) observations. While repeated 5-fold cross-validation proves robust stability, these models must be refreshed as real platform telemetry scales.

### 3. Correlation vs. Causation
Observing that high-success leaders exhibit elevated Conscientiousness ($r_{\text{rb}} = -0.871$) represents an observational association, not a causal proof. Artificially inflating self-reported conscientiousness without actual project delivery will not cause career advancement.

### 4. Self-Reported Assessment Bias
Psychometric and skill assessment surveys may be vulnerable to social desirability bias. Predictions must be interpreted as advisory baselines.
