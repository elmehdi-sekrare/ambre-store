// Local preview of the build:  node scripts/serve.mjs [port=5300] [dir=dist]
// Serves dist/ the way Netlify does: ignores ?query, decodes the path, /x → x/index.html,
// unknown → 404.html, content type from the extension, no POST (405).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = +(process.argv[2] || 5300);
const DIR = path.resolve(process.argv[3] || "dist");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif", ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain", ".mp4": "video/mp4", ".ico": "image/x-icon" };

http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let f = path.join(DIR, p);
  if (!f.startsWith(DIR)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  let status = 200;
  if (!fs.existsSync(f)) { f = path.join(DIR, "404.html"); status = 404; }
  const buf = fs.readFileSync(f);
  res.writeHead(status, { "content-type": TYPES[path.extname(f).toLowerCase()] || "application/octet-stream", "content-length": buf.length });
  res.end(req.method === "HEAD" ? undefined : buf);
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
