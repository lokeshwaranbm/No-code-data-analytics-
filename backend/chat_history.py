"""
Chat History Manager - Stores all chat conversations with timestamps
"""
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any

CHAT_HISTORY_DIR = Path(__file__).resolve().parent / 'chat_histories'
CHAT_HISTORY_DIR.mkdir(exist_ok=True)

def save_chat_message(filename: str, question: str, answer: str, metadata: dict = None) -> dict:
    """
    Save a single chat exchange to the history file.
    
    Args:
        filename: Original CSV filename (used as identifier)
        question: User's question
        answer: AI's response
        metadata: Additional info (cleaning_summary, etc.)
    
    Returns:
        The saved chat entry with timestamp
    """
    # Create a safe filename from the CSV name
    safe_name = filename.replace('.csv', '').replace('.xlsx', '').replace(' ', '_')
    history_file = CHAT_HISTORY_DIR / f"{safe_name}_chat_history.json"
    
    # Load existing history or create new
    if history_file.exists():
        with open(history_file, 'r', encoding='utf-8') as f:
            history = json.load(f)
    else:
        history = {
            'filename': filename,
            'created_at': datetime.now().isoformat(),
            'conversations': []
        }
    
    # Create new conversation entry
    chat_entry = {
        'timestamp': datetime.now().isoformat(),
        'question': question,
        'answer': answer,
        'metadata': metadata or {}
    }
    
    # Append to history
    history['conversations'].append(chat_entry)
    history['last_updated'] = datetime.now().isoformat()
    history['total_conversations'] = len(history['conversations'])
    
    # Save back to file
    with open(history_file, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=2, ensure_ascii=False)
    
    return chat_entry

def get_chat_history(filename: str) -> Dict[str, Any]:
    """
    Retrieve all chat history for a specific file.
    
    Args:
        filename: Original CSV filename
    
    Returns:
        Complete chat history dictionary or empty structure
    """
    safe_name = filename.replace('.csv', '').replace('.xlsx', '').replace(' ', '_')
    history_file = CHAT_HISTORY_DIR / f"{safe_name}_chat_history.json"
    
    if history_file.exists():
        with open(history_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        return {
            'filename': filename,
            'conversations': [],
            'total_conversations': 0
        }

def get_recent_chats(filename: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Get the most recent N chat exchanges.
    
    Args:
        filename: Original CSV filename
        limit: Number of recent chats to return
    
    Returns:
        List of recent chat entries
    """
    history = get_chat_history(filename)
    conversations = history.get('conversations', [])
    return conversations[-limit:] if conversations else []

def export_chat_history(filename: str, format: str = 'txt') -> str:
    """
    Export chat history to readable format.
    
    Args:
        filename: Original CSV filename
        format: 'txt' or 'json'
    
    Returns:
        Path to exported file
    """
    history = get_chat_history(filename)
    safe_name = filename.replace('.csv', '').replace('.xlsx', '').replace(' ', '_')
    
    if format == 'txt':
        export_file = CHAT_HISTORY_DIR / f"{safe_name}_chat_export.txt"
        
        with open(export_file, 'w', encoding='utf-8') as f:
            f.write(f"Chat History for: {filename}\n")
            f.write(f"Total Conversations: {history.get('total_conversations', 0)}\n")
            f.write(f"Created: {history.get('created_at', 'N/A')}\n")
            f.write(f"Last Updated: {history.get('last_updated', 'N/A')}\n")
            f.write("=" * 80 + "\n\n")
            
            for i, conv in enumerate(history.get('conversations', []), 1):
                f.write(f"Conversation #{i}\n")
                f.write(f"Time: {conv['timestamp']}\n")
                f.write(f"\nUser Question:\n{conv['question']}\n\n")
                f.write(f"AI Answer:\n{conv['answer']}\n")
                f.write("-" * 80 + "\n\n")
        
        return str(export_file)
    
    else:  # JSON format
        export_file = CHAT_HISTORY_DIR / f"{safe_name}_chat_export.json"
        with open(export_file, 'w', encoding='utf-8') as f:
            json.dump(history, f, indent=2, ensure_ascii=False)
        return str(export_file)

def delete_chat_history(filename: str) -> bool:
    """
    Delete all chat history for a specific file.
    
    Args:
        filename: Original CSV filename
    
    Returns:
        True if deleted, False if not found
    """
    safe_name = filename.replace('.csv', '').replace('.xlsx', '').replace(' ', '_')
    history_file = CHAT_HISTORY_DIR / f"{safe_name}_chat_history.json"
    
    if history_file.exists():
        history_file.unlink()
        return True
    return False

def get_all_chat_files() -> List[Dict[str, Any]]:
    """
    Get a list of all files that have chat histories.
    
    Returns:
        List of dicts with filename, total_conversations, last_updated
    """
    all_histories = []
    
    for history_file in CHAT_HISTORY_DIR.glob('*_chat_history.json'):
        with open(history_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            all_histories.append({
                'filename': data.get('filename', 'Unknown'),
                'total_conversations': data.get('total_conversations', 0),
                'last_updated': data.get('last_updated', 'N/A'),
                'created_at': data.get('created_at', 'N/A')
            })
    
    return sorted(all_histories, key=lambda x: x['last_updated'], reverse=True)
