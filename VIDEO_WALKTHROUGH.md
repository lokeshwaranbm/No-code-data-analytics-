# 🎥 Video Walkthrough Guide - New Features

**Platform**: No-Code Data Analytics  
**Version**: 3.0  
**Duration**: ~15 minutes  
**Difficulty**: Beginner-Friendly

---

## 📋 What You'll Learn

This walkthrough covers the **3 new competitive features** that make this platform unique:

1. **Real-Time Anomaly Detection** - Automatically detect data quality issues
2. **Workflow Automation** - Build automated data pipelines without coding
3. **Embeddable Widgets** - Share analytics on any website with secure embed codes

---

## 🎬 Scene 1: Getting Started (2 minutes)

### Setup
1. **Open Two Terminals**

**Terminal 1 - Backend:**
```powershell
cd D:\Nxtwave\No_Code_dataAnalyst\backend
.\venv\Scripts\Activate.ps1
python main.py
```
✅ You should see: `Uvicorn running on http://127.0.0.1:8000`

**Terminal 2 - Frontend:**
```powershell
cd D:\Nxtwave\No_Code_dataAnalyst\frontend
npm run dev
```
✅ You should see: `Local: http://localhost:3000/`

### Navigation Tour
2. **Open Browser** → http://localhost:3000

3. **Notice the 7 Navigation Tabs** (at the top):
   - 📊 **Dashboard** - Main data upload and analysis
   - 📈 **Reports** - View generated reports
   - 🤖 **Ask AI** - Chat with AI about your data
   - 🌳 **Workflows** - 🆕 Automation builder
   - 🧩 **Widgets** - 🆕 Create embeddable analytics
   - 🔔 **Alerts** - 🆕 Notification center
   - ⚙️ **Settings** - Configure preferences

---

## 🎬 Scene 2: Real-Time Anomaly Detection (4 minutes)

### What It Does
Automatically scans your data for:
- Statistical outliers (values far from normal)
- Sudden spikes or drops
- Missing data patterns
- Duplicate records

### Step-by-Step Demo

**Step 1: Upload Sample Data**
1. Click **Dashboard** tab
2. Click **"Choose File"** button
3. Select a CSV file (e.g., sales data with 1000+ rows)
4. Click **"Upload and Analyze"**

**Step 2: Watch Auto-Detection**
5. After upload, scroll down below your charts
6. You'll see a new card: **"🔔 Anomaly Detection Alerts"**
7. Notice the badge showing anomaly count (e.g., "3 anomalies detected")

**Step 3: View Detected Anomalies**
8. Click **"▼ Expand"** to open the alerts card
9. See anomalies grouped by severity:
   - 🔴 **Critical** (red) - Major issues requiring immediate attention
   - 🟡 **Warning** (yellow) - Moderate issues to review
   - 🔵 **Info** (blue) - Minor observations

**Step 4: Inspect Details**
10. Each anomaly shows:
    - **Column Name** - Which field has the issue
    - **Type** - Statistical outlier, sudden change, missing data, etc.
    - **Count** - How many anomalies found
    - **Sample Values** - Examples of problematic data
    - **Normal Range** - Expected values for comparison

**Example Output:**
```
🔴 CRITICAL
Column: price
Type: Statistical Outliers
Count: 5 anomalies
Sample Values: [9999, 8888, 10000]
Normal Range: $10 - $500
Description: Values significantly deviate from the normal distribution
```

**Step 5: Run Manual Scan**
11. Click **"🔍 Scan Now"** button to re-analyze with different sensitivity
12. Click **"🗑️ Clear Alerts"** to remove all alerts

### Use Cases
- **E-commerce**: Detect fraudulent transactions (unusually high amounts)
- **IoT Sensors**: Find malfunctioning sensors (impossible readings)
- **Sales Data**: Spot data entry errors (duplicate orders, missing dates)
- **Financial**: Identify suspicious patterns before they become problems

### API Usage (Optional - For Developers)
```powershell
# Detect anomalies via API
curl -X POST http://localhost:8000/anomalies/detect `
  -F "file=@sales_data.csv" `
  -F "sensitivity=high"

# Get saved alerts
curl http://localhost:8000/anomalies/alerts/sales_data.csv

# Clear alerts
curl -X DELETE http://localhost:8000/anomalies/alerts/sales_data.csv
```

