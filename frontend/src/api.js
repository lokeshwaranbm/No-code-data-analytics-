// Minimal API client for the prototype. Adjust base URL as needed.
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

  const resp = await fetch('/upload', {
    method: 'POST',
    body: form,
  });

  if (!resp.ok) {
    let detail = 'Unknown error';
    try {
      const err = await resp.json();
      detail = err.detail || JSON.stringify(err);
    } catch (e) {
      detail = await resp.text();
    }
    throw new Error(`Upload failed: ${detail}`);
  }

  return resp.json();
}

// Fetch inferred schema for a given original filename (not cleaned_ prefix)
export async function fetchSchema(filename) {
  const resp = await fetch(`/schema/${encodeURIComponent(filename)}`);
  if (!resp.ok) {
    throw new Error(`Schema fetch failed: ${resp.status}`);
  }
  return resp.json();
}

// Request a visualization preset
// payload example: { preset: 'bar', x: 'category_col', y: 'value_col', agg: 'sum', limit: 20 }
export async function visualize(filename, payload) {
  const resp = await fetch(`/visualize/${encodeURIComponent(filename)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) {
    let detail = 'Unknown error';
    try { detail = (await resp.json()).detail; } catch {}
    throw new Error(`Visualization failed: ${detail}`);
  }
  return resp.json();
}

// Natural language to visualization
export async function nlviz(filename, prompt) {
  const resp = await fetch(`/nlviz/${encodeURIComponent(filename)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!resp.ok) {
    let detail = 'Unknown error';
    try { detail = (await resp.json()).detail; } catch {}
    throw new Error(`NL Viz failed: ${detail}`);
  }
  return resp.json();
}
