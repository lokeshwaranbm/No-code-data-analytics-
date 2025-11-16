# 🚀 Complete Setup Guide - No-Code Data Analyst

This guide will walk you through setting up and running the No-Code Data Analyst prototype on Windows.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running the Application](#running-the-application)
5. [Testing the Application](#testing-the-application)
6. [Common Issues](#common-issues)

---

## Prerequisites

### Check if Python is installed:
```powershell
python --version
```
Should show Python 3.8 or higher. If not, download from https://www.python.org/downloads/

### Check if Node.js is installed:
```powershell
node --version
npm --version
```
Should show Node 16+ and npm 8+. If not, download from https://nodejs.org/

### Get OpenAI API Key:
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (you'll need it later)

---

## Backend Setup

### Step 1: Open PowerShell in the project directory
```powershell
cd d:\Nxtwave\No_Code_dataAnalyst
```

### Step 2: Navigate to backend folder
```powershell
cd backend
```

### Step 3: Create a Python virtual environment
```powershell
python -m venv venv
```
This creates a folder called `venv` with an isolated Python environment.

### Step 4: Activate the virtual environment
```powershell
.\venv\Scripts\Activate.ps1
```
Your terminal prompt should now show `(venv)` at the beginning.

**If you get an execution policy error**, run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 5: Install Python dependencies
```powershell
pip install -r requirements.txt
```
This installs Flask, pandas, OpenAI SDK, and other required libraries.

### Step 6: Configure environment variables
```powershell
copy .env.example .env
```

Now edit the `.env` file:
```powershell
notepad .env
```

Replace `your_openai_api_key_here` with your actual OpenAI API key:
```
OPENAI_API_KEY=sk-proj-abc123...
```
Save and close the file.

### Step 7: Verify backend setup (FastAPI)
```powershell
uvicorn main:app --reload --port 8000
```

You should see output like:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Will watch for changes in these directories: ['.../backend']
```

**Keep this terminal window open!** The backend server needs to stay running.

---

## Frontend Setup

### Step 1: Open a NEW PowerShell window
Don't close the backend terminal! Open a new one.

### Step 2: Navigate to the frontend folder
```powershell
cd d:\Nxtwave\No_Code_dataAnalyst\frontend
```

### Step 3: Install Node.js dependencies
```powershell
npm install
```
This downloads React, Vite, and other frontend libraries. It may take 1-2 minutes.

### Step 4: Start the development server
```powershell
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## Running the Application

### You should now have TWO terminal windows open:

**Terminal 1 (Backend - FastAPI):**
```
d:\Nxtwave\No_Code_dataAnalyst\backend
(venv) PS> uvicorn main:app --reload --port 8000
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Terminal 2 (Frontend):**
```
d:\Nxtwave\No_Code_dataAnalyst\frontend
PS> npm run dev
  ➜  Local:   http://localhost:3000/
```

### Access the application:
Open your browser and go to: **http://localhost:3000**

---

## Testing the Application

### Basic Test:
1. Open http://localhost:3000 in your browser
2. You should see "No-Code Data Analyst — Prototype" heading
3. Look for an "Upload CSV" section with a file input

### Upload Test (when backend is connected):
1. Prepare a small CSV file (or use a sample)
2. Click the file input button
3. Select your CSV file
4. Check the browser console (F12 → Console) for upload status

---

## Common Issues

### Issue: "cannot be loaded because running scripts is disabled"
**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Port 8000 or 3000 already in use
**Solution - Find and kill the process:**
```powershell
# For port 8000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# For port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Issue: `pip` not found
**Solution:**
```powershell
python -m pip install --upgrade pip
```

### Issue: `npm` not found
**Solution:** Reinstall Node.js from https://nodejs.org/ and restart your terminal

### Issue: CORS errors in browser
**Solution:** Make sure:
1. Backend is running on port 8000
2. Frontend is running on port 3000
3. You installed `flask-cors` (check `requirements.txt`)

### Issue: ModuleNotFoundError in Python
**Solution:**
```powershell
# Make sure venv is activated (you should see (venv) in prompt)
.\venv\Scripts\Activate.ps1

# Reinstall requirements
pip install -r requirements.txt
```

---

## Next Steps

Once both servers are running successfully:

1. **Test the upload endpoint** directly:
   ```powershell
   # In a third terminal
   curl -X POST -F "file=@test.csv" http://localhost:8000/upload
   ```

2. **Implement full data pipeline:**
   - Wire `data_cleaner.py` into the upload endpoint
   - Connect `eda_engine.py` to generate visualizations
   - Integrate `openai_summary.py` for AI insights

3. **Enhance the frontend:**
   - Display cleaning results
   - Show generated charts
   - Render AI insights in a nice UI

---

## Quick Reference Commands

### Backend (from `backend/` folder):
```powershell
# Activate environment
.\venv\Scripts\Activate.ps1

# Run server
python main.py

# Install new package
pip install package-name
pip freeze > requirements.txt
```

### Frontend (from `frontend/` folder):
```powershell
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Install new package
npm install package-name
```

### Stop servers:
Press `Ctrl + C` in each terminal window

---

## Need Help?

If you encounter issues not covered here:
1. Check error messages carefully
2. Verify all prerequisites are installed
3. Make sure you're in the correct directory
4. Ensure both backend and frontend are running
5. Check browser console (F12) for frontend errors
6. Check terminal output for backend errors
