import csv
import html
import re
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse


def slugify(text: str) -> str:
    value = text.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-{2,}", "-", value).strip("-")
    return value or "post"


def clean_url(url: str) -> str:
    parsed = urlparse(url.strip())
    if not parsed.scheme or not parsed.netloc:
        return url.strip()
    return f"{parsed.scheme}://{parsed.netloc}{parsed.path}"


def strip_tags(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text)


def normalize_whitespace(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def html_to_markdown(content_html: str) -> str:
    body = content_html
    marker = re.search(r"<tr id=\"content-blocks\">([\s\S]+)$", body, flags=re.IGNORECASE)
    if marker:
        body = marker.group(1)

    footer_cut = re.search(
        r"<tr><td align=\"center\" valign=\"top\"><table role=\"none\" width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\">",
        body,
        flags=re.IGNORECASE,
    )
    if footer_cut:
        body = body[: footer_cut.start()]

    # Remove script/style/comment blocks before tag conversion.
    body = re.sub(r"<!--[\s\S]*?-->", "", body, flags=re.IGNORECASE)
    body = re.sub(r"<script[\s\S]*?</script>", "", body, flags=re.IGNORECASE)
    body = re.sub(r"<style[\s\S]*?</style>", "", body, flags=re.IGNORECASE)

    # Replace links first to preserve anchor text.
    def link_repl(match: re.Match) -> str:
        href = clean_url(html.unescape(match.group(1)))
        label_html = match.group(2)
        label = normalize_whitespace(strip_tags(html.unescape(label_html)))
        if not label:
            label = href
        return f"[{label}]({href})"

    body = re.sub(
        r"<a[^>]*href=\"([^\"]+)\"[^>]*>([\s\S]*?)</a>",
        link_repl,
        body,
        flags=re.IGNORECASE,
    )

    # Preserve inline content images as markdown before stripping tags.
    def image_tag_repl(match: re.Match) -> str:
        tag = match.group(0)
        src_match = re.search(r'src="([^"]+)"', tag, flags=re.IGNORECASE)
        if not src_match:
            return ""
        alt_match = re.search(r'alt="([^"]*)"', tag, flags=re.IGNORECASE)
        src = clean_url(html.unescape(src_match.group(1)))
        alt = normalize_whitespace(strip_tags(html.unescape(alt_match.group(1) if alt_match else "")))
        return f"\n\n![{alt}]({src})\n\n"

    body = re.sub(r"<img[^>]*>", image_tag_repl, body, flags=re.IGNORECASE)

    # Basic block elements.
    body = re.sub(r"<h1[^>]*>([\s\S]*?)</h1>", r"\n# \1\n", body, flags=re.IGNORECASE)
    body = re.sub(r"<h2[^>]*>([\s\S]*?)</h2>", r"\n## \1\n", body, flags=re.IGNORECASE)
    body = re.sub(r"<h3[^>]*>([\s\S]*?)</h3>", r"\n### \1\n", body, flags=re.IGNORECASE)
    body = re.sub(r"<h4[^>]*>([\s\S]*?)</h4>", r"\n#### \1\n", body, flags=re.IGNORECASE)
    body = re.sub(r"<br\\s*/?>", "\n", body, flags=re.IGNORECASE)

    # Lists first (li -> bullet), then strip wrappers.
    body = re.sub(r"<li[^>]*>([\s\S]*?)</li>", r"\n- \1", body, flags=re.IGNORECASE)
    body = re.sub(r"</?(ul|ol)[^>]*>", "\n", body, flags=re.IGNORECASE)

    # Paragraph-like wrappers.
    body = re.sub(r"</?(p|div|tr|td|table|tbody)[^>]*>", "\n", body, flags=re.IGNORECASE)

    # Drop all remaining tags.
    body = strip_tags(body)
    body = html.unescape(body)

    # Cleanup markdown noise.
    body = re.sub(r"\*\*(\s*)\*\*", "", body)
    body = re.sub(r"[ \t]+", " ", body)
    body = re.sub(r"\n +", "\n", body)
    body = normalize_whitespace(body)
    return body


def parse_pub_date(value: str) -> str:
    if not value:
        return datetime.utcnow().strftime("%Y-%m-%d")
    value = value.strip()
    try:
        # Handles most ISO timestamps from exports.
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%d")
    except ValueError:
        return value[:10]


def pick_description(web_subtitle: str, markdown_body: str, title: str) -> str:
    if web_subtitle and web_subtitle.strip():
        return web_subtitle.strip()
    for para in markdown_body.split("\n\n"):
        p = para.strip()
        if not p:
            continue
        if p.startswith("#"):
            continue
        if len(p) < 20 and p.lower() == title.lower():
            continue
        return (p[:157] + "...") if len(p) > 160 else p
    return title


def safe_frontmatter(value: str) -> str:
    return value.replace('"', '\\"').strip()


def derive_slug(url: str, title: str) -> str:
    try:
        path = urlparse(url).path.strip("/")
        if path:
            return slugify(path.split("/")[-1])
    except Exception:
        pass
    return slugify(title)


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Usage: python scripts/import_beehiiv_csv.py <csv_path> [--overwrite]")

    csv_path = Path(sys.argv[1]).expanduser()
    overwrite = "--overwrite" in sys.argv[2:]
    if not csv_path.exists():
        raise SystemExit(f"CSV not found: {csv_path}")

    repo_root = Path(__file__).resolve().parents[1]
    out_dir = repo_root / "src" / "content" / "blog"
    out_dir.mkdir(parents=True, exist_ok=True)

    created = 0
    with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            title = (row.get("web_title") or "").strip()
            status = (row.get("status") or "").strip().lower()
            url = (row.get("url") or "").strip()
            content_html = row.get("content_html") or ""
            if not title or not content_html:
                continue

            markdown_body = html_to_markdown(content_html)
            description = pick_description(row.get("web_subtitle") or "", markdown_body, title)
            excerpt = description
            pub_date = parse_pub_date(row.get("created_at") or "")
            cover = (row.get("thumbnail_url") or "").strip()
            tags = (row.get("content_tags") or "").strip()
            category = tags.split(",")[0].strip() if tags else "Notes"
            draft = status not in {"confirmed", "published", "active"}
            newsletter = True

            base_slug = derive_slug(url, title)
            candidate = out_dir / f"{base_slug}.md"
            if not overwrite:
                suffix = 2
                while candidate.exists():
                    candidate = out_dir / f"{base_slug}-{suffix}.md"
                    suffix += 1

            frontmatter = [
                "---",
                f'title: "{safe_frontmatter(title)}"',
                f'description: "{safe_frontmatter(description)}"',
                f'excerpt: "{safe_frontmatter(excerpt)}"',
                f"pubDate: {pub_date}",
                f'category: "{safe_frontmatter(category)}"',
                f"newsletter: {str(newsletter).lower()}",
                f"draft: {str(draft).lower()}",
            ]
            if cover:
                frontmatter.insert(4, f'coverImage: "{safe_frontmatter(clean_url(cover))}"')
            frontmatter.append("---")

            content = "\n".join(frontmatter) + "\n\n" + markdown_body.strip() + "\n"
            candidate.write_text(content, encoding="utf-8")
            created += 1

    print(f"Created {created} markdown files in {out_dir}")


if __name__ == "__main__":
    main()
