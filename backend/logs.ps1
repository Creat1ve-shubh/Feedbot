# View logs from all services
Write-Host "Viewing logs (press Ctrl+C to exit)..." -ForegroundColor Cyan

docker compose logs -f
