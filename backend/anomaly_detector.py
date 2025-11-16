"""
Real-time Anomaly Detection System
Monitors data patterns and triggers alerts for statistical anomalies
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple
from datetime import datetime
from pathlib import Path
import json
from scipy import stats

ALERTS_DIR = Path(__file__).resolve().parent / 'anomaly_alerts'
ALERTS_DIR.mkdir(exist_ok=True)

class AnomalyDetector:
    """Detects statistical anomalies in datasets using multiple methods"""
    
    def __init__(self, sensitivity: str = 'medium'):
        """
        Initialize anomaly detector
        Args:
            sensitivity: 'low', 'medium', 'high' - affects detection thresholds
        """
        self.thresholds = {
            'low': {'z_score': 3.5, 'iqr_multiplier': 3.0},
            'medium': {'z_score': 3.0, 'iqr_multiplier': 2.5},
            'high': {'z_score': 2.5, 'iqr_multiplier': 2.0}
        }
        self.sensitivity = sensitivity
        self.config = self.thresholds[sensitivity]
    
    def detect_statistical_anomalies(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Detect anomalies across all numeric columns
        Returns list of anomaly events with details
        """
        anomalies = []
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            data = df[col].dropna()
            if len(data) < 10:  # Need sufficient data
                continue
            
            # Z-score method
            z_scores = np.abs(stats.zscore(data))
            z_anomalies = np.where(z_scores > self.config['z_score'])[0]
            
            # IQR method
            Q1 = data.quantile(0.25)
            Q3 = data.quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - self.config['iqr_multiplier'] * IQR
            upper_bound = Q3 + self.config['iqr_multiplier'] * IQR
            iqr_anomalies = data[(data < lower_bound) | (data > upper_bound)].index.tolist()
            
            # Combine both methods (intersection = high confidence)
            high_confidence = set(z_anomalies).intersection(set(iqr_anomalies))
            
            if high_confidence:
                anomalies.append({
                    'column': col,
                    'type': 'statistical_outlier',
                    'severity': 'high',
                    'count': len(high_confidence),
                    'indices': list(high_confidence)[:10],  # Limit to first 10
                    'values': [float(data.iloc[i]) for i in list(high_confidence)[:10]],
                    'normal_range': f"[{float(lower_bound):.2f}, {float(upper_bound):.2f}]",
                    'mean': float(data.mean()),
                    'std': float(data.std()),
                    'detected_at': datetime.now().isoformat()
                })
        
        return anomalies
    
    def detect_sudden_changes(self, df: pd.DataFrame, window: int = 5) -> List[Dict[str, Any]]:
        """
        Detect sudden changes/spikes in sequential data
        Useful for time-series or ordered datasets
        """
        changes = []
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            data = df[col].dropna()
            if len(data) < window * 2:
                continue
            
            # Rolling mean and std
            rolling_mean = data.rolling(window=window, center=True).mean()
            rolling_std = data.rolling(window=window, center=True).std()
            
            # Detect points that deviate significantly from local trend
            deviations = np.abs(data - rolling_mean) / (rolling_std + 1e-6)
            spike_indices = np.where(deviations > 3.0)[0]
            
            if len(spike_indices) > 0:
                changes.append({
                    'column': col,
                    'type': 'sudden_change',
                    'severity': 'medium',
                    'count': len(spike_indices),
                    'indices': spike_indices[:10].tolist(),
                    'values': [float(data.iloc[i]) for i in spike_indices[:10]],
                    'detected_at': datetime.now().isoformat()
                })
        
        return changes
    
    def detect_missing_data_anomalies(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Detect unusual patterns in missing data
        (sudden increase in nulls, complete column dropout)
        """
        anomalies = []
        
        for col in df.columns:
            missing_pct = (df[col].isna().sum() / len(df)) * 100
            
            # Flag columns with high missing rate
            if missing_pct > 30:
                anomalies.append({
                    'column': col,
                    'type': 'high_missing_data',
                    'severity': 'medium' if missing_pct < 50 else 'high',
                    'missing_percentage': float(missing_pct),
                    'missing_count': int(df[col].isna().sum()),
                    'total_rows': len(df),
                    'detected_at': datetime.now().isoformat()
                })
        
        return anomalies
    
    def detect_duplicate_anomalies(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Detect suspicious duplicate patterns
        """
        anomalies = []
        
        # Check for exact duplicate rows
        dup_count = df.duplicated().sum()
        if dup_count > 0:
            dup_pct = (dup_count / len(df)) * 100
            anomalies.append({
                'type': 'duplicate_rows',
                'severity': 'low' if dup_pct < 5 else 'medium',
                'duplicate_count': int(dup_count),
                'duplicate_percentage': float(dup_pct),
                'total_rows': len(df),
                'detected_at': datetime.now().isoformat()
            })
        
        return anomalies
    
    def run_full_analysis(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Run all anomaly detection methods and return comprehensive report
        """
        all_anomalies = []
        
        # Run all detection methods
        all_anomalies.extend(self.detect_statistical_anomalies(df))
        all_anomalies.extend(self.detect_sudden_changes(df))
        all_anomalies.extend(self.detect_missing_data_anomalies(df))
        all_anomalies.extend(self.detect_duplicate_anomalies(df))
        
        # Count by severity
        severity_counts = {'high': 0, 'medium': 0, 'low': 0}
        for anomaly in all_anomalies:
            severity_counts[anomaly.get('severity', 'low')] += 1
        
        return {
            'total_anomalies': len(all_anomalies),
            'severity_breakdown': severity_counts,
            'anomalies': all_anomalies,
            'analysis_timestamp': datetime.now().isoformat(),
            'sensitivity': self.sensitivity,
            'dataset_shape': {'rows': len(df), 'columns': len(df.columns)}
        }


def save_alert(filename: str, alert_data: Dict[str, Any]) -> str:
    """Save anomaly alert to persistent storage"""
    safe_name = filename.replace('.csv', '').replace('.xlsx', '').replace(' ', '_')
    alert_file = ALERTS_DIR / f"{safe_name}_alerts.json"
    
    # Load existing alerts or create new
    if alert_file.exists():
        with open(alert_file, 'r', encoding='utf-8') as f:
            alerts = json.load(f)
    else:
        alerts = {
            'filename': filename,
            'created_at': datetime.now().isoformat(),
            'alerts': []
        }
    
    # Add new alert
    alerts['alerts'].append(alert_data)
    alerts['last_updated'] = datetime.now().isoformat()
    alerts['total_alerts'] = len(alerts['alerts'])
    
    # Save
    with open(alert_file, 'w', encoding='utf-8') as f:
        json.dump(alerts, f, indent=2)
    
    return str(alert_file)


def get_alerts(filename: str, limit: int = -1) -> Dict[str, Any]:
    """Retrieve saved alerts for a file"""
    safe_name = filename.replace('.csv', '').replace('.xlsx', '').replace(' ', '_')
    alert_file = ALERTS_DIR / f"{safe_name}_alerts.json"
    
    if alert_file.exists():
        with open(alert_file, 'r', encoding='utf-8') as f:
            alerts = json.load(f)
        
        if limit > 0:
            alerts['alerts'] = alerts['alerts'][-limit:]
        
        return alerts
    
    return {'filename': filename, 'alerts': [], 'total_alerts': 0}


def clear_alerts(filename: str) -> bool:
    """Clear all alerts for a file"""
    safe_name = filename.replace('.csv', '').replace('.xlsx', '').replace(' ', '_')
    alert_file = ALERTS_DIR / f"{safe_name}_alerts.json"
    
    if alert_file.exists():
        alert_file.unlink()
        return True
    return False
