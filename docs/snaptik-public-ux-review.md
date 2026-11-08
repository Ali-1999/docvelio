# SnapTik public-surface review for Docvelio (2026-11-08)

Research target: https://snaptik.com.pl/ (public website only).
Scope: visible pages and declared workflows, **not** internal server APIs, JavaScript bundles, bypass tactics or private source code. This document does not attest that every advertised SnapTik download method works.

## Observed public experience

- Home video page: TikTok link field, Paste and Download actions; a results area with video title, author, and alternative download buttons; a "Download other video" reset workflow.
- Separate paths: `/mp3`, `/slideshow`, `/story`; each has distinct text, format explanations and FAQ content.
- Navigation includes a multilingual selector. The pages describe mobile/desktop save flows, invalid links, private-post limitations and content-owner permissions.
- Public disclaimer says it does not permanently store user-requested media and disclaims association with TikTok. Treat these as site statements, not independently validated architecture.

Sources:
- https://snaptik.com.pl/
- https://snaptik.com.pl/mp3
- https://snaptik.com.pl/slideshow
- https://snaptik.com.pl/story
- https://snaptik.com.pl/disclaimer

## Docvelio features implemented from the public **pattern**, not copied code

- Existing shared Docvelio header/footer, with its own layout and branding.
- Accessible Paste control, extraction of the first HTTPS TikTok link from a share message, URL validation, error and progress states.
- Existing Cloudflare Free Worker best-effort public MP4 retrieval with explicit permission acknowledgement; local original-video saver remains available.
- Dedicated, original format explanations that identify MP3, slideshow and Stories as **not yet supported**.
- Existing canonical, sitemap, consent, ad verification and other SEO controls retained.

## Not verified, not copied and not promised

- SnapTik's private API or extraction algorithm.
- Any source file access beyond the public pages.
- The ability to retrieve an arbitrary TikTok post from Cloudflare Free.
- Guaranteed watermark-free outputs, private posts or bypassing creator download restrictions.
- Actual MP3 conversion, individual slideshow image ZIP or Story downloads on Docvelio.

## Next technical validation before marketing capability upgrades

1. Inspect an authorised public TikTok link in a real Cloudflare deployment (not merely a mocked response).
2. Confirm the source video is retrievable and accurately identify whether a watermark is embedded.
3. Track which public post types work; distinguish MP4, photo posts and Stories.
4. Build and test real media handling before exposing dedicated indexed format-specific tools.
5. Assess actual browser download behaviour on Safari, Chrome Android and desktop browsers.
