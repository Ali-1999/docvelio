# Week 2 — Search Intent Validation and Page Priorities

**Research date:** 2026-11-01 (Asia/Riyadh). **Working market:** United States / English; secondary validation candidate: United Kingdom / English. **Source of current query→URL hypotheses:** `SEO_KEYWORD_INTENT_MAP.md` (2026-10-30). **Status:** research and page briefs delivered; not a claim of completed GSC/Keyword Planner or exhaustive ten-result verification.

## Verification ledger (do not mistake a hypothesis for a measured keyword)
| Source | Status | What was actually verified | Missing action |
|---|---|---|---|
| Repository intent map | Verified | Existing URL hypotheses and four intent classes | Maintain map as pages change |
| Support tickets, contact questions | Not accessed | No user-specific message phrases verified | Aggregate anonymised real questions, frequency and dates |
| Google autocomplete | Not independently captured | None | Save exact suggestions, locale and date |
| People Also Ask | Not independently captured | None | Save exact questions and SERP locale/date |
| Google Keyword Planner | Not connected | No search-volume estimates or competition metrics | Export United States/English and UK/English separately |
| Google Search Console | No property data available | No impressions, clicks, CTR, average positions or indexing observations | Import 3-month and 28-day page/query exports |
| Competitor page inspection | Partial, not ten-per-cluster SERP audit | PDF24 merge; Smallpdf merge; Sejda compress; iLoveIMG resize (see evidence) | Collect actual top 10 organic results on same date/market/device for each shortlisted cluster |
| Docvelio production page control verification | Not complete | URL hypotheses from source map; live browser reader could not open four sampled pages | Test every tool with real input/output before shipping claims |

**Evidence links inspected 2026-11-01:**
- PDF24 merger: https://tools.pdf24.org/en/merge-pdf — page-level ordering, page mode, bookmarks, blank-page/cover/contents options.
- Smallpdf merger: https://smallpdf.com/merge-pdf — multi-format selections, rearranging/rotating and download workflow described.
- Sejda compressor: https://www.sejda.com/compress-pdf — quality, PPI, greyscale and font options, clear free use limits.
- iLoveIMG resizer: https://www.iloveimg.com/resize-image — pixels, percentages, aspect lock and do-not-enlarge.
The linked pages are **examples actually inspected**, not a verified Google top-ten ranking list. Do not claim a universal competitor weakness from absence on a single page.

## Search-intent taxonomy
- **Task completion:** the visitor needs a usable result now. A working upload/input→control→preview/result→download flow goes first.
- **Informational:** the visitor needs a trustworthy answer, explanation or safety warning; link to the tool where useful.
- **Navigational:** the visitor wants Docvelio itself; maintain clear branding on homepage, about, contact and tool navigation.
- **Commercial investigation:** visitor compares tools, limits, privacy and functionality. Any comparison must show verified and dated capabilities; avoid invented star ratings or 'best' claims.

## Provisional 10-page implementation queue
**Ranking is editorial utility prioritisation only. Re-sort with real GSC impressions and task completions before declaring data-driven rank.** One primary cluster belongs to one page. Example question headings are editorial proposals, *not* verified PAA strings.

### 1. `/tools/merge-pdf/`
- **Primary cluster:** merge PDF files online / combine PDF files. **Intent:** task completion.
- **Task/result:** select two or more PDF files, set intended order, generate and download one PDF.
- **Controls to inspect:** file reorder, page-by-page reorder, delete, preview, progress, export name; make unavailable controls explicit rather than promise them.
- **Question headings:** How do I combine PDF files in the right order? Can I rearrange individual pages? What happens to my originals?
- **Limitations:** protected/malformed files, browser memory, number/size limits; distinguish file-level vs page-level ordering.
- **Links:** split PDF, compress PDF, rotate PDF and a how-to-merge guide.
- **Competitor benchmark:** PDF24 offers advanced page-level options; Smallpdf describes multiple file types. Do not copy their copy or claim Docvelio supports their extra inputs.

### 2. `/tools/compress-pdf/`
- **Primary cluster:** compress PDF online / reduce PDF file size. **Intent:** task completion.
- **Task/result:** process a PDF and report input MB, output MB and % reduction where available, with download.
- **Controls:** actual compression modes/quality levels only if implemented; show result and quality implications.
- **Question headings:** How much can a PDF shrink? Why is my PDF still large? Will text or images lose quality?
- **Limitations:** compressed or text-only PDFs may barely shrink; exact KB targets cannot be guaranteed.
- **Links:** merge PDF, reduce image size in KB, PDF safety guide.
- **Competitor benchmark:** Sejda explains PPI and image-quality trade-offs.

### 3. `/image-tools/resize-image/`
- **Primary cluster:** resize image online / change image dimensions in pixels. **Intent:** task completion.
- **Task/result:** set width/height; preserve aspect ratio if chosen; export with exact dimensions reported.
- **Controls:** width, height, aspect lock, fit/crop/stretch only if actually present, format.
- **Question headings:** How do I resize to exact pixels? How do I prevent stretching? Is resizing the same as compression?
- **Limitations:** enlarging cannot recreate original detail; aspect lock may prevent both exact dimensions.
- **Links:** crop image, convert image, reduce image size in KB.
- **Competitor benchmark:** iLoveIMG offers pixels/percentage and preserve-aspect settings.

