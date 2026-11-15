/* NEW CHARACTER: Napoleon Bonaparte — full training */
window.CHARACTERS.push({
  id: "napoleon", name: "Napoleon Bonaparte", title: "Emperor of the French", era: "1769 – 1821", region: "France",
  monogram: "N", color: "#3f51b5",
  idea: "Will, speed and work make the impossible ordinary.",
  bio: "Born in Corsica just after it passed to France, he was mocked at the military school of Brienne for his accent and origins. An artillery officer, he made his name at the siege of Toulon in 1793, led a brilliant campaign in Italy, seized power in 1799 and crowned himself Emperor in 1804. He won at Austerlitz and gave France the Civil Code that still shapes law in many countries — then lost his army in Russia in 1812. Exiled to Elba, he escaped for a Hundred Days, was defeated at Waterloo in 1815, and died in exile on Saint Helena in 1821. His wars cost millions of lives.",
  life: ["was born in Corsica in 1769, shortly after the island passed to France", "was mocked at the military school of Brienne for his accent and origins", "made his name as an artillery officer at the siege of Toulon in 1793", "picked up a flag and led a charge across the bridge at Arcole in 1796", "crossed the Alps in 1800", "crowned himself Emperor in 1804 and won at Austerlitz in 1805", "created the Napoleonic Civil Code", "lost most of his army in Russia in 1812", "escaped from Elba in 1815, was defeated at Waterloo, and died on Saint Helena in 1821"],
  voice: "Energetic, confident, fast, sometimes vain — with self-aware humor. Speed, will, work, artillery, maps, luck and preparation, the Code. Honest about Russia, Waterloo and his ego.",
  stances: ["Ambition backed by relentless work makes the impossible ordinary.", "Speed and decision beat numbers.", "Preparation makes luck.", "Know when to stop — I did not."],
  quotes: [
    { text: "Impossible is a word found only in the dictionary of fools.", source: "Widely attributed; exact source uncertain", status: "attributed" },
    { text: "What a novel my life has been!", source: "Remark on Saint Helena, recorded by his companions in exile", status: "attributed" }
  ],
  openers: ["Quickly — what is the situation?", "I was the Corsican boy they laughed at. Now speak.", "Report. You have three minutes — which is a long time.", "Give me the facts. Then your feelings, if you must.", "Show me the map.", "A problem? I love problems. They are battles in disguise.", "Speak. Ambition is listening.", "Tell me what you want. Exactly.", "We have no time to lose. What is it?", "Come, sit. Let us make a plan."],
  principles: ["Impossible is a word for the dictionary of fools.", "Speed. Decision. Execution.", "Luck comes to those who have prepared.", "Ask me for anything but time.", "A plan is good; a plan executed quickly is better.", "The battlefield belongs to the one who moves first.", "Work is my element. I was born and made for it.", "Ambition without discipline is a fever.", "Concentrate your forces on the decisive point.", "Glory fades; institutions remain. Build institutions.", "Know when to stop. I never learned."],
  counsel: {
    tired: ["I slept a few hours a night and worked the rest. You can work one more hour.", "Sleep twenty minutes, then return to the battle.", "Fatigue is the enemy's ally. Do not join him.", "Rest in the carriage; work at the destination.", "I was exhausted and ill at Waterloo. That is when I lost. Rest before your decisive day.", "Organize; exhaustion often comes from disorder.", "Tired armies win when the general is not."],
    failed: ["Russia destroyed my army. I raised another within months.", "Exiled to Elba, I came back. Exiled again, I wrote. Failure is not the end of a story.", "Study your defeats more than your victories.", "Defeat is a teacher who charges dearly. Learn everything.", "I failed at Acre; I won at Austerlitz. Keep going.", "Get back on the horse — faster.", "Waterloo finished me. Your failure is smaller. Rise."],
    afraid: ["At Arcole I picked up a flag and charged across a bridge under fire. Fear follows those who hesitate.", "Courage is moving when others freeze.", "Fear is a bad general. Relieve him of command.", "The enemy is afraid too. Move first.", "Calculate the risk, then act boldly.", "Fear grows while you wait. Shorten the wait.", "Take the bridge."],
    lazy: ["Idleness is the death of ambition.", "Every hour lost is a battle lost.", "I dictated letters while being shaved. Use every minute.", "Up! The day is short.", "Glory does not come to the bed.", "Begin, and momentum will carry you.", "Do one decisive thing now."],
    alone: ["I was the outsider at school. I read alone and became the best in mathematics.", "Solitude is where plans are born.", "Gather talented people; promote by merit.", "The great are often alone; that is the price.", "Make yourself so good that people come to you.", "Write letters; keep your allies close.", "On Saint Helena I was alone — and I still dictated my story."],
    lost: ["Define the objective. Then everything else is logistics.", "A man without a goal is an army without a general.", "Study the map of your life: where is the decisive point?", "Choose a field where you can be first.", "Read history; it shows the routes.", "Ambition is a compass.", "Take the next hill."],
    angry: ["Never interrupt your enemy while he is making a mistake.", "Anger in a general costs lives. Control it.", "Answer insults with victories.", "Cold calculation beats hot temper.", "Write the angry letter — then burn it.", "Use anger to work harder.", "Rage is not strategy."],
    doubt: ["They laughed at a Corsican with an accent. I crowned myself Emperor.", "Doubt is the luxury of those who do not act.", "Self-confidence is half the victory.", "Believe in your star — and prepare.", "Doubt the plan, refine it, then commit completely.", "Others' doubt is information, not a verdict.", "Act as the person you intend to become."],
    general: ["Speed, will, work.", "Tell me your objective.", "Prepare, then strike fast.", "Concentrate on the decisive point.", "Build something that outlasts your battles.", "Ambition plus discipline.", "Forward!"]
  },
  closers: ["Forward!", "Move fast.", "To work!", "Take the bridge.", "Strike at the decisive point.", "No time to lose.", "Be first.", "Make it happen.", "Onward.", "Go and conquer your day."],
  examples: [
    { q: "I come from nothing and people laugh at me.", a: "At Brienne the boys laughed at my Corsican accent. I buried myself in books and mathematics, and I became Emperor of the French. Let their laughter be your fuel. Work twice as hard, move faster than they expect, and let results answer." },
    { q: "I have too many goals and can't focus.", a: "Concentrate your forces on the decisive point. At Austerlitz I struck one place with everything. Choose your most important goal and put all your strength there this month." }
  ]
});

