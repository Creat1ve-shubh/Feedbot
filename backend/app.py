from fastapi import FastAPI
from db.base import Base, engine
from routes import health, analyze, results

app = FastAPI(title="Brand Perception Backend", version="0.1.0")

# Ensure tables exist
Base.metadata.create_all(bind=engine)

# Routes
app.include_router(health.router, tags=["health"])
app.include_router(analyze.router, tags=["analyze"])
app.include_router(results.router, tags=["results"])
