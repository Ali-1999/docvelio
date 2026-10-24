# Docvelio privacy choices and cookie banner

**Implemented 24 October 2026.** This is a small, original, dependency-free privacy-choice interface in the 10 site languages. It appears on first visit, offers one-click **Accept** and **Decline** with equally prominent buttons, explanatory details and a link to the localized Cookie Policy. A **Privacy settings** footer button lets visitors withdraw or change their decision anytime.

## Why this banner is limited

The checked-in website does **not** currently activate Google AdSense or a third-party advertising pixel. Its core PDF and Word tools run without an account. A blanket claim that a banner is legally mandatory for websites using only strictly necessary cookies would be inaccurate.

For a current, meaningful optional purpose, **Accept** allows the homepage to remember the visitor's selected tool category between visits. **Decline** does not save that category and deletes it if previously set. Advertising and optional analytics remain **off either way**. This banner does not set advertising or analytics cookies, pretend to change a service that has not yet been installed, or preauthorise new trackers added in the future.

## Storage keys

- `docvelio_privacy_choice_v1`: localStorage record with the choice (`accepted`/`declined`), version, and timestamp. Kept for up to 180 days, then visitors are asked again. Needed to remember a privacy choice.
- `docvelio_tool_category_v1`: last selected tool category. Saved only after consent; immediately cleared on Decline. The visitor can browse and use every tool without enabling it.

The choice is stored **on the visitor's device**, not submitted to Docvelio's server. If localStorage is disabled, preference persistence may be unavailable. Hosting providers and CDN services can still receive normal request metadata and may use security technologies outside this script's control.

## Before enabling analytics or ads

1. Audit every tracker and cookie, its provider, purpose, expiry and regional requirements. Document them accurately.
2. Do not load non-essential trackers before the applicable consent mechanism permits them. Build purpose-specific controls that actually gate or block the scripts.
3. **Version the choices and re-prompt** when purposes or vendors change; no previously recorded `accepted` value can lawfully be treated as informed consent for an advertising system not disclosed when chosen.
4. In the **EEA, UK and Switzerland**, if Google AdSense requires a Google-certified CMP that supports IAB TCF, deploy such a CMP **instead of treating this site preference banner as AdSense consent**. See [Google's publisher requirements](https://support.google.com/adsense/answer/13554116).
5. Review applicable national privacy law, including Saudi PDPL as applicable to the operator and EU/UK rules where relevant. Do not claim compliance from the presence of a banner alone.

## Tests

CI executes `node scripts/test-consent.cjs` after generating all 431 HTML pages. It checks the banner is included once per page, privacy notices are present in all 10 languages and simulates Accept, Decline, reopening settings and clearing the optional tool filter.

## Interface

- `public/assets/cookie-consent.js`
- `public/assets/cookie-consent.css`
- `scripts/apply-design.cjs` injects assets and policy notices into every page.
- `public/assets/site.js` saves tool category **only after** consent.

The goal is meaningful user choice with minimal page weight, not an unnecessary tracking implementation or a substitute for legal review.
