import json
import pandas as pd
from viz_engine import infer_schema
from nlviz import interpret_prompt

# Test 1: All numeric dataset (unsuitable for pie/bar)
print('=== TEST 1: All numeric data (scatter only) ===')
df_numeric = pd.DataFrame({
    'Price': [100, 200, 150],
    'Discount': [10, 20, 15],
    'Quantity': [5, 3, 8]
})
schema_numeric = infer_schema(df_numeric)
print('SCHEMA:', schema_numeric)

tests = [
    'show me pie chart',
    'bar chart of price',
    'price vs discount scatter',
]

for p in tests:
    try:
        plan = interpret_prompt(p, df_numeric, schema_numeric)
        print(f'✅ "{p}" -> {plan["config"]["preset"]}')
    except ValueError as e:
        print(f'⚠️ "{p}" -> REJECTED: {str(e)[:100]}...')

# Test 2: Categorical with too many values
print('\n=== TEST 2: Too many categories (50+) ===')
df_many = pd.DataFrame({
    'ID': range(100),
    'Value': range(100, 200)
})
schema_many = infer_schema(df_many)
print('SCHEMA:', schema_many)

try:
    plan = interpret_prompt('show pie chart', df_many, schema_many)
    print(f'✅ Pie chart allowed')
except ValueError as e:
    print(f'⚠️ REJECTED: {str(e)[:120]}...')

# Test 3: No datetime (time series unsuitable)
print('\n=== TEST 3: No datetime column ===')
df_no_date = pd.DataFrame({
    'Product': ['A', 'B', 'C'],
    'Sales': [100, 200, 150]
})
schema_no_date = infer_schema(df_no_date)
print('SCHEMA:', schema_no_date)

try:
    plan = interpret_prompt('show sales trend over time', df_no_date, schema_no_date)
    print(f'✅ Time series allowed')
except ValueError as e:
    print(f'⚠️ REJECTED: {str(e)[:100]}...')

# Test 4: Valid cases should still work
print('\n=== TEST 4: Valid requests ===')
df_valid = pd.DataFrame({
    'Date': pd.date_range('2025-01-01', periods=5),
    'Product': ['A', 'B', 'A', 'C', 'B'],
    'Sales': [100, 200, 150, 180, 220]
})
schema_valid = infer_schema(df_valid)
print('SCHEMA:', schema_valid)

valid_tests = [
    'show pie chart',
    'bar chart of products',
    'sales trend over time',
]

for p in valid_tests:
    try:
        plan = interpret_prompt(p, df_valid, schema_valid)
        print(f'✅ "{p}" -> {plan["config"]["preset"]} ({plan["config"]["title"]})')
    except ValueError as e:
        print(f'⚠️ "{p}" -> REJECTED: {str(e)}')
