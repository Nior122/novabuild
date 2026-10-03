#!/usr/bin/env python3
"""Tiny local preview server for the KIRVON store (no caching, so edits show on refresh).

Usage:  python3 dev-server.py [port]
Then open http://localhost:8000
"""
import http.server
import os
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
os.chdir(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.woff2': 'font/woff2', '.svg': 'image/svg+xml'}

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        """Serve the branded 404.html (like Netlify / Cloudflare Pages do) for missing pages."""
        if code == 404 and not self.path.startswith('/assets/') and os.path.exists('404.html'):
            body = open('404.html', 'rb').read()
            self.log_request(404)
            self.send_response(404, 'Not Found')
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def log_message(self, fmt, *args):  # quieter logs
        sys.stderr.write('%s %s\n' % (self.command, self.path)) if '404' in (fmt % args) else None


socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(('0.0.0.0', PORT), Handler) as httpd:
    print(f'KIRVON store running at http://localhost:{PORT}', flush=True)
    httpd.serve_forever()