---

## 🎬 Scene 3: Workflow Automation (5 minutes)

### What It Does
Create automated pipelines that run on:
- **Schedule** (e.g., every day at 9 AM)
- **Manual trigger** (run on demand)
- **Data upload** (when new file is uploaded)
- **Anomaly detection** (when issues are found)
- **Threshold** (when metric crosses a value)

### Step-by-Step Demo

**Step 1: Navigate to Workflows**
1. Click **"🌳 Workflows"** tab in navigation
2. You'll see the Workflow Management page

**Step 2: Create Your First Workflow**
3. Click **"+ New Workflow"** button
4. A builder form appears

**Step 3: Configure Workflow Details**
5. **Name**: Enter "Daily Sales Report"
6. **Description**: "Clean data, analyze, and generate chart every morning"
7. **Trigger**: Select **"Schedule"** from dropdown
8. **Cron Expression**: Enter `0 9 * * *` (runs at 9:00 AM daily)

**Cron Syntax Quick Reference:**
```
* * * * *
│ │ │ │ │
│ │ │ │ └─ Day of week (0-7, 0=Sunday)
│ │ │ └─── Month (1-12)
│ │ └───── Day of month (1-31)
│ └─────── Hour (0-23)
└───────── Minute (0-59)

Examples:
0 9 * * *     → Every day at 9:00 AM
0 */2 * * *   → Every 2 hours
0 0 * * 1     → Every Monday at midnight
0 0 1 * *     → First day of every month
```

**Step 4: Add Actions (Build the Pipeline)**
9. Click **"+ Add Action"** button

**Action 1: Clean Data**
- **Action Type**: Select "Clean Data"
- Click **"Add Action"** again

**Action 2: Run Analysis**
- **Action Type**: Select "Run Analysis"
- Click **"Add Action"** again

**Action 3: Generate Chart**
- **Action Type**: Select "Generate Chart"

10. You now have a 3-step pipeline: Clean → Analyze → Chart

**Step 5: Create the Workflow**
11. Click **"Create Workflow"** button
12. Your workflow appears in the list

**Step 6: Test Manual Execution**
13. Find your workflow card
14. Click **"▶️ Run"** button
15. Watch the status change:
    - ⏳ **Pending** → Running
    - ⚙️ **Running** → Processing
    - ✅ **Completed** → Success

**Step 7: View Workflow Details**
16. Each workflow card shows:
    - **Name & Description**
    - **Status** with color-coded icon
    - **Trigger Type** (badge)
    - **Action Count** (e.g., "3 actions")
    - **Run Count** (execution history)
    - **Last Run** (timestamp)

### Available Actions (7 Types)

| Action | What It Does | Example Use |
|--------|--------------|-------------|
| **Clean Data** | Remove duplicates, handle missing values | Data preparation |
| **Run Analysis** | Generate statistics and insights | EDA pipeline |
| **Generate Chart** | Create visualizations | Auto-reporting |
| **Check Anomalies** | Scan for data quality issues | Quality monitoring |
| **Send Alert** | Notify via webhook/email | Error notifications |
| **Export Report** | Save analysis as PDF/CSV | Scheduled exports |
| **Archive Data** | Move old data to archive | Data management |

### Available Triggers (5 Types)

| Trigger | When It Runs | Example Use |
|---------|--------------|-------------|
| **Manual** | When you click "Run" | On-demand processing |
| **Schedule** | At specified times (cron) | Daily/weekly reports |
| **Data Upload** | When new file is uploaded | Auto-processing new data |
| **Anomaly Detected** | When issues are found | Alert workflows |
| **Threshold** | When metric exceeds limit | Monitoring dashboards |

### Real-World Workflow Examples

**Example 1: Morning Data Pipeline**
```
Trigger: Schedule (0 9 * * *)
Actions:
1. Clean Data → Remove duplicates from overnight sales
2. Run Analysis → Calculate daily metrics
3. Check Anomalies → Find any issues
4. Generate Chart → Create dashboard
5. Export Report → Save to shared folder
```

**Example 2: Anomaly Response**
```
Trigger: Anomaly Detected
Actions:
1. Check Anomalies → Confirm severity
2. Send Alert → Notify team via Slack
3. Archive Data → Save problematic records
```

