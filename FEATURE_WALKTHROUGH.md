# 📸 Feature Walkthrough

## Visual Guide to New Features

### 🎯 Navigation Structure

```
Navbar (Top)
├── Dashboard       ⭐ Anomaly alerts auto-show here
├── Reports
├── Ask AI
├── Workflows       🆕 Automation builder
├── Widgets         🆕 Embed generator
├── Alerts          🆕 Notification center
└── Settings
```

---

## 1. Anomaly Detection Workflow

### Step-by-Step

```
1. Upload Dataset
   └── Dashboard shows upload card
   
2. Automatic Processing
   └── System cleans and analyzes data
   
3. Anomaly Alerts Card Appears ⚡
   ├── Shows count: "5 anomalies detected"
   ├── [Scan Now] button - click to re-scan
   └── [Clear Alerts] button - trash icon
   
4. View Anomaly Details
   ├── Statistical Outlier (🔴 HIGH)
   │   ├── Column: "Price"
   │   ├── Count: 12 values
   │   ├── Normal range: [$10.00, $150.00]
   │   └── Sample values: $999.99, $850.00, ...
   │
   ├── Sudden Change (🟡 MEDIUM)
   │   ├── Column: "Sales"
   │   ├── Count: 3 spikes
   │   └── Detected: 2025-11-16 08:30:15
   │
   └── High Missing Data (🔵 LOW)
       ├── Column: "Description"
       ├── Missing: 35.2% (450 rows)
       └── Total rows: 1,278
```

### UI Elements

- **Expandable card** - Click header to expand/collapse
- **Color-coded severity** - Red/Yellow/Blue badges
- **Detailed breakdowns** - All anomaly info visible
- **Action buttons** - Scan Now, Clear Alerts

---

## 2. Workflow Automation Builder

### Creating Your First Workflow

```
1. Click "Workflows" in navbar
   
2. Click "New Workflow" button (top right)
   
3. Workflow Builder Form Opens
   ├── Name: "Daily Sales Pipeline"
   ├── Description: "Clean and analyze sales data daily"
   ├── Trigger: [Dropdown]
   │   ├── Manual (Click to Run)
   │   ├── Schedule (Cron)      ⭐ Selected
   │   ├── On Data Upload
   │   └── On Anomaly Detected
   │
   └── Actions: [List]
       ├── [Dropdown: Clean Data]        [🗑️]
       ├── [Dropdown: Run Analysis]      [🗑️]
       ├── [Dropdown: Check Anomalies]   [🗑️]
       └── [+ Add Action] button
   
4. Click "Create Workflow"
   
5. Workflow Card Appears in List
   ├── ✅ Daily Sales Pipeline
   ├── 🔄 schedule • 3 actions • 0 runs
   ├── Last: Never
   └── [▶️ Run] [🗑️ Delete]
```

### Workflow Execution

```
Click [▶️ Run] button
   ↓
Status changes: pending → running → completed
   ↓
Alert: "Workflow completed: 3 actions executed"
   ↓
Run count increments: 0 → 1
Last run updates: "Last: 11/16/2025"
```

### Pre-built Templates

```
1. Daily Data Pipeline
   ├── Trigger: Schedule (9am daily)
   └── Actions: Clean → Analyze → Chart → Export
   
2. Anomaly Response
   ├── Trigger: On Anomaly Detected
   └── Actions: Check Severity → Send Alert
   
3. Monthly Archive
   ├── Trigger: Schedule (1st of month)
   └── Actions: Archive Old Data → Export Report
```

---

## 3. Embeddable Widgets

### Creating a Widget

```
1. Click "Widgets" in navbar
   
2. Click "New Widget" button
   
3. Widget Builder Form
   ├── Name: "Sales Dashboard"
   ├── Type: [Dropdown]
   │   ├── Chart               ⭐ Selected
   │   ├── Stats Card
   │   ├── Data Table
   │   ├── Dashboard
   │   ├── Live Metrics
   │   └── AI Chat
   │
   ├── Allowed Domains: "example.com, mysite.io"
   │   (comma-separated, blank = all domains)
   │
   └── Rate Limit: [100] requests/hour
   
4. Click "Create Widget"
   
5. Widget Card Appears
   ├── Sales Dashboard
   ├── 🎨 chart • ✅ Active
   ├── Views: 0 • Created: 11/16/2025
   └── [</> Code] [🗑️ Delete]
```

### Getting Embed Code

```
1. Click [</> Code] icon on widget card
   
2. Embed Code Panel Opens
   ├── [HTML] [React] tabs at bottom
   ├── Code displayed in dark code block
   └── [📋 Copy] button at top right
   
3. Select Format
   ├── Click [HTML] → Copy-paste iframe code
   └── Click [React] → Copy React component
   
4. Embed Code Examples:

HTML:
<div id="analytics-widget-abc123"></div>
<script>
  // Widget loads here automatically
</script>

React:
import AnalyticsWidget_abc123 from './widget';
<AnalyticsWidget_abc123 width="100%" height="400px" />
```

### Widget Security

```
Widget Card Details:
├── API Key: abc123xyz (auto-generated)
├── Allowed: example.com, mysite.io
├── Rate Limit: 100/hour
├── Views: 247
└── Status: ✅ Active / ⚪ Disabled
```

