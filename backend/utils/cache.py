import json
import redis
from typing import Any, Optional
from functools import wraps
from datetime import datetime, timedelta
from config import settings

# Initialize Redis client
try:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    redis_client.ping()
except Exception as e:
    print(f"Warning: Redis unavailable: {e}. Caching disabled.")
    redis_client = None


class CacheManager:
    """Centralized cache management for dashboard metrics"""
    
    PREFIX = "feedbot:"
    SENTIMENT_STATS_TTL = 3600          # 1 hour
    BRAND_METRICS_TTL = 86400            # 24 hours
    TASK_STATUS_TTL = 300                # 5 minutes
    
    @staticmethod
    def _get_key(*parts: str) -> str:
        """Build cache key from parts"""
        return CacheManager.PREFIX + ":".join(str(p) for p in parts)
    
    @staticmethod
    def get(key: str) -> Optional[Any]:
        """Get value from cache"""
        if not redis_client:
            return None
        try:
            value = redis_client.get(key)
            return json.loads(value) if value else None
        except Exception as e:
            print(f"Cache get error: {e}")
            return None
    
    @staticmethod
    def set(key: str, value: Any, ttl: int = 3600) -> bool:
        """Set value in cache with TTL"""
        if not redis_client:
            return False
        try:
            redis_client.setex(key, ttl, json.dumps(value))
            return True
        except Exception as e:
            print(f"Cache set error: {e}")
            return False
    
    @staticmethod
    def delete(key: str) -> bool:
        """Delete cache key"""
        if not redis_client:
            return False
        try:
            redis_client.delete(key)
            return True
        except Exception as e:
            print(f"Cache delete error: {e}")
            return False
    
    @staticmethod
    def get_sentiment_stats_key(brand: str, days: int = 30) -> str:
        """Cache key for sentiment statistics"""
        return CacheManager._get_key("sentiment", brand, f"{days}d")
    
    @staticmethod
    def get_brand_metrics_key(brand: str, date: str) -> str:
        """Cache key for daily metrics"""
        return CacheManager._get_key("metrics", brand, date)
    
    @staticmethod
    def get_trend_key(brand: str, days: int = 7) -> str:
        """Cache key for trend data"""
        return CacheManager._get_key("trend", brand, f"{days}d")
    
    @staticmethod
    def get_task_status_key(task_id: str) -> str:
        """Cache key for task status"""
        return CacheManager._get_key("task", task_id)
    
    @staticmethod
    def invalidate_brand(brand: str):
        """Invalidate all caches for a brand"""
        if not redis_client:
            return
        try:
            pattern = CacheManager.PREFIX + f"*{brand}*"
            keys = redis_client.keys(pattern)
            if keys:
                redis_client.delete(*keys)
        except Exception as e:
            print(f"Cache invalidation error: {e}")


def cache_result(ttl: int = 3600):
    """Decorator to cache function results"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Simple key generation from function name and args
            key = f"{CacheManager.PREFIX}{func.__name__}:{str(args)}:{str(kwargs)}"
            
            # Try to get from cache
            cached = CacheManager.get(key)
            if cached is not None:
                return cached
            
            # Compute and cache
            result = func(*args, **kwargs)
            CacheManager.set(key, result, ttl)
            return result
        
        return wrapper
    return decorator
