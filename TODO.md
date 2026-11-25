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

- [x] **1.1 Turkish answers: the engine** (M). Detect whether a message is Turkish. Let every pool hold Turkish lines next to the English ones. Turkish messages get Turkish answers, and English stays as it is. Falls back to English where a Turkish line doesn't exist yet. (2026-11-25)
  - `Engine.detectLang` (72/73 Turkish and 136/136 English test messages right; English default when unsure). Pack key `tr` mirrors the English pools; forgeReply picks Turkish pools per pool and falls back to English. Safety message has a Turkish version (112 + findahelpline.com). New tests/lang.js (in CI). No real Turkish lines yet: that is 1.2–1.5. Other suites unchanged (run.js 355/363, smoke 227/227, content OK).
- [x] **1.2 Turkish answers: Mehmed, Atatürk, Atsız, Bilge Kağan, Timur, Rumi** (L). About 70 hand-written Turkish lines each: all 8 feelings, the main topics, greetings and closers. Written in Turkish, not machine-translated. (2026-11-25)
  - js/tr-<id>.js for the six: 74 hand-written Turkish lines each (4 per feeling ×8 + general, 1 per topic ×18, openers, principles, closers, again, pivots, greet/thanks/who). Question-about-him answers (17 subjects) and opinions of the others are in 1.5. Engine now answers a whole reply in one language (Turkish only if the main pool has Turkish, else English). Worth a native read-through for tone. Tests: run.js 355/363, lang OK, smoke 263/263 (adds a Turkish message), content OK (new Turkish column).
