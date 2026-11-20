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
- **Saved**: save any chat or council, read it later, continue it, or download it as a text file.
- **Forge**: train any character with your own beliefs, answers and lines (saved only in your browser).

## How it works
No AI and no server. Every character has a hand-written dossier of ~250 lines. A small engine reads the feeling, life topic and kind of question in your message and composes a fresh answer instantly. Real quotes are marked **sourced** or **attributed**; everything else is written in the spirit of the figure.

## Run locally
Open `index.html` in a browser, or run `node serve.js` and visit http://localhost:8080.

## Files
- `js/characters.js`, `js/c-*.js` — character dossiers
- `js/training-pack-*.js` — additional training
- `js/engine.js` — reads messages and composes answers
- `js/app.js` — the interface
- `eval.html` — accuracy test page (156 labeled messages)
