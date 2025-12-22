# How to Activate Virtual Environment - Windows

## You Have 3 Options

### Option 1: Use the Batch File (EASIEST)
```cmd
setup.bat
```
This will:
- Create venv/
- Activate it automatically
- Install all dependencies
- Everything happens in one go!

---

### Option 2: Activate Manually (If venv already created)

**If you already ran `python setup.py` and just need to activate:**

```powershell
.\venv\Scripts\Activate.ps1
```

**Expected result:**
```
(venv) PS D:\Nextjs projects\Feedbot\backend>
```

You should see `(venv)` at the start of your prompt.

---

### Option 3: Step by Step (Manual control)

```powershell
# 1. Create virtual environment
python -m venv venv

# 2. Activate it
.\venv\Scripts\Activate.ps1

# 3. Upgrade pip
python -m pip install --upgrade pip

# 4. Install dependencies
pip install -r requirements.txt

# 5. Verify
python -c "import fastapi, sqlalchemy; print('SUCCESS')"
```

---

## Troubleshooting Activation

### Issue: "cannot be loaded because running scripts is disabled"

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.\venv\Scripts\Activate.ps1
```

### Issue: "The term 'Activate.ps1' is not recognized"

**Try this instead:**
```powershell
# If PowerShell doesn't work, use Command Prompt
cmd
venv\Scripts\activate.bat
```

Or use the batch file:
```powershell
.\setup.bat
```

### Issue: "python: command not found"

**Try:**
```powershell
python3 -m venv venv
source venv/bin/activate  # for WSL/Git Bash
```

---

## How to Know It Worked

When activated correctly, you'll see:
```
(venv) PS D:\Nextjs projects\Feedbot\backend> _
         ^^^^
         This shows venv is active!
```

---

## Next Steps (With venv Activated)

Once you see `(venv)` in your prompt:

```powershell
# Create database
python migrate.py

# Verify integration
python verify_integration.py

# Start services
docker-compose up
```

---

## Deactivate (When Done)

```powershell
deactivate
```

The `(venv)` prefix disappears - back to system Python.

---

## Quick Checklist

- [ ] Run `setup.bat` (easiest) OR
- [ ] Run `python setup.py` then manually activate with `.\venv\Scripts\Activate.ps1`
- [ ] See `(venv)` in your prompt
- [ ] Run `python migrate.py`
- [ ] Run `python verify_integration.py`
- [ ] Done!
