#!/bin/bash

# Feedbot Backend Setup Script for Linux/macOS
# Run this script to set up the development environment
#
# Usage:
#   chmod +x setup.sh
#   ./setup.sh              # Create venv and install
#   ./setup.sh --no-venv    # Install in current environment

set -e

echo "============================================================"
echo "🚀 FEEDBOT BACKEND SETUP (Linux/macOS)"
echo "============================================================"

# Check Python installation
echo -e "\n🐍 Checking Python installation..."
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    PYTHON_VERSION=$($PYTHON_CMD --version)
    echo "   ✓ Python found: $PYTHON_VERSION"
else
    echo "   ✗ Python3 not found! Please install Python 3.10+"
    exit 1
fi

# Parse arguments
USE_VENV=true
VENV_NAME="venv"

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-venv)
            USE_VENV=false
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Step 1: Create virtual environment
if [ "$USE_VENV" = true ]; then
    echo -e "\n📦 Setting up virtual environment..."
    
    if [ -d "$VENV_NAME" ]; then
        echo "   ✓ Virtual environment already exists: $VENV_NAME"
    else
        echo "   Creating venv..."
        $PYTHON_CMD -m venv "$VENV_NAME"
        
        if [ $? -eq 0 ]; then
            echo "   ✓ Virtual environment created: $VENV_NAME"
        else
            echo "   ✗ Failed to create virtual environment"
            exit 1
        fi
    fi
    
    # Activate venv
    echo "   Activating venv..."
    source "$VENV_NAME/bin/activate"
    echo "   ✓ Virtual environment activated"
    
    PYTHON_CMD="python"
    PIP_CMD="pip"
else
    echo -e "\n⚠️  Using current Python environment (not recommended)"
    PIP_CMD="$PYTHON_CMD -m pip"
fi

# Step 2: Upgrade pip
echo -e "\n🔄 Upgrading pip..."
$PIP_CMD install --upgrade pip -q
if [ $? -eq 0 ]; then
    echo "   ✓ pip upgraded"
else
    echo "   ⚠️  Could not upgrade pip (non-critical)"
fi

# Step 3: Install requirements
echo -e "\n📥 Installing dependencies from requirements.txt..."
if [ ! -f "requirements.txt" ]; then
    echo "   ✗ requirements.txt not found"
    exit 1
fi

$PIP_CMD install -r requirements.txt
if [ $? -eq 0 ]; then
    echo "   ✓ Dependencies installed successfully"
else
    echo "   ✗ Failed to install dependencies"
    exit 1
fi

# Step 4: Verify installation
echo -e "\n🔍 Verifying installation..."
packages=("fastapi" "sqlalchemy" "psycopg2" "redis" "celery" "pydantic")
failed=()

for package in "${packages[@]}"; do
    import_name=$(echo "$package" | tr '-' '_')
    $PYTHON_CMD -c "import $import_name" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "   ✓ $package"
    else
        echo "   ✗ $package"
        failed+=("$package")
    fi
done

if [ ${#failed[@]} -gt 0 ]; then
    echo -e "\n⚠️  Failed to verify: ${failed[*]}"
    echo "   Try running setup again or check the error above"
else
    echo "   ✓ All packages verified"
fi

# Step 5: Show completion message
echo ""
echo "============================================================"
echo "🎉 SETUP COMPLETE!"
echo "============================================================"

if [ "$USE_VENV" = true ]; then
    echo -e "\n📝 Your virtual environment is now activated!"
    echo -e "\n💡 To activate it in the future, run:"
    echo "   source $VENV_NAME/bin/activate"
    echo ""
fi

echo "📋 Next steps:"
echo "   1. python migrate.py                 # Create database tables"
echo "   2. python verify_integration.py      # Test all components"
echo "   3. docker-compose up                 # Start services (needs Docker)"
echo "   4. uvicorn app:app --reload         # Start dev server"

echo ""
echo "============================================================"

# Helpful tips
echo -e "\n💡 Tips:"
echo "   • To deactivate venv: deactivate"
echo "   • To delete venv: rm -rf $VENV_NAME"
echo "   • View logs: docker-compose logs -f"
echo "   • Test database: psql -h localhost -U postgres -d branddb"
