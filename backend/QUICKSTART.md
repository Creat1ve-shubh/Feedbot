# Quick Start Guide - Brand Perception Backend

## 🚀 Getting Started in 3 Steps

### Step 1: Setup Environment

```powershell
cd backend
Copy-Item .env.example .env
```

Edit the `.env` file and add your API credentials:
- Reddit: `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`
- Twitter: `TWITTER_BEARER_TOKEN`

**Don't have API keys?** The system will work with Reddit only or you can test with mock data.

### Step 2: Start Services

```powershell
# Using the convenience script
.\start.ps1

# Or manually
docker compose up --build -d
```

This starts:
- 🌐 **FastAPI** server on `localhost:8000`
- 👷 **Celery** worker for background jobs
- 🔴 **Redis** for task queue
- 🐘 **PostgreSQL** for data storage

### Step 3: Test the API

```powershell
# Run the test script
.\test-api.ps1

# Or manually test endpoints
curl http://localhost:8000/health
```

## 📚 API Endpoints

### 1. Health Check
```bash
GET http://localhost:8000/health
```

Response:
```json
{"status": "ok"}
```

### 2. Queue Analysis Job
```bash
POST http://localhost:8000/analyze
Content-Type: application/json

{
  "brand": "Nike",
  "limit": 100,
  "include_reddit": true,
  "include_twitter": false
}
```

Response:
```json
{
  "task_id": "abc-123-def-456",
  "status": "queued"
}
```

### 3. Get Results
```bash
GET http://localhost:8000/results?brand=Nike&limit=50
```

Response:
```json
[
  {
    "id": "abc123...",
    "brand": "Nike",
    "platform": "reddit",
    "text": "These Nike shoes are amazing!",
    "sentiment": "Positive",
    "confidence": 95,
    "emotion": ["Joy"],
    "topics": ["Comfort", "Quality"],
    "intent": "Praise",
    "summary": "Users praise Nike's comfort and fit.",
    "polarity_score": 950,
    "created_at": "2025-11-08T10:30:00Z"
  }
]
```

## 🔧 Useful Commands

### View Logs
```powershell
# All services
.\logs.ps1

# Specific service
docker compose logs -f api
docker compose logs -f worker
```

### Stop Services
```powershell
.\stop.ps1

# Or manually
docker compose down
```

### Restart Services
```powershell
docker compose restart
```

### Check Service Status
```powershell
docker compose ps
```

## 🧪 Testing with Different Brands

```powershell
# Test with Nike
Invoke-RestMethod -Uri "http://localhost:8000/analyze" -Method Post -Body (@{brand="Nike"; limit=50; include_reddit=$true; include_twitter=$false} | ConvertTo-Json) -ContentType "application/json"

# Test with Apple
Invoke-RestMethod -Uri "http://localhost:8000/analyze" -Method Post -Body (@{brand="Apple"; limit=50; include_reddit=$true; include_twitter=$false} | ConvertTo-Json) -ContentType "application/json"

# Test with Tesla
Invoke-RestMethod -Uri "http://localhost:8000/analyze" -Method Post -Body (@{brand="Tesla"; limit=50; include_reddit=$true; include_twitter=$false} | ConvertTo-Json) -ContentType "application/json"
```

## 🎯 Interactive API Documentation

Visit http://localhost:8000/docs for Swagger UI where you can:
- 📖 See all endpoints
- 🧪 Test API calls interactively
- 📝 View request/response schemas

## 🐛 Troubleshooting

### Services won't start
```powershell
# Check Docker is running
docker --version

# Check if ports are available
netstat -ano | findstr "8000\|6379\|5432"

# View detailed logs
docker compose logs
```

### Import errors
These are expected before dependencies are installed. Docker handles this automatically.

### No results returned
1. Check that you have valid API credentials in `.env`
2. The brand name is case-sensitive
3. Reddit/Twitter APIs may have rate limits
4. Check worker logs: `docker compose logs worker`

### Database connection errors
```powershell
# Restart database
docker compose restart postgres

# Check database is running
docker compose ps postgres
```

## 🔐 Getting API Credentials

### Reddit API
1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Select "script" type
4. Copy the client ID and secret

### Twitter API
1. Go to https://developer.twitter.com/
2. Apply for developer account
3. Create a project and app
4. Generate Bearer Token

## 📊 Understanding the Response

Each analyzed post contains:

- **sentiment**: Positive | Negative | Mixed
- **confidence**: 0-100 (higher = more confident)
- **emotion**: Array of emotions (Joy, Frustration, Neutral)
- **topics**: Array of topics (Pricing, Comfort, Delivery, General)
- **intent**: Query | Complaint | Praise | Feedback
- **summary**: AI-generated summary
- **polarity_score**: -1000 to +1000 (negative to positive)

## 🚀 Next Steps

1. **Add More Brands**: Edit `utils/context_filter.py` to add keyword filters for your brands
2. **Improve ML Models**: Replace placeholder models in `ml/` with your trained models
3. **Scale Up**: Adjust Docker resource limits in `docker-compose.yml`
4. **Production Deploy**: Use proper secrets management and environment variables

## 📦 What's Running?

```
┌─────────────┐     ┌──────────────┐
│   FastAPI   │────▶│  PostgreSQL  │
│   (Port     │     │  (Port 5432) │
│    8000)    │     └──────────────┘
└─────────────┘            ▲
       │                   │
       ▼                   │
┌─────────────┐           │
│    Redis    │           │
│  (Port 6379)│           │
└─────────────┘           │
       │                  │
       ▼                  │
┌─────────────┐          │
│   Celery    │──────────┘
│   Worker    │
└─────────────┘
```

## 💡 Tips

- Start with small `limit` values (10-50) for testing
- Reddit scraping works without auth but has rate limits
- Twitter requires Bearer Token
- Results are cached in PostgreSQL
- Duplicate posts are automatically filtered
