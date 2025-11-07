from sqlalchemy.orm import Session
from sqlalchemy import select
from db.models import Post

def upsert_posts(db: Session, rows: list[dict]):
    # rows must contain id, brand, platform, text, clean_text, created_at
    for r in rows:
        exists = db.get(Post, r["id"])
        if exists:
            continue
        db.add(Post(**r))
    db.commit()

def update_interpretations(db: Session, rows: list[dict]):
    # rows contain: id, sentiment, confidence, emotions, topics, intent, summary, polarity_score
    for r in rows:
        obj = db.get(Post, r["id"])
        if not obj:
            continue
        obj.sentiment = r.get("sentiment", obj.sentiment)
        obj.confidence = r.get("confidence", obj.confidence)
        obj.emotions = r.get("emotion", obj.emotions)
        obj.topics = r.get("topics", obj.topics)
        obj.intent = r.get("intent", obj.intent)
        obj.summary = r.get("summary", obj.summary)
        ps = r.get("polarity_score", None)
        if ps is not None:
            obj.polarity_score = int(ps * 1000)
    db.commit()

def fetch_results(db: Session, brand: str, limit: int = 100):
    stmt = select(Post).where(Post.brand == brand).order_by(Post.created_at.desc()).limit(limit)
    return db.execute(stmt).scalars().all()
