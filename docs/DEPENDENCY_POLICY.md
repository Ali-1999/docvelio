# Docvelio dependency policy

**Project goal:** First-party tools and a maintainable codebase. Do not clone, copy, or vendor another developer's GitHub repository into this project.

## Rules for new features

1. Implement small standalone algorithms in Docvelio's own source when practical.
2. Do not commit third-party repository trees, git submodules, copied `.git` folders, or unreviewed third-party source bundles.
3. If a mature dependency is genuinely needed for complex functionality (for example, parsing PDF or DOCX), use an explicitly reviewed and properly licensed package or a documented external service. Do **not** present such functionality as dependency-free.
4. Prefer local, privacy-respecting processing for files and personal payment details. Do not send payment data to a remote QR API.
5. Keep copied third-party sources out of `public/assets/vendor/`. The Europe calculator test checks that the former copied QR library is absent.
6. Treat published technical standards and algorithm specifications as references, not repositories to copy.

## Current five-tool implementation

- Euro pallet stacking: Docvelio `europe-tools-core.js`.
- A4/A3 DPI conversion: Docvelio `europe-tools-core.js`.
- SEPA EPC QR: Docvelio `europe-tools-core.js` and original `docvelio-qr.js` (UTF-8, byte mode, QR versions 1–13 at error-correction level M).
- Print bleed calculator: Docvelio `europe-tools-core.js`.
- RF creditor reference: Docvelio `europe-tools-core.js`.
- Excel sample calculations: native JavaScript in `excel-formula-generator.js`, without the previously loaded Formula.js CDN.

**Third-party services still in use elsewhere:** Cloudflare Workers AI provides free-text Excel formula suggestions; Google AdSense and Ahrefs Analytics are external scripts. Existing document processing functionality may use specialist third-party browser libraries. The policy concerns **cloned or vendored repositories**; it does not claim the entire site is free of all external services.

## Tests

Run `node scripts/test-europe-tools.cjs` after the production build. It verifies the five tools, QR matrices and that the copied third-party QR library has not returned. Run `node scripts/test-excel-formula.cjs` to ensure that the removed Formula.js CDN has not returned to the Excel calculator.
