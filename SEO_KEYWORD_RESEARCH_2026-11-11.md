# Docvelio SEO Keyword Research — Evidence-Led Initial Findings

**Research date:** 11 November 2026  
**Primary market:** United States, English  
**Secondary market:** United Kingdom, English  
**Repository reviewed:** `Ali-1999/docvelio`  
**Status:** initial live SERP/competitor-page research and keyword-to-URL candidate map. This is not a complete Google Keyword Planner, Search Console, autocomplete or People Also Ask dataset.

## Executive summary

The repository's existing keyword map supplies the initial route-to-intent hypotheses. This research checked live search results and competitor landing pages for merge PDF, compress PDF, image resize, PDF annotation and PDF signing. Search results retrieved on 11 November 2026 surface PDF24, Smallpdf, Adobe and iLoveIMG pages for the respective tasks. These observations support relevance and feature benchmarking, but they do not establish exact organic positions or a complete top-ten ranking set.

**No search volumes, CPCs, keyword difficulty values, positions, impressions or CTRs were available from an authorised account export.** Those fields remain NOT AVAILABLE in the accompanying CSV. Search snippets and competitor page text cannot substitute for Keyword Planner or Search Console metrics.

## Research sources and findings

### Merge PDF
- PDF24's merge page exposes drag-and-drop file ordering, page mode, bookmarks, blank pages, cover pages, table of contents and page labels. It explains how to merge and offers no-registration messaging. <https://tools.pdf24.org/en/merge-pdf> [source](https://tools.pdf24.org/en/merge-pdf).
- Smallpdf's merge page describes file upload, multiple input formats and combining into one PDF; it links into a wider PDF suite.
- Implication: Docvelio should show its actual ordering and page controls, file limits and export state clearly. Do not claim PDF24's extra formats or page mode unless Docvelio actually supports them.

### Compress PDF
- PDF24 exposes adjustable DPI/image quality and multiple optional optimisation controls, including metadata, annotations and attachments. Its FAQ explicitly notes that image-heavy PDFs tend to compress more than text-only PDFs and that quality/size are trade-offs.
- Smallpdf positions a free compressor and notes usage limits and paid stronger compression modes.
- Implication: show actual input size, output size and reduction where technically measured. Explain why a text-only or already-compressed PDF may show little reduction. Do not promise a percentage or exact KB outcome.

### Resize image
- iLoveIMG's current resize page supports pixel and percentage modes, maximum dimensions, maintain-aspect-ratio and do-not-enlarge options.
- A further image-resizer result describes exact width/height, browser processing and result dimensions; treat that domain separately from the supplied competitor list.
- Implication: the useful benchmark is precise dimensions, aspect-ratio clarity and actual output dimensions. Bulk resizing is a feature opportunity only if Docvelio implements and tests it.

### Edit/annotate PDF
- Smallpdf's PDF annotator lists highlighting, text, drawing, shapes and comments.
- Implication: Docvelio's page must distinguish annotations/overlays from replacing original PDF text. Covering text with a white shape is not secure redaction.

### Sign PDF
- Adobe's Fill & Sign page describes selecting a PDF, signing/filling fields, account-related completion and download. It explains electronic signatures versus certificate-based digital signatures.
- Implication: Docvelio should state whether it supports typed/drawn/uploaded signatures, whether sign-in is required, what is exported and what legal/identity assurances are not provided. Do not imply certificate-based signing or audit trails without implementation.

## Keyword database

The accompanying `DOCVELIO_KEYWORD_RESEARCH_INITIAL.csv` contains 50 keyword rows grouped against the repository's existing keyword clusters and URLs. These are **candidate query variants and cluster assignments**, not 50 verified autocomplete/PAA phrases. A subset of clusters has direct live competitor SERP evidence cited above. Metrics intentionally remain blank/NOT AVAILABLE until exported from the relevant data source.

