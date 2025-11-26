# AI-STOTLE API Debugging Guide

## Issue: "Struggling to connect to knowledge base"

If you're seeing connection issues, follow these debugging steps:

---

## Step 1: Verify API is Running

### Check Health Endpoint
```bash
curl https://aistotle.carlsnewton.com/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "ollama_status": "connected",
  "model": "mistral"
}
```

If this fails, your DGX Spark services may be down.

---

## Step 2: Check DGX Spark Services

SSH into your DGX Spark and verify services:

### Check Ollama
```bash
sudo systemctl status ollama
curl http://localhost:11434/api/tags
```

### Check AI-STOTLE API
```bash
sudo systemctl status aistotle
curl http://localhost:8000/health
```

### Check Cloudflare Tunnel
```bash
sudo systemctl status cloudflared
sudo cloudflared tunnel list
```

### Restart Services if Needed
```bash
# Restart Ollama
sudo systemctl restart ollama

# Restart AI-STOTLE
sudo systemctl restart aistotle

# Restart Cloudflare Tunnel
sudo systemctl restart cloudflared
```

---

## Step 3: Test API Endpoint Directly

```bash
curl -X POST https://aistotle.carlsnewton.com/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Why does elephant toothpaste foam?",
    "student_age": 10
  }'
```

**Expected Response:**
```json
{
  "answer": "The elephant toothpaste foams...",
  "success": true,
  "intent": "science",
  "cost": 0.0
}
```

---

## Step 4: Check CORS Configuration

Your FastAPI app should have CORS enabled:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Step 5: Verify Environment Variable on Vercel

1. Go to Vercel Project Settings
2. Navigate to Environment Variables
3. Verify: `NEXT_PUBLIC_AISTOTLE_API_URL` = `https://aistotle.carlsnewton.com`
4. Redeploy after adding/changing variables

---

## Step 6: Check Browser Console

Open browser console (F12) and look for:

```
AI-STOTLE: Sending request to: https://aistotle.carlsnewton.com/ask
AI-STOTLE: Response status: 200
AI-STOTLE: Success response: { answer: "...", success: true }
```

### Common Errors:

**CORS Error:**
```
Access to fetch at 'https://aistotle.carlsnewton.com/ask' from origin 'https://carlsnewton.com'
has been blocked by CORS policy
```
**Fix:** Add CORS middleware to FastAPI

**Network Error:**
```
Failed to fetch
NetworkError when attempting to fetch resource
```
**Fix:** Check if API is running and accessible

**404 Error:**
```
API returned 404: Not Found
```
**Fix:** Verify endpoint URL is correct (`/ask` not `/api/ask`)

---

## Step 7: Local Testing

Test locally first:

```bash
# In your project directory
npm run dev

# Open http://localhost:3000
# Click AI-STOTLE button
# Check browser console for logs
```

---

## Quick Diagnostic Checklist

- [ ] DGX Spark is powered on and accessible
- [ ] Ollama service is running (port 11434)
- [ ] AI-STOTLE FastAPI is running (port 8000)
- [ ] Cloudflare tunnel is active
- [ ] Health endpoint responds: `https://aistotle.carlsnewton.com/health`
- [ ] CORS is configured in FastAPI
- [ ] Environment variable is set on Vercel
- [ ] Project has been redeployed after adding env variable

---

## Still Having Issues?

### Check Cloudflare Tunnel Logs
```bash
sudo journalctl -u cloudflared -f
```

### Check AI-STOTLE Logs
```bash
sudo journalctl -u aistotle -f
```

### Check Ollama Logs
```bash
sudo journalctl -u ollama -f
```

---

## Alternative: Use HTTP Instead of HTTPS (Testing Only)

If you need to test locally without HTTPS:

1. Update `.env.local`:
```
NEXT_PUBLIC_AISTOTLE_API_URL=http://localhost:8000
```

2. SSH tunnel to DGX Spark:
```bash
ssh -L 8000:localhost:8000 user@dgx-spark-ip
```

3. Test locally with direct connection

**Note:** This is for debugging only. Production should use HTTPS.
