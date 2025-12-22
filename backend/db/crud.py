from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_, desc
from datetime import datetime, timedelta, date
from db.models import Post, BrandMetrics, SentimentTimeseries, AnalysisTask
from utils.cache import CacheManager

# ============ Post Operations ============

def upsert_posts(db: Session, rows: list[dict]):
    """Insert new posts (skip if already exists)"""
    for r in rows:
        exists = db.get(Post, r["id"])
        if exists:
            continue
        db.add(Post(**r))
    db.commit()


def update_interpretations(db: Session, rows: list[dict]):
    """Update ML enrichment fields after model inference"""
    for r in rows:
        obj = db.get(Post, r["id"])
        if not obj:
            continue
        obj.sentiment = r.get("sentiment", obj.sentiment)
        obj.confidence = r.get("confidence", obj.confidence)
        obj.emotions = r.get("emotion", obj.emotions)
        obj.topics = r.get("topics", obj.topics)
        obj.intent = r.get("intent", obj.intent)
        obj.summary = r.get("summary", obj.summary)
        ps = r.get("polarity_score", None)
        if ps is not None:
            obj.polarity_score = int(ps * 1000)
    db.commit()


def fetch_results(db: Session, brand: str, limit: int = 100):
    """Get latest posts for a brand"""
    stmt = select(Post).where(Post.brand == brand).order_by(Post.created_at.desc()).limit(limit)
    return db.execute(stmt).scalars().all()


# ============ Metrics & Aggregation Operations ============

def compute_sentiment_stats(db: Session, brand: str, days: int = 30) -> dict:
    """Compute sentiment statistics for dashboard (checks cache first)"""
    cache_key = CacheManager.get_sentiment_stats_key(brand, days)
    cached = CacheManager.get(cache_key)
    if cached:
        return cached
    
    cutoff = datetime.utcnow() - timedelta(days=days)
    stmt = select(
        Post.sentiment,
        func.count(Post.id).label("count"),
        func.avg(Post.confidence).label("avg_confidence"),
    ).where(
        and_(Post.brand == brand, Post.created_at >= cutoff, Post.sentiment.isnot(None))
    ).group_by(Post.sentiment)
    
    results = db.execute(stmt).all()
    stats = {
        "positive": {"count": 0, "avg_confidence": 0},
        "negative": {"count": 0, "avg_confidence": 0},
        "mixed": {"count": 0, "avg_confidence": 0},
        "total": 0,
    }
    
    for sentiment, count, avg_conf in results:
        key = sentiment.lower()
        if key in stats:
            stats[key] = {"count": count, "avg_confidence": round(avg_conf or 0, 2)}
            stats["total"] += count
    
    CacheManager.set(cache_key, stats, CacheManager.SENTIMENT_STATS_TTL)
    return stats


def compute_trend_data(db: Session, brand: str, days: int = 7) -> list[dict]:
    """Get hourly sentiment trend (24h rolling window)"""
    cache_key = CacheManager.get_trend_key(brand, days)
    cached = CacheManager.get(cache_key)
    if cached:
        return cached
    
    cutoff = datetime.utcnow() - timedelta(days=days)
    stmt = select(
        func.date_trunc("hour", Post.created_at).label("hour"),
        Post.sentiment,
        func.count(Post.id).label("count"),
        func.avg(Post.confidence).label("avg_confidence"),
    ).where(
        and_(Post.brand == brand, Post.created_at >= cutoff, Post.sentiment.isnot(None))
    ).group_by(
        func.date_trunc("hour", Post.created_at),
        Post.sentiment
    ).order_by(
        func.date_trunc("hour", Post.created_at).desc()
    )
    
    results = db.execute(stmt).all()
    trend = []
    for hour, sentiment, count, avg_conf in results:
        trend.append({
            "hour": hour.isoformat() if hour else None,
            "sentiment": sentiment,
            "count": count,
            "avg_confidence": round(avg_conf or 0, 2),
        })
    
    CacheManager.set(cache_key, trend, CacheManager.SENTIMENT_STATS_TTL)
    return trend


def compute_topic_distribution(db: Session, brand: str, limit: int = 10) -> list[dict]:
    """Get top topics for brand (from JSON array in DB)"""
    stmt = select(Post.topics).where(
        and_(Post.brand == brand, Post.topics.isnot(None))
    ).order_by(Post.created_at.desc()).limit(100)
    
    topic_counts = {}
    posts = db.execute(stmt).scalars().all()
    
    for topics_json in posts:
        if isinstance(topics_json, list):
            for topic in topics_json:
                topic_name = topic.get("topic") if isinstance(topic, dict) else str(topic)
                topic_counts[topic_name] = topic_counts.get(topic_name, 0) + 1
    
    sorted_topics = sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)[:limit]
    return [{"topic": name, "count": count} for name, count in sorted_topics]


