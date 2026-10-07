"""
Punarshuru Analytics Engine - Phase 3: Junior Data Scientist Skill Modeling
Script: 03_jds_skill_modeling.py

Investigates which technical skill competencies determine whether Junior Data Scientists
achieve a 'High' salary hike versus a 'Low' salary hike (N=139).

Produces:
1. Univariate statistical hypothesis tests (Welch's t-test, Mann-Whitney U, Cohen's d).
2. Multicollinearity & VIF diagnostics.
3. Multivariable Logistic Regression with Odds Ratios (OR), 95% CIs, and McFadden's R2.
4. Stratified 5-Fold Cross-Validation Machine Learning benchmark (Logit, ElasticNet, RF, XGBoost).
5. Production model export for Punarshuru integration (PromotionReadiness.tsx & CareerReadinessScan.tsx).
6. Publication-grade figures (fig6, fig7, fig8).
"""

import os
import json
import logging
import numpy as np
import pandas as pd
import scipy.stats as stats
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor

from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import joblib

import matplotlib.pyplot as plt
import seaborn as sns

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
TABLES_DIR = os.path.join(BASE_DIR, "outputs", "tables")
FIGURES_DIR = os.path.join(BASE_DIR, "outputs", "figures", "jds_skills")
MODELS_DIR = os.path.join(BASE_DIR, "outputs", "models")

for d in [TABLES_DIR, FIGURES_DIR, MODELS_DIR]:
    os.makedirs(d, exist_ok=True)

# Aesthetic parameters
plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
plt.rcParams["font.family"] = "sans-serif"
plt.rcParams["font.sans-serif"] = ["Arial", "DejaVu Sans", "Helvetica"]
plt.rcParams["axes.edgecolor"] = "#CBD5E1"
plt.rcParams["axes.linewidth"] = 0.8