### 4. `/image-tools/reduce-image-size-kb/`
- **Primary cluster:** reduce image size in KB / compress image to 100 KB. **Intent:** task completion.
- **Task/result:** accept target KB, process photo, display *actual* output KB and whether target was achieved.
- **Controls:** target KB, quality/format and dimension adjustment if implemented, before/after display.
- **Question headings:** Can I make an image 100 KB exactly? Why does my photo look blurred? Should I resize before compressing?
- **Limitations:** targets are best effort; transparency and formats affect size.
- **Links:** resize image, crop image, convert image.

### 5. `/tools/edit-pdf/`
- **Primary cluster:** edit PDF online / add text and annotations to PDF. **Intent:** task completion.
- **Task/result:** annotate PDF using real available actions and export annotated version.
- **Controls:** text overlays, drawing, highlights, page navigation and undo *only if verified on site*.
- **Question headings:** Can I replace original PDF text? Can I add a signature or highlight? Does a white rectangle securely redact information?
- **Limitations:** annotations ≠ rewriting underlying original PDF text; an overlay does not securely redact confidential information.
- **Links:** sign PDF, fill PDF, safe editing/redaction guide.

### 6. `/tools/split-pdf/`
- **Primary cluster:** split PDF online / extract PDF pages. **Intent:** task completion.
- **Task/result:** specify selection/ranges and download extracted document(s).
- **Controls:** selected ranges, preview, page counts and file naming if supported.
- **Question headings:** How do I extract pages 3–6? Can I split into multiple files? Is the original changed?
- **Limitations:** encrypted/damaged PDFs and high page counts.
- **Links:** merge PDF, remove pages, rotate PDF.

### 7. `/cbm-calculator/`
- **Primary cluster:** CBM calculator / calculate cubic metres for shipping. **Intent:** task completion.
- **Task/result:** calculate cubic metres from length × width × height × quantity; clarify unit conversions.
- **Controls:** dimension units, quantity, multiple carton rows and rounding if implemented.
- **Question headings:** How do I calculate CBM for multiple cartons? What is the formula? Is container capacity equal to usable loading space?
- **Limitations:** CBM is volume, not weight; packing losses and carrier rules vary.
- **Links:** volumetric weight calculator, container capacity calculator.

### 8. `/tools/word-editor/`
- **Primary cluster:** edit Word document online / browser DOCX editor. **Intent:** task completion.
- **Task/result:** import DOCX, make supported edits, export and inspect downloaded file.
- **Controls:** text editing/format options and actual download format.
- **Question headings:** Can I edit DOCX without Word? What formatting might change? How do I save my edits?
- **Limitations:** complex layout, tables, headers, embedded assets and fonts can change on round-trip.
- **Links:** edit PDF, about, privacy.

### 9. `/shipping-tools/volumetric-weight-calculator/`
- **Primary cluster:** volumetric weight calculator / dimensional weight calculator. **Intent:** task completion.
- **Task/result:** compute volumetric weight from dimensions and a selected divisor, then compare with actual weight when available.
- **Controls:** units, explicit divisor (e.g. 5000 or 6000 if user-selected), shipment count.
- **Question headings:** What is dimensional weight? Why do divisors differ? Which weight will my carrier charge?
- **Limitations:** carrier-specific rates/divisors and rounding; do not promise a billing figure.
- **Links:** CBM calculator, container capacity calculator.

### 10. `/guides/edit-pdf-safely/`
- **Primary cluster:** PDF redaction vs covering text / how to edit PDF safely. **Intent:** informational.
- **Task/result:** answer 'Is covering text with a white rectangle secure?' — **No.** Explain why and recommend genuine redaction tools for sensitive content.
- **Question headings:** Does covering text delete it? How can I check whether sensitive content remains? Does browser processing mean zero network requests?
- **Limitations:** a visual edit does not remove underlying content or metadata; precise privacy claims must match architecture.
- **Links:** edit PDF, privacy guide, contact.

## Page acceptance criteria
1. One coherent H1 and one primary query cluster, unique title/meta, canonical matches route; keep task control visible without long SEO padding.
2. Required user inputs, exact supported controls, success/error states, output preview/receipt and working download tested with realistic files.
3. Relevant questions answered in original, concise language; factual limits and security warnings adjacent to controls where needed.
4. Two to four contextually useful internal links; no gratuitous new near-duplicate landing pages.
5. Mobile touch interaction, keyboard navigation, labels and responsive output check.
6. Before publishing: compare *actual output* against claims; audit noindex, canonical, sitemap, HTTP status and structured data consistency.
7. After publishing: annotate change date; monitor GSC impressions/clicks/query→page and task completion events. Never invent metrics.

## Measurement decision rule (when access is obtained)
Export GSC at **country US** and **search type Web**, with separate query/page rows and last 3 months plus 28 days. Keep indexed status independent from performance. Map query→existing canonical URL, cluster synonyms, and prioritise: (a) high-impression/low-click relevant existing pages, (b) high-utility broken/unclear tool paths, (c) informational questions demonstrably arising from support, (d) new pages only for distinct working tasks. Validate exact autocomplete and PAA phrases with dated screenshots/exports, then Keyword Planner by market/language; leave unknown volume/difficulty blank. Record top-ten organic URLs, observed controls and comparison notes per query. Do not convert single search snippets into ranking evidence.

## Outstanding validation before marking Week 2 fully complete
- Authorised Search Console query/page export, country and search dates.
- Keyword Planner report and source of difficulty if any (Planner competition is for ads, not organic SEO difficulty).
- Real autocomplete and PAA captured for the chosen market.
- Anonymised support query inventory.
- Ten actual competitor organic results **per chosen cluster**, with captured search context.
- End-to-end production-tool output controls and live route verification.

**No volumes, positions, SERP top-ten ordering or support phrases have been fabricated.**
