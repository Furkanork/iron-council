# The Iron Council

People of every era who held one idea and would not let go of it — answering you in their own voice.

**Live site:** https://furkanork.github.io/iron-council/

## The Council (18 members)
Mehmed II · Vlad III · Mustafa Kemal Atatürk · Nihal Atsız · Miyamoto Musashi · Marcus Aurelius · Genghis Khan · The Black Swordsman (original archetype) · Bilge Kağan · Mevlana Rumi · Timur · Leonidas I · Hannibal Barca · Attila · Joan of Arc · Napoleon Bonaparte · Friedrich Nietzsche · Nikola Tesla

## What it does
- **Chat** with any member: tell them what you're facing (English or Türkçe) and they answer from their own position.
- **Ask about them**: their feelings, fears, regrets, love, death, and what they think of each other.
- **Council**: ask one question; up to four members answer in turn, react to each other (agree or push back), and can be told to answer each other in a second round.
- **Memory**: tell any of them "my name is …" or "my goal is …". They use your name, and on a new day they bring up what you last talked about or ask about your goal.
- **Oath**: swear one task a day before one member. Next time they ask whether you kept it, react to the answer, and keep your streak.
- **Stories**: ask any of them for a story ("tell me a story", "bir hikaye anlat") and they tell one from their life.
- **Bond**: each of them forms an opinion of you — Cold, Stranger, Respect, Trusted — from your visits, the oaths you keep or break, and whether you keep repeating the same complaint. It shows in how they greet and speak to you.
- **Tone**: in each chat, set them to Gentle, Normal or Hard.
- **Rivals**: members with real history (Mehmed and Vlad, Hannibal and Napoleon, Timur and Genghis, …) speak to each other about it in the Council.
- **They ask you back**: sometimes a member ends with a question ("What exactly scares you about it?") and takes your next message as the answer.
- **Campaigns** (Oath page): 14-day programs led by one member — Musashi (discipline), Napoleon (exam study), Leonidas (body), Marcus (mind), Tesla (finish a project). Each day's task becomes that day's oath.
- **Council debate**: switch the Council to Debate, ask a yes-or-no choice; they split into for and against, argue, answer the other side, and each gives a verdict. The count is shown at the end.
- **Journal**: write about your day; the member you choose reads it and answers.
- **Campaigns** also include Atatürk's Reading Campaign, Rumi's Fourteen Days of Calm and Genghis's Discipline of the Steppe.
- **Backup** (Saved page): download everything in one file and restore it on another device or browser; restoring merges, nothing is lost.
- **Saved**: save any chat or council, read it later, continue it, or download it as a text file.
- **Misread me**: if a member reads your message wrong, press **✎ Misread me** under the answer and pick what you meant (feeling and topic). That message — and ones worded almost the same — is read your way from then on, by every member. The list is on the Saved page; download it to have it trained into the engine for everyone.
- **Forge**: train any character with your own beliefs, answers and lines (saved only in your browser).

## On your phone
Open https://furkanork.github.io/iron-council/ on the phone, then:
- **iPhone (Safari):** Share button → **Add to Home Screen**.
- **Android (Chrome):** ⋮ menu → **Add to Home screen** / **Install app**.

It gets its own icon, opens full-screen like an app, and works offline after the first visit. Your chats and oaths are kept on that phone; use **Saved → Backup** to move them between devices.

## How it works
No AI and no server. Every character has a hand-written dossier of ~250 lines. A small engine reads the feeling, life topic and kind of question in your message and composes a fresh answer instantly. Real quotes are marked **sourced** or **attributed**; everything else is written in the spirit of the figure.

## Run locally
Open `index.html` in a browser, or run `node serve.js` and visit http://localhost:8080.

## Files
- `js/characters.js`, `js/c-*.js` — character dossiers
- `js/training-pack-*.js` — additional training
- `js/engine.js` — reads messages and composes answers
- `js/app.js` — the interface
- `eval.html` — accuracy test page in the browser (175 labeled messages)
- `tests/` — `node tests/run.js` checks 363 everyday messages (English, Turkish, slang, typos, Turkish without Turkish letters). `tests/holdout/` is a set the engine is never tuned on — the honest measure for wording it hasn't seen. `node tests/run.js iron-council-misreads-….json` tests a downloaded Misread list.
