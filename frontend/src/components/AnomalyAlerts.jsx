import React, { useState, useEffect } from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const AnomalyAlerts = ({ originalFilename }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (originalFilename) {
      fetchAlerts();
    }
  }, [originalFilename]);

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`/anomalies/alerts/${originalFilename}`);
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const runDetection = async () => {
    setLoading(true);
    const formData = new FormData();
    // In real scenario, we'd need to upload file again or use cached data
    // For now, showing UI structure
    setLoading(false);
  };

  const clearAlerts = async () => {
    if (!window.confirm('Clear all anomaly alerts?')) return;
    
    try {
      await fetch(`/anomalies/alerts/${originalFilename}`, { method: 'DELETE' });
      setAlerts([]);
    } catch (error) {
      console.error('Failed to clear alerts:', error);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <ErrorOutlineIcon className="text-danger" />;
      case 'medium':
        return <WarningAmberIcon className="text-warning" />;
      default:
        return <InfoIcon className="text-info" />;
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      high: 'bg-danger',
      medium: 'bg-warning',
      low: 'bg-info'
    };
    return colors[severity] || 'bg-secondary';
  };

  if (!originalFilename) return null;

  return (
    <div className="glass-card hover-lift mb-4">
      <div
        className="d-flex align-items-center justify-content-between p-3"
        style={{ cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="d-flex align-items-center gap-2">
          <div className="feature-icon" style={{ width: 40, height: 40, marginBottom: 0 }}>
            <TrendingUpIcon />
          </div>
          <div>
            <h5 className="mb-0 text-gradient">Anomaly Alerts</h5>
            <small className="text-muted">
              {alerts.length} anomal{alerts.length === 1 ? 'y' : 'ies'} detected
            </small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={(e) => {
              e.stopPropagation();
              runDetection();
            }}
            disabled={loading}
          >
            <RefreshIcon fontSize="small" className="me-1" />
            {loading ? 'Scanning...' : 'Scan Now'}
          </button>
          {alerts.length > 0 && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={(e) => {
                e.stopPropagation();
                clearAlerts();
              }}
            >
              <DeleteSweepIcon fontSize="small" />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="p-3 pt-0">
          {alerts.length === 0 ? (
            <div className="text-center text-muted py-4">
              No anomalies detected. Click "Scan Now" to analyze your data.
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {alerts.map((alert, idx) => (
                <div key={idx} className="list-group-item glass-card--softer mb-2 rounded">
                  <div className="d-flex align-items-start gap-3">
                    <div style={{ width: 28 }}>{getSeverityIcon(alert.severity)}</div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <strong>{alert.column || 'Dataset'}</strong>
                        <span className={`badge ${getSeverityBadge(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <div className="text-muted small mb-2">
                        <strong>Type:</strong> {alert.type.replace(/_/g, ' ')}
                      </div>
                      
                      {alert.count && (
                        <div className="text-muted small mb-1">
                          <strong>Count:</strong> {alert.count} value{alert.count > 1 ? 's' : ''}
                        </div>
                      )}
                      
                      {alert.normal_range && (
                        <div className="text-muted small mb-1">
                          <strong>Normal range:</strong> {alert.normal_range}
                        </div>
                      )}
                      
                      {alert.values && alert.values.length > 0 && (
                        <div className="text-muted small">
                          <strong>Sample values:</strong> {alert.values.slice(0, 5).map(v => v.toFixed(2)).join(', ')}
                          {alert.values.length > 5 && '...'}
                        </div>
                      )}
                      
                      {alert.missing_percentage && (
                        <div className="text-muted small">
                          <strong>Missing:</strong> {alert.missing_percentage.toFixed(1)}% ({alert.missing_count} rows)
                        </div>
                      )}
                      
                      {alert.duplicate_percentage && (
                        <div className="text-muted small">
                          <strong>Duplicates:</strong> {alert.duplicate_percentage.toFixed(1)}% ({alert.duplicate_count} rows)
                        </div>
                      )}
                      
                      <div className="text-muted small mt-2">
                        {new Date(alert.detected_at).toLocaleString()}
                      </div>
                    </div>
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

export default AnomalyAlerts;
