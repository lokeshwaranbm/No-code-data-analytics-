# No-Code Data Analyst - Premium Edition with Advanced Automation

A visually stunning, professional-grade data analysis platform with glassmorphic design, AI-powered insights, **real-time anomaly detection**, **workflow automation**, and **embeddable analytics widgets**.

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![AI](https://img.shields.io/badge/AI-Powered-purple)
![Automation](https://img.shields.io/badge/Automation-Enabled-orange)

## 🚀 Competitive Advantages

### Why Choose Us Over Julius, Akkio, Polymer, Power BI, or Tableau?

| Feature | This Platform | Competitors |
|---------|--------------|-------------|
| **Real-time Anomaly Alerts** | ✅ Multi-method detection | ❌ None or manual only |
| **Visual Workflow Builder** | ✅ Drag-and-drop automation | ❌ No automation or complex setup |
| **Embeddable Widgets** | ✅ Free with full customization | ❌ None or paid enterprise feature |
| **AI Chat** | ✅ Multi-provider (Groq, Gemini, OpenAI) | ⚠️ Limited or add-on |
| **No-Code Setup** | ✅ Works out of the box | ⚠️ Varies |

---

## 🌟 Premium Features

### 🎨 Visual Design
- **Glassmorphism Effects**: Frosted glass design with backdrop blur and translucency
- **Gradient Overlays**: Beautiful gradients on buttons, hero sections, and UI elements
- **Smooth Animations**: Fade-in, slide-in, and bounce animations throughout
- **Micro-interactions**: Hover effects, scale transforms, and glow effects
- **Premium Shadows**: Multi-layered shadows for depth and elevation

### 🔔 Real-Time Anomaly Detection (NEW!)
- **Multi-Method Detection**: Z-score, IQR, sudden changes, missing data patterns
- **Severity Levels**: High/Medium/Low with color-coded alerts
- **Adjustable Sensitivity**: Low, medium, high detection thresholds
- **Automatic Scanning**: Runs on data upload or on-demand
- **Historical Tracking**: View all past anomalies with timestamps

### 🌳 Workflow Automation (NEW!)
- **Visual Builder**: Drag-and-drop action chaining
- **7 Action Types**: Clean, analyze, chart, detect anomalies, alert, export, archive
- **5 Trigger Types**: Manual, scheduled (cron), on upload, on anomaly, threshold-based
- **Execution History**: Track runs, status, and results
- **One-Click Execution**: Run complex pipelines instantly

### 🧩 Embeddable Widgets (NEW!)
- **6 Widget Types**: Charts, stats cards, tables, dashboards, live metrics, AI chat
- **Security Controls**: API keys, domain whitelisting, rate limiting, expiration
- **Full Customization**: Colors, fonts, borders, dark mode
- **Code Generation**: Auto-generate HTML or React embed code
- **View Analytics**: Track widget usage and engagement

### 🎯 User Experience
- **Hero Section**: Eye-catching landing with gradient background and clear CTAs
- **Feature Cards**: Showcase key capabilities with icons and descriptions
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark/Light Themes**: Seamless theme switching with persistent preferences
- **Loading States**: Elegant skeleton screens and gradient spinners

### 📊 Data Analysis
- **Auto Data Cleaning**: Handles missing values, outliers, and duplicates
- **AI-Powered Insights**: Multi-provider AI (GPT-4, Groq Llama, Google Gemini)
- **Interactive Charts**: Auto-generated Plotly visualizations
- **PDF Reports**: Professional downloadable reports with tables
- **Natural Language Queries**: Ask questions about your data in plain English
- **Live AI Chat**: Real-time Q&A with context-aware responses
- **Chat History**: Export and manage all conversations

---

## 📁 Project Structure

```
/frontend
 ├── src/
 │   ├── components/
 │   │   ├── FileUpload.jsx          # CSV file upload component
 │   │   ├── Charts.jsx               # Data visualization component
 │   │   ├── InsightsCard.jsx         # AI-generated insights display
 │   │   ├── LiveAIChat.jsx           # Real-time AI chat interface
 │   │   ├── ChatHistory.jsx          # Conversation history viewer
 │   │   ├── AnomalyAlerts.jsx        # 🆕 Real-time anomaly detection
 │   │   ├── WorkflowBuilder.jsx      # 🆕 Visual automation builder
 │   │   ├── EmbedWidgets.jsx         # 🆕 Embeddable widget manager
 │   │   └── Notifications.jsx        # 🆕 Alert notification center
 │   ├── App.jsx                      # Main application component
 │   ├── api.js                       # Backend API client
 │   └── main.jsx                     # React entry point
 ├── index.html                       # HTML template
 ├── vite.config.js                  # Vite configuration
 └── package.json                    # Frontend dependencies

/backend
 ├── main.py                         # FastAPI server (uvicorn entry)
 ├── data_cleaner.py                 # Data cleaning utilities
 ├── eda_engine.py                   # Exploratory data analysis
 ├── openai_summary.py               # OpenAI insights generator
 ├── chat_handler.py                 # AI chat response system
 ├── chat_history.py                 # Conversation persistence
 ├── anomaly_detector.py             # 🆕 Multi-method anomaly detection
 ├── workflow_engine.py              # 🆕 Automation orchestration
 ├── embed_widgets.py                # 🆕 Widget management & security
 ├── requirements.txt            # Python dependencies
 ├── .env.example               # Environment variables template
 └── uploads/                    # Uploaded CSV storage
```

## 🚀 Quick Start Guide

### Prerequisites

- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- **OpenAI API Key** (get one at https://platform.openai.com/api-keys)

### Backend Setup (FastAPI)

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. **Install Python dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```powershell
   copy .env.example .env
   ```
   Then edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

5. **Run the FastAPI backend:**
   ```powershell
   uvicorn main:app --reload --port 8000
   ```
   Backend will start on `http://localhost:8000`

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```powershell
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```powershell
   npm install
   ```

3. **Start the development server:**
   ```powershell
   npm run dev
   ```
   Frontend will start on `http://localhost:3000`

## 📝 Usage

### Basic Data Analysis
1. Open your browser and go to `http://localhost:3000`
2. Click the file upload button and select a CSV file
3. The system will:
   - Clean the data (handle missing values, duplicates)
   - Perform exploratory data analysis
   - Generate visualizations
   - Create AI-powered insights using OpenAI
   - **Automatically scan for anomalies** (check the Anomaly Alerts card below your charts)

### Using New Features

#### 🔔 Real-Time Anomaly Detection
1. Upload your data on the Dashboard
2. The **Anomaly Alerts** card appears automatically below charts
3. Click "Scan Now" to run comprehensive anomaly detection
4. Review detected issues by severity (critical/warning/info)
5. Expand any anomaly to see details: affected column, values, normal range

#### 🌳 Workflow Automation
1. Navigate to the **Workflows** tab
2. Click "New Workflow" button
3. Configure your automation:
   - Name your workflow
   - Select a trigger (Manual, Schedule, Data Upload, Anomaly, Threshold)
   - Add actions (Clean Data, Run Analysis, Generate Chart, Check Anomalies, Send Alert, Export Report, Archive Data)
4. Click "Create Workflow"
5. Run workflows manually with the ▶️ button or let triggers execute them automatically

#### 🧩 Embeddable Widgets
1. Navigate to the **Widgets** tab
2. Click "New Widget" button
3. Configure your widget:
   - Choose widget type (Chart, Stats Card, Data Table, Dashboard, Live Metrics, AI Chat)
   - Set allowed domains (comma-separated, or * for all)
   - Configure rate limit
4. Click "Create Widget"
5. Click "</> Get Embed Code" to copy HTML or React code
6. Paste the code into your website or application

#### 🔔 Notifications
1. Navigate to the **Alerts** tab
2. View all system notifications (workflow runs, anomaly detections, system events)
3. Mark all as read/unread or clear notifications
4. Delete individual notifications

## 🔧 Development

### Backend Development
- Main API endpoint: `POST /upload`
- Modify `data_cleaner.py` for custom cleaning logic
- Edit `eda_engine.py` to add more visualizations
- Update `openai_summary.py` to customize AI insights

### Frontend Development
- React components in `frontend/src/components/`
- API calls managed in `frontend/src/api.js`
- Vite handles hot module replacement for fast development

### Testing New Features

#### Test Anomaly Detection
```bash
# Using curl (Windows PowerShell)
curl -X POST http://localhost:8000/anomalies/detect `
  -F "file=@path/to/your/data.csv" `
  -F "sensitivity=medium"

# Get saved alerts
curl http://localhost:8000/anomalies/alerts/your_filename.csv
```

#### Test Workflow Automation
```bash
# Create a workflow
curl -X POST http://localhost:8000/workflows/create `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Test Workflow",
    "description": "Automated data pipeline",
    "trigger": {"type": "schedule", "cron": "0 9 * * *"},
    "actions": [
      {"action_type": "clean_data", "params": {"filename": "data.csv"}},
      {"action_type": "run_analysis", "params": {"filename": "data.csv"}}
    ]
  }'

# List workflows
curl http://localhost:8000/workflows

# Execute a workflow
curl -X POST http://localhost:8000/workflows/{workflow_id}/execute
```

#### Test Embeddable Widgets
```bash
# Create a widget
curl -X POST http://localhost:8000/widgets/create `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Sales Dashboard",
    "widget_type": "dashboard",
    "config": {"filename": "sales.csv"},
    "allowed_domains": ["mywebsite.com"],
    "rate_limit": 100
  }'

# Get embed code
curl http://localhost:8000/widgets/{widget_id}/embed?format=html
```

## 📦 Building for Production

### Frontend
```powershell
cd frontend
npm run build
```
Built files will be in `frontend/dist/`

### Backend
For production, use a WSGI server like Gunicorn:
```powershell
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

## 📚 API Documentation

The application provides a comprehensive REST API. Key endpoints:

### Core Data Analysis
- `POST /upload` - Upload and analyze CSV files

### 🔔 Anomaly Detection
- `POST /anomalies/detect` - Detect anomalies in uploaded data
- `GET /anomalies/alerts/{filename}` - Get saved anomaly alerts
- `DELETE /anomalies/alerts/{filename}` - Clear alerts for a file

### 🌳 Workflow Automation
- `POST /workflows/create` - Create a new workflow
- `GET /workflows` - List all workflows
- `GET /workflows/{id}` - Get workflow details
- `POST /workflows/{id}/execute` - Execute a workflow
- `DELETE /workflows/{id}` - Delete a workflow

### 🧩 Embeddable Widgets
- `POST /widgets/create` - Create an embeddable widget
- `GET /widgets` - List all widgets
- `GET /widgets/{id}` - Get widget details
- `GET /widgets/{id}/embed` - Get embed code (HTML/React)
- `PUT /widgets/{id}` - Update widget configuration
- `DELETE /widgets/{id}` - Delete a widget
- `GET /api/embed/{id}` - Serve widget content (public iframe endpoint)

For detailed API documentation with request/response examples, see [COMPETITIVE_FEATURES.md](COMPETITIVE_FEATURES.md) and [QUICKSTART_NEW_FEATURES.md](QUICKSTART_NEW_FEATURES.md).

## 🛠️ Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure virtual environment is activated
- Check that port 8000 is not in use
- Verify all dependencies are installed
- Ensure `scipy` is installed for anomaly detection

**Frontend won't start:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -r node_modules; npm install`
- Check that port 3000 is available

**CORS errors:**
- Backend uses FastAPI CORSMiddleware (enabled for all origins in dev)
- Vite is configured to proxy `/upload`, `/anomalies`, `/workflows`, `/widgets`, `/api` requests to backend

**Anomaly Detection not working:**
- Ensure your CSV file has numeric columns for statistical analysis
- Check `backend/anomaly_alerts/` directory exists and is writable
- Verify sensitivity setting (try 'low' if nothing detected, 'high' if too many false positives)

**Workflows not executing:**
- Check workflow status in the Workflows tab
- Verify actions have required parameters (e.g., filename)
- Review workflow execution history for error messages
- Ensure scheduled workflows have valid cron syntax

**Widget embed not loading:**
- Verify the widget API key is correct in the embed code
- Check if your domain is in the widget's allowed_domains list
- Ensure the widget hasn't expired (check expires_at field)
- Check browser console for CORS or authentication errors
- Verify rate limit hasn't been exceeded

**Notifications not appearing:**
- Check localStorage in browser dev tools (key: 'notifications')
- Clear browser cache and reload
- Verify Notifications component is imported in App.jsx

## 📄 License

This is a prototype project for educational purposes.
