from typing import Iterable

# lightweight keyword guardrails to ensure posts are about consumer product/use
KEY_PHRASES = {
    "nike": ["shoe", "sneaker", "comfort", "design", "fit", "price", "delivery", "customer", "quality"],
    # add brand-specific phrases for better precision
}

def passes_keyword_context(brand: str, text: str) -> bool:
    brand = brand.lower()
    text = text.lower()
    if brand not in text:
        return False
    if brand in KEY_PHRASES:
        hits = sum(1 for k in KEY_PHRASES[brand] if k in text)
        return hits >= 1
    return True

def dedupe_key(brand: str, platform: str, text: str, ts: str) -> str:
    import hashlib
    key = f"{brand}|{platform}|{text}|{ts}"
    return hashlib.sha256(key.encode("utf-8")).hexdigest()