### Top priority clusters (provisional usefulness-based ranking)
1. Merge PDF online / combine PDF files — existing `/tools/merge-pdf/`.
2. Compress PDF online / reduce PDF size — existing `/tools/compress-pdf/`.
3. Resize image online / resize to exact pixels — existing `/image-tools/resize-image/`.
4. Edit PDF online / annotate PDF — existing `/tools/edit-pdf/`.
5. Sign PDF online / fill and sign — existing `/tools/sign-pdf/`.
6. Split PDF / extract pages — existing map route `/tools/split-pdf/`.
7. Reduce image size in KB — existing map route `/image-tools/reduce-image-size-kb/`.
8. Crop image online — existing map route `/image-tools/crop-image/`.
9. CBM calculator — existing map route `/cbm-calculator/`.
10. Volumetric weight calculator — existing map route `/shipping-tools/volumetric-weight-calculator/`.

**Priority labels are provisional editorial priorities, not an impression-based ranking.** Validate route existence and actual controls in production before publishing claims. The repository README lists a nine-tool PDF set; the wider map includes image and shipping routes. This difference must be reconciled against the deployed site and sitemap before development.

## Search intent rules

- **Task completion:** action phrases such as merge, compress, resize, sign, split, crop and calculate. Put the working control before extended prose.
- **Informational:** how-to, privacy, compression quality, redaction and dimensional-weight explanations. Answer directly, show limitations and link to the relevant tool.
- **Commercial investigation:** best/free/no-account comparisons. Publish only after dated hands-on tests of features, limits, privacy and output.
- **Navigational:** Docvelio brand searches. Ensure homepage, about, contact and branded navigation are clear.

## Market handling

The CSV records US and UK as target markets to investigate separately. It does not claim market-specific volume. Run separate Keyword Planner exports and GSC country filters for United States and United Kingdom; do not combine the markets into one volume estimate.

## Research limitations and required next evidence

| Source | Current state | Required next step |
|---|---|---|
| Google Search Console | Not connected/read in this task | Export 3 months and 28 days by query/page/country, search type Web |
| Google Keyword Planner | Not connected/read in this task | Export exact match/phrase ideas, US and UK separately, English, with date and settings |
| Google autocomplete | Not captured as exact UI suggestions | Capture exact phrases and locale/date for top 10 clusters |
| People Also Ask | Not captured as exact PAA cards | Capture question text and SERP context; do not substitute guessed FAQ headings |
| Support enquiries | No support inbox/contact data accessed | Export anonymised question themes, frequency and dates |
| Top-ten organic results | Search result samples only; no reproducible full top-ten dataset | Capture ten organic URLs per target query, market, device and date; exclude ads and SERP features from organic count |
| Production controls | Live Docvelio URLs could not be read by the browser tool | Test actual upload/input, controls, result, download and error states in browser |

Note: Google Ads Keyword Planner's competition metric measures advertiser competition; it is not organic SEO difficulty. Use a named SEO dataset/provider for organic difficulty or mark it unavailable.

## Immediate implementation guidance

1. Verify actual production routes and tool functionality first.
2. For each top priority page, make the tool usable near the top, state accepted input formats and limits, show output/result clearly, and add concise original help.
3. Build one primary keyword cluster per page. Keep close variants on the same page unless SERP intent differs materially.
4. Add contextual links between related tools (merge ↔ split ↔ compress; resize ↔ crop ↔ convert ↔ reduce KB; CBM ↔ volumetric weight ↔ container capacity).
5. Measure tool completion events in addition to rankings: tool_start, tool_success, download_success and tool_error, with privacy-safe event parameters.
6. Reprioritise using actual GSC impressions, clicks, CTR, position and conversion/task-completion data. Do not publish thin pages simply to target every long-tail variation.

## Evidence-linked live search samples

- PDF24 merge page and controls: <https://tools.pdf24.org/en/merge-pdf>
- Smallpdf merge page: <https://smallpdf.com/merge-pdf>
- PDF24 compression controls and FAQ: <https://tools.pdf24.org/en/compress-pdf>
- Smallpdf compression page and free-plan caveats: <https://smallpdf.com/compress-pdf>
- iLoveIMG resize controls: <https://www.iloveimg.com/resize-image>
- Smallpdf annotator controls: <https://smallpdf.com/pdf-annotator>
- Adobe Fill & Sign workflow: <https://www.adobe.com/acrobat/online/sign-pdf.html>