---

## 4. Notifications Center

### Viewing Alerts

```
1. Click "Alerts" in navbar
   
2. Notifications Page
   ├── Header: "Notifications"
   ├── Badge: "3 Unread" (red) / "No Unread" (gray)
   │
   ├── Test Buttons (for demo):
   │   ├── [ℹ️ Add Info]
   │   ├── [✅ Add Success]
   │   ├── [⚠️ Add Warning]
   │   └── [❌ Add Error]
   │
   ├── Actions:
   │   ├── [✓ Mark all read]
   │   └── [🗑️ Clear all]
   │
   └── Notification List:
       ├── ℹ️ New insight available for dataset
       │   ├── Timestamp: 11/16/2025 8:45 AM
       │   └── [Mark read] [Delete]
       │
       ├── ✅ Your settings were saved
       │   ├── Timestamp: 11/16/2025 8:30 AM
       │   └── [Mark unread] [Delete]
       │
       └── ⚠️ Large dataset may take longer
           ├── Timestamp: 11/16/2025 8:15 AM
           └── [Mark read] [Delete]
```

---

## 5. Integration Points

### Dashboard Integration

```
Dashboard Page Layout:
├── Hero Section (upload card)
├── Charts Grid
├── Insights Card
├── Cleaning Report
├── ⚡ Anomaly Alerts       ← Auto-appears after upload
├── Live AI Chat
└── Chat History
```

### Workflow Triggers

```
Data Flow:
1. User uploads file
   ↓
2. Check for workflows with trigger = "data_upload"
   ↓
3. Execute matching workflows automatically
   ↓
4. Show notification: "Workflow 'X' triggered"
```

### Widget Embedding

```
External Site Integration:
1. Copy widget embed code
   ↓
2. Paste into website HTML
   ↓
3. Widget validates:
   ├── API key correct?
   ├── Domain whitelisted?
   └── Rate limit OK?
   ↓
4. Widget renders with your data
5. Auto-updates every N seconds (if live metrics)
```

---

## 🎨 UI/UX Highlights

### Design System

- **Glass-morphism cards** - Frosted glass effect
- **Gradient buttons** - Primary, success, accent colors
- **Smooth animations** - Page transitions, hover effects
- **Dark mode support** - Auto or manual toggle
- **Responsive layout** - Mobile, tablet, desktop

### Color Coding

- 🔴 **Red/Danger** - High severity, errors, delete
- 🟡 **Yellow/Warning** - Medium severity, caution
- 🔵 **Blue/Info** - Low severity, information
- 🟢 **Green/Success** - Completed, active, success
- ⚫ **Gray/Secondary** - Disabled, inactive, neutral

### Icons (Material-UI)

- 📊 **Dashboard** - DashboardIcon
- 📈 **Reports** - BarChartIcon
- 🤖 **Ask AI** - SmartToyIcon
- 🌳 **Workflows** - AccountTreeIcon
- 🧩 **Widgets** - WidgetsIcon
- 🔔 **Alerts** - NotificationsActiveIcon
- ⚙️ **Settings** - SettingsIcon

---

## 📱 Responsive Behavior

### Desktop (> 992px)
- Full navbar with all tabs
- 3-column grid for charts
- Side-by-side panels

### Tablet (768px - 992px)
- Collapsible navbar
- 2-column grid
- Stacked panels

### Mobile (< 768px)
- Hamburger menu
- Single column
- Full-width cards

---

## 🚦 Status Indicators

### Workflow Status
- ⏸️ **Pending** - Not started
- ▶️ **Running** - Currently executing
- ✅ **Completed** - Success
- ❌ **Failed** - Error occurred
- ⏯️ **Paused** - Temporarily stopped

### Widget Status
- ✅ **Active** - Enabled and serving
- ⚪ **Disabled** - Not serving requests
- 🔒 **Expired** - Time limit reached
- 🚫 **Blocked** - Domain not allowed

### Anomaly Severity
- 🔴 **High** - Immediate attention needed
- 🟡 **Medium** - Investigation recommended
- 🔵 **Low** - Awareness level

---

## 💡 Power User Tips

### Anomaly Detection
- **Adjust sensitivity** based on data variance
- **Export alerts** before clearing
- **Compare with previous scans** for trends

### Workflows
- **Chain actions** for complex pipelines
- **Use cron syntax** for precise scheduling
  - `0 9 * * *` = Daily at 9am
  - `0 */4 * * *` = Every 4 hours
  - `0 0 1 * *` = Monthly on 1st
- **Test manually first** before scheduling

### Widgets
- **Whitelist specific subdomains** for security
- **Use rate limiting** to prevent abuse
- **Monitor view counts** for usage analytics
- **Update themes** without recreating widget

---

## 🎯 Success Metrics

Track your improvements:

- ⏱️ **Time Saved**: Hours/week with automation
- 🔍 **Issues Caught**: Anomalies detected early
- 📤 **Embeds Created**: Widgets deployed
- 🔄 **Workflows Running**: Active automations
- 📊 **Widget Views**: External engagement

---

Ready to revolutionize your data workflow? 🚀

See `QUICKSTART_NEW_FEATURES.md` for detailed API examples!
