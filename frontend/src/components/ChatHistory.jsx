import React, { useState, useEffect } from 'react';
import HistoryIcon from '@mui/icons-material/History';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';

const ChatHistory = ({ originalFilename }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (originalFilename && expanded) {
      loadHistory();
    }
  }, [originalFilename, expanded]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/chat/history/${encodeURIComponent(originalFilename)}?limit=-1`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportHistory = async (format = 'txt') => {
    try {
      const response = await fetch(`/chat/export/${encodeURIComponent(originalFilename)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat_history_${originalFilename.replace('.csv', '')}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to delete all chat history for this file?')) {
      return;
    }

    try {
      const response = await fetch(`/chat/history/${encodeURIComponent(originalFilename)}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setHistory([]);
        alert('Chat history deleted successfully');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete chat history');
    }
  };

  if (!originalFilename) {
    return null;
  }

  return (
    <div className="glass-card mt-4">
      {/* Header */}
      <div 
        className="d-flex align-items-center justify-content-between p-3"
        style={{ cursor: 'pointer', borderBottom: expanded ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="d-flex align-items-center gap-2">
          <div className="feature-icon" style={{ width: '40px', height: '40px', marginBottom: 0 }}>
            <HistoryIcon />
          </div>
          <div>
            <h6 className="mb-0 text-gradient">Chat History</h6>
            <small className="text-muted">
              {history.length} conversation{history.length !== 1 ? 's' : ''}
            </small>
          </div>
        </div>
        
        {expanded && history.length > 0 && (
          <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn btn-sm btn-gradient-primary hover-lift"
              onClick={() => exportHistory('txt')}
              title="Export as Text"
            >
              <DownloadIcon style={{ fontSize: '1rem' }} /> TXT
            </button>
            <button
              className="btn btn-sm btn-gradient-accent hover-lift"
              onClick={() => exportHistory('json')}
              title="Export as JSON"
            >
              <DownloadIcon style={{ fontSize: '1rem' }} /> JSON
            </button>
            <button
              className="btn btn-sm btn-outline-danger hover-lift"
              onClick={clearHistory}
              title="Clear History"
            >
              <DeleteIcon style={{ fontSize: '1rem' }} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {expanded && (
        <div className="p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {loading ? (
            <div className="text-center py-4">
              <CircularProgress size={30} />
              <p className="mt-2 text-muted">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <HistoryIcon style={{ fontSize: '3rem', opacity: 0.3 }} />
              <p className="mt-2">No chat history yet. Start asking questions!</p>
            </div>
          ) : (
            <div className="timeline">
              {history.map((conv, idx) => (
                <div key={idx} className="timeline-item mb-4">
                  <div className="timeline-marker">
                    <small className="text-muted">
                      {new Date(conv.timestamp).toLocaleString()}
                    </small>
                  </div>
                  
                  <div className="glass-card--softer p-3 rounded-lg-premium mb-2">
                    <div className="d-flex align-items-start gap-2">
                      <span className="badge bg-gradient-success">Q</span>
                      <div style={{ flex: 1, wordBreak: 'break-word' }}>
                        <strong>Question:</strong> {conv.question}
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card--deeper p-3 rounded-lg-premium">
                    <div className="d-flex align-items-start gap-2">
                      <span className="badge bg-gradient-accent">A</span>
                      <div style={{ flex: 1, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                        <strong>Answer:</strong> {conv.answer}
                      </div>
                    </div>
                    
                    {conv.metadata && (
                      <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <small className="text-muted">
                          {conv.metadata.row_count && `Rows: ${conv.metadata.row_count} | `}
                          {conv.metadata.column_count && `Columns: ${conv.metadata.column_count}`}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
