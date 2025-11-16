import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton, Button, Tabs, Tab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import InsightsIcon from '@mui/icons-material/Insights';
import DownloadIcon from '@mui/icons-material/Download';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import WidgetsIcon from '@mui/icons-material/Widgets';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const DemoModal = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [widgetStep, setWidgetStep] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setWorkflowStep(0);
    setWidgetStep(0);
  };

  const basicSteps = [
    {
      icon: CloudUploadIcon,
      title: 'Upload Your Data',
      description: 'Simply drag and drop or select your CSV/Excel file. Our system accepts files up to 100MB.',
      color: '#667eea'
    },
    {
      icon: AutoGraphIcon,
      title: 'Auto Analysis',
      description: 'Watch as AI automatically cleans your data, detects outliers, handles missing values, and removes duplicates.',
      color: '#764ba2'
    },
    {
      icon: InsightsIcon,
      title: 'Get Insights',
      description: 'Receive AI-powered insights, beautiful interactive charts, and statistical summaries in seconds.',
      color: '#f093fb'
    },
    {
      icon: DownloadIcon,
      title: 'Download & Share',
      description: 'Export professional PDF reports or download your cleaned dataset ready for further analysis.',
      color: '#00f2fe'
    }
  ];

  const workflowSteps = [
    {
      title: "Create Automated Workflows",
      description: "Build data pipelines that run automatically on schedule or triggers",
      steps: [
        "Click 'Workflows' tab in navigation",
        "Click '+ New Workflow' button",
        "Enter name (e.g., 'Daily Sales Report')",
        "Choose trigger: Manual, Schedule, Data Upload, Anomaly, or Threshold"
      ]
    },
    {
      title: "Add Actions to Pipeline",
      description: "Chain multiple actions to automate your data processing",
      steps: [
        "Click '+ Add Action' button",
        "Choose from 7 action types:",
        "• Clean Data - Remove duplicates",
        "• Run Analysis - Generate insights",
        "• Generate Chart - Create visualizations",
        "• Check Anomalies - Find data issues",
        "• Send Alert - Notify via webhook",
        "• Export Report - Save as PDF",
        "• Archive Data - Store old data"
      ]
    },
    {
      title: "Schedule with Cron",
      description: "Run workflows automatically at specific times",
      steps: [
        "Select 'Schedule' trigger",
        "Enter cron expression:",
        "• '0 9 * * *' - Every day at 9 AM",
        "• '0 */2 * * *' - Every 2 hours",
        "• '0 0 * * 1' - Every Monday",
        "• '0 0 1 * *' - First day of month"
      ]
    },
    {
      title: "Run & Monitor",
      description: "Execute workflows and track their status",
      steps: [
        "Click 'Create Workflow' to save",
        "Click '▶️ Run' to execute manually",
        "Watch status: Pending → Running → Completed",
        "Check 'Last Run' timestamp",
        "View notifications in Alerts tab"
      ]
    }
  ];

  const widgetSteps = [
    {
      title: "Create Embeddable Widgets",
      description: "Share your analytics on any website with secure widgets",
      steps: [
        "Click 'Widgets' tab in navigation",
        "Click '+ New Widget' button",
        "Enter widget name (e.g., 'Sales Dashboard')",
        "Choose widget type: Chart, Stats Card, Data Table, Dashboard, Live Metrics, or AI Chat"
      ]
    },
    {
      title: "Configure Security",
      description: "Protect your widgets with domain whitelist and rate limits",
      steps: [
        "Allowed Domains: Enter domains that can embed",
        "• Single: 'mywebsite.com'",
        "• Multiple: 'site1.com,site2.com'",
        "• All: '*' (not recommended)",
        "Rate Limit: Set max requests per hour (e.g., 100)"
      ]
    },
    {
      title: "Get Embed Code",
      description: "Copy HTML or React code to embed on your website",
      steps: [
        "Click 'Create Widget' to save",
        "Click '</> Get Embed Code' button",
        "Choose format: HTML or React",
        "Click '📋 Copy' button",
        "Paste code into your website"
      ]
    },
    {
      title: "Test & Deploy",
      description: "Verify your widget works correctly",
      steps: [
        "Open your website where code is pasted",
        "Widget loads in an iframe",
        "Verifies API key and domain",
        "Shows analytics securely",
        "Monitor in Widgets tab"
      ]
    }
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="demo-modal-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        className="glass-card"
        sx={{
          position: 'relative',
          maxWidth: '900px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          p: 4,
          outline: 'none',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="demo-modal-title"
          variant="h4"
          component="h2"
          className="text-gradient"
          sx={{ mb: 2, fontWeight: 800 }}
        >
          Watch Demo
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Learn how to use the platform's powerful features
        </Typography>

        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            mb: 3,
            '& .MuiTab-root': { 
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600
            }
          }}
        >
          <Tab label="Getting Started" />
          <Tab label="Workflow Automation" icon={<AccountTreeIcon />} iconPosition="start" />
          <Tab label="Embeddable Widgets" icon={<WidgetsIcon />} iconPosition="start" />
        </Tabs>

        {/* Basic Demo */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {basicSteps.map((step, index) => (
              <Box
                key={index}
                className="feature-card hover-lift"
                sx={{
                  display: 'flex',
                  gap: 3,
                  alignItems: 'flex-start',
                  animation: 'fadeInUp 0.6s ease-out',
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'backwards',
                }}
              >
                <Box
                  sx={{
                    minWidth: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 20px ${step.color}40`,
                  }}
                >
                  <step.icon sx={{ color: 'white', fontSize: '2rem' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}
                  >
                    {index + 1}. {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Box
              sx={{
                mt: 2,
                p: 3,
                borderRadius: '16px',
                background: 'var(--gradient-success)',
                color: 'white',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon />
                Ready to Get Started?
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.95 }}>
                Upload your first dataset now and experience the power of AI-driven data analysis. 
                No coding skills required, no credit card needed.
              </Typography>
            </Box>
          </Box>
        )}

        {/* Workflow Tutorial */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Step {workflowStep + 1} of {workflowSteps.length}
              </Typography>
              <Box sx={{ flex: 1, height: '4px', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <Box sx={{ 
                  width: `${((workflowStep + 1) / workflowSteps.length) * 100}%`, 
                  height: '100%', 
                  background: 'var(--gradient-primary)',
                  transition: 'width 0.3s ease'
                }} />
              </Box>
            </Box>

            <Box className="feature-card" sx={{ p: 4, mb: 3 }}>
              <Box sx={{ textAlign: 'center', fontSize: '60px', mb: 2 }}>
                <AccountTreeIcon sx={{ fontSize: '80px', color: '#667eea' }} />
              </Box>
              <Typography variant="h5" className="text-gradient" sx={{ textAlign: 'center', mb: 2, fontWeight: 700 }}>
                {workflowSteps[workflowStep].title}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>
                {workflowSteps[workflowStep].description}
              </Typography>
              
              <Box className="glass-card" sx={{ p: 3 }}>
                {workflowSteps[workflowStep].steps.map((step, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, mb: step.startsWith('•') ? 1 : 2, alignItems: 'flex-start' }}>
                    {!step.startsWith('•') && <CheckCircleIcon sx={{ color: '#4facfe', fontSize: '20px', mt: 0.3 }} />}
                    <Typography variant="body2" sx={{ color: '#e0e0e0', pl: step.startsWith('•') ? 3 : 0 }}>
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Button
                onClick={() => setWorkflowStep(Math.max(0, workflowStep - 1))}
                disabled={workflowStep === 0}
                className="btn-gradient-accent"
                startIcon={<NavigateBeforeIcon />}
              >
                Previous
              </Button>
              {workflowStep === workflowSteps.length - 1 ? (
                <Button
                  onClick={onClose}
                  className="btn-gradient-success"
                  startIcon={<CheckCircleIcon />}
                >
                  Got It!
                </Button>
              ) : (
                <Button
                  onClick={() => setWorkflowStep(Math.min(workflowSteps.length - 1, workflowStep + 1))}
                  className="btn-gradient-primary"
                  endIcon={<NavigateNextIcon />}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* Widget Tutorial */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Step {widgetStep + 1} of {widgetSteps.length}
              </Typography>
              <Box sx={{ flex: 1, height: '4px', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <Box sx={{ 
                  width: `${((widgetStep + 1) / widgetSteps.length) * 100}%`, 
                  height: '100%', 
                  background: 'var(--gradient-accent)',
                  transition: 'width 0.3s ease'
                }} />
              </Box>
            </Box>

            <Box className="feature-card" sx={{ p: 4, mb: 3 }}>
              <Box sx={{ textAlign: 'center', fontSize: '60px', mb: 2 }}>
                <WidgetsIcon sx={{ fontSize: '80px', color: '#f093fb' }} />
              </Box>
              <Typography variant="h5" className="text-gradient" sx={{ textAlign: 'center', mb: 2, fontWeight: 700 }}>
                {widgetSteps[widgetStep].title}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>
                {widgetSteps[widgetStep].description}
              </Typography>
              
              <Box className="glass-card" sx={{ p: 3 }}>
                {widgetSteps[widgetStep].steps.map((step, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, mb: step.startsWith('•') ? 1 : 2, alignItems: 'flex-start' }}>
                    {!step.startsWith('•') && <CheckCircleIcon sx={{ color: '#4facfe', fontSize: '20px', mt: 0.3 }} />}
                    <Typography variant="body2" sx={{ color: '#e0e0e0', pl: step.startsWith('•') ? 3 : 0 }}>
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Button
                onClick={() => setWidgetStep(Math.max(0, widgetStep - 1))}
                disabled={widgetStep === 0}
                className="btn-gradient-accent"
                startIcon={<NavigateBeforeIcon />}
              >
                Previous
              </Button>
              {widgetStep === widgetSteps.length - 1 ? (
                <Button
                  onClick={onClose}
                  className="btn-gradient-success"
                  startIcon={<CheckCircleIcon />}
                >
                  Got It!
                </Button>
              ) : (
                <Button
                  onClick={() => setWidgetStep(Math.min(widgetSteps.length - 1, widgetStep + 1))}
                  className="btn-gradient-primary"
                  endIcon={<NavigateNextIcon />}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        )}

        {activeTab === 0 && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <button
              className="btn-gradient-primary hover-lift click-bounce"
              onClick={onClose}
              style={{ padding: '0.75rem 2rem' }}
            >
              Start Analyzing
            </button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default DemoModal;

