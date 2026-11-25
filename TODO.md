# The Iron Council — Full Upgrade Plan

The plan for upgrading the whole site. Claude's cloud routine works through it top to bottom, one session at a time.
Add your own tasks anywhere: `- [ ] what you want done`. Put the most important ones higher up.
Finished work goes to the `claude/auto-work` branch. **Nothing changes on the live site until you merge it into `main`.**

## How work continues between sessions (rules for Claude)

1. At the start of every session, read this file and do the **first unchecked task** (`- [ ]`) in order. Skip tasks marked 🔒 until the owner has answered their question.
2. Finish a task completely before starting the next. A task is done only when:
   - `node tests/run.js` passes (no new misses),
   - `eval.html` still scores 175/175 in a browser,
   - the smoke test passes (once task 0.1 exists),
   - and the change has been looked at on a phone-size screen when it touches the interface.
3. Check the task off: `- [x]`, with the date and commit, e.g. `(2026-11-26, a1b2c3d)`. Add one line to the **Progress log** at the bottom.
4. Commit and push to the `claude/auto-work` branch (create it from `main` if it doesn't exist; if `main` has moved on, merge `main` into it first). Never push to `main`: the owner reviews and merges.
5. If a session runs out mid-task, write `⏸ in progress: <what's done / what's left>` under the task and push, so the next session picks up exactly there.
6. Never lower a test score to make a task pass. Never change a test label without saying why in the commit.
7. Content rules stay: no real quote marked **sourced** unless the source is confirmed; everything else is written *in the spirit* of the figure; no photos or likenesses of real people.

Effort per task: **S** = part of a session · **M** = about one session · **L** = 2–3 sessions.

---

## Phase 0 — Safety net (so nothing breaks while everything changes)

- [x] **0.1 Smoke test for the whole site** (M). `tests/smoke.js` (Playwright) opens every page (Hall, a chat with every one of the 18 members, Council, Debate, Oath, Campaigns, Journal, Saved, Forge), sends a message where there's a box, and fails on any console error, empty answer, leftover `{placeholder}`, or broken layout at phone width. (2026-11-25)
  - `tests/smoke.js` added: 227 checks at 375px width (all 18 chats ×2 messages, Council, Debate, Oath + every campaign, Journal, Saved, Forge ×18); fails on console errors, empty answers, leftover tokens, overflow. Passes. Run: `node tests/smoke.js` (needs Playwright).
- [x] **0.2 Content checker** (S). `tests/content.js` checks every member has all 8 feelings, all 18 topics, all 17 personal subjects, opinions of every other member, stories, and no duplicate lines, empty lines or placeholders. It prints a coverage table. (2026-11-25)
  - `tests/content.js` added: coverage table + checks all 8 feelings, 18 topics, 17 personal subjects, 17 opinions, stories, 20+ other pools, empty lines, leftover placeholders (all pass). Found 351 duplicate lines in the merged training data; listed as warnings (`--all` lists them, `--strict` makes them fail). Cleaning them up is not done yet.
- [x] **0.3 Automatic checks on GitHub** (S). A GitHub Actions workflow runs tests 0.1, 0.2 and `tests/run.js` on every push. A red ✗ on GitHub means something broke. (2026-11-25)
  - `.github/workflows/checks.yml` runs run.js (baseline of 8 known misses via `MAX_MISSES=8`; new `MAX_MISSES` env var in tests/run.js), content.js and smoke.js on every push/PR. Not yet seen running on GitHub (couldn't trigger from here): check the Actions tab after merging.
- [x] **0.4 One file instead of 130** (M). The page loads ~130 separate script files. `tools/bundle.js` joins them into one `js/bundle.js` (re-run after each content change), so the site loads much faster on a phone, especially the first time. (2026-11-25)
  - `tools/bundle.js` joins 40 files into `js/bundle.js` (941 KB; page now loads 2 scripts instead of ~41). Verified TRAINING_PACK, CHARACTERS and CAMPAIGNS are identical (JSON hash) before and after. index.html and eval.html use it; tests/content.js uses the same source list; wire.js now just calls bundle.js; CI fails if the bundle is stale; cache bumped to v18 / sw v4. Smoke 227/227, content OK.
- [x] **0.5 Fonts stored with the site** (S). Keep the two fonts in the project instead of loading them from Google, so the app looks the same offline and loads faster. (2026-11-25)
  - 6 woff2 files (≈290 KB, variable fonts so weights share a file) in fonts/, css/fonts.css, Google links removed; the service worker precaches them. Checked in Chromium that the fonts load from disk; smoke 227/227.

## Phase 1 — Understanding you better

- [ ] **1.1 Turkish answers: the engine** (M). Detect whether a message is Turkish. Let every pool hold Turkish lines next to the English ones. Turkish messages get Turkish answers, and English stays as it is. Falls back to English where a Turkish line doesn't exist yet.
- [ ] **1.2 Turkish answers: Mehmed, Atatürk, Atsız, Bilge Kağan, Timur, Rumi** (L). About 70 hand-written Turkish lines each: all 8 feelings, the main topics, greetings and closers. Written in Turkish, not machine-translated.
- [ ] **1.3 Turkish answers: Vlad, Genghis, Attila, Musashi, Marcus Aurelius, the Black Swordsman** (L). Same as 1.2.
- [ ] **1.4 Turkish answers: Leonidas, Hannibal, Joan, Napoleon, Nietzsche, Tesla** (L). Same as 1.2.
- [ ] **1.5 Turkish answers for personal questions** (L). "Korkun var mı?", "Pişman mısın?" and the rest get Turkish answers about themselves, plus opinions of each other in Turkish.
- [ ] **1.6 Follow-up messages** (M). Understand short replies that only make sense after the last answer, like "why?", "how?", "I tried that", "it didn't work", "yes / no", "neden?", "nasıl?", "denedim". The member answers the follow-up instead of starting over.
- [ ] **1.7 How strong the feeling is** (S). Tell "a bit tired" from "I can't go on". A heavy message gets a steadier, more serious answer; a light one gets a lighter push.
- [ ] **1.8 Feeling + topic answers** (L). Lines written for the 20 most common combinations, like "afraid + exam", "tired + work", "failed + love", "lazy + gym", instead of joining a feeling line and a topic line.
- [ ] **1.9 Understanding round 2** (M). A new set of real messages (and any **Misread me** lists you send), fixes, and a fresh never-tuned test. Goal: 75%+ on unseen wording (now 62%).
- [ ] **1.10 Safety messages reviewed** (S). Recognise more ways of writing serious distress in both languages, and give the right help line for Türkiye and elsewhere. Test it so it can never be missed.

## Phase 2 — The characters

- [ ] 🔒 **2.1 New members** (L). Add 6 new members with full training (about 250 lines each, every feeling, topic, personal subject and opinion of every other member). Every existing member also gets an opinion of each new one. **You choose who**, from the list of 50 or anyone else.
- [ ] **2.2 More stories** (L). 10 stories from each member's life (now fewer), grounded in real events, in their own voice.
- [ ] **2.3 Source check** (M). Re-check every quote marked **sourced** against its source. Doubtful ones become **attributed**. Add the source line to the "Words" list where it's missing.
- [ ] **2.4 More rivalries and friendships** (S). More pairs who react to each other in the Council (e.g. Rumi and Nietzsche, Joan and Napoleon, Tesla and the Swordsman).
- [ ] **2.5 Emblems** (M). Replace the letter-monograms with an original drawn emblem for each member (SVG: a crescent, a sword, a lightning coil…). Symbols only, no faces.

## Phase 3 — New features

- [ ] **3.1 Mood calendar** (M). A page showing how you've felt day by day (from chats and the journal), with your oath streak alongside. All on your device.
- [ ] **3.2 Share an answer as a picture** (M). Turn any answer into a quote card image (member's colour, emblem, the words) to save or send from your phone.
- [ ] 🔒 **3.3 Read aloud** (S). A ▶ button that reads an answer aloud with the phone's built-in voice, so nothing extra is needed. **Do you want this?**
- [ ] **3.4 Settings page** (M). Default tone, text size, reduce animations, language, and a "delete everything" button, all in one place.
- [ ] **3.5 Search** (S). Search your saved conversations and journal.
- [ ] **3.6 Weekly review** (M). Once a week, a member you choose looks back at your week (feelings, oaths kept, journal) and answers it in their voice.
- [ ] **3.7 Campaigns, more of them** (L). 4 more 14-day campaigns (e.g. Joan: courage, Tesla: deep work, Leonidas: endurance, Rumi: patience), and a progress view for each.
- [ ] 🔒 **3.8 Daily reminder** (M). A daily nudge to swear your oath. This only works reliably on Android with the app installed; on iPhone it's limited. **Do you want this?**

## Phase 4 — Design, speed and polish

- [ ] 🔒 **4.1 Whole interface in Turkish** (L). A TR/EN switch for every button, label and page text (not the characters' answers, which are Phase 1). **Do you want this?**
- [ ] **4.2 Accessibility** (M). Works with the keyboard alone, clear focus outlines, labels for screen readers, enough contrast everywhere, and answers read correctly by screen readers.
- [ ] **4.3 Phone polish** (M). Go through every page on a small phone: tap sizes, spacing, the keyboard not covering the text box, iPhone notch and bottom bar.
- [ ] **4.4 Speed** (S). Measure with Lighthouse on mobile. Target 90+ on performance, accessibility and best practices, and fix what it finds.
- [ ] **4.5 "How it works" page** (S). A short page explaining that there is no AI and no server, how the members were written, what **sourced** and **attributed** mean, and that everything stays on your device.

## Phase 5 — Finish

- [ ] **5.1 Full test pass** (M). Every test, every page on phone and desktop, offline mode, backup and restore between two browsers.
- [ ] **5.2 README and screenshots** (S). Up-to-date README with phone and desktop screenshots, and a changelog of everything in this plan.

---

## Questions for the owner (🔒 tasks wait for these)

Claude writes here when a task needs your decision. Answer under the question.

1. **2.1** Which 6 new members?
2. **3.3** Read-aloud button: yes or no?
3. **3.8** Daily reminder (works mainly on Android): yes or no?
4. **4.1** Whole interface in Turkish too: yes or no?

## Earlier task list (merged from the previous TODO; unticked ones are covered by the plan above)

- [x] Run eval.html and fix the engine until accuracy improves; add 100 more test messages
  - Added 104 fresh messages (tests/holdout/cases-holdout4.js, also in eval.html, now 279). Fresh-set baseline was 59%; added generic mood/topic vocabulary in js/engine.js (ROUND4_*): main suite 352→355/363, holdout 3: 62%→95%, holdout 4: 59%→91%. Note both holdouts were tuned on afterwards, so they are now regression sets; remaining misses are mostly ambiguous topic labels.
- [x] Merge the ~130 small training files into one per character (load faster, easier to manage)
  - 105 t3-/t4-/t5-/t6-/t7-/training-pack-9 files became 18 js/train-<id>.js files (page scripts 128 → 41). Verified the resulting TRAINING_PACK is byte-identical (JSON, incl. line order) to before. The c-*.js character files and training-pack*.js (1–8) were left as they are; tools/wire.js updated; cache bumped to v17.
- [x] Check every quote marked "sourced" for accuracy; downgrade any that can't be confirmed
  - Checked all 21 "sourced" quotes against what is known of the works (Meditations, Twilight of the Idols, Zarathustra, Gay Science, Five Rings, Orkhon inscriptions, Livy, Herodotus, Priscus, Joan's trial). 2 downgraded to "attributed": Atatürk's Gallipoli "I order you to die" (wording unconfirmed in a contemporary record) and Musashi's Dokkōdō line (authorship debated). Atatürk's Samsun line stays sourced, with its source note now saying it is the short form of the 22 Sep 1924 speech. I have no web access here, so the check is from memory of the texts: worth a second look by you on the Rumi, Bilge Kağan and Maharbal lines (translations are modern renderings).
- [ ] Better Turkish replies: make every character answer properly in Türkçe
- [ ] Add 3 new campaigns
- [ ] Add 2–3 new council members
- [ ] Add a weekly summary page: oaths kept, streaks, bond changes
- [ ] Test on a phone-sized screen and fix layout problems


## Progress log

- 2026-11-25 — Plan written and approved (voice check removed at the owner's request). Replaces the earlier 8-task list; all 8 of its tasks are covered here.
- 2026-11-25 — 0.1 done: tests/smoke.js (227 checks, all pass); run.js still 355/363.
- 2026-11-25 — 0.2 done: tests/content.js (all 18 members complete; 351 duplicate-line warnings to clean up later).
- 2026-11-25 — 0.3 done: GitHub Actions workflow added (untested on GitHub itself).
- 2026-11-25 — 0.4 done: js/bundle.js (remember `node tools/bundle.js` after editing any js file).
- 2026-11-25 — 0.5 done: fonts stored locally. Phase 0 complete.
