"""
Punarshuru × SAS Hackathon — Phase 2: Macro Job Market Analysis & Modeling
Script: analytics/src/02_eda_macro_market.py
Author: Vibha Rajput (Punarshuru Team)

Performs comprehensive statistical testing, exploratory data analysis,
and visualization on the macro Indian Data Science and Analytics job market:
1. Role salary comparisons & One-way ANOVA across roles & experience
2. Geographical tech hub salary disparity & ANOVA across Indian hubs
3. Experience-to-salary regression models (linear & logarithmic)
4. Employer hiring concentration (Pareto volume analysis)
5. Skill frequency and salary premium bubble mapping

Outputs:
- analytics/outputs/figures/macro_market/*.png (300 DPI publication-grade)
- analytics/outputs/tables/table1_*.csv, table2_*.csv, table3_*.csv
"""

import logging
from pathlib import Path
import numpy as np
import pandas as pd
import scipy.stats as stats
import statsmodels.api as sm
from statsmodels.formula.api import ols
import matplotlib.pyplot as plt
import seaborn as sns

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("macro_eda")

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "data" / "processed"
FIG_DIR = BASE_DIR / "outputs" / "figures" / "macro_market"
TABLE_DIR = BASE_DIR / "outputs" / "tables"

FIG_DIR.mkdir(parents=True, exist_ok=True)
TABLE_DIR.mkdir(parents=True, exist_ok=True)

# Publication plotting style
plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
plt.rcParams.update({
    "font.family": "sans-serif",
    "font.size": 10,
    "axes.titlesize": 12,
    "axes.titleweight": "bold",
    "axes.labelsize": 11,
    "axes.labelweight": "bold",
    "xtick.labelsize": 9,
    "ytick.labelsize": 9,
    "figure.titlesize": 14,
    "figure.titleweight": "bold",
    "figure.dpi": 300,
})

PUNARSHURU_NAVY = "#0B4F9C"
PUNARSHURU_ORANGE = "#F26B1D"
PUNARSHURU_TEAL = "#0284C7"
PUNARSHURU_DARK = "#0F172A"


def analyze_ds_roles_and_salaries(df_ds: pd.DataFrame):
    logger.info("Analyzing Data Science Jobs roles & salary distributions...")

    # Group statistics
    role_stats = df_ds.groupby("job_title").agg(
        postings=("ds_job_id", "count"),
        total_vacancies=("num_of_jobs", "sum"),
        min_salary_median=("min_salary_lpa", "median"),
        avg_salary_median=("avg_salary_lpa", "median"),
        max_salary_median=("max_salary_lpa", "median"),
        avg_salary_mean=("avg_salary_lpa", "mean"),
        avg_salary_std=("avg_salary_lpa", "std"),
        min_experience_mean=("min_experience", "mean"),
    ).reset_index().sort_values("avg_salary_median", ascending=False)

    role_stats.to_csv(TABLE_DIR / "table1_ds_roles_salary_descriptives.csv", index=False)
    logger.info("Saved table1_ds_roles_salary_descriptives.csv")

    # One-Way ANOVA: Does salary vary significantly across the 10 job titles?
    role_groups = [group["avg_salary_lpa"].dropna().values for _, group in df_ds.groupby("job_title")]
    f_stat, p_val = stats.f_oneway(*role_groups)
    kw_stat, kw_pval = stats.kruskal(*role_groups)

    anova_res = pd.DataFrame([{
        "test": "One-way ANOVA (Job Title on Avg Salary LPA)",
        "f_statistic": round(float(f_stat), 3),
        "p_value": float(p_val),
        "kruskal_wallis_h": round(float(kw_stat), 3),
        "kruskal_p_value": float(kw_pval),
        "significant_at_0_01": p_val < 0.01,
    }])
    anova_res.to_csv(TABLE_DIR / "table1b_role_salary_anova.csv", index=False)
    logger.info(f"Role Salary ANOVA: F={f_stat:.2f}, p={p_val:.2e}")

    # Figure 1: Horizontal Bar / Boxplot of Salaries by Role
    fig, ax = plt.subplots(figsize=(10, 6))
    order = df_ds.groupby("job_title")["avg_salary_lpa"].median().sort_values(ascending=False).index

    sns.boxplot(
        data=df_ds,
        y="job_title",
        x="avg_salary_lpa",
        order=order,
        palette="Blues_r",
        boxprops=dict(alpha=0.85),
        showmeans=True,
        meanprops=dict(marker="o", markeredgecolor="black", markerfacecolor=PUNARSHURU_ORANGE, markersize=6),
        ax=ax
    )

    ax.set_title("Indian Data Science Job Market: Salary Distribution Across 10 Core Roles (2024–2025)", pad=15)
    ax.set_xlabel("Average Offered Salary (LPA in ₹ Lakhs)")
    ax.set_ylabel("Standardized Role Title")
    ax.text(0.98, 0.05, f"One-Way ANOVA: F = {f_stat:.2f}, p < 0.001\nOrange dots denote role means",
            transform=ax.transAxes, ha="right", va="bottom",
            bbox=dict(boxstyle="round,pad=0.5", facecolor="white", edgecolor="#CBD5E1", alpha=0.9), fontsize=9)

    plt.tight_layout()
    fig_path = FIG_DIR / "fig1_macro_salary_by_role.png"
    plt.savefig(fig_path, dpi=300)
    plt.close()
    logger.info(f"Saved {fig_path}")


