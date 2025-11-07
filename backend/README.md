# Brand Perception Backend

FastAPI + Celery + Redis + PostgreSQL backend for brand sentiment analysis.

## Features

- **FastAPI** for the API gateway
- **Celery + Redis** for background scraping & ML jobs
- **PostgreSQL** (via SQLAlchemy) for durable storage
- **Cleaners + context filters** to ensure posts are actually about the brand
- **Pluggable ML** (drop in your trained Kaggle artifacts when ready)

## Project Structure

```
backend/
├─ app.py                    # FastAPI entrypoint
├─ celery_app.py            # Celery worker runner
├─ config.py                # Configuration & settings
├─ requirements.txt         # Python dependencies
├─ docker-compose.yml       # Docker orchestration
├─ Dockerfile.api           # API container
├─ Dockerfile.worker        # Celery worker container
├─ .env.example             # Environment variables template
│
├─ routes/                  # API endpoints
│   ├─ health.py           # Health check
│   ├─ analyze.py          # Queue analysis jobs
│   └─ results.py          # Fetch results
│
├─ db/                      # Database layer
│   ├─ base.py             # SQLAlchemy setup
│   ├─ models.py           # Post model
│   └─ crud.py             # Database operations
│
├─ utils/                   # Utilities
│   ├─ clean.py            # Text cleaning
│   └─ context_filter.py   # Context filtering & deduplication
│
├─ scrapers/               # Data collection
│   ├─ reddit_scraper.py   # Reddit scraper
│   └─ twitter_scraper.py  # Twitter scraper
│
├─ workers/                # Background tasks
│   └─ tasks.py            # Celery tasks
│
└─ ml/                     # Machine learning
    ├─ load_model.py       # Model loader
    └─ batch_infer.py      # Batch inference
```

## Quick Start

### Local Development

1. **Copy environment file:**
   ```bash
   cd backend
   Copy-Item .env.example .env
   ```

2. **Edit `.env` file:**
   - Add your Reddit API credentials (optional)
   - Add your Twitter Bearer token (optional)
   - Adjust other settings as needed

3. **Start services with Docker Compose:**
   ```bash
   docker compose up --build
   ```

4. **Access the API:**
   - API docs: http://localhost:8000/docs
   - Health check: http://localhost:8000/health

### Try It Out

**Queue an analysis job:**
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Nike",
    "limit": 100,
    "include_reddit": true,
    "include_twitter": false
  }'
```

**Get results:**
```bash
curl "http://localhost:8000/results?brand=Nike&limit=50"
```

## API Endpoints

### Health Check
- `GET /health` - Check API status

### Analysis
- `POST /analyze` - Queue a scraping and analysis job
  - Body: `{ "brand": "Nike", "limit": 100, "include_reddit": true, "include_twitter": true }`
  - Returns: `{ "task_id": "uuid", "status": "queued" }`

### Results
- `GET /results?brand={brand}&limit={limit}` - Fetch analyzed posts
  - Returns: Array of posts with sentiment, emotions, topics, etc.

## Common Pitfalls & Fixes

### 1. Scraping in the request thread → timeouts & rate limits
**Fix:** Always queue with Celery (already implemented)

### 2. No dedupe → swollen DB with repeated posts
**Fix:** Uses `dedupe_key(...)` on (brand, platform, text, timestamp)

### 3. Contextless keyword matches pollutes insights
**Fix:** Keyword guardrails + topic filtering via `context_filter.py`

### 4. Blocking ML per post → slow + expensive
**Fix:** Batch inference in `batch_infer.py`

### 5. Ignoring language → mixed output
**Fix:** Add language detection and filter to `lang='en'`

## Next Steps

1. **Add your API credentials** in `.env` file
2. **Replace placeholder ML models** with your trained Kaggle artifacts
3. **Extend keyword context filters** for more brands in `utils/context_filter.py`
4. **Add language detection** for multilingual support
5. **Deploy to production** with proper secrets management

## Requirements

- Docker & Docker Compose
- Python 3.11+ (for local development)
- Redis (provided via Docker)
- PostgreSQL (provided via Docker)

## License

MIT
