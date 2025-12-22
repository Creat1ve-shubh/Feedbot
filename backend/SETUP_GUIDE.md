# Virtual Environment & Dependency Setup Guide

## Overview

This guide explains how to set up the Python development environment for Feedbot backend using virtual environments.

### Why Virtual Environments?

Virtual environments isolate your project's dependencies from system Python, preventing conflicts and ensuring reproducibility.

---

## Setup Methods

### **Method 1: Automated Setup (Recommended)**

#### Windows (PowerShell)

```powershell
# Navigate to backend directory
cd backend

# Run setup script
.\setup.ps1

# When done, your venv is already activated!
```

**Expected Output:**

```
🚀 FEEDBOT BACKEND SETUP (Windows)
   ✓ Python found: Python 3.11.x
   ✓ Virtual environment created: venv
   ✓ Virtual environment activated
   ✓ pip upgraded
   ✓ Dependencies installed successfully
   ✓ All packages verified

🎉 SETUP COMPLETE!
```

#### Linux/macOS (Bash)

```bash
# Navigate to backend directory
cd backend

# Make script executable
chmod +x setup.sh

# Run setup script
./setup.sh

# Your venv is now activated!
```

#### Cross-Platform (Python)

```bash
cd backend
python setup.py
```

**This works on Windows, macOS, and Linux!**

---

### **Method 2: Manual Setup (Step-by-Step)**

If you prefer to do it manually or the scripts don't work:

#### Step 1: Create Virtual Environment

**Windows:**

```powershell
python -m venv venv
```

**Linux/macOS:**

```bash
python3 -m venv venv
```

#### Step 2: Activate Virtual Environment

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

After activation, you should see `(venv)` at the start of your terminal prompt.

#### Step 3: Upgrade Pip

```bash
python -m pip install --upgrade pip
```

#### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

#### Step 5: Verify Installation

```bash
python -c "import fastapi; import sqlalchemy; import redis; print('✅ All packages installed!')"
```

---

### **Method 3: No Virtual Environment (Use with Caution)**

If you want to install globally (not recommended):

```bash
pip install -r requirements.txt
```

**Why not recommended:**

- ❌ Conflicts with other Python projects
- ❌ Difficult to manage multiple versions
- ❌ System Python could be accidentally modified
- ✅ Only use for isolated machines or CI/CD

---

## Virtual Environment Commands

### Activate

**Windows (PowerShell):**

```powershell
.\venv\Scripts\Activate.ps1
```

**Linux/macOS:**

```bash
source venv/bin/activate
```

### Deactivate

```bash
deactivate
```

### Delete (Clean up)

**Windows:**

```powershell
Remove-Item -Recurse venv
```

**Linux/macOS:**

```bash
rm -rf venv
```

### Check What's Installed

```bash
pip list
```

### Update All Packages

```bash
pip install --upgrade -r requirements.txt
```

---

## Project Structure After Setup

```
backend/
├── venv/                    # Virtual environment (created by setup)
│   ├── bin/                 # Executable scripts
│   │   ├── activate         # Activation script
│   │   ├── pip
│   │   ├── python
│   │   └── ...
│   ├── lib/                 # Installed packages
│   │   └── python3.x/site-packages/
│   └── pyvenv.cfg           # Config file
│
├── setup.py                 # Python setup script
├── setup.ps1                # PowerShell setup script
├── setup.sh                 # Bash setup script
├── requirements.txt         # Python dependencies
├── migrate.py               # Database initialization
├── verify_integration.py    # Integration tests
├── app.py                   # FastAPI application
└── ...
```

---

## Troubleshooting

### Issue: "Command not found: python"

**Solution:**

```bash
# Use python3 instead
python3 -m venv venv

# Or check if Python is installed
python --version
python3 --version
```

### Issue: "Permission denied" on setup.sh

**Solution:**

```bash
# Make script executable
chmod +x setup.sh

# Then run
./setup.sh
```

### Issue: "Module not found" error

**Solution:**

```bash
# Make sure venv is activated
# Windows: .\venv\Scripts\Activate.ps1
# Linux/macOS: source venv/bin/activate

# Then reinstall
pip install -r requirements.txt
```

### Issue: "pip is not installed"

