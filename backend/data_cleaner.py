"""Data cleaning utilities for CSV uploads.

Rules:
- Drop duplicates
- Fill missing numeric values with MEAN
- Fill missing categorical values with MODE
- Attempt to convert date-like columns via pandas.to_datetime
- Return a human-readable cleaning summary
"""
from __future__ import annotations
import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any


def _detect_datetime_columns(df: pd.DataFrame) -> list[str]:
    """Detect columns that look like datetimes.

    Important: Only consider object/category/text columns to avoid
    incorrectly converting numeric measures to datetimes.
    """
    date_cols: list[str] = []
    text_like = df.select_dtypes(include=['object', 'string', 'category']).columns
    for col in text_like:
        s = df[col]
        try:
            parsed = pd.to_datetime(s, errors='coerce')
            # Heuristic: at least 70% parseable and at least 10 unique non-null values
            if parsed.notna().mean() >= 0.7 and parsed.nunique(dropna=True) >= 10:
                date_cols.append(col)
        except Exception:
            pass
    return date_cols


def clean_csv_and_summary(
    df: pd.DataFrame,
    *,
    auto_clean: bool = True,
    outlier_detection: bool = True,
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    original_rows = int(df.shape[0])
    original_missing = int(df.isna().sum().sum())

    # Drop duplicates
    if auto_clean:
        before_dups = int(df.shape[0])
        df = df.drop_duplicates()
        duplicates_removed = before_dups - int(df.shape[0])
    else:
        duplicates_removed = 0

    # Fill numeric with mean (only if auto_clean)
    num_cols = df.select_dtypes(include=['number']).columns
    numeric_missing_filled = 0
    if auto_clean:
        for col in num_cols:
            na_count = int(df[col].isna().sum())
            if na_count > 0:
                mean_val = df[col].mean()
                df[col] = df[col].fillna(mean_val)
                numeric_missing_filled += na_count

    # Fill categorical with mode (only if auto_clean)
    cat_cols = df.select_dtypes(include=['object', 'category']).columns
    categorical_missing_filled = 0
    if auto_clean:
        for col in cat_cols:
            na_count = int(df[col].isna().sum())
            if na_count > 0:
                try:
                    mode_val = df[col].mode(dropna=True)
                    if not mode_val.empty:
                        fill_val = mode_val.iloc[0]
                    else:
                        fill_val = ""
                except Exception:
                    fill_val = ""
                df[col] = df[col].fillna(fill_val)
                categorical_missing_filled += na_count

    # Convert datetime columns
    date_cols = _detect_datetime_columns(df)
    converted_date_cols: list[str] = []
    for col in date_cols:
        try:
            df[col] = pd.to_datetime(df[col], errors='coerce')
            converted_date_cols.append(col)
        except Exception:
            # Ignore conversion failures
            pass

    # Detect and cap outliers on numeric columns using IQR rule (only if enabled)
    # Values outside [Q1 - 1.5*IQR, Q3 + 1.5*IQR] are clipped to the bounds
    outliers_capped: Dict[str, Any] = {}
    if outlier_detection:
        num_df_cols = df.select_dtypes(include=['number']).columns
        for col in num_df_cols:
            s = df[col].copy()  # Fix SettingWithCopyWarning
            if s.dropna().empty:
                continue
            q1 = s.quantile(0.25)
            q3 = s.quantile(0.75)
            iqr = q3 - q1
            if pd.isna(iqr) or iqr == 0:
                continue
            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr
            below = int((s < lower).sum())
            above = int((s > upper).sum())
            if below > 0 or above > 0:
                df.loc[:, col] = s.clip(lower, upper)  # Use .loc to avoid warning
                outliers_capped[col] = {
                    'lower_bound': float(lower),
                    'upper_bound': float(upper),
                    'count_below': below,
                    'count_above': above,
                    'total_capped': below + above,
                }

    total_after_missing = int(df.isna().sum().sum())
    total_filled = numeric_missing_filled + categorical_missing_filled

    # Build human-readable summary text
    outlier_part = ''
    if outliers_capped:
        total_capped = sum(v['total_capped'] for v in outliers_capped.values())
        outlier_part = f"; capped {total_capped} outlier value(s) across {len(outliers_capped)} numeric column(s) using IQR"
    elif not outlier_detection:
        outlier_part = '; outlier capping disabled'
    summary_text = (
        f"{total_filled} missing values filled "
        f"({numeric_missing_filled} numeric with mean, {categorical_missing_filled} categorical with mode); "
        f"{duplicates_removed} duplicates removed; "
        f"converted {len(converted_date_cols)} date column(s): {', '.join(converted_date_cols) if converted_date_cols else 'none'}"
        f"{outlier_part}."
    )

    summary = {
        'original_rows': original_rows,
        'rows_after_cleaning': int(df.shape[0]),
        'duplicates_removed': duplicates_removed,
        'numeric_missing_filled': numeric_missing_filled,
        'categorical_missing_filled': categorical_missing_filled,
        'date_columns_converted': converted_date_cols,
        'outliers_capped': outliers_capped,
        'summary_text': summary_text,
        'auto_clean': auto_clean,
        'outlier_detection': outlier_detection,
    }

    return df, summary
