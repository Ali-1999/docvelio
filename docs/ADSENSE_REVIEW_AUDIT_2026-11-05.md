# Docvelio AdSense review readiness | 5 November 2026

This is a **technical preflight**, not a declaration of AdSense approval. The 5 November email says "Update your AdSense application" without identifying the specific account/site policy issue. Only the owner can read the account-specific details under AdSense > Sites > docvelio.com and any items shown on the AdSense Home/Policy centre.

## What we checked and changed

| Area | Repository verification | Remaining live/owner work |
| --- | --- | --- |
| AdSense publisher | Owner-supplied `pub-1566581424297065`; `scripts/install-adsense.cjs` places `ca-pub-1566581424297065` in the Google JS URL and ownership meta | Check the published HTML source, and whether AdSense shows ownership verified |
| `ads.txt` | Updated `public/ads.txt`, `scripts/build-docvelio.cjs` and build installer to produce `google.com, pub-1566581424297065, DIRECT, f08c47fec0942fa0` | Check `https://docvelio.com/ads.txt` returns HTTP 200 and the exact declaration; AdSense's ads.txt status can take time to refresh |
| Robot discovery | `robots.txt` allows crawler and lists `sitemap.xml`; production sitemap is generated | Confirm Cloudflare bot/WAF rules do not block Google crawlers; ensure no challenge and correct TLS/canonical HTTPS |
| Policy/trust pages | About, Contact, Privacy, Terms, Cookies available in 10 locales from build; operator information injected into templates | Validate their live content, current email reachability and actual legal/privacy disclosures |
| Consent order | `install-ga4.cjs` loads default-denied consent initializer before asynchronous Google scripts; `test-ga4.cjs` asserts this | Custom site privacy UI is **not** a certified advertising CMP. Before serving relevant ads in EEA/UK/Switzerland, configure and test a Google-certified IAB TCF CMP, e.g. through AdSense Privacy & messaging. Confirm local legal requirements |
| Content quality | Existing tool content, original guides, about/support information and 10-language navigation; the build's `page-content.cjs`, `add-search-answers.cjs` and blog generators provide task-specific explanations | Editorially inspect representative pages for practical usefulness, originality, accurately described limitations, working downloads, sufficient explanation and readable mobile design. The exact Google review decision is not predictable |
| Live functionality | GitHub audit now tests essential public routes and `ads.txt` / AdSense identifiers | A successful CI run and a manual desktop/mobile inspection are required after Cloudflare deployment |
| Account review | No authenticated access to the AdSense dashboard | Review the exact issue, resolve account setup tasks, then request a fresh review in AdSense > Sites |

## Current source-derived content observations (not Google's rejection reason)

- `public/tools/split-pdf/index.html` has approximately 338 words in the main content from the checked-in source. It explains page extraction and file handling.
- `public/tools/qr-code-generator/index.html` has approximately 297 words in the main content from the checked-in source.
- `public/guides/index.html` has approximately 137 words in the main content from the checked-in source. This is a navigation/index page, not necessarily a content deficiency.
- `public/accessibility/index.html` has approximately 110 words in the main content from the checked-in source. Consider adding **truthful, tested** accessibility details and a concrete reporting process rather than generic padding.
- There is no official universal minimum word count, article count or ranking target for AdSense approval. Avoid auto-generated text padding, duplicate articles, scraped content and copied competitors.

## Deployment and review sequence

1. Review GitHub build/Cloudflare deploy results after the latest commits. `wrangler.jsonc` includes all generation and preflight steps; the scheduled `seo-health.yml` workflow mirrors them.
2. Open these deployed URLs, confirm HTTP 200 and correct content:
   - `https://docvelio.com/`
   - `https://docvelio.com/ads.txt`
   - `https://docvelio.com/robots.txt`
   - `https://docvelio.com/sitemap.xml`
   - `https://docvelio.com/about/`
   - `https://docvelio.com/contact/`
   - `https://docvelio.com/privacy/`
   - `https://docvelio.com/terms/`
   - `https://docvelio.com/cookies/`
3. Verify Google site ownership code and `ads.txt` publisher ID from the actual AdSense account match the deployed versions. Never use a sample ID.
4. Test key PDF and image workflows using non-sensitive sample documents, including uploads that remain in the browser, download, error handling, and mobile layout. Validate the UI and disclosure claims against browser Network activity.
5. Open AdSense > Sites > docvelio.com to view the exact **Needs attention** or **Requires review** explanation. Also review account setup and Policy centre. A generic email alone cannot identify whether the issue is content, policy, crawlability or account setup.
6. Review privacy requirements and configure a certified CMP before serving personalised ads to EEA, UK or Swiss users as required; the site's cookie-preferences widget does not qualify as a certified CMP.
7. After changes and confirmation, request review **inside AdSense**. Do not repeatedly remove the site and resubmit it. Reviews can take days or several weeks.

## Automated report

`node scripts/check-adsense-readiness.cjs` checks generated pages for duplicate/missing publisher tags, Google consent ordering, unresolved operator placeholders, public seller record, robots directives and key trust pages. It writes `reports/adsense-readiness.json`. Any reported short pages are **editorial review candidates** only; the script cannot make Google's final quality assessment.

## Authoritative references

- [What to do when your site is not ready to show ads](https://support.google.com/adsense/answer/12176698)
- [Make sure your site's pages are ready for AdSense](https://support.google.com/adsense/answer/7299563)
- [Your AdSense account wasn't approved](https://support.google.com/adsense/answer/81904)
- [Google consent management requirements for EEA, UK and Switzerland](https://support.google.com/adsense/answer/13554116)
- [Google AdSense required privacy policy disclosures](https://support.google.com/adsense/answer/1348695)
- [AdSense ads.txt troubleshooting](https://support.google.com/adsense/troubleshooter/9556696)

**Bottom line:** The repo is technically better prepared, but Google's specific rejection reason, actual Cloudflare deployment, working tools, EU/UK/Swiss advertising consent, and Google approval remain unverified or require operator action.
