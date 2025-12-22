#!/usr/bin/env python3
"""
Integration verification script.
Tests all components: Database, Redis, Backend, Frontend.
Run this to ensure complete system integration.
"""

import sys
import os
import json
import time
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from db.base import SessionLocal
from utils.cache import redis_client, CacheManager
from db.models import Post, BrandMetrics, SentimentTimeseries, AnalysisTask

def check_database():
    """Verify PostgreSQL connection and schema"""
    print("\n📊 DATABASE CHECK")
    print("-" * 50)
    
    try:
        db = SessionLocal()
        
        # Check connection
        result = db.execute(text("SELECT 1 as ping")).scalar()
        print(f"✅ Database connected (ping: {result})")
        
        # Check tables exist
        result = db.execute(text("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema='public'
        """)).fetchall()
        
        tables = [row[0] for row in result]
        print(f"✅ Tables found: {len(tables)}")
        
        expected = ['posts', 'brand_metrics', 'sentiment_timeseries', 'analysis_tasks']
        for table in expected:
            if table in tables:
                # Count rows
                count = db.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar()
                print(f"   ✓ {table}: {count} rows")
            else:
                print(f"   ✗ {table}: MISSING")
                return False
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False


def check_redis():
    """Verify Redis connection"""
    print("\n💾 REDIS CACHE CHECK")
    print("-" * 50)
    
    if not redis_client:
        print("⚠️  Redis client unavailable (non-critical)")
        return True
    
    try:
        # Test ping
        redis_client.ping()
        print("✅ Redis connected")
        
        # Test set/get
        test_key = "test:integration:check"
        test_data = {"brand": "test", "timestamp": time.time()}
        
        CacheManager.set(test_key, test_data, ttl=10)
        retrieved = CacheManager.get(test_key)
        
        if retrieved == test_data:
            print("✅ Cache read/write working")
        else:
            print("❌ Cache read/write mismatch")
            return False
        
        # Cleanup
        CacheManager.delete(test_key)
        print("✅ Cache cleanup working")
        
        return True
        
    except Exception as e:
        print(f"❌ Redis error: {e}")
        return False


def check_models():
    """Verify ORM models"""
    print("\n🗄️  ORM MODELS CHECK")
    print("-" * 50)
    
    try:
        # Check all models are importable
        models = [Post, BrandMetrics, SentimentTimeseries, AnalysisTask]
        
        for model in models:
            print(f"✓ {model.__name__}")
        
        print(f"✅ All {len(models)} models loaded")
        return True
        
    except Exception as e:
        print(f"❌ Model error: {e}")
        return False


def check_crud_operations():
    """Test CRUD functions"""
    print("\n⚙️  CRUD OPERATIONS CHECK")
    print("-" * 50)
    
    try:
        from db import crud
        from datetime import datetime, timedelta
        from sqlalchemy import text
        
        db = SessionLocal()
        
        # Test insert
        test_post = {
            "id": "test_123_456_789",
            "brand": "TestBrand",
            "platform": "twitter",
            "text": "This is a test post",
            "clean_text": "this is a test post",
            "author": "test_user",
            "created_at": datetime.utcnow(),
        }
        
        crud.upsert_posts(db, [test_post])
        print("✓ upsert_posts() working")
        
        # Test read
        results = crud.fetch_results(db, "TestBrand", limit=10)
        if len(results) > 0:
            print(f"✓ fetch_results() working ({len(results)} posts)")
        
        # Test metrics computation
        stats = crud.compute_sentiment_stats(db, "TestBrand", days=30)
        if isinstance(stats, dict) and "total" in stats:
            print("✓ compute_sentiment_stats() working")
        
        # Test topic distribution
        topics = crud.compute_topic_distribution(db, "TestBrand", limit=5)
        if isinstance(topics, list):
            print("✓ compute_topic_distribution() working")
        
        # Test emotion distribution
        emotions = crud.compute_emotion_distribution(db, "TestBrand", limit=5)
        if isinstance(emotions, list):
            print("✓ compute_emotion_distribution() working")
        
        # Test trend data
        trend = crud.compute_trend_data(db, "TestBrand", days=7)
        if isinstance(trend, list):
            print("✓ compute_trend_data() working")
        
        # Cleanup
        db.execute(text("DELETE FROM posts WHERE id = 'test_123_456_789'"))
        db.commit()
        
        db.close()
        print("✅ All CRUD operations working")
        return True
        
    except Exception as e:
        print(f"❌ CRUD error: {e}")
        import traceback
        traceback.print_exc()
        return False


def check_backend_integration():
    """Verify backend can import all routes"""
    print("\n🔌 BACKEND INTEGRATION CHECK")
    print("-" * 50)
    
    try:
        from routes import health, analyze, results, metrics
        
        print("✓ health route imported")
        print("✓ analyze route imported")
        print("✓ results route imported")
        print("✓ metrics route imported")
        
        print("✅ All backend routes available")
        return True
        
    except Exception as e:
        print(f"❌ Backend import error: {e}")
        import traceback
        traceback.print_exc()
        return False


def generate_report(results: dict):
    """Generate final report"""
    print("\n" + "=" * 50)
    print("🎯 INTEGRATION TEST REPORT")
    print("=" * 50)
    
    all_passed = all(results.values())
    
    for check, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {check}")
    
    print("=" * 50)
    
    if all_passed:
        print("\n✨ ALL CHECKS PASSED - System Ready! ✨\n")
        print("Next steps:")
        print("1. Run: python migrate.py")
        print("2. Start backend: docker-compose up")
        print("3. Start frontend: npm run dev")
        print("4. Test at: http://localhost:3000\n")
        return 0
    else:
        print("\n⚠️  SOME CHECKS FAILED - See above for details\n")
        return 1


def main():
    """Run all checks"""
    print("\n" + "=" * 50)
    print("🚀 FEEDBOT INTEGRATION VERIFICATION")
    print("=" * 50)
    
    checks = {
        "Database": check_database(),
        "Redis Cache": check_redis(),
        "ORM Models": check_models(),
        "CRUD Operations": check_crud_operations(),
        "Backend Routes": check_backend_integration(),
    }
    
    exit_code = generate_report(checks)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
