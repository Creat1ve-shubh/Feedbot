from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, Index
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

Index("ix_posts_brand_platform_time", Post.brand, Post.platform, Post.created_at)
