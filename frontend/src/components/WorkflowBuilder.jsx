import React, { useState, useEffect } from 'react';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ScheduleIcon from '@mui/icons-material/Schedule';

const WorkflowBuilder = () => {
  const [workflows, setWorkflows] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    actions: [],
    trigger: { type: 'manual', config: {} }
  });

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/workflows');
      const data = await response.json();
      setWorkflows(data.workflows || []);
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
    }
  };

  const createWorkflow = async () => {
    if (!newWorkflow.name) {
      alert('Please enter a workflow name');
      return;
    }

    try {
      const response = await fetch('/workflows/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkflow)
      });
      
      if (response.ok) {
        setShowBuilder(false);
        setNewWorkflow({ name: '', description: '', actions: [], trigger: { type: 'manual', config: {} } });
        fetchWorkflows();
      }
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  const executeWorkflow = async (workflowId) => {
    try {
      const response = await fetch(`/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      const result = await response.json();
      alert(`Workflow ${result.status}: ${result.total_actions} actions executed`);
      fetchWorkflows();
    } catch (error) {
      console.error('Failed to execute workflow:', error);
    }
  };

  const deleteWorkflow = async (workflowId) => {
    if (!window.confirm('Delete this workflow?')) return;
    
    try {
      await fetch(`/workflows/${workflowId}`, { method: 'DELETE' });
      fetchWorkflows();
    } catch (error) {
      console.error('Failed to delete workflow:', error);
    }
  };

  const addAction = () => {
    setNewWorkflow({
      ...newWorkflow,
      actions: [
        ...newWorkflow.actions,
        { type: 'clean_data', params: {}, name: 'Clean Data' }
      ]
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="text-success" />;
      case 'failed':
        return <ErrorIcon className="text-danger" />;
      default:
        return <ScheduleIcon className="text-muted" />;
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-10 offset-lg-1">
          <div className="glass-card hover-lift">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-2">
                <div className="feature-icon" style={{ width: 48, height: 48, marginBottom: 0 }}>
                  <AccountTreeIcon />
                </div>
                <div>
                  <h3 className="mb-0 text-gradient">Workflow Automation</h3>
                  <small className="text-muted">Chain operations and automate tasks</small>
                </div>
              </div>
              <button
                className="btn btn-gradient-primary click-bounce"
                onClick={() => setShowBuilder(!showBuilder)}
              >
                <AddIcon className="me-1" fontSize="small" />
                New Workflow
              </button>
            </div>

            {showBuilder && (
              <div className="glass-card--softer p-4 mb-4 rounded-lg-premium">
                <h5 className="mb-3">Create Workflow</h5>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Workflow Name</label>
                  <input
                    type="text"
                    className="form-control form-control-premium"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                    placeholder="e.g., Daily Data Pipeline"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Description</label>
                  <textarea
                    className="form-control form-control-premium"
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    placeholder="What does this workflow do?"
                    rows={2}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Trigger</label>
                  <select
                    className="form-select form-control-premium"
                    value={newWorkflow.trigger.type}
                    onChange={(e) => setNewWorkflow({
                      ...newWorkflow,
                      trigger: { ...newWorkflow.trigger, type: e.target.value }
                    })}
                  >
                    <option value="manual">Manual (Click to Run)</option>
                    <option value="schedule">Scheduled (Cron)</option>
                    <option value="data_upload">On Data Upload</option>
                    <option value="anomaly_detected">On Anomaly Detected</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Actions</label>
                  {newWorkflow.actions.map((action, idx) => (
                    <div key={idx} className="input-group mb-2">
                      <select
                        className="form-select form-control-premium"
                        value={action.type}
                        onChange={(e) => {
                          const updated = [...newWorkflow.actions];
                          updated[idx].type = e.target.value;
                          setNewWorkflow({ ...newWorkflow, actions: updated });
                        }}
                      >
                        <option value="clean_data">Clean Data</option>
                        <option value="run_analysis">Run Analysis</option>
                        <option value="generate_chart">Generate Chart</option>
                        <option value="check_anomalies">Check Anomalies</option>
                        <option value="send_alert">Send Alert</option>
                        <option value="export_report">Export Report</option>
                      </select>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => {
                          const updated = newWorkflow.actions.filter((_, i) => i !== idx);
                          setNewWorkflow({ ...newWorkflow, actions: updated });
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </div>
                  ))}
                  <button className="btn btn-outline-secondary btn-sm" onClick={addAction}>
                    <AddIcon fontSize="small" className="me-1" />
                    Add Action
                  </button>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-gradient-primary flex-grow-1" onClick={createWorkflow}>
                    Create Workflow
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowBuilder(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {workflows.length === 0 ? (
              <div className="text-center text-muted py-5">
                No workflows yet. Create one to automate your data operations.
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {workflows.map((wf) => (
                  <div key={wf.workflow_id} className="list-group-item glass-card--softer mb-3 rounded">
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          {getStatusIcon(wf.status)}
                          <strong>{wf.name}</strong>
                          <span className="badge bg-secondary">{wf.trigger_type}</span>
                        </div>
                        <div className="text-muted small mb-2">{wf.description}</div>
                        <div className="text-muted small">
                          <strong>{wf.actions.length}</strong> action{wf.actions.length !== 1 ? 's' : ''} • 
                          <strong className="ms-2">{wf.run_count}</strong> run{wf.run_count !== 1 ? 's' : ''} •
                          {wf.last_run && (
                            <span className="ms-2">
                              Last: {new Date(wf.last_run).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-gradient-success"
                          onClick={() => executeWorkflow(wf.workflow_id)}
                        >
                          <PlayArrowIcon fontSize="small" />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteWorkflow(wf.workflow_id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
