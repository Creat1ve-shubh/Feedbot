# Feedbot Backend - Quick Start Guide

> **Get up and running in 5 minutes**

---

## Prerequisites

- Docker & Docker Compose installed
- Python 3.11+ (optional, for local development)

---

## 🚀 Docker Setup (Recommended)

### Step 1: Clone & Configure

```powershell
cd backend
cp .env.example .env
```

**Edit `.env`** and add your API credentials (optional):

```env
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_secret
TWITTER_BEARER_TOKEN=your_bearer_token
```

> **Don't have API keys?** The system works with Reddit only or you can skip social media scraping for testing.

### Step 2: Start All Services

```powershell
docker compose up --build -d
```

This starts:

- 🌐 **FastAPI** server on `localhost:8000`
- 👷 **Celery** worker for background jobs
- 🔴 **Redis** for task queue
- 🐘 **PostgreSQL** for data storage

### Step 3: Verify & Test

```powershell
# Check health
curl http://localhost:8000/health

# View API docs
start http://localhost:8000/docs

# Or use the test script
.\test-api.ps1
```

---

## 🔧 Local Python Setup (Alternative)

If you prefer running without Docker:

```powershell
# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Initialize database
python migrate.py

# Start API (needs Redis & PostgreSQL running)
uvicorn app:app --reload --port 8000

# Start Celery worker (separate terminal)
celery -A celery_app worker --loglevel=info
```

---

## 📚 API Usage Examples

### Health Check

```powershell
curl http://localhost:8000/health
# Response: {"status": "ok"}
```

### Queue Analysis Job

```powershell
$body = @{
    brand = "Nike"
    limit = 100
    include_reddit = $true
    include_twitter = $false
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/analyze" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

# Response: {"task_id": "abc-123...", "status": "queued"}
```

### Get Results

```powershell
Invoke-RestMethod "http://localhost:8000/results?brand=Nike&limit=50"

# Returns array of analyzed posts with sentiment, emotions, topics
```

### Get Dashboard Metrics

```powershell
Invoke-RestMethod "http://localhost:8000/api/metrics/Nike"

# Returns comprehensive dashboard data
```

---

## 🐳 Managing Docker Services

```powershell
# View logs
docker compose logs -f

# Restart services
docker compose restart

# Stop services
docker compose down

# Clean restart (removes data)
docker compose down -v
docker compose up --build
```

---

## 🧪 Testing

```powershell
# Quick test
.\test-api.ps1

# Run full test suite
pytest tests/

# Verify integration
python verify_integration.py
```

---

## 📖 More Information

- **[README.md](README.md)** - Project overview
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Comprehensive setup guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment
- **[API_EXAMPLES.md](API_EXAMPLES.md)** - Detailed API examples
- **[DATABASE.md](DATABASE.md)** - Database architecture

---

## 🆘 Troubleshooting

### Services won't start

```powershell
# Check if ports are in use
netstat -ano | findstr "8000 5432 6379"

# Clean restart
docker compose down -v
docker compose up --build
```

### Database connection errors

```powershell
# Check PostgreSQL is running
docker compose ps

# View database logs
docker compose logs postgres
```

### Worker not processing tasks

```powershell
# Check worker logs
docker compose logs worker

# Restart worker
docker compose restart worker
```

### Import errors

```powershell
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## ✅ Next Steps

1. **Customize ML model**: Replace default model with your trained version
2. **Add more brands**: Update context filters in `utils/context_filter.py`
3. **Configure scrapers**: Add more data sources
4. **Deploy to production**: Follow [DEPLOYMENT.md](DEPLOYMENT.md)
5. **Integrate frontend**: Connect Next.js dashboard

**Need help?** Check [GETTING_STARTED.md](GETTING_STARTED.md) for detailed guides!

```

## 🧪 Testing with Different Brands

```
