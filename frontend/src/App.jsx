import React, { useEffect, useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SettingsIcon from '@mui/icons-material/Settings';
import Navbar from './components/Navbar';
import HeaderBar from './components/HeaderBar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import FileUpload from './components/FileUpload';
import Charts from './components/Charts';
import InsightsCard from './components/InsightsCard';
import CleaningReport from './components/CleaningReport';
import ChartBuilder from './components/ChartBuilder';
import Reports from './components/Reports';
import AskAI from './components/AskAI';
import Settings from './components/Settings';
import LiveAIChat from './components/LiveAIChat';
import ChatHistory from './components/ChatHistory';
import AnomalyAlerts from './components/AnomalyAlerts';
import WorkflowBuilder from './components/WorkflowBuilder';
import EmbedWidgets from './components/EmbedWidgets';
import Notifications from './components/Notifications';
import { uploadCsv } from './api';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [charts, setCharts] = useState([]);
  const [insights, setInsights] = useState([]);
  const [cleaningSummary, setCleaningSummary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cleanedFilename, setCleanedFilename] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [originalFilename, setOriginalFilename] = useState(null);

  // Apply theme on app load from saved settings
  useEffect(() => {
    try {
      const raw = localStorage.getItem('appSettings');
      if (raw) {
        const s = JSON.parse(raw);
        const theme = s?.theme || 'light';
        const root = document.documentElement;
        if (theme === 'auto') {
          const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          root.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
        } else {
          root.setAttribute('data-bs-theme', theme);
        }
      }
    } catch {}
  }, []);

  const handleUpload = async (file) => {
    setError(null);
    setLoading(true);
    setCleanedFilename(null);
    try {
      const result = await uploadCsv(file);
      setCharts(result.charts || []);
      setInsights(result.insights || []);
      setCleaningSummary(result.cleaning_summary || result.cleaningSummary || null);
      setCleanedFilename(result.cleaned_filename || null);
      setOriginalFilename(result.filename || null);
      setActiveTab('dashboard'); // Auto-switch to dashboard after upload
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      {/* Premium Header Bar */}
      <HeaderBar 
        title={
          activeTab === 'dashboard' ? 'Dashboard' :
          activeTab === 'reports' ? 'Reports' :
          activeTab === 'ask-ai' ? 'Ask AI' :
          activeTab === 'workflows' ? 'Workflow Automation' :
          activeTab === 'widgets' ? 'Embeddable Widgets' :
          activeTab === 'notifications' ? 'Notifications' :
          activeTab === 'settings' ? 'Settings' : 'No-Code Data Analyst'
        }
      />
      
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="page-fade-in">
          {!charts.length && !loading && (
            <>
              <HeroSection onFileUpload={handleUpload} />
              <FeatureSection />
            </>
          )}
          
          <div className="container my-4">
            {(charts.length > 0 || loading) && (
              <>
                <FileUpload onUpload={handleUpload} loading={loading} />
              </>
            )}
            {error && (
              <div className="alert alert-danger glass-card" role="alert">{error}</div>
            )}
            <CleaningReport summary={cleaningSummary} />
            {cleanedFilename && (
              <div className="mb-3">
                <button
                  className="btn btn-gradient-success hover-lift click-bounce"
                  onClick={async () => {
                    try {
                      const resp = await fetch(`/download/${encodeURIComponent(cleanedFilename)}`);
                      if (!resp.ok) {
                        throw new Error('Download failed');
                      }
                      const blob = await resp.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.style.display = 'none';
                      a.href = url;
                      a.download = cleanedFilename;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 3000);
                    } catch (err) {
                      console.error('Download error:', err);
                      setError(`Download failed: ${err.message}`);
                    }
                  }}
                >
                  <i className="bi bi-download me-1"></i>Download Cleaned File
                </button>
              </div>
            )}
            <Charts charts={charts} />
            <InsightsCard insights={insights} />
            
            {/* Live AI Chat - Only show when data is loaded */}
            {originalFilename && (
              <>
                {/* Anomaly Detection Alerts */}
                <div className="mt-4">
                  <AnomalyAlerts originalFilename={originalFilename} />
                </div>

                {/* Live AI Chat */}
                <div className="mt-4">
                  <LiveAIChat 
                    originalFilename={originalFilename}
                    cleaningSummary={cleaningSummary}
                  />
                </div>
                
                {/* Chat History */}
                <ChatHistory originalFilename={originalFilename} />
              </>
            )}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="container my-4 page-fade-in">
          <Reports
            cleanedFilename={cleanedFilename}
            charts={charts}
            cleaningSummary={cleaningSummary}
          />
        </div>
      )}

      {/* Ask AI Tab */}
      {activeTab === 'ask-ai' && (
        <div className="container my-4 page-fade-in">
          <AskAI originalFilename={originalFilename} insights={insights} />
        </div>
      )}

      {/* Workflows Tab */}
      {activeTab === 'workflows' && (
        <div className="container my-4 page-fade-in">
          <WorkflowBuilder />
        </div>
      )}

      {/* Embed Widgets Tab */}
      {activeTab === 'widgets' && (
        <div className="container my-4 page-fade-in">
          <EmbedWidgets />
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="container my-4 page-fade-in">
          <Notifications />
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="container my-4 page-fade-in">
          <Settings />
        </div>
      )}

      {/* Toast Notification */}
      <div className="premium-toast-container" aria-live="polite" aria-atomic="true">
        {showToast && (
          <div
            className="toast show toast-premium toast-premium--success"
            role="status"
          >
            <div className="d-flex align-items-center">
              <div className="toast-body">Download completed!</div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default App;
