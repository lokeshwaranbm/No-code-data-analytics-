"""
Embeddable Analytics Widget System
Generate secure, customizable widgets that can be embedded in external sites
"""

import secrets
import json
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import hashlib

WIDGETS_DIR = Path(__file__).resolve().parent / 'embed_widgets'
WIDGETS_DIR.mkdir(exist_ok=True)

class WidgetType:
    """Available widget types"""
    CHART = "chart"
    STATS_CARD = "stats_card"
    DATA_TABLE = "data_table"
    DASHBOARD = "dashboard"
    LIVE_METRICS = "live_metrics"
    AI_CHAT = "ai_chat"

class WidgetSecurity:
    """Security settings for widgets"""
    
    def __init__(self):
        self.api_key = secrets.token_urlsafe(32)
        self.allowed_domains = []
        self.expires_at = None
        self.rate_limit = 100  # requests per hour
        self.require_auth = False
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'api_key': self.api_key,
            'allowed_domains': self.allowed_domains,
            'expires_at': self.expires_at,
            'rate_limit': self.rate_limit,
            'require_auth': self.require_auth
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'WidgetSecurity':
        security = cls()
        security.api_key = data.get('api_key', security.api_key)
        security.allowed_domains = data.get('allowed_domains', [])
        security.expires_at = data.get('expires_at')
        security.rate_limit = data.get('rate_limit', 100)
        security.require_auth = data.get('require_auth', False)
        return security

class WidgetTheme:
    """Customizable theme for widgets"""
    
    def __init__(self):
        self.primary_color = "#4F46E5"
        self.background_color = "#FFFFFF"
        self.text_color = "#1F2937"
        self.border_radius = "8px"
        self.font_family = "Inter, system-ui, sans-serif"
        self.shadow = "0 4px 6px rgba(0,0,0,0.1)"
        self.dark_mode = False
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'primary_color': self.primary_color,
            'background_color': self.background_color,
            'text_color': self.text_color,
            'border_radius': self.border_radius,
            'font_family': self.font_family,
            'shadow': self.shadow,
            'dark_mode': self.dark_mode
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'WidgetTheme':
        theme = cls()
        for key, value in data.items():
            if hasattr(theme, key):
                setattr(theme, key, value)
        return theme

class EmbedWidget:
    """Embeddable analytics widget"""
    
    def __init__(self, widget_id: str, widget_type: str, name: str):
        self.widget_id = widget_id
        self.widget_type = widget_type
        self.name = name
        self.data_source = {}  # Reference to data/query
        self.config = {}  # Widget-specific configuration
        self.theme = WidgetTheme()
        self.security = WidgetSecurity()
        self.created_at = datetime.now().isoformat()
        self.last_updated = self.created_at
        self.view_count = 0
        self.enabled = True
    
    def generate_embed_code(self, base_url: str = "http://localhost:8000") -> str:
        """Generate HTML embed code"""
        embed_url = f"{base_url}/api/embed/{self.widget_id}"
        
        html = f'''<!-- Embedded Analytics Widget: {self.name} -->
<div id="analytics-widget-{self.widget_id}" style="width: 100%; height: 100%; min-height: 400px;"></div>
<script>
  (function() {{
    const widgetId = '{self.widget_id}';
    const apiKey = '{self.security.api_key}';
    const embedUrl = '{embed_url}';
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl + '?apiKey=' + apiKey;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '{self.theme.border_radius}';
    iframe.style.boxShadow = '{self.theme.shadow}';
    
    // Allow auto-resizing
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', '0');
    
    // Insert into container
    const container = document.getElementById('analytics-widget-{self.widget_id}');
    if (container) {{
      container.appendChild(iframe);
    }}
    
    // Listen for resize messages
    window.addEventListener('message', function(e) {{
      if (e.data.widgetId === widgetId && e.data.type === 'resize') {{
        iframe.style.height = e.data.height + 'px';
      }}
    }});
  }})();
</script>'''
        return html
    
    def generate_react_component(self) -> str:
        """Generate React component code"""
        return f'''import React, {{ useEffect, useRef }} from 'react';

const AnalyticsWidget_{self.widget_id.replace('-', '_')} = ({{ width = '100%', height = '400px' }}) => {{
  const containerRef = useRef(null);
  
  useEffect(() => {{
    const script = document.createElement('script');
    script.innerHTML = `
      (function() {{
        const iframe = document.createElement('iframe');
        iframe.src = 'http://localhost:8000/api/embed/{self.widget_id}?apiKey={self.security.api_key}';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '{self.theme.border_radius}';
        
        const container = document.getElementById('widget-{self.widget_id}');
        if (container) container.appendChild(iframe);
      }})();
    `;
    
    if (containerRef.current) {{
      containerRef.current.appendChild(script);
    }}
    
    return () => {{
      if (containerRef.current) {{
        containerRef.current.innerHTML = '';
      }}
    }};
  }}, []);
  
  return (
    <div
      id="widget-{self.widget_id}"
      ref={{containerRef}}
      style={{{{ width, height, position: 'relative' }}}}
    />
  );
}};

export default AnalyticsWidget_{self.widget_id.replace('-', '_')};'''
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'widget_id': self.widget_id,
            'widget_type': self.widget_type,
            'name': self.name,
            'data_source': self.data_source,
            'config': self.config,
            'theme': self.theme.to_dict(),
            'security': self.security.to_dict(),
            'created_at': self.created_at,
            'last_updated': self.last_updated,
            'view_count': self.view_count,
            'enabled': self.enabled
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'EmbedWidget':
        widget = cls(
            widget_id=data['widget_id'],
            widget_type=data['widget_type'],
            name=data['name']
        )
        widget.data_source = data.get('data_source', {})
        widget.config = data.get('config', {})
        widget.theme = WidgetTheme.from_dict(data.get('theme', {}))
        widget.security = WidgetSecurity.from_dict(data.get('security', {}))
        widget.created_at = data.get('created_at', widget.created_at)
        widget.last_updated = data.get('last_updated', widget.last_updated)
        widget.view_count = data.get('view_count', 0)
        widget.enabled = data.get('enabled', True)
        return widget

