# AI-STOTLE Backend Update Guide
## Transform from Science Tutor to Business FAQ Chatbot

This guide shows you how to update the AI-STOTLE backend on your DGX Spark to transform it from a science tutor into an intelligent business FAQ chatbot for Carls Newton.

---

## Overview

**Current:** Science tutor answering "Why does elephant toothpaste foam?"
**Target:** Business chatbot answering about packages, pricing, bookings, and Carls Newton services

---

## Step 1: Upload Knowledge Base to DGX Spark

### 1.1 Copy the Knowledge Base File

From your local machine, copy the knowledge base to DGX Spark:

```bash
# Copy business_faq.json to DGX Spark
scp docs/business_faq.json your-user@dgx-spark-ip:~/AI-stotle_brain/data/source/
```

Or manually create the file on DGX Spark:

```bash
# SSH into DGX Spark
ssh your-user@dgx-spark-ip

# Create the knowledge base file
nano ~/AI-stotle_brain/data/source/business_faq.json

# Paste the content from docs/business_faq.json
# Save and exit (Ctrl+X, Y, Enter)
```

---

## Step 2: Update AI Brain Personality

### 2.1 Edit `aristotle_brain.py`

```bash
# SSH into DGX Spark
ssh your-user@dgx-spark-ip

# Edit the brain file
nano ~/AI-stotle_brain/backend/core/aristotle_brain.py
```

### 2.2 Update Personality Prompt

Find the `self.personality` section and replace it with:

```python
self.personality = """I am the Carls Newton AI assistant! I help with information about our science shows,
booking inquiries, and answering questions about our services in Dubai and Abu Dhabi.

About us: Carls Newton is founded by Carla Carvajal, a Chemical Engineer with 10+ years of teaching experience.
We bring hands-on, exciting science shows directly to schools, combining fun with meaningful STEM learning.
Our tagline: "Where Science Meets Imagination!"

I can help with:
- Package information and pricing (Preschool Special Dhs 2,800, Classic Show Dhs 3,600, Half-Day Experience Dhs 5,200, Custom Projects Dhs 8,000+)
- Booking inquiries and checking booking status
- Safety questions and certifications
- Customization options for your school
- General questions about our services
- Information about our founder Carla Carvajal
- Contact information and service areas

I'm friendly, helpful, and knowledgeable. I provide accurate information about Carls Newton while being conversational.
If I don't know something specific, I'll admit it and direct users to contact hello@carlsnewton.com or WhatsApp +971 52 409 8148.

How can I help you today?"""
```

---

## Step 3: Update Intent Detection

### 3.1 Edit Intent Classifier

In `aristotle_brain.py`, update the intent categories:

```python
INTENT_CATEGORIES = {
    "about": [
        "who is carls newton", "about carla", "founder", "qualifications",
        "experience", "chemical engineer", "tv show", "background"
    ],
    "packages": [
        "package", "pricing", "price", "cost", "how much", "preschool",
        "classic show", "half-day", "custom project", "what do you offer"
    ],
    "booking_process": [
        "how to book", "booking process", "how do i book", "schedule",
        "availability", "cancellation", "payment"
    ],
    "booking_status": [
        "check booking", "booking status", "my booking", "booking number",
        "BK", "order status"
    ],
    "safety": [
        "safe", "insurance", "allergy", "allergies", "certified",
        "first aid", "equipment", "safety protocol"
    ],
    "logistics": [
        "location", "dubai", "abu dhabi", "setup", "space needed",
        "what do you need", "equipment", "cleanup"
    ],
    "contact": [
        "contact", "email", "phone", "whatsapp", "reach you",
        "get in touch", "social media", "instagram"
    ],
    "topics": [
        "what topics", "what science", "experiments", "demonstrations",
        "elephant toothpaste", "dry ice", "volcano"
    ],
    "general": []  # Catch-all for open-ended questions
}
```

---

## Step 4: Rebuild Knowledge Base

### 4.1 Run the Rebuild Script

```bash
cd ~/AI-stotle_brain/backend
python scripts/rebuild_knowledge.py
```

### 4.2 Verify Knowledge Base

```bash
# Check if knowledge base was created
ls -lh data/processed/

# Should see vector_store.faiss and documents.pkl
```

---

## Step 5: Restart Services

### 5.1 Restart AI-STOTLE API

```bash
sudo systemctl restart aistotle
sudo systemctl status aistotle
```

### 5.2 Check Logs

```bash
# Watch API logs
sudo journalctl -u aistotle -f

# Should see: "Knowledge base loaded successfully"
```

---

## Step 6: Test the Updated System

### 6.1 Test Health Endpoint

```bash
curl https://aistotle.carlsnewton.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "ollama_status": "connected",
  "model": "mistral",
  "knowledge_base": "loaded"
}
```

### 6.2 Test Business Questions

```bash
# Test: Who is Carls Newton?
curl -X POST https://aistotle.carlsnewton.com/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Who is Carls Newton?",
    "student_age": 10
  }'

# Expected: Response about Carla Carvajal, Chemical Engineer, 10+ years experience
```

```bash
# Test: Package pricing
curl -X POST https://aistotle.carlsnewton.com/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What packages do you offer?",
    "student_age": 10
  }'

# Expected: List of 4 packages with pricing
```

```bash
# Test: Booking process
curl -X POST https://aistotle.carlsnewton.com/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How do I book a show?",
    "student_age": 10
  }'

# Expected: Booking process via website/WhatsApp/email
```

---

## Step 7: Update Response Templates (Optional)

### 7.1 Create Response Templates

In `aristotle_brain.py`, add template responses for common questions:

