@echo off
REM Feedbot Backend Setup and Activation for Windows
REM This script sets up the environment and activates the virtual environment

echo.
echo ============================================================
echo  Feedbot Backend - Automatic Setup
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.10+ from python.org
    pause
    exit /b 1
)

echo Step 1: Creating virtual environment...
if not exist venv (
    python -m venv venv
    if %ERRORLEVEL% neq 0 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created!
) else (
    echo Virtual environment already exists
)

echo.
echo Step 2: Activating virtual environment...
call .\venv\Scripts\activate.bat
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)
echo Virtual environment activated!

echo.
echo Step 3: Upgrading pip...
python -m pip install --upgrade pip --quiet
if %ERRORLEVEL% neq 0 (
    echo WARNING: Could not upgrade pip (non-critical)
)

echo.
echo Step 4: Installing dependencies from requirements.txt...
if not exist requirements.txt (
    echo ERROR: requirements.txt not found
    pause
    exit /b 1
)

pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to install dependencies
    echo Check the output above for details
    pause
    exit /b 1
)

echo.
echo Step 5: Verifying installation...
python -c "import fastapi, sqlalchemy, redis; print('SUCCESS: All core packages installed')"
if %ERRORLEVEL% neq 0 (
    echo WARNING: Some packages may not have installed correctly
)

echo.
echo ============================================================
echo  SETUP COMPLETE!
echo ============================================================
echo.
echo Your virtual environment is now ACTIVATED!
echo You should see (venv) at the start of your command prompt
echo.
echo Next steps:
echo   1. python migrate.py              # Create database tables
echo   2. python verify_integration.py   # Test all components
echo   3. docker-compose up              # Start services
echo.
echo To deactivate venv later: deactivate
echo.
pause