def analyze_city_geography_salaries(df_aj: pd.DataFrame, df_ds: pd.DataFrame):
    logger.info("Analyzing Geographical Tech Hub Salary Disparities...")

    # Focus on top 10 tech hubs with robust sample counts
    top_cities = df_aj["primary_city"].value_counts().head(10).index.tolist()
    df_top_cities = df_aj[df_aj["primary_city"].isin(top_cities)].copy()

    city_stats = df_top_cities.groupby("primary_city").agg(
        sample_postings=("analytics_job_id", "count"),
        median_salary_lpa=("salary_mid_lpa", "median"),
        q25_salary_lpa=("salary_mid_lpa", lambda x: np.percentile(x, 25)),
        q75_salary_lpa=("salary_mid_lpa", lambda x: np.percentile(x, 75)),
        mean_salary_lpa=("salary_mid_lpa", "mean"),
        std_salary_lpa=("salary_mid_lpa", "std"),
        mean_exp_years=("exp_mid", "mean"),
    ).reset_index().sort_values("median_salary_lpa", ascending=False)

    city_stats["iqr_lpa"] = city_stats["q75_salary_lpa"] - city_stats["q25_salary_lpa"]
    city_stats.to_csv(TABLE_DIR / "table2_city_salary_benchmarks.csv", index=False)
    logger.info("Saved table2_city_salary_benchmarks.csv")

    # City ANOVA
    city_groups = [group["salary_mid_lpa"].values for _, group in df_top_cities.groupby("primary_city")]
    f_stat, p_val = stats.f_oneway(*city_groups)

    city_anova_res = pd.DataFrame([{
        "test": "One-way ANOVA (Primary Tech Hub on Analytics Salary Midpoint)",
        "f_statistic": round(float(f_stat), 3),
        "p_value": float(p_val),
        "num_hubs": len(top_cities),
        "total_sample": len(df_top_cities),
    }])
    city_anova_res.to_csv(TABLE_DIR / "table2b_city_salary_anova.csv", index=False)

    # Figure 2: City Salary IQR and Distribution Plot
    fig, ax = plt.subplots(figsize=(11, 6))
    order = city_stats.sort_values("median_salary_lpa", ascending=True)["primary_city"]

    sns.barplot(
        data=city_stats,
        y="primary_city",
        x="mean_salary_lpa",
        order=order[::-1],
        palette="crest",
        ax=ax,
        alpha=0.85
    )

    # Overlay sample size annotations
    for idx, row in city_stats.iterrows():
        c_name = row["primary_city"]
        y_pos = list(order[::-1]).index(c_name)
        val = row["mean_salary_lpa"]
        n_count = int(row["sample_postings"])
        ax.text(val + 0.2, y_pos, f"₹{val:.1f}L (N={n_count:,})", va="center", fontsize=8.5, fontweight="bold", color="#1E293B")

    ax.set_title("Tech Compensation Benchmarks Across 10 Key Indian Tech Corridors (N = 14,689)", pad=15)
    ax.set_xlabel("Mean Offered Salary (LPA in ₹ Lakhs)")
    ax.set_ylabel("Primary Tech Corridor")
    ax.set_xlim(0, max(city_stats["mean_salary_lpa"]) * 1.25)

    plt.tight_layout()
    fig_path = FIG_DIR / "fig2_city_salary_iqr.png"
    plt.savefig(fig_path, dpi=300)
    plt.close()
    logger.info(f"Saved {fig_path}")


