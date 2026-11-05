# Cloudflare XML sitemap challenge: confirmed production blocker

**Detected:** 2026-11-05, GitHub Actions live-indexability job [42098551214](https://github.com/Ali-1999/docvelio/actions/runs/42098551214).

## Evidence, not a guess

- `https://docvelio.com/sitemap.xml` returned **HTTP 403** with `cf-mitigated: challenge`, `server: cloudflare`, and a Cloudflare **Just a moment** HTML page instead of XML.
- In the same external test `/robots.txt`, `/sitemap.txt`, homepage, selected tools and blog URLs returned HTTP 200. A nonexistent test URL correctly returned HTTP 404.
- The XML error generated secondary failures: wrong MIME type and missing expected sitemap entries. These are symptoms of the Cloudflare challenge, not evidence that the repository's XML has no URLs.
- The expected live XML inventory at the time was **583** URLs; the checked-in source sitemap is an earlier **580** URLs. Production build generators add new pages after the checked-in baseline; do not force counts or delete URLs to work around the challenge.

## Fix in the *Cloudflare dashboard*, not the source repository

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) > **docvelio.com** > **Security > Analytics > Events**. Search for requests to `/sitemap.xml` around `2026-11-05 19:55:56 UTC`. The recorded Cloudflare Ray ID was **a55e6b3c4bf4ceae-STL**. Identify the *Service* / rule responsible for the challenge.
2. If a **WAF custom rule**, **WAF Managed Rule**, or **Super Bot Fight Mode** is responsible, create the narrowest exception possible. In **Security > Security rules > Create rule > Custom rule**, use an expression that matches precisely the sitemap resource:
   
   ```text
   (http.host eq "docvelio.com" and http.request.uri.path eq "/sitemap.xml" and http.request.method in {"GET" "HEAD"})
   ```
   
   Select **Skip** and only the responsible component (e.g. the specific managed rule/ruleset or Super Bot Fight Mode). Place the rule early enough that a preceding terminating challenge rule does not fire first. Enable rule logging. Do *not* skip all security for every path.
3. **Important exception:** If the Service is **Bot Fight Mode** (the Free-plan bot feature), Cloudflare explicitly states that **WAF Skip rules do not bypass it**. You must change Bot Fight Mode's own zone setting, or use a plan/product with configurable rules. Do not add an ineffective WAF exception and claim success.
4. If the Service is **Browser Integrity Check**, **Security Level**, **Zone Lockdown** or another product outside the WAF ruleset, apply an appropriate narrow exception based on Cloudflare's allowed skip products; test again.
5. After saving, rerun [Check live Google indexability](https://github.com/Ali-1999/docvelio/actions/workflows/live-indexability.yml) via **Run workflow**. Required result: `/sitemap.xml` responds HTTP **200**, `application/xml` or `text/xml`, returns valid XML containing canonical Docvelio URLs, and shows no `cf-mitigated: challenge` header.
6. Submit `https://docvelio.com/sitemap.xml` in Search Console when reliably accessible. Meanwhile `https://docvelio.com/sitemap.txt` returned HTTP 200 in the same test and is already linked from `robots.txt`. You may also submit `sitemap.txt` in Search Console as an accepted plain text sitemap, but it is not a substitute for fixing the challenged XML endpoint.

## Security cautions

- Do not disable Cloudflare WAF, bot protection or the entire security zone as a blanket fix.
- Do not whitelist the full domain or all bots with unverified User-Agent strings.
- A Worker route or HTML/robots.txt modification generally cannot prevent a challenge applied at Cloudflare's edge **before** the Worker request is reached.
- A passing GitHub source build does **not** prove the live XML endpoint is crawlable.

## References

- [Cloudflare: configure Skip action](https://developers.cloudflare.com/waf/custom-rules/skip/)
- [Cloudflare: Skip limitations and products](https://developers.cloudflare.com/waf/custom-rules/skip/options/)
- [Cloudflare: Bot Fight Mode cannot be skipped](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)
- [Cloudflare: identify the WAF service responsible](https://developers.cloudflare.com/waf/feature-interoperability/)
- [Google: Search Console Sitemaps report](https://support.google.com/webmasters/answer/7451001)
