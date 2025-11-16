# Developer Quick Reference

Quick reference guide for developers working on the No-Code Data Analytics platform.

## 🚀 Quick Start

### Start Development Servers

```powershell
# Terminal 1: Backend (Windows PowerShell)
cd backend
.\venv\Scripts\Activate.ps1
python main.py
# Backend runs on http://localhost:8000

# Terminal 2: Frontend
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### Environment Setup

```powershell
# Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

## 📁 Project Structure

```
No-Code-Data-Analytics/
├── backend/
│   ├── main.py                  # FastAPI app, 21+ API endpoints
│   ├── data_cleaner.py          # CSV cleaning logic
│   ├── eda_engine.py            # Exploratory data analysis
│   ├── openai_summary.py        # AI insights (Groq/OpenAI/Gemini)
│   ├── anomaly_detector.py      # 🆕 Multi-method anomaly detection
│   ├── workflow_engine.py       # 🆕 Workflow automation
│   ├── embed_widgets.py         # 🆕 Widget embedding
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx            # Main dashboard
│   │   │   ├── AnomalyAlerts.jsx        # 🆕 Anomaly alerts
│   │   │   ├── WorkflowBuilder.jsx      # 🆕 Workflow builder
│   │   │   ├── EmbedWidgets.jsx         # 🆕 Widget manager
│   │   │   ├── Notifications.jsx        # 🆕 Notifications center
│   │   │   ├── Navbar.jsx               # Navigation (7 tabs)
│   │   │   ├── Settings.jsx             # User preferences
│   │   │   └── ...
│   │   ├── App.jsx                      # Main app component
│   │   └── styles/premium.css           # Premium design system
│   └── vite.config.js                   # Vite config with proxies
│
└── docs/
    ├── COMPETITIVE_FEATURES.md          # Technical feature docs
    ├── QUICKSTART_NEW_FEATURES.md       # User guide
    ├── FEATURE_WALKTHROUGH.md           # Visual guide
    ├── DEPLOYMENT.md                    # Production deployment
    └── CONTRIBUTING.md                  # Contribution guidelines
```

## 🔌 API Endpoints

### Core Data Analysis
```
POST /upload                     # Upload and analyze CSV
```

### Anomaly Detection
```
POST   /anomalies/detect         # Detect anomalies in data
GET    /anomalies/alerts/{file}  # Get saved alerts
DELETE /anomalies/alerts/{file}  # Clear alerts
```

### Workflow Automation
```
POST   /workflows/create         # Create workflow
GET    /workflows                # List workflows
GET    /workflows/{id}           # Get workflow details
POST   /workflows/{id}/execute   # Execute workflow
DELETE /workflows/{id}           # Delete workflow
```

### Embeddable Widgets
```
POST   /widgets/create           # Create widget
GET    /widgets                  # List widgets
GET    /widgets/{id}             # Get widget details
GET    /widgets/{id}/embed       # Get embed code
PUT    /widgets/{id}             # Update widget
DELETE /widgets/{id}             # Delete widget
GET    /api/embed/{id}           # Public iframe endpoint
```

## 🧪 Testing

### Backend Tests
```powershell
cd backend
pytest tests/
```

### Frontend Tests
```powershell
cd frontend
npm test
```

### Manual API Testing
```powershell
# Test anomaly detection
curl -X POST http://localhost:8000/anomalies/detect `
  -F "file=@data.csv" `
  -F "sensitivity=medium"

# Test workflow creation
curl -X POST http://localhost:8000/workflows/create `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Test Workflow",
    "trigger": {"type": "manual"},
    "actions": [{"action_type": "clean_data"}]
  }'

# Test widget creation
curl -X POST http://localhost:8000/widgets/create `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Sales Chart",
    "widget_type": "chart",
    "allowed_domains": ["*"]
  }'
```

## 🎨 Design System

### Premium CSS Classes

#### Glassmorphism
```jsx
<div className="glass-card hover-lift">
  {/* Card content */}
</div>

<nav className="glass-navbar">
  {/* Navigation */}
</nav>
```

#### Gradient Buttons
```jsx
<button className="btn-gradient-primary click-bounce">
  Primary Action
</button>

<button className="btn-gradient-accent hover-lift">
  Secondary Action
</button>

<button className="btn-gradient-success">
  Success Action
</button>
```

#### Gradient Text
```jsx
<h1 className="text-gradient">
  Premium Heading
</h1>
```

#### Micro-interactions
```jsx
<div className="hover-lift">    {/* Lifts on hover */}</div>
<div className="hover-scale">   {/* Scales on hover */}</div>
<div className="hover-glow">    {/* Glows on hover */}</div>
<button className="click-bounce"> {/* Bounces on click */}</button>
```

#### Loading States
```jsx
<div className="loading-spinner"></div>

<div className="skeleton" style={{width: '100%', height: '20px'}}></div>
```

### Color Palette
```css
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-accent: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--gradient-success: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
```

## 🔧 Common Tasks

### Add New API Endpoint

**Backend** (`main.py`):
```python
@app.post("/your-endpoint")
async def your_function(request: Request):
    try:
        # Your logic here
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Frontend Proxy** (`vite.config.js`):
```javascript
'/your-endpoint': {
  target: 'http://localhost:8000',
  changeOrigin: true,
}
```

### Add New Component

```jsx
// src/components/YourComponent.jsx
import React, { useState, useEffect } from 'react';
import './styles/premium.css';

const YourComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Fetch data or initialize
  }, []);
  
  return (
    <div className="glass-card hover-lift">
      {/* Component content */}
    </div>
  );
};

export default YourComponent;
```

