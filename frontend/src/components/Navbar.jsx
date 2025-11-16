import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import WidgetsIcon from '@mui/icons-material/Widgets';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const Navbar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
    { id: 'reports', label: 'Reports', Icon: BarChartIcon },
    { id: 'ask-ai', label: 'Ask AI', Icon: SmartToyIcon },
    { id: 'workflows', label: 'Workflows', Icon: AccountTreeIcon },
    { id: 'widgets', label: 'Widgets', Icon: WidgetsIcon },
    { id: 'notifications', label: 'Alerts', Icon: NotificationsActiveIcon },
    { id: 'settings', label: 'Settings', Icon: SettingsIcon },
  ];

  return (
    <nav className="navbar navbar-expand-lg glass-navbar mb-4">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="#">
          <div className="feature-icon" style={{ width: '48px', height: '48px', marginBottom: 0 }}>
            <AnalyticsIcon fontSize="medium" />
          </div>
          <span className="text-gradient">No-Code Data Analyst</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`nav-link btn btn-link hover-lift ${activeTab === tab.id ? 'active fw-bold' : ''}`}
                  onClick={() => onTabChange(tab.id)}
                  style={{ 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    ...(activeTab === tab.id ? { 
                      background: 'var(--gradient-primary)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    } : {})
                  }}
                >
                  <tab.Icon fontSize="medium" />
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
