"""
Setup verification script for Shared Clipboard Backend.
This script checks if all dependencies are installed and the server can start.
"""

import importlib.util
import sys


def check_module(module_name, package_name=None):
    """Check if a Python module is installed."""
    if package_name is None:
        package_name = module_name

    spec = importlib.util.find_spec(module_name)
    if spec is None:
        return False, f"❌ {package_name} is NOT installed"
    else:
        try:
            module = importlib.import_module(module_name)
            version = getattr(module, "__version__", "unknown")
            return True, f"✅ {package_name} is installed (version: {version})"
        except Exception as e:
            return False, f"❌ {package_name} import failed: {str(e)}"


def check_python_version():
    """Check Python version."""
    version = sys.version_info
    version_str = f"{version.major}.{version.minor}.{version.micro}"

    if version.major >= 3 and version.minor >= 8:
        return True, f"✅ Python version: {version_str} (OK)"
    else:
        return False, f"❌ Python version: {version_str} (Requires Python 3.8+)"


def check_app_structure():
    """Check if app files exist."""
    import os

    required_files = [
        "app/__init__.py",
        "app/main.py",
        "app/database.py",
        "app/schemas.py",
        "app/crud.py",
        "requirements.txt",
    ]

    results = []
    all_exist = True

    for file in required_files:
        if os.path.exists(file):
            results.append(f"✅ {file} exists")
        else:
            results.append(f"❌ {file} is MISSING")
            all_exist = False

    return all_exist, "\n   ".join(results)


def check_imports():
    """Check if app modules can be imported."""
    try:
        from app import crud, database, main, schemas

        return True, "✅ All app modules import successfully"
    except Exception as e:
        return False, f"❌ App import failed: {str(e)}"


def check_database():
    """Check if database can be initialized."""
    try:
        from app.database import init_db

        init_db()
        return True, "✅ Database initialization successful"
    except Exception as e:
        return False, f"❌ Database initialization failed: {str(e)}"


def main():
    """Run all checks."""
    print("=" * 60)
    print("Shared Clipboard Backend - Setup Check")
    print("=" * 60)
    print()

    checks = [
        ("Python Version", check_python_version),
        ("FastAPI", lambda: check_module("fastapi")),
        ("Uvicorn", lambda: check_module("uvicorn")),
        ("SQLAlchemy", lambda: check_module("sqlalchemy")),
        ("Pydantic", lambda: check_module("pydantic")),
        ("Python-dotenv", lambda: check_module("dotenv", "python-dotenv")),
        ("Project Structure", check_app_structure),
        ("App Imports", check_imports),
        ("Database", check_database),
    ]

    all_passed = True

    for check_name, check_func in checks:
        print(f"Checking {check_name}...")
        try:
            passed, message = check_func()
            print(f"   {message}")
            if not passed:
                all_passed = False
        except Exception as e:
            print(f"   ❌ Error during check: {str(e)}")
            all_passed = False
        print()

    print("=" * 60)
    if all_passed:
        print("✅ ALL CHECKS PASSED!")
        print()
        print("Your backend is ready to run!")
        print()
        print("Start the server with:")
        print("   python run.py")
        print("   OR")
        print("   uvicorn app.main:app --reload")
        print()
        print("Then visit: http://localhost:8000/docs")
    else:
        print("❌ SOME CHECKS FAILED")
        print()
        print("Please fix the issues above before running the server.")
        print()
        print("To install dependencies:")
        print("   pip install -r requirements.txt")
    print("=" * 60)

    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
