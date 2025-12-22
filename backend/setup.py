#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cross-platform setup script for Feedbot backend.
Works on Windows (PowerShell), macOS, and Linux.

Usage:
  python setup.py              # Create venv and install dependencies
  python setup.py --no-venv    # Install in current environment (use with caution)
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

# Fix encoding on Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

def run_command(cmd, shell=False):
    """Run a shell command and return success status"""
    print(f"\n🔄 Running: {cmd}")
    try:
        result = subprocess.run(
            cmd,
            shell=shell,
            check=False,
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def get_python_cmd(venv_path=None):
    """Get the correct Python command based on OS"""
    if venv_path:
        if platform.system() == "Windows":
            return str(Path(venv_path) / "Scripts" / "python.exe")
        else:
            return str(Path(venv_path) / "bin" / "python")
    return sys.executable

def get_pip_cmd(venv_path=None):
    """Get the correct pip command based on OS"""
    if venv_path:
        if platform.system() == "Windows":
            return str(Path(venv_path) / "Scripts" / "pip.exe")
        else:
            return str(Path(venv_path) / "bin" / "pip")
    return f"{sys.executable} -m pip"

def create_venv(venv_name="venv"):
    """Create Python virtual environment"""
    print(f"\n📦 Creating virtual environment: {venv_name}")
    
    if Path(venv_name).exists():
        print(f"✅ Virtual environment '{venv_name}' already exists")
        return True
    
    cmd = f"{sys.executable} -m venv {venv_name}"
    success = run_command(cmd, shell=True)
    
    if success:
        print(f"✅ Virtual environment created: {venv_name}")
        return True
    else:
        print(f"❌ Failed to create virtual environment")
        return False

def install_dependencies(pip_cmd):
    """Install Python dependencies from requirements.txt"""
    print("\n📥 Installing dependencies from requirements.txt")
    
    if not Path("requirements.txt").exists():
        print("❌ requirements.txt not found")
        return False
    
    # Upgrade pip first
    print("\n🔄 Upgrading pip...")
    run_command(f"{pip_cmd} install --upgrade pip", shell=True)
    
    # Install requirements
    cmd = f"{pip_cmd} install -r requirements.txt"
    success = run_command(cmd, shell=True)
    
    if success:
        print("✅ Dependencies installed successfully")
        return True
    else:
        print("❌ Failed to install dependencies")
        return False

def verify_installation(python_cmd):
    """Verify that key packages are installed"""
    print("\n🔍 Verifying installation...")
    
    packages = [
        "fastapi",
        "sqlalchemy",
        "psycopg2",
        "redis",
        "celery",
        "pydantic",
    ]
    
    verify_cmd = f"{python_cmd} -c \"import {{}}\""
    failed = []
    
    for package in packages:
        result = subprocess.run(
            verify_cmd.format(package.replace("-", "_")),
            shell=True,
            capture_output=True,
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        if result.returncode == 0:
            print(f"   ✓ {package}")
        else:
            print(f"   ✗ {package}")
            failed.append(package)
    
    if failed:
        print(f"\n⚠️  Failed to import: {', '.join(failed)}")
        print("   Try running: python setup.py")
        return False
    else:
        print("\n✅ All key packages verified")
        return True

def show_activation_instructions(venv_name="venv"):
    """Show instructions for activating venv"""
    print("\n" + "=" * 60)
    print("🎉 SETUP COMPLETE!")
    print("=" * 60)
    
    if platform.system() == "Windows":
        activate_cmd = f".\\{venv_name}\\Scripts\\Activate.ps1"
        print(f"\n📝 To activate the virtual environment, run:")
        print(f"\n  {activate_cmd}\n")
        print("   OR (in Command Prompt):")
        print(f"  {venv_name}\\Scripts\\activate.bat\n")
    else:
        activate_cmd = f"source {venv_name}/bin/activate"
        print(f"\n📝 To activate the virtual environment, run:")
        print(f"\n  {activate_cmd}\n")
    
    print("📋 Then you can:")
    print("  python migrate.py              # Create database tables")
    print("  python verify_integration.py   # Test all components")
    print("  uvicorn app:app --reload       # Start development server")
    print("\n" + "=" * 60)

def main():
    """Main setup workflow"""
    print("=" * 60)
    print("🚀 FEEDBOT BACKEND SETUP")
    print("=" * 60)
    print(f"📍 OS: {platform.system()}")
    print(f"🐍 Python: {sys.version}")
    
    # Parse arguments
    use_venv = "--no-venv" not in sys.argv
    venv_name = "venv"
    
    # Step 1: Create virtual environment
    if use_venv:
        if not create_venv(venv_name):
            print("\n❌ Setup failed")
            return False
        
        python_cmd = get_python_cmd(venv_name)
        pip_cmd = get_pip_cmd(venv_name)
    else:
        print("\n⚠️  Using current Python environment (not recommended)")
        python_cmd = sys.executable
        pip_cmd = get_pip_cmd()
    
    # Step 2: Install dependencies
    if not install_dependencies(pip_cmd):
        print("\n❌ Setup failed")
        return False
    
    # Step 3: Verify installation
    if not verify_installation(python_cmd):
        print("\n⚠️  Verification failed, but setup may still work")
    
    # Step 4: Show activation instructions
    if use_venv:
        show_activation_instructions(venv_name)
    else:
        print("\n✅ Dependencies installed in current environment")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
