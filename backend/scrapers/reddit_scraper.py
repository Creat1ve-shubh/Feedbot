from datetime import datetime, timezone, timedelta
from typing import List, Dict
import random
from config import settings
from utils.clean import clean_text
from utils.context_filter import passes_keyword_context, dedupe_key

def _generate_mock_reddit_posts(brand: str, limit: int = 100) -> List[Dict]:
    """Generate mock Reddit posts for testing when API credentials are not available."""
    templates = [
        f"Just bought new {brand} shoes and they're amazing! Super comfortable.",
        f"Anyone else disappointed with {brand}'s recent quality? Used to be better.",
        f"Been using {brand} for years and never looking back. Best brand ever!",
        f"{brand} customer service is terrible. Waited 2 weeks for a response.",
        f"The new {brand} collection is fire! Can't wait to get my hands on it.",
        f"{brand} prices are getting ridiculous. Who can afford this anymore?",
        f"Love the design of {brand} products but wish they were more affordable.",
        f"Just ran a marathon in my {brand} sneakers. Performance was incredible!",
        f"{brand} delivered my order late again. This is getting frustrating.",
        f"Great experience with {brand}! Fast shipping and excellent quality.",
        f"{brand} needs to work on their sizing. Nothing fits right.",
        f"Been loyal to {brand} for 10+ years. Quality remains consistent.",
        f"Tried {brand} for the first time. Honestly exceeded my expectations!",
        f"{brand} has the best customer support I've ever experienced.",
        f"Disappointed with my {brand} purchase. Not worth the money.",
    ]
    
    out = []
    now = datetime.now(timezone.utc)
    actual_limit = min(limit, len(templates) * 2)
    
    for i in range(actual_limit):
        text = random.choice(templates)
        ts = now - timedelta(hours=random.randint(1, 720))
        cleaned = clean_text(text)
        out.append({
            "id": dedupe_key(brand, "reddit", cleaned, ts.isoformat()),
            "brand": brand,
            "platform": "reddit",
            "text": text,
            "clean_text": cleaned,
            "author": f"mock_user_{random.randint(1000, 9999)}",
            "lang": "en",
            "created_at": ts,
        })
    return out

def fetch_reddit_posts(brand: str, limit: int = 100) -> List[Dict]:
    """
    Uses PRAW (requires credentials). Falls back to mock data if credentials missing.
    Returns normalized dicts ready for DB upsert.
    """
    # Check if credentials are configured (not placeholder values)
    client_id = settings.REDDIT_CLIENT_ID or ""
    client_secret = settings.REDDIT_CLIENT_SECRET or ""
    
    is_placeholder = (
        not client_id or 
        not client_secret or 
        "your" in client_id.lower() or 
        "your" in client_secret.lower()
    )
    
    if is_placeholder:
        print(f"⚠️  Reddit API credentials not configured. Using mock data for {brand}.")
        return _generate_mock_reddit_posts(brand, limit)
    
    try:
        import praw

        reddit = praw.Reddit(
            client_id=settings.REDDIT_CLIENT_ID,
            client_secret=settings.REDDIT_CLIENT_SECRET,
            user_agent=settings.REDDIT_USER_AGENT,
        )

        out = []
        query = f'"{brand}"'
        for sub in reddit.subreddit("all").search(query, limit=limit):
            full_text = f"{sub.title or ''} {sub.selftext or ''}".strip()
            if not passes_keyword_context(brand, full_text):
                continue
            cleaned = clean_text(full_text)
            ts = datetime.fromtimestamp(sub.created_utc, tz=timezone.utc)
            out.append({
                "id": dedupe_key(brand, "reddit", cleaned, ts.isoformat()),
                "brand": brand,
                "platform": "reddit",
                "text": full_text,
                "clean_text": cleaned,
                "author": getattr(sub, "author_fullname", None) or getattr(sub, "author", None),
                "lang": "en",   # optionally detect language
                "created_at": ts,
            })
        return out
    except Exception as e:
        print(f"⚠️  Reddit API error: {e}. Using mock data for {brand}.")
        return _generate_mock_reddit_posts(brand, limit)
