# Contributing to No-Code Data Analytics

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

1. **Clear title** describing the problem
2. **Steps to reproduce** the issue
3. **Expected behavior** vs **actual behavior**
4. **Environment details**: OS, Python version, Node version, browser
5. **Screenshots or logs** if applicable

**Example**:
```
Title: Anomaly detection fails with non-numeric columns

Description:
When uploading a CSV with only string columns, the anomaly detector throws an error.

Steps to reproduce:
1. Upload a CSV with columns: name, city, country (all strings)
2. Click "Scan Now" on Anomaly Alerts card
3. Error appears in console

Expected: Should show message "No numeric columns for analysis"
Actual: Throws TypeError: unsupported operand type(s)

Environment:
- OS: Windows 11
- Python: 3.11.5
- Browser: Chrome 120
```

### Suggesting Features

Feature requests are welcome! Please create an issue with:

1. **Use case**: What problem does this solve?
2. **Proposed solution**: How should it work?
3. **Alternatives considered**: Other approaches you've thought about
4. **Competitive analysis**: Do competitors have this feature?

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following the code style guidelines below
4. **Test your changes** thoroughly
5. **Commit with clear messages**: `git commit -m "feat: add export to PDF feature"`
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Open a Pull Request** with a clear description

## 🎨 Code Style Guidelines

### Python (Backend)

Follow [PEP 8](https://pep8.org/) style guide:

```python
# Good
def detect_anomalies(data: pd.DataFrame, sensitivity: str = "medium") -> Dict[str, Any]:
    """
    Detect anomalies in the provided data.
    
    Args:
        data: DataFrame to analyze
        sensitivity: Detection sensitivity (low/medium/high)
        
    Returns:
        Dictionary containing detected anomalies
    """
    pass

# Bad
def DetectAnomalies(data,sensitivity="medium"):
    pass  # No docstring, inconsistent naming
```

**Key points**:
- Use `snake_case` for functions and variables
- Use `PascalCase` for classes
- Maximum line length: 100 characters
- Add type hints for function parameters and returns
- Write docstrings for all public functions and classes
- Use meaningful variable names

**Imports**:
```python
# Standard library imports
import os
import json
from datetime import datetime
from typing import Dict, List, Optional

# Third-party imports
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException

# Local imports
from data_cleaner import clean_data
from eda_engine import analyze_data
```

### JavaScript/React (Frontend)

Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript):

```javascript
// Good
const AnomalyAlerts = ({ originalFilename }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/anomalies/alerts/${originalFilename}`);
      const data = await response.json();
      setAlerts(data.alerts);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="anomaly-alerts-container">
      {/* Component JSX */}
    </div>
  );
};

// Bad
function anomalyalerts(props) {
  var alerts = [];  // Use const/let instead of var
  // No error handling
  fetch('/anomalies/alerts/' + props.originalFilename)
    .then(res => res.json())
    .then(data => alerts = data.alerts);
}
```

**Key points**:
- Use `PascalCase` for React components
- Use `camelCase` for functions and variables
- Use arrow functions for components
- Destructure props in function parameters
- Use `const` by default, `let` only when reassignment needed
- Always handle errors in async operations
- Use template literals for string interpolation

## 🧪 Testing Guidelines

### Backend Tests

Create tests in `backend/tests/`:

```python
# tests/test_anomaly_detector.py
import pytest
import pandas as pd
from anomaly_detector import AnomalyDetector

def test_statistical_anomalies():
    """Test detection of statistical outliers."""
    data = pd.DataFrame({
        'value': [10, 12, 11, 13, 100, 12, 11]  # 100 is outlier
    })
    
    detector = AnomalyDetector(sensitivity='medium')
    result = detector.detect_statistical_anomalies(data)
    
    assert 'value' in result
    assert len(result['value']) > 0
    assert 100 in result['value']['values']

def test_empty_dataframe():
    """Test handling of empty DataFrame."""
    data = pd.DataFrame()
    
    detector = AnomalyDetector()
    result = detector.run_full_analysis(data)
    
    assert result['anomaly_count'] == 0
```

Run tests:
```bash
cd backend
pytest tests/
```

### Frontend Tests

Create tests in `frontend/src/__tests__/`:

```javascript
// __tests__/AnomalyAlerts.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnomalyAlerts from '../components/AnomalyAlerts';

test('renders anomaly alerts card', () => {
  render(<AnomalyAlerts originalFilename="test.csv" />);
  expect(screen.getByText(/Anomaly Detection/i)).toBeInTheDocument();
});