**Example 3: Monthly Archive**
```
Trigger: Schedule (0 0 1 * *)
Actions:
1. Export Report → Generate month-end summary
2. Archive Data → Move to historical storage
```

**Step 8: Delete a Workflow**
17. Click **"🗑️ Delete"** button on any workflow
18. Confirm deletion

### API Usage (Optional - For Developers)
```powershell
# Create workflow
curl -X POST http://localhost:8000/workflows/create `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Daily Pipeline",
    "description": "Automated daily processing",
    "trigger": {"type": "schedule", "cron": "0 9 * * *"},
    "actions": [
      {"action_type": "clean_data", "params": {"filename": "data.csv"}},
      {"action_type": "run_analysis", "params": {"filename": "data.csv"}}
    ]
  }'

# List all workflows
curl http://localhost:8000/workflows

# Execute workflow
curl -X POST http://localhost:8000/workflows/{workflow_id}/execute
```

---

## 🎬 Scene 4: Embeddable Widgets (4 minutes)

### What It Does
Create secure, customizable analytics widgets that you can embed on:
- Your company website
- Customer portals
- Internal dashboards
- Blog posts
- Documentation pages

### Step-by-Step Demo

**Step 1: Navigate to Widgets**
1. Click **"🧩 Widgets"** tab in navigation
2. You'll see the Widget Management page

**Step 2: Create Your First Widget**
3. Click **"+ New Widget"** button
4. A builder form appears

**Step 3: Configure Widget**
5. **Name**: Enter "Sales Dashboard"
6. **Type**: Select from dropdown:
   - **Chart** - Single visualization
   - **Stats Card** - Key metrics display
   - **Data Table** - Interactive table
   - **Dashboard** - Multiple charts
   - **Live Metrics** - Real-time numbers
   - **AI Chat** - Embedded chat interface

7. **Allowed Domains**: Enter domains that can embed this widget
   - Single domain: `mywebsite.com`
   - Multiple domains: `site1.com,site2.com,site3.com`
   - All domains: `*` (not recommended for production)

8. **Rate Limit**: Set requests per hour (e.g., `100`)

**Step 4: Create Widget**
9. Click **"Create Widget"** button
10. Your widget appears in the list

**Step 5: Get Embed Code**
11. Find your widget card
12. Click **"</> Get Embed Code"** button
13. A code panel appears with two tabs:

**Tab 1: HTML (For Static Websites)**
```html
<iframe 
  src="http://localhost:8000/api/embed/widget_ABC123?apiKey=XYZ789&origin=mywebsite.com"
  width="100%" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</iframe>

<script>
// Auto-resize iframe to content
window.addEventListener('message', function(e) {
  if (e.data.type === 'resize') {
    document.querySelector('iframe').style.height = e.data.height + 'px';
  }
});
</script>
```

**Tab 2: React (For React Apps)**
```jsx
import React from 'react';

const SalesDashboard = () => {
  return (
    <iframe
      src="http://localhost:8000/api/embed/widget_ABC123?apiKey=XYZ789&origin=mywebsite.com"
      width="100%"
      height="600"
      frameBorder="0"
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    />
  );
};

export default SalesDashboard;
```

**Step 6: Copy Code**
14. Click **"📋 Copy"** button
15. Paste code into your website

**Step 7: View Widget Details**
16. Each widget card shows:
    - **Name** & **Type** (badge)
    - **Status**: Active 🟢 or Disabled 🔴
    - **View Count**: Number of embeds loaded
    - **Created**: Timestamp

**Step 8: Delete a Widget**
17. Click **"🗑️ Delete"** button on any widget
18. Confirm deletion

### Security Features

**1. API Key Authentication**
- Each widget has a unique API key
- Keys are validated on every request
- Regenerate keys anytime for security

**2. Domain Whitelist**
- Only allowed domains can embed the widget
- Prevents unauthorized usage
- Update list anytime

**3. Rate Limiting**
- Prevents abuse and overuse
- Configurable per widget
- Returns 429 error when exceeded

**4. Expiration (Optional)**
- Set widgets to expire after a date
- Useful for temporary demos
- Automatically blocks access after expiration

### Widget Types Explained

| Type | Best For | Features |
|------|----------|----------|
| **Chart** | Single visualization | Line, bar, pie, scatter plots |
| **Stats Card** | KPIs and metrics | Big numbers, comparisons, trends |
| **Data Table** | Raw data display | Sortable, filterable, paginated |
| **Dashboard** | Multiple widgets | Full analytics view |
| **Live Metrics** | Real-time data | Auto-refreshing numbers |
| **AI Chat** | Interactive Q&A | Embedded chat interface |

### Customization Options

**Theme Settings** (configured in backend):
```python
theme = WidgetTheme(
    primary_color="#667eea",
    background_color="#ffffff",
    text_color="#2d3748",
    border_radius="12px",
    font_family="Inter, sans-serif",
    shadow="0 4px 12px rgba(0,0,0,0.1)",
    dark_mode=False
)
```

### Real-World Use Cases

**Example 1: Public Website**
```html
<!-- Embed sales dashboard on homepage -->
<div class="analytics-section">
  <h2>Our Growth</h2>
  <iframe src="[widget-url]" width="100%" height="400"></iframe>
