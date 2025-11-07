# Brand Perception Backend - Setup Complete! 🎉

## ✅ What's Been Created

Your complete FastAPI + Celery + Redis + PostgreSQL backend is ready!

### 📁 Project Structure

```
backend/
├── app.py                    # FastAPI application entry point
├── celery_app.py            # Celery worker configuration
├── config.py                # Settings & environment configuration
├── requirements.txt         # Python dependencies
├── docker-compose.yml       # Docker orchestration
├── Dockerfile.api           # API container definition
├── Dockerfile.worker        # Worker container definition
├── .env.example             # Environment template
├── .env                     # Your environment (edit this!)
├── .gitignore              # Git ignore rules
│
├── 📜 Documentation
│   ├── README.md           # Full documentation
│   └── QUICKSTART.md       # Quick start guide
│
├── 🚀 Scripts
│   ├── start.ps1           # Start all services
│   ├── stop.ps1            # Stop all services
│   ├── logs.ps1            # View logs
│   └── test-api.ps1        # Test the API
│
├── 🛣️ routes/              # API endpoints
│   ├── health.py          # Health check endpoint
│   ├── analyze.py         # Job queueing endpoint
│   └── results.py         # Results retrieval endpoint
│
├── 🗄️ db/                  # Database layer
│   ├── base.py            # SQLAlchemy setup
│   ├── models.py          # Post model definition
│   └── crud.py            # Database operations
│
├── 🧰 utils/               # Utility functions
│   ├── clean.py           # Text cleaning utilities
│   └── context_filter.py  # Context filtering & deduplication
│
├── 🔍 scrapers/            # Data collection
│   ├── reddit_scraper.py  # Reddit data scraper
│   └── twitter_scraper.py # Twitter data scraper
│
├── 👷 workers/             # Background processing
│   └── tasks.py           # Celery task definitions
│
└── 🧠 ml/                  # Machine learning
    ├── load_model.py      # Model loading & inference
    └── batch_infer.py     # Batch processing pipeline
```

## 🚀 Next Steps

### 1. Configure API Credentials (Optional but Recommended)

Edit `.env` file and add:

```env
# Reddit API (for Reddit scraping)
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_secret
REDDIT_USER_AGENT=BrandSentimentApp/0.1

# Twitter API (for Twitter scraping)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
```

**Don't have credentials yet?** No problem! The system will:
- Work with Reddit only (limited rate without auth)
- Skip Twitter scraping if no token is provided

### 2. Start the Backend

```powershell
# Option A: Use the convenience script
.\start.ps1

# Option B: Manual start
docker compose up --build -d
```

### 3. Verify It's Running

```powershell
# Test the health endpoint
Invoke-RestMethod http://localhost:8000/health

# Or open in browser
start http://localhost:8000/docs
```

### 4. Run Your First Analysis

```powershell
# Option A: Use the test script
.\test-api.ps1

# Option B: Manual test
$body = @{
    brand = "Nike"
    limit = 50
    include_reddit = $true
    include_twitter = $false
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/analyze" -Method Post -Body $body -ContentType "application/json"
```

## 📊 What This System Does

### 1. Scraping (Real-time or Background)
- Fetches posts from Reddit & Twitter about your brand
- Cleans and normalizes the text
- Filters out irrelevant posts using keyword context
- Deduplicates to prevent data bloat

### 2. ML Analysis (Batch Processing)
- **Sentiment**: Positive, Negative, or Mixed
- **Confidence**: 0-100% confidence score
- **Emotions**: Joy, Frustration, Neutral
- **Topics**: Pricing, Comfort, Delivery, General
- **Intent**: Query, Complaint, Praise, Feedback
- **Summary**: AI-generated insight
- **Polarity Score**: -1000 to +1000

### 3. Storage & Retrieval
- All data stored in PostgreSQL
- Fast retrieval by brand
- Time-series ordering
- Indexed for performance

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check API health |
| POST | `/analyze` | Queue brand analysis job |
| GET | `/results` | Retrieve analyzed posts |
| GET | `/docs` | Interactive API documentation |

## 🔧 Useful Commands

