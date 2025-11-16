"""
Live AI Chat Handler - Provides conversational, easy-to-understand answers
about CSV data for non-technical users.
"""
import os
import pandas as pd
from openai import OpenAI

def answer_question(df: pd.DataFrame, question: str, stats: dict, cleaning_summary: dict = None) -> str:
    """
    Use AI to answer user questions about their data in simple, non-technical language.
    
    Args:
        df: The cleaned DataFrame
        question: User's natural language question
        stats: Statistics about the data
        cleaning_summary: Summary of data cleaning operations
    
    Returns:
        AI-generated answer in plain English
    """
    # Build context about the data
    context_parts = []
    
    # Basic data info
    context_parts.append(f"Dataset has {len(df)} rows and {len(df.columns)} columns.")
    context_parts.append(f"Columns: {', '.join(df.columns.tolist())}")
    
    # Add cleaning summary if available
    if cleaning_summary:
        context_parts.append("\nData Cleaning Summary:")
        if cleaning_summary.get('duplicates_removed', 0) > 0:
            context_parts.append(f"- Removed {cleaning_summary['duplicates_removed']} duplicate rows")
        if cleaning_summary.get('missing_filled'):
            context_parts.append(f"- Filled missing values in: {', '.join(cleaning_summary['missing_filled'])}")
        if cleaning_summary.get('outliers_removed'):
            context_parts.append(f"- Removed outliers from: {', '.join(cleaning_summary['outliers_removed'])}")
    
    # Add statistics
    if stats:
        context_parts.append("\nKey Statistics:")
        for col_name, col_stats in list(stats.items())[:5]:  # Limit to first 5 columns
            if isinstance(col_stats, dict):
                try:
                    if 'mean' in col_stats:
                        mean_val = col_stats.get('mean', 0)
                        min_val = col_stats.get('min', 0)
                        max_val = col_stats.get('max', 0)
                        context_parts.append(f"- {col_name}: mean={mean_val:.2f}, "
                                           f"min={min_val:.2f}, "
                                           f"max={max_val:.2f}")
                    elif 'top' in col_stats:
                        context_parts.append(f"- {col_name}: most common value is '{col_stats.get('top')}' "
                                           f"({col_stats.get('freq', 0)} times)")
                except (TypeError, ValueError) as e:
                    print(f"Warning: Could not format stats for {col_name}: {e}")
                    continue
    
    # Sample data (first few rows)
    context_parts.append("\nSample data (first 3 rows):")
    context_parts.append(df.head(3).to_string())
    
    data_context = "\n".join(context_parts)
    
    # Construct prompt for AI
    system_prompt = """You are a friendly data analyst helping non-technical people understand their data. 
Your job is to:
1. Answer questions in simple, everyday language (no jargon)
2. Use analogies and examples when explaining concepts
3. Be conversational and encouraging
4. Keep answers concise but informative (2-4 paragraphs max)
5. Use bullet points for lists
6. Round numbers to 2 decimal places for readability

Avoid technical terms like "median", "standard deviation", etc. Instead say things like:
- "average" instead of "mean"
- "spread out" instead of "variance"
- "typical value" instead of "median"
- "most common" instead of "mode"
"""

    user_prompt = f"""Here's information about the user's data:

{data_context}

User's question: {question}

Please provide a clear, helpful answer in plain English that anyone can understand."""

    # Try different AI providers
    api_key = os.getenv('OPENAI_API_KEY')
    
    if api_key:
        try:
            client = OpenAI(api_key=api_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"OpenAI error: {e}")
    
    # Fallback to Groq
    groq_key = os.getenv('GROQ_API_KEY')
    if groq_key:
        try:
            from groq import Groq
            client = Groq(api_key=groq_key)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Groq error: {e}")
    
    # Fallback to Google Gemini
    gemini_key = os.getenv('GOOGLE_API_KEY')
    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            full_prompt = f"{system_prompt}\n\n{user_prompt}"
            response = model.generate_content(full_prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Gemini error: {e}")
    
    # If all AI providers fail, return a basic response
    return """I'm having trouble connecting to the AI service right now. Here's what I can tell you about your data:

• Your dataset has {} rows and {} columns
• The columns are: {}

Please make sure you have API keys configured in your .env file, or try asking your question again in a moment.""".format(
        len(df),
        len(df.columns),
        ', '.join(df.columns.tolist()[:5]) + ('...' if len(df.columns) > 5 else '')
    )
