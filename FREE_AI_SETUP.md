# 🆓 Get FREE AI Insights in 2 Minutes

Your app now supports **3 free AI options** instead of just OpenAI!

## 🚀 Quickest Option: Groq (Recommended)

**Why Groq?**
- ✅ Completely FREE
- ✅ No credit card required
- ✅ Instant approval
- ✅ Very fast (faster than OpenAI)
- ✅ Uses Meta's Llama 3 model

### Get Your Free Groq API Key:

1. **Go to:** https://console.groq.com/keys
2. **Sign in** with Google/GitHub (takes 30 seconds)
3. **Click "Create API Key"**
4. **Copy the key** (starts with `gsk_...`)

5. **Add to your `.env` file:**
   ```bash
   cd d:\Nxtwave\No_Code_dataAnalyst\backend
   notepad .env
   ```
   
   Add this line:
   ```
   GROQ_API_KEY=gsk_your_actual_key_here
   ```
   
   Save and close.

6. **Restart your backend:**
   ```powershell
   # Stop the current server (Ctrl+C), then:
   uvicorn main:app --reload --port 8000
   ```

7. **Upload a CSV** - you'll now get AI insights! 🎉

---

## 🌟 Alternative: Google Gemini (Also Free)

**Why Gemini?**
- ✅ FREE tier (15 requests/minute)
- ✅ Google's latest AI model
- ✅ No credit card for free tier

### Get Your Free Gemini API Key:

1. **Go to:** https://aistudio.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"**
4. **Copy the key**

5. **Add to `.env`:**
   ```
   GEMINI_API_KEY=your_gemini_key_here
   ```

---

## 💡 How It Works

The app tries APIs in this order:
1. **Groq** (if `GROQ_API_KEY` is set)
2. **Gemini** (if `GEMINI_API_KEY` is set)
3. **OpenAI** (if `OPENAI_API_KEY` is set)
4. **Fallback** (shows cleaning summary if no keys)

You only need **ONE** key for it to work!

---

## 🧪 Test It

After adding a key and restarting:

1. Open http://localhost:3000
2. Upload your CSV (e.g., Bike Prices.csv)
3. Check the "AI Insights" section
4. You should see 2-3 smart insights instead of the fallback message!

---

## ❓ Troubleshooting

**"AI insight generation failed"**
- Make sure you added the key to `.env` (not `.env.example`)
- Restart the backend after adding the key
- Check there are no extra spaces around the `=` sign

**"Still seeing fallback message"**
- Verify the `.env` file is in the `backend/` folder
- Make sure the key starts with `gsk_` (Groq) or `AIza` (Gemini)
- Try stopping backend completely and restarting

**Need help?**
- Groq docs: https://console.groq.com/docs
- Gemini docs: https://ai.google.dev/gemini-api/docs

---

## 📊 API Comparison

| Provider | Cost | Speed | Signup | Rate Limit |
|----------|------|-------|--------|------------|
| **Groq** | FREE | ⚡ Fastest | Instant | 30 req/min |
| **Gemini** | FREE | Fast | Instant | 15 req/min |
| OpenAI | Paid | Fast | Requires card | Varies |

**Recommendation:** Use Groq for development and demos. It's free, fast, and requires no payment info!
