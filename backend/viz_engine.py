"""Visualization engine: infers schema and builds Plotly figures from a cleaned dataframe.

Presets supported:
- time_series (x: datetime, y: numeric, agg: sum|mean, time_grain: D|W|M|Q|Y)
- bar (x: category, y: numeric, agg: sum|mean, top_n optional)
- pie (category share of a numeric measure)
- scatter (x: numeric, y: numeric, color optional)
- heatmap (x: category, y: category, z: numeric agg)
"""
from __future__ import annotations
from typing import Dict, Any, List
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.io as pio
import json


def infer_schema(df: pd.DataFrame) -> Dict[str, List[str]]:
    numeric = df.select_dtypes(include=['number']).columns.tolist()
    categorical = df.select_dtypes(include=['object', 'category', 'string']).columns.tolist()
    datetime_cols = [c for c in df.columns if pd.api.types.is_datetime64_any_dtype(df[c])]
    # Try parsing common date-like columns if no dtype is datetime
    if not datetime_cols:
        for c in df.columns:
            s = df[c]
            if s.dtype == 'object':
                parsed = pd.to_datetime(s, errors='coerce')
                if parsed.notna().mean() > 0.7:
                    datetime_cols.append(c)
    return {
        'numeric': numeric,
        'categorical': categorical,
        'datetime': datetime_cols,
    }


def _apply_time_grain(s: pd.Series, grain: str) -> pd.Series:
    if not pd.api.types.is_datetime64_any_dtype(s):
        s = pd.to_datetime(s, errors='coerce')
    s = s.dropna()
    if grain == 'D':
        return s.dt.to_period('D').dt.to_timestamp()
    if grain == 'W':
        return s.dt.to_period('W').dt.to_timestamp()
    if grain == 'M':
        return s.dt.to_period('M').dt.to_timestamp()
    if grain == 'Q':
        return s.dt.to_period('Q').dt.to_timestamp()
    if grain == 'Y':
        return s.dt.to_period('Y').dt.to_timestamp()
    return s


def build_figure(df: pd.DataFrame, cfg: Dict[str, Any]) -> Dict[str, Any]:
    preset = cfg.get('preset')
    agg = cfg.get('agg', 'sum')
    if preset == 'time_series':
        x = cfg['x']
        y = cfg['y']
        grain = cfg.get('time_grain', 'M')
        dfx = df[[x, y]].dropna()
        dfx = dfx.copy()
        dfx[x] = _apply_time_grain(dfx[x], grain)
        grouped = getattr(dfx.groupby(x)[y], agg)().reset_index()
        title = cfg.get('title', f"{y} over time")
        fig = px.line(grouped, x=x, y=y, title=title)
        return json.loads(pio.to_json(fig))

    if preset == 'bar':
        x = cfg['x']  # category
        y = cfg['y']  # numeric
        top_n = int(cfg.get('top_n', 10))
        grouped = getattr(df.groupby(x)[y], agg)().sort_values(ascending=False).head(top_n).reset_index()
        title = cfg.get('title', f"Top {top_n} {x} by {y}")
        fig = px.bar(grouped, x=x, y=y, title=title)
        return json.loads(pio.to_json(fig))

    if preset == 'pie':
        category = cfg['category']
        value = cfg['value']
        grouped = getattr(df.groupby(category)[value], agg)().reset_index()
        # Apply top_n limit if specified
        top_n = cfg.get('top_n')
        if top_n and isinstance(top_n, int):
            grouped = grouped.sort_values(by=value, ascending=False).head(top_n)
        fig = px.pie(grouped, names=category, values=value, title=cfg.get('title', f"{category} share of {value}"), hole=0.4)
        return json.loads(pio.to_json(fig))

    if preset == 'scatter':
        x = cfg['x']
        y = cfg['y']
        color = cfg.get('color')
        fig = px.scatter(df, x=x, y=y, color=color, title=cfg.get('title', f"{y} vs {x}"))
        return json.loads(pio.to_json(fig))

    if preset == 'heatmap':
        x = cfg['x']  # category
        y = cfg['y']  # category
        value = cfg['value']  # numeric
        grouped = getattr(df.groupby([y, x])[value], agg)().reset_index()
        pivot = grouped.pivot(index=y, columns=x, values=value).fillna(0)
        fig = px.imshow(pivot, aspect='auto', title=cfg.get('title', f"Heatmap of {value} by {y} x {x}"))
        return json.loads(pio.to_json(fig))

    if preset == 'funnel':
        stage = cfg['stage']
        value = cfg['value']
        grouped = getattr(df.groupby(stage)[value], agg)().reset_index()
        # Ensure order resembles funnel by value desc
        grouped = grouped.sort_values(by=value, ascending=False)
        fig = px.funnel(grouped, x=value, y=stage, title=cfg.get('title', 'Funnel'))
        return json.loads(pio.to_json(fig))

    raise ValueError(f"Unsupported preset: {preset}")
