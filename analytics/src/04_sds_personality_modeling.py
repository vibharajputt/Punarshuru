"""
Punarshuru Analytics Engine - Phase 4: Senior Data Scientist Personality Modeling
Script: 04_sds_personality_modeling.py

Investigates which Big Five (OCEAN) personality traits determine career success classification
(High vs Low) for Senior Data Scientists (N=161).

Produces:
1. Univariate statistical hypothesis tests (Welch's t-test, Mann-Whitney U, Cohen's d).
2. Multicollinearity & VIF diagnostics.
3. Multivariable Logistic Regression with Odds Ratios (OR per 10-pt scale), 95% CIs, and McFadden's R2.
4. Stratified 5-Fold Cross-Validation Machine Learning benchmark (Logit, ElasticNet, RF, XGBoost).
5. Production model export for Punarshuru integration (Senior Leadership & Transition widget).
6. Publication-grade figures (fig9, fig10, fig11).
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
from sklearn.inspection import permutation_importance
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, roc_curve, auc
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
FIGURES_DIR = os.path.join(BASE_DIR, "outputs", "figures", "sds_traits")
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


def run_univariate_trait_analysis(df, trait_cols, target_col):
    """
    Computes parametric and non-parametric tests comparing High Success vs Low Success.
    """
    logging.info("Running Univariate Statistical Hypothesis Tests on Big Five Traits...")
    results = []
    
    high_group = df[df[target_col] == 1]
    low_group = df[df[target_col] == 0]
    
    for trait in trait_cols:
        h_vals = high_group[trait].dropna()
        l_vals = low_group[trait].dropna()
        
        # Means & SDs
        h_mean, h_sd = h_vals.mean(), h_vals.std()
        l_mean, l_sd = l_vals.mean(), l_vals.std()
        
        # Medians & IQRs
        h_med = h_vals.median()
        h_iqr = h_vals.quantile(0.75) - h_vals.quantile(0.25)
        l_med = l_vals.median()
        l_iqr = l_vals.quantile(0.75) - l_vals.quantile(0.25)
        
        # Welch's t-test
        t_stat, t_pval = stats.ttest_ind(h_vals, l_vals, equal_var=False)
        
        # Mann-Whitney U test
        u_stat, u_pval = stats.mannwhitneyu(h_vals, l_vals, alternative="two-sided")
        
        # Cohen's d
        d = calculate_cohens_d(h_vals, l_vals)
        
        results.append({
            "trait": trait,
            "high_success_n": len(h_vals),
            "high_success_mean": round(h_mean, 2),
            "high_success_sd": round(h_sd, 2),
            "high_success_median": round(h_med, 2),
            "high_success_iqr": round(h_iqr, 2),
            "low_success_n": len(l_vals),
            "low_success_mean": round(l_mean, 2),
            "low_success_sd": round(l_sd, 2),
            "low_success_median": round(l_med, 2),
            "low_success_iqr": round(l_iqr, 2),
            "welch_t_stat": round(t_stat, 3),
            "welch_t_pval": t_pval,
            "mann_whitney_u": round(u_stat, 1),
            "mann_whitney_pval": u_pval,
            "cohens_d": round(d, 3),
            "effect_interpretation": "Large" if abs(d) >= 0.8 else ("Medium" if abs(d) >= 0.5 else ("Small" if abs(d) >= 0.2 else "Negligible"))
        })
        
    res_df = pd.DataFrame(results)
    res_df.sort_values(by="cohens_d", ascending=False, inplace=True)
    out_path = os.path.join(TABLES_DIR, "table7_sds_personality_univariate_tests.csv")
    res_df.to_csv(out_path, index=False)
    logging.info(f"Saved Table 7: {out_path}")
    return res_df


def run_vif_and_correlations(df, trait_cols):
    """
    Computes VIF and correlation matrix across Big Five traits.
    """
    logging.info("Evaluating Multicollinearity (VIF) and Pearson Correlations...")
    X = df[trait_cols].copy()
    X_const = sm.add_constant(X)
    
    vif_data = []
    for i, col in enumerate(X_const.columns):
        if col == "const":
            continue
        vif = variance_inflation_factor(X_const.values, i)
        vif_data.append({"trait": col, "vif": round(vif, 3)})
    
    vif_df = pd.DataFrame(vif_data)
    corr_df = df[trait_cols].corr().round(3)
    
    vif_path = os.path.join(TABLES_DIR, "table7b_sds_vif_and_correlations.csv")
    vif_df.to_csv(vif_path, index=False)
    
    corr_path = os.path.join(TABLES_DIR, "table7c_sds_trait_correlation_matrix.csv")
    corr_df.to_csv(corr_path)
    logging.info(f"Saved VIF & Correlation matrices to {TABLES_DIR}")
    return vif_df, corr_df


def run_logistic_regression(df, trait_cols, target_col):
    """
    Fits statsmodels multivariable Logistic Regression.
    Computes Odds Ratios per unit and per 10-point scale increase.
    """
    logging.info("Fitting Multivariable Logistic Regression with Statsmodels...")
    X = df[trait_cols].copy()
    X_const = sm.add_constant(X)
    y = df[target_col].copy()
    
    logit_model = sm.Logit(y, X_const).fit(disp=False)
    
    conf_int = logit_model.conf_int()
    conf_int.columns = ["ci_lower_log_odds", "ci_upper_log_odds"]
    
    # Calculate OR per 10 units (since OCEAN scores range 0-100)
    summary_df = pd.DataFrame({
        "feature": logit_model.params.index,
        "coef_beta": logit_model.params.values,
        "std_err": logit_model.bse.values,
        "z_stat": logit_model.tvalues.values,
        "p_val": logit_model.pvalues.values,
        "odds_ratio_unit": np.exp(logit_model.params.values),
        "odds_ratio_10pt": np.exp(logit_model.params.values * 10),
        "or_10pt_ci_lower_95": np.exp(conf_int["ci_lower_log_odds"].values * 10),
        "or_10pt_ci_upper_95": np.exp(conf_int["ci_upper_log_odds"].values * 10)
    })
    
    summary_df["stat_sig"] = summary_df["p_val"].apply(
        lambda p: "***" if p < 0.001 else ("**" if p < 0.01 else ("*" if p < 0.05 else "ns"))
    )
    
    for col in ["coef_beta", "std_err", "z_stat", "odds_ratio_unit", "odds_ratio_10pt", "or_10pt_ci_lower_95", "or_10pt_ci_upper_95"]:
        summary_df[col] = summary_df[col].round(3)
        
    out_path = os.path.join(TABLES_DIR, "table8_sds_logistic_regression.csv")
    summary_df.to_csv(out_path, index=False)
    logging.info(f"Saved Table 8: {out_path}")
    
    diagnostics = {
        "nobs": int(logit_model.nobs),
        "mcfadden_pseudo_r2": round(float(logit_model.prsquared), 4),
        "log_likelihood": round(float(logit_model.llf), 2),
        "null_log_likelihood": round(float(logit_model.llnull), 2),
        "llr_pvalue": float(logit_model.llr_pvalue),
        "aic": round(float(logit_model.aic), 2),
        "bic": round(float(logit_model.bic), 2)
    }
    with open(os.path.join(TABLES_DIR, "table8_sds_logit_diagnostics.json"), "w") as f:
        json.dump(diagnostics, f, indent=2)
        
    logging.info(f"SDS Logistic Model: Pseudo R2 = {diagnostics['mcfadden_pseudo_r2']}, LLR p = {diagnostics['llr_pvalue']:.4e}")
    return summary_df, logit_model, diagnostics


def run_cross_validated_ml_benchmark(df, trait_cols, target_col):
    """
    Performs 5-Fold Stratified Cross-Validation across multiple classifiers:
    1. Standard Logistic Regression (L2)
    2. ElasticNet Logistic Regression
    3. Random Forest Classifier
    4. XGBoost Classifier
    """
    logging.info("Benchmarking ML Classifiers using Stratified 5-Fold Cross-Validation...")
    X = df[trait_cols].values
    y = df[target_col].values
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    models = {
        "Logistic Regression (L2)": LogisticRegression(C=1.0, random_state=42, max_iter=500),
        "ElasticNet Logistic Reg": LogisticRegression(solver="saga", l1_ratio=0.5, C=1.0, random_state=42, max_iter=1000),
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
            auc_val = roc_auc_score(y_val, y_prob)
            
            acc_list.append(acc)
            prec_list.append(prec)
            rec_list.append(rec)
            f1_list.append(f1)
            auc_list.append(auc_val)
            
            fold_details.append({
                "model": model_name,
                "fold": fold + 1,
                "accuracy": acc,
                "precision": prec,
                "recall": rec,
                "f1": f1,
                "roc_auc": auc_val
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
    out_path = os.path.join(TABLES_DIR, "table9_sds_ml_benchmark.csv")
    bench_df.to_csv(out_path, index=False)
    logging.info(f"Saved Table 9: {out_path}")
    
    return bench_df, pd.DataFrame(fold_details)


def export_production_model(df, trait_cols, target_col):
    """
    Fits and exports the calibrated production model for Punarshuru integration.
    """
    logging.info("Training and Exporting Punarshuru SDS Production Model...")
    X = df[trait_cols].values
    y = df[target_col].values
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = LogisticRegression(C=1.0, random_state=42, max_iter=500)
    model.fit(X_scaled, y)
    
    # Feature importance via permutation
    rf = RandomForestClassifier(n_estimators=100, max_depth=4, random_state=42)
    rf.fit(X, y)
    perm_importance = permutation_importance(rf, X, y, n_repeats=10, random_state=42)
    
    imp_df = pd.DataFrame({
        "trait": trait_cols,
        "importance_mean": perm_importance.importances_mean.round(4),
        "importance_std": perm_importance.importances_std.round(4)
    }).sort_values(by="importance_mean", ascending=False)
    
    imp_df.to_csv(os.path.join(TABLES_DIR, "table9b_sds_feature_importance.csv"), index=False)
    
    pipeline_bundle = {
        "scaler": scaler,
        "model": model,
        "feature_names": trait_cols,
        "classes": model.classes_.tolist(),
        "n_samples": len(df),
        "target": target_col,
        "intercept": float(model.intercept_[0]),
        "coefficients": {feat: float(coef) for feat, coef in zip(trait_cols, model.coef_[0])}
    }
    
    model_path = os.path.join(MODELS_DIR, "sds_success_model.joblib")
    joblib.dump(pipeline_bundle, model_path)
    
    meta_path = os.path.join(MODELS_DIR, "sds_success_model_meta.json")
    with open(meta_path, "w") as f:
        json.dump(pipeline_bundle["coefficients"], f, indent=2)
        
    logging.info(f"Exported SDS production model bundle to {model_path}")
    return pipeline_bundle


def generate_figures(df, trait_cols, target_col, logit_summary, fold_details):
    """
    Generates high-resolution figures:
    - fig9: Violin/Box distribution of Big Five traits by Success cohort
    - fig10: Odds Ratios Forest Plot (per 10-point increase) with 95% CIs
    - fig11: Model Benchmark & ROC Curves
    """
    logging.info("Generating publication-grade SDS visualizations...")
    
    clean_trait_names = {
        "conscientiousness": "Conscientiousness",
        "agreeableness": "Agreeableness",
        "extraversion": "Extraversion",
        "openness_to_experience": "Openness to Exp.",
        "neuroticism": "Neuroticism"
    }
    
    # FIG 9: Big Five Trait Distributions (Violin/Box Plots)
    melted = df.melt(
        id_vars=[target_col],
        value_vars=trait_cols,
        var_name="trait",
        value_name="score"
    )
    melted["trait_label"] = melted["trait"].map(clean_trait_names)
    melted["cohort_label"] = melted[target_col].map({1: "High Success Leader", 0: "Baseline / Low Success"})
    
    # Sort order by difference in means
    trait_order = df.groupby(target_col)[trait_cols].mean().diff().iloc[-1].sort_values(ascending=False).index
    trait_order_labels = [clean_trait_names[t] for t in trait_order]
    
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    palette = {
        "High Success Leader": "#2563EB", # Sapphire Blue
        "Baseline / Low Success": "#94A3B8" # Slate Grey
    }
    
    sns.boxplot(
        data=melted,
        x="trait_label",
        y="score",
        hue="cohort_label",
        order=trait_order_labels,
        palette=palette,
        width=0.55,
        ax=ax
    )
    
    ax.set_title("Big Five Personality Dimensions: Senior Data Scientist Success Cohorts", fontsize=13, fontweight="bold", pad=15)
    ax.set_xlabel("Personality Dimension (OCEAN Framework)", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_ylabel("Standardized Trait Score (0 to 100 Scale)", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_ylim(0, 100)
    ax.legend(title="Career Classification", frameon=True, facecolor="white", edgecolor="#CBD5E1")
    
    plt.tight_layout()
    fig9_path = os.path.join(FIGURES_DIR, "fig9_sds_ocean_trait_violins.png")
    plt.savefig(fig9_path)
    plt.close()
    logging.info(f"Saved {fig9_path}")
    
    # FIG 10: Odds Ratios Forest Plot (Per 10-Point Score Increase)
    forest_df = logit_summary[logit_summary["feature"] != "const"].copy()
    forest_df["feature_label"] = forest_df["feature"].map(clean_trait_names)
    forest_df.sort_values(by="odds_ratio_10pt", ascending=True, inplace=True)
    
    fig, ax = plt.subplots(figsize=(9, 5.5), dpi=300)
    y_pos = np.arange(len(forest_df))
    
    # Reference line at OR = 1.0
    ax.axvline(1.0, color="#64748B", linestyle="--", linewidth=1.2, label="Neutral Threshold (OR = 1.0)")
    
    x_err_lower = forest_df["odds_ratio_10pt"] - forest_df["or_10pt_ci_lower_95"]
    x_err_upper = forest_df["or_10pt_ci_upper_95"] - forest_df["odds_ratio_10pt"]
    
    ax.errorbar(
        forest_df["odds_ratio_10pt"],
        y_pos,
        xerr=[x_err_lower, x_err_upper],
        fmt="o",
        color="#1E3A8A",
        ecolor="#3B82F6",
        elinewidth=2.5,
        capsize=5,
        capthick=1.5,
        markersize=9,
        label="Odds Ratio per +10 pts (95% CI)"
    )
    
    for idx, (_, row) in enumerate(forest_df.iterrows()):
        sig_text = f"OR: {row['odds_ratio_10pt']:.2f} [{row['or_10pt_ci_lower_95']:.2f}, {row['or_10pt_ci_upper_95']:.2f}] (p={row['p_val']:.3f})"
        ax.text(
            max(row["or_10pt_ci_upper_95"], row["odds_ratio_10pt"]) + 0.15,
            idx,
            sig_text,
            va="center",
            fontsize=9,
            fontweight="bold" if row["p_val"] < 0.05 else "normal",
            color="#0F172A"
        )
        
    ax.set_yticks(y_pos)
    ax.set_yticklabels(forest_df["feature_label"], fontsize=10, fontweight="bold")
    ax.set_xlabel("Odds Ratio for High Career Success per +10 Point Trait Increase", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_title("Impact of Personality Traits on Senior Career Success (Multivariable Logistic Regression)", fontsize=12, fontweight="bold", pad=15)
    ax.set_xlim(0, max(forest_df["or_10pt_ci_upper_95"]) + 2.0)
    ax.legend(frameon=True, facecolor="white", edgecolor="#CBD5E1", loc="lower right")
    
    plt.tight_layout()
    fig10_path = os.path.join(FIGURES_DIR, "fig10_sds_odds_ratios_forest.png")
    plt.savefig(fig10_path)
    plt.close()
    logging.info(f"Saved {fig10_path}")
    
    # FIG 11: Cross-Validation Benchmark & ROC Curves
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5.5), dpi=300)
    
    # Left: Boxplot of CV ROC-AUC
    sns.boxplot(
        data=fold_details,
        x="model",
        y="roc_auc",
        palette=["#3B82F6", "#60A5FA", "#10B981", "#F59E0B"],
        width=0.45,
        ax=ax1
    )
    ax1.set_title("A. 5-Fold CV Discriminative Power (ROC-AUC)", fontsize=11, fontweight="bold")
    ax1.set_ylabel("Area Under ROC Curve", fontsize=10, fontweight="bold")
    ax1.set_xlabel("Model Architecture", fontsize=10, fontweight="bold")
    ax1.set_xticklabels(ax1.get_xticklabels(), rotation=20, ha="right", fontsize=9)
    ax1.set_ylim(0.5, 1.0)
    
    # Right: ROC Curve of Best Calibrated Model on full sample
    X = df[trait_cols].values
    y = df[target_col].values
    scaler = StandardScaler()
    X_s = scaler.fit_transform(X)
    lr = LogisticRegression(C=1.0, random_state=42).fit(X_s, y)
    y_prob = lr.predict_proba(X_s)[:, 1]
    fpr, tpr, _ = roc_curve(y, y_prob)
    roc_score = auc(fpr, tpr)
    
    ax2.plot(fpr, tpr, color="#2563EB", lw=2.5, label=f"Calibrated Logit (AUC = {roc_score:.3f})")
    ax2.plot([0, 1], [0, 1], color="#94A3B8", lw=1.5, linestyle="--", label="Random Chance (AUC = 0.500)")
    ax2.set_title("B. In-Sample ROC Curve (Senior Success Classification)", fontsize=11, fontweight="bold")
    ax2.set_xlabel("False Positive Rate (1 - Specificity)", fontsize=10, fontweight="bold")
    ax2.set_ylabel("True Positive Rate (Sensitivity)", fontsize=10, fontweight="bold")
    ax2.legend(loc="lower right", frameon=True, facecolor="white", edgecolor="#CBD5E1")
    
    plt.tight_layout()
    fig11_path = os.path.join(FIGURES_DIR, "fig11_sds_roc_and_importance.png")
    plt.savefig(fig11_path)
    plt.close()
    logging.info(f"Saved {fig11_path}")


def main():
    logging.info("=== Starting Phase 4: Senior Data Scientist Personality Modeling ===")
    
    sds_path = os.path.join(PROCESSED_DIR, "sds_traits_clean.csv")
    df = pd.read_csv(sds_path)
    logging.info(f"Loaded SDS cleaned dataset: {len(df)} candidates")
    
    trait_cols = [
        "neuroticism",
        "extraversion",
        "openness_to_experience",
        "agreeableness",
        "conscientiousness"
    ]
    target_col = "success_classification_high_low"
    
    # 1. Univariate Statistical Tests
    run_univariate_trait_analysis(df, trait_cols, target_col)
    
    # 2. VIF & Correlations
    run_vif_and_correlations(df, trait_cols)
    
    # 3. Multivariable Logistic Regression
    summary_df, logit_model, diagnostics = run_logistic_regression(df, trait_cols, target_col)
    
    # 4. ML Benchmark (5-Fold CV)
    bench_df, fold_details = run_cross_validated_ml_benchmark(df, trait_cols, target_col)
    
    # 5. Export Production Pipeline Bundle
    export_production_model(df, trait_cols, target_col)
    
    # 6. Generate Publication Figures
    generate_figures(df, trait_cols, target_col, summary_df, fold_details)
    
    logging.info("=== Phase 4 Senior Data Scientist Modeling Complete ===")


if __name__ == "__main__":
    main()
