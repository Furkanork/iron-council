# To-do list

Claude's cloud routine works through this list top to bottom, ticks off what it finishes and adds a short note.
Add tasks anywhere: `- [ ] what you want done`. Put the most important ones at the top.
Its work goes to the `claude/auto-work` branch. Nothing changes on the live site until you merge it.

## Tasks

- [x] Run eval.html and fix the engine until accuracy improves; add 100 more test messages
  - Added 104 fresh messages (tests/holdout/cases-holdout4.js, also in eval.html, now 279). Fresh-set baseline was 59%; added generic mood/topic vocabulary in js/engine.js (ROUND4_*): main suite 352→355/363, holdout 3: 62%→95%, holdout 4: 59%→91%. Note both holdouts were tuned on afterwards, so they are now regression sets; remaining misses are mostly ambiguous topic labels.
- [x] Merge the ~130 small training files into one per character (load faster, easier to manage)
  - 105 t3-/t4-/t5-/t6-/t7-/training-pack-9 files became 18 js/train-<id>.js files (page scripts 128 → 41). Verified the resulting TRAINING_PACK is byte-identical (JSON, incl. line order) to before. The c-*.js character files and training-pack*.js (1–8) were left as they are; tools/wire.js updated; cache bumped to v17.
- [ ] Check every quote marked "sourced" for accuracy; downgrade any that can't be confirmed
- [ ] Better Turkish replies: make every character answer properly in Türkçe
- [ ] Add 3 new campaigns
- [ ] Add 2–3 new council members
- [ ] Add a weekly summary page: oaths kept, streaks, bond changes
- [ ] Test on a phone-sized screen and fix layout problems

## Questions for you

(Claude writes here when a task needs your decision. Answer under the question.)
