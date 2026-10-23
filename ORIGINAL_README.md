# Docvelio — PDF + Word tools (October 2026)

**Not deployed.** Updated from existing 8-tool site with a redesigned interface plus **Word Editor** at `/tools/word-editor/`.

## Included tools (9)

- Word Editor: create, import DOCX or TXT, edit text/headings, bold/italic/underline/strike, color/font/size/alignment, ordered/unordered lists, link, basic table, word count, export real DOCX and TXT, browser Print/Save as PDF.
- PDF Editor: annotate, cover visually (NOT redaction), preview, save & download.
- PDF Viewer: preview and download original PDF.
- Merge PDF, Split PDF, Rotate PDF, Images to PDF, Watermark PDF, Remove Pages.

## Deploy to **existing Cloudflare Worker**

Your current URL uses `*.workers.dev`, **not** Pages. If your existing Worker was deployed with Wrangler and static assets:

1. Extract this ZIP into a folder. Ensure `index.html`, `assets/`, and `tools/` appear at its root.
2. In a terminal inside the extracted folder, run `npx wrangler deploy --name curly-bonus-a447 --assets .` after authenticating via `npx wrangler login`. This CLI command creates or updates a Worker named `curly-bonus-a447` in the Cloudflare account you authenticated with. **Check the name and existing Worker configuration first**; overriding an existing Worker may replace custom code, environment variables or routing.
3. For Cloudflare Pages **Direct Upload** instead, upload the ZIP through the Pages project's Deployments UI. Do not confuse Pages with Workers.
4. For a custom Workers deployment managed by GitHub or another platform, apply the site files to that existing project and use its build/deploy flow.

You can preview locally using `python -m http.server 8080`, then browse `http://localhost:8080`.

## Important limitations

- Word import uses Mammoth 1.13.0; untrusted DOCX HTML is sanitized by DOMPurify 3.3.0 before insertion. Word export uses docx 9.11.0. These JS libraries load through pinned jsDelivr URLs and require network access.
- Word editor creates fresh DOCX (not direct in-place DOCX modification). Exact Word layouts, headers, comments, tracked changes, footnotes, nested lists, page breaks, images, unsupported script formatting and complex tables may not round-trip accurately. Test the export. No old `.doc` support.
- The PDF editor only adds overlay annotations; white Cover is **not secure redaction**.
- PDF.js and pdf-lib also load from jsDelivr. Documents are processed in browser; application does not send document contents to a server, but CDNs see ordinary requests for library scripts.
- Temporary preview `robots.txt` and `_headers` still block indexing. Remove noindex rules, customise branding and contact details, verify site policy pages, accessibility, security, original content, domain setup and consent compliance **before** AdSense application. Approval is never guaranteed.

## Attribution

Open-source libraries: Mozilla PDF.js (Apache-2.0), Hopding/pdf-lib (MIT), mammoth.js (BSD-2-Clause), docx (MIT), DOMPurify (Apache-2.0/MPL-2.0). Review upstream notices and license requirements before distribution.
