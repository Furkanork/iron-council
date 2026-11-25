/*
 * Smoke test for the whole site (Playwright).
 *   node tests/smoke.js            -> opens index.html from disk
 *   BASE=http://localhost:8080/ node tests/smoke.js
 *
 * Visits every page (Hall, a chat with every member, Council in both modes, Oath,
 * every Campaign, Journal, Saved, Forge for every member), sends a message where
 * there is a box, and fails on: console/page errors, empty answers, leftover
 * {placeholders} / "undefined" / "[object", and horizontal overflow at phone width.
 */
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) { console.error("playwright is not installed"); process.exit(2); }

const BASE = process.env.BASE || "file://" + path.resolve(__dirname, "..", "index.html");
const PHONE = { width: 375, height: 740 };
const BAD = /\{[a-zA-Z_]+\}|\bundefined\b|\bNaN\b|\[object |\bnull\b/;
const fails = [];
let checks = 0;
const fail = (where, what) => { fails.push(where + ": " + what); console.log("  ✗ " + where + ": " + what); };
const ok = (c, where, what) => { checks++; if (!c) fail(where, what); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: PHONE });
  let where = "start";
  page.on("pageerror", (e) => { if (!/ServiceWorker/.test(e.message)) fail(where, "page error: " + e.message); });
  page.on("console", (m) => { if (m.type() === "error" && !/fonts\.g|net::ERR|Failed to load resource/.test(m.text())) fail(where, "console error: " + m.text()); });

  const go = async (hash) => {
    where = hash;
    await page.evaluate((h) => { location.hash = h; }, hash);
    await page.waitForTimeout(120);
  };
  const checkPage = async (name) => {
    const t = await page.evaluate(() => document.getElementById("app").innerText);
    ok(t.trim().length > 20, name, "page is empty");
    const m = t.match(BAD);
    ok(!m, name, "leftover token in page text: " + (m && m[0]));
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(over <= 1, name, "horizontal overflow of " + over + "px at phone width");
  };

  await page.goto(BASE);
  await page.waitForSelector("#app *");
  const ids = await page.evaluate(() => window.CHARACTERS.map((c) => c.id));
  ok(ids.length === 18, "characters", "expected 18 members, found " + ids.length);

  where = "hall"; await go("#/"); await checkPage("hall");

  // chat with every member
  const msgs = ["I am afraid I will fail my exam", "I feel tired and lazy, I can't start working", "sınavdan korkuyorum, çok yorgunum", "Korkun var mı?", "Napolyon hakkında ne düşünüyorsun?"];
  for (const id of ids) {
    await go("#/c/" + id);
    await page.waitForSelector("#q", { timeout: 5000 }).catch(() => fail("chat " + id, "no message box"));
    for (const m of msgs) {
      const before = await page.evaluate(() => document.querySelectorAll("#log .msg.char").length);
      await page.fill("#q", m);
      await page.click("#send");
      await page.waitForFunction((n) => document.querySelectorAll("#log .msg.char").length > n && !document.querySelector("#log .msg.typing"), before, { timeout: 15000 }).catch(() => fail("chat " + id, "no answer to: " + m));
      const ans = await page.evaluate(() => { const a = document.querySelectorAll("#log .msg.char .body"); return a.length ? a[a.length - 1].innerText : ""; });
      ok(ans.trim().length > 15, "chat " + id, "empty/very short answer to: " + m);
      const bad = ans.match(BAD);
      ok(!bad, "chat " + id, "leftover token '" + (bad && bad[0]) + "' in: " + ans.slice(0, 80));
    }
    await checkPage("chat " + id);
  }

  // safety: a worrying message gets the support message (English and Turkish), and is never used as an oath
  for (const msg of ["I want to die", "ölmek istiyorum"]) {
    await go("#/c/" + ids[0]);
    await page.waitForSelector("#q");
    await page.fill("#q", msg); await page.click("#send");
    await page.waitForSelector("#log .msg.char.crisis", { timeout: 8000 }).catch(() => fail("safety", "no support message for: " + msg));
    const txt = await page.evaluate(() => { const a = document.querySelectorAll("#log .msg.char.crisis .body"); return a.length ? a[a.length - 1].innerText : ""; });
    ok(/112/.test(txt), "safety", "support message must name 112 for: " + msg);
  }
  await go("#/oath");
  await page.waitForSelector("#oText");
  const oathsBefore = await page.evaluate(() => (localStorage.getItem("ironcouncil.oaths") || "[]"));
  await page.fill("#oText", "I will end my life tonight"); await page.click("#swear");
  await page.waitForSelector("#crisisPanel", { timeout: 3000 }).catch(() => fail("safety", "no support panel for a worrying oath"));
  const oathsAfter = await page.evaluate(() => (localStorage.getItem("ironcouncil.oaths") || "[]"));
  ok(oathsBefore === oathsAfter, "safety", "a worrying text must not be saved as an oath");

  // council, counsel mode
  await go("#/council"); await page.waitForSelector("#cq").catch(() => fail("council", "no box"));
  await page.fill("#cq", "I keep procrastinating and I am scared of failing");
  await page.click("#cs");
  await page.waitForTimeout(2500);
  await checkPage("council");
  // debate mode
  await page.click('[data-mode="debate"]').catch(() => fail("council", "no debate switch"));
  await page.waitForTimeout(150);
  await page.fill("#cq", "Should I quit my job to start a business?");
  await page.click("#cs");
  await page.waitForTimeout(3000);
  await checkPage("debate");

  // oath, campaigns, journal, saved, forge
  await go("#/oath"); await checkPage("oath");
  const camps = await page.evaluate(() => [...document.querySelectorAll('a[href^="#/campaign/"]')].map((a) => a.getAttribute("href")));
  ok(camps.length >= 8, "oath", "expected >= 8 campaign links, found " + camps.length);
  for (const h of [...new Set(camps)]) { await go(h); await checkPage(h); }
  await go("#/journal"); await checkPage("journal");
  await go("#/saved"); await checkPage("saved");
  await go("#/forge"); await checkPage("forge");
  for (const id of ids) { await go("#/forge/" + id); await checkPage("forge " + id); }

  await browser.close();
  console.log("\n" + checks + " checks, " + fails.length + " failure(s)");
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
