# Docvelio contextual internal linking implementation

**Implementation date:** 2026-11-02  
**Source:** 285 editorial placements covering 112 distinct source URLs (from the approved Docvelio keyword and Search Console research).

## Production build

The source of truth is `scripts/internal-links-map.json`, with an explicit source URL, destination URL, suggested anchor, intended placement and priority for each link. Do not create a separate landing page for each keyword variation.

`scripts/implement-internal-links.cjs` runs **after** all page generators, AdSense and analytics integration, and **before** the final homepage CSS optimiser. It validates the page paths, skips missing destinations instead of creating broken links, detects existing links in page content, and adds a single compact follow-up paragraph where needed.

The generator preserves original tool functionality, metadata, scripts, forms and navigation. It does not rely on a third-party library or client-side rendering for links.

Run the full existing build command from `wrangler.jsonc`. To re-run the linking pass on already-generated HTML:

```bash
node scripts/implement-internal-links.cjs
node scripts/test-internal-links.cjs
```

The pass is idempotent and will not accumulate duplicate generated paragraphs. Link sections are marked using `DV_CONTEXT_LINKS_BEGIN` and `DV_CONTEXT_LINKS_END` comments.

## Quality and limitations

- Confirm destination files are present before publishing. Unbuilt destinations are *skipped*, not linked.
- The post-build audit is saved to `reports/internal-linking-build.json` and reports **new**, **already linked**, **missing source**, and **missing target** counts. These four values sum to 285.
- Contextual anchors come from the approved plan. If an anchor was marked `LOCALISE:`, use the destination page's actual translated H1 instead of publishing that placeholder.
- Keep primary English-only utility routes in English; no fake translated destinations.
- A short group of contextual links is inserted after suitable explanatory prose. The placement queue's individual location labels are editorial suggestions, not instructions to create four repetitive widgets on a page.
- Existing in-content links are counted as satisfied; breadcrumb, footer and header navigation are not used as a substitute because detection is limited to the HTML `<main>` area.
- No `nofollow` is added to ordinary internal links.
- This code is **not proof of production deployment** or of higher Google rankings. Check the build log, live HTTP status, rendered HTML and Search Console after Cloudflare deploy.

## Tests

`scripts/test-internal-links.cjs` checks the 285 approved edges against generated HTML and confirms that no valid link is omitted from its page content. The GitHub Actions SEO-health workflow runs it after the full page build.

Avoid linking to unbuilt `/proposed/` pages or adding keyword-heavy links simply to increase the count. Review user usefulness first.
