FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*
# Clone the upstream open-source repository; install its Python source distribution.
# For release reproducibility pin the public 2026.10.26 tag; update after testing new releases.
RUN git clone --depth 1 --branch 2026.10.26 https://github.com/yt-dlp/yt-dlp.git /opt/yt-dlp && pip install --no-cache-dir /opt/yt-dlp
RUN pip install --no-cache-dir fastapi==0.115.12 uvicorn==0.34.2
RUN useradd -r -u 10001 appuser && mkdir -p /home/appuser && chown appuser:appuser /home/appuser
WORKDIR /app
COPY app.py /app/app.py
USER appuser
ENV HOME=/home/appuser PYTHONDONTWRITEBYTECODE=1
EXPOSE 8080
CMD ["sh", "-c", "exec uvicorn app:app --host 0.0.0.0 --port ${PORT:-8080} --workers 1"]
