from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from db.base import get_db
from db import crud
from pydantic import BaseModel

router = APIRouter()

# ============ Response Models ============

class SentimentStats(BaseModel):
    positive: dict
    negative: dict
    mixed: dict
    total: int

class TopicItem(BaseModel):
    topic: str
    count: int

class EmotionItem(BaseModel):
    emotion: str
    count: int

class TrendPoint(BaseModel):
    hour: str
    sentiment: str
    count: int
    avg_confidence: float

class DashboardMetrics(BaseModel):
    sentiment_stats: SentimentStats
    top_topics: list[TopicItem]
    top_emotions: list[EmotionItem]
    trend_data: list[TrendPoint]

# ============ API Endpoints ============

@router.get("/metrics/{brand}", response_model=DashboardMetrics)
def get_dashboard_metrics(
    brand: str,
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive metrics for dashboard.
    - Sentiment distribution with confidence scores
    - Top topics and emotions
    - Sentiment trend over time
    """
    sentiment_stats = crud.compute_sentiment_stats(db, brand, days)
    top_topics = crud.compute_topic_distribution(db, brand, limit=10)
    top_emotions = crud.compute_emotion_distribution(db, brand, limit=10)
    trend_data = crud.compute_trend_data(db, brand, days=7)
    
    return DashboardMetrics(
        sentiment_stats=sentiment_stats,
        top_topics=top_topics,
        top_emotions=top_emotions,
        trend_data=trend_data,
    )


@router.get("/metrics/{brand}/summary")
def get_summary(
    brand: str,
    db: Session = Depends(get_db)
):
    """Quick summary: total posts, sentiment distribution"""
    stats = crud.compute_sentiment_stats(db, brand, days=30)
    return {
        "brand": brand,
        "total_posts": stats["total"],
        "sentiment_distribution": {
            "positive": stats["positive"]["count"],
            "negative": stats["negative"]["count"],
            "mixed": stats["mixed"]["count"],
        },
        "avg_confidence": {
            "positive": stats["positive"]["avg_confidence"],
            "negative": stats["negative"]["avg_confidence"],
            "mixed": stats["mixed"]["avg_confidence"],
        }
    }


@router.get("/metrics/{brand}/topics")
def get_topics(
    brand: str,
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get top topics mentioned about brand"""
    topics = crud.compute_topic_distribution(db, brand, limit=limit)
    return {"brand": brand, "topics": topics}


@router.get("/metrics/{brand}/emotions")
def get_emotions(
    brand: str,
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get top emotions detected in posts"""
    emotions = crud.compute_emotion_distribution(db, brand, limit=limit)
    return {"brand": brand, "emotions": emotions}


@router.get("/metrics/{brand}/trend")
def get_trend(
    brand: str,
    days: int = Query(7, ge=1, le=30),
    db: Session = Depends(get_db)
):
    """Get sentiment trend over time (hourly granularity)"""
    trend = crud.compute_trend_data(db, brand, days=days)
    return {
        "brand": brand,
        "days": days,
        "data_points": len(trend),
        "trend": trend
    }