def calculate_cohens_d(group1, group2):
    """Calculates Cohen's d effect size for two independent samples."""
    n1, n2 = len(group1), len(group2)
    var1, var2 = np.var(group1, ddof=1), np.var(group2, ddof=1)
    pooled_sd = np.sqrt(((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2))
    if pooled_sd == 0:
        return 0.0
    return (np.mean(group1) - np.mean(group2)) / pooled_sd


def run_univariate_skill_analysis(df, skill_cols, target_col):
    """
    Computes parametric and non-parametric tests comparing High Hike vs Low Hike.
    """
    logging.info("Running Univariate Statistical Hypothesis Tests on JDS Skills...")
    results = []
    
    high_group = df[df[target_col] == 1]
    low_group = df[df[target_col] == 0]
    
    for skill in skill_cols:
        h_vals = high_group[skill].dropna()
        l_vals = low_group[skill].dropna()
        
        # Means & SDs
        h_mean, h_sd = h_vals.mean(), h_vals.std()
        l_mean, l_sd = l_vals.mean(), l_vals.std()
        
        # Medians & IQRs
        h_med = h_vals.median()
        h_iqr = h_vals.quantile(0.75) - h_vals.quantile(0.25)
        l_med = l_vals.median()
        l_iqr = l_vals.quantile(0.75) - l_vals.quantile(0.25)
        
        # Welch's t-test (unequal variances assumed)
        t_stat, t_pval = stats.ttest_ind(h_vals, l_vals, equal_var=False)
        
        # Mann-Whitney U test
        u_stat, u_pval = stats.mannwhitneyu(h_vals, l_vals, alternative="two-sided")
        
        # Cohen's d
        d = calculate_cohens_d(h_vals, l_vals)
        
        results.append({
            "skill": skill,
            "high_hike_n": len(h_vals),
            "high_hike_mean": round(h_mean, 2),
            "high_hike_sd": round(h_sd, 2),
            "high_hike_median": round(h_med, 2),
            "high_hike_iqr": round(h_iqr, 2),
            "low_hike_n": len(l_vals),
            "low_hike_mean": round(l_mean, 2),
            "low_hike_sd": round(l_sd, 2),
            "low_hike_median": round(l_med, 2),
            "low_hike_iqr": round(l_iqr, 2),
            "welch_t_stat": round(t_stat, 3),
            "welch_t_pval": t_pval,
            "mann_whitney_u": round(u_stat, 1),
            "mann_whitney_pval": u_pval,
            "cohens_d": round(d, 3),
            "effect_interpretation": "Large" if abs(d) >= 0.8 else ("Medium" if abs(d) >= 0.5 else ("Small" if abs(d) >= 0.2 else "Negligible"))
        })
        
    res_df = pd.DataFrame(results)
    res_df.sort_values(by="cohens_d", ascending=False, inplace=True)
    out_path = os.path.join(TABLES_DIR, "table4_jds_skill_univariate_tests.csv")
    res_df.to_csv(out_path, index=False)
    logging.info(f"Saved Table 4: {out_path}")
    return res_df


def run_vif_and_correlations(df, skill_cols):
    """
    Computes VIF and correlation matrix across technical skills.
    """
    logging.info("Evaluating Multicollinearity (VIF) and Pearson Correlations...")
    X = df[skill_cols].copy()
    X_const = sm.add_constant(X)
    
    vif_data = []
    for i, col in enumerate(X_const.columns):
        if col == "const":
            continue
        vif = variance_inflation_factor(X_const.values, i)
        vif_data.append({"skill": col, "vif": round(vif, 3)})
    
    vif_df = pd.DataFrame(vif_data)
    corr_df = df[skill_cols].corr().round(3)
    
    # Combined export
    vif_path = os.path.join(TABLES_DIR, "table4b_jds_vif_and_correlations.csv")
    vif_df.to_csv(vif_path, index=False)
    
    corr_path = os.path.join(TABLES_DIR, "table4c_jds_skill_correlation_matrix.csv")
    corr_df.to_csv(corr_path)
    logging.info(f"Saved VIF & Correlation matrices to {TABLES_DIR}")
    return vif_df, corr_df


def run_logistic_regression(df, skill_cols, target_col):
    """
    Runs statsmodels multivariable Logistic Regression.
    Extracts Odds Ratios, 95% CIs, and model goodness-of-fit.
    """
    logging.info("Fitting Multivariable Logistic Regression with Statsmodels...")
    X = df[skill_cols].copy()
    X_const = sm.add_constant(X)
    y = df[target_col].copy()
    
    logit_model = sm.Logit(y, X_const).fit(disp=False)
    
    conf_int = logit_model.conf_int()
    conf_int.columns = ["ci_lower_log_odds", "ci_upper_log_odds"]
    
    summary_df = pd.DataFrame({
        "feature": logit_model.params.index,
        "coef_beta": logit_model.params.values,
        "std_err": logit_model.bse.values,
        "z_stat": logit_model.tvalues.values,
        "p_val": logit_model.pvalues.values,
        "odds_ratio": np.exp(logit_model.params.values),
        "or_ci_lower_95": np.exp(conf_int["ci_lower_log_odds"].values),
        "or_ci_upper_95": np.exp(conf_int["ci_upper_log_odds"].values)
    })
    
    summary_df["stat_sig"] = summary_df["p_val"].apply(
        lambda p: "***" if p < 0.001 else ("**" if p < 0.01 else ("*" if p < 0.05 else "ns"))
    )
    
    # Round metrics
    for col in ["coef_beta", "std_err", "z_stat", "odds_ratio", "or_ci_lower_95", "or_ci_upper_95"]:
        summary_df[col] = summary_df[col].round(3)
        
    out_path = os.path.join(TABLES_DIR, "table5_jds_logistic_regression.csv")
    summary_df.to_csv(out_path, index=False)
    logging.info(f"Saved Table 5: {out_path}")
    
    # Model diagnostic metrics
    diagnostics = {
        "nobs": int(logit_model.nobs),
        "mcfadden_pseudo_r2": round(float(logit_model.prsquared), 4),
        "log_likelihood": round(float(logit_model.llf), 2),
        "null_log_likelihood": round(float(logit_model.llnull), 2),
        "llr_pvalue": float(logit_model.llr_pvalue),
        "aic": round(float(logit_model.aic), 2),
        "bic": round(float(logit_model.bic), 2)
    }
    with open(os.path.join(TABLES_DIR, "table5_jds_logit_diagnostics.json"), "w") as f:
        json.dump(diagnostics, f, indent=2)
        
    logging.info(f"JDS Logistic Model: Pseudo R2 = {diagnostics['mcfadden_pseudo_r2']}, LLR p = {diagnostics['llr_pvalue']:.4e}")
    return summary_df, logit_model, diagnostics


def run_cross_validated_ml_benchmark(df, skill_cols, target_col):
    """
    Performs 5-Fold Stratified Cross-Validation across multiple classifiers:
    1. Standard Logistic Regression (L2)
    2. ElasticNet Logistic Regression
    3. Random Forest Classifier
    4. XGBoost Classifier
    """
    logging.info("Benchmarking ML Classifiers using Stratified 5-Fold Cross-Validation...")
    X = df[skill_cols].values
    y = df[target_col].values
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    models = {
        "Logistic Regression (L2)": LogisticRegression(penalty="l2", C=1.0, random_state=42, max_iter=500),
        "ElasticNet Logistic Reg": LogisticRegression(penalty="elasticnet", solver="saga", l1_ratio=0.5, C=1.0, random_state=42, max_iter=1000),
        "Random Forest (Depth=4)": RandomForestClassifier(n_estimators=100, max_depth=4, random_state=42),
        "XGBoost (Depth=3)": XGBClassifier(n_estimators=100, max_depth=3, learning_rate=0.05, eval_metric="logloss", random_state=42)
    }
    
    benchmark_results = []
    fold_details = []
    
    for model_name, clf in models.items():
        acc_list, prec_list, rec_list, f1_list, auc_list = [], [], [], [], []
        
        for fold, (train_idx, val_idx) in enumerate(cv.split(X, y)):
            X_train, X_val = X[train_idx], X[val_idx]
            y_train, y_val = y[train_idx], y[val_idx]
            
            # Scale for linear models
            if "Logistic" in model_name:
                scaler = StandardScaler()
                X_train = scaler.fit_transform(X_train)
                X_val = scaler.transform(X_val)
                
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_val)
            y_prob = clf.predict_proba(X_val)[:, 1] if hasattr(clf, "predict_proba") else y_pred
            
            acc = accuracy_score(y_val, y_pred)
            prec = precision_score(y_val, y_pred, zero_division=0)
            rec = recall_score(y_val, y_pred, zero_division=0)
            f1 = f1_score(y_val, y_pred, zero_division=0)
            auc = roc_auc_score(y_val, y_prob)
            
            acc_list.append(acc)
            prec_list.append(prec)
            rec_list.append(rec)
            f1_list.append(f1)
            auc_list.append(auc)
            
            fold_details.append({
                "model": model_name,
                "fold": fold + 1,
                "accuracy": acc,
                "precision": prec,
                "recall": rec,
                "f1": f1,
                "roc_auc": auc
            })
            
        benchmark_results.append({
            "model": model_name,
            "accuracy_mean": round(np.mean(acc_list), 3),
            "accuracy_sd": round(np.std(acc_list), 3),
            "precision_mean": round(np.mean(prec_list), 3),
            "precision_sd": round(np.std(prec_list), 3),
            "recall_mean": round(np.mean(rec_list), 3),
            "recall_sd": round(np.std(rec_list), 3),
            "f1_mean": round(np.mean(f1_list), 3),
            "f1_sd": round(np.std(f1_list), 3),
            "roc_auc_mean": round(np.mean(auc_list), 3),
            "roc_auc_sd": round(np.std(auc_list), 3)
        })
        
    bench_df = pd.DataFrame(benchmark_results)
    bench_df.sort_values(by="roc_auc_mean", ascending=False, inplace=True)
    out_path = os.path.join(TABLES_DIR, "table6_jds_ml_benchmark.csv")
    bench_df.to_csv(out_path, index=False)
    logging.info(f"Saved Table 6: {out_path}")
    
    return bench_df, pd.DataFrame(fold_details)


