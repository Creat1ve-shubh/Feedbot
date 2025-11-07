import os
from celery import Celery
from config import settings
from db.base import SessionLocal
from db import crud
from scrapers.reddit_scraper import fetch_reddit_posts
from scrapers.twitter_scraper import fetch_twitter_posts
from ml.batch_infer import batch_interpret

celery = Celery("brand_tasks", broker=settings.REDIS_URL, backend=settings.REDIS_URL)

@celery.task(bind=True)
def scrape_and_analyze(self, brand: str, limit: int = 100, include_twitter: bool = True, include_reddit: bool = True):
    db = SessionLocal()
    try:
        rows = []
        if include_reddit:
            rows += fetch_reddit_posts(brand, limit=limit)
        if include_twitter:
            rows += fetch_twitter_posts(brand, limit=limit)

        if not rows:
            return {"scraped": 0, "analyzed": 0}

        # upsert raw posts
        crud.upsert_posts(db, rows)

        # run batch ML interpretation
        enriched = batch_interpret(rows)
        crud.update_interpretations(db, enriched)

        return {"scraped": len(rows), "analyzed": len(enriched)}
    except Exception as e:
        self.update_state(state="FAILURE", meta=str(e))
        raise
    finally:
        db.close()
