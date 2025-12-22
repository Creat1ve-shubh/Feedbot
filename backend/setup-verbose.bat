@echo off
REM Feedbot Backend Setup - VERBOSE VERSION
REM Shows everything happening step by step

echo.
echo ============================================================
echo   FEEDBOT BACKEND SETUP (VERBOSE - Shows All Output)
echo ============================================================
echo.

REM Check Python
echo Checking Python installation...
python --version
if %ERRORLEVEL% neq 0 (
    echo ERROR: Python not found
    pause
    exit /b 1
)
echo Python is installed!
echo.

REM Create venv
echo ============================================================
echo STEP 1: Creating Virtual Environment
echo ============================================================
if not exist venv (
    echo Running: python -m venv venv
    python -m venv venv
    if %ERRORLEVEL% equ 0 (
        echo SUCCESS: venv created
    ) else (
        echo ERROR: Failed to create venv
        pause
        exit /b 1
    )
) else (
    echo venv already exists, skipping creation
)
echo.

REM Activate venv
echo ============================================================
echo STEP 2: Activating Virtual Environment
echo ============================================================
echo Running: venv\Scripts\activate.bat
call .\venv\Scripts\activate.bat
echo SUCCESS: venv activated
echo.
echo You should see (venv) in your terminal prompt now!
echo.

REM Upgrade pip
echo ============================================================
echo STEP 3: Upgrading pip
echo ============================================================
echo Running: python -m pip install --upgrade pip
python -m pip install --upgrade pip
echo.

REM Install requirements
echo ============================================================
echo STEP 4: Installing Dependencies from requirements.txt
echo ============================================================
echo This may take 1-2 minutes...
echo.
echo Running: pip install -r requirements.txt
echo.
pip install -r requirements.txt
echo.
if %ERRORLEVEL% equ 0 (
    echo SUCCESS: All dependencies installed
) else (
    echo WARNING: Some packages may not have installed correctly
    echo Check the output above for details
)
echo.

REM Verify installation
echo ============================================================
echo STEP 5: Verifying Installation
echo ============================================================
echo Testing imports...
python -c "import fastapi; print('  OK: fastapi')"
python -c "import sqlalchemy; print('  OK: sqlalchemy')"
python -c "import redis; print('  OK: redis')"
python -c "import celery; print('  OK: celery')"
python -c "import pydantic; print('  OK: pydantic')"
echo.

REM Create database
echo ============================================================
echo STEP 6: Creating Database Tables
echo ============================================================
echo Running: python migrate.py
echo.
python migrate.py
echo.
if %ERRORLEVEL% equ 0 (
    echo SUCCESS: Database created
) else (
    echo ERROR: Database creation failed
    echo Check PostgreSQL is running: docker-compose up postgres
)
echo.

REM Final message
echo ============================================================
echo   SETUP COMPLETE!
echo ============================================================
echo.
echo IMPORTANT: Your virtual environment is NOW ACTIVE
echo You should see (venv) at the start of your terminal
echo.
echo Next steps:
echo   1. Verify integration: python verify_integration.py
echo   2. Start services: docker-compose up
echo   3. Test API: curl http://localhost:8000/health/full
echo.
echo To deactivate venv later, type: deactivate
echo.
echo ============================================================
pause