def compute_emotion_distribution(db: Session, brand: str, limit: int = 10) -> list[dict]:
    """Get top emotions for brand (from JSON array in DB)"""
    stmt = select(Post.emotions).where(
        and_(Post.brand == brand, Post.emotions.isnot(None))
    ).order_by(Post.created_at.desc()).limit(100)
    
    emotion_counts = {}
    posts = db.execute(stmt).scalars().all()
    
    for emotions_json in posts:
        if isinstance(emotions_json, list):
            for emotion in emotions_json:
                emotion_name = emotion.get("name") if isinstance(emotion, dict) else str(emotion)
                emotion_counts[emotion_name] = emotion_counts.get(emotion_name, 0) + 1
    
    sorted_emotions = sorted(emotion_counts.items(), key=lambda x: x[1], reverse=True)[:limit]
    return [{"emotion": name, "count": count} for name, count in sorted_emotions]


def aggregate_daily_metrics(db: Session, brand: str, target_date: date = None):
    """Compute and store daily aggregated metrics"""
    if target_date is None:
        target_date = date.today()
    
    # Check if already computed
    existing = db.execute(
        select(BrandMetrics).where(
            and_(BrandMetrics.brand == brand, BrandMetrics.date == target_date)
        )
    ).scalar_one_or_none()
    
    if existing:
        return existing
    
    # Compute stats
    start = datetime.combine(target_date, datetime.min.time())
    end = datetime.combine(target_date, datetime.max.time())
    
    posts = db.execute(
        select(Post).where(
            and_(
                Post.brand == brand,
                Post.created_at >= start,
                Post.created_at <= end,
                Post.sentiment.isnot(None)
            )
        )
    ).scalars().all()
    
    total = len(posts)
    if total == 0:
        return None
    
    positive = sum(1 for p in posts if p.sentiment == "Positive")
    negative = sum(1 for p in posts if p.sentiment == "Negative")
    mixed = sum(1 for p in posts if p.sentiment == "Mixed")
    
    # Polarity: (positive - negative) / total
    polarity = ((positive - negative) / total) if total > 0 else 0
    
    avg_confidence = sum(p.confidence or 0 for p in posts) / total if total > 0 else 0
    
    # Emotion distribution
    emotion_counts = {}
    for p in posts:
        if p.emotions and isinstance(p.emotions, list):
            for emotion in p.emotions:
                name = emotion.get("name") if isinstance(emotion, dict) else str(emotion)
                emotion_counts[name] = emotion_counts.get(name, 0) + 1
    
    # Topic distribution
    topic_counts = {}
    for p in posts:
        if p.topics and isinstance(p.topics, list):
            for topic in p.topics:
                name = topic.get("topic") if isinstance(topic, dict) else str(topic)
                topic_counts[name] = topic_counts.get(name, 0) + 1
    
    # Store in DB
    metric = BrandMetrics(
        brand=brand,
        date=target_date,
        total_posts=total,
        avg_sentiment_score=polarity,
        positive_count=positive,
        negative_count=negative,
        mixed_count=mixed,
        avg_confidence=round(avg_confidence, 2),
        emotion_distribution=emotion_counts,
        topic_distribution=topic_counts,
    )
    db.add(metric)
    db.commit()
    db.refresh(metric)
    
    # Invalidate cache
    CacheManager.invalidate_brand(brand)
    
    return metric


# ============ Task Tracking Operations ============

def create_task(db: Session, task_id: str, brand: str) -> AnalysisTask:
    """Create task record for tracking"""
    task = AnalysisTask(id=task_id, brand=brand, status="pending")
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task_progress(db: Session, task_id: str, status: str, progress: int, total: int = None, analyzed: int = None):
    """Update task progress"""
    task = db.get(AnalysisTask, task_id)
    if not task:
        return
    
    task.status = status
    task.progress = progress
    if total is not None:
        task.total_posts = total
    if analyzed is not None:
        task.analyzed_posts = analyzed
    if status == "completed":
        task.completed_at = datetime.utcnow()
    
    db.commit()
    
    # Update cache
    cache_key = CacheManager.get_task_status_key(task_id)
    CacheManager.set({
        "id": task.id,
        "status": task.status,
        "progress": task.progress,
        "total_posts": task.total_posts,
        "analyzed_posts": task.analyzed_posts,
    }, CacheManager.TASK_STATUS_TTL)


def get_task_status(db: Session, task_id: str) -> dict:
    """Get task status (checks cache first)"""
    cache_key = CacheManager.get_task_status_key(task_id)
    cached = CacheManager.get(cache_key)
    if cached:
        return cached
    
    task = db.get(AnalysisTask, task_id)
    if not task:
        return None
    
    result = {
        "id": task.id,
        "brand": task.brand,
        "status": task.status,
        "progress": task.progress,
        "total_posts": task.total_posts,
        "analyzed_posts": task.analyzed_posts,
        "error": task.error_message,
    }
    
    CacheManager.set(cache_key, result, CacheManager.TASK_STATUS_TTL)
    return result

