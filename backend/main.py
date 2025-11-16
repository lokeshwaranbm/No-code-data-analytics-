"""FastAPI backend implementing file upload, data cleaning, EDA, and AI insights.

Endpoint: POST /upload
Returns: JSON containing filename, columns, row_count, cleaning_summary,
         stats, correlations, charts (Plotly JSON), insights.

Run with: uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from dotenv import load_dotenv
import pandas as pd
import json
import os
import io
from typing import Any, Dict

from data_cleaner import clean_csv_and_summary
from eda_engine import generate_stats, generate_correlations, generate_charts
from openai_summary import generate_insights
from viz_engine import infer_schema, build_figure
from nlviz import interpret_prompt

load_dotenv()


UPLOAD_DIR = Path(__file__).resolve().parent / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

CLEANED_DIR = Path(__file__).resolve().parent / 'cleaned_outputs'
CLEANED_DIR.mkdir(exist_ok=True)

app = FastAPI(title="No-Code Data Analyst API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"]
    ,allow_headers=["*"]
)


@app.post('/upload')
async def upload(
    file: UploadFile = File(...),
    autoClean: str | None = Form(default=None),
    outlierDetection: str | None = Form(default=None),
    aiProvider: str | None = Form(default=None),
    chartHeight: str | None = Form(default=None),
):
    file_ext = file.filename.lower().split('.')[-1]
    if file_ext not in ['csv', 'xlsx', 'xls']:
        raise HTTPException(status_code=400, detail='Unsupported file type. Please upload a CSV or XLSX file.')
    contents = await file.read()
    save_path = UPLOAD_DIR / file.filename
    with open(save_path, 'wb') as f:
        f.write(contents)

    # Load into DataFrame from bytes
    if file_ext == 'csv':
        df = pd.read_csv(io.BytesIO(contents))
    else:  # xlsx or xls
        df = pd.read_excel(io.BytesIO(contents))

    # Parse settings flags
    auto_clean_flag = True if (autoClean is None or autoClean.lower() == 'true') else False
    outlier_flag = True if (outlierDetection is None or outlierDetection.lower() == 'true') else False

    cleaned_df, cleaning_summary = clean_csv_and_summary(
        df, auto_clean=auto_clean_flag, outlier_detection=outlier_flag
    )
    stats = generate_stats(cleaned_df)
    correlations = generate_correlations(cleaned_df)
    charts = generate_charts(cleaned_df)

    insights = generate_insights(cleaned_df, stats, cleaning_summary)

    # Save cleaned file (preserve original format or default to CSV)
    base_name = file.filename.rsplit('.', 1)[0]
    if file_ext in ['xlsx', 'xls']:
        cleaned_filename = f"cleaned_{base_name}.xlsx"
        cleaned_path = CLEANED_DIR / cleaned_filename
        cleaned_df.to_excel(cleaned_path, index=False)
    else:
        cleaned_filename = f"cleaned_{file.filename}"
        cleaned_path = CLEANED_DIR / cleaned_filename
        cleaned_df.to_csv(cleaned_path, index=False)

    response = {
        'filename': file.filename,
        'cleaned_filename': cleaned_filename,
        'file_type': file_ext,
        'columns': cleaned_df.columns.tolist(),
        'row_count': int(cleaned_df.shape[0]),
        'cleaning_summary': cleaning_summary,
        'stats': stats,
        'correlations': correlations,
        'charts': charts,
        'insights': insights,
        'settings_used': {
            'autoClean': auto_clean_flag,
            'outlierDetection': outlier_flag,
            'aiProvider': aiProvider,
            'chartHeight': chartHeight,
        }
    }
    return response

@app.get('/schema/{filename}')
def get_schema(filename: str):
    # Load cleaned file first if exists else original upload
    cleaned_path = CLEANED_DIR / f"cleaned_{filename}"
    original_path = UPLOAD_DIR / filename
    if cleaned_path.exists():
        df = pd.read_csv(cleaned_path) if cleaned_path.suffix == '.csv' else pd.read_excel(cleaned_path)
    elif original_path.exists():
        df = pd.read_csv(original_path) if original_path.suffix == '.csv' else pd.read_excel(original_path)
    else:
        raise HTTPException(status_code=404, detail='File not found')
    schema = infer_schema(df)
    return {'schema': schema}

@app.post('/visualize/{filename}')
def visualize(filename: str, payload: Dict[str, Any]):
    cleaned_path = CLEANED_DIR / f"cleaned_{filename}"
    original_path = UPLOAD_DIR / filename
    if cleaned_path.exists():
        df = pd.read_csv(cleaned_path) if cleaned_path.suffix == '.csv' else pd.read_excel(cleaned_path)
    elif original_path.exists():
        df = pd.read_csv(original_path) if original_path.suffix == '.csv' else pd.read_excel(original_path)
    else:
        raise HTTPException(status_code=404, detail='File not found')
    try:
        figure = build_figure(df, payload)
        return {'figure': figure}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post('/nlviz/{filename}')
def nlviz(filename: str, payload: Dict[str, Any]):
    """Build a chart from a natural-language prompt.
    Body: { "prompt": "show me sales last month" }
    """
    prompt = payload.get('prompt', '') if isinstance(payload, dict) else ''
    if not prompt or not isinstance(prompt, str):
        raise HTTPException(status_code=400, detail='prompt is required')

    cleaned_path = CLEANED_DIR / f"cleaned_{filename}"
    original_path = UPLOAD_DIR / filename
    if cleaned_path.exists():
        df = pd.read_csv(cleaned_path) if cleaned_path.suffix == '.csv' else pd.read_excel(cleaned_path)
    elif original_path.exists():
        df = pd.read_csv(original_path) if original_path.suffix == '.csv' else pd.read_excel(original_path)
    else:
        raise HTTPException(status_code=404, detail='File not found')

    schema = infer_schema(df)
    try:
        plan = interpret_prompt(prompt, df, schema)
        filtered_df = df
        # Apply time filter if present
        tf = plan.get('time_filter')
        if tf and tf.get('date_col') in df.columns:
            date_col = tf['date_col']
            s = pd.to_datetime(df[date_col], errors='coerce')
            # Make both series and bounds timezone-naive for robust comparison
            try:
                s = s.dt.tz_localize(None)
            except Exception:
                pass
            mask = s.notna()
            if tf.get('start') is not None:
                start_ts = pd.to_datetime(tf['start'])
                try:
                    start_ts = start_ts.tz_localize(None)  # if aware
                except Exception:
                    pass
                mask &= s >= start_ts
            if tf.get('end') is not None:
                end_ts = pd.to_datetime(tf['end'])
                try:
                    end_ts = end_ts.tz_localize(None)
                except Exception:
                    pass
                mask &= s <= end_ts
            filtered_df = df.loc[mask]

        figure = build_figure(filtered_df, plan['config'])
        return { 'figure': figure, 'config': plan['config'], 'applied_filter': plan.get('time_filter'), 'explanation': plan.get('explanation') }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get('/download/{filename}')
def download_cleaned(filename: str):
    file_path = CLEANED_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail='File not found')
    from fastapi.responses import FileResponse
    
    # Determine media type based on extension
    if filename.endswith('.xlsx') or filename.endswith('.xls'):
        media_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    else:
        media_type = 'text/csv'
    
    return FileResponse(str(file_path), media_type=media_type, filename=filename)

@app.post('/chat')
async def chat(payload: Dict[str, Any]):
    """
    Live AI chat endpoint for answering questions about uploaded CSV data.
    Body: {
        "filename": "data.csv",
        "question": "What are the main patterns?",
        "cleaning_summary": {...}  # optional
    }
    """
    filename = payload.get('filename')
    question = payload.get('question', '')
    cleaning_summary = payload.get('cleaning_summary')

    print(f"[CHAT DEBUG] Received request - filename: {filename}, question: {question}")

    if not filename or not question:
        raise HTTPException(status_code=400, detail='filename and question are required')

    # Load cleaned file first, fallback to original
    cleaned_path = CLEANED_DIR / f"cleaned_{filename}"
    original_path = UPLOAD_DIR / filename
    
    print(f"[CHAT DEBUG] Checking paths - cleaned: {cleaned_path.exists()}, original: {original_path.exists()}")
    
    if cleaned_path.exists():
        file_ext = cleaned_path.suffix.lower()
        df = pd.read_csv(cleaned_path) if file_ext == '.csv' else pd.read_excel(cleaned_path)
    elif original_path.exists():
        file_ext = original_path.suffix.lower()
        df = pd.read_csv(original_path) if file_ext == '.csv' else pd.read_excel(original_path)
    else:
        print(f"[CHAT DEBUG] File not found - cleaned: {cleaned_path}, original: {original_path}")
        raise HTTPException(status_code=404, detail=f'File not found: {filename}')

    try:
        # Generate context about the data
        print(f"[CHAT DEBUG] Generating stats for df with shape {df.shape}")
        stats = generate_stats(df)
        
        # Use AI to answer the question in simple terms
        from chat_handler import answer_question
        from chat_history import save_chat_message
        
        print(f"[CHAT DEBUG] Calling answer_question")
        answer = answer_question(df, question, stats, cleaning_summary)
        
        # Save chat history
        chat_entry = save_chat_message(
            filename=filename,
            question=question,
            answer=answer,
            metadata={
                'cleaning_summary': cleaning_summary,
                'row_count': len(df),
                'column_count': len(df.columns)
            }
        )
        
        print(f"[CHAT DEBUG] Got answer: {answer[:100]}... (saved to history)")
        return {
            'answer': answer, 
            'status': 'success',
            'chat_id': chat_entry['timestamp']
        }
    except Exception as e:
        print(f"[CHAT DEBUG] Exception: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f'Chat error: {str(e)}')


@app.get('/chat/history/{filename}')
def get_history(filename: str, limit: int = 10):
    """Get chat history for a specific file"""
    from chat_history import get_recent_chats, get_chat_history
    
    if limit == -1:  # Get all
        history = get_chat_history(filename)
        return history
    else:
        recent = get_recent_chats(filename, limit)
        return {'conversations': recent, 'count': len(recent)}


@app.get('/chat/history')
def get_all_histories():
    """Get list of all files with chat histories"""
    from chat_history import get_all_chat_files
    return {'files': get_all_chat_files()}


@app.post('/chat/export/{filename}')
def export_history(filename: str, payload: Dict[str, Any]):
    """Export chat history to file"""
    from chat_history import export_chat_history
    
    format = payload.get('format', 'txt')  # 'txt' or 'json'
    export_path = export_chat_history(filename, format)
    
    from fastapi.responses import FileResponse
    media_type = 'text/plain' if format == 'txt' else 'application/json'
    return FileResponse(export_path, media_type=media_type, filename=Path(export_path).name)


@app.delete('/chat/history/{filename}')
def delete_history(filename: str):
    """Delete chat history for a specific file"""
    from chat_history import delete_chat_history
    
    deleted = delete_chat_history(filename)
    if deleted:
        return {'status': 'success', 'message': f'Chat history deleted for {filename}'}
    else:
        raise HTTPException(status_code=404, detail='Chat history not found')


@app.get('/health')
def health():
    return {'status': 'ok'}

# Optional local run convenience
if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)
