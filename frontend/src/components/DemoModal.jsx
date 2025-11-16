import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import InsightsIcon from '@mui/icons-material/Insights';
import DownloadIcon from '@mui/icons-material/Download';

const DemoModal = ({ open, onClose }) => {
  const steps = [
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
          maxWidth: '800px',
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
          How It Works
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Transform your raw data into actionable insights in 4 simple steps
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {steps.map((step, index) => (
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
        </Box>

        <Box
          sx={{
            mt: 4,
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

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <button
            className="btn-gradient-primary hover-lift click-bounce"
            onClick={onClose}
            style={{ padding: '0.75rem 2rem' }}
          >
            Start Analyzing
          </button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DemoModal;
