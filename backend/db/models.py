from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, Index, Float, Date, UniqueConstraint
from sqlalchemy.sql import func
from db.base import Base

class Post(Base):
    __tablename__ = "posts"
    id = Column(String, primary_key=True, index=True)           # hash(brand|platform|text|timestamp)
    brand = Column(String, index=True)
    platform = Column(String, index=True)                       # "twitter" | "reddit"
    text = Column(Text, nullable=False)
    clean_text = Column(Text, nullable=False)
    author = Column(String, nullable=True)
    lang = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)
    scraped_at = Column(DateTime(timezone=True), server_default=func.now())

    # ML fields
    sentiment = Column(String, index=True)                      # Positive|Negative|Mixed
    confidence = Column(Integer, nullable=True)                 # 0-100 (store pct)
    emotions = Column(JSON, nullable=True)                      # ["Joy","Frustration"]
    topics = Column(JSON, nullable=True)                        # ["Comfort","Pricing"]
    intent = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    polarity_score = Column(Integer, nullable=True)             # store x1000 int
    meta = Column(JSON, nullable=True)


class BrandMetrics(Base):
    """Daily aggregated metrics per brand"""
    __tablename__ = "brand_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, index=True, nullable=False)
    date = Column(Date, nullable=False)
    total_posts = Column(Integer, default=0)
    avg_sentiment_score = Column(Float, nullable=True)          # -1 to 1 scale
    positive_count = Column(Integer, default=0)
    negative_count = Column(Integer, default=0)
    mixed_count = Column(Integer, default=0)
    avg_confidence = Column(Float, nullable=True)
    emotion_distribution = Column(JSON, nullable=True)          # {"Joy": 45, "Concern": 23}
    topic_distribution = Column(JSON, nullable=True)            # {"Product": 120, "Price": 80}
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        UniqueConstraint('brand', 'date', name='uq_brand_date'),
        Index("ix_brand_metrics_brand_date", "brand", "date"),
    )


class SentimentTimeseries(Base):
    """Hourly sentiment distribution for trend analysis"""
    __tablename__ = "sentiment_timeseries"
    
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, index=True, nullable=False)
    hour = Column(DateTime(timezone=True), index=True, nullable=False)
    sentiment = Column(String, nullable=False)                  # Positive|Negative|Mixed
    count = Column(Integer, default=0)
    avg_confidence = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        UniqueConstraint('brand', 'hour', 'sentiment', name='uq_sentiment_ts'),
        Index("ix_sentiment_ts_brand_hour", "brand", "hour"),
    )


class AnalysisTask(Base):
    """Track Celery task status"""
    __tablename__ = "analysis_tasks"
    
    id = Column(String, primary_key=True)                       # Celery task_id
    brand = Column(String, index=True, nullable=False)
    status = Column(String, default="pending")                  # pending|processing|completed|failed
    progress = Column(Integer, default=0)                       # 0-100
    total_posts = Column(Integer, default=0)
    analyzed_posts = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    __table_args__ = (
        Index("ix_task_brand_status", "brand", "status"),
    )


# Composite indexes for common queries
Index("ix_posts_brand_platform_time", Post.brand, Post.platform, Post.created_at)
Index("ix_posts_sentiment_created", Post.sentiment, Post.created_at)
Index("ix_posts_confidence", Post.confidence)
