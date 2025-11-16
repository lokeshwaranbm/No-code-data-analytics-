import React from 'react';
import Plot from 'react-plotly.js';
import { useResponsive } from '../hooks/useResponsive';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const Charts = ({ charts }) => {
  const { plotHeight, isXs, isSm, isMd } = useResponsive();
  const isDarkTheme = typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-bs-theme') === 'dark';
  
  if (!charts || charts.length === 0) {
    return (
      <Box sx={{ my: 3 }}>
        <Paper elevation={0} className="glass-card" sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No charts available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Charts will appear here after data analysis
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Stack charts one per row across all screen sizes
  const getGridSize = () => ({ xs: 12, sm: 12, md: 12, lg: 12 });

  // Bump height a bit when there are exactly 3 charts so they feel larger
  const effectivePlotHeight = charts && charts.length === 3 ? Math.max(plotHeight, 560) : plotHeight;

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }} className="text-gradient">
        Data Visualizations
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} direction="column">
        {charts.map((c, idx) => {
          const fig = c.figure || {};
          const data = fig.data || [];
          const baseLayout = fig.layout || { title: c.title };
          
          // Responsive layout adjustments
          const layout = {
            ...baseLayout,
            autosize: true,
            height: effectivePlotHeight,
            // Remove internal chart titles to avoid duplicate headings
            title: undefined,
            margin: { 
              t: isXs ? 35 : 45, 
              r: isXs ? 15 : 20, 
              b: isXs ? 50 : 60, 
              l: isXs ? 45 : 60, 
              ...(baseLayout.margin || {}) 
            },
            legend: { 
              orientation: isXs ? 'h' : (baseLayout.legend?.orientation || 'v'), 
              y: isXs ? -0.15 : (baseLayout.legend?.y ?? 1),
              x: isXs ? 0 : (baseLayout.legend?.x ?? 1.02),
              xanchor: isXs ? 'left' : (baseLayout.legend?.xanchor || 'left'),
              yanchor: isXs ? 'top' : (baseLayout.legend?.yanchor || 'top'),
              font: { size: isXs ? 10 : 12 },
              ...(baseLayout.legend || {}) 
            },
            font: {
              size: isXs ? 11 : 12,
              color: isDarkTheme ? '#e6e7ea' : '#222',
              ...(baseLayout.font || {})
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
            // Title styling removed since we display titles externally
          };
          
          return (
            <Grid item xs={12} key={c.id || idx}>
              <Paper 
                elevation={0}
                className="glass-card hover-lift"
                sx={{ 
                  height: '100%',
                  p: { xs: 1.5, sm: 2 }
                }}
              >
                <Typography 
                  variant="h6" 
                  className="text-gradient"
                  sx={{ 
                    mb: 1.5, 
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                    fontWeight: 700
                  }}
                >
                  {c.title}
                </Typography>
                <Box sx={{ 
                  width: '100%', 
                  overflow: 'hidden',
                  '& .js-plotly-plot': {
                    width: '100% !important'
                  }
                }}>
                  <Plot 
                    data={data} 
                    layout={layout} 
                    useResizeHandler 
                    config={{
                      responsive: true,
                      displayModeBar: !isXs,
                      displaylogo: false,
                      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
                    }}
                    style={{ width: '100%', height: effectivePlotHeight }} 
                  />
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Charts;
