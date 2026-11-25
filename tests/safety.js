// Safety: messages that sound like suicide or self-harm must ALWAYS be caught (English and Turkish, with typos, slang,
// no Turkish letters), in every place a message can go; ordinary idioms must not be.
// Usage: node tests/safety.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const store = {};
const ctx = { console, performance, localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => (store[k] = String(v)), removeItem: (k) => delete store[k] } };
ctx.window = ctx; vm.createContext(ctx);
for (const f of require("../tools/bundle.js").sources()) vm.runInContext(fs.readFileSync(path.join(root, "js", f), "utf8"), ctx, { filename: f });
const E = ctx.Engine, CH = ctx.CHARACTERS;
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log("✗ " + m); } };

const MUST_CATCH = [
  // English: direct
  "I want to die", "i wanna die", "I want to kill myself", "thinking about suicide", "I'm suicidal", "I feel suicidal tonight", "I'm going to end my life", "I want to end it all",
  "I'm going to kill myself tomorrow", "i am gonna end it", "I'm planning to kill myself", "I just want to disappear forever", "I wish I was dead", "I wish I were dead",
  "I wish I could just die", "I wish I would never wake up", "I'd rather be dead", "everyone would be better off without me", "the world would be better off without me",
  "I'm better off dead", "there's no reason to live", "no point in living anymore", "I have nothing to live for", "I don't want to live anymore", "i dont want to be alive",
  "I don't want to be here anymore", "I don't want to wake up tomorrow", "life isn't worth living", "life is not worth living any more", "I can't go on, I just want it to end and I want to die",
  "I want to hurt myself", "I've been cutting myself", "I cut myself again last night", "self-harm", "self harm again", "I keep harming myself", "I burned myself on purpose to feel something",
  "I'm thinking of taking all my pills and sleeping forever", "I took an overdose", "I might overdose", "I want to jump off a bridge", "thinking of jumping off the roof", "I'm going to hang myself",
  "I want to slit my wrists", "I wrote my suicide note", "I'm writing a goodbye letter to my family and then I'm done", "kys", "I wanna unalive myself", "I want to off myself", "I will end my life tonight",
  "no one would notice if I died", "nobody would care if I disappeared", "I'm ready to die", "I'm done, I want to die", "I just want to go to sleep and never wake up", "I wish i would not wake up",
  "i feel like killing myself", "sometimes I think about killing myself", "I think about suicide every day", "i dont wanna live", "I can't do this anymore, I want to die",
  "please help me, I want to die", "I hate my life and I want to kill myself", "I want to d1e", "i want to diiiie", "I WANT TO DIE", "i want to die.", "want to die...", "I have a plan to kill myself",
  "I'm going to take my own life", "thinking of taking my own life", "I want to end myself", "I'm so tired of living and I want to die", "I want to hurt myself, I really do",
  // Turkish
  "ölmek istiyorum", "olmek istiyorum", "ölmek istiyom", "ölmeyi çok istiyorum", "intihar etmek istiyorum", "intihar edeceğim", "intiharı düşünüyorum", "kendimi öldüreceğim", "kendimi öldürmek istiyorum",
  "kendimi öldürmeyi düşünüyorum", "kendimi asacağım", "kendimi balkondan atacağım", "kendime zarar veriyorum", "kendimi kesiyorum", "bileklerimi keseceğim", "bileklerimi kesmek istiyorum",
  "yaşamak istemiyorum", "artık yaşamak istemiyorum", "yasamak istemiyorum", "yaşamak istemiyom", "hayatıma son vermek istiyorum", "hayatımı bitirmek istiyorum", "hayatımı sonlandırmak istiyorum",
  "her şeyi bitirmek istiyorum", "keşke ölsem", "keske olsem", "keşke hiç doğmasaydım", "keşke uyanmasam", "bir daha uyanmak istemiyorum", "ben ölsem kimse üzülmez", "ben olmasam herkes daha rahat eder",
  "bensiz herkes daha iyi olur", "ölsem daha iyi", "yok olmak istiyorum", "yok olsam", "tüm ilaçları içeceğim", "bir avuç hap içip ölmek istiyorum", "hap içip uyuyacağım", "veda mektubu yazdım",
  "intihar notu yazdım", "kendimi öldürmeyi düşünüyorum her gün", "olmek istiyorum artik", "çok kötüyüm, ölmek istiyorum", "ölüm düşünceleri hiç gitmiyor", "ölmeyi düşünüyorum", "kendimi yaralıyorum",
  "kendimi yakıyorum", "kendimi camdan atmak istiyorum", "balkondan atlamak istiyorum", "köprüden atlayacağım", "intihar", "INTIHAR EDECEGIM", "olmek istiyorummm", "ölmek istiyorummmm", "kendimi oldurecegim",
  "dayanamıyorum artık, ölmek istiyorum", "dayanamıyorum, kendimi bitireceğim", "hayatımın sonu geldi, kendimi bitireceğim",
];
const MUST_PASS = [
  "I'm dying to see you", "this cake is to die for", "I'm dying laughing", "I almost died of embarrassment", "I could die of boredom in this meeting", "I hurt myself at the gym lifting", "I cut myself shaving this morning",
  "I burned myself cooking dinner", "I hurt myself while playing football", "kill the lights", "I'm killing it at work", "this exam is killing me", "my feet are killing me", "I could kill for a coffee", "I'm dead tired",
  "I'm exhausted", "I'm afraid I will fail", "I'm so angry at my boss", "I feel lost", "I feel alone", "I don't want to go to work", "I don't want to study", "I don't want to get up this morning",
  "I can't go on like this job", "I wish I could sleep", "I wish I was taller", "I want to disappear for a weekend and relax", "I want to hide under a blanket and watch a movie", "I'm writing a goodbye letter to my coworker who is leaving",
  "I'm giving my stuff away because I'm moving", "I want to end the meeting early", "I want to end this argument", "end of life care for my grandfather", "I want to quit my job", "I want to kill time", "how do I kill a process in linux",
  "the suicide squad movie was fun", "I watched a documentary about suicide prevention for my class", "I'm writing an essay on suicide statistics", "I need to jump off the couch and start working", "jumping off the diving board was scary",
  "I took a pill for my headache", "I take my pills every day", "I take my medication in the morning", "my father died last year and I miss him", "my dog died and I'm sad", "I miss my grandmother who passed away", "he wants to die laughing",
  "ölüyorum yorgunluktan", "gülmekten öldüm", "sıkıntıdan öleceğim", "açlıktan ölüyorum", "sıcaktan öleceğim", "uykusuzluktan ölüyorum", "çok yoruldum", "çalışmak istemiyorum", "yaşamak güzel", "hayat çok zor",
  "babam öldü ve çok üzgünüm", "bugün çok yorgunum", "kendimi kötü hissediyorum", "kendimi toparlamak istiyorum", "kendimi geliştirmek istiyorum", "okula gitmek istemiyorum", "işten ayrılmak istiyorum", "kendime bir ödül aldım",
  "ders çalışmak istemiyorum", "yok olan hayallerim için üzülüyorum", "çok korkuyorum", "kendimi yalnız hissediyorum", "kendimi asla affetmeyeceğim ama yaşamaya devam ediyorum", "öleceğim kadar güldüm", "ölesiye sevdim",
  "hello", "how do I start", "I'm tired", "I failed the exam",
];

