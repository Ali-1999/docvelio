"""Offline backend smoke tests; never contact TikTok."""
import importlib
import os
import unittest
from fastapi.testclient import TestClient

os.environ["DOWNLOADER_TOKEN"] = "local-test-secret"
backend = importlib.import_module("app")
client = TestClient(backend.app)


class BackendSmokeTest(unittest.TestCase):
    def test_health(self):
        response = client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_requires_authentication(self):
        response = client.post("/download", json={
            "url": "https://www.tiktok.com/@example/video/1234567890123456789",
            "authorized": True
        })
        self.assertEqual(response.status_code, 401)

    def test_requires_content_permission(self):
        response = client.post("/download", headers={"X-Downloader-Token": "local-test-secret"}, json={
            "url": "https://www.tiktok.com/@example/video/1234567890123456789",
            "authorized": False
        })
        self.assertEqual(response.status_code, 400)

    def test_rejects_other_origins_and_http(self):
        for url in (
            "https://example.org/video/12345",
            "http://www.tiktok.com/@example/video/12345",
            "https://www.tiktok.com.evil.org/@example/video/12345",
            "https://127.0.0.1/private",
        ):
            with self.subTest(url=url):
                self.assertRaisesRegex(
                    Exception, "400", backend.validate_url, url
                )


if __name__ == "__main__":
    unittest.main()