test('fetches and displays alerts', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        alerts: [
          { column: 'price', severity: 'critical', count: 5 }
        ]
      })
    })
  );
  
  render(<AnomalyAlerts originalFilename="test.csv" />);
  
  await waitFor(() => {
    expect(screen.getByText(/price/i)).toBeInTheDocument();
  });
});
```

Run tests:
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
No-Code-Data-Analytics/
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── data_cleaner.py            # Data cleaning logic
│   ├── eda_engine.py              # Exploratory data analysis
│   ├── openai_summary.py          # AI insights generation
│   ├── anomaly_detector.py        # 🆕 Anomaly detection
│   ├── workflow_engine.py         # 🆕 Workflow automation
│   ├── embed_widgets.py           # 🆕 Widget embedding
│   ├── requirements.txt           # Python dependencies
│   └── tests/                     # Backend tests
│       ├── test_anomaly_detector.py
│       ├── test_workflow_engine.py
│       └── test_embed_widgets.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AnomalyAlerts.jsx  # 🆕 Anomaly alerts UI
│   │   │   ├── WorkflowBuilder.jsx # 🆕 Workflow builder
│   │   │   ├── EmbedWidgets.jsx   # 🆕 Widget manager
│   │   │   └── Notifications.jsx  # 🆕 Notifications center
│   │   ├── App.jsx
│   │   └── __tests__/             # Frontend tests
│   └── package.json
├── docs/
│   ├── COMPETITIVE_FEATURES.md    # Technical feature docs
│   ├── QUICKSTART_NEW_FEATURES.md # User guide
│   └── FEATURE_WALKTHROUGH.md     # Visual guide
├── DEPLOYMENT.md                   # Production deployment guide
├── CONTRIBUTING.md                 # This file
└── README.md                       # Project overview
```

## 🏗️ Development Workflow

### Setting Up Development Environment

1. **Clone the repository**:
```bash
git clone https://github.com/lokeshwaranbm/No-code-data-analytics-.git
cd No-code-data-analytics-
```

2. **Set up backend**:
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\Activate.ps1
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

3. **Set up frontend**:
```bash
cd frontend
npm install
```

4. **Create `.env` file**:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys
```

5. **Run development servers**:
```bash
# Terminal 1: Backend
cd backend
python main.py

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Making Changes

1. **Create a feature branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes and test**:
```bash
# Run backend tests
cd backend
pytest tests/

# Run frontend tests
cd frontend
npm test

# Manual testing
# Start both servers and test in browser
```

3. **Commit changes**:
```bash
git add .
git commit -m "feat: add your feature description"
```

**Commit message format**:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

4. **Push and create PR**:
```bash
git push origin feature/your-feature-name
# Then create Pull Request on GitHub
```

## 🎯 Areas for Contribution

### High Priority

1. **Performance Optimization**
   - Add caching for expensive operations
   - Implement pagination for large datasets
   - Optimize anomaly detection algorithms

2. **Testing**
   - Increase test coverage (current: ~30%, target: >80%)
   - Add integration tests
   - Add E2E tests with Playwright/Cypress

3. **Security**
   - Implement rate limiting on all endpoints
   - Add input validation and sanitization
   - Security audit of widget embedding system

4. **Documentation**
   - API documentation with OpenAPI/Swagger
   - Video tutorials
   - More code examples

### Medium Priority

1. **Features**
   - Export workflows as JSON templates
   - Workflow marketplace (share templates)
   - Real-time collaboration
   - Mobile-responsive improvements

2. **Integrations**
   - Slack/Teams notifications
   - Google Sheets import
   - Database connectors (PostgreSQL, MySQL)
   - Cloud storage (S3, Google Drive)

3. **UI/UX**
   - Dark mode improvements
   - Accessibility (WCAG 2.1 AA compliance)
   - Keyboard shortcuts
   - Internationalization (i18n)

### Low Priority (Nice to Have)

1. **Advanced Analytics**
   - Machine learning model training
   - Time series forecasting
   - Natural language queries

2. **Deployment**
   - Kubernetes deployment configs
   - Terraform scripts for cloud deployment
   - CI/CD pipeline improvements

3. **Monitoring**
   - Built-in analytics dashboard
   - Performance monitoring
   - User behavior tracking

## 🐛 Debugging Tips

### Backend Debugging

Enable debug logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

Use FastAPI interactive docs:
```
http://localhost:8000/docs
```

Debug specific endpoint:
```python
@app.post("/anomalies/detect")
async def detect_anomalies(...):
    import pdb; pdb.set_trace()  # Add breakpoint
    # Your code here
```

### Frontend Debugging

Use React DevTools browser extension

Add console logs:
```javascript
const fetchAlerts = async () => {
  console.log('Fetching alerts for:', originalFilename);
  try {
    const response = await fetch(url);
    console.log('Response:', response);
    const data = await response.json();
    console.log('Data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 📖 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Git Commit Message Convention](https://www.conventionalcommits.org/)

## 💬 Communication

- **GitHub Issues**: For bugs, features, and discussions
- **Pull Requests**: For code contributions
- **Discussions**: For general questions and ideas

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on what is best for the community

## 🙏 Recognition

Contributors will be recognized in:
- `CONTRIBUTORS.md` file
- Release notes
- Project README

Thank you for contributing! 🎉
