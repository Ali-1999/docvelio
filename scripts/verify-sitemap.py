#!/usr/bin/env python3
"""Validate XML sitemap after the Docvelio release build."""
from pathlib import Path
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parents[1] / "public"
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9",
      "x": "http://www.w3.org/1999/xhtml"}
xml_path = root / "sitemap.xml"
raw = xml_path.read_bytes()
assert raw.startswith(b'<?xml version="1.0"'), "Missing standard XML declaration"
assert len(raw) < 50_000_000, "Sitemap exceeds size limit"
document = ET.fromstring(raw)
assert document.tag == "{" + ns["s"] + "}urlset", "Not a sitemap urlset"
nodes = document.findall("s:url", ns)
assert len(nodes) == 320, f"Expected 320 URLs, found {len(nodes)}"
urls = set()
for item in nodes:
    location = item.find("s:loc", ns)
    assert location is not None and location.text, "Missing loc"
    value = location.text
    assert value.startswith("https://docvelio.com/"), value
    assert value not in urls, f"Duplicate sitemap entry: {value}"
    urls.add(value)
    slug = value.removeprefix("https://docvelio.com/")
    target = root / slug / "index.html"
    assert target.is_file(), f"Orphan sitemap link: {value}"
    alternates = item.findall("x:link", ns)
    assert len(alternates) == 11, f"Expected 10 hreflang + default: {value}"
    codes = [a.attrib.get("hreflang") for a in alternates]
    assert sorted(codes) == sorted(["en", "es", "fr", "de", "pt", "ar", "hi", "id", "tr", "zh", "x-default"])
    for a in alternates:
        assert a.attrib["href"] in urls or (root / a.attrib["href"].removeprefix("https://docvelio.com/") / "index.html").is_file(), "Broken alternate"
assert len((root / "sitemap.txt").read_text().splitlines()) == 320
robots = (root / "robots.txt").read_text()
assert "Sitemap: https://docvelio.com/sitemap.xml" in robots
assert "Disallow: /" not in robots
headers = (root / "_headers").read_text().lower()
assert "x-robots-tag: noindex" not in headers
print("PASS: sitemap XML parses, 320 local routes and 11 alternate links each are valid.")
