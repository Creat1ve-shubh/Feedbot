# Feedbot Backend Setup - PowerShell Version
# Shows everything step by step with clear output

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "   FEEDBOT BACKEND SETUP" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

# Step 1: Check Python
Write-Host "STEP 1: Checking Python Installation" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: Python found - $pythonVersion" -ForegroundColor Green
}
else {
    Write-Host "   ERROR: Python not found" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Create venv
Write-Host "STEP 2: Creating Virtual Environment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
if (Test-Path "venv") {
    Write-Host "   OK: venv already exists" -ForegroundColor Yellow
}
else {
    Write-Host "   Creating venv..."
    python -m venv venv
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   OK: venv created" -ForegroundColor Green
    }
    else {
        Write-Host "   ERROR: Failed to create venv" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# Step 3: Activate venv
Write-Host "STEP 3: Activating Virtual Environment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Running: .\venv\Scripts\Activate.ps1"
& ".\venv\Scripts\Activate.ps1"
Write-Host "   OK: venv activated" -ForegroundColor Green
Write-Host "   (you should see (venv) in your prompt)" -ForegroundColor Yellow
Write-Host ""

# Step 4: Upgrade pip
Write-Host "STEP 4: Upgrading pip" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Running: python -m pip install --upgrade pip"
python -m pip install --upgrade pip 2>&1 | ForEach-Object { Write-Host "   $_" }
Write-Host ""

# Step 5: Install requirements
Write-Host "STEP 5: Installing Dependencies" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Running: pip install -r requirements.txt"
Write-Host "   This may take 1-2 minutes..." -ForegroundColor Yellow
Write-Host ""
pip install -r requirements.txt
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: All dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "   WARNING: Some packages may not have installed" -ForegroundColor Yellow
    Write-Host "   Check the output above for details" -ForegroundColor Yellow
}
Write-Host ""

# Step 6: Verify imports
Write-Host "STEP 6: Verifying Installation" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
$packages = @("fastapi", "sqlalchemy", "redis", "celery", "pydantic")
foreach ($pkg in $packages) {
    $import_name = $pkg -replace "-", "_"
    python -c "import $import_name" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   OK: $pkg" -ForegroundColor Green
    }
    else {
        Write-Host "   ERROR: $pkg failed to import" -ForegroundColor Red
    }
}
Write-Host ""

# Step 7: Create database
Write-Host "STEP 7: Creating Database" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Running: python migrate.py"
Write-Host ""
python migrate.py
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: Database created" -ForegroundColor Green
}
else {
    Write-Host "   ERROR: Database creation failed" -ForegroundColor Red
    Write-Host "   Check that PostgreSQL is running" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "============================================================" -ForegroundColor Green
Write-Host "   SETUP COMPLETE!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "SUCCESS: Your virtual environment is ACTIVE!" -ForegroundColor Green
Write-Host "         You should see (venv) in your terminal prompt" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "   1. Verify integration: python verify_integration.py" -ForegroundColor Yellow
Write-Host "   2. Start services: docker-compose up" -ForegroundColor Yellow
Write-Host "   3. Test API: curl http://localhost:8000/health/full" -ForegroundColor Yellow
Write-Host ""
Write-Host "To deactivate venv later, type: deactivate" -ForegroundColor Gray
Write-Host ""
