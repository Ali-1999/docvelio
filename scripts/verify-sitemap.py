#!/usr/bin/env python3
"""Validate a Google-compatible Docvelio multilingual XML sitemap.

  python3 scripts/verify-sitemap.py --source-only    # before generated routes exist
  python3 scripts/verify-sitemap.py                  # after complete site build
"""
from __future__ import annotations
import re
import sys
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1] / "public"
PREFIX = "https://docvelio.com"
LANGS = ("en", "es", "fr", "de", "pt", "ar", "hi", "id", "tr", "zh")
GENERATED = {
    "organize-pdf", "pdf-to-jpg", "pdf-to-png", "pdf-to-text",
    "sign-pdf", "fill-pdf", "add-image-to-pdf", "compress-image",
    "compress-pdf",
}
SOURCE_ONLY = "--source-only" in sys.argv
assert all(x in ("--source-only",) for x in sys.argv[1:]), "Unknown CLI argument"
NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9",
      "x": "http://www.w3.org/1999/xhtml"}


class HTMLMetadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals = []
        self.noindex = False
        self.language = None

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if tag == "html":
            self.language = data.get("lang")
        elif tag == "link" and "canonical" in (data.get("rel") or "").split():
            self.canonicals.append(data.get("href"))
        elif tag == "meta" and data.get("name", "").lower() in ("robots", "googlebot"):
            self.noindex |= "noindex" in (data.get("content") or "").lower()


def relative_url(url):
    parsed = urlsplit(url)
    assert parsed.scheme == "https" and parsed.netloc == "docvelio.com", url
    assert parsed.path.startswith("/") and parsed.path.endswith("/"), url
    assert not parsed.query and not parsed.fragment and not parsed.username, url
    assert "//" not in parsed.path, url
    return parsed.path.lstrip("/")


def parse_route(url):
    relative = relative_url(url)
    segments = [part for part in relative.split("/") if part]
    locale = segments.pop(0) if segments and segments[0] in LANGS[1:] else "en"
    return locale, "/".join(segments)


def validate():
    raw = (ROOT / "sitemap.xml").read_bytes()
    assert raw.startswith(b'<?xml version="1.0" encoding="UTF-8"?>'), "Sitemap must use UTF-8 XML declaration"
    assert not raw.startswith(b"\xef\xbb\xbf"), "Unexpected byte-order mark"
    assert len(raw) <= 50 * 1024 * 1024, "Sitemap exceeds Google's 50 MB limit"
    assert b"<!DOCTYPE" not in raw and b"<!ENTITY" not in raw, "Do not embed external entity declarations"
    doc = ET.fromstring(raw)
    assert doc.tag == "{" + NS["s"] + "}urlset", "Invalid sitemap XML namespace/root"
    pages = doc.findall("s:url", NS)
    assert len(pages) == 320 and len(pages) <= 50000, f"Expected 320 entries, got {len(pages)}"

    seen = set()
    variants = defaultdict(dict)
    alternatives = {}
    missing_generated = 0

    for item in pages:
        loc = item.find("s:loc", NS)
        assert loc is not None and loc.text, "Missing <loc>"
        url = loc.text
        slug = relative_url(url)
        assert url not in seen, f"Duplicate URL {url}"
        seen.add(url)
        assert item.find("s:priority", NS) is None and item.find("s:changefreq", NS) is None, url
        # Dates are omitted unless we can verify individual content modification dates.
        assert item.find("s:lastmod", NS) is None, "Do not invent a lastmod date: " + url

        locale, route = parse_route(url)
        assert locale not in variants[route], f"Duplicate {locale}/{route}"
        variants[route][locale] = url

        alt = item.findall("x:link", NS)
        assert len(alt) == 11, f"Need 10 languages + x-default: {url}"
        mapping = {}
        for entry in alt:
            a = entry.attrib
            assert a.get("rel") == "alternate", f"Invalid hreflang relation: {url}"
            lang = a.get("hreflang")
            assert lang in (*LANGS, "x-default") and lang not in mapping, url
            href = a.get("href")
            assert href, f"Empty alternate: {url}"
            relative_url(href)
            mapping[lang] = href
        alternatives[url] = mapping

        page = ROOT / slug / "index.html"
        if not page.is_file():
            assert SOURCE_ONLY and route.startswith("tools/") and route[6:] in GENERATED, (
                f"Sitemap URL does not exist: {url}"
            )
            missing_generated += 1
            continue
        meta = HTMLMetadata()
        meta.feed(page.read_text(encoding="utf-8"))
        assert meta.canonicals == [url], f"URL must be self-canonical: {url} {meta.canonicals}"
        assert meta.language == locale, f"Wrong HTML lang: {url}"
        assert not meta.noindex, f"Noindex URL in sitemap: {url}"

    assert len(variants) == 32, f"Expected 32 language-neutral routes, got {len(variants)}"
    for route, locations in variants.items():
        assert set(locations) == set(LANGS), f"Incomplete hreflang group: {route}"
        expected = {locale: locations[locale] for locale in LANGS}
        expected["x-default"] = locations["en"]
        for url in locations.values():
            assert alternatives[url] == expected, f"Missing or nonreciprocal alternate: {url}"
            assert set(alternatives[url].values()).issubset(seen), f"Alternate missing as canonical: {url}"

    if SOURCE_ONLY:
        assert missing_generated == 90, f"Expected 90 tool pages generated by build, got {missing_generated}"
    else:
        assert missing_generated == 0, f"Missing {missing_generated} tool pages after build"

    text_urls = (ROOT / "sitemap.txt").read_text(encoding="utf-8").splitlines()
    assert len(text_urls) == 320 and set(text_urls) == seen, "Text sitemap differs from XML sitemap"
    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    assert "Sitemap: https://docvelio.com/sitemap.xml" in robots, "robots.txt omits sitemap"
    assert "Disallow: /" not in robots, "robots.txt blocks crawling"
    headers = (ROOT / "_headers").read_text(encoding="utf-8")
    assert "/sitemap.xml\n  Content-Type: application/xml; charset=utf-8" in headers, "Missing XML MIME headers"
    assert not re.search(r"X-Robots-Tag:\s*noindex", headers, re.I), "Response blocks indexing"

    print("PASS: Google XML sitemap, 320 unique canonical URLs, 32 routes, reciprocal hreflang, "
          + ("source-only" if SOURCE_ONLY else "complete build")
          + ", UTF-8, size, robots and content-type checks.")


if __name__ == "__main__":
    validate()
