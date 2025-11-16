import React, { useState, useEffect } from 'react';
import WidgetsIcon from '@mui/icons-material/Widgets';
import AddIcon from '@mui/icons-material/Add';
import CodeIcon from '@mui/icons-material/Code';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const EmbedWidgets = () => {
  const [widgets, setWidgets] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [embedCode, setEmbedCode] = useState('');
  const [newWidget, setNewWidget] = useState({
    name: '',
    widget_type: 'chart',
    data_source: {},
    config: {},
    theme: {},
    security: { allowed_domains: [], rate_limit: 100 }
  });

  useEffect(() => {
    fetchWidgets();
  }, []);

  const fetchWidgets = async () => {
    try {
      const response = await fetch('/widgets');
      const data = await response.json();
      setWidgets(data.widgets || []);
    } catch (error) {
      console.error('Failed to fetch widgets:', error);
    }
  };

  const createWidget = async () => {
    if (!newWidget.name) {
      alert('Please enter a widget name');
      return;
    }

    try {
      const response = await fetch('/widgets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWidget)
      });
      
      if (response.ok) {
        setShowBuilder(false);
        setNewWidget({
          name: '',
          widget_type: 'chart',
          data_source: {},
          config: {},
          theme: {},
          security: { allowed_domains: [], rate_limit: 100 }
        });
        fetchWidgets();
      }
    } catch (error) {
      console.error('Failed to create widget:', error);
    }
  };

  const loadMetrics = async (widgetId) => {
    try {
      const resp = await fetch(`/widgets/${widgetId}/metrics`);
      if (!resp.ok) return;
      const data = await resp.json();
      setMetrics((prev) => ({ ...prev, [widgetId]: data.views }));
    } catch (e) {
      console.error('Failed to load widget metrics:', e);
    }
  };

  const getEmbedCode = async (widgetId, format = 'html') => {
    try {
      const response = await fetch(`/widgets/${widgetId}/embed?format=${format}`);
      const data = await response.json();
      setEmbedCode(data.code);
      setSelectedWidget(widgetId);
    } catch (error) {
      console.error('Failed to get embed code:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied to clipboard!');
  };

  const deleteWidget = async (widgetId) => {
    if (!window.confirm('Delete this widget?')) return;
    
    try {
      await fetch(`/widgets/${widgetId}`, { method: 'DELETE' });
      fetchWidgets();
    } catch (error) {
      console.error('Failed to delete widget:', error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-10 offset-lg-1">
          <div className="glass-card hover-lift">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-2">
                <div className="feature-icon" style={{ width: 48, height: 48, marginBottom: 0 }}>
                  <WidgetsIcon />
                </div>
                <div>
                  <h3 className="mb-0 text-gradient">Embeddable Widgets</h3>
                  <small className="text-muted">Share analytics anywhere with secure embed codes</small>
                </div>
              </div>
              <button
                className="btn btn-gradient-primary click-bounce"
                onClick={() => setShowBuilder(!showBuilder)}
              >
                <AddIcon className="me-1" fontSize="small" />
                New Widget
              </button>
            </div>

            {showBuilder && (
              <div className="glass-card--softer p-4 mb-4 rounded-lg-premium">
                <h5 className="mb-3">Create Embeddable Widget</h5>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Widget Name</label>
                  <input
                    type="text"
                    className="form-control form-control-premium"
                    value={newWidget.name}
                    onChange={(e) => setNewWidget({ ...newWidget, name: e.target.value })}
                    placeholder="e.g., Sales Dashboard"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Widget Type</label>
                  <select
                    className="form-select form-control-premium"
                    value={newWidget.widget_type}
                    onChange={(e) => setNewWidget({ ...newWidget, widget_type: e.target.value })}
                  >
                    <option value="chart">Chart</option>
                    <option value="stats_card">Stats Card</option>
                    <option value="data_table">Data Table</option>
                    <option value="dashboard">Dashboard</option>
                    <option value="live_metrics">Live Metrics</option>
                    <option value="ai_chat">AI Chat</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Allowed Domains (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control form-control-premium"
                    placeholder="example.com, mysite.io"
                    onChange={(e) => setNewWidget({
                      ...newWidget,
                      security: {
                        ...newWidget.security,
                        allowed_domains: e.target.value.split(',').map(d => d.trim()).filter(Boolean)
                      }
                    })}
                  />
                  <small className="text-muted">Leave empty to allow all domains</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Rate Limit (requests/hour)</label>
                  <input
                    type="number"
                    className="form-control form-control-premium"
                    value={newWidget.security.rate_limit}
                    onChange={(e) => setNewWidget({
                      ...newWidget,
                      security: { ...newWidget.security, rate_limit: parseInt(e.target.value) }
                    })}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-gradient-primary flex-grow-1" onClick={createWidget}>
                    Create Widget
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowBuilder(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {selectedWidget && embedCode && (
              <div className="glass-card--softer p-4 mb-4 rounded-lg-premium">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="mb-0">Embed Code</h5>
                  <button className="btn btn-sm btn-outline-secondary" onClick={copyToClipboard}>
                    <ContentCopyIcon fontSize="small" className="me-1" />
                    Copy
                  </button>
                </div>
                <pre className="bg-dark text-light p-3 rounded" style={{ maxHeight: 300, overflow: 'auto' }}>
                  <code>{embedCode}</code>
                </pre>
                <div className="mt-3 d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => getEmbedCode(selectedWidget, 'html')}
                  >
                    HTML
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => getEmbedCode(selectedWidget, 'react')}
                  >
                    React
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary ms-auto"
                    onClick={() => { setSelectedWidget(null); setEmbedCode(''); }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {widgets.length === 0 ? (
              <div className="text-center text-muted py-5">
                No widgets yet. Create one to embed analytics in external sites.
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {widgets.map((widget) => (
                  <div key={widget.widget_id} className="list-group-item glass-card--softer mb-3 rounded">
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <strong>{widget.name}</strong>
                          <span className="badge bg-primary">{widget.widget_type}</span>
                          {widget.enabled ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-secondary">Disabled</span>
                          )}
                        </div>
                        <div className="text-muted small mb-2 d-flex align-items-center gap-2">
                          <span>
                            <strong>Views:</strong> {widget.view_count}
                            {metrics[widget.widget_id] !== undefined && (
                              <span className="ms-2">(DB: {metrics[widget.widget_id]})</span>
                            )}
                          </span>
                          <button className="btn btn-xxs btn-outline-secondary" title="Refresh metrics" onClick={() => loadMetrics(widget.widget_id)}>
                            <VisibilityIcon fontSize="inherit" />
                          </button>
                          <span className="ms-2">•</span>
                          <strong className="ms-2">Created:</strong> {new Date(widget.created_at).toLocaleDateString()}
                        </div>
                        {widget.security.allowed_domains.length > 0 && (
                          <div className="text-muted small">
                            <strong>Allowed:</strong> {widget.security.allowed_domains.join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-gradient-success"
                          onClick={() => getEmbedCode(widget.widget_id)}
                        >
                          <CodeIcon fontSize="small" />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteWidget(widget.widget_id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedWidgets;
