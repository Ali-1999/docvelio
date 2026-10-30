# Docvelio: 30-Day SEO, E-E-A-T, AEO / GEO and Indexing Roadmap

**Revision:** 30 October 2026. Reflects the user's ten educational SEO slides, adapted to a global **online-only** PDF, Word, image and calculator website. This is an action plan, not a report of rankings, backlinks, or Google index coverage.

## Week 1 — fix technical crawling before content expansion

**Highest-priority unresolved blocker:** GitHub's external HTTP monitor observed **Cloudflare's managed challenge** on `https://docvelio.com/sitemap.xml` (403 HTML response; response included `cf-mitigated: challenge`). Content pages and `/robots.txt` were reachable, and `/sitemap.txt` returned HTTP 200. This is a Cloudflare security configuration problem, not XML syntax. Source sitemap validation passed for 580 locale pages, and the wheel route produces a final 581st URL.

**Site-owner Cloudflare step:** Cloudflare → select `docvelio.com` → Security → Events. Filter for `/sitemap.xml` and inspect the matched mitigation or rule. Use a narrowly scoped *Skip* rule only where appropriate for the blocked security feature, e.g. expression `(http.host eq "docvelio.com" and http.request.uri.path eq "/sitemap.xml")`, placed ahead of the matched challenge. Select the **specific** managed rules or bot mitigations implicated by Events; do not switch off protection globally. Cloudflare notes not all products can be skipped on all plans, especially legacy Bot Fight Mode. Check the event's action before changing rules; leave other paths protected. Then manually trigger the repository's **Check live Google indexability** workflow and confirm `/sitemap.xml` returns 200 `application/xml` and contains 581 unique URLs. Do not claim this is fixed before such a check passes.

**Google Search Console steps (requires property-owner access):** verify the `docvelio.com` Domain property via genuine DNS TXT token; submit `https://docvelio.com/sitemap.xml` once HTTP 200 is confirmed; inspect homepage, PDF editor, Image Studio, CBM Calculator, selected language pages. Record Google-selected canonical, page fetch and index coverage. No credentials or verification tokens should be invented.

**Technical checklist:** HTTPS and host canonical, 200/301/404 correctness, crawlable robots.txt, canonical per page, reciprocal hreflang, truthful sitemap, working internal links, image alt, mobile tap targets, XML content type, pages without accidental noindex. Confirm indexability from **live** fetches, not merely GitHub HTML.

**Speed and Web Vitals:** measure mobile and desktop URLs in PageSpeed Insights / Search Console, preferably CrUX field data. Target Google's established good thresholds: LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1 at the 75th percentile. Record actual results first; use lazy loading for below-fold assets and keep the largest hero resource eager. Avoid new font CDNs and unnecessary libraries. No unmeasured 100/100 speed claim.

## Week 2 — keyword research and competition

Use `SEO_KEYWORD_INTENT_MAP.md` for the current query-to-URL hypothesis. Verify user search phrases and questions from support topics, then Google autocomplete / People Also Ask, Keyword Planner and the actual top-ten competitor results. Record target market and date. Prioritise 5–10 pages based on measured impressions and actual usefulness. Do **not** fabricate keyword volume, difficulty, or positions. Distinguish informational, navigational, commercial investigation and task-completion intent.

Look for competitors' *missing functionality and clarity*, not opportunities to reproduce their prose. Use each page's actual output controls to answer searchers' needs. Document one primary keyword cluster per page, relevant question headings, task result, limitations and sensible related links.

## Week 3 — on-page, E-E-A-T and AEO/GEO

- Keep title, page description, descriptive URL, one visible H1 and an immediately useful task explanation aligned. Titles/descriptions are descriptive snippets, not exact-length ranking formulas.
- Use real first-hand demonstrations, checked numerical examples, supported image formats, PDF privacy limitations and accessible controls; make output inspectable.
- E-E-A-T: retain actual operator and support details on About/Contact; explain which transformations remain in-browser, applicable privacy limits and what a tool **cannot** do. Never invent expert certifications, customers, reviews, testing data or “best in market” claims.
- AEO: answer genuine questions early using simple sentences, bullets, worked examples and contextual links. Trust improves when answers are complete and attributable; no JSON-LD type can guarantee AI citations.
- Schema: use schema.org `WebApplication` and `BreadcrumbList` only where truthful. Google FAQ rich results are restricted; do not add FAQ schema as an artificial ranking tactic. Keep references to reliable sources where needed.
- Review local-language copy natively. Do not add indiscriminate “2026” years, city names or unrelated phrases to every page.
- **Local SEO:** Docvelio is described as an online-only software service. Google states purely online businesses are ineligible for a Business Profile unless they meet in-person eligibility rules. Do not fabricate a storefront, phone, NAP, local citations or a Riyadh Google Maps listing simply to pursue “near me” traffic. Maintain truthful contact information in the site.

## Week 4 — legitimate promotion, link earning and reporting

Good links are earned when genuine websites find the tool worth mentioning. Candidate outreach ideas: open-source README usage demonstrations (where actually relevant), original cargo calculation examples for logistics bloggers, documentation privacy explainers for academic users, and transparent community posts showing actual free features. Contact partners or publishers with a genuinely useful contribution; do not buy links, exchange in bulk, publish spun guest posts or use private blog networks.

If a user wishes to add public reviews, first confirm they were actually given by customers and disclose any incentives; never generate fake testimonials. Promote existing helpful tool pages in relevant communities and partnerships, respecting community rules.

**Monthly reporting:** Search Console impressions, clicks, CTR, page indexing reasons, actual search queries/markets, confirmed external referrers and Core Web Vitals. Compare a consistent pre/post period after Search Console data is available. Traffic and rankings require time and Google's own assessment, not a site-code switch.

## Evidence & statuses

| Item | Status after code PR |
|---|---|
| Sitemaps and canonical/hreflang generation | Implemented in source; full 581-page audit runs in CI |
| Home/About/Guides explanatory copy and task internal links | Implemented across ten languages |
| Keyword-to-page intent map | Prepared; volume and difficulty intentionally unmeasured |
| On-page markup, ALT, internal-link QA | Automated build audit; human editorial review remains |
| Cloudflare sitemap challenge | **Operator dashboard action required**; not solved from GitHub |
| Google Search Console verification and indexing reports | **Not connected** |
| Actual PageSpeed field scores | **Not measured** |
| Local business profile | **Not appropriate without genuine in-person eligibility** |
| Real backlinks and Google/AI citations | **Not created or guaranteed** |

Official reference material:
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://support.google.com/webmasters/answer/9012289
- https://developers.cloudflare.com/waf/custom-rules/skip/
- https://support.google.com/business/answer/13763036
