/*
 * FORGE ENGINE — instant, offline, no AI.
 *  1. Reads your message for a FEELING (tired, failed, afraid...) and a TOPIC (exam, gym, love...).
 *  2. Uses an answer you taught for a similar question, if there is one.
 *  3. Otherwise composes a fresh answer: the character's take on that topic + on that feeling,
 *     framed by his opener/principle/closer. Recently used lines are avoided (even across visits).
 *  Everything you teach in the Forge page is merged in.
 */
(function () {
  const MOODS = ["tired", "failed", "afraid", "lazy", "alone", "lost", "angry", "doubt"];
  const TOPICS = ["decision", "envy", "study", "training", "work", "money", "love", "family", "phone", "sleep", "creative", "friends", "time", "health", "habits"];

  const MOOD_LABELS = {
    tired: "I'm exhausted", failed: "I failed", afraid: "I'm afraid", lazy: "I can't start",
    alone: "I feel alone", lost: "I'm lost", angry: "I'm angry", doubt: "I doubt myself", general: "Just speak"
  };
  const MOOD_SHORT = { tired: "exhaustion", failed: "defeat", afraid: "fear", lazy: "inertia", alone: "solitude", lost: "no direction", angry: "anger", doubt: "doubt" };
  const TOPIC_LABELS = { study: "studies", training: "training", work: "work", money: "money", love: "love", family: "family", phone: "distraction", sleep: "sleep", creative: "your craft", decision: "a decision", friends: "friends", envy: "comparison", time: "time", health: "health", habits: "habits" };

  // English + Turkish. A keyword matches at the start of a word, so stems work ("procrastinat", "sınav" → "sınavım").
  const MOOD_WORDS = {
    tired: ["tired", "exhausted", "sleepy", "drained", "burnout", "burned out", "burnt out", "worn out", "no energy", "zero energy", "low energy", "enerjim", "fatigue", "weary", "yorgun", "bitkin", "tükendim", "enerjim yok"],
    failed: ["fail", "losing", "lose ", "keep losing", "got fired", "dropped out", "kaybediyorum", "fired", "laid off", "turned me down", "kovuldum", "kovdu", "reddet", "red yedim", "bombed", "blew it", "flopped", "screwed it", "flunk", "rejected", "rejection", "mistake", "messed up", "screwed up", "didn't make it", "did not pass", "didn't pass", "lost the", "lost my", "defeat", "başaramadım", "kaybettim", "başarısız", "kaldım", "reddedildim", "rezil"],
    afraid: ["afraid", "scared", "fear", "anxious", "anxiety", "nervous", "terrified", "worried", "worry", "panic", "korku", "korkuyorum", "endişe", "kaygı", "gergin"],
    lazy: ["lazy", "procrastinat", "can't start", "cant start", "no motivation", "unmotivated", "motivation", "don't feel like", "dont feel like", "skip", "bored", "couch", "can't focus", "cant focus", "distracted", "tembel", "erteliyorum", "üşeniyorum", "canım istemiyor", "odaklanamıyorum", "motivasyon", "gitmedim", "yapmadım", "atladım", "çalışamıyorum", "can't stop", "cant stop", "keep putting off", "duramıyorum"],
    alone: ["alone", "lonely", "nobody", "no one", "no friends", "isolated", "abandoned", "left me", "left out", "excluded", "no support", "doesn't support", "desteklemiyor", "yalnız bırak", "ignored", "dışla", "broke up", "dumped", "ayrıldı", "yalnız", "kimse", "terk"],
    lost: ["lost", "meaningless", "anlamı yok", "hayatın anlamı", "hayatımın anlamı", "confused", "don't know what", "dont know what", "purpose", "meaning", "direction", "pointless", "what to do with my life", "stuck", "empty", "numb", "boşluk", "boş hissediyorum", "hiçbir şey", "kayboldum", "amaç", "anlamsız", "ne yapacağım", "ne yapmalıyım"],
    angry: ["angry", "livid", "outraged", "fuming", "sinirlen", "deliriyorum", "mad at", "furious", "rage", "hate", "annoyed", "pissed", "insulted", "unfair", "sinir", "öfke", "kızgın", "nefret", "haksızlık"],
    doubt: ["doubt", "can't do", "cant do", "not good enough", "good enough", "too young", "too small", "nobody believes", "no one believes", "çok gencim", "kimse inanmıyor", "too slow", "too weak", "too dumb", "too stupid", "hopeless", "no hope", "umudum", "umutsuz", "smart enough", "talented enough", "yapamayacağ", "başaramayacağ", "beceremeyeceğ", "impossible", "unsure", "insecure", "give up", "giving up", "gave up", "gives up", "keep quitting", "quit", "worthless", "not smart", "believe in me", "believes in me", "inanmıyor", "şüphe", "yapamam", "yapamıyorum", "vazgeç", "yetersiz", "beceremiyorum"]
  };
  const TOPIC_WORDS = {
    study: ["exam", "chemistry", "math", "physics", "biology", "history class", "geometry", "kimya", "matematik", "fizik", "biyoloji", "test", "school", "universit", "college", "class", "lesson", "homework", "grade", "study", "studies", "studying", "revise", "thesis", "course", "sınav", "ders", "okul", "üniversite", "ödev", "yks", "kpss", "lgs", "final", "vize"],
    training: ["gym", "marathon", "race", "maraton", "coach", "championship", "tournament", "match", "my team", "antrenör", "maç", "turnuva", "spora", "workout", "work out", "working out", "train", "exercise", "running", "run ", "lift", "fitness", "diet", "weight", "fat", "muscle", "sport", "boxing", "spor", "antrenman", "salon", "kilo", "diyet", "koşu", "idman"],
    work: ["job", "work", "boss", "career", "office", "business", "startup", "company", "client", "interview", "promotion", "coworker", "colleague", "işim", "işte", "işe", "iş ", "görüşme", "patron", "kariyer", "şirket", "mülakat", "müdür"],
    money: ["money", "broke", "debt", "poor", "salary", "rent", "afford", "bills", "savings", "para", "borç", "maaş", "fakir", "kira"],
    love: ["girlfriend", "sevdiğim", "asked her out", "asked him out", "boyfriend", "breakup", "broke up", "crush", "in love", "love her", "love him", "relationship", "heartbreak", "my ex", "dumped", "cheated", "sevgili", "ayrıldı", "aşk", "kalbim", "eski sevgili", "hoşlandığım"],
    family: ["father", "mother", "dad", "mom", "mum", "parents", "family", "brother", "sister", "babam", "annem", "baba", "anne", "aile", "kardeş"],
    phone: ["phone", "scroll", "social media", "instagram", "tiktok", "youtube", "gaming", "video game", "games", "screen", "addicted", "addiction", "porn", "netflix", "telefon", "oyun", "sosyal medya", "bağımlı", "dizi"],
    sleep: ["sleep", "insomnia", "wake up", "waking up", "get up", "morning", "alarm", "oversleep", "stay up", "uyku", "uyuyamıyorum", "sabah", "kalkamıyorum", "uyan"],
    creative: ["writing", "write", "book", "novel", "art", "draw", "paint", "music", "song", "guitar", "code", "coding", "program", "project", "design", "film", "yazmak", "yazı", "kitap", "kitab", "müzik", "proje", "resim", "çizim", "kod"],
    friends: ["friend", "roommate", "betray", "backstab", "fake friend", "arkadaş", "dost", "ihanet", "kanka", "sırtımdan"],
    envy: ["jealous", "than me", "benden daha", "envy", "compare", "comparing", "everyone else", "ahead of me", "better than me", "behind everyone", "others are", "kıskan", "herkes benden", "karşılaştır", "geride kald"],
    time: ["too old", "too late", "wasted years", "wasted my", "my age", "running out of time", "behind in life", "years old", "yaşım", "geç kaldım", "çok geç", "yıllarımı", "yaşındayım"],
    health: ["sick", "illness", "injury", "injured", "hospital", "disease", "surgery", "chronic", "hasta", "sakat", "ameliyat", "sağlığım", "hastane"],
    habits: ["habit", "healthy", "cook", "sağlıklı", "discipline", "routine", "consistent", "consistency", "smoking", "cigarette", "junk food", "sugar", "alcohol", "alışkanlık", "disiplin", "rutin", "sigara", "düzenli"],
    decision: ["should i", "or should", "choose", "decide", "decision", "between", "which one", "option", "dilemma", "karar", "seçmeli", "seçim", "hangisi", " mi yoksa", "yoksa"]
  };

  // What kind of message is it? (short greetings, thanks, "who are you", or "this again")
  const INTENT_WORDS = {
    greet: ["hi", "hello", "hey", "yo", "greetings", "good morning", "good evening", "selam", "merhaba", "selamün aleyküm", "sa", "günaydın", "iyi akşamlar"],
    thanks: ["thank", "thanks", "thx", "appreciate", "teşekkür", "sağol", "sağ ol", "eyvallah", "eline sağlık"],
    who: ["who are you", "tell me about yourself", "your story", "your life", "what did you do", "introduce yourself", "sen kimsin", "kimsin", "kendini anlat", "hayatını anlat", "hikayeni"]
  };
  const AGAIN_WORDS = ["again", "always", "every time", "everytime", "keep failing", "still failing", "still can't", "still cant", "still not", "still haven't", "still stuck", "still the same", "once more", "yine", "tekrar", "hep ", "hala ", "hâlâ", "her seferinde"];

  // Questions about HIM ("are you afraid?", "pişman mısın?") — only when the message addresses him and asks.
  const ABOUT_KEYS = ["me", "modern", "death", "regret", "proud", "hardest", "younger", "weakness", "day", "enemy", "faith", "love", "family", "lonely", "happy", "fear", "feel"];
  const ABOUT_LABELS = { feel: "feelings", fear: "fears", regret: "regrets", proud: "pride", hardest: "hardest moment", love: "love", family: "family", death: "death", enemy: "enemies", faith: "faith", happy: "happiness", lonely: "loneliness", younger: "younger self", day: "daily life", weakness: "weakness", modern: "today's world", me: "you", general: "himself" };
  const ABOUT_WORDS = {
    feel: ["feel", "feeling", "sad", "upset", "tired", "angry", "üzgün", "yorgun mu", "how are you", "how're you", "mood", "are you ok", "are you okay", "nasılsın", "hissed", "iyi misin", "keyfin"],
    fear: ["afraid", "fear", "scared", "scare", "terrif", "frighten", "kork"],
    regret: ["regret", "mistake", "pişman", "hatan", "hata"],
    proud: ["proud", "achievement", "gurur", "başarın"],
    hardest: ["hardest", "en zor an", "worst", "darkest", "most difficult", "toughest", "en zor", "en kötü"],
    love: ["love", "wife", "married", "romance", "aşk", "aşık", "sevdin", "sevgilin", "eşin", "evlen"],
    family: ["father", "mother", "dad", "mom", "family", "sons", "your son", "children", "kids", "brother", "sister", "parents", "baban", "annen", "ailen", "çocuk", "kardeşin", "oğul", "oğlun"],
    death: ["death", "of death", "afraid to die", "did you die", "you die", "die ", "died", "dying", "dead", "ölüm", "öldün", "ölmek"],
    enemy: ["enemy", "enemies", "betray", "ihanet", "hate", "rival", "düşman", "nefret"],
    faith: ["god", "religion", "faith", "pray", "allah", "tanrı", "dinin", "din ", "inanç", "dua"],
    happy: ["happy", "happiness", "joy", "enjoy", "mutlu"],
    lonely: ["lonely", "alone", "loneliness", "yalnız"],
    younger: ["younger", "young self", "advice to your", "if you could go back", "genç"],
    day: ["your day", "daily", "routine", "typical day", "a day in", "günün", "rutin"],
    weakness: ["weakness", "flaw", "weak", "zayıf", "kusur"],
    modern: ["today's world", "modern", "nowadays", "our world", "our time", "these days", "internet", "technology", "günümüz", "bugünkü", "zamanımız", "teknoloji"],
    me: ["of me", "about me", "think of me", "beni", "hakkımda"]
  };
  const ALIASES = {
    mehmed: ["mehmed", "mehmet", "fatih", "conqueror", "the sultan"],
    vlad: ["vlad", "dracula", "kazıklı", "impaler", "tepes", "tepeș"],
    ataturk: ["atatürk", "ataturk", "mustafa kemal"],
    atsiz: ["atsız", "atsiz", "nihal"],
    musashi: ["musashi"],
    marcus: ["marcus", "aurelius"],
    genghis: ["genghis", "cengiz", "chinggis", "temüjin", "temujin"],
    swordsman: ["swordsman", "kara kılıç"],
    bilge: ["bilge kağan", "bilge kagan", "bilge khagan", "bilge han"],
    rumi: ["rumi", "mevlana", "mevlânâ", "celaleddin"],
    timur: ["timur", "tamerlane", "aksak timur"],
    leonidas: ["leonidas"],
    hannibal: ["hannibal"],
    attila: ["attila", "atilla"],
    joan: ["joan of arc", "joan", "jeanne", "jan dark"],
    napoleon: ["napoleon", "napolyon", "bonaparte"],
    nietzsche: ["nietzsche", "niçe"],
    tesla: ["tesla"]
  };
  const YOU_EN = /(^|[^\p{L}])(you|your|yours|yourself|u|ya)([^\p{L}]|$)/u;
  const YOU_TR = /(^|[^\p{L}])(sen|senin|sana|seni|sende|senden|kendin)([^\p{L}]|$)|\p{L}{2,}(sın|sin|sun|sün|dın|din|dun|dün|tın|tin|tun|tün)([^\p{L}]|$)|(baban|annen|ailen|eşin|hatan|düşmanın|hayatın|hayatının|korkun|zayıflığın|pişmanlığın|gençliğin|anın|günün)/u;
  const ASKS = /\?|^\s*(what|how|do|did|are|were|have|has|who|why|when|where|which|is|was|tell|can|could|would|ne|nasıl|neden|niye|kim|hiç|hangi|anlat)([^\p{L}]|$)|(^|[^\p{L}])m[ıiuü](s[ıiuü]n|yd[ıiuü]n|d[ıiuü]r)?([^\p{L}]|$)/iu;
  const OPINION = /think|opinion|feel about|view of|like?|what('s| is| was) .+ like|düşün|hakkında|fikrin|nasıl biri|sever mi/i;

  const CRISIS_WORDS = ["kill myself", "suicide", "suicidal", "end my life", "want to die", "self harm", "self-harm", "hurt myself", "no reason to live", "intihar", "kendimi öldür", "ölmek istiyorum", "yaşamak istemiyorum"];
  const CRISIS_MESSAGE = "Stepping out of character for a moment: what you wrote sounds serious, and you deserve real support, not a quote. Please talk to someone today — a friend, family member, or a professional. In Türkiye you can call 112; elsewhere, findahelpline.com lists free, confidential lines in your country. You don't have to carry this alone.";

  // ---------- merge the training pack into the dossiers ----------
  const PACK = window.TRAINING_PACK || {};
  for (const c of window.CHARACTERS) {
    const p = PACK[c.id] || {};
    c.topics = Object.assign({}, c.topics || {});
    for (const k of ["openers", "principles", "closers"]) if (p[k]) c[k] = c[k].concat(p[k]);
    for (const m of Object.keys(p.counsel || {})) c.counsel[m] = (c.counsel[m] || []).concat(p.counsel[m]);
    for (const t of Object.keys(p.topics || {})) c.topics[t] = (c.topics[t] || []).concat(p.topics[t]);
    c.intents = Object.assign({}, c.intents || {}, p.intents || {});
    c.again = (c.again || []).concat(p.again || []);
    c.about = p.about || {};
    c.opinions = p.opinions || {};
    c.pivots = p.pivots || [];
  }

  // ---------- training store (what you teach) ----------
  const KEY = (id) => "ironcouncil.forge." + id;
  function emptyTraining() { return { beliefs: [], examples: [], lines: {} }; }
  function getTraining(id) {
    try { return Object.assign(emptyTraining(), JSON.parse(localStorage.getItem(KEY(id)) || "{}")); }
    catch (e) { return emptyTraining(); }
  }
  function saveTraining(id, t) { localStorage.setItem(KEY(id), JSON.stringify(t)); }
  function exportAll() { const o = {}; for (const c of window.CHARACTERS) o[c.id] = getTraining(c.id); return o; }
  function importAll(obj) {
    for (const id of Object.keys(obj || {})) if (window.CHARACTERS.some((c) => c.id === id)) saveTraining(id, Object.assign(emptyTraining(), obj[id]));
  }

  // ---------- reading the message ----------
  // "İ".toLowerCase() gives "i" + a combining dot, which breaks Turkish words like "İşimden". Curly quotes from phones break "can't".
  function norm(text) {
    return String(text || "").replace(/İ/g, "i").toLowerCase().replace(/\u0307/g, "").replace(/[’‘´`]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();
  }
  // Inflected forms for phrases whose first word changes shape (give up -> giving up / gave up).
  const IRREGULAR = { give: ["giving", "gave", "gives"], lose: ["losing", "lost", "loses"], quit: ["quitting", "quits"], fall: ["falling", "fell"], feel: ["feeling", "felt", "feels"], keep: ["keeping", "kept"], get: ["getting", "got"], hate: ["hating", "hated"], "can't": ["cannot", "can not"] };
  function inflect(table) {
    for (const k of Object.keys(table)) {
      const extra = [];
      for (const w of table[k]) {
        const [first, ...rest] = w.split(" ");
        if (!rest.length) continue;
        for (const f of IRREGULAR[first] || []) extra.push([f, ...rest].join(" "));
      }
      table[k] = table[k].concat(extra.filter((x) => !table[k].includes(x)));
    }
  }
  inflect(MOOD_WORDS); inflect(TOPIC_WORDS);
  const reCache = new Map();
  function matcher(w) {
    if (!reCache.has(w)) reCache.set(w, new RegExp("(^|[^\\p{L}])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"));
    return reCache.get(w);
  }
  function best(text, table, keys) {
    const t = " " + norm(text) + " ";
    let top = null, topScore = 0;
    for (const k of keys) {
      let s = 0; for (const w of table[k]) if (matcher(w).test(t)) s += w.length > 12 ? 3 : w.length > 5 ? 2 : 1; // longer phrases are more specific
      if (s > topScore) { top = k; topScore = s; }
    }
    return top;
  }
  const detectMood = (text) => best(text, MOOD_WORDS, MOODS) || "general";
  const AGE = /(\bi'?m|\bi am)\s+\d{2}\b|\d{2}\s*yaşında/i;
  const detectTopic = (text) => (AGE.test(norm(text)) ? "time" : best(text, TOPIC_WORDS, TOPICS));
  function detectIntent(text) {
    const t = " " + norm(text) + " ";
    const words = tokens(text).length;
    // whole words only, so "hi" doesn't fire on "hiç" or "sa" on "saat"
    const has = (k) => INTENT_WORDS[k].some((w) => new RegExp("(^|[^\\p{L}])" + w + "($|[^\\p{L}])", "u").test(t) || (w.length > 5 && matcher(w).test(t)));
    if (has("who")) return "who";
    if (words <= 6 && has("thanks")) return "thanks";
    if (words <= 4 && has("greet")) return "greet";
    return null;
  }
  // Is the user asking HIM something? Returns {kind:"about", subject} | {kind:"opinion", target} | null
  function detectAbout(text, selfId) {
    const raw = norm(text); if (!raw) return null;
    const t = " " + raw + " ";
    const addressed = YOU_EN.test(t) || YOU_TR.test(t);
    const asking = ASKS.test(raw);
    for (const id of Object.keys(ALIASES)) {
      if (id === selfId) continue;
      if (ALIASES[id].some((a) => matcher(a).test(t)) && (addressed || OPINION.test(t))) return { kind: "opinion", target: id };
    }
    if (!addressed || !asking) return null;
    const subject = best(raw, ABOUT_WORDS, ABOUT_KEYS);
    return subject ? { kind: "about", subject } : { kind: "about", subject: "general" };
  }
  const saysAgain = (text) => { const t = " " + norm(text) + " "; return AGAIN_WORDS.some((w) => matcher(w).test(t)); };
  const isCrisis = (text) => { const t = norm(text); return CRISIS_WORDS.some((w) => t.includes(w)); };
  function describe(r) {
    if (!r || r.crisis || r.taught) return "";
    if (r.about) return "about himself · " + ABOUT_LABELS[r.about];
    if (r.opinion) { const o = window.CHARACTERS.find((c) => c.id === r.opinion); return "on " + (o ? o.name : r.opinion); }
    if (r.intent) return { greet: "greeting", thanks: "thanks", who: "about himself" }[r.intent];
    return [r.again ? "persistence" : null, r.mood && r.mood !== "general" ? MOOD_SHORT[r.mood] : null, r.topic ? TOPIC_LABELS[r.topic] : null].filter(Boolean).join(" · ");
  }

  const STOP = new Set("i me my a an the and or but to of in on at for is am are was were be been it this that with so just really very do does did have has had can't cant don't dont not no".split(" "));
  function tokens(s) { return norm(s).replace(/[^\p{L}\p{N}\s']/gu, " ").split(/\s+/).filter((w) => w && !STOP.has(w)); }
  function similarity(a, b) {
    const A = new Set(tokens(a)), B = new Set(tokens(b));
    if (!A.size || !B.size) return 0;
    let n = 0; for (const w of A) if (B.has(w)) n++;
    return n / Math.min(A.size, B.size);
  }

  // ---------- picking lines without repeating (remembered across visits) ----------
  const RKEY = (id) => "ironcouncil.recent." + id;
  const recent = {};
  function recentFor(id) {
    if (!recent[id]) { try { recent[id] = JSON.parse(localStorage.getItem(RKEY(id)) || "[]"); } catch (e) { recent[id] = []; } }
    return recent[id];
  }
  function pick(id, pool, avoid) {
    if (!pool || !pool.length) return null;
    const used = recentFor(id);
    let options = pool.filter((l) => !used.includes(l) && !avoid.includes(l));
    if (!options.length) options = pool.filter((l) => !avoid.includes(l));
    if (!options.length) return null;
    const choice = options[Math.floor(Math.random() * options.length)];
    used.push(choice); if (used.length > 80) used.shift();
    return choice;
  }
  const chance = (p) => Math.random() < p;
  function saveRecent(id) { try { localStorage.setItem(RKEY(id), JSON.stringify(recentFor(id))); } catch (e) { /* storage full: fine */ } }

  // ---------- composing ----------
  // ctx (optional): { lastTopic } from earlier in the same conversation.
  function forgeReply(char, text, forcedMood, ctx) {
    if (isCrisis(text)) return { text: CRISIS_MESSAGE, mood: "crisis", crisis: true };
    const mood = forcedMood || detectMood(text);
    const topic = text ? detectTopic(text) : null;
    const tr = getTraining(char.id);

    // 0) Questions about HIM: his feelings, life, opinions of the others.
    const ab = forcedMood ? null : detectAbout(text, char.id);
    if (ab) {
      const general = ab.kind === "about" && ab.subject === "general";
      // a general "you ...?" question that is really about the user's problem goes to the normal path
      const userProblem = general && (mood !== "general" || topic || detectIntent(text));
      if (!userProblem) {
        const pool = ab.kind === "opinion"
          ? (char.opinions[ab.target] || []).concat(tr.lines["opinion:" + ab.target] || [])
          : (char.about[ab.subject] || []).concat(tr.lines["about:" + ab.subject] || []);
        const fallback = (char.about.general || []).concat(tr.lines["about:general"] || []);
        const parts = [];
        const add = (p) => { const l = pick(char.id, p, parts); if (l) parts.push(l); };
        add(pool.length ? pool : fallback);
        if (ab.kind === "about" && pool.length > 1 && chance(0.35)) add(pool);
        if (chance(0.45)) add(char.pivots);
        saveRecent(char.id);
        return ab.kind === "opinion" ? { text: parts.join(" "), mood, topic, opinion: ab.target } : { text: parts.join(" "), mood, topic, about: ab.subject };
      }
    }

    // Greetings and thanks (only when nothing else was said) and "who are you" get their own answers.
    let intent = forcedMood ? null : detectIntent(text);
    if (intent !== "who" && (mood !== "general" || topic)) intent = null;
    if (intent && char.intents && char.intents[intent]) {
      const parts = [];
      const add = (pool) => { const l = pick(char.id, pool, parts); if (l) parts.push(l); };
      add(char.intents[intent]);
      if (intent === "who") parts.push(char.idea);
      if (intent === "thanks" && chance(0.6)) add(char.closers);
      saveRecent(char.id);
      return { text: parts.join(" "), mood, topic, intent };
    }
    const again = !!text && (saysAgain(text) || (!!topic && !!ctx && ctx.lastTopic === topic));

    // 1) An answer you taught for a similar question wins most of the time.
    if (text && tr.examples.length) {
      const top = tr.examples.map((e) => ({ e, s: similarity(text, e.q) })).sort((x, y) => y.s - x.s)[0];
      if (top.s >= 0.5 && chance(0.85)) return { text: top.e.a, mood, topic, taught: true };
    }

    const moodPool = (char.counsel[mood] || char.counsel.general).concat(tr.lines[mood] || []);
    const topicPool = topic ? (char.topics[topic] || []).concat(tr.lines["topic:" + topic] || []) : [];
    const principlePool = char.principles.concat(tr.beliefs || []);
    const generalPool = char.counsel.general.concat(tr.lines.general || []);

    // 2) Build the answer: topic take first (it shows he understood), then feeling, then conviction.
    const parts = [];
    const add = (pool) => { const l = pick(char.id, pool, parts); if (l) parts.push(l); };
    if (again && char.again && char.again.length) add(char.again); else if (chance(0.45)) add(char.openers);
    if (topicPool.length) {
      add(topicPool);
      if (mood !== "general") add(moodPool); else if (chance(0.6)) add(principlePool);
    } else {
      add(mood === "general" ? generalPool : moodPool);
      if (chance(0.5)) add(principlePool); else if (chance(0.5)) add(mood === "general" ? principlePool : moodPool);
    }
    if (parts.length < 2 || chance(0.35)) add(principlePool);
    if (parts.length > 4) parts.splice(1, parts.length - 4);
    add(char.closers);

    saveRecent(char.id);
    return { text: parts.join(" "), mood, topic, again };
  }

  window.Engine = {
    MOODS, TOPICS, MOOD_LABELS, TOPIC_LABELS, ABOUT_KEYS, ABOUT_LABELS, detectMood, detectTopic, detectIntent, detectAbout, describe, norm, isCrisis, CRISIS_MESSAGE,
    forgeReply, getTraining, saveTraining, exportAll, importAll
  };
})();
