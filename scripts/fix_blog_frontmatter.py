from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "src" / "content" / "blog"

KEY_RE = re.compile(r"^(##\s+)?([A-Za-z][A-Za-z0-9_]*)\s*:\s*(.+)$")
COVER_MD_RE = re.compile(r'^\[(https?://[^\]]+)\]\((https?://[^)]+)\)$')
URL_RE = re.compile(r"^https?://\S+$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def normalize_frontmatter(text: str) -> str:
    if not text.startswith("---"):
        return text

    lines = text.splitlines()
    if not lines:
        return text

    # Determine frontmatter range; some imported files are missing the closing marker.
    end_idx = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end_idx = i
            break

    if end_idx is None:
        i = 1
        while i < len(lines):
            s = lines[i].strip()
            if not s:
                i += 1
                continue
            if KEY_RE.match(s):
                i += 1
                continue
            break
        end_idx = i
        body = lines[end_idx:]
    else:
        body = lines[end_idx + 1 :]

    raw_fm = lines[1:end_idx]
    normalized: list[str] = []

    for raw in raw_fm:
        s = raw.strip()
        if not s:
            continue
        m = KEY_RE.match(s)
        if not m:
            continue
        key = m.group(2)
        value = m.group(3).strip()

        if key == "coverImage":
            # Convert markdown-link string into plain URL, e.g. "[url](url)" -> "url"
            quoted = value[1:-1] if len(value) >= 2 and value[0] == value[-1] == '"' else value
            link = COVER_MD_RE.match(quoted)
            if link:
                value = f'"{link.group(2)}"'
            # Drop invalid cover URLs instead of failing content schema.
            plain = value[1:-1] if len(value) >= 2 and value[0] == value[-1] == '"' else value
            if not URL_RE.match(plain):
                continue

        if key == "pubDate":
            plain = value[1:-1] if len(value) >= 2 and value[0] == value[-1] == '"' else value
            if not DATE_RE.match(plain):
                # Keep only YYYY-MM-DD if timestamp-like.
                value = plain[:10]
                if not DATE_RE.match(value):
                    continue

        normalized.append(f"{key}: {value}")

    out = ["---", *normalized, "---", ""]
    out.extend(body)
    return "\n".join(out).rstrip() + "\n"


def main() -> None:
    changed = 0
    for path in BLOG_DIR.glob("*.md"):
        original = path.read_text(encoding="utf-8")
        updated = normalize_frontmatter(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1
    print(f"Updated {changed} files")


if __name__ == "__main__":
    main()
