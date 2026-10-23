# Docvelio: Google AdSense readiness checklist

Google AdSense has no promise of approval, guaranteed traffic threshold, or universally required article count. Site quality, originality, ownership, policy compliance and useful navigation all matter.

## A. Required owner decisions (not filled by ChatGPT)

- [ ] Register **docvelio.com** under your control (availability alone is not ownership).
- [ ] Check name/trademark conflicts in countries where you intend to operate.
- [ ] Connect permanent domain to Worker in Cloudflare, configure TLS and redirect `www` to primary domain (or vice versa).
- [ ] Set a **real monitored email**, actual operator/business name and country via `py scripts\prepare_launch.py --email ... --operator ... --jurisdiction ... --launch`.
- [ ] Review Privacy/Cookies/Terms for your actual legal circumstances. In particular, update any claim that becomes inaccurate when adding analytics, other ads vendors, file uploads or accounts.
- [ ] Verify all nine tool actions with real files, including PDF download, DOCX export and error states on mobile.
- [ ] Verify tool pages, guides and policies are genuinely helpful and correct, not merely filler; add original screenshots/examples if useful.

## B. SEO / indexation

- [ ] After domain connection, run `--launch` and redeploy so `robots.txt` is not `Disallow: /` and `_headers` no longer has `noindex`.
- [ ] Visit `/robots.txt`, `/sitemap.xml`, `/ads.txt`, `/privacy/`, `/terms/`, `/cookies/`, `/contact/`, `/about/` on the **permanent** domain.
- [ ] Make sure canonical URLs on pages point to the public production domain and `www` redirects consistently.
- [ ] Verify Search Console domain property, submit `/sitemap.xml`, review Coverage / indexing issues.
- [ ] Avoid artificial SEO claims or copied/spun filler content. Confirm the editor and download links work.

## C. AdSense — after you have an account

- [ ] Create/complete AdSense account and add your domain.
- [ ] Get the actual `pub-XXXXXXXXXXXXXXXX` publisher ID. Run `py scripts\prepare_launch.py --publisher "pub-YOUR_REAL_16_DIGITS"` and redeploy. This project uses static verification meta plus proper root `ads.txt`. Check account for any different required verification snippet.
- [ ] Ensure `/ads.txt` has the exact line from your own account, without placeholders; wait for Google to detect it (may take days).
- [ ] Do **not** run generic ad scripts on pages until consent and privacy arrangements are accurate. When approved, insert Google-provided ad code as directed.
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
