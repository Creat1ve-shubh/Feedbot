# Feedbot Backend Setup Script for Windows PowerShell
# Run this script to set up the development environment

param(
    [switch]$NoVenv = $false
)

$ErrorActionPreference = "Stop"

Write-Host "=" -ForegroundColor Green
Write-Host "🚀 FEEDBOT BACKEND SETUP (Windows)" -ForegroundColor Green
Write-Host "=" -ForegroundColor Green

# Check if Python is installed
Write-Host "`n🐍 Checking Python installation..."
try {
    $pythonVersion = python --version
    Write-Host "   ✓ Python found: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "   ✗ Python not found! Please install Python 3.10+" -ForegroundColor Red
    exit 1
}

# Define venv path
$venvPath = "venv"

# Step 1: Create virtual environment
if (-not $NoVenv) {
    Write-Host "`n📦 Setting up virtual environment..."
    
    if (Test-Path $venvPath) {
        Write-Host "   ✓ Virtual environment already exists: $venvPath" -ForegroundColor Green
    }
    else {
        Write-Host "   Creating venv..." -ForegroundColor Yellow
        python -m venv $venvPath
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✓ Virtual environment created: $venvPath" -ForegroundColor Green
        }
        else {
            Write-Host "   ✗ Failed to create virtual environment" -ForegroundColor Red
            exit 1
        }
    }
    
    # Activate venv
    Write-Host "   Activating venv..." -ForegroundColor Yellow
    & ".\$venvPath\Scripts\Activate.ps1"
    Write-Host "   ✓ Virtual environment activated" -ForegroundColor Green
    
}
else {
    Write-Host "`n⚠️  Using current Python environment (not recommended)" -ForegroundColor Yellow
}

# Step 2: Upgrade pip
Write-Host "`n🔄 Upgrading pip..."
python -m pip install --upgrade pip -q
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ pip upgraded" -ForegroundColor Green
}
else {
    Write-Host "   ⚠️  Could not upgrade pip (non-critical)" -ForegroundColor Yellow
}

# Step 3: Install requirements
Write-Host "`n📥 Installing dependencies from requirements.txt..."
if (-not (Test-Path "requirements.txt")) {
    Write-Host "   ✗ requirements.txt not found" -ForegroundColor Red
    exit 1
}

pip install -r requirements.txt
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Dependencies installed successfully" -ForegroundColor Green
}
else {
    Write-Host "   ✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 4: Verify installation
Write-Host "`n🔍 Verifying installation..."
$packages = @("fastapi", "sqlalchemy", "psycopg2", "redis", "celery", "pydantic")
$failed = @()

foreach ($package in $packages) {
    $importName = $package -replace "-", "_"
    python -c "import $importName" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ $package" -ForegroundColor Green
    }
    else {
        Write-Host "   ✗ $package" -ForegroundColor Red
        $failed += $package
    }
}

if ($failed.Count -gt 0) {
    Write-Host "`n⚠️  Failed to verify: $($failed -join ', ')" -ForegroundColor Yellow
    Write-Host "   Try running setup again or check the error above" -ForegroundColor Yellow
}
else {
    Write-Host "   ✓ All packages verified" -ForegroundColor Green
}

# Step 5: Show completion message
Write-Host "`n" 
Write-Host "=" -ForegroundColor Green
Write-Host "🎉 SETUP COMPLETE!" -ForegroundColor Green
Write-Host "=" -ForegroundColor Green

if (-not $NoVenv) {
    Write-Host "`n📝 Your virtual environment is now activated!" -ForegroundColor Cyan
    Write-Host "`n💡 To activate it in the future, run:" -ForegroundColor Cyan
    Write-Host "   .\venv\Scripts\Activate.ps1`n" -ForegroundColor Yellow
}

Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. python migrate.py                 # Create database tables" -ForegroundColor Yellow
Write-Host "   2. python verify_integration.py      # Test all components" -ForegroundColor Yellow
Write-Host "   3. docker-compose up                 # Start services (needs Docker)" -ForegroundColor Yellow
Write-Host "   4. uvicorn app:app --reload         # Start dev server" -ForegroundColor Yellow

Write-Host "`n" 
Write-Host "=" -ForegroundColor Green

# Helpful tips
Write-Host "`n💡 Tips:" -ForegroundColor Cyan
Write-Host "   • To deactivate venv: deactivate" -ForegroundColor Gray
Write-Host "   • To delete venv: Remove-Item -Recurse venv" -ForegroundColor Gray
Write-Host "   • View logs: docker-compose logs -f" -ForegroundColor Gray
Write-Host "   • Test database: psql -h localhost -U postgres -d branddb" -ForegroundColor Gray
