"""Minimal Vercel entrypoint for the educational Python repository."""

import json
from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    """Return a lightweight health response without loading ML dependencies."""

    def do_GET(self):  # noqa: N802
        body = json.dumps(
            {
                "name": "LLMs from scratch",
                "status": "ok",
                "message": "Repository deployed successfully.",
            }
        ).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_HEAD(self):  # noqa: N802
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
