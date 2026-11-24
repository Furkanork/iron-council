// Runs labeled messages through the engine, in Node, no browser.
// Usage: node tests/run.js [file.js|misreads.json ...]   (default: every tests/cases-*.js)
// Each case file exports [[message, feeling, topic], ...]  — feeling "general" = none, topic null = none.
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const store = {};
const ctx = { console, performance, localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => (store[k] = String(v)), removeItem: (k) => delete store[k] } };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ["characters.js", "engine.js"]) vm.runInContext(fs.readFileSync(path.join(root, "js", f), "utf8"), ctx, { filename: f });
const E = ctx.Engine;
const files = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(__dirname).filter((f) => /^cases-.*\.js$/.test(f)).map((f) => path.join(__dirname, f));
let all = 0, ok = 0, mOk = 0, tOk = 0; const miss = [];
for (const f of files) {
  // A "Misread me" download (iron-council-misreads-*.json) works as a case file too.
  const cases = f.endsWith(".json") ? JSON.parse(fs.readFileSync(f, "utf8")).misreads.map((x) => [x.q, x.want.mood || "general", x.want.topic || null]) : require(path.resolve(f));
  for (const [text, mood, topic] of cases) {
    const m = E.detectMood(text), t = E.detectTopic(text) || null;
    all++; mOk += m === mood; tOk += t === topic;
    if (m === mood && t === topic) ok++; else miss.push(`${text}\n     expected ${mood} / ${topic || "—"}   got ${m} / ${t || "—"}`);
  }
}
const pct = (a) => Math.round((a / all) * 100) + "%";
if (process.env.VERBOSE !== "0") for (const x of miss) console.log("✗ " + x);
console.log(`\nfully correct ${ok}/${all} (${pct(ok)})   feeling ${pct(mOk)}   topic ${pct(tOk)}`);
process.exitCode = miss.length ? 1 : 0;
