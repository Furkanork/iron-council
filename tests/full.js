/*
 * Full pass extras (task 5.1), over a real http server:
 *   node tests/full.js
 * 1. every page at desktop width (smoke.js with VIEWPORT=1280x800)
 * 2. offline: after one visit the service worker serves the whole site with no network, and chat still answers
 * 3. backup and restore between two separate browsers (clean profiles): chats, oaths, journal, settings survive
 * Needs playwright (like smoke.js). Starts serve.js itself on port 8099.
 */
const { spawn, spawnSync } = require("child_process");
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) { console.error("playwright is not installed"); process.exit(2); }
const root = path.resolve(__dirname, "..");
const PORT = 8099, BASE = `http://localhost:${PORT}/`;
let fails = 0, checks = 0;
const ok = (c, what) => { checks++; if (!c) { fails++; console.log("  ✗ " + what); } else console.log("  ✓ " + what); };

(async () => {
  const srv = spawn("node", ["serve.js"], { cwd: root, env: { ...process.env, PORT: String(PORT) }, stdio: "ignore" });
  await new Promise((r) => setTimeout(r, 800));
  try {
    // 1. desktop width
    console.log("Desktop width");
    const r = spawnSync("node", ["tests/smoke.js"], { cwd: root, env: { ...process.env, VIEWPORT: "1280x800", BASE }, encoding: "utf8" });
    const last = (r.stdout || "").trim().split("\n").pop();
    ok(r.status === 0, "every page at 1280x800 (" + last + ")");

    const browser = await chromium.launch();
    // 2. offline
    console.log("Offline");
    {
      const ctx = await browser.newContext({ serviceWorkers: "allow" });
      const page = await ctx.newPage();
      await page.goto(BASE);
      await page.waitForSelector(".card");
      await page.evaluate(() => navigator.serviceWorker.ready);
      await page.waitForFunction(async () => (await caches.keys()).length > 0 && (await (await caches.open((await caches.keys())[0])).keys()).length > 20, null, { timeout: 15000 });
      await page.reload(); await page.waitForSelector(".card");   // now controlled by the worker
      await ctx.setOffline(true);
      await page.reload();
      await page.waitForSelector(".card", { timeout: 10000 }).catch(() => {});
      ok(await page.evaluate(() => document.querySelectorAll(".card").length === 18), "Hall opens offline with all 18 members");
      await page.evaluate(() => (location.hash = "#/c/marcus"));
      await page.waitForSelector("#q");
      await page.fill("#q", "I am afraid I will fail my exam"); await page.click("#send");
      await page.waitForFunction(() => document.querySelectorAll("#log .msg.char").length > 0 && !document.querySelector("#log .msg.typing"), null, { timeout: 8000 }).catch(() => {});
      ok(await page.evaluate(() => { const m = [...document.querySelectorAll("#log .msg.char .body")].pop(); return !!m && m.innerText.length > 20; }), "a member answers offline");
      for (const h of ["#/council", "#/oath", "#/journal", "#/mood", "#/weekly", "#/search", "#/settings", "#/about"]) {
        await page.evaluate((x) => (location.hash = x), h); await page.waitForTimeout(100);
        ok(await page.evaluate(() => document.getElementById("app").innerText.trim().length > 40), "offline page " + h);
      }
      await ctx.close();
    }

    // 3. backup and restore between two clean browsers
    console.log("Backup and restore");
    {
      const a = await (await browser.newContext({ acceptDownloads: true })).newPage();
      await a.goto(BASE); await a.waitForSelector(".card");
      await a.evaluate(() => (location.hash = "#/c/rumi")); await a.waitForSelector("#q");
      await a.fill("#q", "I feel lost and alone"); await a.click("#send");
      await a.waitForFunction(() => document.querySelectorAll("#log .msg.char").length > 0 && !document.querySelector("#log .msg.typing"), null, { timeout: 8000 });
      await a.evaluate(() => (location.hash = "#/journal")); await a.waitForSelector("#jText");
      await a.fill("#jText", "Today I walked for an hour and thought about my plans."); await a.click("#jWrite");
      await a.evaluate(() => (location.hash = "#/settings")); await a.waitForSelector("#sSize"); await a.selectOption("#sSize", "large");
      await a.evaluate(() => (location.hash = "#/saved")); await a.waitForSelector("#bk");
      const [dl] = await Promise.all([a.waitForEvent("download"), a.click("#bk")]);
      const file = path.join(require("os").tmpdir(), "ic-backup-test.json");
      await dl.saveAs(file);
      const mine = await a.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("ironcouncil.")).length);
      ok(mine >= 3, "browser A has data to back up (" + mine + " keys)");

      const b = await (await browser.newContext()).newPage();
      await b.goto(BASE); await b.waitForSelector(".card");
      ok(await b.evaluate(() => !Object.keys(localStorage).some((k) => k.startsWith("ironcouncil.") && !k.startsWith("ironcouncil.seen"))), "browser B starts clean");
      await b.evaluate(() => (location.hash = "#/saved")); await b.waitForSelector("#rs", { state: "attached" });
      await b.setInputFiles("#rs", file); await b.waitForTimeout(400);
      ok(await b.evaluate(() => (JSON.parse(localStorage.getItem("ironcouncil.chat.rumi") || "[]")).some((m) => /lost and alone/.test(m.content))), "chat with Rumi restored");
      ok(await b.evaluate(() => /walked for an hour/.test(localStorage.getItem("ironcouncil.journal") || "")), "journal restored");
      ok(await b.evaluate(() => (JSON.parse(localStorage.getItem("ironcouncil.settings") || "{}")).size === "large"), "settings restored");
      // restoring twice merges, it does not duplicate
      const before = await b.evaluate(() => JSON.parse(localStorage.getItem("ironcouncil.chat.rumi")).length);
      await b.setInputFiles("#rs", file); await b.waitForTimeout(400);
      ok(await b.evaluate(() => JSON.parse(localStorage.getItem("ironcouncil.chat.rumi")).length) === before, "restoring the same file again does not duplicate the chat");
    }
    await browser.close();
  } finally { srv.kill(); }
  console.log(`\n${checks} checks, ${fails} failure(s)`);
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
