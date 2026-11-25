// How strong is the feeling? "a bit tired" is light, "I can't go on" is heavy.
// Usage: node tests/intensity.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const store = {};
const ctx = { console, performance, localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => (store[k] = String(v)), removeItem: (k) => delete store[k] } };
ctx.window = ctx; vm.createContext(ctx);
for (const f of require("../tools/bundle.js").sources()) vm.runInContext(fs.readFileSync(path.join(root, "js", f), "utf8"), ctx, { filename: f });
const E = ctx.Engine, CH = ctx.CHARACTERS;
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log("✗ " + m); } };
const cases = [
  // light
  ["I'm a bit tired today", "light"], ["a little nervous about the exam", "light"], ["kind of lazy this morning", "light"], ["slightly annoyed at my boss", "light"],
  ["biraz yorgunum", "light"], ["hafif bir kaygım var", "light"], ["azıcık üşeniyorum bugün", "light"], ["sort of bored with my job", "light"],
  // heavy
  ["I can't go on like this", "heavy"], ["I'm completely exhausted and I can't take it anymore", "heavy"], ["everything is falling apart", "heavy"], ["I feel worthless", "heavy"],
  ["I HATE MY LIFE", "heavy"], ["I'm so tired!!!", "heavy"], ["sooooo tired of all of it", "heavy"], ["I always fail, nothing ever works", "heavy"],
  ["dayanamıyorum artık", "heavy"], ["tükendim, bittim", "heavy"], ["her şey paramparça", "heavy"], ["kendimi değersiz hissediyorum", "heavy"], ["çok çok yoruldum!!", "heavy"],
  ["I feel completely hopeless", "heavy"], ["it is unbearable", "heavy"], ["I want to die", "heavy"],
  // normal
  ["I'm tired", "normal"], ["I failed my exam", "normal"], ["how do I start going to the gym", "normal"], ["hello", "normal"], ["yorgunum", "normal"], ["sınavdan kaldım", "normal"], ["I feel alone at school", "normal"], ["I'm afraid of the interview", "normal"],
];
for (const [t, want] of cases) { const got = E.detectIntensity(t); ok(got === want, `"${t}" → ${got}, wanted ${want}`); }

// effect on the answer: a heavy message is reported as heavy (and answered in the steadier voice); a light one is shorter
let heavyOk = 0, heavyN = 0, lightLong = 0, lightN = 0, normalLen = 0, lightLen = 0;
for (const c of CH) for (let i = 0; i < 25; i++) {
  const h2 = E.forgeReply(c, "I'm completely exhausted and I can't take it anymore", null, {});
  heavyN++; if (h2.intensity === "heavy" && h2.text.length > 10) heavyOk++;
  const l = E.forgeReply(c, "I'm a bit tired today", null, {}); lightN++; lightLen += l.text.length; if (l.text.split(/(?<=[.!?])\s+/).length > 4) lightLong++;
  const n = E.forgeReply(c, "I'm tired today", null, {}); normalLen += n.text.length;
}
ok(heavyOk === heavyN, "heavy messages must report intensity heavy");
ok(lightLen < normalLen * 0.95, `light answers should be shorter on average (light ${Math.round(lightLen / lightN)} vs normal ${Math.round(normalLen / lightN)} chars)`);
console.log(`${cases.length} cases; light answers average ${Math.round(lightLen / lightN)} chars, normal ${Math.round(normalLen / lightN)}`);
console.log(fails ? `${fails} failure(s)` : "intensity tests passed");
process.exitCode = fails ? 1 : 0;