**Solution:**

```bash
# Upgrade pip
python -m pip install --upgrade pip

# Then try again
pip install -r requirements.txt
```

### Issue: "psycopg2 installation fails"

**Solution:**

On macOS, you might need PostgreSQL libraries:

```bash
brew install postgresql

# Then reinstall
pip install psycopg2-binary
```

On Linux (Ubuntu/Debian):

```bash
sudo apt-get install postgresql-client libpq-dev

# Then reinstall
pip install psycopg2-binary
```

### Issue: "venv already exists, setup fails"

**Solution:**

```bash
# Delete old venv and start fresh
# Windows: Remove-Item -Recurse venv
# Linux/macOS: rm -rf venv

# Then run setup again
python setup.py  # or ./setup.ps1 or ./setup.sh
```

---

## After Setup: What's Next?

### 1. Initialize Database

```bash
# With activated venv (you should still be in it)
python migrate.py

# Expected output:
# ✅ Tables created successfully
# 📊 Database tables (4):
```

### 2. Verify Integration

```bash
python verify_integration.py

# Expected output:
# ✅ PASS: Database
# ✅ PASS: Redis Cache
# ✅ PASS: ORM Models
# ✅ PASS: CRUD Operations
# ✅ PASS: Backend Routes
```

### 3. Start Services

```bash
# Make sure Docker is running
docker-compose up

# In another terminal, with venv activated:
uvicorn app:app --reload
```

### 4. Run Tests

```bash
# With venv activated
python -m pytest tests/  # If you have tests set up
```

---

## Virtual Environment Best Practices

### ✅ Do's

- ✅ Create a venv per project
- ✅ Add `venv/` to `.gitignore`
- ✅ Commit `requirements.txt` to git
- ✅ Activate before running any code
- ✅ Recreate venv if dependencies are corrupted

### ❌ Don'ts

- ❌ Don't move venv folder (paths are hardcoded)
- ❌ Don't install packages without venv activated
- ❌ Don't mix venvs from different Python versions
- ❌ Don't forget to deactivate when done

---

## Managing Dependencies

### Add a New Package

```bash
# With venv activated
pip install package_name

# Then update requirements.txt
pip freeze > requirements.txt
```

### Remove a Package

```bash
# With venv activated
pip uninstall package_name

# Update requirements.txt
pip freeze > requirements.txt
```

### Pin Package Versions

Edit `requirements.txt` manually to specify versions:

```txt
fastapi==0.115.2           # Exact version
sqlalchemy>=2.0,<2.1       # Version range
celery~=5.4.0              # Compatible version
```

---

## Performance Tips

### Faster Installation

Use a cache directory:

```bash
pip install --cache-dir ~/.pip-cache -r requirements.txt
```

### Parallel Installation

Some packages support parallel installation:

```bash
pip install -r requirements.txt --compile
```

### Offline Installation

Download packages for later:

```bash
# Download all packages
pip download -r requirements.txt -d ./packages

# Install offline later
pip install -r requirements.txt -f ./packages --no-index
```

---

## Integration with IDEs

### VS Code

Create `.vscode/settings.json`:

```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/backend/venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true
}
```

### PyCharm

1. Go to: Project → Python Interpreter → Add
2. Select: Existing Environment
3. Choose: `backend/venv/bin/python` (Linux/macOS) or `backend\venv\Scripts\python.exe` (Windows)

### Terminal Integration

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
# Auto-activate venv when entering project directory
cd ~/path/to/feedbot/backend && source venv/bin/activate
```

---

## Summary

| Method                     | Command                           | Best For           |
| -------------------------- | --------------------------------- | ------------------ |
| **Automated (PowerShell)** | `.\setup.ps1`                     | Windows users      |
| **Automated (Bash)**       | `./setup.sh`                      | Linux/macOS users  |
| **Automated (Python)**     | `python setup.py`                 | All platforms      |
| **Manual**                 | See Step-by-Step                  | Learning/debugging |
| **No venv**                | `pip install -r requirements.txt` | Not recommended    |

---

**Choose Method 1 for fastest setup! 🚀**

Once completed, run:

```bash
python migrate.py
python verify_integration.py
```

Then proceed to Part 2: Integration Verification.
