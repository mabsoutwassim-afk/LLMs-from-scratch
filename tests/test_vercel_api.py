import io
import json
import unittest
from api.index import handler


class DummyServer:
    pass


class MockSocket:
    def __init__(self, request_bytes):
        self.rfile = io.BytesIO(request_bytes)
        self.wfile = io.BytesIO()

    def makefile(self, mode, *args, **kwargs):
        if "r" in mode:
            return self.rfile
        if "w" in mode:
            return self.wfile

    def sendall(self, data):
        self.wfile.write(data)


class TestVercelApi(unittest.TestCase):
    def _run_handler(self, request_bytes):
        mock_sock = MockSocket(request_bytes)
        handler(mock_sock, ("127.0.0.1", 8080), DummyServer())
        return mock_sock.wfile.getvalue().decode("utf-8")

    def test_do_get(self):
        raw_response = self._run_handler(b"GET / HTTP/1.1\r\n\r\n")
        self.assertIn("200 OK", raw_response)
        self.assertIn("Content-Type: application/json; charset=utf-8", raw_response)

        body_part = raw_response.split("\r\n\r\n", 1)[1]
        data = json.loads(body_part)
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["name"], "LLMs from scratch")
        self.assertEqual(data["message"], "Repository deployed successfully.")

    def test_do_head(self):
        raw_response = self._run_handler(b"HEAD / HTTP/1.1\r\n\r\n")
        self.assertIn("200 OK", raw_response)
        self.assertIn("Content-Type: application/json; charset=utf-8", raw_response)


if __name__ == "__main__":
    unittest.main()
