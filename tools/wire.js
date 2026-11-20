// Adds every js/t3-*, t4-* and t5-*.js training file to index.html and eval.html (after training-pack-9), keeping order.
// Usage: node tools/wire.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const files = fs.readdirSync(path.join(root, "js")).filter((f) => /^t[345]-.*\.js$/.test(f)).sort();
for (const page of ["index.html", "eval.html"]) {
  const p = path.join(root, page);
  let h = fs.readFileSync(p, "utf8");
  h = h.replace(/\n\s*<script src="js\/t[345]-[^"]+"><\/script>/g, "");
  const v = (h.match(/training-pack-9\.js\?v=(\d+)/) || [])[1] || "1";
  const tags = files.map((f) => `\n  <script src="js/${f}?v=${v}"></script>`).join("");
  h = h.replace(/(<script src="js\/training-pack-9\.js[^"]*"><\/script>)/, `$1${tags}`);
  fs.writeFileSync(p, h);
}
console.log("wired:", files.join(", "));