</div>
```

**Example 2: Customer Portal**
```html
<!-- Show customer-specific metrics -->
<iframe src="[widget-url]?customer_id=123" width="100%" height="300"></iframe>
```

**Example 3: Documentation**
```markdown
# API Performance Metrics

<iframe src="[widget-url]" width="100%" height="500"></iframe>
```

### API Usage (Optional - For Developers)
```powershell
# Create widget
curl -X POST http://localhost:8000/widgets/create `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Sales Chart",
    "widget_type": "chart",
    "config": {"chart_type": "bar"},
    "allowed_domains": ["mywebsite.com"],
    "rate_limit": 100
  }'

# Get embed code
curl http://localhost:8000/widgets/{widget_id}/embed?format=html

# Get React code
curl http://localhost:8000/widgets/{widget_id}/embed?format=react
```

---

## 🎬 Scene 5: Notifications Center (2 minutes)

### Step-by-Step Demo

**Step 1: Navigate to Alerts**
1. Click **"🔔 Alerts"** tab in navigation

**Step 2: View Notifications**
2. See all system notifications in timeline view:
   - Workflow executions (success/failure)
   - Anomaly detections
   - System events
   - Custom alerts

**Step 3: Test Notifications**
3. Click **"Add Test Notification"** buttons:
   - **Info** (blue) - General information
   - **Success** (green) - Completed actions
   - **Warning** (yellow) - Important notices
   - **Error** (red) - Failed operations

**Step 4: Manage Notifications**
4. Click **"Mark All as Read"** to clear unread status
5. Click **"Mark All as Unread"** to mark all
6. Click **"Clear All"** to delete all notifications
7. Click **"🗑️"** on individual notification to delete

**Step 5: Check Unread Count**
8. Notice the badge on "Alerts" tab shows unread count

---

## 🎬 Scene 6: Integration Demo (2 minutes)

### See Features Working Together

**Scenario: Daily Sales Pipeline with Anomaly Monitoring**

**Step 1: Upload Sales Data**
1. Go to **Dashboard**
2. Upload `sales_data.csv`
3. Anomaly Alerts appear automatically

**Step 2: Create Monitoring Workflow**
4. Go to **Workflows**
5. Create workflow: "Sales Monitor"
   - Trigger: Data Upload
   - Actions: Check Anomalies → Send Alert

**Step 3: Create Dashboard Widget**
6. Go to **Widgets**
7. Create widget: "Sales Dashboard"
   - Type: Dashboard
   - Domains: `mycompany.com`
8. Copy embed code

**Step 4: Check Notifications**
9. Go to **Alerts**
10. See notifications from:
    - Anomaly detection scan
    - Workflow execution
    - Widget creation

**Result**: You now have an automated system that:
- ✅ Detects data issues automatically
- ✅ Runs workflows when data is uploaded
- ✅ Sends alerts for important events
- ✅ Provides embeddable dashboard for your website

---

## 📊 Quick Reference Card

### Keyboard Shortcuts
- **Ctrl + U** - Upload file (on Dashboard)
- **Tab** - Navigate between fields in forms
- **Enter** - Submit forms
- **Esc** - Close modals/panels

### Status Icons
- ⏳ **Pending** - Workflow queued
- ⚙️ **Running** - Workflow executing
- ✅ **Completed** - Workflow succeeded
- ❌ **Failed** - Workflow errored
- ⏸️ **Paused** - Workflow suspended

### Severity Badges
- 🔴 **Critical** - Immediate action required
- 🟡 **Warning** - Review recommended
- 🔵 **Info** - For your information

### API Endpoints Quick List
```
Anomalies:
POST   /anomalies/detect
GET    /anomalies/alerts/{filename}
DELETE /anomalies/alerts/{filename}

