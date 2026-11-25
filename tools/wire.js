// Re-writes the per-character training <script> tags (js/train-<id>.js) in index.html and eval.html.
// They sit right after the last c-*.js character file. Usage: node tools/wire.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const files = fs.readdirSync(path.join(root, "js")).filter((f) => /^train-.*\.js$/.test(f)).sort();
for (const page of ["index.html", "eval.html"]) {
  const p = path.join(root, page);
  let h = fs.readFileSync(p, "utf8");
  const v = (h.match(/train-[a-z]+\.js\?v=(\d+)/) || [])[1] || "1";
  h = h.replace(/\n\s*<script src="js\/train-[^"]+"><\/script>/g, "");
  const tags = files.map((f) => `\n  <script src="js/${f}?v=${v}"></script>`).join("");
  h = h.replace(/(<script src="js\/c-tesla\.js[^"]*"><\/script>)/, `$1${tags}`);
  fs.writeFileSync(p, h);
}
console.log("wired:", files.join(", "));
