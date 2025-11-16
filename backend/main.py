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


# ============================================
# ANOMALY DETECTION ENDPOINTS
# ============================================

@app.post('/anomalies/detect')
async def detect_anomalies(
    file: UploadFile = File(...),
    sensitivity: str = Form(default='medium')
):
    """
    Detect anomalies in uploaded dataset
    Returns: Comprehensive anomaly report with alerts
    """
    from anomaly_detector import AnomalyDetector, save_alert
    
    # Read uploaded file
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except:
        df = pd.read_excel(io.BytesIO(contents))
    
    # Run detection
    detector = AnomalyDetector(sensitivity=sensitivity)
    report = detector.run_full_analysis(df)
    
    # Save alert if anomalies found
    if report['total_anomalies'] > 0:
        save_alert(file.filename, report)
    
    return report


@app.get('/anomalies/alerts/{filename}')
def get_anomaly_alerts(filename: str, limit: int = -1):
    """Get saved anomaly alerts for a file"""
    from anomaly_detector import get_alerts
    return get_alerts(filename, limit)


@app.delete('/anomalies/alerts/{filename}')
def clear_anomaly_alerts(filename: str):
    """Clear anomaly alerts for a file"""
    from anomaly_detector import clear_alerts
    cleared = clear_alerts(filename)
    if cleared:
        return {'status': 'success', 'message': f'Alerts cleared for {filename}'}
    return {'status': 'warning', 'message': 'No alerts found'}


# ============================================
# WORKFLOW AUTOMATION ENDPOINTS
# ============================================

@app.post('/workflows/create')
async def create_workflow(data: Dict[str, Any]):
    """Create new workflow"""
    from workflow_engine import engine, WorkflowAction, ActionType, TriggerType
    
    workflow = engine.create_workflow(
        name=data['name'],
        description=data.get('description', '')
    )
    
    # Add actions
    for action_data in data.get('actions', []):
        action = WorkflowAction(
            action_type=ActionType(action_data['type']),
            params=action_data.get('params', {}),
            name=action_data.get('name')
        )
        workflow.add_action(action)
    
    # Set trigger
    if 'trigger' in data:
        workflow.set_trigger(
            TriggerType(data['trigger']['type']),
            data['trigger'].get('config', {})
        )
    
    engine._save_workflow(workflow)
    return workflow.to_dict()


@app.get('/workflows')
def list_workflows():
    """List all workflows"""
    from workflow_engine import engine
    return {'workflows': engine.list_workflows()}


@app.get('/workflows/{workflow_id}')
def get_workflow(workflow_id: str):
    """Get workflow details"""
    from workflow_engine import engine
    workflow = engine.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail='Workflow not found')
    return workflow.to_dict()


@app.post('/workflows/{workflow_id}/execute')
async def execute_workflow(workflow_id: str, context: Dict[str, Any] = None):
    """Execute workflow"""
    from workflow_engine import engine
    result = await engine.execute_workflow(workflow_id, context or {})
    return result


@app.delete('/workflows/{workflow_id}')
def delete_workflow(workflow_id: str):
    """Delete workflow"""
    from workflow_engine import engine
    deleted = engine.delete_workflow(workflow_id)
    if deleted:
        return {'status': 'success', 'message': 'Workflow deleted'}
    raise HTTPException(status_code=404, detail='Workflow not found')


# ============================================
# EMBEDDABLE WIDGETS ENDPOINTS
# ============================================

@app.post('/widgets/create')
async def create_widget(data: Dict[str, Any]):
    """Create embeddable widget"""
    from embed_widgets import manager
    
    widget = manager.create_widget(
        widget_type=data['widget_type'],
        name=data['name'],
        data_source=data.get('data_source', {}),
        config=data.get('config', {})
    )
    
    # Apply theme if provided
    if 'theme' in data:
        for key, value in data['theme'].items():
            setattr(widget.theme, key, value)
    
    # Apply security settings
    if 'security' in data:
        for key, value in data['security'].items():
            setattr(widget.security, key, value)
    
    manager._save_widget(widget)
    return widget.to_dict()


@app.get('/widgets')
def list_widgets():
    """List all embeddable widgets"""
    from embed_widgets import manager
    return {'widgets': manager.list_widgets()}


@app.get('/widgets/{widget_id}')
def get_widget(widget_id: str):
    """Get widget details"""
    from embed_widgets import manager
    widget = manager.get_widget(widget_id)
    if not widget:
        raise HTTPException(status_code=404, detail='Widget not found')
    return widget.to_dict()


@app.get('/widgets/{widget_id}/embed')
def get_embed_code(widget_id: str, format: str = 'html'):
    """Get embed code for widget"""
    from embed_widgets import manager
    widget = manager.get_widget(widget_id)
    if not widget:
        raise HTTPException(status_code=404, detail='Widget not found')
    
    if format == 'html':
        return {'code': widget.generate_embed_code()}
    elif format == 'react':
        return {'code': widget.generate_react_component()}
    else:
        raise HTTPException(status_code=400, detail='Invalid format. Use html or react')


@app.put('/widgets/{widget_id}')
async def update_widget(widget_id: str, updates: Dict[str, Any]):
    """Update widget configuration"""
    from embed_widgets import manager
    success = manager.update_widget(widget_id, updates)
    if success:
        return {'status': 'success', 'message': 'Widget updated'}
    raise HTTPException(status_code=404, detail='Widget not found')


@app.delete('/widgets/{widget_id}')
def delete_widget(widget_id: str):
    """Delete widget"""
    from embed_widgets import manager
    deleted = manager.delete_widget(widget_id)
    if deleted:
        return {'status': 'success', 'message': 'Widget deleted'}
    raise HTTPException(status_code=404, detail='Widget not found')


@app.get('/api/embed/{widget_id}')
async def serve_widget(widget_id: str, apiKey: str = None, origin: str = None):
    """Serve widget content (called by iframe)"""
    from embed_widgets import manager
    
    # Validate access
    if not manager.validate_access(widget_id, apiKey or '', origin):
        raise HTTPException(status_code=403, detail='Access denied')
    
    # Increment view count
    manager.increment_view_count(widget_id)
    
    widget = manager.get_widget(widget_id)
    
    # Return widget HTML (simplified - in production, render actual widget)
    return {
        'widget_id': widget_id,
        'name': widget.name,
        'type': widget.widget_type,
        'theme': widget.theme.to_dict(),
        'config': widget.config,
        'message': 'Widget data served'
    }


# Optional local run convenience
if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)
