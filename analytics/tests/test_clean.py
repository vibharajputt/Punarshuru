"""
Punarshuru Analytics Test Suite
File: /analytics/tests/test_clean.py

Verifies integrity of data processing pipelines implemented in clean.py:
1. ID uniqueness (no duplicate IDs in cleaned datasets)
2. Salary numerical validity and interval monotonicity (min <= avg <= max)
3. Salary bands restricted to 0..5 ordinal domain
4. Rating scale boundaries (1.0-5.0 for JDS skills, 0.0-100.0 for SDS traits)
5. Correct target renaming and binary coding (high_hike, high_success in {0, 1})
6. Derived categorical domains (seniority, role_family, boolean flags)
7. Report and table generation (data_quality_log.csv, before_after_profile.csv)
"""

import os
import pandas as pd
import numpy as np
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
TABLES_DIR = os.path.join(REPORTS_DIR, "tables")


@pytest.fixture(scope="session")
def ds_jobs():
    path = os.path.join(PROCESSED_DIR, "ds_jobs_clean.csv")
    assert os.path.exists(path), f"File not found: {path}"
    return pd.read_csv(path)


@pytest.fixture(scope="session")
def analytics_jobs():
    path = os.path.join(PROCESSED_DIR, "analytics_jobs_clean.csv")
    assert os.path.exists(path), f"File not found: {path}"
    return pd.read_csv(path)


@pytest.fixture(scope="session")
def jds():
    path = os.path.join(PROCESSED_DIR, "jds_clean.csv")
    assert os.path.exists(path), f"File not found: {path}"
    return pd.read_csv(path)


@pytest.fixture(scope="session")
def sds():
    path = os.path.join(PROCESSED_DIR, "sds_clean.csv")
    assert os.path.exists(path), f"File not found: {path}"
    return pd.read_csv(path)


class TestDSJobsCleaning:
    def test_no_duplicate_job_ids(self, ds_jobs):
        assert "job_id" in ds_jobs.columns
        assert ds_jobs["job_id"].is_unique, "job_id must be completely unique"
        assert len(ds_jobs) == 1602, "All 1,602 valid distinct jobs must be preserved"

    def test_salary_numeric_and_monotonic(self, ds_jobs):
        for col in ["min_salary", "avg_salary", "max_salary"]:
            assert col in ds_jobs.columns
            assert np.issubdtype(ds_jobs[col].dtype, np.number), f"{col} must be numeric"
            assert ds_jobs[col].isna().sum() == 0, f"{col} cannot contain nulls"

        # Check min <= avg <= max
        valid_monotonic = (ds_jobs["min_salary"] <= ds_jobs["avg_salary"]) & (ds_jobs["avg_salary"] <= ds_jobs["max_salary"])
        assert valid_monotonic.all(), "All records must satisfy min_salary <= avg_salary <= max_salary"

    def test_log_num_of_jobs(self, ds_jobs):
        assert "log_num_of_jobs" in ds_jobs.columns
        assert (ds_jobs["log_num_of_jobs"] >= 0).all()
        assert np.isfinite(ds_jobs["log_num_of_jobs"]).all()

    def test_seniority_and_role_family(self, ds_jobs):
        assert "seniority" in ds_jobs.columns
        assert set(ds_jobs["seniority"].unique()).issubset({"Senior", "Non-senior"})

        expected_families = {
            "Data Science", "Data Analysis", "Data Engineering",
            "Business Analysis", "ML", "Architecture"
        }
        assert set(ds_jobs["role_family"].unique()).issubset(expected_families)

    def test_exp_outlier_flag(self, ds_jobs):
        assert "exp_outlier" in ds_jobs.columns
        assert ds_jobs["exp_outlier"].dtype == bool


