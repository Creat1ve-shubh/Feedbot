# Setup Scripts Complete - Installation Guide

## What Was Created

Three installation scripts for different platforms:

### 1. **setup.py** (Cross-Platform - Recommended for initial setup)
- Works on Windows, macOS, and Linux
- Automatic venv creation and activation
- Installs all dependencies
- Verifies installation with import checks
- Shows activation instructions

**Usage:**
```bash
python setup.py
```

### 2. **setup.ps1** (Windows PowerShell)
- Native PowerShell script
- Color-coded output
- Automatic venv activation
- Package verification

**Usage:**
```powershell
.\setup.ps1
```

### 3. **setup.sh** (Linux/macOS Bash)
- Native Bash script
- Full-featured with error checking
- Support for --no-venv flag

**Usage:**
```bash
chmod +x setup.sh
./setup.sh
```

---

## Quick Start (For You - Windows User)

### Step 1: Run Setup
```powershell
cd backend
python setup.py
```

This will:
1. Create `venv/` folder (virtual environment)
2. Activate the environment
3. Upgrade pip
4. Install all dependencies from `requirements.txt`
5. Verify all core packages are installed
6. Show next steps

### Step 2: Database Initialization
```bash
python migrate.py
```

Creates tables:
- `posts` - Social media data + ML enrichment
- `brand_metrics` - Daily aggregations  
- `sentiment_timeseries` - Hourly trends
- `analysis_tasks` - Job tracking

### Step 3: Verify Integration
```bash
python verify_integration.py
```

Tests:
- Database connectivity
- Redis cache
- ORM models
- CRUD operations
- Backend routes

### Step 4: Start Services
```bash
# Start PostgreSQL, Redis, API, Worker
docker-compose up
```

In another terminal (venv still activated):
```bash
uvicorn app:app --reload
```

---

## Installation Status

Your current setup shows:
```
✓ venv exists (D:\Nextjs projects\Feedbot\backend\venv\)
✓ python setup.py is working
✓ Dependencies downloading/installing
✓ All core packages will be installed:
  - fastapi
  - sqlalchemy  
  - psycopg2 (PostgreSQL)
  - redis
  - celery
  - pydantic
  - And 10+ others
```

---

## Important Files

### Setup Files
- `setup.py` - Python setup (works everywhere)
- `setup.ps1` - PowerShell setup (Windows)
- `setup.sh` - Bash setup (Linux/macOS)
- `QUICK_START.txt` - Plain text quick reference
- `SETUP_GUIDE.md` - Comprehensive setup guide

### Virtual Environment Files
- `venv/` - Installed packages and Python executable
- `requirements.txt` - List of all dependencies

### Activation Commands

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

**Linux/macOS:**
```bash
source venv/bin/activate
```

When activated, you'll see `(venv)` at the start of your prompt.

---

## What Gets Installed

### Web Framework & Server
- `fastapi==0.115.2` - Modern async web framework
- `uvicorn==0.30.6` - ASGI server

### Database
- `sqlalchemy==2.0.36` - ORM (Object-Relational Mapping)
- `psycopg2-binary==2.9.10` - PostgreSQL driver
- `alembic==1.13.2` - Database migrations

### Caching & Async
- `redis==5.0.8` - Cache client
- `celery==5.4.0` - Distributed task queue

### Data Validation
- `pydantic==2.9.2` - Data validation and serialization

### Data Science
- `pandas==2.2.3` - Data manipulation
- `numpy==2.2.0` - Numerical computing
- `scikit-learn==1.6.1` - Machine learning utilities

### Web Scraping & APIs
- `beautifulsoup4==4.12.3` - HTML parsing
- `httpx==0.27.2` - HTTP client
- `praw==7.7.1` - Reddit API
- `tweepy==4.14.0` - Twitter API

### Configuration
- `python-dotenv==1.0.1` - Load .env variables

**Total:** ~25 packages with all dependencies

---

## Post-Installation

### Check That Everything Installed
```bash
# Should show all packages
pip list
```

### Verify Core Packages
```bash
python -c "import fastapi, sqlalchemy, redis, celery; print('SUCCESS')"
```

### Exit Virtual Environment (When Done)
```bash
deactivate
```

### Delete Virtual Environment (Clean up)
```powershell
# Windows
Remove-Item -Recurse venv

# Linux/macOS
rm -rf venv
```

---

## Troubleshooting

### Script Execution Policy Error (Windows)
```
cannot be loaded because running scripts is disabled on this system
```

**Solution:**
```powershell
# Allow execution for current session
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# Then run setup
.\setup.ps1
```

### "python: command not found"
```bash
# Use python3 instead
python3 setup.py

# Or check installation
python --version
python3 --version
```

### Module Import Fails After Setup
```bash
# Verify venv is activated
# You should see (venv) in terminal prompt

# If not, activate:
.\venv\Scripts\Activate.ps1  # Windows

# Then reinstall
pip install -r requirements.txt
```

### Permission Denied on setup.sh (Linux/macOS)
```bash
chmod +x setup.sh
./setup.sh
```

### Dependencies Install But Scripts Fail
```bash
# Restart terminal/PowerShell
# This refreshes PATH variables

# Then reactivate venv
.\venv\Scripts\Activate.ps1

# Verify
python --version  # Should show 3.x
```

---

## Next Phase: Part 2 - Integration Verification

Once setup is complete (when you see "SUCCESS" messages):

1. **Run Migration:**
   ```bash
   python migrate.py
   ```

2. **Run Integration Tests:**
   ```bash
   python verify_integration.py
   ```

3. **Check All Systems:**
   - Database: PostgreSQL on localhost:5432
   - Cache: Redis on localhost:6379
   - API: FastAPI on localhost:8000

4. **Start Services:**
   ```bash
   docker-compose up
   ```

---

## File Structure Summary

```
backend/
├── venv/                      # Virtual environment (created)
│   ├── Scripts/ (Windows)
│   │   ├── python.exe        # Python interpreter
│   │   ├── pip.exe           # Package manager
│   │   └── Activate.ps1      # Activation script
│   └── bin/ (Linux/macOS)
│       ├── python            # Python interpreter
│       ├── pip               # Package manager
│       └── activate          # Activation script
│
├── setup.py                   # Cross-platform setup
├── setup.ps1                  # Windows PowerShell setup
├── setup.sh                   # Linux/macOS Bash setup
├── requirements.txt           # Python dependencies
├── QUICK_START.txt            # Quick reference
├── SETUP_GUIDE.md             # Detailed setup guide
├── INTEGRATION_COMPLETE.md    # Integration guide
├── migrate.py                 # Database setup
└── verify_integration.py      # Integration tests
```

---

## Success Indicators

Setup is successful when:

✅ No errors in `python setup.py` output  
✅ `pip list` shows 20+ packages installed  
✅ `python -c "import fastapi"` works without error  
✅ Virtual environment activates with `(venv)` prefix  
✅ `python migrate.py` creates database tables  
✅ `python verify_integration.py` shows all green checks  

---

## Summary

You now have:
- **3 setup scripts** (Python, PowerShell, Bash)
- **Complete setup documentation** (SETUP_GUIDE.md)
- **Virtual environment** ready to use
- **All dependencies** installable with one command
- **Verification tools** to confirm everything works

**Next: Run `python setup.py` and then `python migrate.py` to initialize the database!**

Questions? Check:
- QUICK_START.txt - Quick reference
- SETUP_GUIDE.md - Detailed guide  
- INTEGRATION_COMPLETE.md - Integration steps
