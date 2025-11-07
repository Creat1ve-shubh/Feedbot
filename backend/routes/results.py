from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.base import get_db
from db import crud

router = APIRouter()

@router.get("/results")
def get_results(brand: str, limit: int = 100, db: Session = Depends(get_db)):
    rows = crud.fetch_results(db, brand=brand, limit=limit)
    return [
        {
            "id": r.id,
            "brand": r.brand,
            "platform": r.platform,
            "text": r.text,
            "sentiment": r.sentiment,
            "confidence": r.confidence,
            "emotion": r.emotions,
            "topics": r.topics,
            "intent": r.intent,
            "summary": r.summary,
            "polarity_score": r.polarity_score,
            "created_at": r.created_at,
        } for r in rows
    ]