class TestAnalyticsJobsCleaning:
    def test_no_duplicate_job_ids_and_dropped_dups(self, analytics_jobs):
        assert "job_id" in analytics_jobs.columns
        assert analytics_jobs["job_id"].is_unique, "job_id must be unique"
        # 15,841 raw - 1,001 exact content duplicates = 14,840
        assert len(analytics_jobs) == 14840

    def test_salary_bands_in_zero_to_five(self, analytics_jobs):
        assert "salary_band" in analytics_jobs.columns
        assert set(analytics_jobs["salary_band"].unique()).issubset({0, 1, 2, 3, 4, 5})

    def test_band_mid_lpa_numeric(self, analytics_jobs):
        assert "band_mid_lpa" in analytics_jobs.columns
        assert np.issubdtype(analytics_jobs["band_mid_lpa"].dtype, np.number)
        assert (analytics_jobs["band_mid_lpa"] > 0).all()

    def test_experience_numeric_and_consistent(self, analytics_jobs):
        for col in ["exp_min", "exp_max", "exp_mid"]:
            assert col in analytics_jobs.columns
            assert np.issubdtype(analytics_jobs[col].dtype, np.number)
        assert (analytics_jobs["exp_min"] <= analytics_jobs["exp_max"]).all()

    def test_job_type_normalized(self, analytics_jobs):
        assert "job_type" in analytics_jobs.columns
        assert analytics_jobs["job_type"].isna().sum() == 0, "Missing job_type must be kept as 'Unknown'"

    def test_city_and_remote_flags(self, analytics_jobs):
        assert "primary_city" in analytics_jobs.columns
        assert "is_multi_city" in analytics_jobs.columns
        assert analytics_jobs["is_multi_city"].dtype == bool
        assert "is_remote_or_wfh" in analytics_jobs.columns
        assert analytics_jobs["is_remote_or_wfh"].dtype == bool
        assert "skill_count" in analytics_jobs.columns
        assert (analytics_jobs["skill_count"] >= 0).all()


class TestJDSCleaning:
    def test_no_duplicate_ids(self, jds):
        assert "id" in jds.columns
        assert jds["id"].is_unique, "JDS candidate IDs must be strictly unique after dropping conflicting duplicates"
        assert len(jds) == 137, "JDS must contain exactly 137 unique candidates"

    def test_snake_case_columns(self, jds):
        for col in jds.columns:
            assert " " not in col, f"Column '{col}' must not contain spaces"
            assert "-" not in col, f"Column '{col}' must not contain hyphens"
            assert col == col.lower(), f"Column '{col}' must be lowercase"

    def test_skill_ranges_valid(self, jds):
        skill_cols = [
            "big_data_skills", "maths_stats_skills", "coding_skills",
            "ai_and_ml_skills", "dashboard_and_storytelling_skills"
        ]
        for col in skill_cols:
            assert col in jds.columns
            assert (jds[col] >= 1.0).all(), f"{col} must be >= 1.0"
            assert (jds[col] <= 5.0).all(), f"{col} must be <= 5.0"

    def test_high_hike_binary_target(self, jds):
        assert "high_hike" in jds.columns
        assert set(jds["high_hike"].unique()).issubset({0, 1})


class TestSDSCleaning:
    def test_no_duplicate_ids(self, sds):
        assert "id" in sds.columns
        assert sds["id"].is_unique, "SDS candidate IDs must be strictly unique after dropping conflicting duplicates"
        assert len(sds) == 152, "SDS must contain exactly 152 unique leaders"

    def test_snake_case_columns(self, sds):
        for col in sds.columns:
            assert " " not in col, f"Column '{col}' must not contain spaces"
            assert col == col.lower(), f"Column '{col}' must be lowercase"

    def test_personality_ranges_valid(self, sds):
        trait_cols = [
            "neuroticism", "extraversion", "openness_to_experience",
            "agreeableness", "conscientiousness"
        ]
        for col in trait_cols:
            assert col in sds.columns
            assert (sds[col] >= 0.0).all(), f"{col} must be >= 0.0"
            assert (sds[col] <= 100.0).all(), f"{col} must be <= 100.0"

    def test_high_success_binary_target(self, sds):
        assert "high_success" in sds.columns
        assert set(sds["high_success"].unique()).issubset({0, 1})


class TestReportsAndProfiles:
    def test_data_quality_log_exists_and_valid(self):
        log_path = os.path.join(REPORTS_DIR, "data_quality_log.csv")
        assert os.path.exists(log_path)
        df_log = pd.read_csv(log_path)
        assert len(df_log) > 0
        expected_cols = ["dataset", "issue", "rows_affected", "action_taken", "justification"]
        assert list(df_log.columns) == expected_cols

    def test_before_after_profile_table_exists(self):
        table_path = os.path.join(TABLES_DIR, "before_after_profile.csv")
        assert os.path.exists(table_path)
        df_prof = pd.read_csv(table_path)
        assert len(df_prof) == 8, "Profile table must have 8 rows (Before & After for 4 datasets)"
        assert set(df_prof["stage"].unique()) == {"Before", "After"}
