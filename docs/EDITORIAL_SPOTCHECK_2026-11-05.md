# Docvelio: evidence-based editorial spot check

**Date:** 5 November 2026  
**Review basis:** `scripts/blog-data-en.cjs`, live-tool source files, generated-site metadata reports and current product descriptions. This is an **AI-assisted editorial spot check**, not legal certification, a human subject-matter peer review, or proof that Google has approved the pages.

## Scope

Reviewed the 10 English blog topic records, their page-specific headings, instructions, examples and FAQs, as well as selected tool and trust-page source content. The full CI-generated structural inventory checks 589 generated pages, but a full sentence-by-sentence human review of 589 pages or native-speaker sign-off for nine additional languages has **not** been performed.

## Specific editorial findings and fixes

| URL or source | Observed statement | Risk | Action |
|---|---|---|---|
| `/tools/qr-code-generator/` | FAQ asked "Are these QR codes free forever?" | A claim about indefinite future pricing cannot be guaranteed | **Fixed:** The FAQ now says the tool currently creates QR codes for free, without promising a permanent price or guarantee about link destinations |
| `/tools/barcode-generator/` | Badge said "100% browser-side · No third-party requests" | The page can load analytics, AdSense and other third-party resources; browser-side barcode *generation* does not imply zero third-party network requests | **Fixed:** Badge now states that barcode generation runs locally and does not use an external barcode service |
| `/tools/edit-pdf/` and related English blog | Claims around adding annotations vs rewriting source PDF text | Must not imply full editable PDF text or secure redaction | Current blog clearly distinguishes annotation from embedded-text editing and warns that visual cover-up is **not secure redaction** |
| `/tools/compress-pdf/` and compression blog | Rasterising pages may reduce file size but lose searchable text or form features | Users could rely on altered documents | Current educational content explicitly warns about irreversible loss of searchable content and form features |
| `/tools/sign-pdf/` and signature blog | A drawn signature differs from a cryptographic signature | Legal/security confusion | Current blog distinguishes the types and tells users to follow recipient requirements |
| Scanned-PDF/OCR blog | Text extraction from image-only scans | Misleading OCR claims | Existing guide explains that image-only scans require OCR rather than ordinary PDF text extraction |
| `/about/` and `/privacy/` | Broad descriptions of local document processing | User could infer that no third-party script or provider receives requests | Current About/Privacy content mentions third-party CDN/network requests and limitations, and does not promise zero website network connections |

## Ten English blog topics inspected

1. How to Edit a PDF Online: Annotations, Text and Safe Workflows
2. How to Merge PDF Files Online Without Losing Page Order
3. Split PDF Pages Online: Extract, Remove and Share Only What You Need
4. How to Compress a PDF: File Size, Image Quality and Searchable Text
5. Convert PDF to JPG or PNG: Which Image Format Should You Choose?
6. Convert JPG and PNG Images to PDF: Photos, Scans and Receipts
7. How to Sign a PDF Online: Drawn Signatures Versus Digital Signatures
8. Fill PDF Forms Online: Interactive Fields, Checkboxes and Scanned Forms
9. Extract Text From a PDF: Selectable Text, Scanned Pages and OCR
10. Organize PDF Pages: Reorder, Rotate, Delete and Duplicate

The English articles contain topic-specific explanatory sections, examples and FAQs. They are not certified free of duplication or third-party copyrighted material by this spot check. Their length alone is **not** an AdSense eligibility metric.

## Consent interface changes

Docvelio's own privacy UI now states in 10 languages that choosing Accept **does not grant advertising consent**. The site defaults `ad_storage`, `ad_user_data` and `ad_personalization` to denied and only local analytics consent is changed by that UI. A certified, published IAB TCF CMP remains an **account-level prerequisite for personalised ads in relevant regions**, not something the local preference widget provides.

## Remaining editorial review

- Test translated examples with proficient speakers, especially legal and privacy language.
- Check each PDF/Word/image function against its published promise and use an independent sample file.
- Check any third-party logos, images, screenshots, claims about PDF security or file retention, and contributors' attribution.
- Inspect current real-network/Tag Assistant behavior before asserting details about consent or privacy.
- Preserve accurate, task-specific content. Do not pad guides to arbitrary word counts or create invented testimonials, credentials or citations.

## Verification

The new Playwright workflow performs real Chromium desktop/mobile and WebKit tests against synthetic sample files, including output verification. See [GitHub Actions real-browser QA](https://github.com/Ali-1999/docvelio/actions/workflows/browser-qa.yml) for the latest run and any failure evidence.

**Decision:** Editorial spot check completed, 2 concrete misleading claims corrected; broader human originality and translation review remains open.
