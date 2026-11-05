# Docvelio: Google AdSense readiness checklist

**Updated 5 November 2026:** The domain, operator details, owner-supplied publisher ID and verification installer are configured in the production build. Live Cloudflare deployment, dashboard-specific reasons and certified advertising CMP are **not yet confirmed**. See [current AdSense review audit](docs/ADSENSE_REVIEW_AUDIT_2026-11-05.md).

Google AdSense has no promise of approval, guaranteed traffic threshold, or universally required article count. Site quality, originality, ownership, policy compliance and useful navigation all matter.

## A. Required owner decisions (not filled by ChatGPT)

- [ ] Confirm **docvelio.com** remains under your control and resolves to the production Cloudflare deployment.
- [ ] Check name/trademark conflicts in countries where you intend to operate.
- [ ] Connect permanent domain to Worker in Cloudflare, configure TLS and redirect `www` to primary domain (or vice versa).
- [ ] Confirm existing operator details in `scripts/build-docvelio.cjs` are correct and the public support mailbox is monitored; do not replace them with sample values.
- [ ] Review Privacy/Cookies/Terms for your actual legal circumstances. In particular, update any claim that becomes inaccurate when adding analytics, other ads vendors, file uploads or accounts.
- [ ] Test the full current tool inventory with real non-sensitive sample files, including PDF download, DOCX export, image operations and error states on mobile.
- [ ] Verify tool pages, guides and policies are genuinely helpful and correct, not merely filler; add original screenshots/examples if useful.

## B. SEO / indexation

- [ ] Check that deployed `robots.txt` allows crawling and no HTTP `X-Robots-Tag: noindex` is served. Do not activate `--preview` on production.
- [ ] Visit `/robots.txt`, `/sitemap.xml`, `/ads.txt`, `/privacy/`, `/terms/`, `/cookies/`, `/contact/`, `/about/` on the **permanent** domain.
- [ ] Make sure canonical URLs on pages point to the public production domain and `www` redirects consistently.
- [ ] Verify Search Console domain property, submit `/sitemap.xml`, review Coverage / indexing issues.
- [ ] Avoid artificial SEO claims or copied/spun filler content. Confirm the editor and download links work.

## C. AdSense — after you have an account

- [ ] Create/complete AdSense account and add your domain.
- [x] Site build already uses owner-supplied publisher `pub-1566581424297065`, inserting the verification script/meta and root `ads.txt`. Confirm the ID is still accurate in AdSense.
- [ ] Ensure `/ads.txt` has the exact line from your own account, without placeholders; wait for Google to detect it (may take days).
- [ ] AdSense ownership verification is already installed. Do not enable display-ad placements/personalised ads before account approval and applicable consent/privacy configuration.
- [ ] If serving ads to EEA / UK / Swiss visitors, use Google-certified CMP integrated with IAB TCF per Google requirements. Configure Privacy & messaging or another certified CMP and test messages.
- [ ] Do not place ads where visitors might confuse an ad with a download action or tool button.
- [ ] Submit site for review; approval is not guaranteed and any violations/content quality issues must be addressed.

## D. Honest notices

- [ ] Never describe visual text cover-ups as secure redaction.
- [ ] Do not claim high-fidelity editing of all DOCX or PDFs.
- [ ] Avoid claiming that processing means zero third-party network requests; hosted libraries are fetched from CDNs.
- [ ] Test PageSpeed, mobile layout and accessibility. No ads when previewing if consent is not configured.

## Official references

- Google AdSense eligibility: https://support.google.com/adsense/answer/9724
- Google site quality: https://support.google.com/adsense/answer/7299563
- Required privacy disclosures: https://support.google.com/adsense/answer/1348695
- Ads.txt guidance: https://support.google.com/adsense/answer/12171244
- Publisher CMP requirements: https://support.google.com/adsense/answer/13554116
- Connect site: https://support.google.com/adsense/answer/7584263
- Google Search sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
