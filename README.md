# The Iron Council

People of every era who held one idea and would not let go of it — answering you in their own voice.

**Live site:** https://furkanork.github.io/iron-council/

## The Council (18 members)
Mehmed II · Vlad III · Mustafa Kemal Atatürk · Nihal Atsız · Miyamoto Musashi · Marcus Aurelius · Genghis Khan · The Black Swordsman (original archetype) · Bilge Kağan · Mevlana Rumi · Timur · Leonidas I · Hannibal Barca · Attila · Joan of Arc · Napoleon Bonaparte · Friedrich Nietzsche · Nikola Tesla

## What it does
- **Chat** with any member: tell them what you're facing (English or Türkçe) and they answer from their own position.
- **Ask about them**: their feelings, fears, regrets, love, death, and what they think of each other.
- **Council**: ask one question; up to four members answer in turn, react to each other (agree or push back), and can be told to answer each other in a second round.
- **Follow-ups**: short replies that only make sense after his last answer ("why?", "how?", "I tried that", "it didn't work", "yes", "no", "tell me more"; "neden?", "nasıl?", "denedim", "olmadı", "evet", "hayır", "devam et") are answered as follow-ups, in his voice, about the same feeling and topic, instead of being read as a new message.
- **How strong**: "a bit tired" gets a short, light nudge; "I can't go on" (or shouting, "!!!", "dayanamıyorum") gets the steadier gentle voice and no battle-cry closer. Shown as "heavy" / "light" under the answer.
- **Feeling + topic lines**: for the 20 most common pairs (afraid + study, tired + work, failed + love, lazy + training, alone + friends…) every member has a line written for exactly that pair, used most of the time instead of joining a feeling line to a topic line. Shown under the answer as the usual "read as" label.
- **Safety**: messages that sound like suicide or self-harm (English or Türkçe, with typos, slang or without Turkish letters) get a plain support message instead of a character's answer, with the help lines for Türkiye (112), the US (988), the UK/Ireland (Samaritans 116 123) and findahelpline.com elsewhere. This also applies in the Council, Debate, Journal, and to oaths, goals, names and campaign focus, which are never saved or echoed back when they sound like that.
- **Memory**: tell any of them "my name is …" or "my goal is …". They use your name, and on a new day they bring up what you last talked about or ask about your goal.
- **Oath**: swear one task a day before one member. Next time they ask whether you kept it, react to the answer, and keep your streak.
- **Stories**: ask any of them for a story ("tell me a story", "bir hikaye anlat") and they tell one from their life.
- **Bond**: each of them forms an opinion of you — Cold, Stranger, Respect, Trusted — from your visits, the oaths you keep or break, and whether you keep repeating the same complaint. It shows in how they greet and speak to you.
- **Tone**: in each chat, set them to Gentle, Normal or Hard.
- **Rivals and friends**: members with real history or a strong contrast (Mehmed and Vlad, Hannibal and Napoleon, Timur and Genghis, Rumi and Nietzsche, Tesla and the Swordsman, Atatürk and Napoleon, Marcus and Hannibal, Joan and Nietzsche…: 24 pairs) speak to each other about it in the Council.
- **They ask you back**: sometimes a member ends with a question ("What exactly scares you about it?") and takes your next message as the answer.
- **Campaigns** (Oath page): 14-day programs led by one member — Musashi (discipline), Napoleon (exam study), Leonidas (body), Marcus (mind), Tesla (finish a project). Each day's task becomes that day's oath.
- **Council debate**: switch the Council to Debate, ask a yes-or-no choice; they split into for and against, argue, answer the other side, and each gives a verdict. The count is shown at the end.
- **Mood calendar** (Mood page): a month grid coloured by the feeling you brought most each day (from chats, plus Journal entries read back through the engine), with ✓/✗ for oaths kept or broken, your oath streak, and a tap-a-day summary. The log (`ironcouncil.moods`) starts when you update; it is only on your device.
- **Share as a picture**: the **▣ Picture** button under any chat answer makes a 1080×1350 quote card (member's colour, emblem, the words, name) and shares it through the phone's share sheet, or downloads a PNG.
- **Settings** (Settings page): default tone (a member's own tone still wins), text size, reduce animations, answer language (automatic / always English / always Türkçe), and a **Delete everything** button (two confirmations). Saved as `ironcouncil.settings`, only on your device.
- **Search** (Search page): find a word in your saved conversations, current chats and journal (ignores case and Turkish accents, shows the matching line with the word marked, links to the place).
- **Weekly review** (Week page): pick a member and he looks back at your last seven days — oaths kept/broken, streak, journal entries, the feelings you brought most — and answers in his own voice (an oath-verdict line, a line for your main feeling, a closer; respects your tone and language settings). Past reviews are kept on the page (`ironcouncil.weekly`).
- **Accessibility**: works by keyboard alone (skip link, gold focus outline on every control, chips report on/off state), controls and fields all have names, the chat is a polite live region so screen readers read new answers, each page sets the tab title and moves focus to the page, small red text uses a lighter red for contrast (5.6:1), and animations stop with the system "reduce motion" setting or Settings. The smoke test checks names, titles and the focus outline on every page. Not yet tried with a real screen reader.
- **Phone**: the page runs edge to edge and keeps clear of the notch and home bar (`viewport-fit=cover`, safe-area padding); on touch screens every button, chip, select and nav link is at least 44px tall; the nav is one scrolling row that keeps the current page in view; a field that gets focus is scrolled into view so the keyboard does not cover it; the Search box does not pop the keyboard open by itself. Checked in headless Chromium at 320 and 360 px with touch emulation (not on a real phone).
- **Speed**: Lighthouse (mobile, simulated slow 4G, local server with gzip like the live site) scores Performance 97, Accessibility 100, Best practices 100, SEO 100 on the Hall. The page ships a static first screen inside `index.html` so something paints before the 1.2 MB script bundle (about 430 KB gzipped) has run; the scripts are `defer`red; `serve.js` gzips text files.
- **Journal**: write about your day; the member you choose reads it and answers.
- **Campaigns** also include Joan's The Standard (courage), Tesla's The Quiet Laboratory (deep work), Leonidas's The Hot Gates (endurance) and Rumi's The Patient Garden (patience); every campaign page now has a progress bar for the run in progress and a list of past runs. Before that:  Atatürk's Reading Campaign, Rumi's Fourteen Days of Calm and Genghis's Discipline of the Steppe.
- **Backup** (Saved page): download everything in one file and restore it on another device or browser; restoring merges, nothing is lost.
- **Saved**: save any chat or council, read it later, continue it, or download it as a text file.
- **Misread me**: if a member reads your message wrong, press **✎ Misread me** under the answer and pick what you meant (feeling and topic). That message — and ones worded almost the same — is read your way from then on, by every member. The list is on the Saved page; download it to have it trained into the engine for everyone.
- **Forge**: train any character with your own beliefs, answers and lines (saved only in your browser).

## On your phone
Open https://furkanork.github.io/iron-council/ on the phone, then:
- **iPhone (Safari):** Share button → **Add to Home Screen**.
- **Android (Chrome):** ⋮ menu → **Add to Home screen** / **Install app**.

It gets its own icon, opens full-screen like an app, and works offline after the first visit. Your chats and oaths are kept on that phone; use **Saved → Backup** to move them between devices.

## Turkish answers
The engine detects whether a message is Turkish (`Engine.detectLang`: Turkish letters, common words and endings; English is the default when unsure, and Turkish typed without Turkish letters is recognised too). A member's Turkish lines live in the `tr` key of his training pack, with the same shape as the English pools (`counsel`, `topics`, `about`, `opinions`, `intents`, `askBack`, `openers`, `principles`, `closers`, `again`, `pivots`, `gentle`, `hard`, `heard`, `bondWarm`, `bondCold`). A Turkish message uses a Turkish pool when it has lines and falls back to the English pool when it doesn't, so members can be translated pool by pool. The safety message is also answered in Turkish. Council reactions, oaths, stories and journal replies are still English-only.

## How it works
No AI and no server. Every character has a hand-written dossier of ~250 lines. A small engine reads the feeling, life topic and kind of question in your message and composes a fresh answer instantly. Real quotes are marked **sourced** or **attributed**; everything else is written in the spirit of the figure.

## Run locally
Open `index.html` in a browser, or run `node serve.js` and visit http://localhost:8080.

## Files
- `fonts/` + `css/fonts.css` — Cinzel and EB Garamond (OFL licence), latin + latin-ext subsets (latin-ext holds the Turkish letters), stored with the site; nothing is loaded from Google
- `js/emblems.js` — an original drawn SVG emblem per member (crescent over a wall, stake, sun, wolf, crossed swords, column, nine-tailed standard, slab sword, standing stone, spiral, three rings, lambda shield, Punic sign, planted sword, banner, bee, mountain and star, lightning bolt); symbols only, no faces; letter monograms remain as fallback
- `js/bundle.js` — GENERATED single file (all of the files below except app.js) that the page loads. After changing any of them run `node tools/bundle.js` (also run by CI check: a stale bundle fails it). Cache version in index.html/eval.html is bumped with `?v=`.
- `js/characters.js`, `js/c-*.js` — character dossiers
- `js/training-pack*.js` — first training rounds
- `js/campaigns*.js` — the 12 campaigns (`campaigns-3.js` holds courage, deep work, endurance, patience)
- `js/rivals-<id>.js` — more pairs who speak to each other in the Council (`rivals` in the pack)
- `js/story-<id>.js` — more stories from his life (added to the three in the main pack)
- `js/combo-<id>.js` — his 20 feeling + topic combination lines (`combos` in the pack, keyed `feeling+topic`)
- `js/tr-<id>.js` — a member's Turkish lines (`tr` key of his pack); written so far for all 18 members (feelings, topics, openers, principles, closers, greetings); `tr2-<id>.js` adds the answers about himself (feelings, fears, regrets, love, death…) and his opinion of each other member
- `js/train-<id>.js` — one merged training file per character (rounds 3–7 and council opinions); new files are picked up by `node tools/bundle.js` automatically
- `js/engine.js` — reads messages and composes answers
- `js/app.js` — the interface
- `eval.html` — accuracy test page in the browser (279 labeled messages)
- `tests/smoke.js` — Playwright smoke test of every page at phone width (`node tests/smoke.js`)
- `tests/safety.js` — checks that every worrying message (132 EN/TR cases) is caught and 77 ordinary ones (idioms like "dying to see you", "gülmekten öldüm") are not (`node tests/safety.js`)
- `tests/intensity.js` — checks light / normal / heavy detection (`node tests/intensity.js`)
- `tests/followup.js` — checks follow-up detection and replies (`node tests/followup.js`)
- `tests/lang.js` — checks language detection (Turkish vs English) and the Turkish-answer fallback (`node tests/lang.js`)
- `tests/content.js` — checks every member is fully written and prints a coverage table (`node tests/content.js`)
- `tests/` — `node tests/run.js` checks 363 everyday messages (English, Turkish, slang, typos, Turkish without Turkish letters). `tests/holdout/` holds sets kept apart from tuning (rounds 3–7; 5, 6 and 7 were written blind in task 1.9 and then tuned on) — the honest measure for wording the engine hasn't seen (round 3: 95%, round 4: 91% after tuning, from 62% and 59% before; write a new holdout file for the next blind measurement). `node tests/run.js iron-council-misreads-….json` tests a downloaded Misread list.
