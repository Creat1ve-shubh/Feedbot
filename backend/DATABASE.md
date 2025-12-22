# Database Engineering Guide

## Architecture Overview

Feedbot uses a **PostgreSQL primary database** with **Redis caching layer** for optimal performance and scalability.

### Data Flow

```
Frontend (Next.js)
    ↓
Next.js API Routes (/api/analyze, /api/results)
    ↓
Python Backend (FastAPI) ← Metrics Routes (/api/metrics/*)
    ↓
┌─────────────────────────┐
│   PostgreSQL Database   │
│  - Raw Posts            │ ← Celery Worker (scrape_and_analyze)
│  - ML Enrichment        │
│  - Aggregated Metrics   │
└─────────────────────────┘
    ↓
Redis Cache (1h TTL)
    ↓
Frontend Dashboard Display
```

---

## Database Schema

### 1. **posts** (Raw social media data)

Stores all scraped posts with ML enrichment.

| Column           | Type             | Purpose                                               |
| ---------------- | ---------------- | ----------------------------------------------------- |
| `id`             | VARCHAR(PRIMARY) | Unique hash: `hash(brand\|platform\|text\|timestamp)` |
| `brand`          | VARCHAR(INDEXED) | Target brand                                          |
| `platform`       | VARCHAR(INDEXED) | "twitter" or "reddit"                                 |
| `text`           | TEXT             | Original post content                                 |
| `clean_text`     | TEXT             | Preprocessed text (lowercase, no URLs)                |
| `author`         | VARCHAR          | Post author handle                                    |
| `lang`           | VARCHAR          | Detected language (ISO 639-1)                         |
| `created_at`     | TIMESTAMP(TZ)    | Post creation timestamp                               |
| `scraped_at`     | TIMESTAMP(TZ)    | When we scraped it                                    |
| **ML Fields**    |                  |                                                       |
| `sentiment`      | VARCHAR(INDEXED) | "Positive" \| "Negative" \| "Mixed"                   |
| `confidence`     | INT              | 0-100 (percentage)                                    |
| `emotions`       | JSON             | `[{"name":"Joy","score":0.85}]`                       |
| `topics`         | JSON             | `[{"topic":"Product","posts":5}]`                     |
| `intent`         | VARCHAR          | "Complaint" \| "Praise" \| "Question" \| etc          |
| `summary`        | TEXT             | AI-generated summary                                  |
| `polarity_score` | INT              | -1000 to +1000 (x1000 for precision)                  |
| `meta`           | JSON             | Extensible metadata                                   |

**Indexes:**

- `(brand, created_at DESC)` - Dashboard filtering
- `(sentiment)` - Sentiment analysis
- `(platform)` - Source filtering
- `(brand, platform, created_at DESC)` - Combined queries

**Size Estimate:**

- ~500 bytes per row (text + JSON)
- 1M rows = ~500 MB
- 10M rows = ~5 GB

---

### 2. **brand_metrics** (Daily aggregations)

Pre-computed daily rollups for fast dashboard queries.

| Column                 | Type             | Purpose                                  |
| ---------------------- | ---------------- | ---------------------------------------- |
| `id`                   | INT(PRIMARY)     | Auto-increment                           |
| `brand`                | VARCHAR(INDEXED) | Brand name                               |
| `date`                 | DATE             | Day of metrics                           |
| `total_posts`          | INT              | Posts analyzed that day                  |
| `avg_sentiment_score`  | FLOAT            | (-1 to 1): (pos - neg) / total           |
| `positive_count`       | INT              | # positive posts                         |
| `negative_count`       | INT              | # negative posts                         |
| `mixed_count`          | INT              | # mixed posts                            |
| `avg_confidence`       | FLOAT            | Mean confidence of sentiment predictions |
| `emotion_distribution` | JSON             | `{"Joy": 125, "Concern": 87}`            |
| `topic_distribution`   | JSON             | `{"Product": 234, "Price": 156}`         |
| `created_at`           | TIMESTAMP(TZ)    | When we computed it                      |
| `updated_at`           | TIMESTAMP(TZ)    | Last update                              |

**Constraints:**

- `UNIQUE(brand, date)` - One metric per brand per day