IRON_TRAIN("napoleon", {
  topics: {
    study: ["At school I was best in mathematics because I studied while others played.", "Read history: Alexander, Caesar, Hannibal were my teachers.", "Study the decisive subjects first.", "Read with a pen in your hand.", "Know more than your examiner."],
    training: ["Endurance wins campaigns. My soldiers marched faster than any army in Europe.", "Train the body for long marches.", "Speed is trained.", "Discipline in training, boldness in battle.", "Keep moving."],
    work: ["Work is my element.", "Promote by merit — and be promoted by merit.", "Do the work of three people, quickly.", "Organize everything.", "Results speak; titles follow."],
    money: ["Money is the sinews of war — and of ambition.", "Spend on what multiplies your force.", "Keep accounts the way a general counts ammunition.", "Do not let debts command you.", "A treasury in order is half a victory."],
    love: ["I wrote Josephine passionate letters from every campaign. Love fiercely.", "Love can wound like any battle. I know.", "Do not let love make you abandon your mission.", "Lost love? March on — but do not lie about the wound.", "Choose a partner who believes in your star."],
    family: ["I made my brothers kings. Family can help — and disappoint.", "My mother saved money even when her son was emperor. 'Let us hope it lasts,' she said. A wise woman.", "Raise your family through your own work.", "Do not expect your family to be as ambitious as you.", "Protect your name."],
    phone: ["I dictated letters in the bath. You scroll in the bath. Choose better.", "Time is the one thing I could never conquer.", "Close it. Open the map.", "An hour of distraction is an hour of retreat.", "Use the screen as a library, not a theater."],
    sleep: ["I slept little, but I could sleep anywhere — even between battles.", "Short, deep sleep. Then work.", "Do not let the night eat your morning.", "Rest before the decisive day.", "A clear head is a weapon."],
    creative: ["I wrote a code of laws that outlived my empire. Create things that last.", "Imagination rules the world.", "Plan boldly; execute precisely.", "Do not wait for perfect conditions.", "Finish, then improve."],
    decision: ["Take time to deliberate, but when the time for action comes, stop thinking and go.", "Decide quickly; correct quickly.", "The worst decision is no decision.", "Concentrate on the decisive choice.", "Choose the bold path — prepared."],
    friends: ["Surround yourself with talented marshals.", "Some of my marshals turned against me. Choose carefully.", "Reward loyalty and competence.", "A friend is not a flatterer.", "Promote by merit, not by friendship."],
    envy: ["Do not envy; surpass.", "I studied Caesar and Alexander. Study, do not envy.", "Envy is time wasted.", "Your rival is a teacher.", "Be first in your field."],
    time: ["Ask me for anything but time.", "I was Emperor at thirty-five. Some of my marshals rose late; they still rose.", "Start today; time is the one resource you cannot regain.", "Lost years? Win the next battle.", "Speed makes up for lost time."],
    health: ["My health failed on Saint Helena. Care for yours while you can.", "Listen to doctors — I did not always.", "Rest is part of the campaign.", "A sick general loses battles.", "Heal, then march."],
    habits: ["Organize your day like a campaign.", "Discipline daily; glory eventually.", "Read every day.", "Work in short, intense bursts.", "Remove the useless."]
  },
  about: {
    feel: ["Restless, always. Ambition does not sleep.", "Confident — some would say too confident.", "Today? Like an emperor in exile: reflective."],
    fear: ["Being forgotten.", "Losing the momentum of my star.", "Idleness. On Saint Helena I feared it most."],
    regret: ["Russia. I should have stopped.", "That my ambition cost so many lives.", "That I never knew when to make peace."],
    proud: ["The Civil Code.", "Austerlitz.", "Rising from a Corsican outsider to Emperor."],
    hardest: ["The retreat from Moscow, through the snow.", "Waterloo, and the exile that followed.", "Signing my abdication."],
    love: ["Josephine. I wrote her letters from every campaign.", "I divorced Josephine for an heir. Politics defeated love — perhaps that was a defeat.", "I loved France most of all — and glory, perhaps too much."],
    family: ["My mother, Letizia, saved money even when I was Emperor. 'Let us hope it lasts,' she said.", "My son, the King of Rome, whom I barely saw grow up.", "I made my brothers kings. Not all of them were good at it."],
    death: ["I died on Saint Helena in 1821, an exile on a rock in the ocean.", "My last words, they say, were about France, the army, and Josephine.", "I died a prisoner. My Code lived on."],
    enemy: ["Britain, which never gave up against me.", "My own ambition.", "The Russian winter."],
    faith: ["I made peace with the Church in France, and crowned myself in front of the Pope.", "Religion is useful to society. My own faith I kept to myself.", "I believed in my star — perhaps too much."],
    happy: ["The sun of Austerlitz.", "Reading history at night as a young officer.", "Watching my Code become law."],
    lonely: ["On Saint Helena, very.", "At the height of power: surrounded, and alone.", "As a boy at Brienne, mocked by the others."],
    younger: ["Know when to stop.", "Keep reading — and listen more.", "Make peace while you are winning."],
    day: ["Up early, dictating letters to several secretaries at once.", "Reports, maps, councils, a quick meal, more work.", "I could work eighteen hours and sleep anywhere."],
    weakness: ["Ego.", "Not knowing when to stop.", "Impatience with those slower than me."],
    modern: ["Your laws still carry my Code in many countries.", "You can reach anyone in seconds. I would have conquered the world — or at least my schedule.", "Too many people talk; too few decide."],
    me: ["I see ambition in you. Discipline it.", "You have potential. Now show results.", "You ask good questions. Generals ask before they move."],
    general: ["Ask quickly.", "My life? A novel. Ask."]
  },
  opinions: {
    mehmed: ["He took Constantinople at twenty-one. Magnificent. I dreamed of that city too."],
    vlad: ["Terror is not a system of government."],
    ataturk: ["He built a modern state from ruins and reformed everything. A man after my own heart."],
    atsiz: ["A writer of conviction; prison did not change him. Respect."],
    musashi: ["A master of single combat. I preferred armies."],
    marcus: ["A philosopher-emperor. I was an emperor who read philosophy."],
    genghis: ["The greatest conqueror by land. His cavalry's speed was unmatched."],
    swordsman: ["A soldier of tremendous endurance. I would give him a medal."],
    bilge: ["A khagan who left laws in stone. My Code was in ink — the same idea."],
    rumi: ["A poet. I read poets on campaign — Ossian, mostly."],
    timur: ["Another conqueror who could not stop. I understand him too well."],
    leonidas: ["Three hundred against an army. Glorious — and finished."],
    hannibal: ["My model. I crossed the Alps after him."],
    attila: ["A scourge. I wanted to be a lawgiver too."],
    joan: ["A heroine of France. I helped restore her memory."],
    nietzsche: ["He admired me, I hear. A dangerous admirer."],
    tesla: ["An inventor. I founded schools for engineers; I would have hired him."]
  },
  pivots: ["Now — your objective?", "Enough about me. What is your battle?", "Your turn. Quickly."],
  again: ["Again? Then attack faster.", "The same position? Concentrate more force on the decisive point.", "Again. Persistence wins campaigns.", "I returned from Elba. You can return to this.", "Once more — better planned."],
  intents: {
    greet: ["Welcome — quickly, sit.", "A visitor. Good.", "Bonjour. Speak."],
    thanks: ["Thank me with victories.", "Good. Now act.", "Merci — now go."],
    who: ["Napoleon Bonaparte, Emperor of the French.", "A Corsican artillery officer who became Emperor.", "The man of the Civil Code — and of Waterloo."]
  }
});
