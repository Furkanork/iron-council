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

  // ---------- answering (shared by chat + council) ----------
  // Composed instantly in under a millisecond; revealed quickly so it reads as spoken.
  async function answer(char, question, mood, ctx, onUpdate) {
    const r = E.forgeReply(char, question, mood, ctx);
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
      <section class="oath">
        <div class="label">Oath of the day</div>
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
    const persist = () => { try { localStorage.setItem(CKEY, JSON.stringify(log.slice(-40))); } catch (e) { /* full: fine */ } };
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
            <button class="btn ghost small" id="clearChat">Clear chat</button>
          </div>
          </div>
        </aside>
        <section class="chat" style="--c:${c.color}">
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
      const tools = !m.pending && !m.crisis ? `<div class="tools"><button data-again="${i}">↻ Another answer</button><button data-keep="${i}">★ Keep as training</button></div>` : "";
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
      await answer(c, text, mood, { lastTopic }, (t, done, meta) => {
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
    document.getElementById("clearChat").onclick = () => { log.length = 0; persist(); render(); };
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
    let busy = false;
    async function summon(text, mood) {
      if (busy || !chosen.size) return; busy = true; cs.disabled = true;
      const list = C.filter((c) => chosen.has(c.id));
      ans.innerHTML = list.map((c) => `<div class="answer" style="--c:${c.color}"><h4>${esc(c.name)}</h4><div id="a-${c.id}" class="typing"></div></div>`).join("");
      const jobs = list.map((c) => () => {
        const el = document.getElementById("a-" + c.id);
        const paint = perFrame((t) => { el.textContent = t; });
        return answer(c, text, mood, [], (t, done) => {
          if (done) { el.textContent = t; el.classList.remove("typing"); } else paint(t);
        });
      });
      await Promise.all(jobs.map((j) => j()));
      busy = false; cs.disabled = false;
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

  // ---------- router ----------
  function route() {
    const h = location.hash.replace(/^#\/?/, "").split("/");
    const nav = h[0] === "c" ? "hall" : h[0] || "hall";
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("on", a.dataset.nav === nav));
    if (h[0] === "c") viewChar(h[1]);
    else if (h[0] === "council") viewCouncil();
    else if (h[0] === "forge") viewForge(h[1]);
    else viewHall();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();
})();
