# Docvelio full SEO implementation and 30-day plan

**Owner's reference:** ten uploaded SEO notes covering keyword research, on-page SEO, content and E-E-A-T, technical SEO, internal/external links, local SEO, AEO/GEO and tools/roadmap.

**Scope:** `https://docvelio.com` and its static, multilingual PDF, Word, image, CBM and random-picker tools. This plan distinguishes implemented code changes from tasks that require account permissions, independent data or genuine outside editorial coverage.

## Completed or code-audited

1. **Search intent and keyword targeting:** `seo/KEYWORD_INTENT_MAP.csv` maps 45 priority English URLs to primary keyword hypotheses, related long-tail tasks and informational/navigational/transactional intents. This is **not** evidence of actual volume or difficulty. Search Console query data and Keyword Planner numbers should be used to validate the mapping.
2. **On-page:** Existing 580 core localized pages have titles, descriptions, a canonical, headings, language alternatives and related links. The additional wheel-of-names production route raises the final **production** XML/TXT sitemap to **581 URLs**. The code audit checks every generated page and records weak spots without stuffing titles with keywords.
3. **Content and trust:** Core tool pages give truthful statements about functionality and limitations (including secure redaction, OCR, formatting changes and container planning). This release adds a concise original answer-first explanation to each of the 18 English PDF/Word tools. About, Contact, Privacy and technical disclaimers remain linked. Do **not** invent staff qualifications, certifications, testimonials or author experiences.
4. **Technical indexing:** Source builds check self-canonical, language labels, sitemap parity and indexable pages. The final-build audit tests the actual global header, performance pass and wheel URL, which earlier CI omitted. Existing 404 has proper HTTP behavior in the external probe and a noindex directive. robots.txt allows public content and lists XML and TXT sitemaps.
5. **Mobile speed:** Existing site optimization adds lazy loading to below-the-fold images, and explicit cache headers for assets. Performance is **not established** until real mobile Core Web Vitals and Lighthouse measurements are available. Don't fabricate LCP/INP/CLS scores.
6. **AEO/GEO:** Plain-language, answer-first visible HTML is provided for English PDF tools. Image and cargo tools already contain guidance and formula explanations. Structured data is tied to real content; no invisible AI keyword blocks, made-up citations or guarantee of AI mentions.
7. **Linking:** Internal navigation and tool-to-guide linking are in place. This release audits internal link counts. Genuine external backlinks must come from editorial coverage and relevant partners; buying or exchanging links en masse is not part of this implementation.
8. **Local SEO:** Docvelio is an online-only tools service. A Google Business Profile is **not** appropriate without a qualifying in-person business or eligible service-area business. Do not invent a public address, reviews, maps listing or NAP for ranking.

## Highest-priority outstanding issue: Cloudflare XML sitemap challenge

**Observed on an external GitHub-hosted runner (25 October 2026):**
- DNS and nine critical HTML routes: reachable, 200.
- `/robots.txt` and `/sitemap.txt`: 200.
- `/sitemap.xml`: 403, with `cf-mitigated: challenge` and a Cloudflare challenge page.
- Missing page: HTTP 404.

**This cannot be fixed by changing only the XML in GitHub**, because the request is challenged at Cloudflare's edge before the static file is delivered.

**Cloudflare account owner must:**
1. Cloudflare → your `docvelio.com` zone → **Security → Events**. Filter path `/sitemap.xml`; inspect the service/rule that caused the challenge and its Ray ID. Check whether Bot Fight Mode, Super Bot Fight Mode, Browser Integrity Check or a WAF rule is responsible.
2. If the rule supports exceptions, add a *narrow* higher-priority **Skip** custom rule for the public sitemap path (and only safe `GET`/`HEAD` requests). Example condition:
   `(http.host eq "docvelio.com" and http.request.uri.path eq "/sitemap.xml" and http.request.method in {"GET" "HEAD"})`
3. Select **only** the blocking security feature in Skip options, not all protections globally. Cloudflare documents that classic **Bot Fight Mode cannot be skipped** by custom rules; address the actual source of the challenge instead.
4. Save, then re-run GitHub Actions → **Check live Google indexability**. Confirm `/sitemap.xml` returns 200 XML to ordinary external clients. Verify Googlebot through **Google Search Console URL Inspection**.
5. Temporarily, the public TXT sitemap at `https://docvelio.com/sitemap.txt` is listed in robots.txt and is a supported sitemap format. Confirm its full final production count and submit it in Search Console if XML remains blocked.

