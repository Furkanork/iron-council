/*
 * EMBLEMS: an original drawn symbol for each member, replacing the letter monograms. Symbols only: no faces, no likenesses.
 * Each entry is SVG markup for a 48x48 box drawn with the current colour (stroke and fill use currentColor).
 */
(function () {
  const rays = (n, r1, r2, cx = 24, cy = 24) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return `M${(cx + r1 * Math.cos(a)).toFixed(1)} ${(cy + r1 * Math.sin(a)).toFixed(1)}L${(cx + r2 * Math.cos(a)).toFixed(1)} ${(cy + r2 * Math.sin(a)).toFixed(1)}`; }).join("");
  const spiral = (turns, cx = 24, cy = 24, r = 19) => { const pts = []; const steps = turns * 28; for (let i = 0; i <= steps; i++) { const t = i / steps, a = t * turns * Math.PI * 2, rr = 2 + t * (r - 2); pts.push(`${i ? "L" : "M"}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`); } return pts.join(""); };
  const tails = Array.from({ length: 9 }, (_, i) => `M${14 + i * 3} 15v${15 + (i % 2) * 4}`).join("");
  const S = (d, extra = "") => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const F = (d, extra = "") => `<path d="${d}" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" ${extra}/>`;
  window.EMBLEMS = {
    // a crescent over a city wall
    mehmed: F("M27 5A13 13 0 1 0 27 31A10 10 0 1 1 27 5Z") + S("M6 44V35h5v3h5v-3h5v3h5v-3h5v3h5v-3h5v3h5v-3h5v9z"),
    // an upright stake with a ring at its foot
    vlad: F("M24 4l5 13h-10z") + S("M24 17v26M13 43h22") + S("M24 28m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0", 'stroke-width="2"'),
    // a rising sun
    ataturk: F("M24 24m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0") + S(rays(16, 11, 19), 'stroke-width="2.4"'),
    // a wolf's head
    atsiz: S("M10 8l8 8h12l8-8v16l-6 8-4 9h-8l-4-9-6-8z") + F("M19 23m-1.8 0a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0") + F("M29 23m-1.8 0a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0") + F("M21 34h6l-3 4z"),
    // two crossed swords
    musashi: S("M7 41L38 10M41 41L10 10M10 30l8 8M38 30l-8 8"),
    // a column
    marcus: S("M12 9h24M15 13h18M19 13v25M29 13v25M15 38h18M11 42h26"),
    // a spear with nine hanging tails
    genghis: F("M24 2l4 8h-8z") + S("M24 10v35M12 15h24") + S(tails, 'stroke-width="1.8"'),
    // a heavy slab of a sword
    swordsman: S("M14 40L34 9l6 4-20 31zM8 44l7-7M13 33l8 5"),
    // a standing stone with carved lines
    bilge: S("M14 44V16c0-8 20-8 20 0v28zM9 44h30M19 22h10M19 28h10M19 34h10"),
    // a spiral, a turning
    rumi: S(spiral(3)),
    // three rings
    timur: S("M24 14m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0M15 31m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0M33 31m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"),
    // a shield with a lambda
    leonidas: S("M24 24m-19 0a19 19 0 1 0 38 0a19 19 0 1 0 -38 0") + S("M15 35L24 13l9 22", 'stroke-width="3.4"'),
    // a Punic sign: circle, bar and triangle
    hannibal: S("M24 10m-4.5 0a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0M10 22h28M10 22v-5M38 22v-5M17 22L11 43h26L31 22"),
    // a sword planted in the ground
    attila: S("M16 11h16M24 3v8M21 11v27l3 5 3-5V11M9 45h30"),
    // a swallow-tailed banner
    joan: S("M13 3v43M13 8h25l-5 8 5 8H13M21 12v9M17 16h8"),
    // a bee
    napoleon: S("M24 28m-5.5 0a5.5 9 0 1 0 11 0a5.5 9 0 1 0 -11 0M18.8 25h10.4M18.5 31h11M24 15m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0") + S("M17 22C8 18 6 11 12 10c5 0 7 7 7 11M31 22c9-4 11-11 5-12-5 0-7 7-7 11"),
    // a mountain under a star
    nietzsche: S("M4 42L18 19l8 12 6-8 12 19z") + F("M36 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"),
    // a lightning bolt
    tesla: F("M29 3L11 27h11l-4 18 19-25H26z"),
  };
  // The emblem as an <svg>, or the letter monogram if a member has none.
  window.emblem = (c, size) => {
    const e = window.EMBLEMS[c.id];
    return e ? `<svg class="emb" viewBox="0 0 48 48" role="img" aria-label="${c.name} emblem"${size ? ` width="${size}" height="${size}"` : ""}>${e}</svg>` : (c.monogram || "");
  };
})();