def export_production_model(df, skill_cols, target_col):
    """
    Fits and exports the calibrated production model for Punarshuru integration.
    """
    logging.info("Training and Exporting Punarshuru JDS Production Model...")
    X = df[skill_cols].values
    y = df[target_col].values
    
    # Train robust Logistic Regression model with calibrated regularizer
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = LogisticRegression(penalty="l2", C=1.0, random_state=42, max_iter=500)
    model.fit(X_scaled, y)
    
    pipeline_bundle = {
        "scaler": scaler,
        "model": model,
        "feature_names": skill_cols,
        "classes": model.classes_.tolist(),
        "n_samples": len(df),
        "target": target_col,
        "intercept": float(model.intercept_[0]),
        "coefficients": {feat: float(coef) for feat, coef in zip(skill_cols, model.coef_[0])}
    }
    
    model_path = os.path.join(MODELS_DIR, "jds_hike_model.joblib")
    joblib.dump(pipeline_bundle, model_path)
    
    meta_path = os.path.join(MODELS_DIR, "jds_hike_model_meta.json")
    with open(meta_path, "w") as f:
        json.dump(pipeline_bundle["coefficients"], f, indent=2)
        
    logging.info(f"Exported JDS production model bundle to {model_path}")
    return pipeline_bundle


def generate_figures(df, skill_cols, target_col, logit_summary, fold_details):
    """
    Generates high-resolution figures:
    - fig6: Radar/Bar chart of mean skill proficiency by Hike group
    - fig7: Odds Ratio Forest Plot with 95% CIs
    - fig8: 5-Fold Cross Validation performance benchmark
    """
    logging.info("Generating publication-grade JDS visualizations...")
    
    # FIG 6: Skill Proficiency Comparison (High Hike vs Low Hike)
    # Using a clean grouped horizontal bar chart with 95% CI
    clean_skill_names = {
        "ai_and_ml_skills": "AI & Machine Learning",
        "coding_skills": "Coding & Software Eng.",
        "maths_stats_skills": "Maths & Statistics",
        "dashboard_and_storytelling_skills": "Dashboard & Storytelling",
        "big_data_skills": "Big Data Technologies"
    }
    
    melted = df.melt(
        id_vars=[target_col],
        value_vars=skill_cols,
        var_name="skill",
        value_name="score"
    )
    melted["skill_label"] = melted["skill"].map(clean_skill_names)
    melted["hike_label"] = melted[target_col].map({1: "High Hike (Top Performers)", 0: "Low Hike (Stagnant/Baseline)"})
    
    # Compute group means for sorting
    skill_order = df.groupby(target_col)[skill_cols].mean().diff().iloc[-1].sort_values(ascending=False).index
    skill_order_labels = [clean_skill_names[s] for s in skill_order]
    
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    palette = {
        "High Hike (Top Performers)": "#059669", # Emerald green
        "Low Hike (Stagnant/Baseline)": "#DC2626" # Crimson red
    }
    
    sns.barplot(
        data=melted,
        y="skill_label",
        x="score",
        hue="hike_label",
        order=skill_order_labels,
        palette=palette,
        errorbar=("ci", 95),
        capsize=0.1,
        ax=ax
    )
    
    ax.set_title("Junior Data Scientist Skill Profiles: High vs. Low Salary Hike Cohorts", fontsize=13, fontweight="bold", pad=15)
    ax.set_xlabel("Skill Competency Assessment Score (1.0 to 5.0 Scale ± 95% CI)", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_ylabel("Technical Skill Competency Pillar", fontsize=11, fontweight="bold")
    ax.set_xlim(1.0, 5.0)
    ax.legend(title="Candidate Cohort", frameon=True, facecolor="white", edgecolor="#E2E8F0")
    
    plt.tight_layout()
    fig6_path = os.path.join(FIGURES_DIR, "fig6_jds_skill_comparison_profiles.png")
    plt.savefig(fig6_path)
    plt.close()
    logging.info(f"Saved {fig6_path}")
    
    # FIG 7: Odds Ratio Forest Plot
    # Exclude constant intercept
    forest_df = logit_summary[logit_summary["feature"] != "const"].copy()
    forest_df["feature_label"] = forest_df["feature"].map(clean_skill_names)
    forest_df.sort_values(by="odds_ratio", ascending=True, inplace=True)
    
    fig, ax = plt.subplots(figsize=(9, 5.5), dpi=300)
    y_pos = np.arange(len(forest_df))
    
    # Plot reference line at OR = 1.0 (neutral)
    ax.axvline(1.0, color="#64748B", linestyle="--", linewidth=1.2, label="Neutral Threshold (OR = 1.0)")
    
    # Error bars for 95% CI
    x_err_lower = forest_df["odds_ratio"] - forest_df["or_ci_lower_95"]
    x_err_upper = forest_df["or_ci_upper_95"] - forest_df["odds_ratio"]
    
    # Color points based on significance
    colors = ["#2563EB" if p < 0.05 else "#94A3B8" for p in forest_df["p_val"]]
    
    ax.errorbar(
        forest_df["odds_ratio"],
        y_pos,
        xerr=[x_err_lower, x_err_upper],
        fmt="o",
        color="#1E3A8A",
        ecolor="#3B82F6",
        elinewidth=2.5,
        capsize=5,
        capthick=1.5,
        markersize=9,
        label="Odds Ratio (95% CI)"
    )
    
    # Annotate OR values and p-values
    for idx, (_, row) in enumerate(forest_df.iterrows()):
        sig_text = f"OR: {row['odds_ratio']:.2f} [{row['or_ci_lower_95']:.2f}, {row['or_ci_upper_95']:.2f}] (p={row['p_val']:.3f})"
        ax.text(
            row["or_ci_upper_95"] + 0.1,
            idx,
            sig_text,
            va="center",
            fontsize=9,
            fontweight="bold" if row["p_val"] < 0.05 else "normal",
            color="#0F172A"
        )
        
    ax.set_yticks(y_pos)
    ax.set_yticklabels(forest_df["feature_label"], fontsize=10, fontweight="bold")
    ax.set_xlabel("Odds Ratio for Achieving High Salary Hike (log scale / ratio)", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_title("Impact of Technical Competency on High Salary Hike (Multivariable Logistic Regression)", fontsize=12, fontweight="bold", pad=15)
    ax.set_xlim(0, max(forest_df["or_ci_upper_95"]) + 1.8)
    ax.legend(frameon=True, facecolor="white", edgecolor="#E2E8F0", loc="lower right")
    
    plt.tight_layout()
    fig7_path = os.path.join(FIGURES_DIR, "fig7_jds_logistic_odds_ratios.png")
    plt.savefig(fig7_path)
    plt.close()
    logging.info(f"Saved {fig7_path}")
    
    # FIG 8: Cross-Validated Model Benchmark
    fig, ax = plt.subplots(figsize=(9, 5.5), dpi=300)
    
    sns.boxplot(
        data=fold_details,
        x="model",
        y="roc_auc",
        palette=["#3B82F6", "#60A5FA", "#10B981", "#F59E0B"],
        width=0.45,
        ax=ax
    )
    sns.stripplot(
        data=fold_details,
        x="model",
        y="roc_auc",
        color="#0F172A",
        size=6,
        jitter=0.1,
        ax=ax
    )
    
    ax.set_title("5-Fold Cross-Validation Performance Across Predictive Classifiers", fontsize=12, fontweight="bold", pad=15)
    ax.set_ylabel("Area Under ROC Curve (ROC-AUC)", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_xlabel("Model Architecture", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_ylim(0.5, 1.0)
    
    plt.tight_layout()
    fig8_path = os.path.join(FIGURES_DIR, "fig8_jds_cv_model_benchmark.png")
    plt.savefig(fig8_path)
    plt.close()
    logging.info(f"Saved {fig8_path}")


def main():
    logging.info("=== Starting Phase 3: Junior Data Scientist Skill Modeling ===")
    
    # Load clean data
    jds_path = os.path.join(PROCESSED_DIR, "jds_traits_clean.csv")
    df = pd.read_csv(jds_path)
    logging.info(f"Loaded JDS cleaned dataset: {len(df)} candidates")
    
    skill_cols = [
        "big_data_skills",
        "maths_stats_skills",
        "coding_skills",
        "ai_and_ml_skills",
        "dashboard_and_storytelling_skills"
    ]
    target_col = "salary_hike_high_or_low"
    
    # 1. Univariate Statistical Analysis
    run_univariate_skill_analysis(df, skill_cols, target_col)
    
    # 2. VIF & Correlations
    run_vif_and_correlations(df, skill_cols)
    
    # 3. Multivariable Logistic Regression
    summary_df, logit_model, diagnostics = run_logistic_regression(df, skill_cols, target_col)
    
    # 4. Machine Learning Benchmark (5-Fold CV)
    bench_df, fold_details = run_cross_validated_ml_benchmark(df, skill_cols, target_col)
    
    # 5. Export Production Pipeline Bundle
    export_production_model(df, skill_cols, target_col)
    
    # 6. Generate Publication Figures
    generate_figures(df, skill_cols, target_col, summary_df, fold_details)
    
    logging.info("=== Phase 3 Junior Data Scientist Modeling Complete ===")


if __name__ == "__main__":
    main()