def analyze_experience_vs_salary(df_aj: pd.DataFrame):
    logger.info("Analyzing Experience vs Salary trajectory...")

    # Filter realistic experience range [0, 15] for regression modeling
    df_exp = df_aj[(df_aj["exp_mid"] >= 0) & (df_aj["exp_mid"] <= 18)].copy()

    # OLS Regression: Salary ~ Experience
    X = sm.add_constant(df_exp["exp_mid"])
    y = df_exp["salary_mid_lpa"]
    model = sm.OLS(y, X).fit()

    ols_summary = pd.DataFrame([{
        "independent_var": "Experience (Years)",
        "dependent_var": "Salary (LPA)",
        "intercept": round(float(model.params["const"]), 3),
        "slope_per_year_lpa": round(float(model.params["exp_mid"]), 3),
        "r_squared": round(float(model.rsquared), 3),
        "adj_r_squared": round(float(model.rsquared_adj), 3),
        "f_pvalue": float(model.f_pvalue),
        "sample_size": int(model.nobs),
    }])
    ols_summary.to_csv(TABLE_DIR / "table3_experience_salary_ols.csv", index=False)
    logger.info(f"Experience OLS: Base=₹{model.params['const']:.2f}L, +₹{model.params['exp_mid']:.2f}L/yr, R2={model.rsquared:.3f}")

    # Figure 3: Experience vs Salary Scatter & Regression with CI
    fig, ax = plt.subplots(figsize=(10, 6))

    # Aggregated median salary by integer year of experience for clean visualization
    df_exp["exp_round"] = df_exp["exp_mid"].round()
    exp_agg = df_exp.groupby("exp_round")["salary_mid_lpa"].agg(
        median="median",
        q25=lambda x: np.percentile(x, 25),
        q75=lambda x: np.percentile(x, 75),
        count="count"
    ).reset_index()

    ax.errorbar(
        exp_agg["exp_round"],
        exp_agg["median"],
        yerr=[exp_agg["median"] - exp_agg["q25"], exp_agg["q75"] - exp_agg["median"]],
        fmt="o",
        color=PUNARSHURU_NAVY,
        ecolor="#94A3B8",
        elinewidth=1.8,
        capsize=4,
        markersize=7,
        label="Empirical Median & IQR (25th–75th)"
    )

    # OLS Fit line
    x_vals = np.linspace(0, 16, 100)
    y_vals = model.params["const"] + model.params["exp_mid"] * x_vals
    ax.plot(x_vals, y_vals, color=PUNARSHURU_ORANGE, linewidth=2.5, linestyle="--",
            label=f"Linear Fit: Salary = {model.params['const']:.1f} + {model.params['exp_mid']:.2f} × Exp (R² = {model.rsquared:.2f})")

    ax.set_title("Indian Tech Compensation Curve: Career Progression vs Offered CTC (LPA)", pad=15)
    ax.set_xlabel("Years of Relevant Experience")
    ax.set_ylabel("Offered Compensation Band (LPA in ₹ Lakhs)")
    ax.set_xticks(range(0, 18, 2))
    ax.legend(loc="upper left", frameon=True)

    plt.tight_layout()
    fig_path = FIG_DIR / "fig3_experience_vs_salary_regression.png"
    plt.savefig(fig_path, dpi=300)
    plt.close()
    logger.info(f"Saved {fig_path}")


def analyze_employer_concentration(df_ds: pd.DataFrame):
    logger.info("Analyzing Employer Hiring Concentration (Pareto Analysis)...")

    emp_agg = df_ds.groupby("company_name").agg(
        total_openings=("num_of_jobs", "sum"),
        roles_offered=("job_title", "nunique"),
        avg_ctc=("avg_salary_lpa", "median")
    ).reset_index().sort_values("total_openings", ascending=False)

    total_vacancies = emp_agg["total_openings"].sum()
    emp_agg["cum_openings"] = emp_agg["total_openings"].cumsum()
    emp_agg["cum_share_pct"] = (emp_agg["cum_openings"] / total_vacancies) * 100

    top_15 = emp_agg.head(15).copy()
    top_15.to_csv(TABLE_DIR / "table3b_top_employers_pareto.csv", index=False)

    # Figure 4: Pareto Chart of Top Employers
    fig, ax1 = plt.subplots(figsize=(11, 6))

    ax1.bar(
        top_15["company_name"],
        top_15["total_openings"],
        color=PUNARSHURU_NAVY,
        alpha=0.85,
        label="Hiring Volume (Openings)"
    )
    ax1.set_ylabel("Total Recorded Job Vacancies", color=PUNARSHURU_NAVY, fontweight="bold")
    ax1.tick_params(axis="y", labelcolor=PUNARSHURU_NAVY)
    ax1.set_xticklabels(top_15["company_name"], rotation=45, ha="right", fontsize=9)

    ax2 = ax1.twinx()
    ax2.plot(
        top_15["company_name"],
        top_15["cum_share_pct"],
        color=PUNARSHURU_ORANGE,
        marker="D",
        linewidth=2.2,
        markersize=6,
        label="Cumulative Absorption %"
    )
    ax2.set_ylabel("Cumulative Absorption Share (%)", color=PUNARSHURU_ORANGE, fontweight="bold")
    ax2.tick_params(axis="y", labelcolor=PUNARSHURU_ORANGE)
    ax2.set_ylim(0, 100)
    ax2.grid(False)

    top_5_share = top_15["cum_share_pct"].iloc[4]
    ax1.set_title(f"Hiring Market Concentration: Top 5 Employers Absorb {top_5_share:.1f}% of Mass Demand", pad=15)

    plt.tight_layout()
    fig_path = FIG_DIR / "fig5_employer_concentration_pareto.png"
    plt.savefig(fig_path, dpi=300)
    plt.close()
    logger.info(f"Saved {fig_path}")


