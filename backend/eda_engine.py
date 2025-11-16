"""EDA engine to compute stats, detect correlations, and generate Plotly charts.
"""
from __future__ import annotations
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.io as pio
import json
from typing import Dict, Any, List


def generate_stats(df: pd.DataFrame) -> Dict[str, Any]:
    stats: Dict[str, Any] = {}
    num_df = df.select_dtypes(include=['number'])
    if not num_df.empty:
        desc = num_df.describe().to_dict()
        # Ensure basic stats are present explicitly per column
        per_col = {}
        for col in num_df.columns:
            s = num_df[col].dropna()
            if s.empty:
                continue
            per_col[col] = {
                'mean': float(s.mean()),
                'median': float(s.median()),
                'std': float(s.std(ddof=1)) if len(s) > 1 else 0.0,
                'min': float(s.min()),
                'max': float(s.max()),
            }
        stats['numeric'] = per_col
    else:
        stats['numeric'] = {}

    return stats


def generate_correlations(df: pd.DataFrame) -> Dict[str, Any]:
    num_df = df.select_dtypes(include=['number'])
    if num_df.shape[1] < 2:
        return {'top_pairs': []}
    corr = num_df.corr(numeric_only=True)
    pairs: List[Dict[str, Any]] = []
    # Extract upper triangle pairs
    cols = corr.columns
    for i in range(len(cols)):
        for j in range(i+1, len(cols)):
            val = corr.iloc[i, j]
            if pd.notna(val):
                pairs.append({'x': cols[i], 'y': cols[j], 'corr': float(val), 'abs_corr': float(abs(val))})
    pairs.sort(key=lambda d: d['abs_corr'], reverse=True)
    return {'top_pairs': pairs[:3]}


def _find_datetime_column(df: pd.DataFrame) -> str | None:
    # Prefer columns already parsed as datetime
    for col in df.columns:
        if pd.api.types.is_datetime64_any_dtype(df[col]):
            return col
    # Fallback: try to parse object columns quickly
    for col in df.select_dtypes(include=['object']).columns:
        try:
            parsed = pd.to_datetime(df[col], errors='coerce')
            if parsed.notna().mean() > 0.6:
                return col
        except Exception:
            pass
    return None


def _top_category_column(df: pd.DataFrame, max_unique: int = 50) -> str | None:
    cat_cols = df.select_dtypes(include=['object', 'category']).columns
    best_col = None
    best_unique = 0
    for col in cat_cols:
        nunique = int(df[col].nunique(dropna=True))
        if 2 <= nunique <= max_unique and nunique > best_unique:
            best_unique = nunique
            best_col = col
    return best_col


def _first_numeric_column(df: pd.DataFrame) -> str | None:
    num_cols = df.select_dtypes(include=['number']).columns
    return num_cols[0] if len(num_cols) else None


def _scatter_for_top_corr(df: pd.DataFrame) -> Dict[str, Any] | None:
    corr_info = generate_correlations(df)
    if not corr_info['top_pairs']:
        return None
    pair = corr_info['top_pairs'][0]
    x, y = pair['x'], pair['y']
    fig = px.scatter(df, x=x, y=y, title=f"Scatter: {x} vs {y} (corr={pair['corr']:.2f})")
    return {
        'id': 'scatter_top_corr',
        'title': f"{x} vs {y}",
        'figure': json.loads(pio.to_json(fig))
    }


def generate_charts(df: pd.DataFrame) -> List[Dict[str, Any]]:
    charts: List[Dict[str, Any]] = []

    # 1) Time series if datetime + numeric present
    date_col = _find_datetime_column(df)
    num_col = _first_numeric_column(df)
    if date_col and num_col:
        tmp = df[[date_col, num_col]].dropna()
        # Aggregate by date (day)
        if not pd.api.types.is_datetime64_any_dtype(tmp[date_col]):
            tmp[date_col] = pd.to_datetime(tmp[date_col], errors='coerce')
        tmp = tmp.dropna(subset=[date_col])
        tmp = tmp.groupby(tmp[date_col].dt.to_period('D')).agg({num_col: 'sum'}).reset_index()
        tmp[date_col] = tmp[date_col].dt.to_timestamp()
        fig_line = px.line(tmp, x=date_col, y=num_col, title=f"{num_col} over time")
        charts.append({
            'id': 'timeseries',
            'title': f"{num_col} over time",
            'figure': json.loads(pio.to_json(fig_line))
        })

    # 2) Top categories bar chart
    cat_col = _top_category_column(df)
    if cat_col and num_col:
        agg = df.groupby(cat_col)[num_col].sum().sort_values(ascending=False).head(10).reset_index()
        fig_bar = px.bar(agg, x=cat_col, y=num_col, title=f"Top 10 {cat_col} by {num_col}")
        charts.append({
            'id': 'top_categories',
            'title': f"Top 10 {cat_col} by {num_col}",
            'figure': json.loads(pio.to_json(fig_bar))
        })

    # 3) Scatter for top correlation pair
    scatter = _scatter_for_top_corr(df)
    if scatter:
        charts.append(scatter)

    # Fallback: histogram of first numeric column if we have < 3 charts
    if len(charts) < 3 and num_col:
        fig_hist = px.histogram(df, x=num_col, nbins=30, title=f"Distribution of {num_col}")
        charts.append({
            'id': 'histogram',
            'title': f"Distribution of {num_col}",
            'figure': json.loads(pio.to_json(fig_hist))
        })

    # Limit to top 3
    return charts[:3]
