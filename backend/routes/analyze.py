from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from workers.tasks import scrape_and_analyze

router = APIRouter()

class AnalyzeReq(BaseModel):
    brand: str = Field(..., min_length=2)
    limit: int = Field(100, ge=10, le=500)
    include_twitter: bool = True
    include_reddit: bool = True

@router.post("/analyze")
def queue_analyze(req: AnalyzeReq):
    if not (req.include_reddit or req.include_twitter):
        raise HTTPException(status_code=400, detail="Enable at least one source")
    task = scrape_and_analyze.delay(req.brand, req.limit, req.include_twitter, req.include_reddit)
    return {"task_id": task.id, "status": "queued"}
