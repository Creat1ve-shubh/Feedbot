from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.base import Base, engine
from routes import health, analyze, results, metrics

app = FastAPI(
    title="Brand Perception Backend",
    version="0.1.0",
    description="API for brand sentiment analysis and perception intelligence"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure tables exist
Base.metadata.create_all(bind=engine)

# Routes
app.include_router(health.router, tags=["health"])
app.include_router(analyze.router, tags=["analyze"])
app.include_router(results.router, tags=["results"])
app.include_router(metrics.router, prefix="/api/metrics", tags=["metrics"])

