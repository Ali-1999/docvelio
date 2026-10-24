# Docvelio responsive UI/UX refresh — October 2026

This redesign is an original, dependency-free **CSS + progressive JavaScript** layer for Docvelio's static Cloudflare Workers site. It is applied to all 430 localized content URLs and the custom 404 page during the build, without replacing document processing code.

## Open-source research references

These repos informed the **design principles**, not copied code:
- [shadcn/ui](https://github.com/shadcn-ui/ui) — composable visual styling, compact card and control patterns; MIT.
- [Radix Themes](https://github.com/radix-ui/themes) — accessible color, spacing and token practices; MIT.
- [Headless UI](https://github.com/tailwindlabs/headlessui) — interaction patterns for keyboard navigation and focus states; MIT.

Because Docvelio is HTML/CSS/JavaScript and **not a React application**, adding the libraries themselves would introduce a framework and runtime dependencies for no meaningful UX benefit. No third-party UI component source was imported.

## What changed

- Shared brand tokens: blue/turquoise accents, consistent surface colors, spacing, subtle shadows and rounded corners.
- Responsive header across languages; active route highlighting; outside-click and Escape closure for expanded mobile menus.
- More readable and better-spaced homepage hero, equal-height tool cards, clear search and filter controls.
- Consistent upload boxes, inputs, selects, document workspaces and controls, with practical touch dimensions.
- PDF viewer/editor spacing and scrollable canvas; Word toolbar remains horizontally scrollable on narrow phones without altering editing behavior.
- Blog/article typography, related links, contextual SEO help, guides, policies, compact social buttons and footer.
- RTL Arabic treatment, visible keyboard focus and reduced-motion support.
- No new JavaScript dependencies, tracking pixels, font CDN requests or client-side framework.

## Validation

Run:
```bash
node scripts/extend-toolkit.cjs
node scripts/build-blogs.cjs
node scripts/build-docvelio.cjs
node scripts/site-shell.cjs
node scripts/page-content.cjs
node scripts/apply-design.cjs
node scripts/seo-audit-fixes.cjs
node scripts/test-docvelio.cjs
node scripts/test-ui.cjs
python3 scripts/verify-sitemap.py
```

The website retains the previous SEO canonical/hreflang/sitemap URLs, PDF processing implementation, Word content editor and privacy/policy copy.

## Manual visual QA still recommended

Test at **320, 375, 390, 430, 768, 1024, 1280 and 1440 pixels** in Chrome and Safari, including Arabic RTL. Check: header/nav open-close, language switcher, tool selection, file picker, PDF large-page preview, signature drawing, interactive PDF form, Word ribbon and editable canvas, blog legibility, focus order and print output.

CI validates generated markup and source syntax but does not replace real-browser rendering checks, screen-reader evaluation or live Cloudflare deployment verification.