```python
RESPONSE_TEMPLATES = {
    "packages": """We offer 4 amazing packages:

1. **Preschool Special** (30-45 min) - Dhs 2,800
   Perfect for preschoolers with age-appropriate experiments

2. **Classic Show** (45-60 min) - Dhs 3,600 ⭐ Most Popular!
   Interactive science show for Y1-Y8 with spectacular experiments

3. **Half-Day Experience** (Show + Workshop) - Dhs 5,200
   Complete STEM experience with hands-on activities

4. **Custom Project** (School-Wide Events) - From Dhs 8,000+
   Perfect for science fairs, STEM weeks, 100+ students

All packages include equipment, setup, and cleanup. Which interests you?""",

    "about_founder": """Carls Newton is founded by Carla Carvajal, a Chemical Engineer who graduated with honors and has 10+ years of science education experience!

🔬 She spent 7 years as a bilingual Physics and Chemistry teacher where her students won national Science Olympics
📺 TV presenter on 'A Pinch of Science' on Televisa Veracruz
🎓 First Aid & CPR certified, working on STEM.org Educator Certification
🌍 Now based in Abu Dhabi, bringing spectacular science shows across the UAE!""",

    "contact": """You can reach us:
📧 Email: hello@carlsnewton.com
📱 WhatsApp: +971 52 409 8148
📸 Instagram: @carls.newton
🌐 Website: carlsnewton.com

We serve Dubai, Abu Dhabi, Sharjah, and UAE-wide!"""
}
```

---

## Step 8: Verify Website Integration

### 8.1 Test on Website

1. Go to carlsnewton.com
2. Click AI-STOTLE button
3. Try quick questions:
   - "What packages do you offer?"
   - "Who is Carls Newton?"
   - "How do I book a show?"
   - "Check my booking status"

### 8.2 Check Browser Console

Open Developer Tools (F12) → Console tab

Should see:
```
AI-STOTLE: Sending request to: https://aistotle.carlsnewton.com/ask
AI-STOTLE: Response status: 200
AI-STOTLE: Success response: { answer: "...", intent: "packages" }
```

---

## Expected Behavior

### Question: "Who is Carls Newton?"

**Expected Response:**
> "Carls Newton is founded by Carla Carvajal, a Chemical Engineer who graduated with honors and has over 10 years of science education experience! She spent 7 years as a bilingual Physics and Chemistry teacher where her students won national Science Olympics. She's also been a TV science presenter on 'A Pinch of Science' on Televisa Veracruz. Now based in Abu Dhabi, she brings spectacular science shows to schools across the UAE! 🔬"

### Question: "What packages do you offer?"

**Expected Response:**
> "We offer 4 amazing packages:
>
> - **Preschool Special** (30-45 min) - Dhs 2,800
> - **Classic Show** (45-60 min) - Dhs 3,600 ⭐ Most Popular!
> - **Half-Day Experience** (Show + Workshop) - Dhs 5,200
> - **Custom Project** (School-Wide Events) - From Dhs 8,000+
>
> All packages include equipment, setup, and cleanup. Which one interests you?"

### Question: "Are you qualified?"

**Expected Response:**
> "Absolutely! Carla Carvajal is a qualified Chemical Engineer with honors, 10+ years teaching experience, First Aid & CPR certified, and working on STEM.org Educator Certification. Her students consistently won at national Science Olympics. We carry full insurance and follow strict safety protocols!"

### Question: "Check booking BK20251123-0019"

**Expected Response:** *(existing feature - still works)*
> "I found your booking! Here are the details:
> - Booking Number: BK20251123-0019
> - Package: Classic Show
> - Date: November 30, 2024
> - Status: Confirmed
> ..."

---

## Troubleshooting

### Issue: "Knowledge base not found"

**Solution:**
```bash
cd ~/AI-stotle_brain/backend
python scripts/rebuild_knowledge.py
sudo systemctl restart aistotle
```

### Issue: Still getting science tutor responses

**Solution:**
```bash
# Verify personality was updated
grep -A 10 "self.personality" ~/AI-stotle_brain/backend/core/aristotle_brain.py

# Restart service
sudo systemctl restart aistotle
```

### Issue: No response from API

**Solution:**
```bash
# Check all services
sudo systemctl status ollama
sudo systemctl status aistotle
sudo systemctl status cloudflared

# Restart if needed
sudo systemctl restart ollama aistotle cloudflared
```

---

## Files to Update on DGX Spark

1. `~/AI-stotle_brain/data/source/business_faq.json` - Knowledge base
2. `~/AI-stotle_brain/backend/core/aristotle_brain.py` - Personality & intents
3. Run: `python scripts/rebuild_knowledge.py`
4. Run: `sudo systemctl restart aistotle`

---

## Verification Checklist

- [ ] business_faq.json uploaded to DGX Spark
- [ ] aristotle_brain.py personality updated
- [ ] Intent categories updated
- [ ] Knowledge base rebuilt successfully
- [ ] aistotle service restarted
- [ ] Health endpoint returns 200
- [ ] "Who is Carls Newton?" returns correct response
- [ ] "What packages do you offer?" returns pricing
- [ ] "Check booking BK..." still works
- [ ] Website modal shows business quick questions
- [ ] Browser console shows successful API calls

---

## Quick Commands Summary

```bash
# Upload knowledge base
scp docs/business_faq.json user@dgx-spark:~/AI-stotle_brain/data/source/

# SSH and rebuild
ssh user@dgx-spark
cd ~/AI-stotle_brain/backend
python scripts/rebuild_knowledge.py
sudo systemctl restart aistotle

# Test
curl https://aistotle.carlsnewton.com/health
curl -X POST https://aistotle.carlsnewton.com/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Who is Carls Newton?", "student_age": 10}'
```

---

Your AI-STOTLE is now a smart business assistant! 🤖✨
