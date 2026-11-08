"""Docvelio self-hosted TikTok downloader using upstream yt-dlp (Unlicense).
Public, permitted videos only. No cookies, authentication bypass or watermark guarantees.
"""
import asyncio
import hmac
import os
import re
import tempfile
import time
from collections import defaultdict, deque
from pathlib import Path
from urllib.parse import urlsplit

from fastapi import FastAPI, Header, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from yt_dlp import YoutubeDL
from yt_dlp.utils import DownloadError

app = FastAPI(title="Docvelio TikTok Download Backend", docs_url=None, redoc_url=None, openapi_url=None)
TOKEN = os.getenv("DOWNLOADER_TOKEN", "")
MAX_MB = 80
MAX_DURATION = 300
MAX_RUNTIME = 70
MAX_RATE = 8
requests_by_ip = defaultdict(deque)


class DownloadRequest(BaseModel):
    url: str = Field(min_length=20, max_length=2048)
    authorized: bool


def validate_url(value: str) -> str:
    try:
        parts = urlsplit(value.strip())
    except ValueError:
        raise HTTPException(400, "Invalid URL")
    host = (parts.hostname or "").lower().rstrip(".")
    if (
        parts.scheme != "https"
        or host not in {"tiktok.com", "www.tiktok.com", "m.tiktok.com", "vm.tiktok.com", "vt.tiktok.com"}
        or parts.username or parts.password or parts.port is not None
        or not parts.path or parts.path == "/"
        or parts.fragment or len(value) > 2048
    ):
        raise HTTPException(400, "Only public HTTPS TikTok video URLs are supported")
    return value.strip()


def remove_folder(folder: str) -> None:
    import shutil
    shutil.rmtree(folder, ignore_errors=True)


def extract_video(value: str, folder: str) -> str:
    options = {
        "outtmpl": str(Path(folder) / "video.%(ext)s"),
        "format": "best[ext=mp4]/best",
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "restrictfilenames": True,
        "socket_timeout": 15,
        "retries": 1,
        "fragment_retries": 1,
        "max_filesize": MAX_MB * 1024 * 1024,
        "ignoreerrors": False,
        "nocheckcertificate": False,
        "cachedir": False,
        "extractor_args": {},
    }
    with YoutubeDL(options) as downloader:
        info = downloader.extract_info(value, download=False)
        if not isinstance(info, dict) or info.get("_type") in ("playlist", "multi_video"):
            raise ValueError("Single public video required")
        if info.get("duration") and float(info["duration"]) > MAX_DURATION:
            raise ValueError("Video is too long for this service")
        if info.get("filesize") and int(info["filesize"]) > MAX_MB * 1024 * 1024:
            raise ValueError("Video exceeds the download size limit")
        downloader.process_ie_result(info, download=True)
    files = [p for p in Path(folder).iterdir() if p.is_file() and p.suffix.lower() == ".mp4"]
    if len(files) != 1:
        raise ValueError("An MP4 download was not available for this public video")
    result = files[0]
    if result.stat().st_size <= 0 or result.stat().st_size > MAX_MB * 1024 * 1024:
        raise ValueError("File size outside allowed range")
    return str(result)


@app.get("/health")
def health():
    return {"status": "ok", "source": "yt-dlp"}


@app.post("/download")
async def download(payload: DownloadRequest, background: BackgroundTasks, x_downloader_token: str = Header(default=""), x_client_ip: str = Header(default="")):
    if not TOKEN or not hmac.compare_digest(x_downloader_token, TOKEN):
        raise HTTPException(401, "Backend authentication required")
    if payload.authorized is not True:
        raise HTTPException(400, "Confirm you own the video or have permission to download it")
    url = validate_url(payload.url)
    # Worker supplies client IP for rate limits, after authenticating to this backend.
    ip = x_client_ip[:80] or "unknown"
    now = time.monotonic()
    q = requests_by_ip[ip]
    while q and now - q[0] > 3600:
        q.popleft()
    if len(q) >= MAX_RATE:
        raise HTTPException(429, "Hourly download limit reached")
    q.append(now)
    folder = tempfile.mkdtemp(prefix="docvelio-video-")
    try:
        file = await asyncio.wait_for(asyncio.to_thread(extract_video, url, folder), timeout=MAX_RUNTIME)
    except asyncio.TimeoutError:
        remove_folder(folder)
        raise HTTPException(504, "TikTok download timed out")
    except (DownloadError, ValueError) as exc:
        remove_folder(folder)
        raise HTTPException(422, "Video unavailable, restricted, or not downloadable as MP4") from None
    except Exception:
        remove_folder(folder)
        raise HTTPException(502, "Unable to download this video") from None
    background.add_task(remove_folder, folder)
    return FileResponse(file, media_type="video/mp4", filename="docvelio-tiktok.mp4", headers={
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'",
    })
