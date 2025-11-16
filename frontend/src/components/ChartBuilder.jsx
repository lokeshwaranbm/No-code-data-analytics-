import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { fetchSchema, visualize, nlviz } from '../api';
import { useResponsive } from '../hooks/useResponsive';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

// Simple chart builder UI to select preset and columns
const presets = [
  { id: 'time_series', label: 'Time Series' },
  { id: 'bar', label: 'Bar' },
  { id: 'pie', label: 'Pie' },
  { id: 'scatter', label: 'Scatter' },
  { id: 'heatmap', label: 'Heatmap' },
  { id: 'funnel', label: 'Funnel' },
];

export default function ChartBuilder({ filename }) {
  const { plotHeight, isXs } = useResponsive();
  const [schema, setSchema] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preset, setPreset] = useState('bar');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [agg, setAgg] = useState('sum');
  const [limit, setLimit] = useState(20);
  const [figure, setFigure] = useState(null);
  const [timeGrain, setTimeGrain] = useState('M');
  const [chat, setChat] = useState('show me the selling price last month');
  const [usingChat, setUsingChat] = useState(true);
  const [nlSummary, setNlSummary] = useState(null);

  useEffect(() => {
    if (!filename) return;
    (async () => {
      try {
        const resp = await fetchSchema(filename);
        setSchema(resp.schema);
        setError('');
      } catch (e) {
        setError(e.message || 'Failed to load schema');
      }
    })();
  }, [filename]);

  const onBuild = async () => {
    if (!schema) return;
    setLoading(true);
    setError('');
    try {
      if (usingChat) {
        const resp = await nlviz(filename, chat);
        setFigure(resp.figure);
        setNlSummary({ config: resp.config, filter: resp.applied_filter, explanation: resp.explanation });
        return;
      }
      const payload = { preset };
      if (preset === 'bar') {
        payload.x = x || schema.categorical[0] || schema.numeric[0];
        payload.y = y || schema.numeric[0];
        payload.agg = agg;
        payload.top_n = Number(limit) || 20;
      } else if (preset === 'pie') {
        payload.category = x || schema.categorical[0] || schema.numeric[0];
        payload.value = y || schema.numeric[0];
      } else if (preset === 'scatter') {
        payload.x = x || schema.numeric[0];
        payload.y = y || schema.numeric[1] || schema.numeric[0];
      } else if (preset === 'heatmap') {
        payload.x = x || schema.categorical[0] || schema.numeric[0];
        payload.y = y || schema.categorical[1] || schema.numeric[1] || schema.numeric[0];
        payload.value = schema.numeric[0];
        payload.agg = agg;
      } else if (preset === 'funnel') {
        payload.stage = x || schema.categorical[0] || schema.numeric[0];
        payload.value = y || schema.numeric[0];
        payload.agg = agg;
      } else if (preset === 'time_series') {
        payload.x = x || schema.datetime[0] || schema.numeric[0];
        payload.y = y || schema.numeric[0];
        payload.agg = agg;
        payload.time_grain = timeGrain;
      }
      const resp = await visualize(filename, payload);
  setFigure(resp.figure);
  setNlSummary(null);
    } catch (e) {
      setError(e.message || 'Failed to build chart');
      setFigure(null);
      setNlSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const opts = (arr) => arr.map((c) => <option key={c} value={c}>{c}</option>);

  const renderFieldSelectors = () => {
    if (!schema) return null;
    const numeric = schema.numeric || [];
    const categorical = schema.categorical || [];
    const datetime = schema.datetime || [];

    switch (preset) {
      case 'time_series':
        return (
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label">Date</label>
              <select className="form-select" value={x} onChange={(e) => setX(e.target.value)}>
                <option value="">Auto</option>
                {opts([...datetime, ...categorical, ...numeric])}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Value</label>
              <select className="form-select" value={y} onChange={(e) => setY(e.target.value)}>
                <option value="">Auto</option>
                {opts(numeric)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Aggregation</label>
              <select className="form-select" value={agg} onChange={(e) => setAgg(e.target.value)}>
                {['sum','mean','count','min','max'].map(a=> <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Time grain</label>
              <select className="form-select" value={timeGrain} onChange={(e)=> setTimeGrain(e.target.value)}>
                {['D','W','M','Q','Y'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
        );
      case 'bar':
        return (
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label">X (Category)</label>
              <select className="form-select" value={x} onChange={(e) => setX(e.target.value)}>
                <option value="">Auto</option>
                {opts([...categorical, ...numeric])}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Y (Value)</label>
              <select className="form-select" value={y} onChange={(e) => setY(e.target.value)}>
                <option value="">Auto</option>
                {opts(numeric)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Agg</label>
              <select className="form-select" value={agg} onChange={(e) => setAgg(e.target.value)}>
                {['sum','mean','count','min','max'].map(a=> <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Limit</label>
              <input type="number" className="form-control" value={limit} onChange={(e)=> setLimit(e.target.value)} />
            </div>
          </div>
        );
      case 'pie':
        return (
          <div className="row g-2">
            <div className="col-md-5">
              <label className="form-label">Names</label>
              <select className="form-select" value={x} onChange={(e) => setX(e.target.value)}>
                <option value="">Auto</option>
                {opts([...categorical, ...numeric])}
              </select>
            </div>
            <div className="col-md-5">
              <label className="form-label">Values</label>
              <select className="form-select" value={y} onChange={(e) => setY(e.target.value)}>
                <option value="">Auto</option>
                {opts(numeric)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Limit</label>
              <input type="number" className="form-control" value={limit} onChange={(e)=> setLimit(e.target.value)} />
            </div>
          </div>
        );
      case 'scatter':
        return (
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label">X</label>
              <select className="form-select" value={x} onChange={(e) => setX(e.target.value)}>
                <option value="">Auto</option>
                {opts(numeric)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Y</label>
              <select className="form-select" value={y} onChange={(e) => setY(e.target.value)}>
                <option value="">Auto</option>
                {opts(numeric)}
              </select>
            </div>
          </div>
        );
      case 'heatmap':
        return (
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label">X</label>
              <select className="form-select" value={x} onChange={(e) => setX(e.target.value)}>
                <option value="">Auto</option>
                {opts([...categorical, ...numeric])}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Y</label>
              <select className="form-select" value={y} onChange={(e) => setY(e.target.value)}>
                <option value="">Auto</option>
                {opts([...categorical, ...numeric])}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Agg</label>
              <select className="form-select" value={agg} onChange={(e) => setAgg(e.target.value)}>
                {['sum','mean','count','min','max'].map(a=> <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Limit</label>
              <input type="number" className="form-control" value={limit} onChange={(e)=> setLimit(e.target.value)} />
            </div>
          </div>
        );
      case 'funnel':
        return (
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label">Stage</label>
              <select className="form-select" value={x} onChange={(e) => setX(e.target.value)}>
                <option value="">Auto</option>
                {opts([...categorical, ...numeric])}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Value</label>
              <select className="form-select" value={y} onChange={(e) => setY(e.target.value)}>
                <option value="">Auto</option>
                {opts(numeric)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Agg</label>
              <select className="form-select" value={agg} onChange={(e) => setAgg(e.target.value)}>
                {['sum','mean','count','min','max'].map(a=> <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Limit</label>
              <input type="number" className="form-control" value={limit} onChange={(e)=> setLimit(e.target.value)} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <Card variant="outlined" sx={{ my: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Build a custom chart</Typography>
        {!schema && !error && <Typography color="text.secondary">Loading schema...</Typography>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {schema && (
          <>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-end' }} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Ask"
                placeholder="e.g., show me selling price last month"
                value={chat}
                onChange={(e) => setChat(e.target.value)}
              />
              <Button variant="contained" onClick={() => { setUsingChat(true); onBuild(); }} disabled={loading}>
                {loading ? 'Thinking…' : 'Ask'}
              </Button>
            </Stack>

            <Divider sx={{ my: 1 }} />
            <details>
              <summary>Advanced options</summary>
              <div className="row g-2 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Preset</label>
                  <select className="form-select" value={preset} onChange={(e)=> { setPreset(e.target.value); setUsingChat(false);} }>
                    {presets.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
                <div className="col-md-9">
                  {renderFieldSelectors()}
                </div>
              </div>
              <Button sx={{ mt: 2 }} variant="outlined" onClick={() => { setUsingChat(false); onBuild(); }} disabled={loading}>
                {loading ? 'Building…' : 'Build with options'}
              </Button>
            </details>
          </>
        )}

        {figure && (
          <div className="mt-3">
            {nlSummary && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <div><strong>Built:</strong> {nlSummary?.config?.title || 'Custom chart'}</div>
                {nlSummary?.filter && nlSummary.filter.date_col && (
                  <div className="small">Filtered on {nlSummary.filter.date_col}: {nlSummary.filter.start ? new Date(nlSummary.filter.start).toLocaleDateString() : '...'} to {nlSummary.filter.end ? new Date(nlSummary.filter.end).toLocaleDateString() : '...'}</div>
                )}
                {nlSummary?.explanation && (
                  <div className="small">{nlSummary.explanation}</div>
                )}
              </Alert>
            )}
            <Plot data={figure.data || []} layout={{ ...(figure.layout || {}), autosize: true, height: plotHeight, margin: { t: 40, r: 10, b: isXs ? 40 : 60, l: isXs ? 40 : 60 } }} useResizeHandler style={{ width:'100%', height: plotHeight }} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
