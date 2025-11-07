# Start the Brand Perception Backend
Write-Host "Starting Brand Perception Backend..." -ForegroundColor Green

# Check if .env exists
if (-Not (Test-Path .env)) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "Please edit .env file with your API credentials!" -ForegroundColor Yellow
}

# Start Docker Compose
Write-Host "Starting services with Docker Compose..." -ForegroundColor Green
docker compose up --build -d

# Wait for services to start
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check status
Write-Host "`nService Status:" -ForegroundColor Green
docker compose ps

Write-Host "`n✅ Backend is starting!" -ForegroundColor Green
Write-Host "📝 API Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "❤️  Health Check: http://localhost:8000/health" -ForegroundColor Cyan
Write-Host "`nView logs with: docker compose logs -f" -ForegroundColor Yellow
