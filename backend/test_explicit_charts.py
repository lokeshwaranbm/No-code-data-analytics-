import json
import pandas as pd
from viz_engine import infer_schema
from nlviz import interpret_prompt

# Load test CSV
path = r'd:/Nxtwave/No_Code_dataAnalyst/backend/test_sales.csv'
df = pd.read_csv(path)

schema = infer_schema(df)
print('SCHEMA:', schema)

# Test explicit chart type requests
explicit_tests = [
    'show me top 5 brands in a pie chart',
    'show me top 2 brands in a pie chart',
    'top 3 products as a pie',
    'display top 10 products in a bar chart',
    'show products as a bar',
    'discount vs price in a scatter plot',
    'top products',  # should default to bar
    'market share by product',  # should default to pie (share intent)
]

print('\n=== EXPLICIT CHART TYPE TESTS ===')
for p in explicit_tests:
    try:
        plan = interpret_prompt(p, df, schema)
        preset = plan['config']['preset']
        title = plan['config']['title']
        print(f'PROMPT: "{p}"')
        print(f'  -> {preset.upper()}: {title}')
        print(f'  -> {plan.get("explanation", "")}\n')
    except Exception as e:
        print(f'PROMPT: "{p}" -> ERROR: {str(e)}\n')
