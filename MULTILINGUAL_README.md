# Docvelio: 10 native website languages (not a translator widget)

Supported: English at `/`, Spanish `/es/`, French `/fr/`, German `/de/`, Portuguese `/pt/`, Arabic `/ar/`, Hindi `/hi/`, Indonesian `/id/`, Turkish `/tr/`, Simplified Chinese `/zh/`.

Each localized page is emitted as a static HTML file. This site does **not** integrate a translation API or browser translator. Language selection follows the equivalent page path and **never auto-redirects** users. There are 10 versions of every main tool, guide, and site-policy page. English is the primary content and remains at its old URL.

SEO: Each page has a localized title, description, canonical URL, `lang`, reciprocal `hreflang` and `x-default`. `sitemap.xml` includes the same alternate-language graph. Test each URL live and submit the sitemap to Google Search Console only AFTER connecting docvelio.com and running the launch script.

### Deployment
Extract ZIP and from the project root run: `npx wrangler deploy`. Config preserves existing `curly-bonus-a447` Worker. Backup before deploying.

### Production preparation
`py scripts/prepare_launch.py --email 'YOUR_REAL_EMAIL' --operator 'YOUR_REAL_OPERATOR_NAME' --jurisdiction 'YOUR_REAL_COUNTRY' --launch`
Then `npx wrangler deploy`.

This project remains **noindex preview** until --launch is explicitly run. Do not launch with legal placeholders. Verify translation accuracy with native readers, especially legal notices, before indexing. The translated legal notices are concise drafts and are NOT legal advice. Google AdSense review requires genuine contact, privacy disclosures, working tools, sufficient helpful original content, and where required a certified CMP. Do NOT place AdSense scripts into editors before proper consent and review. The site does not include a real publisher ID.

### Important functional limits
The UI is localized in 10 languages, while underlying processing is browser based. Existing PDF editing and watermark engines rely on PDF StandardFonts and cannot reliably embed Arabic, Devanagari or Chinese text in PDF annotations/watermarks without adding a separate embedded Unicode font implementation. Visual cover is not secure redaction. DOCX round-trip may simplify complex layouts. Errors from upstream libraries may appear in English. Test each editor using relevant languages; PDF text language support should be enhanced before advertising full native-language PDF annotation.

### Where to edit
`/assets/i18n.js`: static runtime message dictionary; `assets/locales.css`: language selector and RTL layout; `/es/`, `/fr/`, etc.: rendered HTML. Original English is at `/`.
`/assets/tools.js` and other editors reuse the same processing code across all languages.

### Note on scaling
The sitemap contains about 230 separate localized URLs; do not use location-dependent redirects. A robust multilingual SEO launch benefits from native-speaker proofreading and richer original guides before requesting AdSense review. Separate locale paths alone do not guarantee search rankings.
