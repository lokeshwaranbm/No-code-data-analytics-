import React from 'react';
import ChartBuilder from './ChartBuilder';
import InsightsCard from './InsightsCard';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BoltIcon from '@mui/icons-material/Bolt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const AskAI = ({ originalFilename, insights, onChartBuilt }) => {
  if (!originalFilename) {
    return (
      <div className="text-center py-5">
        <p className="text-muted"><LightbulbIcon className="me-2" fontSize="small" />Upload a file first to start chatting with your data.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="glass-card hover-lift">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h3 className="mb-0 text-gradient d-flex align-items-center gap-2">
                <i className="bi bi-robot"></i>
                <span>Ask AI - Chat with Your Data</span>
              </h3>
            </div>
            <p className="text-muted mb-3">
              Ask natural language questions about your data. Examples:
            </p>
            <div className="d-flex flex-wrap gap-2 mb-1">
              <span className="badge bg-light text-dark hover-lift"><LightbulbIcon className="me-1" fontSize="small" />show me top 5 brands in a pie chart</span>
              <span className="badge bg-light text-dark hover-lift"><BoltIcon className="me-1" fontSize="small" />selling price last month</span>
              <span className="badge bg-light text-dark hover-lift"><TrendingUpIcon className="me-1" fontSize="small" />compare product sales by region</span>
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <ChartBuilder filename={originalFilename} onChartBuilt={onChartBuilt} />
        </div>

        {insights && insights.length > 0 && (
          <div className="col-12">
            <InsightsCard insights={insights} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AskAI;
