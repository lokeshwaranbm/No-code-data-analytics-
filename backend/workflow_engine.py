"""
Workflow Automation Engine
Chain data operations, schedule reports, trigger actions based on conditions
"""

import json
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Callable
from enum import Enum
import asyncio

WORKFLOWS_DIR = Path(__file__).resolve().parent / 'workflows'
WORKFLOWS_DIR.mkdir(exist_ok=True)

class ActionType(Enum):
    """Available workflow action types"""
    CLEAN_DATA = "clean_data"
    RUN_ANALYSIS = "run_analysis"
    GENERATE_CHART = "generate_chart"
    SEND_ALERT = "send_alert"
    EXPORT_REPORT = "export_report"
    CHECK_ANOMALIES = "check_anomalies"
    ARCHIVE_DATA = "archive_data"

class TriggerType(Enum):
    """Workflow trigger types"""
    MANUAL = "manual"  # User clicks run
    SCHEDULE = "schedule"  # Cron-like schedule
    DATA_UPLOAD = "data_upload"  # On new file upload
    ANOMALY_DETECTED = "anomaly_detected"  # When anomaly alert fires
    THRESHOLD = "threshold"  # When metric crosses threshold

class WorkflowStatus(Enum):
    """Workflow execution status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    PAUSED = "paused"

class WorkflowAction:
    """Single action in a workflow"""
    
    def __init__(self, action_type: ActionType, params: Dict[str, Any], name: str = None):
        self.action_type = action_type
        self.params = params
        self.name = name or action_type.value
        self.status = WorkflowStatus.PENDING
        self.result = None
        self.error = None
        self.executed_at = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'action_type': self.action_type.value,
            'name': self.name,
            'params': self.params,
            'status': self.status.value,
            'result': self.result,
            'error': self.error,
            'executed_at': self.executed_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'WorkflowAction':
        action = cls(
            action_type=ActionType(data['action_type']),
            params=data['params'],
            name=data.get('name')
        )
        action.status = WorkflowStatus(data.get('status', 'pending'))
        action.result = data.get('result')
        action.error = data.get('error')
        action.executed_at = data.get('executed_at')
        return action

class Workflow:
    """Complete workflow with triggers, actions, and conditions"""
    
    def __init__(self, workflow_id: str, name: str, description: str = ""):
        self.workflow_id = workflow_id
        self.name = name
        self.description = description
        self.actions: List[WorkflowAction] = []
        self.trigger_type = TriggerType.MANUAL
        self.trigger_config = {}
        self.conditions = []  # List of conditions that must be met
        self.status = WorkflowStatus.PENDING
        self.created_at = datetime.now().isoformat()
        self.last_run = None
        self.run_count = 0
        self.enabled = True
    
    def add_action(self, action: WorkflowAction) -> 'Workflow':
        """Add action to workflow (chainable)"""
        self.actions.append(action)
        return self
    
    def set_trigger(self, trigger_type: TriggerType, config: Dict[str, Any] = None) -> 'Workflow':
        """Set workflow trigger"""
        self.trigger_type = trigger_type
        self.trigger_config = config or {}
        return self
    
    def add_condition(self, condition: Dict[str, Any]) -> 'Workflow':
        """Add execution condition"""
        self.conditions.append(condition)
        return self
    
    async def execute(self, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute workflow asynchronously"""
        self.status = WorkflowStatus.RUNNING
        self.last_run = datetime.now().isoformat()
        context = context or {}
        results = []
        
        try:
            for idx, action in enumerate(self.actions):
                action.status = WorkflowStatus.RUNNING
                action.executed_at = datetime.now().isoformat()
                
                try:
                    # Execute action (in real implementation, call actual functions)
                    result = await self._execute_action(action, context)
                    action.result = result
                    action.status = WorkflowStatus.COMPLETED
                    results.append(result)
                    
                    # Update context with result for next actions
                    context[f'action_{idx}_result'] = result
                    
                except Exception as e:
                    action.error = str(e)
                    action.status = WorkflowStatus.FAILED
                    
                    # Stop workflow on error (can be made configurable)
                    self.status = WorkflowStatus.FAILED
                    return {
                        'status': 'failed',
                        'error': str(e),
                        'completed_actions': idx,
                        'total_actions': len(self.actions),
                        'results': results
                    }
            
            self.status = WorkflowStatus.COMPLETED
            self.run_count += 1
            
            return {
                'status': 'completed',
                'total_actions': len(self.actions),
                'results': results,
                'executed_at': self.last_run
            }
            
        except Exception as e:
            self.status = WorkflowStatus.FAILED
            return {
                'status': 'failed',
                'error': str(e),
                'results': results
            }
    
    async def _execute_action(self, action: WorkflowAction, context: Dict[str, Any]) -> Any:
        """Execute individual action (placeholder for actual implementation)"""
        # Simulate action execution
        await asyncio.sleep(0.1)
        
        return {
            'action': action.name,
            'type': action.action_type.value,
            'timestamp': datetime.now().isoformat(),
            'simulated': True  # In production, call real functions
        }
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'workflow_id': self.workflow_id,
            'name': self.name,
            'description': self.description,
            'actions': [a.to_dict() for a in self.actions],
            'trigger_type': self.trigger_type.value,
            'trigger_config': self.trigger_config,
            'conditions': self.conditions,
            'status': self.status.value,
            'created_at': self.created_at,
            'last_run': self.last_run,
            'run_count': self.run_count,
            'enabled': self.enabled
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Workflow':
        workflow = cls(
            workflow_id=data['workflow_id'],
            name=data['name'],
            description=data.get('description', '')
        )
        workflow.actions = [WorkflowAction.from_dict(a) for a in data.get('actions', [])]
        workflow.trigger_type = TriggerType(data.get('trigger_type', 'manual'))
        workflow.trigger_config = data.get('trigger_config', {})
        workflow.conditions = data.get('conditions', [])
        workflow.status = WorkflowStatus(data.get('status', 'pending'))
        workflow.created_at = data.get('created_at', datetime.now().isoformat())
        workflow.last_run = data.get('last_run')
        workflow.run_count = data.get('run_count', 0)
        workflow.enabled = data.get('enabled', True)
        return workflow

