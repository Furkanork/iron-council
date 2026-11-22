// Tiny static server, no dependencies:  node serve.js   →  http://localhost:8080
// node serve.js --open  also opens the browser once the server is ready (start.bat uses this).
const http = require("http"), fs = require("fs"), path = require("path"), { exec } = require("child_process");
const root = __dirname, port = process.env.PORT || 8080, url = `http://localhost:${port}`;
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webmanifest": "application/manifest+json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const open = () => {
  if (!process.argv.includes("--open")) return;
  const cmd = process.platform === "win32" ? `start "" "${url}"` : process.platform === "darwin" ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd);
};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.normalize(path.join(root, p));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    // no-cache: after an update you always get the new files
    res.writeHead(200, { "Content-Type": (types[path.extname(file)] || "application/octet-stream") + "; charset=utf-8", "Cache-Control": "no-cache" });
    res.end(data);
  });
});
server.on("error", (e) => {
  if (e.code === "EADDRINUSE") { console.log(`Already running → ${url}`); open(); setTimeout(() => process.exit(0), 500); }
  else throw e;
});
server.listen(port, () => { console.log(`The Iron Council → ${url}  (keep this window open)`); open(); });
