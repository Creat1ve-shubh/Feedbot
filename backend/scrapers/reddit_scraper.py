from datetime import datetime, timezone
from typing import List, Dict
from config import settings
from utils.clean import clean_text
from utils.context_filter import passes_keyword_context, dedupe_key

def fetch_reddit_posts(brand: str, limit: int = 100) -> List[Dict]:
    """
    Uses PRAW (requires credentials). If you lack creds, swap logic to Pushshift or httpx.
    Returns normalized dicts ready for DB upsert.
    """
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
