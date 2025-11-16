import React from 'react';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import InsightsIcon from '@mui/icons-material/Insights';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

const FeatureSection = () => {
  const features = [
    {
      icon: AutoFixHighIcon,
      title: 'Auto Data Cleaning',
      description: 'Automatically handle missing values, detect outliers, and clean your dataset without writing a single line of code.'
    },
    {
      icon: InsightsIcon,
      title: 'AI-Powered Insights',
      description: 'Get intelligent analysis and recommendations powered by advanced AI models including GPT-4, Groq, and Gemini.'
    },
    {
      icon: SpeedIcon,
      title: 'Instant Visualizations',
      description: 'Generate beautiful, interactive charts and graphs automatically tailored to your data structure.'
    },
    {
      icon: SecurityIcon,
      title: 'Secure & Private',
      description: 'Your data stays private. All processing happens securely with no permanent storage of sensitive information.'
    }
  ];

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold text-gradient mb-3">Powerful Features</h2>
        <p className="lead text-muted">Everything you need for professional data analysis</p>
      </div>
      <div className="feature-grid">
        {features.map((feature, idx) => (
          <div key={idx} className="feature-card animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="feature-icon">
              <feature.icon />
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