**Indexes:**

- `(brand, date)` - Dashboard lookups

**Size Estimate:**

- ~2 KB per row
- 365 days × 100 brands = 36,500 rows = ~73 MB

---

### 3. **sentiment_timeseries** (Hourly trends)

Time-series data for trend visualization (rolling 7-day window).

| Column           | Type                   | Purpose                             |
| ---------------- | ---------------------- | ----------------------------------- |
| `id`             | INT(PRIMARY)           | Auto-increment                      |
| `brand`          | VARCHAR(INDEXED)       | Brand name                          |
| `hour`           | TIMESTAMP(TZ, INDEXED) | Hour timestamp                      |
| `sentiment`      | VARCHAR                | "Positive" \| "Negative" \| "Mixed" |
| `count`          | INT                    | # posts that hour                   |
| `avg_confidence` | FLOAT                  | Mean confidence                     |
| `created_at`     | TIMESTAMP(TZ)          | Computed timestamp                  |

**Constraints:**

- `UNIQUE(brand, hour, sentiment)` - One row per sentiment per brand per hour

**Indexes:**

- `(brand, hour DESC)` - Trend queries

**Size Estimate:**

- ~100 bytes per row
- 24 hours × 3 sentiments × 100 brands = 7,200 rows/day = ~720 KB/day
- 7-day retention = ~5 MB

---

### 4. **analysis_tasks** (Job tracking)

Celery task status tracking for user progress updates.

| Column           | Type             | Purpose                                              |
| ---------------- | ---------------- | ---------------------------------------------------- |
| `id`             | VARCHAR(PRIMARY) | Celery task UUID                                     |
| `brand`          | VARCHAR(INDEXED) | Brand being analyzed                                 |
| `status`         | VARCHAR          | "pending" \| "processing" \| "completed" \| "failed" |
| `progress`       | INT              | 0-100 (percentage)                                   |
| `total_posts`    | INT              | Posts found                                          |
| `analyzed_posts` | INT              | Posts processed through ML                           |
| `error_message`  | TEXT             | Failure reason (if any)                              |
| `created_at`     | TIMESTAMP(TZ)    | Task start time                                      |
| `updated_at`     | TIMESTAMP(TZ)    | Last status update                                   |
| `completed_at`   | TIMESTAMP(TZ)    | Completion time                                      |

**Indexes:**

- `(brand, status)` - Find active jobs

**TTL:** Auto-delete rows older than 7 days

**Size Estimate:**

- ~500 bytes per row
- ~1,000 tasks/day = ~500 KB/day
- 7-day retention = ~3.5 MB

---

## Setup Instructions

### Step 1: Create Database

```bash
# Using Docker Compose (Recommended)
docker-compose up -d postgres
```

Or manually:

```bash
createdb branddb -U postgres
```

### Step 2: Configure Environment

```bash
# .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=branddb
DB_USER=postgres
DB_PASSWORD=your_secure_password

REDIS_URL=redis://localhost:6379/0

# Optional: Use SQLite for development
# DB_URL=sqlite:///./feedbot.db
```

### Step 3: Run Migrations

```bash
cd backend
python migrate.py
```

Expected output:

```
🔄 Creating database tables...
✅ Tables created successfully

📊 Database tables (4):
  • posts (24 columns)
  • brand_metrics (12 columns)
  • sentiment_timeseries (7 columns)
  • analysis_tasks (9 columns)

✨ Migration complete!
```

### Step 4: Verify Setup

```bash
# Check health
curl http://localhost:8000/health/full

# Expected:
{
  "status": "healthy",
  "timestamp": "2025-12-22T10:30:00",
  "checks": {
    "api": "ok",
    "database": "ok",
    "redis": "ok",
    "model": "ok"
  }
}
```

---

## Caching Strategy

### Redis Keys by Type

| Key Pattern                         | TTL | Purpose         |
| ----------------------------------- | --- | --------------- |
| `feedbot:sentiment:{brand}:{days}d` | 1h  | Sentiment stats |
| `feedbot:metrics:{brand}:{date}`    | 24h | Daily metrics   |
| `feedbot:trend:{brand}:{days}d`     | 1h  | Trend data      |
| `feedbot:task:{task_id}`            | 5m  | Task status     |

