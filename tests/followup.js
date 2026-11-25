// Follow-up messages: short replies that only make sense after the last answer.
// Usage: node tests/followup.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const store = {};
const ctx = { console, performance, localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => (store[k] = String(v)), removeItem: (k) => delete store[k] } };
ctx.window = ctx; vm.createContext(ctx);
for (const f of require("../tools/bundle.js").sources()) vm.runInContext(fs.readFileSync(path.join(root, "js", f), "utf8"), ctx, { filename: f });
const E = ctx.Engine, CH = ctx.CHARACTERS;
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log("✗ " + m); } };

const cases = [
  ["why?", "why"], ["Why", "why"], ["but why?", "why"], ["neden?", "why"], ["niye", "why"], ["açıkla", "why"],
  ["how?", "how"], ["how do I do that?", "how"], ["where do I start", "how"], ["nasıl?", "how"], ["peki nasıl", "how"], ["nereden başlayayım?", "how"],
  ["I tried that", "tried"], ["I already tried", "tried"], ["denedim", "tried"], ["zaten denedim", "tried"],
  ["it didn't work", "notwork"], ["that doesn't work", "notwork"], ["still the same", "notwork"], ["işe yaramadı", "notwork"], ["olmadı", "notwork"],
  ["yes", "yes"], ["ok", "yes"], ["I'll try", "yes"], ["evet", "yes"], ["tamam", "yes"], ["deneyeceğim", "yes"],
  ["no", "no"], ["not really", "no"], ["I can't", "no"], ["hayır", "no"], ["yapamam", "no"],
  ["tell me more", "more"], ["go on", "more"], ["devam et", "more"],
  // must NOT be read as follow-ups
  ["why do I always fail my exams and feel so tired", null], ["how to stop being lazy and start the gym", null], ["I tried that and I failed the exam again and I feel terrible", null],
  ["no one loves me", null], ["yes I am tired of this life and I feel alone", null], ["hello", null], ["I am afraid", null], ["neden hep ben yoruluyorum bu işte", null],
];
for (const [t, want] of cases) { const got = E.detectFollowup(t); ok(got === want, `"${t}" → ${got}, wanted ${want}`); }

// Replies
let n = 0;
for (const c of CH) {
  for (const [msg, last, lang] of [["I am so tired of work", { mood: "tired", topic: "work" }, "en"], ["sınavdan çok korkuyorum", { mood: "afraid", topic: "study" }, "tr"]]) {
    for (const fu of lang === "en" ? ["why?", "how?", "I tried that", "it didn't work", "yes", "no", "tell me more"] : ["neden?", "nasıl?", "denedim", "işe yaramadı", "evet", "hayır", "devam et"]) {
      const first = E.forgeReply(c, msg, null, {});
      const r = E.forgeReply(c, fu, null, { last: { mood: first.mood, topic: first.topic, lang: first.lang } });
      n++;
      ok(r.followup, `${c.id}: "${fu}" was not treated as a follow-up`);
      ok(r.text && r.text.trim().length > 8, `${c.id}: empty follow-up answer to "${fu}"`);
      ok(!/\{\w+\}|undefined/.test(r.text), `${c.id}: leftover token in "${r.text}"`);
      ok(r.lang === lang, `${c.id}: "${fu}" answered in ${r.lang}, wanted ${lang}`);
    }
  }
}
// Without a previous answer, the same words are just messages (no follow-up path)
ok(!E.forgeReply(CH[0], "yes", null, {}).followup, "follow-up without a previous answer");
// A forced feeling (chip) is never a follow-up
ok(!E.forgeReply(CH[0], "why?", "tired", { last: { mood: "tired" } }).followup, "chip with follow-up text");
console.log(`${cases.length} detection cases, ${n} replies checked`);
console.log(fails ? `${fails} failure(s)` : "followup tests passed");
process.exitCode = fails ? 1 : 0;
