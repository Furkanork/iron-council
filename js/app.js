(function () {
  const C = window.CHARACTERS;
  const E = window.Engine;
  const app = document.getElementById("app");
  const byId = (id) => C.find((c) => c.id === id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

  const state = { chats: {} }; // id -> [{role, content, q?, mood?}]

  // Paint at most once per frame.
  function perFrame(fn) {
    let pending = null, queued = false;
    return (v) => {
      pending = v;
      if (queued) return; queued = true;
      requestAnimationFrame(() => { queued = false; fn(pending); });
    };
  }

  // Anything you write that sounds like serious distress is never used as an oath, goal, focus or name:
  // it is answered with the real-support message instead (in Turkish if it was written in Turkish).
  function crisisGuard(...texts) {
    const t = texts.filter(Boolean).find((x) => E.isCrisis(x));
    if (!t) return false;
    const old = document.getElementById("crisisPanel"); if (old) old.remove();
    const d = document.createElement("div");
    d.id = "crisisPanel"; d.className = "panel crisis-panel"; d.setAttribute("role", "alert");
    d.innerHTML = `<p>${esc(E.crisisMessage(t))}</p><div class="row"><button class="btn small" id="crisisOk">OK</button></div>`;
    app.prepend(d); window.scrollTo(0, 0);
    document.getElementById("crisisOk").onclick = () => d.remove();
    return true;
  }
  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2600);
  }

  // ---------- small storage helpers ----------
  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { toast("Browser storage is full."); } };
  const pad = (n) => String(n).padStart(2, "0");
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const prettyDay = (k) => new Date(k + "T12:00:00").toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  const chance = (p) => Math.random() < p;

  // ---------- memory: who you are ----------
  const PKEY = "ironcouncil.profile";
  const profile = () => Object.assign({ name: "", goal: "" }, load(PKEY, {}));
  const saveProfile = (p) => store(PKEY, p);
  // "call me" only counts at the start of a sentence ("they call me lazy", "call me later" are not names);
  // Turkish "adım" also means "step", so "adım X" only counts at the very start or after "benim".
  const NAME_RE = [/(?:^|[^\p{L}])(?:my name is|my name's|i am called|i'm called)\s+([\p{L}][\p{L}'-]{1,20})/iu,
    /(?:^|[.!?,]\s*|(?:^|\s)(?:just|please|you can|you may)\s+)call me\s+([\p{L}][\p{L}'-]{1,20})/iu,
    /(?:^\s*(?:merhaba|selam)?[,\s]*|benim\s+)(?:adım|ismim)\s+([\p{L}]{2,20})/iu];
  const GOAL_RE = [/(?:^|[^\p{L}])(?:my goal is(?: to)?|my dream is(?: to)?|my aim is(?: to)?|my goal:)\s+([^.!?\n]{3,90})/iu, /(?:^|[^\p{L}])(?:hedefim|amacım|hayalim)\s*:?\s+([^.!?\n]{3,90})/iu];
  const NOT_NAMES = new Set(["adım", "not", "the", "a", "an", "bir", "very", "so", "çok", "later", "back", "when", "whenever", "tomorrow", "tonight", "now", "soon", "if", "at", "anytime", "maybe", "crazy", "lazy", "weak", "stupid", "dumb", "names", "anything", "whatever", "what", "that", "this", "it"]);
  // Learn a name or goal from what you write. Returns what was learned.
  function learn(text) {
    const p = profile(), got = {};
    if (E.isCrisis(text)) return got;   // never store anything from a message like that
    for (const re of NAME_RE) { const m = text.match(re); if (m && !NOT_NAMES.has(m[1].toLowerCase())) { got.name = m[1][0].toUpperCase() + m[1].slice(1); break; } }
    for (const re of GOAL_RE) { const m = text.match(re); if (m && !/^(not|unclear|nothing|none|bilmiyorum|yok)\b/i.test(m[1].trim())) { got.goal = m[1].trim(); break; } }
    if (got.name || got.goal) saveProfile(Object.assign(p, got));
    return got;
  }

  // ---------- bond: how each of them feels about you ----------
  // Grows when you come back, keep oaths sworn to him, and thank him; shrinks when you break those oaths
  // or bring him the same complaint again and again without acting.
  const BKEY = (id) => "ironcouncil.bond." + id;
  const bond = (id) => Object.assign({ score: 0, day: "", shown: "stranger" }, load(BKEY(id), {}));
  const BOND_LEVELS = [["cold", -Infinity], ["stranger", -5], ["respect", 5], ["trusted", 15]];
  const bondLevel = (score) => BOND_LEVELS.filter(([, min]) => score >= min).pop()[0];
  const BOND_LABEL = { cold: "Cold", stranger: "Stranger", respect: "Respect", trusted: "Trusted" };
  function bump(id, n) { const b = bond(id); b.score = Math.max(-20, Math.min(40, b.score + n)); store(BKEY(id), b); return b; }
  function bondHTML(c) {
    const b = bond(c.id), lv = bondLevel(b.score);
    const dots = Math.max(0, Math.min(5, Math.round((b.score + 5) / 5)));
    return `<div class="bond bond-${lv}" title="${g(c, "How he sees you. It grows when you return, keep oaths sworn to him and thank him; it drops when you break those oaths or repeat the same complaint without acting.")}"><span>Bond</span> <b>${BOND_LABEL[lv]}</b> <i>${"●".repeat(dots)}${"○".repeat(5 - dots)}</i></div>`;
  }

  // ---------- the daily oath ----------
  const OKEY = "ironcouncil.oaths";
  const oaths = () => load(OKEY, []);
  const saveOaths = (o) => store(OKEY, o.slice(-400));
  const todaysOath = () => oaths().find((o) => o.date === dayKey());
  const unjudged = () => oaths().filter((o) => o.date < dayKey() && o.status === "pending");
  function streak() {
    const kept = new Set(oaths().filter((o) => o.status === "kept").map((o) => o.date));
    const d = new Date(); if (!kept.has(dayKey(d))) d.setDate(d.getDate() - 1);
    let n = 0; while (kept.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  // ---------- saved conversations ----------
  const SKEY = "ironcouncil.saved";
  const savedList = () => load(SKEY, []);
  function saveConversation(kind, ids, messages) {
    if (!messages.length) return toast("Nothing to save yet.");
    const firstUser = (messages.find((m) => m.who === "You") || messages[0]).text;
    const list = savedList();
    list.unshift({ sid: Date.now().toString(36), kind, ids, title: firstUser.length > 70 ? firstUser.slice(0, 67) + "…" : firstUser, date: new Date().toISOString(), messages });
    store(SKEY, list.slice(0, 200));
    toast("Conversation saved. Find it under Saved.");
  }
  function asText(s) {
    const names = s.ids.map((id) => (byId(id) || {}).name).filter(Boolean).join(", ");
    return `The Iron Council — ${s.kind === "council" ? "Council" : "Conversation"} with ${names}\n${new Date(s.date).toLocaleString()}\n\n` +
      s.messages.map((m) => `${m.who}:\n${m.text}\n`).join("\n");
  }
  function download(name, text) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  const fileName = (s) => `iron-council-${s.ids.join("-")}-${s.date.slice(0, 10)}.txt`;

  // ---------- backup & sync ----------
  // Every key the site stores starts with "ironcouncil." (the "recent lines" memory is left out: it is only for variety).
  const allKeys = () => Object.keys(localStorage).filter((k) => k.startsWith("ironcouncil.") && !k.startsWith("ironcouncil.recent."));
  function backupData() {
    const keys = {}; for (const k of allKeys()) keys[k] = localStorage.getItem(k);
    return { app: "iron-council", version: 1, made: new Date().toISOString(), keys };
  }
  function backupSummary() {
    const o = oaths().length, s = savedList().length, chats = allKeys().filter((k) => k.startsWith("ironcouncil.chat.")).length;
    return `This browser holds ${o} oath${o === 1 ? "" : "s"}, ${s} saved conversation${s === 1 ? "" : "s"} and ${chats} chat${chats === 1 ? "" : "s"}.`;
  }
  // Merge a backup into this browser without losing anything here.
  function restoreBackup(data) {
    let n = 0;
    const parse = (v, d) => { try { return JSON.parse(v); } catch (e) { return d; } };
    for (const [k, v] of Object.entries(data.keys)) {
      if (!k.startsWith("ironcouncil.") || typeof v !== "string") continue;
      const here = localStorage.getItem(k);
      let out = v;
      if (here != null && here !== v) {
        const a = parse(here, null), b = parse(v, null);
        if (k === OKEY && Array.isArray(a) && Array.isArray(b)) {
          // one oath per day: a judged oath beats a pending one
          const byDay = {}; for (const o of a.concat(b)) { const cur = byDay[o.date]; if (!cur || (cur.status === "pending" && o.status !== "pending")) byDay[o.date] = o; }
          out = JSON.stringify(Object.values(byDay).sort((x, y) => (x.date < y.date ? -1 : 1)));
        } else if (k === SKEY && Array.isArray(a) && Array.isArray(b)) {
          const seen = new Set(a.map((s) => s.sid));
          out = JSON.stringify(a.concat(b.filter((s) => !seen.has(s.sid))).sort((x, y) => (x.date < y.date ? 1 : -1)));
        } else if (k.startsWith("ironcouncil.chat.") && Array.isArray(a) && Array.isArray(b)) {
          out = b.length > a.length ? v : here; // keep the longer conversation
        } else if (k.startsWith("ironcouncil.bond.") && a && b) {
          out = (b.score || 0) > (a.score || 0) ? v : here;
        } else if (k === PKEY && a && b) {
          out = JSON.stringify({ name: a.name || b.name || "", goal: a.goal || b.goal || "" });
        } else if (k === CKEY_CAMP && a && b) {
          out = (b.done || []).length > (a.done || []).length ? v : here; // the further-along campaign
        } else if (k.startsWith("ironcouncil.forge.") && a && b) {
          const u = (x, y) => x.concat(y.filter((i) => !x.some((j) => JSON.stringify(j) === JSON.stringify(i))));
          const lines = Object.assign({}, a.lines || {}); for (const [m, arr] of Object.entries(b.lines || {})) lines[m] = u(lines[m] || [], arr);
          out = JSON.stringify({ beliefs: u(a.beliefs || [], b.beliefs || []), examples: u(a.examples || [], b.examples || []), lines });
        } else out = here; // anything else (tone, last seen…): this device wins
      }
      if (out !== here) { localStorage.setItem(k, out); n++; }
    }
    return n;
  }

  // ---------- answering (shared by chat + council) ----------
  // Composed instantly in under a millisecond; revealed quickly so it reads as spoken.
  async function answer(char, question, mood, ctx, onUpdate) {
    const r = E.forgeReply(char, question, mood, ctx);
    if (!r.crisis && ctx && ctx.prefix) r.text = ctx.prefix + " " + r.text;
    if (r.crisis) { onUpdate(r.text, true, r); return; }
    // Hidden tab (or reduced motion): no animation, just the answer.
    if (document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) { onUpdate(r.text, true, r); return; }
    const words = r.text.split(" "); let i = 0;
    await new Promise((res) => setTimeout(res, 120));
    await new Promise((res) => {
      const tick = () => {
        i = Math.min(words.length, i + 3);
        onUpdate(words.slice(0, i).join(" "), i >= words.length, r);
        if (i >= words.length) res();
        else if (document.hidden) { i = words.length - 1; tick(); } // tab hidden mid-answer: finish now
        else setTimeout(tick, 16);
      };
      tick();
    });
  }

  // ---------- views ----------
  function oathOfDay() {
    const d = new Date(); const seed = d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate();
    const pool = []; C.forEach((c) => c.principles.forEach((p) => pool.push({ c, p })));
    return pool[(seed * 7919) % pool.length];
  }

  function oathBanner() {
    const p = profile(), hello = p.name ? esc(p.name) + ", " : "";
    const due = unjudged()[0];
    if (due) { const c = byId(due.id) || C[0]; return `<a class="banner" href="#/oath" style="--c:${c.color}"><b>${esc(c.name)} is waiting.</b> ${hello ? hello + "did" : "Did"} you keep the oath you swore on ${esc(prettyDay(due.date))}? <span>Answer him →</span></a>`.replace("Answer him", g(c, "Answer him")); }
    const t = todaysOath();
    if (t) { const c = byId(t.id) || C[0]; return `<a class="banner" href="#/oath" style="--c:${c.color}"><b>Today's oath:</b> “${esc(t.text)}” <span>${t.status === "kept" ? "Kept ✓" : "sworn to " + esc(c.name)}</span>${streak() ? ` <span class="streak">🔥 ${streak()}</span>` : ""}</a>`; }
    const a = activeCampaign();
    if (a) { const k = CAMPS.find((x) => x.id === a.id), c = byId(k.leader); return `<a class="banner" href="#/oath" style="--c:${c.color}"><b>${esc(k.title)} · day ${a.done.length + 1} of 14.</b> ${esc(c.name)} has today's task ready. <span>See it →</span></a>`; }
    return `<a class="banner" href="#/oath"><b>${hello}swear today's oath.</b> One task, sworn before one of them. Tomorrow they will ask. <span>Swear →</span></a>`;
  }

  function card(c) {
    return `<a class="card" href="#/c/${c.id}" style="--c:${c.color}">
      <div class="sigil" style="--c:${c.color}">${esc(c.monogram)}</div>
      <div class="era">${esc(c.era)} · ${esc(c.region)}</div>
      <h3>${esc(c.name)}</h3>
      <div class="ttl">${esc(c.title)}</div>
      <div class="idea">${esc(c.idea)}</div>
    </a>`;
  }

  function viewHall() {
    const o = oathOfDay();
    app.innerHTML = `
      <section class="hero">
        <h1>The Iron Council</h1>
        <p>People of every era who held one idea and would not let go of it. Tell them what you are facing.</p>
      </section>
      ${oathBanner()}
      <section class="oath">
        <div class="label">Words of the day</div>
        <blockquote>“${esc(o.p)}”</blockquote>
        <cite><a href="#/c/${o.c.id}">— ${esc(o.c.name)}</a></cite>
      </section>
      <section class="grid">${C.map(card).join("")}</section>
      <footer class="foot">Lines are written in the spirit of each figure unless marked <b>sourced</b>. Nothing you type leaves your browser.</footer>`;
  }

  function quotesHTML(c) {
    if (!c.quotes.length) return `<div class="note">No reliably documented quotes are included — everything here is written in the spirit of the figure.</div>`;
    return c.quotes.map((q) => `<div class="quote"><span class="badge ${q.status}">${q.status.toUpperCase()}</span><q>${esc(q.text)}</q><small>${esc(q.source)}</small></div>`).join("");
  }

  // UI wording for female members (Joan): he/him/his -> she/her/her. Used only on interface text, never on character content.
  const g = (c, s) => !c || !c.female ? s : s
    .replace(/\bhimself\b/g, "herself").replace(/\bhim\b/g, "her").replace(/\bHim\b/g, "Her")
    .replace(/\bhis\b/g, "her").replace(/\bHis\b/g, "Her").replace(/\bhe'd\b/g, "she'd").replace(/\bHe'll\b/g, "She'll")
    .replace(/\bhe\b/g, "she").replace(/\bHe\b/g, "She");

  const ASKS = ["Tell me a story", "How do you feel?", "What do you fear?", "Do you regret anything?", "Your proudest moment?", "Your hardest moment?", "Who did you love?", "How did you die?", "What do you think of me?"];

  function viewChar(id) {
    const c = byId(id); if (!c) return viewHall();
    const CKEY = "ironcouncil.chat." + id;
    if (!state.chats[id]) { try { state.chats[id] = JSON.parse(localStorage.getItem(CKEY) || "[]").filter((m) => !m.pending); } catch (e) { state.chats[id] = []; } }
    const log = state.chats[id];
    const persist = () => { try { localStorage.setItem(CKEY, JSON.stringify(log.slice(-200))); } catch (e) { /* full: fine */ } };
    // Memory: the first visit of a new day, he brings up what you talked about, or your goal.
    const SEEN = "ironcouncil.seen." + id, lastSeen = localStorage.getItem(SEEN);
    if (lastSeen && lastSeen !== dayKey()) {
      const p = profile();
      const lastTopic = (log.filter((m) => m.role === "char" && m.topic).pop() || {}).topic;
      const due = unjudged().find((o) => o.id === id);
      let line = "";
      if (due) line = `On ${prettyDay(due.date)} you swore before me: “${due.text}”. Did you keep it? Answer me on the Oath page.`;
      else if (lastTopic && (!p.goal || chance(0.5))) line = E.say(c, "recall", { topic: E.TOPIC_LABELS[lastTopic] });
      else if (p.goal) line = E.say(c, "goalAsk", { goal: p.goal });
      if (line && p.name && chance(0.5)) line = p.name + ". " + line;
      if (line) { log.push({ role: "char", content: line, read: "remembers", memory: true }); persist(); }
    }
    localStorage.setItem(SEEN, dayKey());
    // Bond: if how he sees you has changed since you last spoke, he says so.
    {
      const b = bond(id), lv = bondLevel(b.score), order = ["cold", "stranger", "respect", "trusted"];
      if (lv !== b.shown) {
        const up = order.indexOf(lv) > order.indexOf(b.shown);
        const line = up && lv !== "stranger" ? E.say(c, "bondUp") : lv === "cold" ? E.say(c, "bondCold") : "";
        if (line) { log.push({ role: "char", content: line, read: up ? (lv === "trusted" ? g(c, "trusts you now") : g(c, "respects you now")) : g(c, "has grown cold toward you"), memory: true }); persist(); }
        b.shown = lv; store(BKEY(id), b);
      }
    }
    const TKEY = "ironcouncil.tone." + id;
    app.innerHTML = `
      <div class="char-layout">
        <aside class="dossier" style="--c:${c.color}">
          <div class="sigil big" style="--c:${c.color}">${esc(c.monogram)}</div>
          <h2>${esc(c.name)}</h2>
          <div class="ttl">${esc(c.title)}</div>
          <div class="meta">${esc(c.era)} · ${esc(c.region)}</div>
          <div class="idea">${esc(c.idea)}</div>
          ${bondHTML(c)}
          <button class="btn ghost small toggle-more" id="moreBtn">${g(c, "About him")}</button>
          <div class="dossier-more">
          <p>${esc(c.bio)}</p>
          <h4>Words</h4>
          ${quotesHTML(c)}
          <div class="links">
            <a class="btn ghost small" href="#/forge/${c.id}">Train ${esc(c.name.split(" ")[0])}</a>
            <a class="btn ghost small" href="#/council">Council</a>
            <a class="btn ghost small" href="#/oath">Swear an oath</a>
          </div>
          </div>
        </aside>
        <section class="chat" style="--c:${c.color}">
          <div class="chat-bar">
            <button class="btn ghost small" id="saveChat" title="Keep a copy under Saved">Save conversation</button>
            <button class="btn ghost small" id="dlChat" title="Download as a text file">Download</button>
            <span style="flex:1"></span>
            <label class="tone" title="${g(c, "How hard he is on you")}">Tone <select id="tone">
              <option value="gentle">Gentle</option><option value="">Normal</option><option value="hard">Hard</option></select></label>
            <button class="btn ghost small" id="clearChat">Clear chat</button>
          </div>
          <div class="log" id="log"></div>
          <div class="moods" id="moods">${E.MOODS.concat("general").map((m) => `<button class="chip" data-m="${m}">${E.MOOD_LABELS[m]}</button>`).join("")}</div>
          <div class="moods asks" id="asks"><span class="asks-label">${g(c, "Ask him:")}</span>${ASKS.map((x) => `<button class="chip ghost-chip" data-ask="${esc(x)}">${esc(x)}</button>`).join("")}</div>
          <div class="composer">
            <textarea id="q" placeholder="Tell ${esc(c.name)} what you're facing… (English or Türkçe)"></textarea>
            <button class="btn" id="send">Speak</button>
          </div>
        </section>
      </div>`;
    const logEl = document.getElementById("log");
    const q = document.getElementById("q");
    const send = document.getElementById("send");

    function msgHTML(m, i) {
      if (m.role === "user") return `<div class="msg user">${esc(m.content)}</div>`;
      const tag = m.taught ? '<span class="tag">· taught</span>' : m.read ? `<span class="tag">· ${esc(m.read)}</span>` : "";
      const typed = m.q !== undefined && m.q !== E.MOOD_LABELS[m.mood];
      const tools = !m.pending && !m.crisis && !m.memory && m.q !== undefined ?`<div class="tools"><button data-again="${i}">↻ Another answer</button><button data-keep="${i}">★ Keep as training</button>${typed ? `<button data-fix="${i}">✎ Misread me</button>` : ""}</div>` : "";
      const opt = (v, label, cur) => `<option value="${v}"${v === (cur || "") ? " selected" : ""}>${esc(label)}</option>`;
      const fix = m.fixing ? `<div class="fix">
          <p>${g(c, "What did you mean? He will read it your way from now on.")}</p>
          <label>Feeling <select data-fixmood>${opt("", "No particular feeling", m.feel === "general" ? "" : m.feel)}${E.MOODS.map((k) => opt(k, E.MOOD_LABELS[k], m.feel)).join("")}</select></label>
          <label>About <select data-fixtopic>${opt("", "Nothing in particular", m.topic)}${E.TOPICS.map((k) => opt(k, E.TOPIC_LABELS[k], m.topic)).join("")}</select></label>
          <div class="row"><button class="btn small" data-fixsave="${i}">Save &amp; answer again</button><button class="btn ghost small" data-fixcancel="${i}">Cancel</button></div>
        </div>` : "";
      return `<div class="msg char${m.crisis ? " crisis" : ""}${m.pending ? " typing" : ""}"><span class="who">${esc(c.name)}${tag}</span><span class="body">${esc(m.content)}</span>${tools}${fix}</div>`;
    }
    function render(stick = true) {
      if (!log.length) { logEl.innerHTML = `<div class="empty">Write what's weighing on you, or pick a feeling below.<br>${esc(c.name)} will answer from ${g(c, "his")} own position.</div>`; return; }
      const top = logEl.scrollTop;
      logEl.innerHTML = log.map(msgHTML).join("");
      logEl.scrollTop = stick ? logEl.scrollHeight : top;
    }
    // Only follow the text down if you're already at the bottom (so you can scroll up and read).
    const nearBottom = () => logEl.scrollHeight - logEl.scrollTop - logEl.clientHeight < 80;

    let busy = false;
    function setBusy(b) {
      busy = b;
      send.disabled = b;
    }
    async function ask(text, mood) {
      if (busy) return; setBusy(true);
      log.push({ role: "user", content: text || E.MOOD_LABELS[mood] });
      const slot = { role: "char", content: "", pending: true, q: text || E.MOOD_LABELS[mood], mood };
      log.push(slot); render();
      const bodyEl = logEl.lastElementChild.querySelector(".body");
      const paint = perFrame((t) => { const stick = nearBottom(); bodyEl.textContent = t; if (stick) logEl.scrollTop = logEl.scrollHeight; });
      const lastTopic = (log.filter((m) => m.role === "char" && m.topic && m !== slot).pop() || {}).topic;
      // Memory: learn your name / goal from what you write, and use your name now and then.
      const learned = text ? learn(text) : {};
      let question = text, prefix = "";
      if (learned.name) { prefix = learned.name + "."; if (text.replace(/[^\p{L}\s]/gu, "").trim().split(/\s+/).length <= 6) question = "hello"; }
      else if (profile().name && chance(0.18)) prefix = profile().name + ".";
      if (learned.goal && !E.isCrisis(text)) {
        // He answers about the goal you just named, in his voice.
        Object.assign(slot, { content: (prefix ? prefix + " " : "") + E.say(c, "goalAsk", { goal: learned.goal }), pending: false, memory: true, read: "remembers your goal" });
        render(); persist(); setBusy(false); return;
      }
      // Bond: coming back on a new day counts.
      { const b = bond(c.id); if (b.day !== dayKey()) { b.day = dayKey(); store(BKEY(c.id), b); bump(c.id, 1); } }
      const tone = localStorage.getItem(TKEY) || "";
      // Did he ask you something last time? Then this message is your answer.
      const prev = log.filter((m) => m.role === "char" && m !== slot).pop();
      const answered = !!(text && prev && prev.asked);
      await answer(c, question, mood, { lastTopic, last: prev && !prev.crisis && !prev.pending && (prev.feel || prev.topic) ? { mood: prev.feel, topic: prev.topic, lang: prev.lang } : null, prefix, tone, bond: bondLevel(bond(c.id).score), canAsk: !answered, answered }, (t, done, meta) => {
        slot.content = t; Object.assign(slot, { taught: meta.taught, crisis: meta.crisis, followup: meta.followup, lang: meta.lang, topic: meta.topic, feel: meta.mood, intent: meta.intent, asked: meta.asked, read: g(c, [E.describe(meta), meta.asked ? "asks you" : ""].filter(Boolean).join(" · ")) });
        if (done) { slot.pending = false; render(nearBottom()); } else paint(t);
      });
      if (slot.pending) { slot.pending = false; render(); }
      // Bond: thanks (once a day) raises it; the same complaint three times in a row lowers it.
      const b = bond(c.id);
      if (slot.intent === "thanks" && b.thanked !== dayKey()) { b.thanked = dayKey(); store(BKEY(c.id), b); bump(c.id, 1); }
      const feels = log.filter((m) => m.role === "char" && m.feel).slice(-3).map((m) => m.feel);
      if (feels.length === 3 && feels[0] !== "general" && feels.every((f) => f === feels[0]) && !log.slice(-6).some((m) => m.complained)) { slot.complained = true; bump(c.id, -1); }
      const bEl = document.querySelector(".dossier .bond"); if (bEl) bEl.outerHTML = bondHTML(c);
      persist();
      // You left this chat and came back while he was still answering: redraw the open chat so it isn't stuck "typing".
      if (!logEl.isConnected) { if (location.hash === "#/c/" + id) route(); return; }
      setBusy(false); if (matchMedia("(min-width: 861px)").matches) q.focus();
    }

    send.onclick = () => {
      if (busy) return;
      const t = q.value.trim(); if (!t) return; q.value = ""; ask(t, null);
    };
    q.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send.click(); } };
    document.getElementById("asks").onclick = (e) => { const t = e.target.dataset.ask; if (t) ask(t, null); };
    document.getElementById("moods").onclick = (e) => { const m = e.target.dataset.m; if (m) ask("", m); };
    logEl.onclick = (e) => {
      const again = e.target.dataset.again, keep = e.target.dataset.keep, d = e.target.dataset;
      if (d.fix !== undefined) { log.forEach((m, k) => (m.fixing = k === +d.fix && !m.fixing)); render(false); return; }
      if (d.fixcancel !== undefined) { log[+d.fixcancel].fixing = false; render(false); return; }
      if (d.fixsave !== undefined) {
        const m = log[+d.fixsave], box = e.target.closest(".fix");
        const want = { mood: box.querySelector("[data-fixmood]").value || "general", topic: box.querySelector("[data-fixtopic]").value || null };
        E.addMisread(m.q, { mood: m.feel || "general", topic: m.topic || null }, want);
        m.fixing = false; persist();
        toast(g(c, `Noted. ${c.name} will read that your way from now on.`));
        ask(m.q, null); return;
      }
      if (again !== undefined) { const m = log[+again]; ask(m.q === E.MOOD_LABELS[m.mood] ? "" : m.q, m.mood); }
      if (keep !== undefined) {
        const m = log[+keep]; const t = E.getTraining(c.id);
        t.examples.push({ q: m.q, a: m.content }); E.saveTraining(c.id, t);
        toast(`Saved. ${c.name} will remember this answer.`);
      }
    };
    document.getElementById("moreBtn").onclick = (e) => { const d = e.target.closest(".dossier"); d.classList.toggle("open"); e.target.textContent = d.classList.contains("open") ? "Hide" : g(c, "About him"); };
    document.getElementById("clearChat").onclick = () => { if (log.length && !confirm("Clear this chat? Save it first if you want to keep it.")) return; log.length = 0; persist(); render(); };
    const toneEl = document.getElementById("tone");
    toneEl.value = localStorage.getItem(TKEY) || "";
    toneEl.onchange = () => { localStorage.setItem(TKEY, toneEl.value); toast(toneEl.value === "gentle" ? g(c, `${c.name} will be gentler with you.`) : toneEl.value === "hard" ? `${c.name} will not spare you.` : `${c.name} speaks as usual.`); };
    const asMessages = () => log.filter((m) => !m.pending && m.content).map((m) => ({ who: m.role === "user" ? "You" : c.name, text: m.content }));
    document.getElementById("saveChat").onclick = () => saveConversation("chat", [c.id], asMessages());
    document.getElementById("dlChat").onclick = () => { const m = asMessages(); if (!m.length) return toast("Nothing to download yet."); const s = { ids: [c.id], kind: "chat", date: new Date().toISOString(), messages: m }; download(fileName(s), asText(s)); };
    render(); if (matchMedia("(min-width: 861px)").matches) q.focus();
  }

  function viewCouncil() {
    const chosen = new Set(JSON.parse(localStorage.getItem("ironcouncil.council") || '["mehmed","ataturk","musashi","swordsman"]'));
    const mode = localStorage.getItem("ironcouncil.councilMode") || "counsel";
    app.innerHTML = `
      <h2 class="section-title">The Council</h2>
      <p class="sub">Ask once. Hear several convictions answer the same problem.</p>
      <div class="modes" id="modes"><button class="chip ${mode === "counsel" ? "on" : ""}" data-mode="counsel">Counsel — they advise you</button><button class="chip ${mode === "debate" ? "on" : ""}" data-mode="debate">Debate — they argue for and against</button></div>
      <p class="help mode-help">${mode === "debate" ? "Ask a yes-or-no choice (“Should I take a gap year?”). They split into two sides, argue, answer each other, and each gives a final verdict." : "Tell them what you're facing, or pick a feeling."}</p>
      <div class="pick" id="pick">${C.map((c) => `<button class="chip ${chosen.has(c.id) ? "on" : ""}" data-id="${c.id}" style="--c:${c.color}">${esc(c.monogram)} ${esc(c.name)}</button>`).join("")}</div>
      <div class="council-box">
        ${mode === "debate" ? "" : `<div class="moods" style="border-top:none" id="cm">${E.MOODS.concat("general").map((m) => `<button class="chip" data-m="${m}">${E.MOOD_LABELS[m]}</button>`).join("")}</div>`}
        <div class="composer"><textarea id="cq" placeholder="${mode === "debate" ? "Should I …? — e.g. Should I quit my job to start a business?" : "What are you facing?"}"></textarea><button class="btn" id="cs">${mode === "debate" ? "Open the debate" : "Summon"}</button></div>
      </div>
      <div class="answers" id="ans"></div>`;
    document.getElementById("pick").onclick = (e) => {
      const b = e.target.closest(".chip"); if (!b) return;
      const id = b.dataset.id;
      if (chosen.has(id)) chosen.delete(id); else { if (chosen.size >= 4) return toast("Up to four voices at once."); chosen.add(id); }
      b.classList.toggle("on", chosen.has(id));
      localStorage.setItem("ironcouncil.council", JSON.stringify([...chosen]));
    };
    const ans = document.getElementById("ans"), cq = document.getElementById("cq"), cs = document.getElementById("cs");
    let busy = false, session = null; // session: { question, list, said: [{c, text}] }
    const block = (c, tag, n) => `<div class="answer" style="--c:${c.color}"><h4>${esc(c.name)}${tag ? ` <span class="tag">${esc(tag)}</span>` : ""}</h4><div id="a-${n}" class="typing"></div></div>`;
    async function speak(n, text, c) {
      const el = document.getElementById("a-" + n);
      if (document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = text; el.classList.remove("typing"); return; }
      const words = text.split(" "); let i = 0;
      await new Promise((res) => { const tick = () => { i = Math.min(words.length, i + 3); el.textContent = words.slice(0, i).join(" "); if (i >= words.length) { el.classList.remove("typing"); res(); } else setTimeout(tick, 16); }; setTimeout(tick, 150); });
    }
    function tools() {
      return `<div class="council-tools"><button class="btn small" id="argue">Let them answer each other</button><button class="btn ghost small" id="csave">Save this council</button><button class="btn ghost small" id="cdl">Download</button></div>`;
    }
    function wireTools() {
      const qa = (sel) => ans.querySelector(sel) || {}; // the view may already be gone (you left while they were answering)
      qa("#argue").onclick = argue;
      const msgs = () => [{ who: "You", text: session.question }].concat(session.said.map((s) => ({ who: s.c.name, text: s.text })));
      qa("#csave").onclick = () => saveConversation("council", session.list.map((c) => c.id), msgs());
      qa("#cdl").onclick = () => { const s = { ids: session.list.map((c) => c.id), kind: "council", date: new Date().toISOString(), messages: msgs() }; download(fileName(s), asText(s)); };
    }
    // They speak in turn. After the first, each may answer someone who spoke before him.
    async function summon(text, mood) {
      if (busy) return;
      if (!chosen.size) return toast("Choose at least one member above.");
      busy = true; cs.disabled = true;
      const list = C.filter((c) => chosen.has(c.id));
      session = { question: text || E.MOOD_LABELS[mood], list, said: [] };
      ans.innerHTML = "";
      const p = profile();
      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        const r = E.forgeReply(c, text, mood, {});
        let body = r.text, tag = "";
        const rival = i > 0 && session.said.map((s) => s.c).find((o) => c.rivals[o.id]);
        if (!r.crisis && i > 0 && (rival || chance(0.65))) {
          const other = rival || session.said[Math.floor(Math.random() * session.said.length)].c;
          const re = E.react(c, other);
          if (re.text) { body = re.text + " " + body; tag = re.rival ? "to " + E.shortName(other) : (re.agree ? "agrees with " : "answers ") + E.shortName(other); }
        } else if (!r.crisis && i === 0 && p.name && chance(0.3)) body = p.name + ". " + body;
        ans.insertAdjacentHTML("beforeend", block(c, tag, i));
        session.said.push({ c, text: body });
        await speak(i, body, c);
        if (r.crisis) break;
      }
      if (list.length > 1 && !session.said.some((s) => s.text === E.CRISIS_MESSAGE || s.text === E.CRISIS_MESSAGE_TR)) { ans.insertAdjacentHTML("beforeend", tools()); wireTools(); }
      busy = false; cs.disabled = false;
    }
    // Round two: each answers the one who spoke before him (the first answers the last).
    async function argue() {
      if (busy || !session) return; busy = true;
      document.querySelector(".council-tools").remove();
      ans.insertAdjacentHTML("beforeend", `<div class="round">They answer each other</div>`);
      const L = session.list, base = session.said.length;
      for (let i = 0; i < L.length; i++) {
        const c = L[i], other = L.find((o) => o !== c && c.rivals[o.id]) || L[(i + L.length - 1) % L.length];
        const r = E.rebut(c, other);
        ans.insertAdjacentHTML("beforeend", block(c, r.rival ? "to " + E.shortName(other) : (r.agree ? "agrees with " : "answers ") + E.shortName(other), base + i));
        session.said.push({ c, text: `(to ${E.shortName(other)}) ` + r.text });
        await speak(base + i, r.text, c);
      }
      ans.insertAdjacentHTML("beforeend", tools()); wireTools();
      busy = false;
    }
    // ---- Debate: two sides, three rounds, a verdict from each, and the count.
    async function debate(text) {
      if (busy) return;
      const list = C.filter((c) => chosen.has(c.id));
      if (list.length < 2) return toast("Choose at least two members for a debate.");
      if (E.isCrisis(text)) { ans.innerHTML = `<div class="answer crisis"><div>${esc(E.crisisMessage(text))}</div></div>`; return; }
      busy = true; cs.disabled = true;
      // Bold tempers lean "do it", calm ones lean "not yet" — with chance, and never all on one side.
      const lean = { iron: 0.62, fire: 0.55, calm: 0.35 };
      const ranked = list.map((c) => ({ c, s: (lean[E.temper(c)] || 0.5) + Math.random() * 0.45 })).sort((x, y) => y.s - x.s);
      const half = Math.ceil(list.length / 2);
      const side = new Map(ranked.map((r, i) => [r.c.id, i < half ? "pro" : "con"]));
      const LABEL = { pro: "for — do it", con: "against — not yet" };
      session = { question: text, list, said: [] };
      ans.innerHTML = "";
      let n = 0;
      const say = async (c, tag, body, prefix) => { ans.insertAdjacentHTML("beforeend", block(c, tag, n)); session.said.push({ c, text: (prefix || "") + body }); await speak(n, body, c); n++; };
      ans.insertAdjacentHTML("beforeend", `<div class="round">Opening arguments</div>`);
      for (const r of ranked) {
        const c = r.c, sd = side.get(c.id);
        const body = [E.say(c, sd), E.topicLine(c, text)].filter(Boolean).join(" ");
        await say(c, LABEL[sd], body, `[${sd === "pro" ? "for" : "against"}] `);
      }
      ans.insertAdjacentHTML("beforeend", `<div class="round">They answer the other side</div>`);
      for (const r of ranked) {
        const c = r.c, sd = side.get(c.id);
        const opp = ranked.map((x) => x.c).filter((o) => side.get(o.id) !== sd);
        const target = opp.find((o) => c.rivals[o.id]) || opp[Math.floor(Math.random() * opp.length)];
        // A rival speaks to their shared history; anyone else answers with a second argument for his own side
        // (his generic "I disagree" lines are about temperament and could contradict the side he argues).
        const riv = c.rivals[target.id];
        const first = riv && riv.length && chance(0.8) ? E.say(c, null, null, riv) : "";
        const body = [first, E.say(c, sd), first ? "" : E.say(c, sd)].filter(Boolean).join(" ");
        await say(c, "to " + E.shortName(target), body, `(to ${E.shortName(target)}) `);
      }
      ans.insertAdjacentHTML("beforeend", `<div class="round">Verdicts</div>`);
      const votes = { pro: 0, con: 0 };
      for (const r of ranked) {
        const c = r.c; let sd = side.get(c.id), body = "";
        // Now and then a member is persuaded by the other side.
        if (chance(0.15)) {
          const opp = ranked.map((x) => x.c).filter((o) => side.get(o.id) !== sd);
          const won = opp[Math.floor(Math.random() * opp.length)];
          sd = sd === "pro" ? "con" : "pro";
          body = E.say(c, "agree", { name: E.shortName(won) }) + " I have changed my mind. ";
        }
        votes[sd]++;
        // a "do it" verdict ends with his call to action; a "not yet" with one of his cautious lines
        body += sd === "pro" ? "My verdict: do it. " + E.say(c, "closers") : "My verdict: not yet. " + E.say(c, "con");
        await say(c, "verdict: " + (sd === "pro" ? "do it" : "not yet"), body.trim(), "[verdict] ");
      }
      const total = votes.pro + votes.con;
      const summary = votes.pro === votes.con ? `The Council is split, ${votes.pro} to ${votes.con}. The choice is yours — and so is the responsibility.`
        : votes.pro > votes.con ? `${votes.pro} of ${total} say do it. The Council leans toward action.` : `${votes.con} of ${total} say not yet. The Council leans toward caution.`;
      ans.insertAdjacentHTML("beforeend", `<div class="tally"><b>${votes.pro}</b> do it · <b>${votes.con}</b> not yet<p>${esc(summary)}</p></div>`);
      session.said.push({ c: { name: "The Council" }, text: summary });
      ans.insertAdjacentHTML("beforeend", `<div class="council-tools"><button class="btn ghost small" id="csave">Save this debate</button><button class="btn ghost small" id="cdl">Download</button></div>`);
      const qa = (sel) => ans.querySelector(sel) || {};
      const msgs = () => [{ who: "You", text: "Debate: " + session.question }].concat(session.said.map((s) => ({ who: s.c.name, text: s.text })));
      qa("#csave").onclick = () => saveConversation("council", session.list.map((c) => c.id), msgs());
      qa("#cdl").onclick = () => { const s = { ids: session.list.map((c) => c.id), kind: "council", date: new Date().toISOString(), messages: msgs() }; download(fileName(s), asText(s)); };
      busy = false; cs.disabled = false;
    }
    cs.onclick = () => { const t = cq.value.trim(); if (!t) return; if (mode === "debate") debate(t); else summon(t, null); };
    cq.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); cs.click(); } };
    const cm = document.getElementById("cm"); if (cm) cm.onclick = (e) => { const m = e.target.dataset.m; if (m) summon("", m); };
    document.getElementById("modes").onclick = (e) => { const m = e.target.dataset.mode; if (m && m !== mode) { localStorage.setItem("ironcouncil.councilMode", m); viewCouncil(); } };
  }

  function viewForge(id) {
    const c = byId(id) || C[0];
    const t = E.getTraining(c.id);
    const total = t.beliefs.length + t.examples.length + Object.values(t.lines).reduce((a, l) => a + l.length, 0);
    app.innerHTML = `
      <h2 class="section-title">The Forge</h2>
      <p class="sub">${g(c, "Train a character. Everything you teach here is used in his answers right away.")} Saved in this browser — the Backup on the Saved page includes it.</p>
      <div class="forge-head">
        <select id="fsel">${C.map((x) => `<option value="${x.id}" ${x.id === c.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select>
        <span class="count">${total} thing${total === 1 ? "" : "s"} taught</span>
        <span style="flex:1"></span>
        <a class="btn ghost small" href="#/c/${c.id}">Talk to ${esc(c.name.split(" ")[0])}</a>
        <button class="btn ghost small" id="exp">Export all</button>
        <label class="btn ghost small" style="cursor:pointer">Import<input type="file" id="imp" accept=".json,application/json" hidden></label>
      </div>
      <div class="forge-grid" style="--c:${c.color}">
        <div class="panel">
          <h3>Beliefs</h3>
          <p class="help">${g(c, "A position he holds. He'll argue from it and use it in answers.")}</p>
          <div class="field"><input id="bIn" placeholder="e.g. Sleep and training are weapons, not luxuries."></div>
          <button class="btn small" id="bAdd">Add belief</button>
          <ul class="items">${t.beliefs.map((b, i) => `<li><span>${esc(b)}</span><button data-del="beliefs:${i}" title="Remove">×</button></li>`).join("")}</ul>
        </div>
        <div class="panel">
          <h3>Example answers</h3>
          <p class="help">${g(c, "Show how he'd answer a specific situation. When you ask something similar, he answers with this.")} Tip: use ★ in a chat to save answers you like.</p>
          <div class="field"><input id="eQ" placeholder="Question — e.g. I skipped the gym again."><textarea id="eA" placeholder="${g(c, "His answer, in his voice.")}"></textarea></div>
          <button class="btn small" id="eAdd">Add example</button>
          <ul class="items">${t.examples.map((e, i) => `<li><span><b>${esc(e.q)}</b>${esc(e.a)}</span><button data-del="examples:${i}" title="Remove">×</button></li>`).join("")}</ul>
        </div>
        <div class="panel">
          <h3>${g(c, "Lines for a feeling, topic, or about him")}</h3>
          <p class="help">Extra lines for when you feel a certain way, talk about a part of life, ${g(c, "ask about his own life, or ask his opinion of another member.")}</p>
          <div class="field">
            <select id="lM"><optgroup label="Feeling">${E.MOODS.concat("general").map((m) => `<option value="${m}">${E.MOOD_LABELS[m]}</option>`).join("")}</optgroup><optgroup label="Topic">${E.TOPICS.map((t) => `<option value="topic:${t}">About ${E.TOPIC_LABELS[t]}</option>`).join("")}</optgroup><optgroup label="${g(c, "When you ask about him")}">${E.ABOUT_KEYS.concat("general").map((k) => `<option value="about:${k}">${g(c, "His " + E.ABOUT_LABELS[k])}</option>`).join("")}</optgroup><optgroup label="${g(c, "His opinion of…")}">${C.filter((x) => x.id !== c.id).map((x) => `<option value="opinion:${x.id}">${esc(x.name)}</option>`).join("")}</optgroup></select>
            <textarea id="lT" placeholder="${g(c, "A line in his voice.")}"></textarea>
          </div>
          <button class="btn small" id="lAdd">Add line</button>
          <ul class="items">${Object.entries(t.lines).flatMap(([m, arr]) => arr.map((l, i) => `<li><span><b>${esc(E.MOOD_LABELS[m] || (m.startsWith("topic:") ? "About " + E.TOPIC_LABELS[m.slice(6)] : m.startsWith("about:") ? g(c, "His " + E.ABOUT_LABELS[m.slice(6)]) : m.startsWith("opinion:") ? "On " + ((C.find((x) => x.id === m.slice(8)) || {}).name || m) : m))}</b>${esc(l)}</span><button data-del="lines:${m}:${i}" title="Remove">×</button></li>`)).join("")}</ul>
        </div>
      </div>`;
    const save = () => { E.saveTraining(c.id, t); viewForge(c.id); };
    document.getElementById("fsel").onchange = (e) => location.hash = "#/forge/" + e.target.value;
    document.getElementById("bAdd").onclick = () => { const v = document.getElementById("bIn").value.trim(); if (v) { t.beliefs.push(v); save(); } };
    document.getElementById("eAdd").onclick = () => {
      const q = document.getElementById("eQ").value.trim(), a = document.getElementById("eA").value.trim();
      if (q && a) { t.examples.push({ q, a }); save(); } else toast("Write both the question and his answer.");
    };
    document.getElementById("lAdd").onclick = () => {
      const m = document.getElementById("lM").value, v = document.getElementById("lT").value.trim();
      if (v) { (t.lines[m] = t.lines[m] || []).push(v); save(); }
    };
    app.querySelectorAll("[data-del]").forEach((b) => b.onclick = () => {
      const parts = b.dataset.del.split(":"), k = parts[0], idx = +parts[parts.length - 1];
      if (k === "lines") {
        const key = parts.slice(1, -1).join(":");
        t.lines[key].splice(idx, 1); if (!t.lines[key].length) delete t.lines[key];
      } else t[k].splice(idx, 1);
      save();
    });
    document.getElementById("exp").onclick = () => {
      const blob = new Blob([JSON.stringify(E.exportAll(), null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "iron-council-training.json"; a.click();
    };
    document.getElementById("imp").onchange = async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { E.importAll(JSON.parse(await f.text())); toast("Training imported."); viewForge(c.id); }
      catch (err) { toast("That file isn't valid training JSON."); }
    };
  }

  // ---------- campaigns: 14-day programs; each day's task is that day's oath ----------
  const CKEY_CAMP = "ironcouncil.campaign", CHIST = "ironcouncil.campaigns.done";
  const CAMPS = window.CAMPAIGNS || [];
  // A task with {focus} filled in from what you told the leader when you began.
  const fillTask = (k, text, focus) => text.replace(/\{focus\}/g, (focus && focus.trim()) || k.focusDefault || "your work");
  const CAMP_RULES = [
    "Fourteen days, one task a day. Each day's task becomes that day's oath, sworn to the leader.",
    "On the Oath page press <b>Swear day N</b>, do the task, then mark it <b>kept</b> or <b>broken</b> — honestly. Nobody checks but you.",
    "If a day's task doesn't fit your life, you can change its wording before you swear it. Keep it just as hard.",
    "Missing a day doesn't end the campaign: the next day simply waits for you. But a broken oath stays broken.",
    "One oath per day. If you swear a different oath, the campaign continues tomorrow.",
    "At the end the leader judges you: 12 or more kept is a great finish, 8 or more a good one. A strong finish raises your bond with the leader.",
    "You can abandon a campaign at any time on the Oath page."
  ];
  const activeCampaign = () => { const a = load(CKEY_CAMP, null); return a && CAMPS.find((x) => x.id === a.id) ? a : null; };
  function campaignHTML(today) {
    const a = activeCampaign(), hist = load(CHIST, []);
    if (!a) {
      return `<div class="panel camps"><div class="label">Campaigns · 14 days with one of them</div>
        <p class="help">A campaign gives you one task a day for fourteen days, chosen by its leader. Each day's task becomes your oath, and the leader judges you.</p>
        <div class="camp-list">${CAMPS.map((k) => { const c = byId(k.leader); const done = hist.filter((h) => h.id === k.id);
          return `<div class="camp" style="--c:${c.color}"><div class="kind">${esc(k.kind)} · led by ${esc(c.name)}</div><h4>${esc(k.title)}</h4><p>${esc(k.about)}</p>
          ${done.length ? `<div class="camp-done">Completed ${done.length}× · best ${Math.max(...done.map((h) => h.kept))}/14 kept</div>` : ""}
          <a class="btn small" href="#/campaign/${k.id}">See the plan & rules</a></div>`; }).join("")}</div></div>`;
    }
    const k = CAMPS.find((x) => x.id === a.id), c = byId(k.leader), n = a.done.length + 1, day = k.days[n - 1];
    const pendingPast = oaths().find((o) => o.campaign === k.id && o.status === "pending" && o.date < dayKey());
    let body;
    if (pendingPast) body = `<p class="ask">First tell ${esc(c.name)} whether you kept day ${pendingPast.day} (above).</p>`;
    else if (today && today.campaign === k.id) body = `<p class="ask">Day ${today.day} is sworn. ${today.status === "pending" ? "Mark it below when it's done." : "Come back tomorrow for day " + (today.day + 1) + "."}</p>`;
    else if (today) body = `<p class="ask">You already swore another oath today. Day ${n} waits for tomorrow.</p>`;
    else body = `<div class="msg char"><span class="who">${esc(c.name)}</span><span class="body">${esc(day.word)}</span></div>
      <p class="help">Today's task — change the wording if it doesn't fit your day, but keep it as hard:</p>
      <div class="field"><textarea id="campTask" maxlength="200">${esc(fillTask(k, day.task, a.focus))}</textarea></div>
      <button class="btn" id="campSwear">Swear day ${n}</button>`;
    const boxes = k.days.map((d, i) => { const r = a.done[i]; return `<span class="${r ? r.status : i === n - 1 ? "now" : ""}" title="Day ${i + 1}: ${esc(d.task)}">${r ? (r.status === "kept" ? "✓" : "✗") : i + 1}</span>`; }).join("");
    return `<div class="panel camp-active" style="--c:${c.color}">
      <div class="label">${esc(k.title)} · day ${Math.min(n, 14)} of 14 · led by ${esc(c.name)}</div>
      ${a.focus ? `<p class="help">Your focus: <b>${esc(a.focus)}</b></p>` : ""}
      <div class="days">${boxes}</div>${body}
      <div class="row" style="margin-top:10px"><a class="btn ghost small" href="#/campaign/${k.id}">Plan & rules</a><button class="btn ghost small" id="campQuit">Abandon campaign</button></div></div>`;
  }
  function wireCampaign() {
    const sw = document.getElementById("campSwear");
    if (sw) sw.onclick = () => {
      const a = activeCampaign(), k = CAMPS.find((x) => x.id === a.id), n = a.done.length + 1;
      const text = (document.getElementById("campTask").value || "").trim() || fillTask(k, k.days[n - 1].task, a.focus);
      if (crisisGuard(text)) return;
      const all = oaths(); all.push({ date: dayKey(), id: k.leader, text, status: "pending", reply: k.days[n - 1].word, campaign: k.id, day: n }); saveOaths(all);
      viewOath();
    };
    const q = document.getElementById("campQuit");
    if (q) q.onclick = () => { if (confirm("Abandon this campaign? Your progress in it will be lost.")) { localStorage.removeItem(CKEY_CAMP); viewOath(); } };
  }
  // Called when an oath is judged: a campaign day is recorded; after day 14 the leader gives his verdict.
  function campaignJudged(o, status) {
    // (an oath left over from an earlier, abandoned run of the same campaign does not count)
    const a = activeCampaign(); if (!a || o.campaign !== a.id || o.date < a.started || a.done.some((d) => d.day === o.day)) return "";
    a.done.push({ day: o.day, status });
    const k = CAMPS.find((x) => x.id === a.id);
    if (a.done.length < k.days.length) { store(CKEY_CAMP, a); return ""; }
    const kept = a.done.filter((d) => d.status === "kept").length;
    const hist = load(CHIST, []); hist.push({ id: k.id, kept, finished: dayKey() }); store(CHIST, hist);
    localStorage.removeItem(CKEY_CAMP);
    bump(k.leader, kept >= 12 ? 5 : kept >= 8 ? 2 : 0);
    return `${k.title} — complete. ${kept} of 14 kept. ` + (kept >= 12 ? k.finish.great : kept >= 8 ? k.finish.good : k.finish.poor);
  }

  // ---------- journal: write about your day, one of them answers ----------
  const JKEY = "ironcouncil.journal";
  function viewJournal() {
    const list = load(JKEY, []);
    const lastWho = (list[0] || {}).who || "marcus";
    const p = profile();
    app.innerHTML = `
      <h2 class="section-title">Journal</h2>
      <p class="sub">${p.name ? esc(p.name) + ", write" : "Write"} about your day — what happened, what you did, what is weighing on you. One of them reads it and answers. It stays in this browser.</p>
      <div class="panel journal-new">
        <div class="field"><select id="jWho">${C.map((c) => `<option value="${c.id}" ${c.id === lastWho ? "selected" : ""}>${esc(c.name)} reads it</option>`).join("")}</select>
        <textarea id="jText" maxlength="3000" placeholder="Today I…"></textarea></div>
        <div class="row"><button class="btn" id="jWrite">Write it</button>${list.length ? `<span style="flex:1"></span><button class="btn ghost small" id="jDl">Download journal</button>` : ""}</div>
      </div>
      <div class="journal-list">${list.map((e, i) => { const c = byId(e.who) || C[0]; return `
        <div class="entry" style="--c:${c.color}">
          <div class="entry-head"><span>${esc(new Date(e.at).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }))}</span><button data-jdel="${i}" title="Delete this entry">×</button></div>
          <div class="entry-text">${esc(e.text)}</div>
          <div class="msg char"><span class="who">${esc(c.name)}</span><span class="body">${esc(e.reply)}</span></div>
        </div>`; }).join("") || `<div class="note">No entries yet. Write your first one above.</div>`}</div>`;
    const jt = document.getElementById("jText");
    document.getElementById("jWrite").onclick = () => {
      const text = jt.value.trim(); if (!text) return toast("Write something first.");
      const c = byId(document.getElementById("jWho").value);
      let reply;
      if (E.isCrisis(text)) reply = E.crisisMessage(text);
      else {
        learn(text);
        const r = E.forgeReply(c, text, null, { tone: localStorage.getItem("ironcouncil.tone." + c.id) || "", bond: bondLevel(bond(c.id).score) });
        reply = [E.say(c, "journal"), r.text].filter(Boolean).join(" ");
        // Writing to him once a day counts toward the bond.
        const b = bond(c.id); if (b.wrote !== dayKey()) { b.wrote = dayKey(); store(BKEY(c.id), b); bump(c.id, 1); }
      }
      const all = load(JKEY, []); all.unshift({ at: new Date().toISOString(), who: c.id, text, reply }); store(JKEY, all.slice(0, 500));
      viewJournal();
    };
    app.querySelectorAll("[data-jdel]").forEach((b) => b.onclick = () => {
      if (!confirm("Delete this journal entry? This can't be undone.")) return;
      const all = load(JKEY, []); all.splice(+b.dataset.jdel, 1); store(JKEY, all); viewJournal();
    });
    const dl = document.getElementById("jDl");
    if (dl) dl.onclick = () => download(`iron-council-journal-${dayKey()}.txt`, "The Iron Council — Journal\n\n" + load(JKEY, []).slice().reverse().map((e) => `${new Date(e.at).toLocaleString()}\n${e.text}\n\n${(byId(e.who) || {}).name}: ${e.reply}\n`).join("\n----------------\n\n"));
  }

  // ---------- a campaign's plan & rules ----------
  function viewCampaign(id) {
    const k = CAMPS.find((x) => x.id === id); if (!k) { location.hash = "#/oath"; return; }
    const c = byId(k.leader), a = activeCampaign(), mine = !!(a && a.id === k.id), other = a && !mine ? CAMPS.find((x) => x.id === a.id) : null;
    const hist = load(CHIST, []).filter((h) => h.id === k.id);
    const focus = mine ? a.focus || "" : "";
    app.innerHTML = `
      <div class="camp-page" style="--c:${c.color}">
        <a class="btn ghost small" href="#/oath">← Oath</a>
        <div class="camp-head">
          <div class="sigil big" style="--c:${c.color}">${esc(c.monogram)}</div>
          <div><div class="kind">${esc(k.kind)} · 14 days · led by ${esc(c.name)}</div><h2 class="section-title">${esc(k.title)}</h2><p class="sub">${esc(k.about)}</p></div>
        </div>
        <div class="msg char"><span class="who">${esc(c.name)}</span><span class="body">${esc(k.start)}</span></div>
        <div class="panel"><div class="label">How a campaign works</div><ol class="rules">${CAMP_RULES.map((r) => `<li>${r}</li>`).join("")}</ol></div>
        <div class="panel"><div class="label">${esc(E.shortName(c))}'s rules for this campaign</div><ul class="rules">${(k.rules || []).map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>
        ${k.focusQ ? `<div class="panel"><div class="label">Your focus</div><p class="help">${esc(k.focusQ)} The plan below fills it in for you.</p>
          <div class="field"><input id="focus" maxlength="80" placeholder="${esc(k.focusHint || "")}" value="${esc(focus)}"></div>${mine ? `<button class="btn ghost small" id="focusSave">Save focus</button>` : ""}</div>` : ""}
        <div class="panel"><div class="label">The plan · day by day</div><ol class="plan" id="plan"></ol></div>
        <div class="panel"><div class="label">The verdict at the end</div><ul class="rules">
          <li><b>12–14 kept:</b> ${esc(k.finish.great)}</li><li><b>8–11 kept:</b> ${esc(k.finish.good)}</li><li><b>Fewer:</b> ${esc(k.finish.poor)}</li></ul></div>
        ${hist.length ? `<p class="camp-done">Completed ${hist.length}× · best ${Math.max(...hist.map((h) => h.kept))}/14 kept</p>` : ""}
        <div class="row camp-go">${mine ? `<a class="btn" href="#/oath">Go to today's task</a>`
          : other ? `<p class="help">You are already in <b>${esc(other.title)}</b>. Finish or abandon it on the Oath page to begin this one.</p>`
          : `<button class="btn" id="begin">Begin the campaign</button>`}</div>
      </div>`;
    const fi = document.getElementById("focus");
    const plan = () => {
      const f = fi ? fi.value : focus;
      document.getElementById("plan").innerHTML = k.days.map((d, i) => {
        const r = mine && a.done[i];
        const cls = r ? r.status : mine && i === a.done.length ? "now" : "";
        return `<li class="${cls}"><span class="dn">Day ${i + 1}${r ? (r.status === "kept" ? " ✓" : " ✗") : ""}</span><span class="dt">${esc(fillTask(k, d.task, f))}</span><span class="dw">“${esc(d.word)}”</span></li>`;
      }).join("");
    };
    plan();
    if (fi) fi.oninput = plan;
    const fsave = document.getElementById("focusSave");
    if (fsave) fsave.onclick = () => { if (crisisGuard(fi.value)) return; const cur = activeCampaign(); cur.focus = fi.value.trim(); store(CKEY_CAMP, cur); toast("Focus saved."); };
    const b = document.getElementById("begin");
    if (b) b.onclick = () => {
      const f = fi ? fi.value.trim() : "";
      if (crisisGuard(f)) return;
      if (k.focusQ && !f) { fi.focus(); return toast(`Tell ${E.shortName(c)} your focus first.`); }
      store(CKEY_CAMP, { id: k.id, started: dayKey(), done: [], focus: f });
      location.hash = "#/oath";
      setTimeout(() => toast(`${k.title} begins. Day 1 is ready.`), 60);
    };
  }

  // ---------- the oath page ----------
  function viewOath() {
    const p = profile(), list = oaths(), due = unjudged(), t = todaysOath();
    const lastId = (list[list.length - 1] || {}).id || "musashi";
    const kept = list.filter((o) => o.status === "kept").length, broken = list.filter((o) => o.status === "broken").length;
    const judgeHTML = due.map((o) => { const c = byId(o.id) || C[0]; return `
      <div class="panel judge" style="--c:${c.color}">
        <div class="label">${esc(prettyDay(o.date))} · sworn before ${esc(c.name)}</div>
        <blockquote>“${esc(o.text)}”</blockquote>
        <p class="ask">${esc(c.name)} asks: did you keep it?</p>
        <div class="row"><button class="btn small" data-judge="${o.date}:kept">I kept it</button><button class="btn ghost small" data-judge="${o.date}:broken">I broke it</button></div>
      </div>`; }).join("");
    let todayHTML;
    if (t) {
      const c = byId(t.id) || C[0];
      todayHTML = `<div class="panel sworn" style="--c:${c.color}">
        <div class="label">Today · sworn before ${esc(c.name)}</div>
        <blockquote>“${esc(t.text)}”</blockquote>
        <div class="msg char"><span class="who">${esc(c.name)}</span><span class="body">${esc(t.reply || "")}</span></div>
        ${t.status === "kept" ? `<p class="done">Kept ✓</p>${t.verdict ? `<div class="msg char"><span class="who">${esc(c.name)}</span><span class="body">${esc(t.verdict)}</span></div>` : ""}` : `<div class="row"><button class="btn small" data-judge="${t.date}:kept">Done. I kept it.</button></div>`}
      </div>`;
    } else {
      todayHTML = `<div class="panel">
        <div class="label">Today's oath</div>
        <p class="help">One task you will do today. Say it plainly. Tomorrow the one you swore to will ask whether you kept it.</p>
        <div class="field"><select id="oWho">${C.map((c) => `<option value="${c.id}" ${c.id === lastId ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select>
        <input id="oText" maxlength="140" placeholder="e.g. Study chemistry for two hours without my phone."></div>
        <button class="btn" id="swear">Swear it</button>
      </div>`;
    }
    app.innerHTML = `
      <h2 class="section-title">The Oath</h2>
      <p class="sub">${p.name ? esc(p.name) + ", one" : "One"} day, one task, one witness.</p>
      <div class="stats"><div><b>${streak()}</b><span>day streak</span></div><div><b>${kept}</b><span>kept</span></div><div><b>${broken}</b><span>broken</span></div></div>
      <div id="verdict"></div>
      ${judgeHTML}
      ${campaignHTML(t)}
      ${todayHTML}
      <div class="panel">
        <div class="label">What they remember about you</div>
        <p class="help">They use your name now and then, and ask about your goal when you come back on a new day. You can also just tell them in a chat: “my name is …”, “my goal is …”.</p>
        <div class="field"><input id="pName" maxlength="30" placeholder="Your name" value="${esc(p.name)}"><input id="pGoal" maxlength="120" placeholder="Your goal — e.g. pass the university exam" value="${esc(p.goal)}"></div>
        <div class="row"><button class="btn small" id="pSave">Save</button><button class="btn ghost small" id="pForget">Forget me</button></div>
      </div>
      ${list.length ? `<div class="panel"><div class="label">Past oaths</div><ul class="items">${list.slice().reverse().slice(0, 60).map((o) => `<li><span><b>${esc(prettyDay(o.date))} · ${esc((byId(o.id) || {}).name || "")} · ${o.status === "kept" ? "kept ✓" : o.status === "broken" ? "broken ✗" : "waiting"}</b>${esc(o.text)}</span></li>`).join("")}</ul></div>` : ""}`;

    const sw = document.getElementById("swear");
    if (sw) sw.onclick = () => {
      const text = document.getElementById("oText").value.trim(); if (!text) return toast("Name the task first.");
      if (crisisGuard(text)) return;
      const c = byId(document.getElementById("oWho").value);
      const reply = E.say(c, "oathTake", { oath: text });
      const all = oaths(); all.push({ date: dayKey(), id: c.id, text, status: "pending", reply }); saveOaths(all);
      viewOath();
    };
    document.getElementById("oText") && (document.getElementById("oText").onkeydown = (e) => { if (e.key === "Enter") sw.click(); });
    app.querySelectorAll("[data-judge]").forEach((b) => b.onclick = () => {
      const [date, status] = b.dataset.judge.split(":");
      const all = oaths(), o = all.find((x) => x.date === date); if (!o) return;
      const c = byId(o.id) || C[0];
      if (o.status !== "pending") return;
      bump(o.id, status === "kept" ? 3 : -3);
      o.status = status;
      o.verdict = E.say(c, status === "kept" ? "oathKept" : "oathBroken", { oath: o.text });
      saveOaths(all);
      const finale = campaignJudged(o, status);
      viewOath();
      const say = (who, text) => `<div class="msg char"><span class="who">${esc(who.name)}</span><span class="body">${esc(text)}</span></div>`;
      if (date !== dayKey() || finale) document.getElementById("verdict").innerHTML = `<div class="panel" style="--c:${c.color}">${date !== dayKey() ? say(c, o.verdict) : ""}${finale ? say(c, finale) : ""}</div>`;
    });
    wireCampaign();
    document.getElementById("pSave").onclick = () => { if (crisisGuard(document.getElementById("pName").value, document.getElementById("pGoal").value)) return; saveProfile({ name: document.getElementById("pName").value.trim(), goal: document.getElementById("pGoal").value.trim() }); toast("They will remember."); };
    document.getElementById("pForget").onclick = () => { saveProfile({ name: "", goal: "" }); viewOath(); toast("Forgotten."); };
  }

  // ---------- saved conversations ----------
  function viewSaved(sid) {
    const list = savedList();
    const names = (s) => s.ids.map((id) => (byId(id) || {}).name).filter(Boolean).join(", ");
    if (sid) {
      const s = list.find((x) => x.sid === sid); if (!s) { location.hash = "#/saved"; return; }
      const c0 = byId(s.ids[0]) || C[0];
      app.innerHTML = `
        <h2 class="section-title">${s.kind === "council" ? "Council" : "Conversation"} with ${esc(names(s))}</h2>
        <p class="sub">${esc(new Date(s.date).toLocaleString())} · ${s.messages.length} messages</p>
        <div class="forge-head"><a class="btn ghost small" href="#/saved">← All saved</a><span style="flex:1"></span>
          ${s.kind === "chat" ? `<button class="btn ghost small" id="resume">Continue this conversation</button>` : ""}
          <button class="btn ghost small" id="dl">Download</button><button class="btn ghost small" id="del">Delete</button></div>
        <section class="chat" style="--c:${c0.color}"><div class="log saved-log">${s.messages.map((m) => {
          const c = C.find((x) => x.name === m.who);
          return m.who === "You" ? `<div class="msg user">${esc(m.text)}</div>` : `<div class="msg char" style="--c:${c ? c.color : c0.color}"><span class="who">${esc(m.who)}</span><span class="body">${esc(m.text)}</span></div>`;
        }).join("")}</div></section>`;
      document.getElementById("dl").onclick = () => download(fileName(s), asText(s));
      document.getElementById("del").onclick = () => { if (!confirm("Delete this saved conversation? This can't be undone.")) return; store(SKEY, savedList().filter((x) => x.sid !== sid)); location.hash = "#/saved"; };
      const rs = document.getElementById("resume");
      if (rs) rs.onclick = () => {
        const id = s.ids[0], c = byId(id);
        const cur = load("ironcouncil.chat." + id, []);
        if (cur.length && !confirm(`Replace your current chat with ${c.name} with this saved one? (Save the current one first if you want to keep it.)`)) return;
        const log = s.messages.map((m) => m.who === "You" ? { role: "user", content: m.text } : { role: "char", content: m.text });
        store("ironcouncil.chat." + id, log); delete state.chats[id];
        location.hash = "#/c/" + id;
      };
      return;
    }
    app.innerHTML = `
      <h2 class="section-title">Saved</h2>
      <p class="sub">Conversations and councils you chose to keep. Stored in this browser — download the ones that matter.</p>
      ${list.length ? `<ul class="saved">${list.map((s) => { const c = byId(s.ids[0]) || C[0]; return `<li style="--c:${c.color}">
        <a href="#/saved/${s.sid}"><b>${esc(s.title)}</b><span>${s.kind === "council" ? "Council · " : ""}${esc(names(s))} · ${esc(new Date(s.date).toLocaleDateString())} · ${s.messages.length} messages</span></a>
        <button class="btn ghost small" data-dl="${s.sid}">Download</button></li>`; }).join("")}</ul>`
        : `<div class="note">Nothing saved yet. In any chat or council, press <b>Save conversation</b>.</div>`}
      <div class="panel backup">
        <div class="label">Backup · move to another device</div>
        <p class="help">Everything lives only in this browser: your name and goal, oaths and streak, campaigns, how each of them sees you, chats, saved conversations and what you taught in the Forge. Download one backup file here, then open the site on your phone, laptop or the online version and restore it there. Restoring <b>merges</b> — nothing on that device is lost.</p>
        <div class="row"><button class="btn small" id="bk">Download backup</button>
        <label class="btn ghost small" style="cursor:pointer">Restore from backup<input type="file" id="rs" accept=".json,application/json" hidden></label></div>
        <p class="help" id="bkInfo"></p>
      </div>
      <div class="panel backup" id="misPanel"></div>`;
    document.getElementById("bkInfo").textContent = backupSummary();
    // Messages you marked "Misread me": they already work your way here; the file lets the engine learn them for everyone.
    const mis = () => {
      const list = E.misreads(), el = document.getElementById("misPanel");
      const lbl = (r) => [r.mood && r.mood !== "general" ? E.MOOD_LABELS[r.mood] : "no feeling", r.topic ? E.TOPIC_LABELS[r.topic] : "no topic"].join(" · ");
      el.innerHTML = `<div class="label">Misread messages · ${list.length}</div>
        <p class="help">When a member misreads you, press <b>✎ Misread me</b> under the answer and say what you meant. From then on, that message (and ones worded almost the same) is read your way in this browser. Download the list to send it in, so the engine learns it for everyone.</p>
        ${list.length ? `<ul class="mislist">${list.slice(-8).reverse().map((f) => `<li><q>${esc(f.q)}</q><span>read as ${esc(lbl(f.got || {}))} → <b>${esc(lbl(f.want || {}))}</b></span></li>`).join("")}</ul>
        <div class="row"><button class="btn small" id="misDl">Download list</button><button class="btn ghost small" id="misClr">Clear</button></div>` : ""}`;
      if (!list.length) return;
      document.getElementById("misDl").onclick = () => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify({ app: "iron-council", kind: "misreads", made: new Date().toISOString(), misreads: list }, null, 1)], { type: "application/json" }));
        a.download = `iron-council-misreads-${dayKey()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      };
      document.getElementById("misClr").onclick = () => { if (!confirm("Clear your corrections? Those messages will be read the default way again.")) return; E.clearMisreads(); mis(); };
    };
    mis();
    document.getElementById("bk").onclick = () => {
      const data = backupData();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" }));
      a.download = `iron-council-backup-${dayKey()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      toast("Backup downloaded.");
    };
    document.getElementById("rs").onchange = async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        if (!data || data.app !== "iron-council" || typeof data.keys !== "object") throw new Error("not a backup");
        const n = restoreBackup(data);
        for (const k of Object.keys(state.chats)) delete state.chats[k];
        toast(`Restored and merged ${n} item${n === 1 ? "" : "s"}.`); viewSaved();
      } catch (err) { toast("That file isn't an Iron Council backup."); }
    };
    app.querySelectorAll("[data-dl]").forEach((b) => b.onclick = () => { const s = list.find((x) => x.sid === b.dataset.dl); download(fileName(s), asText(s)); });
  }

  // ---------- router ----------
  function route() {
    const h = location.hash.replace(/^#\/?/, "").split("/");
    const nav = h[0] === "c" ? "hall" : h[0] === "campaign" ? "oath" : h[0] || "hall";
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("on", a.dataset.nav === nav));
    if (h[0] === "c") viewChar(h[1]);
    else if (h[0] === "council") viewCouncil();
    else if (h[0] === "forge") viewForge(h[1]);
    else if (h[0] === "oath") viewOath();
    else if (h[0] === "journal") viewJournal();
    else if (h[0] === "campaign") viewCampaign(h[1]);
    else if (h[0] === "saved") viewSaved(h[1]);
    else viewHall();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();
})();