### Cache Invalidation

- **Sentiment/Trend**: Auto-expires after 1h (user refreshes)
- **Daily Metrics**: Auto-expires after 24h
- **Task Status**: Auto-expires after 5m (job completion)
- **Manual**: `CacheManager.invalidate_brand(brand)` after new analysis

---

## Query Examples

### Get Dashboard Metrics (Cached)

```python
# Frontend calls:
GET /api/metrics/Nike?days=30

# Backend:
1. Check Redis cache: feedbot:sentiment:Nike:30d
2. If hit: Return cached (1h old)
3. If miss: Query DB → Cache → Return
4. DB query groups by sentiment, sums confidences
```

### Compute Trends (7-day)

```python
# Frontend calls:
GET /api/metrics/Nike/trend?days=7

# Backend:
1. Query posts from last 7 days
2. Group by DATE_TRUNC('hour', created_at), sentiment
3. Cache result for 1h
4. Return 168 data points (7d × 24h)
```

### Update Dashboard After Analysis

```python
# After Celery task completes:
1. Store posts in 'posts' table
2. Call aggregate_daily_metrics(brand, today)
3. Stores in 'brand_metrics' table
4. Invalidates cache: CacheManager.invalidate_brand(brand)
5. Frontend polls GET /api/results → gets fresh data
```

---

## Performance Optimization

### Current Limitations

| Metric                 | Threshold  | Solution               |
| ---------------------- | ---------- | ---------------------- |
| Monthly data query     | >30M rows  | Add materialized views |
| Sentiment distribution | >50K posts | Pre-aggregate daily    |
| Trend visualization    | Live data  | Cache with 5-min TTL   |

### Scaling Plan

**Phase 1 (Current - 10M rows):**

- PostgreSQL single instance
- Redis caching layer
- Indexes on brand, sentiment, created_at

**Phase 2 (100M rows):**

- Add read replicas for reporting
- Materialized views for common queries
- Archive old posts to S3

**Phase 3 (1B+ rows):**

- Time-series database (TimescaleDB)
- Separate hot (30d) and cold storage
- ElasticSearch for full-text search

---

## Migration Management

### Reset Database (DEV ONLY)

```bash
python migrate.py --reset
# Type "yes" to confirm
```

### Backup Database

```bash
# PostgreSQL
pg_dump branddb > backup_$(date +%Y%m%d).sql

# Restore
psql branddb < backup_20251222.sql
```

### Monitor Database

```bash
# Check table sizes
psql -c "SELECT schemaname, tablename,
         pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
         FROM pg_tables
         WHERE schemaname='public'
         ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"

# Check index usage
psql -c "SELECT schemaname, tablename, indexname, idx_scan
         FROM pg_stat_user_indexes
         ORDER BY idx_scan DESC;"
```

---

## Troubleshooting

### Database Connection Error

```
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) could not connect
```

**Solution:**

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection string
env | grep DB_

# Test connection
psql -h localhost -U postgres -d branddb
```

### Redis Connection Error

```
redis.exceptions.ConnectionError: Error 61 connecting
```

**Solution:**

```bash
# Check Redis is running
docker ps | grep redis

# Test connection
redis-cli ping
```

### Duplicate Key Error

```
sqlalchemy.exc.IntegrityError: (psycopg2.IntegrityError) duplicate key
```

**Solution:**

```bash
# Delete and re-insert
DELETE FROM posts WHERE id = 'duplicate_id';
DELETE FROM brand_metrics WHERE brand = 'Nike' AND date = '2025-12-22';

# Or reset everything
python migrate.py --reset
```

---

## Summary

✅ **Implemented:**

- PostgreSQL schema with 4 tables
- Composite indexes for common queries
- Redis caching with TTL management
- CRUD operations for metrics aggregation
- Task tracking for Celery jobs
- Comprehensive health checks

**Next Steps:**

1. Run `python migrate.py` to create tables
2. Verify with `/health/full` endpoint
3. Test metrics with `GET /api/metrics/{brand}`
4. Monitor with database admin queries
