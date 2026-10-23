# Docvelio — Online PDF & Word Tools

Brand: **Docvelio** (`https://docvelio.com/` as the intended canonical domain). Existing Cloudflare Worker name: `curly-bonus-a447`, unchanged on purpose so deploys can update the same working site.

## What's included

- 9 existing browser tools, with original code and paths preserved: Word Editor, Edit PDF, View PDF, Merge PDF, Split PDF, Rotate PDF, Images to PDF, Watermark PDF, Remove Pages.
- Consistent Docvelio page titles, favicon, footer, social metadata and canonical URLs.
- About, Contact, Privacy Policy, Cookie Policy, Terms of Use, Disclaimer and Accessibility pages.
- 5 useful document guides, one `404.html` page, `robots.txt`, `sitemap.xml`, `ads.txt`, website manifest and `_headers`.
- `scripts/prepare_launch.py`: owner contact setup, optional publisher-ID verification and preview/launch switch.

**Please note:** Adding legal pages or meta files does not guarantee Google AdSense approval. These files are drafts, not legal advice. They must accurately reflect your real business, cookie vendors, email address and local law before publication. See `ADSENSE_LAUNCH_CHECKLIST.md`.

## How to update the current Cloudflare Worker (preview)

1. Download and extract this ZIP; open PowerShell **inside the folder containing `wrangler.jsonc`**.
2. If needed: `npx wrangler login`
3. Deploy preview: `npx wrangler deploy`
4. Preview site: `https://curly-bonus-a447.garageaone-offical.workers.dev/`

The ZIP is **in staging mode by default**: search-engine indexing is blocked via `robots.txt` and the `X-Robots-Tag` header. This is deliberate because the owner and email fields have not been provided.

## Before switching to the permanent domain

Register `docvelio.com` and connect it to Cloudflare: Worker `curly-bonus-a447` → Settings → Domains & Routes → Add → Custom Domain. Verify both `docvelio.com` and `www.docvelio.com` resolve as intended, with a redirect from one version to the primary canonical domain. This project assumes **https://docvelio.com/** as the canonical URL. Change the canonical host and sitemap if you choose `www` instead.

Provide genuine identifying and contact details (substitute your real details):

```powershell
py scripts\prepare_launch.py --email "your-real-email@example.com" --operator "Your business or own legal name" --jurisdiction "Your country" --launch
npx wrangler deploy
```

Use the real details **before** submission. The contact mailbox must receive messages. Test the About/Privacy/Cookies/Terms text; you are responsible for making them accurate, not just filling placeholders.

### AdSense verification — after creating an AdSense account

Obtain your real ID inside AdSense (looks like `pub-` plus 16 digits); don't use the sample below literally:

```powershell
py scripts\prepare_launch.py --publisher "pub-1234567890123456"
npx wrangler deploy
```

This creates `/ads.txt` in the proper format and adds the static `google-adsense-account` meta tag. It **does not insert the AdSense JavaScript ad unit or load advertising**, so there is no unconfigured ad tracking. If AdSense shows another verification method or an updated record, follow the **exact** code shown inside your account.

### Privacy / consent before enabling actual ads

If you intend to serve ads to visitors in the EEA, UK or Switzerland, use a **Google-certified CMP with IAB TCF integration** and complete its AdSense privacy configuration before enabling ad serving. A custom cookie banner alone does not satisfy Google's CMP requirement for those audiences.

## Google Search Console

After your permanent domain is connected and `--launch` has run, visit `https://docvelio.com/robots.txt` and `https://docvelio.com/sitemap.xml`. Add the domain property to Search Console and submit the sitemap. `robots.txt` and sitemap entries in this project target `https://docvelio.com/`.

## Local preview

`cd public; py -m http.server 8080` and open `http://localhost:8080` (some routes may depend on slash handling that Cloudflare provides; static dev server fallback may vary).

## Technical caveats

- PDF overlays are **not secure redaction**. The PDF editor cannot genuinely rewrite all original PDF text in place.
- Word DOCX import/export is simplified. Expect formatting changes in complicated documents.
- External JS CDNs must be available; test all nine tools online on desktop/mobile, including actual PDF/DOCX imports and exports.
- Browser processing means selected documents aren't sent to the app backend, but Cloudflare and third-party CDNs still receive normal network metadata.

## Operational caution

The Worker name in `wrangler.jsonc` deliberately remains `curly-bonus-a447` to preserve the existing Workers URL. Before deploy, back up any previously modified worker scripts/settings that aren't in this source bundle; this deploy can overwrite them. This is a static-assets project and does not include account or subscription functionality.