**Register in App.jsx**:
```jsx
import YourComponent from './components/YourComponent';

// In render:
{activeTab === 'your-tab' && <YourComponent />}
```

### Add New Navigation Tab

**Navbar.jsx**:
```javascript
import YourIcon from '@mui/icons-material/YourIcon';

const tabs = [
  // ... existing tabs
  { id: 'your-tab', label: 'Your Tab', Icon: YourIcon },
];
```

**App.jsx**:
```jsx
// Update HeaderBar title
title={
  // ... existing conditions
  activeTab === 'your-tab' ? 'Your Tab Title' :
  'No-Code Data Analyst'
}

// Add tab section
{activeTab === 'your-tab' && <YourComponent />}
```

### Create New Backend Module

```python
# backend/your_module.py
from typing import Dict, List, Any
import json
from pathlib import Path

class YourClass:
    """Your class description."""
    
    def __init__(self, param: str):
        self.param = param
        self.storage_dir = Path("your_storage")
        self.storage_dir.mkdir(exist_ok=True)
    
    def your_method(self, data: Any) -> Dict[str, Any]:
        """
        Your method description.
        
        Args:
            data: Input data
            
        Returns:
            Result dictionary
        """
        # Your logic here
        return {"status": "success"}
    
    def save(self, filename: str, data: Dict[str, Any]):
        """Save data to JSON file."""
        filepath = self.storage_dir / f"{filename}.json"
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
    
    def load(self, filename: str) -> Dict[str, Any]:
        """Load data from JSON file."""
        filepath = self.storage_dir / f"{filename}.json"
        if not filepath.exists():
            return {}
        with open(filepath, 'r') as f:
            return json.load(f)
```

## 🐛 Debugging

### Backend Debugging

**Enable debug logging**:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Use FastAPI interactive docs**:
```
http://localhost:8000/docs
```

**Add breakpoint**:
```python
import pdb; pdb.set_trace()
```

### Frontend Debugging

**Console logs**:
```javascript
console.log('Debug:', variable);
console.error('Error:', error);
console.table(arrayData);
```

**React DevTools**: Install browser extension

**Network tab**: Check API calls in browser DevTools

## 📦 Building for Production

### Frontend Build
```powershell
cd frontend
npm run build
# Output: frontend/dist/
```

### Backend Production Server
```powershell
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 main:app
```

## 🔒 Security Checklist

- [ ] Never commit `.env` files
- [ ] Use environment variables for API keys
- [ ] Validate all user inputs
- [ ] Sanitize file uploads
- [ ] Set CORS to specific domains in production
- [ ] Enable rate limiting on endpoints
- [ ] Use HTTPS in production
- [ ] Keep dependencies updated
- [ ] Review widget embed security (API keys, domains)

## 📊 Key Files to Know

### Backend
- `main.py` (570+ lines) - All API endpoints
- `anomaly_detector.py` (246 lines) - Anomaly detection logic
- `workflow_engine.py` (398 lines) - Workflow automation
- `embed_widgets.py` (346 lines) - Widget embedding
- `requirements.txt` - Python dependencies

### Frontend
- `App.jsx` (230+ lines) - Main app routing and layout
- `Navbar.jsx` (68 lines) - Navigation with 7 tabs
- `Dashboard.jsx` - Main dashboard view
- `premium.css` (900+ lines) - Complete design system
- `vite.config.js` - Build config and proxies

## 🔗 Useful Commands

### Git
```powershell
git status
git add .
git commit -m "feat: your feature"
git push origin main
```

### Python Virtual Environment
```powershell
# Activate (Windows)
.\venv\Scripts\Activate.ps1

# Deactivate
deactivate
```

### npm
```powershell
npm install                # Install dependencies
npm run dev                # Start dev server
npm run build              # Production build
npm test                   # Run tests
npm update                 # Update packages
```

## 📚 Documentation

- **README.md** - Project overview and setup
- **COMPETITIVE_FEATURES.md** - Technical feature documentation
- **QUICKSTART_NEW_FEATURES.md** - User guide for new features
- **FEATURE_WALKTHROUGH.md** - Visual step-by-step guide
- **DEPLOYMENT.md** - Production deployment instructions
- **CONTRIBUTING.md** - Contribution guidelines
- **CHANGELOG.md** - Version history
- **This file** - Quick reference for developers

## 🎯 Common Patterns

### Async/Await in Backend
```python
async def your_async_function():
    result = await some_async_operation()
    return result
```

### State Management in React
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/endpoint');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

### Error Handling
```python
# Backend
try:
    result = process_data(data)
    return {"status": "success", "data": result}
except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))
except Exception as e:
    raise HTTPException(status_code=500, detail="Internal error")
```

```javascript
// Frontend
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Request failed');
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly message
}
```

## 💡 Tips

1. **Use premium.css classes** for consistent styling
2. **Follow PEP 8** for Python code
3. **Use React Hooks** (useState, useEffect) instead of class components
4. **Keep components small** (< 300 lines)
5. **Write docstrings** for all functions
6. **Test API endpoints** in `/docs` before frontend integration
7. **Check console** for errors during development
8. **Use git branches** for new features
9. **Update documentation** when adding features
10. **Review CONTRIBUTING.md** before submitting PRs

## 📞 Need Help?

- Check **README.md** for basic setup
- Read **COMPETITIVE_FEATURES.md** for technical details
- See **FEATURE_WALKTHROUGH.md** for UI/UX flows
- Review **CONTRIBUTING.md** for code style
- Check **DEPLOYMENT.md** for production issues

---

**Last Updated**: Version 3.0 (2024-01-15)
