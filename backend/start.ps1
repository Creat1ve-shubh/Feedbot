# Start the Brand Perception Backend
Write-Host "Starting Brand Perception Backend..."

# Check if .env exists
if (-Not (Test-Path .env)) {
    Write-Host "Creating .env file from template..."
    Copy-Item .env.example .env
    Write-Host "Please edit .env file with your API credentials!"
}

# Start Docker Compose
Write-Host "Starting services with Docker Compose..."
try {
    docker compose up --build -d
    Write-Host "Docker compose started successfully."
} catch {
    Write-Host "Failed to start Docker compose: $($_.Exception.Message)"
    exit 1
}

# Wait for services to start
Write-Host "Waiting for services to start..."
Start-Sleep -Seconds 10

# Check status
Write-Host "`nService Status:"
docker compose ps

Write-Host "`nBackend is starting!"
Write-Host "API Documentation: http://localhost:8000/docs"
Write-Host "Health Check: http://localhost:8000/health"
Write-Host ""
Write-Host "View logs with: docker compose logs -f"
