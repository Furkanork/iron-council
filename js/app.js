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
  const NAME_RE = [/(?:^|[^\p{L}])(?:my name is|my name's|call me|i am called|i'm called)\s+([\p{L}][\p{L}'-]{1,20})/iu, /(?:^|[^\p{L}])(?:benim adım|benim ismim|ismim|adım)\s+([\p{L}]{2,20})/iu];
  const GOAL_RE = [/(?:^|[^\p{L}])(?:my goal is(?: to)?|my dream is(?: to)?|my aim is(?: to)?|my goal:)\s+([^.!?\n]{3,90})/iu, /(?:^|[^\p{L}])(?:hedefim|amacım|hayalim)\s*:?\s+([^.!?\n]{3,90})/iu];
  const NOT_NAMES = new Set(["adım", "not", "the", "a", "bir", "very", "so", "çok"]);
  // Learn a name or goal from what you write. Returns what was learned.
  function learn(text) {
    const p = profile(), got = {};
    for (const re of NAME_RE) { const m = text.match(re); if (m && !NOT_NAMES.has(m[1].toLowerCase())) { got.name = m[1][0].toUpperCase() + m[1].slice(1); break; } }
    for (const re of GOAL_RE) { const m = text.match(re); if (m) { got.goal = m[1].trim(); break; } }
    if (got.name || got.goal) saveProfile(Object.assign(p, got));
    return got;
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

  const ASKS = ["How do you feel?", "What do you fear?", "Do you regret anything?", "Your proudest moment?", "Your hardest moment?", "Who did you love?", "How did you die?", "What do you think of me?"];

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
    app.innerHTML = `
      <div class="char-layout">
        <aside class="dossier" style="--c:${c.color}">
          <div class="sigil big" style="--c:${c.color}">${esc(c.monogram)}</div>
          <h2>${esc(c.name)}</h2>
          <div class="ttl">${esc(c.title)}</div>
          <div class="meta">${esc(c.era)} · ${esc(c.region)}</div>
          <div class="idea">${esc(c.idea)}</div>
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
      const tools = !m.pending && !m.crisis && !m.memory && m.q !== undefined ?`<div class="tools"><button data-again="${i}">↻ Another answer</button><button data-keep="${i}">★ Keep as training</button></div>` : "";
      return `<div class="msg char${m.crisis ? " crisis" : ""}${m.pending ? " typing" : ""}"><span class="who">${esc(c.name)}${tag}</span><span class="body">${esc(m.content)}</span>${tools}</div>`;
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
      await answer(c, question, mood, { lastTopic, prefix }, (t, done, meta) => {
        slot.content = t; Object.assign(slot, { taught: meta.taught, crisis: meta.crisis, topic: meta.topic, read: g(c, E.describe(meta)) });
        if (done) { slot.pending = false; render(nearBottom()); } else paint(t);
      });
      if (slot.pending) { slot.pending = false; render(); }
      persist();
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
      const again = e.target.dataset.again, keep = e.target.dataset.keep;
      if (again !== undefined) { const m = log[+again]; ask(m.q === E.MOOD_LABELS[m.mood] ? "" : m.q, m.mood); }
      if (keep !== undefined) {
        const m = log[+keep]; const t = E.getTraining(c.id);
        t.examples.push({ q: m.q, a: m.content }); E.saveTraining(c.id, t);
        toast(`Saved. ${c.name} will remember this answer.`);
      }
    };
    document.getElementById("moreBtn").onclick = (e) => { const d = e.target.closest(".dossier"); d.classList.toggle("open"); e.target.textContent = d.classList.contains("open") ? "Hide" : g(c, "About him"); };
    document.getElementById("clearChat").onclick = () => { if (log.length && !confirm("Clear this chat? Save it first if you want to keep it.")) return; log.length = 0; persist(); render(); };
    const asMessages = () => log.filter((m) => !m.pending && m.content).map((m) => ({ who: m.role === "user" ? "You" : c.name, text: m.content }));
    document.getElementById("saveChat").onclick = () => saveConversation("chat", [c.id], asMessages());
    document.getElementById("dlChat").onclick = () => { const m = asMessages(); if (!m.length) return toast("Nothing to download yet."); const s = { ids: [c.id], kind: "chat", date: new Date().toISOString(), messages: m }; download(fileName(s), asText(s)); };
    render(); if (matchMedia("(min-width: 861px)").matches) q.focus();
  }

  function viewCouncil() {
    const chosen = new Set(JSON.parse(localStorage.getItem("ironcouncil.council") || '["mehmed","ataturk","musashi","swordsman"]'));
    app.innerHTML = `
      <h2 class="section-title">The Council</h2>
      <p class="sub">Ask once. Hear several convictions answer the same problem.</p>
      <div class="pick" id="pick">${C.map((c) => `<button class="chip ${chosen.has(c.id) ? "on" : ""}" data-id="${c.id}" style="--c:${c.color}">${esc(c.monogram)} ${esc(c.name)}</button>`).join("")}</div>
      <div class="council-box">
        <div class="moods" style="border-top:none" id="cm">${E.MOODS.concat("general").map((m) => `<button class="chip" data-m="${m}">${E.MOOD_LABELS[m]}</button>`).join("")}</div>
        <div class="composer"><textarea id="cq" placeholder="What are you facing?"></textarea><button class="btn" id="cs">Summon</button></div>
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
      document.getElementById("argue").onclick = argue;
      const msgs = () => [{ who: "You", text: session.question }].concat(session.said.map((s) => ({ who: s.c.name, text: s.text })));
      document.getElementById("csave").onclick = () => saveConversation("council", session.list.map((c) => c.id), msgs());
      document.getElementById("cdl").onclick = () => { const s = { ids: session.list.map((c) => c.id), kind: "council", date: new Date().toISOString(), messages: msgs() }; download(fileName(s), asText(s)); };
    }
    // They speak in turn. After the first, each may answer someone who spoke before him.
    async function summon(text, mood) {
      if (busy || !chosen.size) return; busy = true; cs.disabled = true;
      const list = C.filter((c) => chosen.has(c.id));
      session = { question: text || E.MOOD_LABELS[mood], list, said: [] };
      ans.innerHTML = "";
      const p = profile();
      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        const r = E.forgeReply(c, text, mood, {});
        let body = r.text, tag = "";
        if (!r.crisis && i > 0 && chance(0.65)) {
          const other = session.said[Math.floor(Math.random() * session.said.length)].c;
          const re = E.react(c, other);
          if (re.text) { body = re.text + " " + body; tag = (re.agree ? "agrees with " : "answers ") + E.shortName(other); }
        } else if (!r.crisis && i === 0 && p.name && chance(0.3)) body = p.name + ". " + body;
        ans.insertAdjacentHTML("beforeend", block(c, tag, i));
        session.said.push({ c, text: body });
        await speak(i, body, c);
        if (r.crisis) break;
      }
      if (list.length > 1 && !session.said.some((s) => s.text === E.CRISIS_MESSAGE)) { ans.insertAdjacentHTML("beforeend", tools()); wireTools(); }
      busy = false; cs.disabled = false;
    }
    // Round two: each answers the one who spoke before him (the first answers the last).
    async function argue() {
      if (busy || !session) return; busy = true;
      document.querySelector(".council-tools").remove();
      ans.insertAdjacentHTML("beforeend", `<div class="round">They answer each other</div>`);
      const L = session.list, base = session.said.length;
      for (let i = 0; i < L.length; i++) {
        const c = L[i], other = L[(i + L.length - 1) % L.length];
        const r = E.rebut(c, other);
        ans.insertAdjacentHTML("beforeend", block(c, (r.agree ? "agrees with " : "answers ") + E.shortName(other), base + i));
        session.said.push({ c, text: `(to ${E.shortName(other)}) ` + r.text });
        await speak(base + i, r.text, c);
      }
      ans.insertAdjacentHTML("beforeend", tools()); wireTools();
      busy = false;
    }
    cs.onclick = () => { const t = cq.value.trim(); if (t) summon(t, null); };
    cq.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); cs.click(); } };
    document.getElementById("cm").onclick = (e) => { const m = e.target.dataset.m; if (m) summon("", m); };
  }

  function viewForge(id) {
    const c = byId(id) || C[0];
    const t = E.getTraining(c.id);
    const total = t.beliefs.length + t.examples.length + Object.values(t.lines).reduce((a, l) => a + l.length, 0);
    app.innerHTML = `
      <h2 class="section-title">The Forge</h2>
      <p class="sub">Train a character. Everything you teach here is used in his answers right away. Saved in this browser only — use Export to back it up.</p>
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
      o.status = status;
      o.verdict = E.say(c, status === "kept" ? "oathKept" : "oathBroken", { oath: o.text });
      saveOaths(all);
      viewOath();
      if (date !== dayKey()) document.getElementById("verdict").innerHTML = `<div class="panel" style="--c:${c.color}"><div class="msg char"><span class="who">${esc(c.name)}</span><span class="body">${esc(o.verdict)}</span></div></div>`;
    });
    document.getElementById("pSave").onclick = () => { saveProfile({ name: document.getElementById("pName").value.trim(), goal: document.getElementById("pGoal").value.trim() }); toast("They will remember."); };
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
        : `<div class="note">Nothing saved yet. In any chat or council, press <b>Save conversation</b>.</div>`}`;
    app.querySelectorAll("[data-dl]").forEach((b) => b.onclick = () => { const s = list.find((x) => x.sid === b.dataset.dl); download(fileName(s), asText(s)); });
  }

  // ---------- router ----------
  function route() {
    const h = location.hash.replace(/^#\/?/, "").split("/");
    const nav = h[0] === "c" ? "hall" : h[0] || "hall";
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("on", a.dataset.nav === nav));
    if (h[0] === "c") viewChar(h[1]);
    else if (h[0] === "council") viewCouncil();
    else if (h[0] === "forge") viewForge(h[1]);
    else if (h[0] === "oath") viewOath();
    else if (h[0] === "saved") viewSaved(h[1]);
    else viewHall();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();
})();
