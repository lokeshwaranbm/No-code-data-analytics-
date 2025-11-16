# 💾 Chat History Feature - Documentation

## Overview
All conversations with the AI are automatically saved and can be viewed, exported, or deleted at any time.

## 📁 Storage Location
Chat histories are stored in: `backend/chat_histories/`

Format: `{filename}_chat_history.json`

Example: `Car_Prices_chat_history.json`

## 📊 What Gets Saved

Each conversation entry contains:
```json
{
  "timestamp": "2025-11-16T00:30:15.123456",
  "question": "How many columns are there?",
  "answer": "Your dataset has 15 columns including Brand, Year, Selling_Price...",
  "metadata": {
    "cleaning_summary": {...},
    "row_count": 1055,
    "column_count": 15
  }
}
```

## 🎨 UI Features

### **1. Collapsible History Panel**
- Located below the Live AI Chat on Dashboard
- Click to expand/collapse
- Shows total conversation count

### **2. Timeline View**
- Chronological display of all Q&A pairs
- Timestamps for each conversation
- Question badges (green) and Answer badges (pink)
- Metadata showing row/column counts

### **3. Export Options**
- **TXT Format**: Human-readable text file
- **JSON Format**: Machine-readable data file
- One-click download

### **4. Clear History**
- Delete all chat history for current file
- Confirmation dialog for safety

## 🔌 API Endpoints

### GET `/chat/history/{filename}`
Get chat history for a specific file
```bash
# Get last 10 conversations
GET /chat/history/Car_Prices.csv?limit=10

# Get all conversations
GET /chat/history/Car_Prices.csv?limit=-1
```

**Response:**
```json
{
  "conversations": [
    {
      "timestamp": "2025-11-16T00:30:15",
      "question": "...",
      "answer": "...",
      "metadata": {...}
    }
  ],
  "count": 5
}
```

### GET `/chat/history`
List all files with chat histories
```bash
GET /chat/history
```

**Response:**
```json
{
  "files": [
    {
      "filename": "Car_Prices.csv",
      "total_conversations": 12,
      "last_updated": "2025-11-16T00:35:22",
      "created_at": "2025-11-15T10:20:30"
    }
  ]
}
```

### POST `/chat/export/{filename}`
Export history to file
```bash
POST /chat/export/Car_Prices.csv
Body: { "format": "txt" }  # or "json"
```

Returns file for download.

### DELETE `/chat/history/{filename}`
Delete chat history
```bash
DELETE /chat/history/Car_Prices.csv
```

**Response:**
```json
{
  "status": "success",
  "message": "Chat history deleted for Car_Prices.csv"
}
```

## 📝 File Formats

### TXT Export Example
```
Chat History for: Car_Prices.csv
Total Conversations: 5
Created: 2025-11-15T10:20:30
Last Updated: 2025-11-16T00:35:22
================================================================================

Conversation #1
Time: 2025-11-15T10:22:15

User Question:
How many columns are there?

AI Answer:
Your dataset has 15 columns in total. These include information like Brand, 
Selling_Price, Year, and KM_Driven. The data has been cleaned to remove 6 
duplicates and fill 433 missing values.

--------------------------------------------------------------------------------

Conversation #2
Time: 2025-11-15T10:25:30

User Question:
What are the main patterns?

AI Answer:
Looking at your bike prices dataset, I see several interesting patterns:
- Most bikes are priced between ₹20,000-₹50,000
- Royal Enfield and Bajaj are the top brands
- Newer bikes command 40-50% higher prices
- High mileage reduces prices by 30-40%

Your data is clean with 433 missing values filled and 6 duplicates removed!

--------------------------------------------------------------------------------
```

### JSON Export Example
```json
{
  "filename": "Car_Prices.csv",
  "created_at": "2025-11-15T10:20:30.123456",
  "last_updated": "2025-11-16T00:35:22.654321",
  "total_conversations": 5,
  "conversations": [
    {
      "timestamp": "2025-11-15T10:22:15.789012",
      "question": "How many columns are there?",
      "answer": "Your dataset has 15 columns...",
      "metadata": {
        "cleaning_summary": {...},
        "row_count": 1055,
        "column_count": 15
      }
    }
  ]
}
```

## 🔄 Automatic Features

### **Auto-Save**
Every chat interaction is automatically saved. No manual action needed.

### **Persistence**
History persists across:
- Page refreshes
- Browser sessions
- Server restarts

### **File-Specific**
Each uploaded CSV gets its own separate history file.

## 💡 Use Cases

1. **Audit Trail**: Track what questions were asked about the data
2. **Knowledge Base**: Review previous insights and answers
3. **Reporting**: Export conversations for documentation
4. **Analysis**: Understand how users interact with the data
5. **Training**: Use conversations to improve prompts and responses

## 🔐 Privacy & Storage

- **Local Storage**: All histories stored on your backend server
- **No Cloud**: Data never leaves your infrastructure
- **Manual Control**: Users can delete history anytime
- **Metadata Included**: Tracks data quality context with each answer

## 🚀 Future Enhancements (Optional)

- **Search**: Find specific questions/answers
- **Filter**: By date range or keyword
- **Share**: Export selected conversations
- **Analytics**: Most common questions, response times
- **Session Grouping**: Group conversations by upload session

---

**Your chat history is now fully persistent and exportable!** 🎉