class WidgetManager:
    """Manages embeddable widgets"""
    
    def __init__(self):
        self.widgets: Dict[str, EmbedWidget] = {}
        self._load_widgets()
    
    def create_widget(
        self,
        widget_type: str,
        name: str,
        data_source: Dict[str, Any],
        config: Dict[str, Any] = None
    ) -> EmbedWidget:
        """Create new embeddable widget"""
        widget_id = f"widget_{secrets.token_urlsafe(12)}"
        widget = EmbedWidget(widget_id, widget_type, name)
        widget.data_source = data_source
        widget.config = config or {}
        
        self.widgets[widget_id] = widget
        self._save_widget(widget)
        return widget
    
    def get_widget(self, widget_id: str) -> Optional[EmbedWidget]:
        """Get widget by ID"""
        return self.widgets.get(widget_id)
    
    def list_widgets(self) -> List[Dict[str, Any]]:
        """List all widgets"""
        return [w.to_dict() for w in self.widgets.values()]
    
    def update_widget(self, widget_id: str, updates: Dict[str, Any]) -> bool:
        """Update widget configuration"""
        widget = self.get_widget(widget_id)
        if not widget:
            return False
        
        if 'config' in updates:
            widget.config.update(updates['config'])
        if 'theme' in updates:
            widget.theme = WidgetTheme.from_dict(updates['theme'])
        if 'security' in updates:
            for key, value in updates['security'].items():
                setattr(widget.security, key, value)
        
        widget.last_updated = datetime.now().isoformat()
        self._save_widget(widget)
        return True
    
    def delete_widget(self, widget_id: str) -> bool:
        """Delete widget"""
        if widget_id in self.widgets:
            widget_file = WIDGETS_DIR / f"{widget_id}.json"
            if widget_file.exists():
                widget_file.unlink()
            del self.widgets[widget_id]
            return True
        return False
    
    def increment_view_count(self, widget_id: str):
        """Track widget view"""
        widget = self.get_widget(widget_id)
        if widget:
            widget.view_count += 1
            self._save_widget(widget)
    
    def validate_access(
        self,
        widget_id: str,
        api_key: str,
        origin: str = None
    ) -> bool:
        """Validate widget access"""
        widget = self.get_widget(widget_id)
        if not widget or not widget.enabled:
            return False
        
        # Check API key
        if widget.security.api_key != api_key:
            return False
        
        # Check expiry
        if widget.security.expires_at:
            expiry = datetime.fromisoformat(widget.security.expires_at)
            if datetime.now() > expiry:
                return False
        
        # Check domain whitelist
        if origin and widget.security.allowed_domains:
            if not any(domain in origin for domain in widget.security.allowed_domains):
                return False
        
        return True
    
    def _save_widget(self, widget: EmbedWidget):
        """Save widget to disk"""
        widget_file = WIDGETS_DIR / f"{widget.widget_id}.json"
        with open(widget_file, 'w', encoding='utf-8') as f:
            json.dump(widget.to_dict(), f, indent=2)
    
    def _load_widgets(self):
        """Load all widgets from disk"""
        for widget_file in WIDGETS_DIR.glob("*.json"):
            try:
                with open(widget_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                widget = EmbedWidget.from_dict(data)
                self.widgets[widget.widget_id] = widget
            except Exception as e:
                print(f"Failed to load widget {widget_file}: {e}")

# Global manager instance
manager = WidgetManager()

def create_sample_widget():
    """Create sample embeddable widget"""
    widget = manager.create_widget(
        widget_type=WidgetType.DASHBOARD,
        name="Sales Dashboard",
        data_source={'file': 'sales_data.csv', 'query': 'SELECT * FROM sales'},
        config={
            'refresh_interval': 30,
            'show_filters': True,
            'interactive': True
        }
    )
    
    # Customize theme
    widget.theme.primary_color = "#10B981"
    widget.theme.dark_mode = True
    
    # Configure security
    widget.security.allowed_domains = ['example.com', 'localhost']
    widget.security.rate_limit = 200
    
    manager._save_widget(widget)
    return widget
