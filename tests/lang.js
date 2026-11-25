// Language detection and Turkish-answer fallback.
// Usage: node tests/lang.js
// 1) Every message in the Turkish case files should be detected as "tr", every one in the English files as "en".
// 2) Turkish messages get lines from a character's Turkish pool ("tr" in its training pack) when it has them,
//    and fall back to English line by line when it does not. English messages never get Turkish lines.
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
function load() {
  const store = {};
  const ctx = { console, performance, localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => (store[k] = String(v)), removeItem: (k) => delete store[k] } };
  ctx.window = ctx; vm.createContext(ctx);
  for (const f of require("../tools/bundle.js").sources()) vm.runInContext(fs.readFileSync(path.join(root, "js", f), "utf8"), ctx, { filename: f });
  return ctx;
}
let fails = 0;
const ok = (c, msg) => { if (!c) { fails++; console.log("✗ " + msg); } };

const ctx = load(), E = ctx.Engine;
const cases = (f) => require(path.join(__dirname, f)).map((x) => x[0]);
const measure = (files, want) => {
  const all = files.flatMap(cases), wrong = all.filter((t) => E.detectLang(t) !== want);
  return { n: all.length, wrong };
};
const TR = measure(["cases-real-tr.js"], "tr");
const EN = measure(["cases-real-en.js"], "en");
console.log(`Turkish messages detected as Turkish: ${TR.n - TR.wrong.length}/${TR.n}`);
console.log(`English messages detected as English: ${EN.n - EN.wrong.length}/${EN.n}`);
if (process.env.VERBOSE) { TR.wrong.forEach((t) => console.log("  tr→en: " + t)); EN.wrong.forEach((t) => console.log("  en→tr: " + t)); }
ok(EN.wrong.length / EN.n <= 0.01, "English wrongly read as Turkish: " + EN.wrong.slice(0, 5).join(" | "));
ok(TR.wrong.length / TR.n <= 0.08, "Turkish missed: " + TR.wrong.slice(0, 5).join(" | "));

// Hand-picked edge cases
const edge = [
  ["çok yoruldum artık", "tr"], ["cok yoruldum artik, hic enerjim yok", "tr"], ["sınavdan korkuyorum", "tr"], ["bugün hiç çalışamadım", "tr"],
  ["i'm so tired of everything", "en"], ["I can't start working", "en"], ["How do I stop procrastinating?", "en"], ["hello", "en"], ["ok", "en"],
  ["I feel alone in Istanbul", "en"], ["my friend ayşe said no", "en"], ["merhaba", "tr"], ["nasılsın", "tr"], ["", "en"],
];
for (const [t, want] of edge) ok(E.detectLang(t) === want, `"${t}" should be ${want}, got ${E.detectLang(t)}`);

// Turkish pools + fallback, using a made-up pack so the test does not depend on the real Turkish content.
const c = ctx.CHARACTERS.find((x) => x.id === "marcus");
const MARK = "TR-TEST-";
c.tr = { counsel: { tired: [MARK + "yorgun bir cümle, yeterince uzun."], general: [MARK + "genel bir cümle, yeterince uzun."] }, topics: {}, about: {}, opinions: {}, intents: {}, askBack: {}, openers: [], principles: [], closers: [MARK + "kapanış cümlesi burada."], again: [], pivots: [], gentle: [], hard: [], heard: [], bondWarm: [], bondCold: [] };
let sawTr = 0, sawEn = 0, enLeak = 0, fallbackEnglish = 0;
for (let i = 0; i < 60; i++) {
  const r = E.forgeReply(c, "çok yoruldum artık", null, {});
  ok(r.lang === "tr", "reply should report lang tr");
  if (r.text.includes(MARK)) sawTr++;
  if (/[a-z]/.test(r.text.replace(new RegExp(MARK + "[^.]*\\.", "g"), "")) ) sawEn++;
  const e = E.forgeReply(c, "I am so tired and I cannot go on like this", null, {});
  if (e.text.includes(MARK)) enLeak++;
  const f = E.forgeReply(c, "bugün hiç çalışamadım, işten nefret ediyorum", null, {});   // topic "work": no Turkish topic pool → English fallback
  if (!f.text.includes(MARK) || f.text.split(/\s+/).length > 6) fallbackEnglish++;
}
ok(sawTr > 30, "Turkish line should appear in most Turkish answers (" + sawTr + "/60)");
ok(enLeak === 0, "English message got a Turkish line " + enLeak + " times");
ok(fallbackEnglish > 0, "a pool without Turkish lines must fall back to English");
const r0 = E.forgeReply(ctx.CHARACTERS.find((x) => x.id === "vlad"), "çok yoruldum artık", null, {});
ok(r0.text.length > 20, "a member with no Turkish lines still answers (English fallback)");
ok(E.crisisMessage("intihar etmek istiyorum").startsWith("Bir an"), "Turkish crisis message for Turkish text");
ok(E.crisisMessage("I want to die").startsWith("Stepping out"), "English crisis message for English text");
console.log(fails ? `\n${fails} failure(s)` : "\nlang tests passed");
process.exitCode = fails ? 1 : 0;
