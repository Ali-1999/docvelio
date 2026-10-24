# Docvelio — SEOptimer audit remediation (24 October 2026)

The uploaded 15-page SEOptimer report gave the homepage **B- overall** with **19 recommendations**, including high-priority backlinks, a missing/difficult-to-retrieve XML sitemap, and medium-priority homepage title, description and keyword consistency. Its performance test was already strong (mobile 97; desktop 100).

## Implemented in this PR
- Rebuild `/sitemap.xml` from all 320 canonical language pages rather than incrementally appending strings to an older sitemap. Add a plain-text `/sitemap.txt` fallback, sitemap in `robots.txt`, and independent XML validation tests.
- Unblock crawling in **source files**: old `public/robots.txt` said `Disallow: /` and old `public/_headers` said `X-Robots-Tag: noindex`. The existing build previously overwrote them, but keeping sources and output consistent prevents deployment differences.
- Rewrite homepage title (56 characters) and description (156 characters), strengthen PDF/Word headings and add practical, honest homepage guidance, with relevant links.
- Ensure HTML images all have an explicit `alt` attribute, preserving existing descriptive or intentionally empty decorative alt values.
- Add optional, factual `/llms.txt`, with real tools and privacy limitations.
- Keep existing responsive 10-language site, pages, Cloudflare Analytics and high-performance defaults. Avoid unnecessary tracking or heavy scripts.

## Needs external verification or access

| Audit item | Next action | Why not automatically completed |
| --- | --- | --- |
| Sitemap live retrieval | After deployment check the **HTTP status**, **XML Content-Type** and response body of `https://docvelio.com/sitemap.xml`. Submit it to Google Search Console and Bing Webmaster Tools | A repository build cannot prove public DNS, Cloudflare route, WAF, or Search Console acceptance |
| Backlinks (report found zero) | Earn relevant editorial mentions from useful guides, software directories, quality tutorials and independent reviews | Authentic third-party links require publication by other sites; never manufacture links or buy spam links |
| SPF/DMARC DNS | Identify whether `docvelio.com` sends email and which mail provider is authorized. Configure SPF per provider and DMARC in Cloudflare DNS | User provided an external Gmail address, `alihamzasbr@gmail.com`, not a domain email. Publishing an invented SPF might break future outgoing mail |
| Business address/phone | Add only a verified customer-facing business address and published support number if relevant | Riyadh/Saudi Arabia is a city/region, not a deliverable street address; a phone number was not supplied |
| LocalBusiness markup | Add only if Docvelio actually has a public, eligible business location/contact presence | Docvelio is currently described as an online software service; false LocalBusiness markup is misleading |
| Facebook/X/Instagram/LinkedIn/YouTube profiles | Create real official Docvelio profiles, provide URLs, then place verified links in the footer and `sameAs` structured data | Share buttons are **not** official social media profiles. Fabricating accounts or links would be wrong |
| Facebook (Meta) Pixel | Only if running Meta advertising, with required notice and consent management where applicable | An advertising tracker is unnecessary for a document utility and creates privacy obligations |
| Render-blocking CSS | Investigate live waterfall before changing CSS delivery | Audit showed only ~0.15 seconds potential saving and excellent mobile/desktop scores; blindly deferring critical CSS risks a flash of unstyled content |
| llms.txt | File now provided as an optional discovery document | llms.txt is not a formal Google ranking factor and does not guarantee AI search inclusion |

## Conditional DNS example — NOT automatically published

If **no** messages are ever sent from `@docvelio.com` (including transactional mail), consider an SPF TXT record at the apex: `v=spf1 -all`; otherwise obtain the legitimate sending provider's SPF record. For DMARC start by verifying alignment, reporting and sender configuration, then adopt a policy such as `v=DMARC1; p=none` at `_dmarc.docvelio.com` for evaluation and tighten only when safe. Do not paste these records blindly if the domain will be used for email sending.

## Release verification
Run `node scripts/extend-toolkit.cjs && node scripts/build-docvelio.cjs && node scripts/site-shell.cjs && node scripts/page-content.cjs && node scripts/seo-audit-fixes.cjs`, then `node scripts/test-docvelio.cjs` and `python3 scripts/verify-sitemap.py`.

The SEO score cannot be guaranteed: the audit is a dated snapshot, and crawlers may cache older releases or report temporary accessibility failures.