Workflows:
POST   /workflows/create
GET    /workflows
POST   /workflows/{id}/execute
DELETE /workflows/{id}

Widgets:
POST   /widgets/create
GET    /widgets
GET    /widgets/{id}/embed
DELETE /widgets/{id}
```

---

## 🎯 Practice Exercises

### Exercise 1: Anomaly Detection (5 min)
1. Find or create a CSV with some outliers
2. Upload to Dashboard
3. Review detected anomalies
4. Understand why each was flagged

### Exercise 2: Simple Workflow (10 min)
1. Create a manual workflow
2. Add 3 actions: Clean → Analyze → Chart
3. Run the workflow
4. Check the execution status

### Exercise 3: Schedule Workflow (10 min)
1. Create a scheduled workflow (runs every hour)
2. Set cron: `0 * * * *`
3. Add actions for data processing
4. Monitor in Alerts tab

### Exercise 4: Widget Embedding (15 min)
1. Create a Chart widget
2. Set allowed domains to `localhost`
3. Copy HTML embed code
4. Create a simple HTML file and test
5. Verify it loads correctly

### Exercise 5: Full Pipeline (20 min)
1. Upload sample data
2. Create workflow triggered by anomaly detection
3. Create dashboard widget showing results
4. Test the entire flow
5. Check notifications for all events

---

## 🐛 Troubleshooting

### Anomaly Detection Not Working
- ✅ Check if CSV has numeric columns
- ✅ Verify backend is running (port 8000)
- ✅ Check browser console for errors
- ✅ Try different sensitivity (low/medium/high)

### Workflow Not Executing
- ✅ Verify workflow status (should be "pending" or "running")
- ✅ Check cron syntax for scheduled workflows
- ✅ Ensure actions have required parameters
- ✅ Review browser console and backend logs

### Widget Not Loading
- ✅ Verify API key is correct in embed code
- ✅ Check domain is in allowed_domains list
- ✅ Ensure rate limit not exceeded
- ✅ Check CORS settings in browser console

### Frontend Not Starting (Exit Code 1)
- ✅ Delete `node_modules` folder
- ✅ Run `npm install` again
- ✅ Check for port conflicts (3000)
- ✅ Clear npm cache: `npm cache clean --force`

---

## 📚 Additional Resources

### Documentation
- **README.md** - Project overview
- **COMPETITIVE_FEATURES.md** - Technical specifications
- **QUICKSTART_NEW_FEATURES.md** - Getting started guide
- **DEPLOYMENT.md** - Production deployment
- **DEV_REFERENCE.md** - Developer quick reference

### API Documentation
- Open browser: http://localhost:8000/docs
- Interactive API testing interface
- Try endpoints directly in browser

### Support
- **GitHub Issues** - Report bugs or request features
- **Discussions** - Ask questions
- **Pull Requests** - Contribute code

---

## 🎬 Recording Tips (For Creating Video)

### Before Recording
1. ✅ Close unnecessary applications
2. ✅ Clear browser history/cache
3. ✅ Prepare sample CSV files
4. ✅ Have script/notes ready
5. ✅ Test audio/screen recording

### During Recording
1. **Speak Slowly** - Explain each step clearly
2. **Zoom In** - Show important UI elements up close
3. **Pause** - Give viewers time to read
4. **Highlight** - Use cursor to point at key areas
5. **Repeat** - Show critical steps twice if needed

### After Recording
1. Add **timestamps** in video description
2. Include **sample files** link
3. Add **captions** for accessibility
4. Create **thumbnail** showing main features

### Suggested Video Structure
```
00:00 - Introduction & Feature Overview
02:00 - Setup & Navigation Tour
04:00 - Anomaly Detection Demo
08:00 - Workflow Automation Demo
13:00 - Embeddable Widgets Demo
17:00 - Integration Example
19:00 - Q&A and Next Steps
```

---

**Ready to create your video? Start recording and follow this guide! 🎥**

For questions or support, check the documentation or create a GitHub issue.