class WorkflowEngine:
    """Manages workflow creation, execution, and scheduling"""
    
    def __init__(self):
        self.workflows: Dict[str, Workflow] = {}
        self._load_workflows()
    
    def create_workflow(self, name: str, description: str = "") -> Workflow:
        """Create new workflow"""
        workflow_id = f"wf_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        workflow = Workflow(workflow_id, name, description)
        self.workflows[workflow_id] = workflow
        self._save_workflow(workflow)
        return workflow
    
    def get_workflow(self, workflow_id: str) -> Optional[Workflow]:
        """Get workflow by ID"""
        return self.workflows.get(workflow_id)
    
    def list_workflows(self) -> List[Dict[str, Any]]:
        """List all workflows"""
        return [w.to_dict() for w in self.workflows.values()]
    
    def delete_workflow(self, workflow_id: str) -> bool:
        """Delete workflow"""
        if workflow_id in self.workflows:
            workflow_file = WORKFLOWS_DIR / f"{workflow_id}.json"
            if workflow_file.exists():
                workflow_file.unlink()
            del self.workflows[workflow_id]
            return True
        return False
    
    async def execute_workflow(self, workflow_id: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute workflow by ID"""
        workflow = self.get_workflow(workflow_id)
        if not workflow:
            return {'status': 'failed', 'error': 'Workflow not found'}
        
        if not workflow.enabled:
            return {'status': 'failed', 'error': 'Workflow is disabled'}
        
        result = await workflow.execute(context)
        self._save_workflow(workflow)
        return result
    
    def _save_workflow(self, workflow: Workflow):
        """Save workflow to disk"""
        workflow_file = WORKFLOWS_DIR / f"{workflow.workflow_id}.json"
        with open(workflow_file, 'w', encoding='utf-8') as f:
            json.dump(workflow.to_dict(), f, indent=2)
    
    def _load_workflows(self):
        """Load all workflows from disk"""
        for workflow_file in WORKFLOWS_DIR.glob("*.json"):
            try:
                with open(workflow_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                workflow = Workflow.from_dict(data)
                self.workflows[workflow.workflow_id] = workflow
            except Exception as e:
                print(f"Failed to load workflow {workflow_file}: {e}")

# Global engine instance
engine = WorkflowEngine()

def create_sample_workflows():
    """Create sample workflows to demonstrate capabilities"""
    
    # Sample 1: Daily data cleaning + analysis
    wf1 = engine.create_workflow(
        "Daily Data Pipeline",
        "Clean data and generate analysis report every day at 9 AM"
    )
    wf1.add_action(WorkflowAction(ActionType.CLEAN_DATA, {'auto_clean': True}))
    wf1.add_action(WorkflowAction(ActionType.RUN_ANALYSIS, {'full_analysis': True}))
    wf1.add_action(WorkflowAction(ActionType.GENERATE_CHART, {'chart_type': 'summary'}))
    wf1.set_trigger(TriggerType.SCHEDULE, {'cron': '0 9 * * *', 'timezone': 'UTC'})
    engine._save_workflow(wf1)
    
    # Sample 2: Anomaly alert workflow
    wf2 = engine.create_workflow(
        "Anomaly Response",
        "When anomaly detected, check severity and send alert"
    )
    wf2.add_action(WorkflowAction(ActionType.CHECK_ANOMALIES, {'sensitivity': 'high'}))
    wf2.add_action(WorkflowAction(ActionType.SEND_ALERT, {'channels': ['email', 'in-app']}))
    wf2.set_trigger(TriggerType.ANOMALY_DETECTED, {'min_severity': 'medium'})
    engine._save_workflow(wf2)
    
    # Sample 3: Auto-archive old data
    wf3 = engine.create_workflow(
        "Monthly Archive",
        "Archive data older than 90 days every month"
    )
    wf3.add_action(WorkflowAction(ActionType.ARCHIVE_DATA, {'retention_days': 90}))
    wf3.add_action(WorkflowAction(ActionType.EXPORT_REPORT, {'format': 'json', 'compress': True}))
    wf3.set_trigger(TriggerType.SCHEDULE, {'cron': '0 0 1 * *'})
    engine._save_workflow(wf3)
    
    return [wf1, wf2, wf3]
