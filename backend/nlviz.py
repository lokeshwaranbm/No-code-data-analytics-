from __future__ import annotations
from typing import Dict, Any, List, Optional
import re
import pandas as pd
from datetime import datetime, timedelta, timezone

# Heuristic interpreter for natural-language viz prompts.
# Returns a plan: { 'config': <viz_engine config>, 'time_filter': {'date_col': str, 'start': iso|None, 'end': iso|None} | None }


def _normalize(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


SALES_SYNONYMS = [
    'sale', 'sales', 'selling price', 'sellingprice', 'price', 'amount', 'revenue', 'turnover', 'gmv'
]
CATEGORY_SYNONYMS = [
    'category', 'segment', 'product', 'item', 'sku', 'brand', 'type', 'region', 'country', 'state', 'city', 'area'
]
DATE_SYNONYMS = [
    'date', 'order date', 'invoice date', 'sale date', 'created', 'created at', 'timestamp', 'time'
]


def _find_col(prompt: str, candidates: List[str]) -> Optional[str]:
    p = _normalize(prompt)
    best = None
    best_len = 0
    for c in candidates:
        cn = _normalize(c)
        if not cn:
            continue
        if cn in p and len(cn) > best_len:
            best = c
            best_len = len(cn)
    return best


def _extract_number(prompt: str) -> Optional[int]:
    m = re.search(r"\b(\d{1,3})\b", prompt)
    if m:
        try:
            return int(m.group(1))
        except ValueError:
            return None
    return None


def _detect_time_grain(prompt: str) -> str:
    p = prompt.lower()
    if any(w in p for w in ["daily", "day", "per day"]):
        return 'D'
    if any(w in p for w in ["weekly", "week", "per week"]):
        return 'W'
    if any(w in p for w in ["quarter", "quarterly", "qtr"]):
        return 'Q'
    if any(w in p for w in ["yearly", "annual", "per year"]):
        return 'Y'
    return 'M'


def _parse_time_filter(prompt: str, df: pd.DataFrame, date_cols: List[str]) -> Optional[Dict[str, Any]]:
    if not date_cols:
        return None
    date_col = date_cols[0]
    now = datetime.now(timezone.utc)
    p = prompt.lower()

    # last month
    if "last month" in p:
        first_this_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_month_end = first_this_month - timedelta(seconds=1)
        last_month_start = last_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return {
            'date_col': date_col,
            'start': last_month_start.isoformat(),
            'end': last_month_end.isoformat()
        }
    # this month
    if "this month" in p or "current month" in p:
        first_this_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return { 'date_col': date_col, 'start': first_this_month.isoformat(), 'end': now.isoformat() }
    # last week
    if "last week" in p:
        start = (now - timedelta(days=now.weekday()+7)).replace(hour=0, minute=0, second=0, microsecond=0)
        end = start + timedelta(days=6, hours=23, minutes=59, seconds=59)
        return { 'date_col': date_col, 'start': start.isoformat(), 'end': end.isoformat() }
    # last year
    if "last year" in p:
        start = now.replace(year=now.year-1, month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        end = now.replace(year=now.year-1, month=12, day=31, hour=23, minute=59, second=59, microsecond=0)
        return { 'date_col': date_col, 'start': start.isoformat(), 'end': end.isoformat() }

    # specific year
    m = re.search(r"\b(20\d{2})\b", p)
    if m:
        yr = int(m.group(1))
        start = now.replace(year=yr, month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        end = now.replace(year=yr, month=12, day=31, hour=23, minute=59, second=59, microsecond=0)
        return { 'date_col': date_col, 'start': start.isoformat(), 'end': end.isoformat() }

    return None


def _deprioritize_ids(cols: List[str]) -> List[str]:
    # move id/code-like columns to the end
    id_like = []
    rest = []
    for c in cols:
        cn = _normalize(c)
        if cn.endswith('id') or cn.endswith('code') or cn == 'id' or 'invoice' in cn and 'amount' not in cn:
            id_like.append(c)
        else:
            rest.append(c)
    return rest + id_like


def _match_by_synonyms(prompt: str, candidates: List[str], synonyms: List[str]) -> Optional[str]:
    p = _normalize(prompt)
    for syn in synonyms:
        sn = _normalize(syn)
        for c in candidates:
            cn = _normalize(c)
            if sn and cn and sn in cn:
                return c
            if sn and cn and cn in sn:  # rare case
                return c
    # fallback: contain check of candidate in prompt
    m = _find_col(prompt, candidates)
    return m


def _validate_chart_suitability(preset: str, schema: Dict[str, List[str]], df: pd.DataFrame) -> Optional[str]:
    """Check if requested chart type is suitable for the dataset. Returns warning message or None."""
    numeric = schema.get('numeric', [])
    categorical = schema.get('categorical', [])
    datetime_cols = schema.get('datetime', [])
    
    if preset == 'pie':
        # Pie needs at least one categorical and one numeric
        if not categorical:
            return "⚠️ Pie charts need categorical data (like product names, brands, categories). Your dataset has only numeric columns. Try a scatter plot or time series instead."
        if not numeric:
            return "⚠️ Pie charts need numeric values to show proportions. Your dataset has no numeric columns."
        # Check if categorical has too many unique values
        if categorical:
            cat_col = categorical[0]
            unique_count = df[cat_col].nunique()
            if unique_count > 50:
                return f"⚠️ The category '{cat_col}' has {unique_count} unique values. Pie charts work best with fewer categories (under 20). Consider using a bar chart with 'top N' instead."
    
    elif preset == 'bar':
        # Bar needs categorical x and numeric y
        if not categorical:
            return "⚠️ Bar charts need categorical data for the X-axis. Your dataset has only numeric columns. Try a scatter plot or histogram instead."
        if not numeric:
            return "⚠️ Bar charts need numeric values for the Y-axis. Your dataset has no numeric columns."
    
    elif preset == 'time_series':
        # Time series needs datetime and numeric
        if not datetime_cols:
            return "⚠️ Time series charts need a date/time column. Your dataset doesn't have any date columns. Try a bar or pie chart instead."
        if not numeric:
            return "⚠️ Time series charts need numeric values. Your dataset has no numeric columns."
    
    elif preset == 'scatter':
        # Scatter needs at least 2 numeric columns
        if len(numeric) < 2:
            return f"⚠️ Scatter plots need at least 2 numeric columns to compare. Your dataset has only {len(numeric)} numeric column(s). Try a bar or pie chart instead."
    
    elif preset == 'heatmap':
        # Heatmap needs 2 categorical and 1 numeric
        if len(categorical) < 2:
            return "⚠️ Heatmaps need at least 2 categorical columns. Try a bar chart or scatter plot instead."
        if not numeric:
            return "⚠️ Heatmaps need numeric values. Your dataset has no numeric columns."
    
    return None


def interpret_prompt(prompt: str, df: pd.DataFrame, schema: Dict[str, List[str]]) -> Dict[str, Any]:
    p = prompt.strip()
    if not p:
        raise ValueError('Empty prompt')

    # Quick validation: check if prompt contains any analysis-related keywords
    pl = p.lower()
    analysis_keywords = [
        'show', 'display', 'chart', 'graph', 'plot', 'visualize', 'trend', 'compare', 'analysis', 'analyze',
        'top', 'bottom', 'highest', 'lowest', 'most', 'least', 'sum', 'total', 'average', 'mean', 'count',
        'sales', 'revenue', 'price', 'discount', 'product', 'category', 'date', 'month', 'week', 'year', 'day',
        'share', 'proportion', 'distribution', 'breakdown', 'composition', 'market', 'performance',
        'relationship', 'correlation', 'scatter', 'bar', 'pie', 'line', 'time series', 'over time',
        'last', 'this', 'current', 'vs', 'versus', 'by', 'per', 'each', 'report', 'summary', 'overview'
    ]
    
    # Reject common conversational phrases that don't relate to data
    conversational_rejects = ['how are you', 'who are you', 'what is your name', 'hello', 'hi ', 'hey ', 'thanks', 'thank you']
    if any(phrase in pl for phrase in conversational_rejects):
        raise ValueError(
            'I can only help with data visualizations. Please ask for a chart or analysis, for example:\n'
            '• "show me sales last month"\n'
            '• "top 10 products by revenue"\n'
            '• "monthly trend"\n'
            '• "discount vs price"\n'
            '• "market share by category"'
        )
    
    has_analysis_intent = any(kw in pl for kw in analysis_keywords)
    
    # Also check if prompt references any actual column names
    all_cols = schema.get('numeric', []) + schema.get('categorical', []) + schema.get('datetime', [])
    references_columns = any(_normalize(col) in _normalize(p) for col in all_cols if col)
    
    if not has_analysis_intent and not references_columns:
        raise ValueError(
            'Could not understand your request. Please ask for a chart or analysis, for example:\n'
            '• "show me sales last month"\n'
            '• "top 10 products by revenue"\n'
            '• "monthly trend"\n'
            '• "discount vs price"\n'
            '• "market share by category"'
        )

    numeric = _deprioritize_ids(schema.get('numeric', []))
    categorical = schema.get('categorical', [])
    datetime_cols = schema.get('datetime', [])

    # best-guess metric and category from prompt
    metric = _match_by_synonyms(p, numeric, SALES_SYNONYMS) or _find_col(p, numeric) or (numeric[0] if numeric else None)
    # "by <something>" capture
    by_match = re.search(r"\bby\s+([a-zA-Z0-9_\-\s]+)", p.lower())
    specified_cat = by_match.group(1).strip() if by_match else None
    category = None
    if specified_cat:
        category = _find_col(specified_cat, categorical) or _match_by_synonyms(specified_cat, categorical, CATEGORY_SYNONYMS)
    if not category:
        category = _match_by_synonyms(p, categorical, CATEGORY_SYNONYMS) or _find_col(p, categorical) or (categorical[0] if categorical else (numeric[0] if numeric else None))
    # prefer a date-like column if user mentions date explicitly
    if not datetime_cols:
        # try to detect from categorical if any look like date
        for c in categorical:
            try:
                parsed = pd.to_datetime(df[c], errors='coerce')
                if parsed.notna().mean() > 0.7:
                    datetime_cols = [c]
                    break
            except Exception:
                pass

    # detect chart intent
    time_words = ["over time", "trend", "timeseries", "time series", "by month", "by week", "by day", "last month", "this month", "last week", "last year"]
    is_time_series = any(w in pl for w in time_words) or (datetime_cols and ("last" in pl or "this" in pl or "month" in pl or "week" in pl or "year" in pl))

    # Check for explicit chart type mentions first (highest priority)
    explicit_pie = any(w in pl for w in ["pie chart", "in a pie", "as a pie", "in pie", "donut chart", "donut"])
    explicit_bar = any(w in pl for w in ["bar chart", "in a bar", "as a bar", "bar graph", "column chart"])
    explicit_scatter = any(w in pl for w in ["scatter plot", "scatter chart", "in a scatter", "as scatter"])
    explicit_line = any(w in pl for w in ["line chart", "line graph", "trend line"])

    # Explicit pie chart request (e.g., "top 5 brands in a pie chart")
    if explicit_pie and category and metric:
        # Validate suitability first
        warning = _validate_chart_suitability('pie', schema, df)
        if warning:
            raise ValueError(warning)
        
        top_n = _extract_number(pl) or 10
        return {
            'config': {
                'preset': 'pie',
                'category': category,
                'value': metric,
                'agg': 'sum',
                'top_n': top_n,
                'title': f"Top {top_n} {category} share of {metric}"
            },
            'time_filter': _parse_time_filter(pl, df, datetime_cols),
            'explanation': f"Explicit pie chart: top {top_n} '{category}' of '{metric}'."
        }

    # Explicit bar chart request
    if explicit_bar and category and metric:
        # Validate suitability first
        warning = _validate_chart_suitability('bar', schema, df)
        if warning:
            raise ValueError(warning)
        
        top_n = _extract_number(pl) or 10
        return {
            'config': {
                'preset': 'bar',
                'x': category,
                'y': metric,
                'agg': 'sum',
                'top_n': top_n,
                'title': f"Top {top_n} {category} by {metric}"
            },
            'time_filter': _parse_time_filter(pl, df, datetime_cols),
            'explanation': f"Explicit bar chart: top {top_n} '{category}' by '{metric}'."
        }

    # share intent => prefer pie even if a time reference exists; time filter will be applied
    if any(w in pl for w in ["share", "proportion", "composition", "market share"]) and category and metric:
        warning = _validate_chart_suitability('pie', schema, df)
        if warning:
            raise ValueError(warning)
        
        return {
            'config': {
                'preset': 'pie',
                'category': category,
                'value': metric,
                'agg': 'sum',
                'title': f"{category} share of {metric}"
            },
            'time_filter': _parse_time_filter(pl, df, datetime_cols),
            'explanation': f"Detected composition (pie) for '{category}' of '{metric}'."
        }

    if is_time_series and datetime_cols and metric:
        warning = _validate_chart_suitability('time_series', schema, df)
        if warning:
            raise ValueError(warning)
        
        grain = _detect_time_grain(pl)
        return {
            'config': {
                'preset': 'time_series',
                'x': datetime_cols[0],
                'y': metric,
                'agg': 'sum',
                'time_grain': grain,
                'title': f"{metric} over time"
            },
            'time_filter': _parse_time_filter(pl, df, datetime_cols),
            'explanation': f"Detected time series for metric '{metric}' with grain {grain}."
        }

    # top N category intent
    if any(w in pl for w in ["top ", "highest", "most", "best"] ) and category and metric:
        top_n = _extract_number(pl) or 10
        return {
            'config': {
                'preset': 'bar',
                'x': category,
                'y': metric,
                'agg': 'sum',
                'top_n': top_n,
                'title': f"Top {top_n} {category} by {metric}"
            },
            'time_filter': _parse_time_filter(pl, df, datetime_cols),
            'explanation': f"Detected top {top_n} by '{category}' for metric '{metric}'."
        }

    # (share already handled above)

    # relationship intent => scatter
    vs_match = re.search(r"\b([a-zA-Z0-9_\-\s]+)\s+vs\s+([a-zA-Z0-9_\-\s]+)\b", p, re.IGNORECASE)
    if vs_match:
        xcand = vs_match.group(1).strip()
        ycand = vs_match.group(2).strip()
        xcol = _find_col(xcand, numeric) or _match_by_synonyms(xcand, numeric, SALES_SYNONYMS) or (numeric[0] if numeric else None)
        ycol = _find_col(ycand, numeric) or _match_by_synonyms(ycand, numeric, SALES_SYNONYMS) or (numeric[1] if len(numeric) > 1 else xcol)
        if xcol and ycol:
            warning = _validate_chart_suitability('scatter', schema, df)
            if warning:
                raise ValueError(warning)
            
            return {
                'config': {
                    'preset': 'scatter', 'x': xcol, 'y': ycol, 'title': f"{ycol} vs {xcol}"
                },
                'time_filter': _parse_time_filter(pl, df, datetime_cols),
                'explanation': f"Detected scatter of '{ycol}' vs '{xcol}'."
            }

    if any(w in pl for w in ["relationship", "correlation", "scatter"]) and len(numeric) >= 2:
        warning = _validate_chart_suitability('scatter', schema, df)
        if warning:
            raise ValueError(warning)
        
        xcol = metric or numeric[0]
        ycol = next((c for c in numeric if c != xcol), numeric[0])
        return {
            'config': {
                'preset': 'scatter',
                'x': xcol,
                'y': ycol,
                'title': f"{ycol} vs {xcol}"
            },
            'time_filter': _parse_time_filter(pl, df, datetime_cols),
            'explanation': f"Detected scatter relationship between '{ycol}' and '{xcol}'."
        }

    # default: bar if we have category+metric else pie else scatter
    if category and metric:
        warning = _validate_chart_suitability('bar', schema, df)
        if warning:
            raise ValueError(warning)
        
        return {
            'config': {
                'preset': 'bar',
                'x': category,
                'y': metric,
                'agg': 'sum',
                'top_n': 10,
                'title': f"{metric} by {category}"
            },
            'time_filter': _parse_time_filter(pl, df, datetime_cols),
            'explanation': f"Defaulted to bar chart: '{metric}' by '{category}'."
        }

    if category and numeric:
        warning = _validate_chart_suitability('pie', schema, df)
        if warning:
            raise ValueError(warning)
        
        return {
            'config': {
                'preset': 'pie',
                'category': category,
                'value': numeric[0],
                'agg': 'sum',
                'title': f"{category} share"
            },
            'time_filter': _parse_time_filter(pl, df, datetime_cols),
            'explanation': f"Defaulted to pie: '{category}' share of '{numeric[0]}'."
        }

    if len(numeric) >= 2:
        warning = _validate_chart_suitability('scatter', schema, df)
        if warning:
            raise ValueError(warning)
        
        return {
            'config': {
                'preset': 'scatter',
                'x': numeric[0],
                'y': numeric[1],
                'title': f"{numeric[1]} vs {numeric[0]}"
            },
            'time_filter': _parse_time_filter(pl, df, datetime_cols),
            'explanation': f"Defaulted to scatter: '{numeric[1]}' vs '{numeric[0]}'."
        }

    raise ValueError('Could not determine a suitable chart from the prompt and dataset schema')
