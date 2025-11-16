import json
import pandas as pd
from viz_engine import infer_schema
from nlviz import interpret_prompt

# Load test CSV
path = r'd:/Nxtwave/No_Code_dataAnalyst/backend/test_sales.csv'
df = pd.read_csv(path)

schema = infer_schema(df)
print('SCHEMA:', schema)

# Test off-topic prompts that should fail gracefully
off_topic = [
    'hello',
    'what is your name',
    'tell me a joke',
    'how are you today',
    'random gibberish xyz123',
]

print('\n=== OFF-TOPIC PROMPTS ===')
for p in off_topic:
    try:
        plan = interpret_prompt(p, df, schema)
        print(f'PROMPT: {p} -> UNEXPECTED SUCCESS')
    except ValueError as e:
        print(f'PROMPT: {p} -> REJECTED: {str(e)[:80]}...')

# Test valid prompts
valid = [
    'show me the selling price last month',
    'top products',
    'compare discount and price',
]

print('\n=== VALID PROMPTS ===')
for p in valid:
    try:
        plan = interpret_prompt(p, df, schema)
        print(f'PROMPT: {p} -> OK: {plan["config"]["preset"]} - {plan["config"]["title"]}')
    except Exception as e:
        print(f'PROMPT: {p} -> ERROR: {str(e)}')
