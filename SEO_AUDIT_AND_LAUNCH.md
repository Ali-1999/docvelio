# Docvelio SEO audit and launch instructions

## What is implemented

- Unique HTML page titles and meta descriptions, one site-level H1 per page in the shipped default HTML, self-referential canonical URLs for the intended domain.
- Server-readable content, internal links, technical sitemap, favicon and semantic navigation.
- JSON-LD using truthful WebSite, BreadcrumbList and WebApplication statements. **Structured data is not a promise of rich results.**
- Distinct practical workflow examples on each of the 9 tool landing pages, with links to relevant guides.
- A keyword-to-page intent map in `SEO_KEYWORD_MAP.md`. No fabricated keyword volume or search-position claims.
- Fixed duplicate HTML closing tags in the previous project.

## CRITICAL: the ZIP is deliberately NOT indexable yet

The site still uses preview `robots.txt: Disallow: /` and a preview X-Robots-Tag `noindex` configuration. This protects the testing website from being indexed before ownership, custom domain, legal text and file-handling reliability are ready. **Do not submit a sitemap in this state.**

## Launch order

1. Purchase `docvelio.com` and connect it as a Cloudflare Worker custom domain; serve only one primary canonical host (prefer `https://docvelio.com/`) and redirect the other host.
2. Fill real business name / legal operator, monitored email and jurisdiction in the existing `scripts/prepare_launch.py` script; review every policy page against actual analytics, ad technology, CDN and file-processing practices.
3. Test all 9 tools in real browsers using varied PDF and DOCX files, including actual downloads, errors and mobile usage. Verify pages respond with HTTP 200 and the 404 page responds with 404 on the real domain.
4. Run `py scripts/prepare_launch.py --email "your-real-email@domain.com" --operator "Your real operator" --jurisdiction "Your actual country" --launch` and `npx wrangler deploy`.
5. Verify `https://docvelio.com/robots.txt` shows Allow, sitemap URL loads and individual tool HTML no longer has `noindex` HTTP headers. Test in Google Search Console URL Inspection.
6. Add a **Domain property** in Google Search Console using DNS verification. Submit `https://docvelio.com/sitemap.xml` and request indexing for the homepage and important tool pages once.
7. Verify canonical consistency with HTTP redirects (Worker's .workers.dev URL should not compete with the primary domain). The self-canonical is a hint, not a guarantee of Google's selection.
8. Run PageSpeed Insights and fix performance/mobile issues. External JavaScript CDNs, fonts, layouts and large file processing need real-device checks. Check alt text for functional images you add.
9. Add authentic usage examples, help guides and relevant links based on user needs; check Search Console data periodically for pages indexed, clicks, impressions and queries.
10. Only after the site functions reliably, is public, and has accurate owner/legal content should you submit for AdSense review. `ads.txt` and ads verification require an actual publisher ID from your AdSense account.

## Useful verification addresses (after launch)

- https://docvelio.com/robots.txt
- https://docvelio.com/sitemap.xml
- https://docvelio.com/tools/edit-pdf/
- https://docvelio.com/tools/word-editor/
- https://search.google.com/search-console/
- https://pagespeed.web.dev/

## Honesty about current status

This package was validated locally at HTML/JSON-LD and link level, not verified live on the permanent custom domain. No SEO outcome, rankings, AdSense approval or production conversion tests are claimed.
