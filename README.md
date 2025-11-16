# No-Code Data Analyst - Premium UI Edition

A visually stunning, professional-grade data analysis platform with glassmorphic design, gradient effects, and AI-powered insights.

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Premium Features

### 🎨 Visual Design
- **Glassmorphism Effects**: Frosted glass design with backdrop blur and translucency
- **Gradient Overlays**: Beautiful gradients on buttons, hero sections, and UI elements
- **Smooth Animations**: Fade-in, slide-in, and bounce animations throughout
- **Micro-interactions**: Hover effects, scale transforms, and glow effects
- **Premium Shadows**: Multi-layered shadows for depth and elevation

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

## 📁 Project Structure

```
/frontend
 ├── src/
 │   ├── components/
 │   │   ├── FileUpload.jsx      # CSV file upload component
 │   │   ├── Charts.jsx           # Data visualization component
 │   │   └── InsightsCard.jsx     # AI-generated insights display
 │   ├── App.jsx                  # Main application component
 │   ├── api.js                   # Backend API client
 │   └── main.jsx                 # React entry point
 ├── index.html                   # HTML template
 ├── vite.config.js              # Vite configuration
 └── package.json                # Frontend dependencies

/backend
 ├── main.py                     # FastAPI server (uvicorn entry)
 ├── data_cleaner.py             # Data cleaning utilities
 ├── eda_engine.py               # Exploratory data analysis
 ├── openai_summary.py           # OpenAI insights generator
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

1. Open your browser and go to `http://localhost:3000`
2. Click the file upload button and select a CSV file
3. The system will:
   - Clean the data (handle missing values, duplicates)
   - Perform exploratory data analysis
   - Generate visualizations
   - Create AI-powered insights using OpenAI

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

## 🛠️ Troubleshooting

**Backend won't start:**
- Ensure virtual environment is activated
- Check that port 8000 is not in use
- Verify all dependencies are installed

**Frontend won't start:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -r node_modules; npm install`
- Check that port 3000 is available

**CORS errors:**
- Backend uses FastAPI CORSMiddleware (enabled for all origins in dev)
- Vite is configured to proxy `/upload` requests to backend

## 📄 License

This is a prototype project for educational purposes.