Cloudflare docs: https://developers.cloudflare.com/waf/custom-rules/skip/ and https://developers.cloudflare.com/waf/feature-interoperability/

## Week-by-week roadmap based on the supplied notes

### Week 1 — Setup and technical verification
- Connect a verified Google Search Console **Domain** property, with a DNS TXT token that Google supplies. Do not guess or fabricate verification values.
- Fix the Cloudflare WAF XML-sitemap challenge, then submit the sitemap. Validate canonical, crawlable content and the top 20 live URLs via URL Inspection.
- Connect GA4 *only with correct owner credentials and a suitable consent arrangement*. Verify realtime events by actually using a tool; do not publish a placeholder analytics ID.
- Obtain Lighthouse and mobile Chrome UX results for home, edit-PDF, image editor and CBM calculator; check LCP, INP and CLS against actual measured data.

### Week 2 — Keyword research and competitor analysis
- Export Search Console 28-day query/page impressions, CTR and average position. Start from the `seo/KEYWORD_INTENT_MAP.csv` hypotheses.
- Check real Google autocomplete, People also ask and competitor top-ranking pages for task-specific search intents. Document the actual questions without copying competitors.
- Use Keyword Planner or a connected keyword provider for volume/competition when accessible. Do not invent volumes, KD scores or rank difficulty.
- Choose genuinely useful long-tail terms; don't assume *all* keywords of four or more words are easy to rank. Avoid creating new pages for overlapping intent.

### Week 3 — On-page improvement and E-E-A-T
- Read `seo-reports/AUDIT.md` and `page-inventory.csv` from a build artifact. Review missing/duplicated titles, potentially thin translations, low inbound linking and actual page content.
- Improve or consolidate the weak *highest-demand* pages first. Write descriptive titles/H1s; Google does not mandate rigid 50–60 / 150–160 character counts.
- Add verified task screenshots, meaningful alt text and reproducible worked examples where they improve user comprehension; optimise file sizes without blurring text.
- Recheck the About/Contact disclosures, verifiable ownership, update process, limitations and attribution. Have a native speaker review important non-English landing pages.

### Week 4 — Earned growth and measurement
- Pitch authentic educational or developer resources and useful reproducible calculator examples to relevant communities and publishers when genuinely appropriate. No link farms, paid followed-link schemes, irrelevant directories or fake reviews.
- Offer accurate embeddable references or documented formulas for real partners; ask naturally for attribution, not keyword-stuffed anchors.
- Publish genuinely new help articles only after checking intent and content gaps, and show working tool screenshots/examples.
- Compare 28-day Search Console performance, indexing exceptions, qualified tool interactions and mobile CWV data against the baseline. Record only real numbers.

## Search Console issue diagnosis

**Discovered — currently not indexed:** check priority, crawl demand, internal links and genuine usefulness.

**Crawled — currently not indexed:** review whether the page substantially differs from similar pages, offers enough task-specific value and avoids misleading claims.

**Duplicate, Google chose different canonical:** inspect actual HTML canonical, redirects, internal links and near-duplicate content; consolidate when appropriate.

**Blocked, 403 or other HTTP:** inspect Cloudflare Security Events and the deployed HTTP response, not just GitHub's generated HTML.

**Soft 404:** serve a genuine 404/410 when missing, and avoid redirecting missing tools to the homepage.

## What cannot be claimed as completed

- Google indexing or first-page rankings
- Real keyword volume, KD or rankings without a live analytics/search data connection
- Google Search Console verification or sitemap submission without authorised property access
- Google Analytics activation without the account ID and appropriate consent
- Third-party backlink placements or business-profile verification
- AI answer citations or inclusion in AI Overviews/AI Mode

**Official basis:** https://developers.google.com/search/docs/essentials/technical , https://developers.google.com/search/docs/fundamentals/seo-starter-guide , https://developers.google.com/search/docs/appearance/ai-features , https://developers.cloudflare.com/waf/custom-rules/skip/
