# Docvelio TikTok downloader backend

This is a **separate, optional Python service** using upstream [yt-dlp](https://github.com/yt-dlp/yt-dlp) source (Unlicense). The Dockerfile **clones** a pinned upstream release during the image build. Docvelio's Cloudflare Worker is only a gateway: **yt-dlp cannot run inside the Cloudflare Worker runtime**.

## Deploy

Host the backend in a Linux Docker environment capable of outbound HTTPS and persistent application runtime:

```bash
cd tiktok-backend
docker build -t docvelio-tiktok .
# Create a private secrets.env file containing DOWNLOADER_TOKEN=<random_secret>.
# Never commit this file to Git.
chmod 600 secrets.env
docker run -d --restart unless-stopped --name docvelio-tiktok -p 127.0.0.1:8080:8080 --env-file ./secrets.env --memory 512m --cpus 1 docvelio-tiktok
```

Expose port 8080 **only via an HTTPS reverse proxy** on a controlled backend hostname. Block direct unauthenticated origin traffic and set restrictive bandwidth/CPU resource limits. The service requires the secret `X-Downloader-Token` header.

In **Cloudflare Worker secrets**, configure both:

- `TIKTOK_BACKEND_URL`: HTTPS URL such as `https://videos-backend.example.net/download` (replace with your actual backend; don't add arbitrary ports or user info).
- `TIKTOK_BACKEND_TOKEN`: same strong secret as `DOWNLOADER_TOKEN`.

The browser calls Docvelio's same-origin `POST /api/tiktok/download`; the Worker forwards a validated request to the backend and streams the MP4 result. Until both secrets and the backend are deployed, the page reports that link downloads are unavailable. **A GitHub merge does not deploy the Python backend.**

Check `GET /api/tiktok/status` for backend configuration state (not an end-to-end extract test). Do not place the backend token in HTML, JavaScript or public GitHub files.

## Local verification

After starting the container, verify `curl -fsS http://127.0.0.1:8080/health` returns JSON with `status` equal to `ok`. This only verifies process health, not TikTok extraction.

## Constraints

- Public HTTPS TikTok video links only; downloadable and permitted content.
- No private account downloads, session cookies, proxies, DRM bypass or watermark-removal promise.
- No playlist or bulk downloading; up to 80 MB and 300 seconds per file, rate-limited to 8 requests/IP/hour in memory.
- TikTok may throttle or block server IPs; yt-dlp explicitly says supported sites can stop working.
- No permanent storage; uploaded files are not handled by this service.
- Running a downloader for public visitors can incur hosting/bandwidth costs, even with free software.

**Important:** Set restrictive reverse-proxy body limits, per-IP limits, and concurrency limits for production. Audit TikTok platform terms and copyright permissions before making the endpoint public.
