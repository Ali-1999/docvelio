# Docvelio: Google Indexing Readiness and Growth Plan

## What was verified from GitHub source

- The canonical domain used throughout source metadata is `https://docvelio.com`.
- The source `robots.txt` allows crawling and references the XML sitemap.
- The generated sitemap has 580 canonical URLs in 10 languages, with self-canonicals and reciprocal language references validated by CI.
- HTML output for key tools contains meaningful server-rendered headings and copy.
- The custom 404 was incorrectly giving the homepage as its canonical; this release removes that canonical and marks the 404 as noindex.

**Source-code tests do not demonstrate public reachability or Google indexing.** Independent external HTTP checks and Google Search Console are required.

## Confirmed Cloudflare challenge on the XML sitemap — 25 October 2026

An independent GitHub-hosted external probe successfully resolved `docvelio.com` to Cloudflare IPs, fetched `/robots.txt` and nine representative content pages with **200 OK**, and verified that a missing route returns a real **404**.

**The XML sitemap alone was challenged:**

- `GET https://docvelio.com/sitemap.xml` → **HTTP 403**, `text/html`, `server: cloudflare`, `cf-mitigated: challenge`.
- Observed Cloudflare Ray ID: `a50318de191d15be-SJC` (a single example, not a permanent identifier).
- `GET https://docvelio.com/sitemap.txt` → **HTTP 200**, `text/plain`.

This means the 403 was caused by a **Cloudflare challenge response**, not a malformed XML body in the GitHub source. The test does **not** prove that Googlebot specifically was challenged; Search Console is required for that.

### Temporary working discovery route

Docvelio now advertises both `/sitemap.txt` (first) and `/sitemap.xml` in `robots.txt`. Google's [official sitemap documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#text) accepts plain-text sitemaps with one URL per line. The text file lists the same 580 canonical URLs and is monitored independently. **Submit `https://docvelio.com/sitemap.txt` in Google Search Console immediately after this change reaches production.** The XML file remains the preferred richer option because it includes the alternate-language references.

### Permanent Cloudflare owner fix (narrow rule, not a whole-site bypass)

1. Open Cloudflare **Security → Events** for the `docvelio.com` zone. Filter for URI path `/sitemap.xml`, a challenged event or the example Ray ID above. Identify the **exact product and rule** that issued the challenge.
2. If it is a **WAF custom rule**, place a narrowly-scoped exception **before** the challenge rule, matching `(http.request.uri.path eq "/sitemap.xml")`. Select **Skip → All remaining custom rules** only if this is the product identified in Security Events.
3. If it is **Managed Rules or Super Bot Fight Mode**, configure a matching WAF Skip action for **only the implicated feature**, not a global security disable. Cloudflare's [skip-rule guide](https://developers.cloudflare.com/waf/custom-rules/skip/) explains placement and options.
4. If it is **Bot Fight Mode on the Free plan**, Cloudflare states a custom Skip rule cannot bypass it. Prefer the working text-sitemap fallback until you can adjust the relevant zone security configuration or protection plan. Do not weaken all-site security without weighing the risks.
5. After the rule update, rerun **Actions → Check live Google indexability**. Confirm `/sitemap.xml` returns **200 with XML**, both sitemaps contain 580 URLs, and the key pages still return 200. Then submit the XML sitemap too.

Do **not** send Google's ordinary content pages to the Indexing API (it is not intended for general website indexing). Do not buy fake indexing or ranking guarantees.

## Live monitoring added

GitHub Actions workflow: **Check live Google indexability** (`.github/workflows/live-indexability.yml`).

- Runs on pull requests, pushes to main, manual dispatch, and daily at 07:17 UTC.
- From a GitHub runner, resolves DNS; fetches the homepage, robots.txt and the live sitemap; checks 9 priority HTML pages; validates canonical URLs, the current 580-URL sitemap, response content types and HTTP 200.
- Also checks that a nonexistent path returns a real 404 or 410 to detect soft-404 routing.
- On failure, the Actions job summary identifies whether the error is DNS, hosting, robots, canonical, sitemap, HTTP status or routing.

If DNS does not resolve, verify the domain is active under **Cloudflare → Workers & Pages → docvelio → Domains & Routes** and that the domain exists in **Cloudflare DNS**. Check TLS certificate and Cloudflare zone status. Do not fake sitemap submissions or URLs.

## Required Google Search Console owner actions

1. Sign in at https://search.google.com/search-console and add a **Domain property: docvelio.com**.
2. Follow Google-provided DNS TXT verification instructions in Cloudflare DNS. **Never invent or copy someone else's verification token.**
3. Once verified, submit https://docvelio.com/sitemap.xml in **Indexing → Sitemaps**. Do this after live endpoint checks pass.
4. Use **URL Inspection → Test live URL** on the homepage, main edit-PDF tool, image editor, blog, CBM Calculator and key localized pages. Examine **Page fetch, Crawl allowed, Indexing allowed and Google-selected canonical**. Request indexing only for a few most important newly fixed pages.
5. Review **Indexing → Pages** by issue category: Discovered - currently not indexed, Crawled - currently not indexed, Duplicate/canonical, Alternate page, Soft 404, 5xx, robots blocked. Do not blindly request indexing for every variation.
6. Use **Performance → Search results** to review impressions, clicks, CTR, query/page matches and average positions; use those real queries when revising page content and links.
7. Review **Core Web Vitals** and mobile usability of actual tool workflows. Real-user page speed and content quality matter more than perfect checklists.

## Ranking and content priorities

- First: working public HTTPS domain and crawlable canonical pages.
- Second: demonstrate useful functionality and transparent limitations on each tool page; fix broken links and genuinely thin or repetitive translated descriptions before scaling more pages.
- Third: gather meaningful external references, quality links and relevant product mentions through legitimate editorial and partnership outreach—not spam or link exchanges.
- Fourth: measure improvements by qualified impressions, clicks, useful interactions and indexing of **priority** pages, not by a promise to index every URL.
- Localized pages should have expert/native-speaker review, and language URL clusters should only be indexable if they offer a useful local-language experience.
- Avoid keyword stuffing, templated near-duplicate pages produced solely for ranking, fake FAQs/reviews, invisible keywords, doorway pages, and automated indexing promises.

Google Search Console access is not present in this GitHub-only repository session, so actual Google's indexing reasons, crawl logs, and ranking data were **not obtained**. Relevant official documentation:
- https://developers.google.com/search/docs/essentials/technical
- https://support.google.com/webmasters/answer/7440203
- https://support.google.com/webmasters/answer/12482179
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://developers.google.com/search/docs/appearance/page-experience

## How to check the live monitor

Repository → **Actions** → **Check live Google indexability** → run → job summary. The report differentiates GitHub code validation from external production availability. Passing this monitor establishes only that selected URLs are publicly reachable and technically plausible for crawling; **Google indexing and search ranking remain Google's decisions**.
