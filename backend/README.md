# Feedbot Backend

> **Production-Ready Brand Sentiment Analysis API**  
> FastAPI + Celery + Redis + PostgreSQL + Machine Learning

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🚀 Quick Start

```powershell
# 1. Setup environment
cd backend
cp .env.example .env

# 2. Start with Docker
docker compose up --build -d

# 3. Verify
curl http://localhost:8000/health
```

**Ready to use in 30 seconds!**

---

## 📚 Documentation Index

| Document                                     | Description                                               |
| -------------------------------------------- | --------------------------------------------------------- |
| **[QUICKSTART.md](QUICKSTART.md)**           | ⚡ 5-minute setup guide                                   |
| **[GETTING_STARTED.md](GETTING_STARTED.md)** | 📖 Complete setup, API usage, troubleshooting             |
| **[DEPLOYMENT.md](DEPLOYMENT.md)**           | 🚀 Production deployment (AWS ECS, K8s, Docker Swarm)     |
| **[CI-CD-PIPELINE.md](CI-CD-PIPELINE.md)**   | 🔄 Production-grade CI/CD with GitHub Actions             |
| **[API_EXAMPLES.md](API_EXAMPLES.md)**       | 🔌 Detailed API usage examples (PowerShell, curl, Python) |
| **[DATABASE.md](DATABASE.md)**               | 🗄️ Database architecture, schema, optimization            |

---

## ✨ Features

- **Real-time sentiment analysis** from Reddit & Twitter
- **Multi-dimensional ML insights**: sentiment, emotion, topics, intent
- **Production-grade architecture**: FastAPI, Celery, PostgreSQL, Redis
- **Auto-scaling workers** for background processing
- **Dashboard-ready APIs** with aggregated metrics
- **Context filtering** to ensure relevance
- **Caching layer** for performance optimization

---

## 🏗️ Architecture

```
Frontend (Next.js) → API Gateway (FastAPI) → PostgreSQL
                            ↓                    ↓
                     Celery Workers ←→ Redis Cache
                            ↓
                  Reddit/Twitter Scrapers + ML
```

---

## 📁 Project Structure

```
backend/
├── app.py                  # FastAPI application
├── celery_app.py          # Celery worker
├── config.py              # Configuration
├── docker-compose.yml     # Container orchestration
│
├── routes/                # API endpoints
├── db/                    # Database models & operations
├── scrapers/              # Social media data collectors
├── workers/               # Background tasks
├── ml/                    # Machine learning models
└── utils/                 # Utilities & caching
```

---

## 🌐 API Endpoints

### Core APIs

- `GET /health` - Health check
- `POST /analyze` - Queue analysis job
- `GET /results` - Fetch analyzed posts

### Dashboard Metrics

- `GET /api/metrics/{brand}` - Full dashboard data
- `GET /api/metrics/{brand}/summary` - Quick stats
- `GET /api/metrics/{brand}/topics` - Topic distribution
- `GET /api/metrics/{brand}/emotions` - Emotion breakdown
- `GET /api/metrics/{brand}/trend` - Time-series trends

**Full API documentation:** http://localhost:8000/docs

---

## 🧪 Testing

```powershell
# Run test suite
```

---

## 🐳 Docker Services

```powershell
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

**Services:**

- FastAPI (port 8000)
- Celery Worker
- PostgreSQL (port 5432)
- Redis (port 6379)

---

## ⚙️ Environment Configuration

See [.env.example](.env.example) for all configuration options.

**Key settings:**

- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `REDIS_URL`
- `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`
- `TWITTER_BEARER_TOKEN`
- `ML_MODEL_PATH`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pytest tests/`
5. Submit a pull request

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🆘 Support

- Check [GETTING_STARTED.md](GETTING_STARTED.md) for detailed guides
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- Run `python verify_integration.py` to diagnose issues

- Python 3.11+ (for local development)
- Redis (provided via Docker)
- PostgreSQL (provided via Docker)

## License

MIT
