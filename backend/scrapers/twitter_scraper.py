from datetime import datetime, timezone, timedelta
from typing import List, Dict
import random
from config import settings
from utils.clean import clean_text
from utils.context_filter import passes_keyword_context, dedupe_key
import httpx

def _generate_mock_twitter_posts(brand: str, limit: int = 100) -> List[Dict]:
    """Generate mock Twitter posts for testing when API credentials are not available."""
    templates = [
        f"Just copped the latest {brand} drop 🔥 Quality on point!",
        f"{brand} really needs to step up their game. Competition is killing it.",
        f"Why is {brand} so expensive now? Pricing out loyal customers smh",
        f"Shoutout to {brand} for the amazing customer service experience! 🙌",
        f"Been wearing {brand} since forever. Still the GOAT in my book 👟",
        f"{brand} shipping took forever but the product is worth the wait",
        f"Disappointed with my {brand} order. Expected better quality for the price",
        f"The new {brand} collab is everything! Already planning my next purchase",
        f"{brand} really listening to feedback. Respect for that 💯",
        f"Not feeling the new {brand} designs. Bring back the classics!",
        f"First time trying {brand} and I'm impressed. Might become a regular customer",
        f"{brand} comfort level is unmatched. Best investment I've made",
        f"Anyone else having issues with {brand} website? Can't checkout 😤",
        f"The {brand} team killed it with this release. Sold out in minutes!",
        f"{brand} support replied within hours. That's how you do business 👏",
    ]
    
    out = []
    now = datetime.now(timezone.utc)
    actual_limit = min(limit, len(templates) * 2)
    
    for i in range(actual_limit):
        text = random.choice(templates)
        ts = now - timedelta(hours=random.randint(1, 720))
        cleaned = clean_text(text)
        out.append({
            "id": dedupe_key(brand, "twitter", cleaned, ts.isoformat()),
            "brand": brand,
            "platform": "twitter",
            "text": text,
            "clean_text": cleaned,
            "author": f"mock_twitter_{random.randint(10000, 99999)}",
            "lang": "en",
            "created_at": ts,
        })
    return out

def fetch_twitter_posts(brand: str, limit: int = 100) -> List[Dict]:
    """
    Uses Twitter API v2 recent search (requires bearer token).
    Falls back to mock data if credentials are missing.
    """
    # Check if credentials are configured (not placeholder values)
    bearer_token = settings.TWITTER_BEARER_TOKEN or ""
    
    is_placeholder = (
        not bearer_token or 
        "your" in bearer_token.lower() or
        bearer_token.startswith("http")  # typical example value
    )
    
    if is_placeholder:
        print(f"⚠️  Twitter API credentials not configured. Using mock data for {brand}.")
        return _generate_mock_twitter_posts(brand, limit)

    q = f'"{brand}" lang:en -is:retweet'
    max_results = min(limit, 100)

    try:
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
    except Exception as e:
        print(f"⚠️  Twitter API error: {e}. Using mock data for {brand}.")
        return _generate_mock_twitter_posts(brand, limit)
