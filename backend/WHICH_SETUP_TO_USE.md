# Setup Scripts - Which One To Use

## Problem

You can't see if dependencies are installing because the output is hidden.

## Solution

Use one of these **VERBOSE** versions that shows everything:

---

## Option 1: PowerShell (RECOMMENDED - Best Output)

```powershell
.\setup-verbose.ps1
```

**Why this is best:**

- Shows colored output (easy to read)
- Clear step-by-step progress
- Shows which packages are being installed
- Shows success/error for each package
- Most informative

**Expected Output:**

```
STEP 1: Checking Python Installation
   OK: Python found - Python 3.11.x

STEP 2: Creating Virtual Environment
   OK: venv created

STEP 3: Activating Virtual Environment
   OK: venv activated
   (you should see (venv) in your prompt)

STEP 4: Upgrading pip
   Running: python -m pip install --upgrade pip
   ...

STEP 5: Installing Dependencies
   Running: pip install -r requirements.txt
   This may take 1-2 minutes...
   Collecting fastapi
   ...
   Successfully installed fastapi-0.115.2
   ...

   OK: All dependencies installed

STEP 6: Verifying Installation
   OK: fastapi
   OK: sqlalchemy
   OK: redis
   OK: celery
   OK: pydantic

STEP 7: Creating Database
   Running: python migrate.py
   ...
   OK: Database created

SETUP COMPLETE!
SUCCESS: Your virtual environment is ACTIVE!
```

---

## Option 2: Command Prompt Batch File

```cmd
setup-verbose.bat
```

**Why use this:**

- Works in old Command Prompt
- Shows all output
- Step-by-step progress
- More verbose than the original

---

## Option 3: Original Scripts (For Reference)

```powershell
.\setup.ps1              # Original PowerShell (less verbose)
```

```cmd
setup.bat               # Original batch (less verbose)
```

```cmd
setup-all.bat           # All-in-one (now shows output)
```

---

## What You Should Do NOW

### Run this:

```powershell
.\setup-verbose.ps1
```

This will:

1. ✅ Check Python is installed
2. ✅ Create venv/
3. ✅ Activate venv (you'll see (venv) in prompt)
4. ✅ Install all dependencies (you'll see each one)
5. ✅ Verify packages work
6. ✅ Create database tables
7. ✅ Leave venv activated for you to use

**All with visible progress!**

---

## How to Know It's Working

### While Installing

You should see output like:

```
Collecting fastapi==0.115.2
  Downloading fastapi-0.115.2-py3-none-any.whl (91 KB)
Collecting pydantic==2.9.2
  Downloading pydantic-2.9.2-py3-none-any.whl (368 KB)
...
Successfully installed fastapi-0.115.2 pydantic-2.9.2 ...
```

### After Install

You should see `(venv)` in your prompt:

```
(venv) PS D:\Nextjs projects\Feedbot\backend>
         ^^^^
         This means venv is active
```

### At End

```
SETUP COMPLETE!
SUCCESS: Your virtual environment is ACTIVE!
```

---

## Next Steps (After Script Finishes)

The venv is already activated, so just run:

```powershell
# Verify everything works
python verify_integration.py

# Start services
docker-compose up

# In another terminal (venv still active):
uvicorn app:app --reload
```

---

## Comparison Table

| Script              | Shows Output?    | Best For             | Command               |
| ------------------- | ---------------- | -------------------- | --------------------- |
| `setup-verbose.ps1` | ✅ YES - COLORED | PowerShell users     | `.\setup-verbose.ps1` |
| `setup-verbose.bat` | ✅ YES - PLAIN   | Command Prompt users | `setup-verbose.bat`   |
| `setup.ps1`         | ⚠️ Some          | Experienced users    | `.\setup.ps1`         |
| `setup.bat`         | ⚠️ Some          | Command Prompt       | `setup.bat`           |
| `setup.py`          | ⚠️ Some          | Cross-platform       | `python setup.py`     |
| `setup-all.bat`     | ✅ Updated       | One-command          | `setup-all.bat`       |

---

## Why You Can't See Output

The original scripts used `--quiet` flag which hides pip output. These new versions remove that, so you see:

- What's being downloaded
- What's being installed
- Which packages succeeded
- Any warnings or errors
- Overall progress

---

## Troubleshooting During Installation

### If you see "ERROR" messages:

- Read the error message carefully
- It usually tells you what's wrong
- Most common: PostgreSQL not running
  - Solution: `docker-compose up postgres`

### If installation stalls:

- It's probably downloading a large package (like numpy)
- Be patient, it can take 1-2 minutes
- Don't close the terminal

### If you need to restart:

- Close the terminal
- Open a new one
- Run the script again
- It will skip already-installed packages

---

## Success Checklist

After running `setup-verbose.ps1`:

- [ ] See "STEP 1: Checking Python Installation" - OK
- [ ] See "STEP 2: Creating Virtual Environment" - OK
- [ ] See "STEP 3: Activating Virtual Environment" - OK
- [ ] See `(venv)` in your prompt
- [ ] See "STEP 5: Installing Dependencies" with download list
- [ ] See "Successfully installed" for each package
- [ ] See "STEP 6: Verifying Installation" with OK for each package
- [ ] See "STEP 7: Creating Database" - OK
- [ ] See "SETUP COMPLETE!"
- [ ] Venv is still active in your current terminal

---

**Run `.\setup-verbose.ps1` now to see everything!** 🚀
