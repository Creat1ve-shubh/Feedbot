from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

# Celery may be unavailable in local (non-Docker) runs. Try to import lazily.
try:
    from workers.tasks import scrape_and_analyze  # type: ignore
    CELERY_AVAILABLE = True
    CELERY_IMPORT_ERROR = None
except Exception as e:  # pragma: no cover - only for local/dev fallback
    scrape_and_analyze = None  # type: ignore
    CELERY_AVAILABLE = False
    CELERY_IMPORT_ERROR = str(e)

router = APIRouter()

class AnalyzeReq(BaseModel):
    brand: str = Field(..., min_length=2)
    limit: int = Field(100, ge=10, le=500)
    include_twitter: bool = True
    include_reddit: bool = True

@router.post("/analyze")
def queue_analyze(req: AnalyzeReq):
    if not CELERY_AVAILABLE:
        # Provide a clear error to users running locally without Docker
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Background workers are disabled in local mode",
                "hint": "Run via Docker Compose to enable Celery/Redis or install celery and provide REDIS_URL",
                "import_error": CELERY_IMPORT_ERROR,
            },
        )
    if not (req.include_reddit or req.include_twitter):
        raise HTTPException(status_code=400, detail="Enable at least one source")
    task = scrape_and_analyze.delay(req.brand, req.limit, req.include_twitter, req.include_reddit)  # type: ignore
    return {"task_id": task.id, "status": "queued"}
