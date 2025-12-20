import sys

print("Python:", sys.version)

modules = [
    ("fastapi", "__version__"),
    ("uvicorn", "__version__"),
    ("celery", "__version__"),
    ("sqlalchemy", "__version__"),
    ("torch", "__version__"),
    ("transformers", "__version__"),
    ("pandas", "__version__"),
    ("numpy", "__version__"),
]

for mod, attr in modules:
    try:
        m = __import__(mod)
        print(f"{mod}:", getattr(m, attr, "(no __version__)"))
    except Exception as e:
        print(f"{mod}: NOT INSTALLED ({e})")
