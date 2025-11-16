import React, { useEffect, useState } from 'react';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AddAlertIcon from '@mui/icons-material/AddAlert';

const typeIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className="text-success" />;
    case 'warning':
      return <WarningAmberIcon className="text-warning" />;
    case 'error':
      return <ErrorOutlineIcon className="text-danger" />;
    default:
      return <InfoIcon className="text-info" />;
  }
};

const Notifications = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('notifications');
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(items));
  }, [items]);

  const addTest = (type = 'info') => {
    const id = Date.now().toString();
    const n = {
      id,
      type,
      title: type === 'success' ? 'All set!' : type === 'warning' ? 'Heads up' : type === 'error' ? 'Something went wrong' : 'FYI',
      message: type === 'success' ? 'Your settings were saved.' : type === 'warning' ? 'Large dataset may take longer to analyze.' : type === 'error' ? 'Failed to load a resource. Please retry.' : 'New insight is available for your dataset.',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setItems((prev) => [n, ...prev]);
  };

  const clearAll = () => {
    if (!window.confirm('Clear all notifications?')) return;
    setItems([]);
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));
  };

  const toggleRead = (id) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, read: !x.read } : x)));
  };

  const removeOne = (id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const unreadCount = items.filter((x) => !x.read).length;

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-8 offset-lg-2">
          <div className="glass-card hover-lift">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-2">
                <div className="feature-icon" style={{ width: 48, height: 48, marginBottom: 0 }}>
                  <NotificationsActiveIcon />
                </div>
                <div>
                  <h3 className="mb-0 text-gradient">Notifications</h3>
                  <small className="text-muted">Stay on top of what matters</small>
                </div>
              </div>
              <span className={`badge ${unreadCount ? 'bg-danger' : 'bg-secondary'}`}>
                {unreadCount ? `${unreadCount} Unread` : 'No Unread'}
              </span>
            </div>

            <div className="d-flex gap-2 mb-3">
              <button className="btn btn-outline-secondary" onClick={() => addTest('info')}><AddAlertIcon fontSize="small" className="me-1" />Add Info</button>
              <button className="btn btn-outline-success" onClick={() => addTest('success')}><AddAlertIcon fontSize="small" className="me-1" />Add Success</button>
              <button className="btn btn-outline-warning" onClick={() => addTest('warning')}><AddAlertIcon fontSize="small" className="me-1" />Add Warning</button>
              <button className="btn btn-outline-danger" onClick={() => addTest('error')}><AddAlertIcon fontSize="small" className="me-1" />Add Error</button>
              <div className="ms-auto d-flex gap-2">
                <button className="btn btn-outline-primary" onClick={markAllRead}><DoneAllIcon fontSize="small" className="me-1" />Mark all read</button>
                <button className="btn btn-outline-danger" onClick={clearAll}><DeleteSweepIcon fontSize="small" className="me-1" />Clear all</button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="text-center text-muted py-5">No notifications yet.</div>
            ) : (
              <ul className="list-group list-group-flush">
                {items.map((n) => (
                  <li key={n.id} className={`list-group-item glass-card--softer d-flex align-items-start gap-3 ${n.read ? 'opacity-75' : ''}`}>
                    <div style={{ width: 28 }}>{typeIcon(n.type)}</div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between">
                        <strong>{n.title}</strong>
                        <small className="text-muted">{new Date(n.timestamp).toLocaleString()}</small>
                      </div>
                      <div className="text-muted">{n.message}</div>
                      <div className="mt-2 d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleRead(n.id)}>{n.read ? 'Mark unread' : 'Mark read'}</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeOne(n.id)}>Delete</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