```powershell
# Start services
.\start.ps1

# Stop services
.\stop.ps1

# View logs
.\logs.ps1

# Test API
.\test-api.ps1

# Check status
docker compose ps

# Restart a service
docker compose restart api
docker compose restart worker

# View specific service logs
docker compose logs -f api
docker compose logs -f worker
docker compose logs -f postgres
docker compose logs -f redis
```

## 🏗️ Architecture

```
User Request
    ↓
[FastAPI API] ──→ [PostgreSQL]
    ↓                   ↑
[Redis Queue]           │
    ↓                   │
[Celery Worker] ────────┘
    ↓
[Reddit/Twitter API]
    ↓
[ML Models]
```

**Flow:**
1. User sends POST to `/analyze` with brand name
2. FastAPI queues job in Redis
3. Celery worker picks up job
4. Worker scrapes Reddit/Twitter
5. Worker runs ML analysis (sentiment, topics, etc.)
6. Worker stores results in PostgreSQL
7. User fetches results via GET `/results`

## ⚠️ Important Notes

### Common Pitfalls (Already Fixed!)

✅ **No blocking scraping** - All jobs run in background via Celery
✅ **Automatic deduplication** - Posts are deduplicated by hash
✅ **Context filtering** - Only relevant posts are analyzed
✅ **Batch inference** - ML runs on batches for efficiency
✅ **Language filtering** - Filters to English posts

### Production Checklist

Before deploying to production:

- [ ] Add real API credentials to `.env`
- [ ] Replace ML placeholders with your trained models
- [ ] Configure proper database backups
- [ ] Set up monitoring (Sentry, DataDog, etc.)
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Use Docker secrets for credentials
- [ ] Set up CI/CD pipeline
- [ ] Add authentication/authorization

## 📚 Documentation

- **QUICKSTART.md** - Detailed quick start guide
- **README.md** - Full project documentation
- **/docs** - Interactive API docs (http://localhost:8000/docs)

## 🐛 Troubleshooting

### Services won't start
```powershell
# Check Docker is running
docker --version

# Check port availability
netstat -ano | findstr "8000\|5432\|6379"
```

### No results
1. Check API credentials in `.env`
2. Verify worker is running: `docker compose ps worker`
3. Check worker logs: `docker compose logs worker`
4. Ensure brand name matches exactly

### Database errors
```powershell
docker compose restart postgres
docker compose logs postgres
```

## 🎓 Learning Resources

### FastAPI
- Official Docs: https://fastapi.tiangolo.com/
- Tutorial: https://fastapi.tiangolo.com/tutorial/

### Celery
- Official Docs: https://docs.celeryq.dev/
- Best Practices: https://docs.celeryq.dev/en/stable/userguide/tasks.html

### Docker
- Docker Compose: https://docs.docker.com/compose/

## 🚀 Extending the System

### Add New Scrapers
1. Create file in `scrapers/` (e.g., `instagram_scraper.py`)
2. Follow the pattern in `reddit_scraper.py`
3. Import in `workers/tasks.py`
4. Add to `scrape_and_analyze` task

### Add New ML Models
1. Replace placeholder models in `ml/load_model.py`
2. Update `batch_infer.py` with your pipeline
3. Retrain models with your Kaggle notebooks
4. Deploy model artifacts to `./models/`

### Add New Brands
Edit `utils/context_filter.py`:
```python
KEY_PHRASES = {
    "nike": ["shoe", "sneaker", "comfort", ...],
    "apple": ["iphone", "macbook", "ios", ...],
    "tesla": ["car", "ev", "autopilot", ...],
}
```

## 💡 Tips for Success

1. **Start small** - Test with `limit=10` first
2. **Monitor workers** - Watch `docker compose logs -f worker`
3. **Check health** - Visit `/health` regularly
4. **Use Swagger UI** - http://localhost:8000/docs for testing
5. **Read the logs** - Most issues are visible in logs

## 🎉 You're All Set!

Your brand sentiment analysis backend is ready to go. Start by running:

```powershell
.\start.ps1
```

Then visit http://localhost:8000/docs to explore the API!

---

Need help? Check:
- QUICKSTART.md for detailed guide
- README.md for full documentation
- Docker logs for debugging
