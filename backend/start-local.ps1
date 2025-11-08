# Quick Start Backend Locally (without Docker)
# This runs just the FastAPI server with SQLite for testing

Write-Host "Setting up local development environment..."

# Check Python
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-Host "ERROR: Python not found. Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

# Create venv if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}

# Activate venv
Write-Host "Activating virtual environment..."
& ".\venv\Scripts\Activate.ps1"

# Install minimal dependencies for API only
Write-Host "Installing dependencies..."
pip install fastapi uvicorn pydantic python-dotenv sqlalchemy --quiet

# Set environment to use SQLite instead of Postgres
$env:DB_URL = "sqlite:///./dev.db"
$env:REDIS_URL = "memory://"  # Celery won't work but API will

# Start API
Write-Host ""
Write-Host "Starting FastAPI server on http://localhost:8000"
Write-Host "API Docs: http://localhost:8000/docs"
Write-Host ""
Write-Host "NOTE: This runs WITHOUT Docker, Redis, Celery, or ML models."
Write-Host "Only /health and /results endpoints will work."
Write-Host "The /analyze endpoint requires Celery workers (use Docker for full functionality)."
Write-Host ""

python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
