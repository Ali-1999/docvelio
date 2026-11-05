# Docvelio browser QA and Google advertising consent handoff

**Implemented 5 November 2026.** Scope: website source, synthetic-file browser QA, and clearer privacy UI. This work does not activate a Google-certified CMP or access the owner's AdSense/Cloudflare accounts.

## What is installed

- `package.json`: development-only `@playwright/test` pinned to 1.64.1; not included in Cloudflare production assets.
- `scripts/run-production-build.cjs`: executes the same Node generation steps as `wrangler.jsonc`, including 589-page AdSense/source-quality preflight.
- `scripts/serve-static-qa.cjs`: minimal local HTTP server supporting clean routes, generated assets, correct MIME and 404 responses; **not deployed to Cloudflare**.
- `playwright.config.cjs`: Desktop Chromium, emulated Pixel 7 mobile Chromium and WebKit Desktop projects; one CI worker; traces, screenshots and videos retained on failures.
- `tests/e2e/site.spec.cjs`: test public pages, semantic structure, footer links, multilingual route availability, mobile horizontal overflow, analytics privacy choice and continued denial of ad consent.
- `tests/e2e/tools.spec.cjs`: generate synthetic input PDFs and verify merge/split outputs, download SVG QR and barcode graphics, resize a generated PNG and assert output dimensions.
- `.github/workflows/browser-qa.yml`: dedicated real-browser workflow on relevant pushes/PRs and manual dispatch. It runs the production generator, installs browsers, runs the tests and uploads failure evidence.
- `public/assets/cookie-consent.js`: ten-language clarification that Docvelio's local Accept button does **not** grant consent for advertising.
- `public/tools/qr-code-generator/index.html`: removed an unverified "free forever" pledge; explained that the service is currently free and does not host redirect destinations.

**Browser tests do not interact with or click live advertisements.** They use in-memory example documents and localhost to avoid uploading private customer files. External client-side PDF dependencies may require network access in CI and are tested as part of the real user workflow.

## Run it in GitHub

1. Open [GitHub Actions > Docvelio real-browser QA](https://github.com/Ali-1999/docvelio/actions/workflows/browser-qa.yml).
2. Click **Run workflow** on the main branch.
3. Check the **Run actual browser interactions and output checks** step; green is a passing local-browser suite, red means inspect failures.
4. Download `docvelio-browser-qa` from the run's **Artifacts** section to inspect screenshots, traces, HTML summary and generated-site content audits.
5. Fix broken interactions or layout issues identified in the screenshots and repeat the run.

### Local developer run

From the cloned project on a workstation with Node.js 22 and npm:

```bash
npm install
npx playwright install --with-deps chromium webkit
npm run build:site
npm run test:e2e
```

Tests run the production-generated site on `http://127.0.0.1:4173`. An external production smoke run is deliberately separate because Cloudflare WAF challenges can affect automation; a passing local run is **not** proof of live edge availability.

## Google-certified CMP configuration (account owner must perform)

Google's AdSense Privacy & messaging can manage European regulation messages. For personalised AdSense advertising in the EEA, UK and Switzerland, Google requires a Google-certified CMP with IAB TCF integration. Docvelio's custom preferences banner is not one and is intentionally not represented as one.

1. Sign in to [AdSense](https://www.google.com/adsense/), open **Privacy & messaging > European regulations**.
2. Configure/publish a European regulations message for **docvelio.com**, including privacy policy link `https://docvelio.com/privacy/`, the applicable vendors/purposes and required consent choices.
3. Confirm the current published Google script and consent message behave correctly from a test browser/location. Inspect actual browser requests, cookies and `__tcfapi` consent data where applicable. A code review cannot certify the CMP or legal compliance.
4. Keep local privacy choices strictly separate from Google advertising consent. The current client-side `docvelio-ga4.js` starts with `ad_storage`, `ad_user_data` and `ad_personalization` denied; site privacy choices update analytics only. **Do not automatically translate "Accept site preferences" into ad acceptance.**
5. Confirm the real privacy/cookies disclosures against the actual installed tags, provider/vendor setup and any region-specific legal requirements before enabling ad units.
6. After publishing the Google message, verify the state with a real browser and rerun the browser QA and AdSense preflight. Only then consider review resubmission in the AdSense dashboard.

## Cloudflare outstanding issue

The known external test [live indexability run](https://github.com/Ali-1999/docvelio/actions/runs/42098551214) returned HTTP 403 and `cf-mitigated: challenge` for `/sitemap.xml`. Repo changes to HTML cannot fix this edge WAF challenge. Follow [scoped Cloudflare remediation](CLOUDFLARE_SITEMAP_CHALLENGE_FIX.md), then rerun the live indexability Action.

## Truthful scope statement

Playwright uses **real browser engines** and evaluates concrete outputs, but it cannot automatically replace full editorial, accessibility, security, copyright, or legal review. The earlier 589-page static audit found and fixed duplicate localized guide descriptions. A genuine human editorial sample should still review page facts, tool limits, copyrighted claims, localized nuance, examples and illustrations.

No approval likelihood or Google AdSense score is inferred from the browser tests.