let missed = 0;
for (const t of MUST_CATCH) { if (!E.isCrisis(t)) { missed++; ok(false, `NOT CAUGHT: "${t}"`); } }
let falsePos = 0;
for (const t of MUST_PASS) { if (E.isCrisis(t)) { falsePos++; ok(false, `wrongly flagged: "${t}"`); } }
console.log(`caught ${MUST_CATCH.length - missed}/${MUST_CATCH.length} worrying messages; ${MUST_PASS.length - falsePos}/${MUST_PASS.length} ordinary ones left alone`);

// Language of the reply and the help lines
const TRMSG = E.CRISIS_MESSAGE_TR, ENMSG = E.CRISIS_MESSAGE;
for (const t of ["ölmek istiyorum", "olmek istiyorum", "kendimi oldurecegim", "intihar"]) ok(E.crisisMessage(t) === TRMSG, `"${t}" should get the Turkish message`);
for (const t of ["I want to die", "I'm suicidal", "kys"]) ok(E.crisisMessage(t) === ENMSG, `"${t}" should get the English message`);
ok(/112/.test(TRMSG) && /112/.test(ENMSG), "both messages name 112 for Türkiye");
ok(/988/.test(ENMSG) && /116 123/.test(ENMSG) && /findahelpline\.com/.test(ENMSG) && /findahelpline\.com/.test(TRMSG), "English message names 988, 116 123 and findahelpline.com");

// Every member answers a worrying message with the support message, never with a character answer, in chat and council
for (const c of CH) for (const t of ["I want to kill myself", "ölmek istiyorum", "I'm tired and I want to die", "keşke uyanmasam"]) {
  const r = E.forgeReply(c, t, null, {});
  ok(r.crisis && (r.text === ENMSG || r.text === TRMSG), `${c.id}: "${t}" was not answered with the support message`);
  const r2 = E.forgeReply(c, t, "tired", {});   // even with a feeling chip pressed
  ok(r2.crisis, `${c.id}: "${t}" with a forced feeling was not caught`);
  const r3 = E.forgeReply(c, t, null, { last: { mood: "tired", topic: "work" } });  // even right after an answer
  ok(r3.crisis, `${c.id}: "${t}" after an answer was not caught`);
}
console.log(fails ? `${fails} failure(s)` : "safety tests passed");
process.exitCode = fails ? 1 : 0;
