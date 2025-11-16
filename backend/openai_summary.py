"""AI-powered insights generator with multiple free API support.

Supports (in priority order):
1. Groq (FREE, no credit card needed) - llama3-8b-8192
2. Google Gemini (FREE tier) - gemini-1.5-flash
3. OpenAI (paid) - gpt-4o-mini
4. Fallback to summary if no API keys available

Get free API keys:
- Groq: https://console.groq.com/keys (instant, no credit card)
- Gemini: https://aistudio.google.com/app/apikey (free tier)
- OpenAI: https://platform.openai.com/api-keys (requires billing)
"""
from __future__ import annotations
import os
from typing import List, Dict, Any
import pandas as pd

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

try:
    from groq import Groq
except ImportError:
    Groq = None

try:
    import google.generativeai as genai
except ImportError:
    genai = None


SYSTEM_PROMPT = (
    "You are a data analyst. Summarize key trends, notable statistics, and correlations succinctly. "
    "Write 2-3 sentences in plain language for a business audience."
)


def _format_context(stats: Dict[str, Any], cleaning_summary: Dict[str, Any]) -> str:
    lines = []
    if stats.get('numeric'):
        for col, s in list(stats['numeric'].items())[:5]:  # limit context
            lines.append(f"{col}: mean={s['mean']:.2f}, median={s['median']:.2f}, std={s['std']:.2f}")
    if cleaning_summary:
        lines.append(cleaning_summary.get('summary_text', ''))
    return '\n'.join(lines)


def _try_groq(context: str) -> List[str] | None:
    """Try Groq API (FREE - llama-3.3-70b-versatile)."""
    api_key = os.getenv('GROQ_API_KEY')
    print(f"[DEBUG] Groq API key present: {bool(api_key)}, Groq imported: {Groq is not None}")
    if not api_key or Groq is None:
        return None
    try:
        client = Groq(api_key=api_key)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Analyze the dataset:\n{context}\nProvide 2-3 concise business insights."}
            ],
            max_tokens=200,
            temperature=0.4
        )
        text = completion.choices[0].message.content.strip()
        sentences = [s.strip() + '.' for s in text.split('.') if s.strip()]
        print(f"[DEBUG] Groq success! Generated {len(sentences)} insights")
        return sentences[:3] if sentences else [text]
    except Exception as e:
        print(f"[DEBUG] Groq failed: {e}")
        return None


def _try_gemini(context: str) -> List[str] | None:
    """Try Google Gemini API (FREE tier - gemini-1.5-flash)."""
    api_key = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
    if not api_key or genai is None:
        return None
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"{SYSTEM_PROMPT}\n\nAnalyze the dataset:\n{context}\nProvide 2-3 concise business insights."
        response = model.generate_content(prompt)
        text = response.text.strip()
        sentences = [s.strip() + '.' for s in text.split('.') if s.strip()]
        return sentences[:3] if sentences else [text]
    except Exception:
        return None


def _try_openai(context: str) -> List[str] | None:
    """Try OpenAI API (paid - gpt-4o-mini)."""
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key or OpenAI is None:
        return None
    try:
        client = OpenAI(api_key=api_key)
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Analyze the dataset:\n{context}\nProvide 2-3 concise business insights."}
            ],
            max_tokens=200,
            temperature=0.4
        )
        text = completion.choices[0].message.content.strip()
        sentences = [s.strip() + '.' for s in text.split('.') if s.strip()]
        return sentences[:3] if sentences else [text]
    except Exception:
        return None


def generate_insights(df: pd.DataFrame, stats: Dict[str, Any], cleaning_summary: Dict[str, Any]) -> List[str]:
    """Generate AI insights using available free APIs with automatic fallback."""
    context = _format_context(stats, cleaning_summary)

    # Try APIs in order: Groq (free) → Gemini (free) → OpenAI (paid) → Fallback
    result = _try_groq(context) or _try_gemini(context) or _try_openai(context)
    
    if result:
        return result

    # Fallback when no API keys available
    return [
        "💡 Add a FREE API key to enable AI insights:",
        "• Groq (instant, no card): GROQ_API_KEY at console.groq.com/keys",
        "• Gemini (free tier): GEMINI_API_KEY at aistudio.google.com/app/apikey",
        cleaning_summary.get('summary_text', 'Data processed successfully.')
    ]
