REM =============================================================
REM FEEDBOT BACKEND - ONE-COMMAND SETUP
REM =============================================================
REM This file sets up everything: venv, dependencies, database
REM Just double-click or run: setup-all.bat
REM =============================================================

@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================================
echo   FEEDBOT BACKEND COMPLETE SETUP
echo ============================================================
echo.

REM Step 1: Create venv if not exists
if not exist venv (
    echo [1/4] Creating virtual environment...
    python -m venv venv
    echo.
) else (
    echo [1/4] Virtual environment exists, skipping creation...
    echo.
)

REM Step 2: Activate venv
echo [2/4] Activating virtual environment...
call .\venv\Scripts\activate.bat
echo.

REM Step 3: Install dependencies
echo [3/4] Installing dependencies (this may take 1-2 minutes)...
echo.
echo Installing from requirements.txt...
pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo WARNING: Some packages may have failed to install
    echo Check the output above
)
echo.

REM Step 4: Create database
echo [4/4] Creating database tables...
python migrate.py
echo.

REM Summary
echo.
echo ============================================================
echo   SETUP COMPLETE!
echo ============================================================
echo.
echo Your virtual environment is ACTIVE (you should see venv in prompt)
echo.
echo Next steps:
echo   1. Verify integration: python verify_integration.py
echo   2. Start services: docker-compose up
echo   3. Test API: curl http://localhost:8000/health/full
echo.
echo ============================================================
pause