- [x] **1.3 Turkish answers: Vlad, Genghis, Attila, Musashi, Marcus Aurelius, the Black Swordsman** (L). Same as 1.2. (2026-11-25)
  - js/tr-<id>.js for the six, 74 lines each, same layout as 1.2 (the Swordsman's lines are deliberately terse). Worth a native read-through for tone. run.js 355/363, lang OK, smoke OK.
- [x] **1.4 Turkish answers: Leonidas, Hannibal, Joan, Napoleon, Nietzsche, Tesla** (L). Same as 1.2. (2026-11-25)
  - js/tr-<id>.js for the six, 74 lines each (Leonidas terse). All 18 members now have Turkish lines for feelings/topics/greetings. Worth a native read-through. Tests unchanged and passing (content.js now also checks Turkish lines for empties/English/tokens).
- [x] **1.5 Turkish answers for personal questions** (L). "Korkun var mı?", "Pişman mısın?" and the rest get Turkish answers about themselves, plus opinions of each other in Turkish. (2026-11-25)
  - js/tr2-<id>.js for all 18: one Turkish answer for each of the 17 personal subjects + general, and an opinion of each of the other 17 (612 lines). Engine: Turkish phrasings like "Zayıf yönün ne?", "Gurur duyduğun şey ne?", "Neye inanıyorsun?" are now recognised. One line per slot for now, so Turkish answers repeat sooner than the English ones; more lines per slot can be added to the same files. Needs a native read-through, especially the opinions. content.js now checks Turkish coverage; smoke 335/335.
- [x] **1.6 Follow-up messages** (M). Understand short replies that only make sense after the last answer, like "why?", "how?", "I tried that", "it didn't work", "yes / no", "neden?", "nasıl?", "denedim". The member answers the follow-up instead of starting over. (2026-11-25)
  - `Engine.detectFollowup` (why / how / tried / didn't work / yes / no / more, English and Turkish, only for short messages right after an answer). Replies are built from his own pools for the last feeling/topic plus a short lead-in per temper (iron/calm/fire) in English and Turkish; the language of the previous answer carries over for one-word Turkish replies. app.js passes the last answer's feeling/topic/language. New tests/followup.js (43 detection cases incl. 8 must-not-match, 252 replies across all 18 members), in CI. Not yet in Council/Debate/Oath chats, only the one-to-one chat.
- [x] **1.7 How strong the feeling is** (S). Tell "a bit tired" from "I can't go on". A heavy message gets a steadier, more serious answer; a light one gets a lighter push. (2026-11-25)
  - `Engine.detectIntensity` → light / normal / heavy (English + Turkish: qualifiers, absolute phrases, CAPS, !!!, stretched letters, "always/never" + a negative feeling). Heavy: gentle opener, no principle/battle-cry closer (unless you set the tone to Hard). Light: at most two lines. Shown in the "read as" label. tests/intensity.js (32 cases, in CI). run.js unchanged at 355/363.
- [x] **1.8 Feeling + topic answers** (L). Lines written for the 20 most common combinations, like "afraid + exam", "tired + work", "failed + love", "lazy + gym", instead of joining a feeling line and a topic line. (2026-11-25)
  - 20 combinations (afraid+study, tired+work, failed+love, lazy+training, afraid+work, failed+study, tired+study, lazy+study, alone+friends, alone+love, angry+family, angry+work, doubt+decision, lost+decision, failed+work, afraid+love, tired+family, lazy+phone, doubt+study, lost+study) × 18 members = 360 English lines in js/combo-<id>.js. Engine uses a combo line ~85% of the time when the message has exactly that feeling+topic (not for grief). Turkish combo lines are not written yet: Turkish messages fall back to the normal Turkish feeling/topic lines (the engine already supports `tr.combos`). content.js checks that all 20 exist. One line per combination for now.
- [ ] **1.9 Understanding round 2** (M). A new set of real messages (and any **Misread me** lists you send), fixes, and a fresh never-tuned test. Goal: 75%+ on unseen wording (now 62%).
  - Progress (2026-11-25): NOT done, goal not reached. Wrote three fresh blind sets (tests/holdout/cases-holdout5.js 101, 6: 99, 7: 80 messages, English + Turkish, written before running them). Honest unseen scores: set 5 = 52% before any change; set 6 = 51% with the old engine, 54% after the round-5 vocabulary; set 7 = 60% after rounds 5–6. Each set was then tuned on (round 5, 6, 7 vocabulary in js/engine.js: ROUND5_*, ROUND6_*, ROUND7_*), so they now read 81% / 77% / 73% and are regression sets; the main 363 went 355 → 357/363 and no older set got worse. The blind score only moves a few points per round because the engine is keyword-based, so more vocabulary has diminishing returns. To continue: (1) write a NEW blind set (holdout8) and measure it first; (2) consider a structural change (e.g. a small nearest-neighbour fallback against all labelled messages, or phrase patterns for "I can't …"/"what if …"); (3) no "Misread me" lists have arrived yet: send one and it goes through `node tests/run.js <file>.json`.
- [x] **1.10 Safety messages reviewed** (S). Recognise more ways of writing serious distress in both languages, and give the right help line for Türkiye and elsewhere. Test it so it can never be missed. (2026-11-25)
  - Detection rewritten (`Engine.isCrisis` / `crisisKind`): ~90 English and ~60 Turkish patterns on text folded to plain letters (so typed without Turkish letters works), plus typos ("diiie"), leet ("d1e"), slang (kys, unalive) and a list of harmless idioms. tests/safety.js: 132/132 worrying messages caught, 77/77 ordinary ones left alone, none of the 807 labelled test messages flagged; every member answers with the support message in chat, with a feeling chip pressed, and right after an answer. Help lines: Türkiye 112, US 988, UK/Ireland Samaritans 116 123, findahelpline.com elsewhere (the Turkish message also says call 112 or tell someone nearby). Also never saves or echoes a worrying text as an oath, goal, name, campaign focus or task (shows the message instead). Smoke test checks chat and oath. Please double-check the phone numbers for your region before merging; I have no internet access here to verify them.

## Phase 2 — The characters

- [ ] 🔒 **2.1 New members** (L). Add 6 new members with full training (about 250 lines each, every feeling, topic, personal subject and opinion of every other member). Every existing member also gets an opinion of each new one. **You choose who**, from the list of 50 or anyone else.
- [ ] **2.2 More stories** (L). 10 stories from each member's life (now fewer), grounded in real events, in their own voice.
  - Progress (2026-11-25): 17 of 18 members now have 10 stories; Atsız has 8 (js/story-<id>.js, 4 files per chunk; 72+54 new stories in total). Written from recorded events (Polybius/Livy, Herodotus, Plutarch, Priscus/Jordanes, the Secret History, Orkhon inscriptions, trial records, Nutuk, etc.); legends are marked "they say"/"tradition says"; the Swordsman's are fictional (original archetype). No web access here, so facts are from memory: a historian's read-through is worth doing. Atsız is short because I am not sure enough of further details of his life: see Questions.
- [x] **2.3 Source check** (M). Re-check every quote marked **sourced** against its source. Doubtful ones become **attributed**. Add the source line to the "Words" list where it's missing. (2026-11-25)
  - Re-checked all 19 quotes marked sourced (Atatürk 2, Musashi 2, Marcus 3, Bilge 3, Rumi 1, Leonidas 1, Hannibal 1, Attila 1, Joan 1, Nietzsche 4) against the works they cite (Nutuk/speeches, Go Rin no Sho, Meditations 10.16/5.20/5.1, Orkhon inscriptions, Masnavi I, Herodotus 7.228, Livy 22.51, Priscus, Joan's trial, Twilight of the Idols, Zarathustra, Gay Science). None needed downgrading (two were downgraded in the earlier pass); the Atatürk peace motto's source line now says honestly that the first occasion isn't pinned down. All 15 attributed quotes already have a source line explaining why they are only attributed, so no source line was missing. I have no web access: the check is from memory of the texts, so a second look by you on the Bilge/Orkhon and Rumi translations is still worth it.
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

5. **2.2** Atsız has 8 stories, the others 10. I only know the broad outline of his life and don't want to invent details. Do you want (a) two more written "in the spirit" and clearly marked as such, (b) you send me 2 episodes from his life to turn into stories, or (c) leave him at 8?

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
- 2026-11-25 — 1.1 done: language detection + Turkish pools with English fallback (content comes in 1.2–1.5).
- 2026-11-25 — 1.2 done: Turkish lines for Mehmed, Atatürk, Atsız, Bilge, Timur, Rumi.
- 2026-11-25 — 1.3 done: Turkish lines for Vlad, Genghis, Attila, Musashi, Marcus, the Swordsman.
- 2026-11-25 — 1.4 done: Turkish lines for Leonidas, Hannibal, Joan, Napoleon, Nietzsche, Tesla.
- 2026-11-25 — 1.5 done: Turkish personal answers + opinions for all 18.
- 2026-11-25 — 1.6 done: follow-up messages understood in chat.
- 2026-11-25 — 1.7 done: strength of feeling changes the answer.
- 2026-11-25 — Fixed a real bug found by the smoke test: leaving the Council page while members were still answering threw an error when the Save/Download buttons were wired (now looked up inside the council view, not the page).
- 2026-11-25 — 1.8 done: 20 feeling+topic combination lines per member (English; Turkish later).
- 2026-11-25 — 1.9 in progress: three blind sets written; unseen score ≈ 55–60% (was 62% on an earlier, easier set), tuned vocabulary rounds 5–7. Goal 75% unseen not yet reached.
- 2026-11-25 — 1.10 done: safety detection and messages reviewed; safety test in CI.
- 2026-11-25 — 2.2 in progress: 6 stories per member (54 new).
- 2026-11-25 — 2.2: 10 stories each for 17 members, 8 for Atsız (question 5).
- 2026-11-25 — 2.3 done: sourced quotes re-checked (none downgraded this time).
