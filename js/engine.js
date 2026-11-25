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
  const TOPICS = ["grief", "bully", "decision", "faith", "envy", "study", "training", "work", "money", "love", "family", "phone", "sleep", "creative", "friends", "time", "health", "habits"];

  const MOOD_LABELS = {
    tired: "I'm exhausted", failed: "I failed", afraid: "I'm afraid", lazy: "I can't start",
    alone: "I feel alone", lost: "I'm lost", angry: "I'm angry", doubt: "I doubt myself", general: "Just speak"
  };
  const MOOD_SHORT = { tired: "exhaustion", failed: "defeat", afraid: "fear", lazy: "inertia", alone: "solitude", lost: "no direction", angry: "anger", doubt: "doubt" };
  const TOPIC_LABELS = { study: "studies", training: "training", work: "work", money: "money", love: "love", family: "family", phone: "distraction", sleep: "sleep", creative: "your craft", decision: "a decision", friends: "friends", envy: "comparison", time: "time", health: "health", habits: "habits", grief: "loss", bully: "being mocked", faith: "faith" };

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
    creative: ["writing", "write", "book", "novel", "art ", "arts", "artist", "artwork", "draw", "paint", "music", "song", "guitar", "code", "coding", "program", "project", "design", "film", "yazmak", "yazı", "kitap", "kitab", "müzik", "proje", "resim", "çizim", "kod"],
    friends: ["friend", "roommate", "betray", "backstab", "fake friend", "arkadaş", "dost", "ihanet", "kanka", "sırtımdan"],
    envy: ["jealous", "than me", "benden daha", "envy", "compare", "comparing", "everyone else", "ahead of me", "better than me", "behind everyone", "others are", "kıskan", "herkes benden", "karşılaştır", "geride kald"],
    time: ["too old", "too late", "wasted years", "wasted my", "my age", "running out of time", "behind in life", "years old", "yaşım", "geç kaldım", "çok geç", "yıllarımı", "yaşındayım"],
    health: ["sick", "illness", "injury", "injured", "hospital", "disease", "surgery", "chronic", "hasta", "sakat", "ameliyat", "sağlığım", "hastane"],
    habits: ["habit", "healthy", "cook", "sağlıklı", "discipline", "routine", "consistent", "consistency", "smoking", "cigarette", "junk food", "sugar", "alcohol", "alışkanlık", "disiplin", "rutin", "sigara", "düzenli"],
    grief: ["passed away", "died", "has died", "funeral", "grief", "grieving", "mourning", "lost my father", "lost my mother", "lost my dad", "lost my mom", "lost my mum", "lost my brother", "lost my sister", "lost my grandfather", "lost my grandmother", "lost my grandma", "lost my grandpa", "lost my friend", "lost my best friend", "lost my dog", "lost my cat", "death of my", "miss him so much", "miss her so much", "vefat", "öldü", "cenaze", "yas tut", "babamı kaybettim", "annemi kaybettim", "kardeşimi kaybettim", "dedemi kaybettim", "ninemi kaybettim", "anneannemi kaybettim", "babaannemi kaybettim", "arkadaşımı kaybettim"],
    bully: ["bully", "bullied", "bullies", "bullying", "picked on", "pick on me", "picks on me", "make fun of me", "makes fun of me", "made fun of me", "laugh at me", "laughs at me", "laughed at me", "mock me", "mocks me", "mocked me", "harass", "they call me", "zorbalık", "zorba", "dalga geç", "alay ed", "benimle uğraş", "aşağıla", "lakap tak"],
    faith: ["in god", "god exist", "god is", "god real", "does god", "religion", "religious", "pray", "prayer", "atheist", "agnostic", "my faith", "church", "mosque", "sin ", "tanrı", "dinim", "dine ", "namaz", "dua ed", "inancım", "imanım", "allah'a", "allah var"],
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
    proud: ["proud", "achievement", "gurur", "başarın", "gurur duy"],
    hardest: ["hardest", "en zor an", "worst", "darkest", "most difficult", "toughest", "en zor", "en kötü"],
    love: ["love", "wife", "married", "romance", "aşk", "aşık", "sevdin", "sevgilin", "eşin", "evlen"],
    family: ["father", "mother", "dad", "mom", "family", "sons", "your son", "children", "kids", "brother", "sister", "parents", "baban", "annen", "ailen", "çocuk", "kardeşin", "oğul", "oğlun"],
    death: ["death", "of death", "afraid to die", "did you die", "you die", "die ", "died", "dying", "dead", "ölüm", "öldün", "ölmek"],
    enemy: ["enemy", "enemies", "betray", "ihanet", "hate", "rival", "düşman", "nefret"],
    faith: ["god", "religion", "faith", "pray", "allah", "tanrı", "dinin", "din ", "inanç", "dua", "neye inan", "inanıyor"],
    happy: ["happy", "happiness", "joy", "enjoy", "mutlu"],
    lonely: ["lonely", "alone", "loneliness", "yalnız"],
    younger: ["younger", "young self", "advice to your", "if you could go back", "genç"],
    day: ["your day", "daily", "routine", "typical day", "a day in", "günün", "rutin"],
    weakness: ["weakness", "flaw", "weak", "zayıf", "kusur", "zaaf"],
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
  const YOU_TR = /(^|[^\p{L}])(sen|senin|sana|seni|sende|senden|kendin)([^\p{L}]|$)|\p{L}{2,}(sın|sin|sun|sün|dın|din|dun|dün|tın|tin|tun|tün)([^\p{L}]|$)|(baban|annen|ailen|eşin|yönün|duyduğun|zaafın|kusurun|inancın|hatan|düşmanın|hayatın|hayatının|korkun|zayıflığın|pişmanlığın|gençliğin|anın|günün)/u;
  const ASKS = /\?|^\s*(what|how|do|did|are|were|have|has|who|why|when|where|which|is|was|tell|can|could|would|ne|nasıl|neden|niye|kim|hiç|hangi|anlat)([^\p{L}]|$)|(^|[^\p{L}])m[ıiuü](s[ıiuü]n|yd[ıiuü]n|d[ıiuü]r)?([^\p{L}]|$)/iu;
  const OPINION = /think|opinion|feel about|view of|like?|what('s| is| was) .+ like|düşün|hakkında|fikrin|nasıl biri|sever mi/i;

  const CRISIS_WORDS = ["kill myself", "suicide", "suicidal", "end my life", "want to die", "self harm", "self-harm", "hurt myself", "no reason to live", "intihar", "kendimi öldür", "ölmek istiyorum", "yaşamak istemiyorum"];
  const CRISIS_MESSAGE_TR = "Bir an rolden çıkıyorum: yazdığın şey ciddi görünüyor ve bir söze değil, gerçek bir desteğe ihtiyacın var. Lütfen bugün biriyle konuş: bir arkadaşınla, ailenden biriyle ya da bir uzmanla. Türkiye'deysen 112'yi arayabilirsin; başka bir ülkedeysen findahelpline.com orada ücretsiz ve gizli yardım hatlarını listeler. Bunu tek başına taşımak zorunda değilsin.";
  const CRISIS_MESSAGE = "Stepping out of character for a moment: what you wrote sounds serious, and you deserve real support, not a quote. Please talk to someone today — a friend, family member, or a professional. In Türkiye you can call 112; elsewhere, findahelpline.com lists free, confidential lines in your country. You don't have to carry this alone.";

  // Pools a Turkish line set may hold (all optional).
  const TR_LIST_POOLS = ["openers", "principles", "closers", "again", "pivots", "gentle", "hard", "heard", "bondWarm", "bondCold"];
  const TR_GROUP_POOLS = ["counsel", "topics", "about", "opinions", "intents", "askBack"];

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
    // drop exact duplicate lines inside every pool (several training rounds can repeat a line)
    const uniq = (arr) => [...new Set(arr)];
    for (const k of ["openers", "principles", "closers", "again", "pivots"]) c[k] = uniq(c[k] || []);
    for (const group of [c.counsel, c.topics, c.about, c.opinions, c.intents]) for (const k of Object.keys(group || {})) group[k] = uniq(group[k]);
    // Lines for memory, the daily oath and the council ("{name}", "{topic}", "{goal}", "{oath}" are filled in).
    for (const k of ["recall", "goalAsk", "oathTake", "oathKept", "oathBroken", "agree", "disagree", "stories", "gentle", "hard", "bondWarm", "bondCold", "bondUp", "heard", "pro", "con", "journal"]) c[k] = uniq(p[k] || []);
    c.askBack = p.askBack || {};
    // Turkish lines (pack key "tr"), same shape as the English pools. Any pool left out falls back to English.
    const t = p.tr || {};
    const lists = {}; for (const k of TR_LIST_POOLS) lists[k] = uniq(t[k] || []);
    const groups = {}; for (const k of TR_GROUP_POOLS) { groups[k] = {}; for (const g of Object.keys(t[k] || {})) groups[k][g] = uniq(t[k][g]); }
    c.tr = Object.assign({}, lists, groups);
    c.rivals = p.rivals || {};
    // Thin one- or two-word lines are replaced by full ones (round 6); keep them only for the terse voices
    // or where a pool would otherwise be too small.
    if (!["swordsman", "leonidas"].includes(c.id)) {
      const thick = (arr) => { const f = arr.filter((l) => l.split(/\s+/).length > 2); return f.length >= 4 ? f : arr; };
      c.principles = thick(c.principles);
      for (const group of [c.counsel, c.topics, c.about]) for (const k of Object.keys(group)) group[k] = thick(group[k]);
    }
  }
  // How each member tends to see the others in the council: same temper → usually agree.
  const TEMPER = { vlad: "iron", genghis: "iron", attila: "iron", timur: "iron", swordsman: "iron", leonidas: "iron", napoleon: "iron", hannibal: "iron",
    marcus: "calm", rumi: "calm", musashi: "calm", tesla: "calm", bilge: "calm",
    mehmed: "fire", ataturk: "fire", atsiz: "fire", joan: "fire", nietzsche: "fire" };

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
        if (!rest.join("").trim()) continue; // "lose " must not become "lost " (that is the lost-way feeling)
        for (const f of IRREGULAR[first] || []) extra.push([f, ...rest].join(" "));
      }
      table[k] = table[k].concat(extra.filter((x) => !table[k].includes(x)));
    }
  }
  // ---------- wider vocabulary: everyday wording, slang, Turkish (tests/cases-real-*.js) ----------
  const MORE_MOOD = {
    tired: ["drain", "wiped", "burned out", "worn down", "brain is mush", "tüken", "bitik", "pestil", "burnt", "eyes open", "been up since", "legs are dead", "i'm dead", "im dead", "dead tired", "i'm beat", "im beat", "so beat", "zombie", "nothing left", "running on empty", "fried", "killing me", "so done", "done with", "can barely", "won't move", "no strength", "sleep deprived", "yorul", "halim yok", "halim kalmadı", "kafam durdu", "perişan", "uykusuz", "bıktım", "usandım", "bezdim", "takatim"],
    failed: ["didn't get", "didnt get", "cut from", "got cut", "cancelled", "canceled", "blew my", "blew the", "kötü oynadım", "kötü geçti", "çok kötü geçti", "said no", "went under", "bankrupt", "relapse", "broke my diet", "broke my streak", "screwed", "choked", "ruined", "didn't make", "didnt make", "bad grade", "low grade", "low score", "bad mark", "reject", "alamadım", "geçemedim", "düşük aldım", "düşük not", "alınmadım", "işten çıkar", "kaybett", "bozdum", "berbat ettim", "mahvettim", "çuvalladım", "batırdım", "başaramadı"],
    afraid: ["freaking out", "freak out", "heart races", "heart racing", "utan", "çekin", "shak", "dread", "stress", "scare", "what if i", "terrif", "stresli", "panik", "cesaret edemiyorum", "çekiniyorum", "ödüm kopuyor"],
    lazy: ["can't get myself", "cant get myself", "make myself", "avoid", "wasting", "never finish", "don't finish", "dont finish", "başlayamıyorum", "get myself to", "putting off", "put off", "keep saying tomorrow", "tomorrow never", "zero drive", "no drive", "doing nothing", "lie in bed", "lying in bed", "stay in bed", "out of bed", "never sit down", "can't be bothered", "cant be bothered", "no discipline", "snooze", "delay", "haven't opened", "havent opened", "çalışmadım", "haven't touched", "havent touched", "don't wanna", "dont wanna", "procrast", "başlayamıyorum", "bir türlü", "yataktan çık", "erteli", "alarmı kapat", "üşen"],
    alone: ["by myself", "on my own", "don't know anybody", "dont know anybody", "don't know anyone", "except me", "invisible", "doesn't care about me", "don't care about me", "dont care about me", "stopped inviting", "no one to talk", "nobody to talk", "left me for", "kimsem", "dışlan", "anlamıyor", "don't have any friends", "dont have any friends", "arkadaşım yok", "kimseyi tanımıyorum", "aramıyor", "beni bıraktı", "beni terk"],
    lost: ["what's the point", "whats the point", "no goals", "no goal", "chose the right", "amaç yok", "hedefim yok", "point of anything", "who i am", "drifting", "nothing excites", "feels the same", "same every day", "going through the motions", "what i'm doing with my life", "what im doing with my life", "idk what", "no idea what", "what i want", "don't know who i am", "dont know who i am", "kaybolmuş", "kafam karış", "ne istediğimi", "belli değil", "her gün aynı", "ne yapacağımı", "ne yapacagimi"],
    angry: ["so mad", "makes me mad", "driving me insane", "driving me crazy", "driving me nuts", "kızdır", "sinir ol", "i'm mad", "im mad", "fed up", "can't stand", "cant stand", "yelled at", "yells at", "took credit", "behind my back", "want to scream", "drives me crazy", "robbed us", "for no reason", "so fake", "deli ediyor", "çıldıracağım", "çıldırıyorum", "kızdım", "kızıyorum", "haksız", "haksız yere", "bağırdı", "arkamdan"],
    doubt: ["not sure i can", "not good enough", "yetersiz", "yeteneğim yok", "yeteneksiz", "cut out for", "not cut out", "don't believe in myself", "dont believe in myself", "more talented", "talented than", "smarter than me", "yetenekli", "güvenmiyorum", "never make it", "i'll never", "ill never", "believe in myself", "kendime güven", "fraud", "impostor", "imposter", "a failure", "useless", "a loser", "not good at", "good at anything", "ever be good", "too old to", "sanmıyorum", "beceremem", "beceremi", "yeterince", "faydasız", "bırakmak istiyorum", "geçemeyeceğim", "kazanamayacağım"]
  };
  const MORE_TOPIC = {
    study: ["uni ", "major", "semester", "graduat", "assignment", "grades", "teacher", "hoca", "mezun", "bölüm"],
    work: ["presentation", "shift", "fired", "manager", "sunum", "işe alın", "meetings", "which career"],
    training: ["the team", "referee", "leg day", "stronger", "strength", "weight loss"],
    love: ["ask her out", "ask him out", "a girl", "a boy", "this girl", "this guy", "left me for", "kızlar", "kızla ", "find love", "girls", "guys", "my gf", "my bf", "kıza açıl", "ona açıl", "hoşlan", "with her"],
    family: ["baby", "kids", "my son", "my daughter", "children", "husband", "boşan", "divorc"],
    money: ["crypto", "owe ", "ödeyeme"],
    grief: ["passed away"],
    health: ["doktor", "getting sick", "diagnos", "diabetes", "cancer", "doctor", "fıtık", "ağrı", "pain"],
    faith: ["a god", "believe in god"],
    habits: ["drink", "smok", "vape", "vaping"],
    envy: ["earns", "makes more", "double what", "more than me", "happier than", "benden mutlu", "benden daha", "benden iyi", "benden başarılı"],
    sleep: ["asleep", "snooze", "uykusuz", "staying up", "up late", "up so late"],
    bully: ["mock", "mock my", "mocking", "make fun"]
  };
  for (const k of Object.keys(MORE_MOOD)) MOOD_WORDS[k] = MOOD_WORDS[k].concat(MORE_MOOD[k].filter((w) => !MOOD_WORDS[k].includes(w)));
  for (const k of Object.keys(MORE_TOPIC)) TOPIC_WORDS[k] = TOPIC_WORDS[k].concat(MORE_TOPIC[k].filter((w) => !TOPIC_WORDS[k].includes(w)));
  // Round 4 (tests/holdout/*): wider everyday wording the earlier rounds missed.
  const ROUND4_MOOD = {
    tired: ["nothing is left", "nothing left", "eyelids", "so heavy", "body is heavy", "foggy", "wrecked me", "can't lift", "cant lift", "i'm spent", "im spent", "wearing me down", "worn me down", "no rest", "no energy", "aching", "dinlenemedim", "bitkin", "sleepless"],
    failed: ["collapsed", "fell short", "flopped", "bad score", "didn't win", "didnt win", "turned down", "couldn't finish", "couldnt finish", "didn't get the", "grades back", "terrible grade", "didn't pass", "didnt pass", "işim battı", "battı"],
    afraid: ["nervous", "shaking", "anxious", "stomach turn", "stomach hurts", "what if she", "what if he", "what if they", "sweaty palms"],
    lazy: ["waste hours", "wasting hours", "postponing", "all day on my phone", "always say that", "never get around", "zero discipline", "no discipline", "can't make myself", "cant make myself", "haven't opened a book", "havent opened a book", "yapmak istemiyor", "çalışmak istemiyor", "istemiyor", "couch", "scrolling instead", "day on my phone"],
    alone: ["yapayalnız", "forgot about me", "ignores me", "ignore me", "ignoring me", "stopped calling", "barely talk", "feel lonely", "no one talks to me", "nobody talks to me", "kimse benimle konuşmuyor", "kimsem yok"],
    lost: ["what am i even", "am i even doing", "ne yapmak istediğimi", "amacım yok", "wrong major", "wrong career", "which career", "no direction", "ne yöne", "whats even the point", "what's even the point", "no purpose", "meaningless", "pointless", "anlamsız"],
    angry: ["furious", "humiliating", "humiliate", "boiling", "raging", "annoying", "frustrated", "livid", "pissed", "bağırdı", "kızgın", "sinirli"],
    doubt: ["i suck", "suck at", "don't deserve", "dont deserve", "not made for", "believe in myself", "stupid", "fraud", "başaramam", "yapabileceğimi sanmıyorum", "güvenemiyorum", "smart enough", "strong enough", "talented than me", "can't believe in myself", "cant believe in myself"]
  };
  const ROUND4_TOPIC = {
    study: ["scholarship", "lecture", "major"],
    love: ["marriage", "partner", "her parents", "his parents", "ask her out", "ask him out", "my ex"],
    bully: ["making fun", "make fun of"],
    habits: ["morning routine"],
    health: ["medical", "ameliyat"],
    creative: ["audition", "publisher", "novel"],
    training: ["competition", "practice", "my coach"]
  };
  for (const k of Object.keys(ROUND4_MOOD)) MOOD_WORDS[k] = MOOD_WORDS[k].concat(ROUND4_MOOD[k].filter((w) => !MOOD_WORDS[k].includes(w)));
  for (const k of Object.keys(ROUND4_TOPIC)) TOPIC_WORDS[k] = TOPIC_WORDS[k].concat(ROUND4_TOPIC[k].filter((w) => !TOPIC_WORDS[k].includes(w)));
  // Idioms that would be read literally ("lose 10 kilos" is not defeat, "quit smoking" is not giving up).
  const REWRITES = [
    [/\blos(e|ing) (\d+ ?|some |a few |a lot of )?(kilos?|kg|pounds|lbs|weight|fat|belly)\b/g, "weight loss"],
    [/\bquit(ting)? (smoking|drinking|vaping|sugar|caffeine|porn|alcohol|cigarettes)\b/g, "stop $2"],
    [/\bshould i (quit|leave)\b/g, "should i leave"],
    [/\bsick (and tired )?of\b/g, "fed up with"],
    [/\b\d+ hours? of sleep\b/g, "sleep deprived"],
    [/\bmy (\p{L}+) passed\b(?!\s+(the|my|an?|it|her|his|all|every|out|by|me))/gu, "my $1 passed away"],
    [/\binstead of (\p{L}+)/gu, "procrastinating"],
    [/\bgot (a |an )?\d{1,2}(%| on| in)/g, "bad grade$2"],
    [/işe yara/g, "faydasız"],
    [/\p{L}+(asım|esim|asim) (yok|gelmiyor)/gu, "canım istemiyor"],
    [/(^|[^\p{L}])ya [^?.!]*(rsam|rsem|mazsam|mezsem)([^\p{L}]|$)/gu, "$1korkuyorum$3"],
    [/yine (sigaraya|içmeye) başladım/g, "relapse sigara"],
    [/(sigara|içki|alkol)\p{L}* bırak/gu, "sigara stop"],
    // "not talented enough", "not ready", "emin değilim": a denied ability is self-doubt, not a cancelled feeling
    [/(\bnot|n't) (\p{L}+ )?(talented|smart|good|strong|brave|sure|capable|able|ready|clever|skilled)( enough)?\b/gu, "yetersiz, not good enough"],
    [/(emin|hazır|yeterli|zeki|güçlü|yetenekli|kabiliyetli) değil/g, "yetersiz"],
    [/\b(phone|battery|laptop|computer|car|plant|plants|motivation) (just |has |have )?died\b/g, "$1 off"],
    [/\brunning on empty\b/g, "drained"],
    [/\brunning on\b/g, "on"],
    [/\blost (all (of )?my |everything|my )?(savings|money|\d+)/g, "lost my savings"],
    [/\bcan'?t stop (thinking about|crying)/g, "keep $1"]
  ];
  const rewrite = (t) => REWRITES.reduce((s, [re, to]) => s.replace(re, to), t);
  // Turkish typed without Turkish letters ("sinavdan kaldim"): longer words also match their plain-letter form.
  const fold = (s) => s.replace(/ı/g, "i").replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ö/g, "o").replace(/ü/g, "u");
  const FOLDED = new Map(); // word -> its plain-letter form, or null when it has none worth matching
  const folded = (w) => { if (!FOLDED.has(w)) { const f = fold(w); FOLDED.set(w, f !== w && f.length >= 5 ? f : null); } return FOLDED.get(w); };
  inflect(MOOD_WORDS); inflect(TOPIC_WORDS);
  const reCache = new Map();
  function matcher(w) {
    if (!reCache.has(w)) reCache.set(w, new RegExp("(^|[^\\p{L}])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"));
    return reCache.get(w);
  }
  // "I'm not tired", "I don't feel afraid anymore", "yorgun değilim": the feeling is denied, so it doesn't count.
  // (Phrases that contain the negation themselves, like "not good enough", still match on their own.)
  const NEG_BEFORE = /(?:(?:^|[^\p{L}])(?:not|never|no longer)|n't)\s+(?:\p{L}+\s+)?$/u;
  const NEG_AFTER = /^\p{L}*\s+değil/u;
  function negated(t, w) {
    const m = matcher(w).exec(t); if (!m) return false;
    const start = m.index + m[1].length, end = start + w.length;
    return NEG_BEFORE.test(t.slice(Math.max(0, start - 30), start)) || NEG_AFTER.test(t.slice(end));
  }
  function best(text, table, keys, checkNeg, folding) {
    const t = " " + norm(text) + " ", ft = fold(t);
    let top = null, topScore = 0;
    for (const k of keys) {
      let s = 0;
      for (const w of table[k]) {
        let hit = matcher(w).test(t) && !(checkNeg && negated(t, w));
        if (!hit && folding) { const fw = folded(w); hit = fw !== null && matcher(fw).test(ft) && !(checkNeg && negated(ft, fw)); }
        if (hit) s += w.length > 12 ? 3 : w.length > 5 ? 2 : 1; // longer phrases are more specific
      }
      if (s > topScore) { top = k; topScore = s; }
    }
    return top;
  }
  // ---------- your corrections ("Misread me" in a chat) ----------
  // Saved in this browser. A message you corrected — or one worded almost the same — is read your way from then on.
  const FIXKEY = "ironcouncil.misreads";
  let fixRaw = null, fixList = [];
  function misreads() {
    const raw = localStorage.getItem(FIXKEY) || "[]";
    if (raw !== fixRaw) { fixRaw = raw; try { fixList = JSON.parse(raw); } catch (e) { fixList = []; } if (!Array.isArray(fixList)) fixList = []; }
    return fixList;
  }
  function jaccard(a, b) {
    const A = new Set(tokens(a)), B = new Set(tokens(b));
    if (A.size < 2 || B.size < 2) return 0;
    let n = 0; for (const w of A) if (B.has(w)) n++;
    return n / (A.size + B.size - n);
  }
  function corrected(text) {
    if (!text) return null;
    const list = misreads(); if (!list.length) return null;
    const t = norm(text); let top = null, ts = 0;
    for (const f of list) { const s = norm(f.q) === t ? 1 : jaccard(f.q, text); if (s > ts) { ts = s; top = f; } }
    return ts >= 0.75 ? top : null;
  }
  function addMisread(q, got, want) {
    const list = misreads().filter((f) => norm(f.q) !== norm(q));
    list.push({ q, got, want, date: new Date().toISOString() });
    localStorage.setItem(FIXKEY, JSON.stringify(list.slice(-500)));
  }
  function clearMisreads() { localStorage.removeItem(FIXKEY); }
  // "I lost my mother" is grief, not defeat
  const detectMood = (text) => { const fx = corrected(text); if (fx) return fx.want.mood || "general"; const m = best(rewrite(norm(text)), MOOD_WORDS, MOODS, true, true) || "general"; return m === "failed" && detectTopic(text) === "grief" ? "general" : m; };
  const AGE = /(\bi'?m|\bi am)\s+\d{2}\b|\d{2}\s*yaşında/i;
  // "oh my god", "thank god" are exclamations, not faith
  const EXCLAIM = /\b(oh my god|my god|thank god|omg|for god's sake|god knows|god damn|goddamn)\b/g;
  // A death outweighs everything else in the message ("my grandpa died this morning" is grief, not sleep).
  const detectTopic = (text) => {
    const fx = corrected(text); if (fx) return fx.want.topic || null;
    if (AGE.test(norm(text))) return "time";
    const t = rewrite(norm(text).replace(EXCLAIM, " "));
    return best(t, TOPIC_WORDS, ["grief"], false, true) || best(t, TOPIC_WORDS, TOPICS, false, true);
  };
  // "tell me a story", "bir hikaye anlat" — but "your story / your life" is "who are you"
  const STORY = /(^|[^\p{L}])(a story|another story|one more story|story time|tell me a tale|any stories|a memory|an anecdote|stories|bir hikaye|bir hikâye|hikaye anlat|hikâye anlat|başka bir hikaye|bir anını|anı anlat)/u;
  const isStory = (text) => STORY.test(" " + norm(text) + " ") && !/your (life )?story|hikayeni|hayatını/.test(norm(text));
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
  // ---------- follow-up messages ("why?", "how?", "I tried that", "yes", "neden?", "nasıl?", "denedim"…) ----------
  // Only meaningful straight after an answer, and only when the message is short.
  const FOLLOW = [
    ["notwork", /(^|\s)(didn'?t work|doesn'?t work|did not work|not working|never works|nothing works|still (the same|nothing|bad|hard|stuck)|didn'?t help|no help|işe yaramadı|yaramadı|olmadı|işe yaramıyor|hâlâ aynı|hala aynı|değişmedi|fayda etmedi)(\s|$)/],
    ["tried", /(^|\s)(i tried( that| it)?|i already tried|already tried|i did( that| it)|i have tried|denedim|zaten denedim|yaptım|bunu yaptım|denemiştim)(\s|$)/],
    ["why", /^(but |and |so |ok but )?(why|why not|why is that|why though|how come|what do you mean|explain|explain that|neden|niye|ya neden|neden öyle|neden peki|neden ki|ne demek istiyorsun|açıkla)(\s?\?*)$/],
    ["how", /^(but |and |so |ok but )?(how|how\?*|how do i|how do i do that|how exactly|how should i|how can i|where do i start|where to start|what should i do|what do i do|nasıl|nasıl yapacağım|nasıl yapayım|nasıl yani|peki nasıl|nereden başlayayım|nereden başlamalıyım|ne yapmalıyım|ne yapayım)(\s?\?*)$/],
    ["more", /^(tell me more|go on|more|continue|and\??|and then\??|devam et|devam|daha fazla anlat|sonra\??|ya sonra\??)(\s?\?*)$/],
    ["yes", /^(yes|yeah|yep|yup|ok|okay|sure|alright|i will|i'll try|i'll do it|i can try|i'll start|evet|tamam|olur|yaparım|deneyeceğim|başlayacağım|peki|anladım|haklısın)(\s?[.!]*)$/],
    ["no", /^(no|nope|nah|not really|i can'?t|i cannot|i don'?t know|i won'?t|hayır|yok|olmaz|yapamam|bilmiyorum|istemiyorum|hiç sanmıyorum)(\s?[.!]*)$/],
  ];
  function detectFollowup(text) {
    const t = norm(text).replace(/[“”"]/g, "");
    if (!t || t.split(/\s+/).length > 7) return null;
    for (const [kind, re] of FOLLOW) if (re.test(t)) return kind;
    return null;
  }
  // Short lead-ins by temper (iron / calm / fire) so a follow-up still sounds like him.
  const FU_LEAD = {
    en: {
      why: { iron: ["Because it works.", "Because the alternative is worse.", "Because weakness has a price."], calm: ["Look closer.", "Because it keeps you steady.", "Ask what it costs you otherwise."], fire: ["Because it matters.", "Because you can do better than this.", "Because this is your fight."] },
      how: { iron: ["Simply.", "Start small, then keep going.", "One step, then the next."], calm: ["Slowly.", "Begin with the smallest piece.", "Breathe, then take one step."], fire: ["Start now.", "Pick one thing and do it today.", "With your own hands, today."] },
      tried: { iron: ["Then try harder, or change the method.", "Once is not enough.", "How many times? Try again, differently."], calm: ["Then look at what you changed.", "Trying is the start; adjusting is the craft.", "Patience: change one thing and try again."], fire: ["Good. Now do it again, better.", "Trying counts. Do not stop there.", "Then you know what does not work. That is progress."] },
      notwork: { iron: ["Then the plan was weak. Change the plan, not the goal.", "Then change the method. Never the aim.", "A failed method is information."], calm: ["Then it was the wrong tool. Try another.", "Do not blame yourself; adjust.", "Then look at it from another side."], fire: ["Then try a harder road. Do not quit.", "It did not work yet. Change something.", "Then you have learned something. Use it."] },
      yes: { iron: ["Good. Do it.", "Then it is settled."], calm: ["Good. Begin gently.", "Then take the first step."], fire: ["Good! Go!", "Then do it."] },
      no: { iron: ["Then tell me what stops you.", "'No' is not a plan."], calm: ["That is alright. What holds you back?", "Then what would be easier?"], fire: ["Why not? Tell me.", "Then what is in the way?"] },
      more: { iron: ["Listen, then.", "There is more, yes."], calm: ["Gladly.", "Let me say it another way."], fire: ["Gladly.", "There is always more."] },
    },
    tr: {
      why: { iron: ["Çünkü işe yarar.", "Çünkü alternatifi daha kötü.", "Çünkü zayıflığın bir bedeli var."], calm: ["Daha yakından bak.", "Çünkü seni dengede tutar.", "Aksi hâlde neye mal olacağını sor."], fire: ["Çünkü önemli.", "Çünkü bundan iyisini yapabilirsin.", "Çünkü bu senin savaşın."] },
      how: { iron: ["Basitçe.", "Küçük başla, sonra devam et.", "Bir adım, sonra bir adım daha."], calm: ["Yavaşça.", "En küçük parçayla başla.", "Nefes al, sonra bir adım at."], fire: ["Şimdi başla.", "Bir şey seç ve bugün yap.", "Kendi ellerinle, bugün."] },
      tried: { iron: ["O hâlde daha çok dene ya da yöntemi değiştir.", "Bir kez yetmez.", "Kaç kez? Yine dene, ama farklı."], calm: ["O hâlde neyi değiştirdiğine bak.", "Denemek başlangıçtır; ayar yapmak ustalık.", "Sabır: bir şeyi değiştir ve yeniden dene."], fire: ["İyi. Şimdi bir daha yap, daha iyi.", "Denemek değerli. Orada durma.", "O hâlde neyin işe yaramadığını biliyorsun. Bu ilerlemedir."] },
      notwork: { iron: ["O hâlde plan zayıftı. Planı değiştir, hedefi değil.", "Yöntemi değiştir, amacı asla.", "Başarısız bir yöntem bilgidir."], calm: ["O hâlde yanlış araçtı. Başka birini dene.", "Kendini suçlama; ayarla.", "O zaman bir de öbür taraftan bak."], fire: ["O hâlde daha zor bir yol dene. Bırakma.", "Henüz işe yaramadı. Bir şeyi değiştir.", "O hâlde bir şey öğrendin. Onu kullan."] },
      yes: { iron: ["İyi. Yap.", "O hâlde mesele tamam."], calm: ["İyi. Nazikçe başla.", "O hâlde ilk adımı at."], fire: ["İyi! Hadi!", "O hâlde yap."] },
      no: { iron: ["O hâlde seni neyin durdurduğunu söyle.", "'Hayır' bir plan değildir."], calm: ["Sorun değil. Seni ne tutuyor?", "O hâlde neyi daha kolay bulursun?"], fire: ["Neden olmasın? Anlat.", "O hâlde yolda ne var?"] },
      more: { iron: ["O hâlde dinle.", "Evet, daha var."], calm: ["Memnuniyetle.", "Başka bir türlü söyleyeyim."], fire: ["Memnuniyetle.", "Her zaman daha fazlası var."] },
    },
  };
  function followupReply(char, kind, ctx, T, trg, pickPool, full) {
    const last = ctx.last || {}, mood = last.mood || "general", topic = last.topic || null;
    const parts = [];
    const add = (pool) => { const l = pick(char.id, pool, parts); if (l) parts.push(l); };
    const leads = ((FU_LEAD[T ? "tr" : "en"][kind]) || {})[TEMPER[char.id]] || [];
    if (leads.length) add(leads);
    const moodPool = full(pickPool(char.counsel[mood] || char.counsel.general, trg("counsel", mood) || trg("counsel", "general")));
    const topicPool = topic ? full(pickPool(char.topics[topic] || [], trg("topics", topic))) : [];
    const principles = pickPool(char.principles, T && T.principles);
    if (kind === "why") { add(topicPool.length ? topicPool : principles); add(principles); }
    else if (kind === "how") { add(topicPool.length ? topicPool : moodPool); add(moodPool); }
    else if (kind === "tried" || kind === "notwork") { if (kind === "tried") add(pickPool(char.again, T && T.again)); add(topicPool.length ? topicPool : moodPool); add(chance(0.5) ? moodPool : principles); }
    else if (kind === "more") { add(topicPool.length ? topicPool : moodPool); add(principles); }
    else if (kind === "yes") add(pickPool(char.closers, T && T.closers));
    else if (kind === "no") { add(pickPool(char.pivots, T && T.pivots)); add(moodPool); }
    if (parts.length > 4) parts.length = 4;
    saveRecent(char.id);
    return { text: parts.join(" "), mood, topic, followup: kind, lang: T ? "tr" : "en" };
  }

  // Which language is the message in? Returns "tr" or "en". English is the default: a message only counts as Turkish
  // when there is clear evidence (Turkish letters, or several very common Turkish words / endings).
  const TR_WORDS = new Set(("evet hayır tamam denedim devam olmadı yaramadı peki ve bir bu ben sen biz siz çok cok ama için icin değil degil var yok bana sana beni seni benim senin ne nasıl nasil neden niye kim ki da de mi mı mu mü daha en gibi kadar çünkü cunku şey sey her hiç hic hala hâlâ artık artik şimdi simdi yine bile ya hem ise sadece bütün butun bazen belki lazım lazim olarak olan oldu olmuş olmus oluyor yapıyorum yapiyorum yapamıyorum yapamiyorum istiyorum istemiyorum bilmiyorum biliyorum düşünüyorum dusunuyorum hissediyorum yoruldum yorgunum korkuyorum üzgünüm uzgunum mutsuzum kızgınım kizginim yalnızım yalnizim bıktım biktim başaramadım basaramadim başlayamıyorum baslayamiyorum çalışamıyorum calisamiyorum bende sende onun bunu şunu bunun şu o onu ona orada burada çalışmak calismak sınav sinav ders iş is aşk ask arkadaş arkadas aile para uyku merhaba selam teşekkürler tesekkurler sağ sag ol anlat hikaye hikaye nedir misin musun müsün sın değilim degilim değiliz yapmalıyım yapmaliyim gerek gerekiyor kendimi kendime kendim hayat hayatım hayatim").split(/\s+/));
  const TR_ENDINGS = /(?:\p{L}{2,})(?:ıyorum|iyorum|uyorum|üyorum|ıyor|iyor|uyor|üyor|mıyorum|miyorum|muyorum|müyorum|amıyorum|emiyorum|madım|medim|madım|dım|dim|dum|düm|tım|tim|tum|tüm|lar|ler|imiz|ımız|umuz|ümüz|nız|niz|ması|mesi|mak|mek|tan|ten|dan|den|yım|yim|yum|yüm|sız|siz|suz|süz|lık|lik|luk|lük|ım|im|um|üm|ız|ğım|ğim)$/u;
  const EN_WORDS = new Set("the and is are was were i you he she it we they my your me to of in on for with that this not have has had do does did what how why who when where can could would should will just very so but if or be been am im i'm don't can't won't it's really too much about because feel feeling tired afraid angry help tell me".split(" "));
  function detectLang(text) {
    const t = norm(text);
    if (!t) return "en";
    const words = t.replace(/[^\p{L}\s']/gu, " ").split(/\s+/).filter(Boolean);
    if (!words.length) return "en";
    let tr = 0, en = 0;
    if (/[ğışİ]/.test(text)) tr += 3;                  // letters that only Turkish uses
    else if (/[çöü]/.test(text)) tr += 1;
    for (const w of words) {
      if (TR_WORDS.has(w)) tr += 1.5;
      else if (w.length >= 5 && TR_ENDINGS.test(w)) tr += 1;
      if (EN_WORDS.has(w)) en += 1.5;
    }
    return tr >= 1.5 && tr > en * 2 ? "tr" : "en";
  }
  const crisisMessage = (text) => (detectLang(text) === "tr" ? CRISIS_MESSAGE_TR : CRISIS_MESSAGE);
  const isCrisis = (text) => { const t = norm(text); return CRISIS_WORDS.some((w) => t.includes(w)); };
  function describe(r) {
    if (!r || r.crisis || r.taught) return "";
    if (r.about) return "about himself · " + ABOUT_LABELS[r.about];
    if (r.opinion) { const o = window.CHARACTERS.find((c) => c.id === r.opinion); return "on " + (o ? o.name : r.opinion); }
    if (r.intent) return { greet: "greeting", thanks: "thanks", who: "about himself" }[r.intent];
    if (r.story) return "a story";
    if (r.followup) return "follow-up";
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
  // Two lines that share most of their key words say the same thing; never put both in one answer.
  const KEYW = new Map();
  function keyWords(line) {
    if (!KEYW.has(line)) KEYW.set(line, new Set(tokens(line).filter((w) => w.length > 3).map((w) => w.slice(0, 5))));
    return KEYW.get(line);
  }
  function tooSimilar(a, b) {
    // one line contained in the other ("The Way is in training." inside a longer line)
    const na = norm(a).replace(/[^\p{L}\p{N} ]/gu, ""), nb = norm(b).replace(/[^\p{L}\p{N} ]/gu, "");
    if (na.length > 8 && nb.length > 8 && (na.includes(nb) || nb.includes(na))) return true;
    // or the two share a whole sentence ("Begin." and "Begin. The will grows...")
    const sa = new Set(norm(a).split(/(?<=[.!?])\s+/));
    if (norm(b).split(/(?<=[.!?])\s+/).some((s) => sa.has(s))) return true;
    const A = keyWords(a), B = keyWords(b);
    if (A.size < 2 || B.size < 2) return false;
    let n = 0; for (const w of A) if (B.has(w)) n++;
    return n / Math.min(A.size, B.size) >= 0.5;
  }
  function pick(id, pool, avoid) {
    if (!pool || !pool.length) return null;
    const used = recentFor(id);
    const ok = (l) => !avoid.includes(l) && !avoid.some((x) => tooSimilar(x, l));
    let options = pool.filter((l) => !used.includes(l) && ok(l));
    if (!options.length) options = pool.filter(ok);
    if (!options.length) return null;
    const choice = options[Math.floor(Math.random() * options.length)];
    used.push(choice); if (used.length > 80) used.shift();
    return choice;
  }
  const chance = (p) => Math.random() < p;
  const TERSE = new Set(["swordsman", "leonidas"]); // short lines are their voice
  function saveRecent(id) { try { localStorage.setItem(RKEY(id), JSON.stringify(recentFor(id))); } catch (e) { /* storage full: fine */ } }

  // ---------- composing ----------
  // ctx (optional): { lastTopic, tone: "gentle"|"hard", bond: "cold"|"stranger"|"respect"|"trusted" }
  // The main lines of an answer carry real content: skip one- or two-word fragments when fuller lines exist (except for the terse voices).
  const full0 = (char) => (pool) => { if (TERSE.has(char.id)) return pool; const f = pool.filter((l) => l.split(/\s+/).length > 2); return f.length >= 3 ? f : pool; };
  function forgeReply(char, text, forcedMood, ctx) {
    if (isCrisis(text)) return { text: crisisMessage(text), mood: "crisis", crisis: true };
    ctx = ctx || {};
    const lang = ctx.lang || (text ? detectLang(text) : "en");
    let T = lang === "tr" ? char.tr : null;   // Turkish pools, or null for English (also set to null below when the main pool has no Turkish yet, so one answer is never half and half)
    // Use the Turkish pool when it has lines, else the English one.
    const pickPool = (en, trp) => (T && trp && trp.length ? trp : en);
    const trg = (group, key) => (T && T[group] && T[group][key]) || null;
    // A short reply that only makes sense after his last answer ("why?", "how?", "I tried that", "yes"…).
    if (!forcedMood && text && ctx.last) {
      const fu = detectFollowup(text);
      if (fu) {
        // Turkish only if the pools it draws on have Turkish; otherwise the whole reply stays English.
        const lm = ctx.last.mood || "general", lt = ctx.last.topic;
        // One Turkish word ("evet", "denedim") is not enough to detect Turkish, so the language of the last answer carries over.
        const wantTr = detectLang(text) === "tr" || (ctx.last.lang === "tr" && !/(^|[^\p{L}])(yes|yeah|yep|no|nope|nah|ok|okay|sure|why|how|tried|work|more|go|on|still|same|help|try|that|it|i|really)([^\p{L}]|$)/iu.test(text));
        const T2 = wantTr ? char.tr : null;
        const hasTr = T2 && (lt ? ((T2.topics || {})[lt] || []).length : (((T2.counsel || {})[lm] || (T2.counsel || {}).general || []).length));
        return followupReply(char, fu, ctx, hasTr ? T2 : null, (g, k) => (hasTr && T2[g] && T2[g][k]) || null, (en, trp) => (hasTr && trp && trp.length ? trp : en), full0(char));
      }
    }
    const topic = text ? detectTopic(text) : null;
    let mood = forcedMood || detectMood(text);

    // A story from his life, when asked for one.
    if (!forcedMood && text && isStory(text) && char.stories.length) {
      const s = pick(char.id, char.stories, []); saveRecent(char.id);
      return { text: s, mood, topic: null, story: true };
    }
    const tr = getTraining(char.id);
    // The main lines of an answer should carry real content: skip one- or two-word fragments
    // when fuller lines exist (except for the deliberately terse characters).
    const full = (pool) => { if (TERSE.has(char.id)) return pool; const f = pool.filter((l) => l.split(/\s+/).length > 2); return f.length >= 3 ? f : pool; };

    // 0) Questions about HIM: his feelings, life, opinions of the others.
    const ab = forcedMood ? null : detectAbout(text, char.id);
    if (ab) {
      const general = ab.kind === "about" && ab.subject === "general";
      // a general "you ...?" question that is really about the user's problem goes to the normal path
      const userProblem = general && (mood !== "general" || topic || detectIntent(text));
      if (!userProblem) {
        if (T && !((ab.kind === "opinion" ? trg("opinions", ab.target) : trg("about", ab.subject)) || []).length) T = null;
        const pool = ab.kind === "opinion"
          ? pickPool((char.opinions[ab.target] || []).concat(tr.lines["opinion:" + ab.target] || []), trg("opinions", ab.target))
          : full(pickPool((char.about[ab.subject] || []).concat(tr.lines["about:" + ab.subject] || []), trg("about", ab.subject)));
        const fallback = pickPool((char.about.general || []).concat(tr.lines["about:general"] || []), trg("about", "general"));
        const parts = [];
        const add = (p) => { const l = pick(char.id, p, parts); if (l) parts.push(l); };
        add(pool.length ? pool : fallback);
        if (ab.kind === "about" && pool.length > 1 && chance(0.35)) add(pool);
        if (chance(0.45)) add(pickPool(char.pivots, T && T.pivots));
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
      add(pickPool(char.intents[intent], trg("intents", intent)));
      if (intent === "who" && !(T && trg("intents", "who"))) parts.push(char.idea);
      if (intent === "thanks" && chance(0.6)) add(pickPool(char.closers, T && T.closers));
      saveRecent(char.id);
      return { text: parts.join(" "), mood, topic, intent };
    }
    const again = !!text && (saysAgain(text) || (!!topic && !!ctx && ctx.lastTopic === topic));

    // 1) An answer you taught for a similar question wins most of the time.
    if (text && tr.examples.length) {
      const top = tr.examples.map((e) => ({ e, s: similarity(text, e.q) })).sort((x, y) => y.s - x.s)[0];
      if (top.s >= 0.5 && chance(0.85)) return { text: top.e.a, mood, topic, taught: true };
    }

    // The answer is Turkish only if its main pool is: the topic's when there is one, else the feeling's.
    if (T && !(topic ? (trg("topics", topic) || []).length : (trg("counsel", mood) || trg("counsel", "general") || []).length)) T = null;
    const moodPool = full(pickPool((char.counsel[mood] || char.counsel.general), trg("counsel", mood) || trg("counsel", "general")).concat(tr.lines[mood] || []));
    const topicPool = topic ? full(pickPool(char.topics[topic] || [], trg("topics", topic)).concat(tr.lines["topic:" + topic] || [])) : [];
    const principlePool = pickPool(char.principles, T && T.principles).concat(tr.beliefs || []);
    const generalPool = full(pickPool(char.counsel.general, trg("counsel", "general")).concat(tr.lines.general || []));
    const P = (k) => pickPool(char[k], T && T[k]);

    // 2) Build the answer: topic take first (it shows he understood), then feeling, then conviction.
    const parts = [];
    const add = (pool) => { const l = pick(char.id, pool, parts); if (l) parts.push(l); };
    // Grief is answered with care: no scolding openers, no "hard" closer, no lines about laziness or defeat.
    const grief = topic === "grief";
    const gentle = ctx.tone === "gentle" && char.gentle.length, hard = ctx.tone === "hard" && char.hard.length && !grief;
    // How he feels about you colours the first words now and then.
    const bondPool = ctx.bond === "cold" ? P("bondCold") : (ctx.bond === "respect" || ctx.bond === "trusted") ? P("bondWarm") : [];
    // You are answering a question he asked you: he acknowledges it first.
    if (ctx.answered && char.heard.length) add(P("heard"));
    else if (bondPool.length && chance(ctx.bond === "trusted" ? 0.35 : 0.25)) add(bondPool);
    else if (gentle) add(P("gentle"));
    else if (grief) { if (char.gentle.length && chance(0.5)) add(P("gentle")); }
    else if (again && char.again && char.again.length) add(P("again"));
    else if (chance(0.45)) add(P("openers"));
    if (topicPool.length) {
      add(topicPool);
      if (grief && ["lazy", "failed", "doubt", "angry"].includes(mood)) add(topicPool);
      else if (mood !== "general") add(moodPool); else if (chance(0.6)) add(principlePool);
    } else {
      add(mood === "general" ? generalPool : moodPool);
      if (chance(0.5)) add(principlePool); else if (chance(0.5)) add(mood === "general" ? principlePool : moodPool);
    }
    if (!gentle && !grief && (parts.length < 2 || chance(0.35))) add(principlePool);
    if (grief && parts.length < 2) add(topicPool);
    if (parts.length > 4) parts.splice(1, parts.length - 4);
    // Sometimes he ends with a question back to you instead of a closing line.
    const askKey = mood !== "general" ? mood : topic ? "general" : null;
    const askPool = askKey && ctx.canAsk && !ctx.answered && pickPool(char.askBack[askKey] || [], trg("askBack", askKey));
    let asked = null;
    if (askPool && askPool.length && chance(0.33)) { const qn = pick(char.id, askPool, parts); if (qn) { parts.push(qn); asked = askKey; } }
    if (!asked && !grief) add(hard ? P("hard") : P("closers")); // no battle-cry ending after a loss

    saveRecent(char.id);
    return { text: parts.join(" "), mood, topic, again, tone: ctx.tone, asked, lang: T ? "tr" : "en" };
  }

  const SHORT = { ataturk: "Atatürk", atsiz: "Atsız", musashi: "Musashi", swordsman: "the Swordsman", nietzsche: "Nietzsche", rumi: "Rumi", tesla: "Tesla", genghis: "Genghis", hannibal: "Hannibal", napoleon: "Napoleon", bilge: "Bilge" };
  const shortName = (c) => SHORT[c.id] || c.name.split(" ")[0];
  // One line from a named pool, with {placeholders} filled in. Returns "" if the pool is empty.
  function say(char, key, vars, pool) {
    const l = pick(char.id, pool || char[key] || [], []); saveRecent(char.id);
    if (!l) return "";
    const s = l.replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] != null ? vars[k] : m));
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  // A council member reacting to someone who spoke before him.
  function react(char, other) {
    // Members with real history between them speak to that history.
    const riv = char.rivals[other.id];
    if (riv && riv.length && chance(0.85)) return { text: say(char, null, null, riv), agree: false, rival: true };
    const same = TEMPER[char.id] === TEMPER[other.id];
    const agree = same ? chance(0.7) : chance(0.35);
    const short = shortName(other);
    // (his stored opinion of the other is not added here: it can contradict an "I agree")
    return { text: say(char, agree ? "agree" : "disagree", { name: short }), agree };
  }
  // A short reply in his voice to a line someone else said (council round two).
  function rebut(char, other) {
    const r = react(char, other);
    if (r.rival) return r; // a rival line already says enough
    const p = pick(char.id, full3(char.principles), [r.text]); saveRecent(char.id);
    return { text: [r.text, p].filter(Boolean).join(" "), agree: r.agree };
  }
  // One line that speaks to the subject of a question (its topic, else its feeling, else a conviction).
  function topicLine(char, text) {
    // "Should I…" is always a decision; look past that to what the decision is about (university, job, love…).
    let topic = detectTopic(text);
    if (topic === "decision") topic = best(norm(text).replace(EXCLAIM, " "), TOPIC_WORDS, TOPICS.filter((t) => t !== "decision" && t !== "time"));
    const mood = detectMood(text);
    const pool = (topic && char.topics[topic]) || (mood !== "general" && char.counsel[mood]) || char.principles;
    const l = pick(char.id, full3(pool), []); saveRecent(char.id);
    return l || "";
  }
  const temper = (c) => TEMPER[c.id];
  const full3 = (pool) => { const f = pool.filter((l) => l.split(/\s+/).length > 2); return f.length >= 3 ? f : pool; };

  window.Engine = {
    MOODS, TOPICS, MOOD_LABELS, TOPIC_LABELS, ABOUT_KEYS, ABOUT_LABELS, detectMood, detectTopic, detectIntent, detectAbout, describe, norm, isCrisis, CRISIS_MESSAGE, CRISIS_MESSAGE_TR, crisisMessage, detectLang, detectFollowup,
    forgeReply, misreads, addMisread, clearMisreads, getTraining, saveTraining, exportAll, importAll, say, react, rebut, shortName, isStory, topicLine, temper
  };
})();
