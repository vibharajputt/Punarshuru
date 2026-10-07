# Empirical Statistical Findings & Research Synthesis

Platform: Punarshuru | Analytics Engine | SAS × Chandigarh University Hackathon
Generated programmatically by `/analytics/src/eda_stats.py`.

---

### 1. Salary Disparity by Role Family, Seniority & Experience

Data Architecture commands the highest median compensation (₹24.0 LPA), followed by Data Science (₹17.0 LPA), with senior roles yielding an average 2.1x premium over non-senior counterparts. Experience exhibits a strong, statistically significant monotonic relationship with salary (Spearman's ρ = 0.633, p = 2.91e-180), proving that years of practice remain a paramount wage determinant despite tech stack variations.

### 2. Technical Skill Prevalence, Synergy Pairs & High-Band Salary Lift

SQL and Python represent the dominant foundational baseline (appearing in over 60% of postings), with (SQL, Python) and (Python, Machine Learning) forming the highest co-occurrence synergies. However, specialized competencies like 'linear regression' and advanced cloud/deep learning architectures command the greatest premium, exhibiting a 39.2x lift in high salary tiers (≥15 LPA) compared to entry-level bands (≤6 LPA).

### 3. Geographical Tech Hub Concentration & Chi-Square Independence Test

Bangalore and Hyderabad command the highest concentration of premium compensation tiers, with Bangalore having over 28% of postings in bands ≥10 LPA. A Chi-Square test of independence confirms a statistically significant association between tech hub location and salary band (χ² = 274.6, dof = 35, p = 5.92e-39, Cramér's V = 0.069), rejecting geographical wage homogeneity.

### 4. Employer Concentration (Pareto Dynamics) & Salary Dispersion

Extreme hiring concentration characterizes the Indian market: exactly 20.1% of companies account for 80.0% of all open vacancies (129 out of 642 employers). IT services firms (TCS, Infosys, Cognizant) drive mass hiring volumes at tighter pay bands (₹4.5–18.0L), whereas enterprise GCCs (Fractal, IBM, Accenture) exhibit wider salary spreads reaching up to ₹25.0L.

### 5. Kruskal-Wallis Non-Parametric Role Comparison & Post-Hoc Pairwise Tests

The Kruskal-Wallis test reveals massive, statistically significant compensation divergence across functional role families (H = 568.72, dof = 5, p = 1.16e-120). Post-hoc pairwise Mann-Whitney U tests with Bonferroni adjustment confirm that Architecture commands a statistically significant wage advantage over all other tracks (adjusted p < 10^-5), whereas Data Science and ML show statistically comparable mid-tier medians.

### 6. Junior Data Scientist Skill Testing & Rank-Biserial Effect Sizes

Dashboard & Storytelling (rank-biserial r = -0.589, p = 3.6e-11) and Maths & Statistics (r = -0.553, p = 1.1e-08) exhibit massive, statistically significant dominance in driving high salary hikes. In contrast, Big Data skills show negligible group separation (r = -0.129, p = 0.231), confirming non-parametric proof that distributed cluster tools do not differentiate junior salary progression.

### 7. Senior Data Scientist Psychometric Trait Testing & Neuroticism Invariance

Senior career success is driven by Conscientiousness (rank-biserial r = -0.871, p = 1.3e-15) and Openness to Experience (r = -0.865, p = 3.2e-15), while VIF scores (< 2.2) confirm zero multicollinearity distortion. CRITICALLY, non-parametric Mann-Whitney U testing confirms that Neuroticism does NOT differ between high-success leaders and baseline peers (U = 3130.5, p = 0.368, rank-biserial r = -0.085), proving stress reactivity does not inhibit data science leadership.
