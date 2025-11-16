import React, { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloudIcon from '@mui/icons-material/Cloud';
import SpeedIcon from '@mui/icons-material/Speed';
import BarChartIcon from '@mui/icons-material/BarChart';
import PaletteIcon from '@mui/icons-material/Palette';
// Removed AI provider controls

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    autoClean: true,
    outlierDetection: true,
    chartHeight: 'medium',
    animationsEnabled: true,
    autoSaveCharts: true,
    notificationsEnabled: true,
  });

  // AI provider and API keys removed

  const [hasChanges, setHasChanges] = useState(false);
  const [savedRecently, setSavedRecently] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('appSettings');
      if (raw) {
        const s = JSON.parse(raw);
        setSettings((prev) => ({ ...prev, ...s }));
        applyTheme(s.theme || 'light');
      }
    } catch {
      applyTheme('light');
    }
  }, []);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === 'auto') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-bs-theme', theme);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
    if (key === 'theme') {
      applyTheme(value);
    }
  };

  // Removed API key handlers

  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    applyTheme(settings.theme);
    setHasChanges(false);
    setSavedRecently(true);
    
    const toastEl = document.getElementById('settingsToast');
    const ToastCtor = window.bootstrap && window.bootstrap.Toast ? window.bootstrap.Toast : null;
    if (toastEl && ToastCtor) {
      const toast = new ToastCtor(toastEl);
      toast.show();
      setTimeout(() => toast.hide(), 2500);
    }
    setTimeout(() => setSavedRecently(false), 3000);
  };

  const resetToDefaults = () => {
    if (!window.confirm('Reset all settings to default values?')) return;
    const defaults = {
      theme: 'light',
      autoClean: true,
      outlierDetection: true,
      chartHeight: 'medium',
      animationsEnabled: true,
      autoSaveCharts: true,
      notificationsEnabled: true,
    };
    setSettings(defaults);
    setHasChanges(true);
    applyTheme('light');
  };

  const clearStoredData = () => {
    if (!window.confirm('Clear all stored data and reset preferences?')) return;
    localStorage.removeItem('appSettings');
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-8 offset-lg-2">
          <div className="glass-card hover-lift">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-2">
                <div className="feature-icon" style={{ width: '48px', height: '48px', marginBottom: 0 }}>
                  <SettingsIcon />
                </div>
                <div>
                  <h3 className="mb-0 text-gradient">Application Settings</h3>
                  <small className="text-muted">Customize your data analysis experience</small>
                </div>
              </div>
              {hasChanges && <span className="badge bg-warning">Unsaved Changes</span>}
            </div>

            <div className="glass-card--softer p-3 mb-4 rounded-lg-premium">
              <h5 className="d-flex align-items-center gap-2 mb-3"><PaletteIcon /> Appearance</h5>
              <div className="mb-3">
                <label className="form-label fw-bold">Theme</label>
                <select className="form-select form-control-premium" value={settings.theme} onChange={(e) => handleChange('theme', e.target.value)}>
                  <option value="light">☀️ Light Mode</option>
                  <option value="dark">🌙 Dark Mode</option>
                  <option value="auto">🔄 Auto (System)</option>
                </select>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="animations" checked={settings.animationsEnabled} onChange={(e) => handleChange('animationsEnabled', e.target.checked)} />
                <label className="form-check-label" htmlFor="animations"><strong>Enable Animations</strong></label>
              </div>
            </div>

            <div className="glass-card--softer p-3 mb-4 rounded-lg-premium">
              <h5 className="d-flex align-items-center gap-2 mb-3"><SpeedIcon /> Data Processing</h5>
              <div className="mb-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="autoClean" checked={settings.autoClean} onChange={(e) => handleChange('autoClean', e.target.checked)} />
                  <label className="form-check-label" htmlFor="autoClean"><strong>Auto Clean Data</strong></label>
                </div>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="outlier" checked={settings.outlierDetection} onChange={(e) => handleChange('outlierDetection', e.target.checked)} />
                <label className="form-check-label" htmlFor="outlier"><strong>Outlier Detection</strong></label>
              </div>
            </div>

            <div className="glass-card--softer p-3 mb-4 rounded-lg-premium">
              <h5 className="d-flex align-items-center gap-2 mb-3"><BarChartIcon /> Visualization</h5>
              <div className="mb-3">
                <label className="form-label fw-bold">Default Chart Height</label>
                <select className="form-select form-control-premium" value={settings.chartHeight} onChange={(e) => handleChange('chartHeight', e.target.value)}>
                  <option value="small">Small (300px)</option>
                  <option value="medium">Medium (480px)</option>
                  <option value="large">Large (600px)</option>
                </select>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="autoSave" checked={settings.autoSaveCharts} onChange={(e) => handleChange('autoSaveCharts', e.target.checked)} />
                <label className="form-check-label" htmlFor="autoSave"><strong>Auto-Save Charts</strong></label>
              </div>
            </div>

            {/* AI Provider controls removed */}

            <div className="glass-card--softer p-3 mb-4 rounded-lg-premium">
              <h5 className="d-flex align-items-center gap-2 mb-3"><CloudIcon /> Preferences</h5>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="notifications" checked={settings.notificationsEnabled} onChange={(e) => handleChange('notificationsEnabled', e.target.checked)} />
                <label className="form-check-label" htmlFor="notifications"><strong>Show Notifications</strong></label>
              </div>
            </div>

            <div className="d-flex gap-2 mb-4">
              <button className={`btn ${savedRecently ? 'btn-gradient-success' : 'btn-gradient-primary'} click-bounce flex-grow-1`} onClick={saveSettings} disabled={!hasChanges}>
                {savedRecently ? <><CheckCircleIcon className="me-1" fontSize="small" />Saved!</> : <><SaveIcon className="me-1" fontSize="small" />Save Settings</>}
              </button>
              <button className="btn btn-outline-secondary hover-lift" onClick={resetToDefaults}><RestartAltIcon fontSize="small" /></button>
            </div>

            <div className="glass-card--deeper mb-3 d-flex align-items-start gap-2" style={{ padding: '1rem' }}>
              <InfoIcon className="mt-1" fontSize="small" />
              <div><strong>Storage:</strong> Settings saved locally in your browser.</div>
            </div>
            <div className="glass-card--deeper d-flex align-items-start gap-2" style={{ padding: '1rem' }}>
              <InfoIcon className="mt-1" fontSize="small" />
              <div><strong>Privacy:</strong> Your preferences are stored locally in this browser. <button className="btn btn-sm btn-link text-danger p-0 ms-2" onClick={clearStoredData}>Clear All</button></div>
            </div>
          </div>
        </div>
      </div>

      <div className="premium-toast-container" aria-live="polite" aria-atomic="true">
        <div id="settingsToast" className="toast toast-premium toast-premium--success" role="status">
          <div className="d-flex align-items-center">
            <div className="toast-body"><CheckCircleIcon fontSize="small" className="me-2" />Settings saved successfully!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
