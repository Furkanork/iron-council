// Content checker: every member must be fully written.
// Usage: node tests/content.js [--strict]   (exit code 1 if anything is missing or broken;
//        duplicate lines are listed as warnings and only fail with --strict)
// Checks, per member: all 8 feelings (counsel), all 18 topics, all 17 personal subjects (about),
// an opinion of every other member, stories, the other line pools, and no duplicate lines,
// empty lines or leftover placeholders. Prints a coverage table.
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const store = {};
const ctx = { console, performance, localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => (store[k] = String(v)), removeItem: (k) => delete store[k] } };
ctx.window = ctx; vm.createContext(ctx);
// Load the source files (not the bundle) in the same order tools/bundle.js uses.
for (const f of require("../tools/bundle.js").sources()) vm.runInContext(fs.readFileSync(path.join(root, "js", f), "utf8"), ctx, { filename: f });
const E = ctx.Engine, CH = ctx.CHARACTERS, TP = ctx.TRAINING_PACK;

const problems = [];
const bad = (id, what) => problems.push(id + ": " + what);
const MOODS = E.MOODS, TOPICS = E.TOPICS;
const ABOUT = E.ABOUT_KEYS.filter((k) => k !== "general");
const POOLS = ["openers", "principles", "closers", "again", "pivots", "recall", "goalAsk", "oathTake", "oathKept", "oathBroken", "agree", "disagree", "stories", "gentle", "hard", "bondWarm", "bondCold", "bondUp", "heard", "pro", "con", "journal"];
const warns = [];   // duplicate lines: reported, but only fail the run with --strict
const TOKEN = /\{[a-zA-Z_]*\}|\bundefined\b|\bNaN\b|\[object |\bnull\b|\$\{/;

const rows = [];
for (const c of CH) {
  const t = TP[c.id];
  if (!t) { bad(c.id, "no training pack"); continue; }
  const row = { id: c.id, feel: 0, topic: 0, about: 0, opin: 0, stories: (t.stories || []).length, lines: 0, combos: Object.keys(t.combos || {}).length };

  const check = (where, arr, min) => {
    if (!Array.isArray(arr) || arr.length < min) { bad(c.id, `${where} has ${Array.isArray(arr) ? arr.length : 0} line(s), needs ${min}`); return false; }
    const seen = new Set();
    for (const l of arr) {
      if (typeof l !== "string" || !l.trim()) { bad(c.id, `${where} has an empty line`); continue; }
      const rest = l.replace(/\{(name|goal|oath|topic|focus)\}/g, "");
      if (TOKEN.test(rest)) bad(c.id, `${where} has a leftover token: "${l.slice(0, 60)}"`);
      const k = l.trim().toLowerCase();
      if (seen.has(k)) warns.push(`${c.id}: ${where} has a duplicate line: "${l.slice(0, 60)}"`);
      seen.add(k);
      row.lines++;
    }
    return true;
  };

  for (const m of MOODS) if (check(`feeling "${m}"`, (t.counsel || {})[m], 1)) row.feel++;
  for (const x of TOPICS) if (check(`topic "${x}"`, (t.topics || {})[x], 1)) row.topic++;
  for (const a of ABOUT) if (check(`about "${a}"`, (t.about || {})[a], 1)) row.about++;
  for (const o of CH) if (o.id !== c.id) { if (check(`opinion of ${o.id}`, (t.opinions || {})[o.id], 1)) row.opin++; }
  for (const p of POOLS) check(`pool "${p}"`, t[p], 1);
  for (const k of ["greet", "thanks", "who"]) check(`intent "${k}"`, (t.intents || {})[k], 1);
  check("stories", t.stories, 3);
  for (const st of t.stories || []) if (typeof st === "string" && (st.length < 120 || st.length > 900)) bad(c.id, `story length ${st.length} looks wrong: "${st.slice(0, 40)}"`);
  if (row.combos < 20) bad(c.id, `only ${row.combos} of the 20 feeling+topic combination lines`);
  for (const k of Object.keys(t.combos || {})) { const [m, x] = k.split("+"); if (!MOODS.includes(m) || !TOPICS.includes(x)) bad(c.id, `combo "${k}" is not feeling+topic`); check(`combo "${k}"`, t.combos[k], 1); }
  // Turkish lines (optional, written member by member): checked for empties and leftover tokens, and counted.
  row.tr = 0;
  const walk = (where, v) => { if (Array.isArray(v)) { for (const l of v) { if (typeof l !== "string" || !l.trim()) bad(c.id, `Turkish ${where} has an empty line`); else if (TOKEN.test(l.replace(/\{(name|goal|oath|topic|focus)\}/g, ""))) bad(c.id, `Turkish ${where} has a leftover token: "${l.slice(0, 50)}"`); else if (/(?<![\p{L}])(the|and|you|your|is|are|with|that|this|not)(?![\p{L}])/iu.test(l)) bad(c.id, `Turkish ${where} line does not look Turkish: "${l.slice(0, 50)}"`); row.tr++; } } else if (v && typeof v === "object") for (const k of Object.keys(v)) walk(where + "." + k, v[k]); };
  if (c.tr) {
    walk("tr", c.tr);
    for (const a of E.ABOUT_KEYS.concat("general")) if (!((c.tr.about || {})[a] || []).length) bad(c.id, `Turkish about "${a}" missing`);
    for (const o of CH) if (o.id !== c.id && !((c.tr.opinions || {})[o.id] || []).length) bad(c.id, `Turkish opinion of ${o.id} missing`);
  }
  rows.push(row);
}

const pad = (s, n) => String(s).padEnd(n), num = (s, n) => String(s).padStart(n);
console.log(pad("member", 12) + num(`feelings/${MOODS.length}`, 12) + num(`topics/${TOPICS.length}`, 11) + num(`about/${ABOUT.length}`, 10) + num(`opinions/${CH.length - 1}`, 13) + num("stories", 9) + num("lines", 8) + num("turkish", 9) + num("combos/20", 10));
for (const r of rows) console.log(pad(r.id, 12) + num(r.feel, 12) + num(r.topic, 11) + num(r.about, 10) + num(r.opin, 13) + num(r.stories, 9) + num(r.lines, 8) + num(r.tr, 9) + num(r.combos, 10));

const dupTail = warns.length ? `\n${warns.length} duplicate line(s) (warnings${process.argv.includes("--strict") ? ", --strict" : ""}):\n` + warns.slice(0, 15).map((w) => "! " + w).join("\n") + (warns.length > 15 ? `\n… and ${warns.length - 15} more (run with --all to list)` : "") : "";
if (process.argv.includes("--all")) console.log(warns.map((w) => "! " + w).join("\n"));
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems.slice(0, 200)) console.log("✗ " + p);
  process.exitCode = 1;
} else console.log("\nAll members complete: no gaps, empty lines or placeholders.");
if (dupTail) console.log(dupTail);
if (warns.length && process.argv.includes("--strict")) process.exitCode = 1;
