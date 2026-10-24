# Docvelio feature coverage and future work

This project is an independent product. Doclio is used only as a public feature-comparison reference. No Doclio code, branding or assets have been copied.

## Existing Docvelio tools (9)
Word editor, edit PDF with visual annotations, view PDF, merge PDF, split/extract pages, rotate PDF, images to PDF, watermark PDF, remove pages.

## Added on this development branch (9)
- Organize and duplicate PDF pages (enter page sequence).
- PDF to JPG; each page rasterized, multi-page results ZIP.
- PDF to PNG; each page rasterized, multi-page results ZIP.
- Extract selectable text from PDF to UTF-8 TXT (not OCR).
- Add handwritten signature image to a PDF copy (not a cryptographic signature).
- Fill existing interactive PDF text fields and checkboxes (not creation of new fields).
- Insert JPG/PNG image onto a PDF page.
- Compress JPG/WebP images via browser canvas.
- Rasterize PDF pages to compressed JPEG images in PDF (may remove hyperlinks, form fields, searchable text and accessibility; may increase file size).

All nine new tools use distinct static URLs in English, Spanish, French, German, Portuguese, Arabic, Hindi, Indonesian, Turkish and Simplified Chinese. These static routes are generated during the Cloudflare/Wrangler build (not committed individually). The new pages include language-specific headings, descriptions, canonical URLs, hreflang references and sitemap entries.

## Not yet supported — do not advertise as working
- AI summarization, translation and PDF chat (would require protected API credentials, terms and data-retention controls).
- OCR to searchable PDF (requires OCR engine, quality validation and device/runtime testing).
- Layout-faithful PDF ↔ DOCX/PPTX/XLSX and Office → PDF conversions (needs dedicated conversion engine).
- Secure PDF password encryption/unlocking and permissions changes (pdf-lib cannot implement this).
- True in-place modification of embedded PDF text with original font/layout preservation.
- Cryptographic/digital signature with certificate verification or legal compliance guarantees.
- Form-design templates, government forms library, template editing and backend user accounts.
- Drag-and-drop page-thumbnail organizer; current organizer uses an explicit page-number sequence.

## Security, privacy and AdSense
- Current browser-only tools process document bytes locally. Libraries loaded from CDNs still create network requests (metadata, not file contents by design).
- Do not claim AES-256 file storage, GDPR certification, SOC 2, HIPAA certification or legal signature validity without evidence.
- Operator: Ali Hamza, Riyadh, Saudi Arabia; public contact: alihamzasbr@gmail.com.
- A live AdSense publisher account ID and an appropriate certified consent platform are not configured. Ads remain inactive.
- The Google AdSense site review cannot be guaranteed; legal policies, editorial quality and tools should be checked on a live production URL before submission.

## Test and release
- `node scripts/extend-toolkit.cjs && node scripts/build-docvelio.cjs && node scripts/test-docvelio.cjs`
- Run tests on the GitHub pull request and manually test real PDF documents in Chrome/Firefox/Safari, including mobile browsers and all ten locales.
- Merge the pull request to `main` only after testing. GitHub-based Cloudflare deployment will then publish the update.
