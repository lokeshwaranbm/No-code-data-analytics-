import React, { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DemoModal from './DemoModal';

const HeroSection = ({ onFileUpload }) => {
  const [showDemo, setShowDemo] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-content container">
          <h1 className="hero-title animate-fade-in-up">
            Transform Your Data Into Insights
          </h1>
          <p className="hero-subtitle animate-fade-in-up">
            No coding required. Upload your CSV and get AI-powered analysis, 
            beautiful visualizations, and actionable insights in seconds.
          </p>
          <div className="hero-cta">
            <label className="btn btn-gradient-primary btn-lg hover-lift click-bounce d-inline-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
              <CloudUploadIcon fontSize="large" />
              <span>Upload Your Data</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
            <button 
              className="btn btn-gradient-accent btn-lg hover-lift click-bounce d-inline-flex align-items-center gap-2"
              onClick={() => setShowDemo(true)}
            >
              <AutoGraphIcon fontSize="large" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </div>

      <DemoModal open={showDemo} onClose={() => setShowDemo(false)} />
    </>
  );
};

export default HeroSection;
