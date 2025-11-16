import json
import pandas as pd
from viz_engine import infer_schema, build_figure
from nlviz import interpret_prompt

# Load test CSV
path = r'd:/Nxtwave/No_Code_dataAnalyst/backend/test_sales.csv'
df = pd.read_csv(path)

schema = infer_schema(df)
print('SCHEMA:', schema)

prompts = [
    'show me the selling price last month',
    'top 3 products by selling price',
    'monthly revenue trend',
    'discount vs selling price',
    'market share by product this month'
]

for p in prompts:
    plan = interpret_prompt(p, df, schema)
    print('\nPROMPT:', p)
    print('PLAN:', json.dumps(plan, indent=2, default=str))
    # apply filter if exists
    fdf = df
    tf = plan.get('time_filter')
    if tf and tf.get('date_col') in fdf.columns:
        s = pd.to_datetime(fdf[tf['date_col']], errors='coerce')
        try:
            s = s.dt.tz_localize(None)
        except Exception:
            pass
        mask = s.notna()
        if tf.get('start') is not None:
            st = pd.to_datetime(tf['start'])
            try:
                st = st.tz_localize(None)
            except Exception:
                pass
            mask &= s >= st
        if tf.get('end') is not None:
            en = pd.to_datetime(tf['end'])
            try:
                en = en.tz_localize(None)
            except Exception:
                pass
            mask &= s <= en
        fdf = fdf.loc[mask]
    fig = build_figure(fdf, plan['config'])
    print('FIGURE-TRACES:', len(fig.get('data', [])))
    title = fig.get('layout', {}).get('title', {})
    if isinstance(title, dict):
        print('FIGURE-TITLE:', title.get('text'))
    else:
        print('FIGURE-TITLE:', title)