def analyze_skills_demand_and_salary_premium(df_aj: pd.DataFrame):
    logger.info("Extracting top skills, market frequency, and associated salary premiums...")

    skill_rows = []
    for _, row in df_aj.iterrows():
        sks = [s.strip().lower() for s in str(row["key_skills_clean"]).split(",") if len(s.strip()) > 1]
        sal = row["salary_mid_lpa"]
        for sk in sks:
            skill_rows.append({"skill": sk, "salary_mid_lpa": sal})

    df_sk = pd.DataFrame(skill_rows)
    sk_agg = df_sk.groupby("skill").agg(
        frequency=("salary_mid_lpa", "count"),
        median_salary_lpa=("salary_mid_lpa", "median"),
        mean_salary_lpa=("salary_mid_lpa", "mean")
    ).reset_index()

    # Filter top 25 skills with at least 150 occurrences
    top_skills = sk_agg[sk_agg["frequency"] >= 150].sort_values("frequency", ascending=False).head(25).copy()
    top_skills["skill_title"] = top_skills["skill"].str.title()
    top_skills.to_csv(TABLE_DIR / "table3c_top_skills_salary_matrix.csv", index=False)

    # Figure 5: Skill Demand Frequency vs Median Salary Bubble Plot
    fig, ax = plt.subplots(figsize=(11, 7))

    scatter = ax.scatter(
        top_skills["frequency"],
        top_skills["median_salary_lpa"],
        s=top_skills["frequency"] * 0.45 + 100,
        c=top_skills["median_salary_lpa"],
        cmap="coolwarm",
        alpha=0.8,
        edgecolors="black",
        linewidth=1.2
    )

    cbar = plt.colorbar(scatter, ax=ax)
    cbar.set_label("Median Salary (LPA in ₹ Lakhs)", fontweight="bold")

    for _, r in top_skills.iterrows():
        ax.annotate(
            r["skill_title"],
            (r["frequency"], r["median_salary_lpa"]),
            xytext=(5, 4),
            textcoords="offset points",
            fontsize=8.5,
            fontweight="semibold",
            color="#0F172A"
        )

    ax.set_title("Empirical Skills Matrix: Market Demand Volume vs Offered Salary Premium", pad=15)
    ax.set_xlabel("Job Posting Mention Frequency (N = 14,689)")
    ax.set_ylabel("Median Offered Salary (LPA in ₹ Lakhs)")

    # Quadrant lines
    med_freq = top_skills["frequency"].median()
    med_sal = top_skills["median_salary_lpa"].median()
    ax.axvline(med_freq, color="#94A3B8", linestyle=":", alpha=0.7)
    ax.axhline(med_sal, color="#94A3B8", linestyle=":", alpha=0.7)
    ax.text(top_skills["frequency"].max() * 0.75, top_skills["median_salary_lpa"].max() * 0.95,
            "High Demand • High Salary\n(Frontier Target Skills)", fontsize=9, color="#0B4F9C", fontweight="bold")

    plt.tight_layout()
    fig_path = FIG_DIR / "fig4_top_skills_demand_salary_bubble.png"
    plt.savefig(fig_path, dpi=300)
    plt.close()
    logger.info(f"Saved {fig_path}")


def main():
    logger.info("Loading cleaned datasets for Phase 2 Macro Analysis...")
    df_ds = pd.read_csv(PROCESSED_DIR / "ds_jobs_clean.csv")
    df_aj = pd.read_csv(PROCESSED_DIR / "analytics_jobs_clean.csv")

    analyze_ds_roles_and_salaries(df_ds)
    analyze_city_geography_salaries(df_aj, df_ds)
    analyze_experience_vs_salary(df_aj)
    analyze_employer_concentration(df_ds)
    analyze_skills_demand_and_salary_premium(df_aj)
    logger.info("Phase 2 Macro Market EDA & Statistical Modeling Complete.")


if __name__ == "__main__":
    main()
