from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.base import get_db
from utils.cache import redis_client
import os

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/health/full")
def health_full(db: Session = Depends(get_db)):
    """Comprehensive health check including all integrations"""
    
    health_status = {
        "status": "healthy",
        "timestamp": __import__("datetime").datetime.utcnow().isoformat(),
        "checks": {
            "api": "ok",
            "database": "unknown",
            "redis": "unknown",
            "model": "unknown",
        }
    }
    
    # Database check
    try:
        db.execute(text("SELECT 1"))
        health_status["checks"]["database"] = "ok"
    except Exception as e:
        health_status["checks"]["database"] = f"error: {str(e)}"
        health_status["status"] = "degraded"
    
    # Redis check
    try:
        if redis_client:
            redis_client.ping()
            health_status["checks"]["redis"] = "ok"
        else:
            health_status["checks"]["redis"] = "unavailable"
    except Exception as e:
        health_status["checks"]["redis"] = f"error: {str(e)}"
    
    # Model check
    try:
        model_path = os.getenv("ML_MODEL_PATH", "./models/model_traced.pt")
        if os.path.exists(model_path):
            health_status["checks"]["model"] = "ok"
        else:
            health_status["checks"]["model"] = f"missing: {model_path}"
            health_status["status"] = "degraded"
    except Exception as e:
        health_status["checks"]["model"] = f"error: {str(e)}"
    
    return health_status

