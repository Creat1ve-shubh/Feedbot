# Test the Brand Perception Backend API
Write-Host "Testing Brand Perception Backend API..." -ForegroundColor Green

$baseUrl = "http://localhost:8000"

# Test 1: Health Check
Write-Host "`n1. Testing Health Check..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✅ Health Check: $($response.status)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
}

# Test 2: Queue Analysis Job
Write-Host "`n2. Queuing Analysis Job for Nike..." -ForegroundColor Cyan
try {
    $body = @{
        brand           = "Nike"
        limit           = 50
        include_reddit  = $true
        include_twitter = $false
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/analyze" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Job Queued! Task ID: $($response.task_id)" -ForegroundColor Green
    $taskId = $response.task_id
    
    # Wait a bit for processing
    Write-Host "   Waiting 10 seconds for processing..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}
catch {
    Write-Host "❌ Analysis Failed: $_" -ForegroundColor Red
}

# Test 3: Get Results
Write-Host "`n3. Fetching Results for Nike..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/results?brand=Nike&limit=10" -Method Get
    Write-Host "✅ Found $($response.Count) results" -ForegroundColor Green
    
    if ($response.Count -gt 0) {
        Write-Host "`nSample Result:" -ForegroundColor Yellow
        $sample = $response[0]
        Write-Host "  Platform: $($sample.platform)" -ForegroundColor White
        Write-Host "  Sentiment: $($sample.sentiment)" -ForegroundColor White
        Write-Host "  Confidence: $($sample.confidence)%" -ForegroundColor White
        Write-Host "  Topics: $($sample.topics -join ', ')" -ForegroundColor White
    }
}
catch {
    Write-Host "❌ Fetch Results Failed: $_" -ForegroundColor Red
}

Write-Host "`n✅ API Test Complete!" -ForegroundColor Green
Write-Host "📝 View full API docs at: http://localhost:8000/docs" -ForegroundColor Cyan
