// Minimal API client for the prototype. Adjust base URL as needed.

// Base URL for API in production deployments (set VITE_API_BASE_URL on Vercel/Render)
const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ? (import.meta.env.VITE_API_BASE_URL || '') : '';

function url(path) {
  if (!API_BASE) return path;
  const base = API_BASE.replace(/\/$/, '');
  return `${base}${path}`;
}

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
}

// Helper to safely parse JSON responses
async function safeJsonParse(response) {
  const text = await response.text();
  if (!text || text.trim() === '') {
    throw new Error('Empty response from server');
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('JSON parse error. Response text:', text);
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
}

export async function uploadCsv(file) {
  const form = new FormData();
  form.append('file', file);
  // Attach settings if available
  try {
    const raw = localStorage.getItem('appSettings');
    if (raw) {
      const s = JSON.parse(raw);
      if (typeof s?.autoClean === 'boolean') form.append('autoClean', String(s.autoClean));
      if (typeof s?.outlierDetection === 'boolean') form.append('outlierDetection', String(s.outlierDetection));
      if (typeof s?.aiProvider === 'string') form.append('aiProvider', s.aiProvider);
      if (typeof s?.chartHeight === 'string') form.append('chartHeight', s.chartHeight);
    }
  } catch {}

  const resp = await fetch(url('/upload'), {
    method: 'POST',
    body: form,
    headers: getAuthHeaders(),
  });

  if (!resp.ok) {
    let detail = 'Unknown error';
    try {
      const err = await safeJsonParse(resp);
      detail = err.detail || JSON.stringify(err);
    } catch (e) {
      detail = e.message || 'Unknown error';
    }
    throw new Error(`Upload failed: ${detail}`);
  }

  return safeJsonParse(resp);
}

// Fetch inferred schema for a given original filename (not cleaned_ prefix)
export async function fetchSchema(filename) {
  const resp = await fetch(url(`/schema/${encodeURIComponent(filename)}`), {
    headers: getAuthHeaders()
  });
  if (!resp.ok) {
    throw new Error(`Schema fetch failed: ${resp.status}`);
  }
  return safeJsonParse(resp);
}

// Request a visualization preset
// payload example: { preset: 'bar', x: 'category_col', y: 'value_col', agg: 'sum', limit: 20 }
export async function visualize(filename, payload) {
  const resp = await fetch(url(`/visualize/${encodeURIComponent(filename)}`), {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) {
    let detail = 'Unknown error';
    try { detail = (await safeJsonParse(resp)).detail; } catch {}
    throw new Error(`Visualization failed: ${detail}`);
  }
  return safeJsonParse(resp);
}

// Natural language to visualization
export async function nlviz(filename, prompt) {
  const resp = await fetch(url(`/nlviz/${encodeURIComponent(filename)}`), {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ prompt })
  });
  if (!resp.ok) {
    let detail = 'Unknown error';
    try { detail = (await safeJsonParse(resp)).detail; } catch {}
    throw new Error(`NL Viz failed: ${detail}`);
  }
  return safeJsonParse(resp);
}
