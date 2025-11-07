import re

URL_RE = re.compile(r"http\S+|www\.\S+")
MENTION_RE = re.compile(r"@\w+")
HASH_RE = re.compile(r"#(\w+)")
NON_PRINT = re.compile(r"[^\x00-\x7F]+")

def clean_text(s: str) -> str:
    s = s or ""
    s = URL_RE.sub(" ", s)
    s = MENTION_RE.sub(" ", s)
    s = HASH_RE.sub(r"\1", s)
    s = NON_PRINT.sub(" ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s.lower()
