from datetime import datetime, timezone
from typing import List, Dict
from config import settings
from utils.clean import clean_text
from utils.context_filter import passes_keyword_context, dedupe_key
import httpx

def fetch_twitter_posts(brand: str, limit: int = 100) -> List[Dict]:
    """
    Uses Twitter API v2 recent search (requires bearer token).
    If you don't have it yet, return [] or plug your provider here.
    """
    if not settings.TWITTER_BEARER_TOKEN:
        return []

    q = f'"{brand}" lang:en -is:retweet'
    max_results = min(limit, 100)

    url = "https://api.twitter.com/2/tweets/search/recent"
    params = {"query": q, "max_results": max_results, "tweet.fields": "created_at,lang,author_id"}
    headers = {"Authorization": f"Bearer {settings.TWITTER_BEARER_TOKEN}"}

    out: List[Dict] = []
    with httpx.Client(timeout=15) as client:
        r = client.get(url, params=params, headers=headers)
        r.raise_for_status()
        data = r.json().get("data", [])
        for t in data:
            text = t.get("text", "")
            if not passes_keyword_context(brand, text):
                continue
            cleaned = clean_text(text)
            ts = datetime.fromisoformat(t["created_at"].replace("Z", "+00:00"))
            out.append({
                "id": dedupe_key(brand, "twitter", cleaned, ts.isoformat()),
                "brand": brand,
                "platform": "twitter",
                "text": text,
                "clean_text": cleaned,
                "author": t.get("author_id"),
                "lang": t.get("lang", "en"),
                "created_at": ts,
            })
    return out
