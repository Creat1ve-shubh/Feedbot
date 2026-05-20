# dev.ps1 — Start Feedbot backend + frontend together
# Usage: .\scripts\dev.ps1

$root = $PSScriptRoot | Split-Path

Write-Host "`n[Feedbot] Starting development environment..." -ForegroundColor Cyan

# Backend
$backendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload 2>&1
} -ArgumentList "$root\backend"

# Frontend
$frontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev 2>&1
} -ArgumentList "$root\frontend"

Write-Host " Backend  -> http://localhost:8000" -ForegroundColor Green
Write-Host " Frontend -> http://localhost:3000" -ForegroundColor Green
Write-Host "`nPress Ctrl+C to stop both services.`n" -ForegroundColor Yellow

try {
    while ($true) {
        Receive-Job $backendJob  | ForEach-Object { Write-Host "[api]  $_" -ForegroundColor DarkGray }
        Receive-Job $frontendJob | ForEach-Object { Write-Host "[web]  $_" -ForegroundColor DarkGray }
        Start-Sleep -Milliseconds 500
    }
}
finally {
    Stop-Job  $backendJob, $frontendJob
    Remove-Job $backendJob, $frontendJob
    Write-Host "`n[Feedbot] Stopped." -ForegroundColor Cyan
}
