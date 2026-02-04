# Feedbot Backend - Getting Started

> **Production-Ready Brand Sentiment Analysis API**  
> FastAPI + Celery + Redis + PostgreSQL + ML

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Docker & Docker Compose
- Redis (via Docker)
- PostgreSQL (via Docker)

### 1. Clone and Setup

```bash
cd backend
cp .env.example .env
```

**Edit `.env` and add your API credentials (optional):**

- `REDDIT_CLIENT_ID` / `REDDIT_CLIENT_SECRET`
- `TWITTER_BEARER_TOKEN`

### 2. Start with Docker (Recommended)

```powershell
# Build and start all services
docker compose up --build -d

# Services:
# - FastAPI (localhost:8000)
# - Celery Worker
# - PostgreSQL (localhost:5432)
# - Redis (localhost:6379)
```

### 3. Verify Installation

```powershell
# Check health
curl http://localhost:8000/health

# View API docs
start http://localhost:8000/docs
```

### 4. Run First Analysis

```powershell
# Queue analysis job
curl -X POST http://localhost:8000/analyze `
  -H "Content-Type: application/json" `
  -d '{"brand":"Nike","limit":100,"include_reddit":true,"include_twitter":false}'

# Get results
curl "http://localhost:8000/results?brand=Nike&limit=50"
```

---

## 📁 Project Structure

```
backend/
├── app.py                    # FastAPI application
├── celery_app.py            # Celery worker
├── config.py                # Configuration
├── requirements.txt         # Dependencies
├── docker-compose.yml       # Container orchestration
├── migrate.py               # Database migrations
│
├── routes/                  # API endpoints
│   ├── health.py           # Health checks
│   ├── analyze.py          # Analysis jobs
│   ├── results.py          # Results retrieval
│   └── metrics.py          # Dashboard metrics
│
├── db/                      # Database layer
│   ├── base.py             # SQLAlchemy setup
│   ├── models.py           # Data models
│   └── crud.py             # Database operations
│
├── scrapers/               # Data collectors
│   ├── reddit_scraper.py   # Reddit API
│   └── twitter_scraper.py  # Twitter API
│
├── workers/                # Background tasks
│   └── tasks.py            # Celery tasks
│
├── ml/                     # Machine learning
│   ├── load_model.py       # Model loading
│   └── batch_infer.py      # Inference pipeline
│
└── utils/                  # Utilities
    ├── cache.py            # Redis cache manager
    ├── clean.py            # Text preprocessing
    └── context_filter.py   # Filtering & deduplication
```

---

## 🔧 Development Setup

### Local Python Environment (Optional)

For local development without Docker:

```powershell
# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Initialize database
python migrate.py

# Run API server
uvicorn app:app --reload --port 8000

# Run Celery worker (separate terminal)
celery -A celery_app worker --loglevel=info
```

---

## 📊 Database Schema

### Core Tables

**posts** - Social media data + ML enrichment

- `id`, `brand`, `platform`, `text`, `clean_text`
- `sentiment`, `confidence`, `emotions`, `topics`
- `polarity_score`, `intent`, `summary`

**brand_metrics** - Daily aggregated statistics

- Sentiment distribution, emotion counts, topic trends
- Cached for performance

**sentiment_timeseries** - Hourly sentiment trends

- Time-series data for charts

**analysis_tasks** - Job tracking

- Task status, progress, errors

---

## 🌐 API Endpoints

### Health & Status

- `GET /health` - Basic health check
- `GET /health/full` - Comprehensive system check

### Analysis

- `POST /analyze` - Queue new analysis job
  ```json
  {
    "brand": "Nike",
    "limit": 100,
    "include_reddit": true,
    "include_twitter": false
  }
  ```

### Results

- `GET /results?brand={brand}&limit={limit}` - Fetch analyzed posts
- `GET /results/{post_id}` - Get single post details

### Metrics (Dashboard)

- `GET /api/metrics/{brand}` - Full dashboard data
- `GET /api/metrics/{brand}/summary` - Quick stats
- `GET /api/metrics/{brand}/topics` - Topic distribution
- `GET /api/metrics/{brand}/emotions` - Emotion breakdown
- `GET /api/metrics/{brand}/trend` - Sentiment over time

---

## 🧪 Testing

```powershell
# Run test suite
pytest tests/

# Test specific endpoint
python -m pytest tests/test_api.py -v

# Manual API testing
.\test-api.ps1
```

---

## 🐳 Docker Commands

```powershell
# Start services
docker compose up -d

# View logs
docker compose logs -f api
docker compose logs -f worker

# Stop services
docker compose down

# Rebuild after changes
docker compose up --build

# Clean restart
docker compose down -v
docker compose up --build
```

---

## 🔍 Troubleshooting

### Database Connection Issues

```powershell
# Check PostgreSQL is running
docker compose ps

# Reset database
docker compose down -v
docker compose up -d
python migrate.py
```

### Redis Connection Issues

```powershell
# Test Redis
docker exec -it redis redis-cli ping
# Should return: PONG
```

### Worker Not Processing Tasks

```powershell
# Check worker logs
docker compose logs worker

# Restart worker
docker compose restart worker
```

### Import Errors

```powershell
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## 🚀 Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for:

- AWS ECS deployment guide
- Environment configuration
- Scaling strategies
- Monitoring setup
- CI/CD pipeline

---

## 📖 Additional Documentation

- [API_EXAMPLES.md](API_EXAMPLES.md) - Complete API usage examples
- [DATABASE.md](DATABASE.md) - Database architecture deep-dive
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide

---

## 🔐 Environment Variables

```env
# Application
APP_ENV=dev
API_HOST=0.0.0.0
API_PORT=8000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=branddb
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_URL=redis://localhost:6379/0

# Social Media APIs (Optional)
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_secret
REDDIT_USER_AGENT=BrandSentimentApp/0.1
TWITTER_BEARER_TOKEN=your_bearer_token

# ML Model
ML_BASE_MODEL=distilbert-base-uncased-finetuned-sst-2-english
ML_MODEL_PATH=./ml/custom_model/model_traced_cpu.pt
```

---

## 📝 Notes

- **Reddit scraping** works without credentials (limited rate)
- **Twitter scraping** requires bearer token
- **ML model** falls back to DistilBERT if custom model unavailable
- **Cache TTL**: Sentiment stats (1h), Daily metrics (24h), Tasks (5m)

---

## 🤝 Support

For issues or questions:

1. Check [Troubleshooting](#-troubleshooting) section
2. Review logs: `docker compose logs`
3. Test integration: `python verify_integration.py`
