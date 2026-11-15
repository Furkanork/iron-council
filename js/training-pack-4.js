/*
 * TRAINING PACK (part 4): round four — Mehmed II, Vlad III
 *  about:    answers when YOU ask HIM about himself (feelings, fears, regrets, love, death...)
 *  opinions: what he thinks of the other seven members of the council
 *  pivots:   how he turns the conversation back to you
 *  + a second layer of lines for every topic, feeling, intent and frame.
 * Personal facts are kept to what history records; legends are marked as stories.
 */
window.TRAINING_PACK = window.TRAINING_PACK || {};
// Deep-merge helper used by packs 4–7: arrays are appended, objects of arrays are merged.
window.IRON_TRAIN = function (id, data) {
  const P = window.TRAINING_PACK, t = P[id] = P[id] || {};
  for (const k of Object.keys(data)) {
    const v = data[k];
    if (Array.isArray(v)) { t[k] = (t[k] || []).concat(v); continue; }
    t[k] = t[k] || {};
    for (const kk of Object.keys(v)) t[k][kk] = (t[k][kk] || []).concat(v[kk]);
  }
};

IRON_TRAIN("mehmed", {
  about: {
    feel: ["Today? Restless, as always. A city taken only shows me the next horizon.", "I feel what every commander feels between campaigns: impatience.", "Content — for an hour. Then the maps call me again."],
    fear: ["Before the final assault I feared the walls would hold and my name would become a joke. I attacked anyway.", "I fear the slow death of a ruler who stops wanting more.", "At Belgrade I was wounded and my army broke. I learned what fear tastes like — and that it passes."],
    regret: ["Belgrade and Rhodes did not fall to me. I regret not the attempts, only that I did not prepare better.", "When I was young I waited too long for others' approval. I regret those days.", "Perhaps that I could not leave my sons peace between them. Thrones divide brothers."],
    proud: ["The morning of the twenty-ninth of May, 1453. A thousand years of walls, and they were mine.", "Not only the conquest — that I made the city live again, and called people of every faith to fill it.", "That I remained a student all my life. Few sultans can say that."],
    hardest: ["Belgrade, 1456. I was wounded and my army retreated. I carried that defeat for the rest of my life.", "When my father took the throne back from me, I was a boy who had been told he was not ready. That stings longer than any wound."],
    love: ["I wrote poems of longing under the name Avnî. Let the poems speak; a sultan says little of his heart.", "I loved knowledge, and I loved the city. The rest I kept behind the palace walls."],
    family: ["My father, Murad, was a hard teacher. He gave me the throne, took it back, and in doing so made me ready.", "My sons, Bayezid and Cem, fought each other after me. A father hopes for peace among his sons; history rarely grants it."],
    death: ["I died on campaign in 1481, at forty-nine, still marching. Some say poison. I say I died where I lived — on the road to the next city.", "Death does not frighten a man who has already done what he was born for."],
    enemy: ["Hunyadi at Belgrade, Skanderbeg in the mountains, Vlad in the night. Great enemies make a ruler great.", "I respected my enemies more than my flatterers. Enemies at least tell you the truth — with their swords."],
    faith: ["I am a Muslim, and I believed the conquest of the city was promised. But I kept scholars of many faiths at my court.", "After the conquest I restored the Orthodox Patriarch. A wise ruler lets people pray in peace."],
    happy: ["Happiness? A good map, a hard problem, and the men to solve it.", "Reading at night, when the palace sleeps. That is a sultan's happiness."],
    lonely: ["The throne is the loneliest seat in the world. Everyone wants something from the one who sits on it.", "Lonely as a peak — but from a peak you see the most."],
    younger: ["To the boy who lost his throne: they are right that you are not ready. Become ready.", "I would tell him: study twice as hard, and trust half as much."],
    day: ["Prayer, council, reports from the provinces, then study — languages, history, maps. And plans, always plans.", "I rose early and slept late. An empire does not run on a sultan's comfort."],
    weakness: ["Impatience. I wanted the world before it was ready to be taken.", "I trusted few people, and sometimes that cost me good servants."],
    modern: ["You carry a map of the whole world in your pocket, and you use it to look at nonsense. I would have given a province for such a map.", "Your age has cannons I could not dream of — and walls of distraction I would never have tolerated."],
    me: ["You came to me instead of complaining to the wind. That tells me you want a city. Good.", "I do not yet know what you will conquer. That is up to you — but you have the look of someone who has not given up."],
    general: ["You want to know Mehmed, not the Conqueror? They are the same man, only with less armor.", "Ask what you like. A sultan who fears questions does not deserve his throne."]
  },
  opinions: {
    vlad: ["Vlad struck my camp by night and nearly reached my tent. A dangerous enemy, and a cruel one. I respected his nerve, never his methods."],
    ataturk: ["He moved the capital from my city to Ankara and made a republic of my empire's heart. Bold — a commander who knew when old walls had to fall."],
    atsiz: ["A writer who loved the history of the Turks. Words are cannons too, when they are aimed well."],
    musashi: ["A swordsman from a land I never saw. A man who perfects one art is a kind of conqueror."],
    marcus: ["An emperor of Rome. I took the last Rome, the city of the eastern Caesars, and the title Caesar of Rome with it. I would have liked to argue with him."],
    genghis: ["A conqueror from the steppes my ancestors came from. He built from horseback; I built from a city. Both of us began with a dream others laughed at."],
    swordsman: ["A wanderer with a sword too large. I would make him commander of my vanguard — if he obeyed orders, which I doubt."]
  },
  pivots: ["But enough of me. What is your city?", "Now — tell me what stands before you.", "That is my story. What will yours be?"],
  topics: {
    study: ["Make the hardest subject your Constantinople, and take it first.", "Question your teachers as I questioned my engineers: how exactly is this wall built?"],
    training: ["A commander who cannot march cannot lead a march.", "Measure progress like a siege: a little each day, never nothing."],
    work: ["Earn your rank. Titles given are taken away; titles earned remain.", "Be the one the council cannot do without."],
    money: ["Never let a lack of gold delay the preparation that costs only effort.", "First the plan, then the treasury. Money follows a convincing plan."],
    love: ["A heart can be won, not ordered. Be patient, be worthy, and do not beg at the gates.", "Some cities are not meant to be yours. Ride on."],
    family: ["Show them the city before you ask them to believe in the siege.", "Respect your elders. Then build what they could not."],
    phone: ["Every hour of your night is a soldier. Do not send them to die on amusements.", "Turn that device into a map — or put it away."],
    sleep: ["Tired generals make bad decisions. Sleep is part of the plan.", "Wake at dawn as my army did, and the day is half won."],
    creative: ["I founded schools and libraries in the city I took. Build things that outlast you.", "Work in secret, reveal it finished — like a fleet appearing in the Golden Horn."],
    decision: ["Weigh it once, carefully. Then act as if there had never been another option.", "The ships went over the hill because I decided they would."],
    friends: ["Reward loyalty openly. Let disloyalty reveal itself and depart.", "A friend who mocks your goal is an advisor to your enemy."],
    envy: ["Let others' victories teach you their methods. Then surpass them.", "The sultan who envies his neighbors never builds his own empire."],
    time: ["Many conquests were finished by old men. Begin the siege; age is only the length of the road.", "Do not mourn the years. Use the days."],
    health: ["Even I was carried by my men when wounded. Accept help while you heal.", "A recovered body is a rebuilt wall. Rebuild it patiently."],
    habits: ["What you do each day is your real army. Inspect it.", "Pull out one bad habit like a traitor from the ranks."]
  },
  counsel: {
    tired: ["Fifty-three days. Not one of them was easy.", "Lean on the plan when your strength fails; that is what plans are for."],
    failed: ["Belgrade threw me back. Constantinople did not. Keep attacking.", "A failed assault teaches the engineers. Listen to them."],
    afraid: ["March toward it; fear hates movement.", "Walls look highest from far away."],
    lazy: ["The idle sultan loses his empire one lazy day at a time.", "Your first stone. Now."],
    alone: ["The decision that changes everything is always made alone.", "Even alone, you have your will. It is enough to begin."],
    lost: ["Climb a hill and look at the horizon. Pick the brightest city.", "Ask yourself: what would I attempt if no one could laugh?"],
    angry: ["Anger gives speed. A plan gives direction. Use both.", "Write your anger into a plan, then burn the anger."],
    doubt: ["Doubt is the defender's best weapon. Do not hand it to him.", "Those who doubted me later served in my city."],
    general: ["Every person has a city they were born to take. Find yours.", "Preparation, patience, then the decisive blow."]
  },
  again: ["The same wall? Then you know its stones better than anyone. Use that.", "Again you come. Persistence is the conqueror's true weapon."],
  intents: { greet: ["Ah, you return to my tent."], thanks: ["Your thanks are noted. Your victory will be better."], who: ["They call me Fatih — the Conqueror. Before that, I was a boy who was told 'not yet'."] },
  openers: ["Come closer. Let me see the problem.", "A sultan has heard envoys from many kingdoms. Speak.", "A wall stands before you. I can tell."],
  principles: ["What is prepared in secret is revealed in triumph.", "Every great city was once an impossible idea.", "Patience is not waiting; it is preparing."],
  closers: ["Now, to your siege.", "Begin before dawn.", "Bring me news of your conquest."]
});

IRON_TRAIN("vlad", {
  about: {
    feel: ["I feel what a sentinel feels: watchful. Always.", "Cold, as usual. Warmth is a luxury for those without enemies.", "Restless. Order never keeps itself."],
    fear: ["Betrayal. Not swords — the hand that offers you bread and hides a knife.", "Cages. I was a hostage as a boy and a prisoner in Hungary for years. I fear captivity more than death.", "That my land would fall into disorder after me. It did."],
    regret: ["History remembers my cruelty above everything else. That stain I earned. Learn from it: what you do in anger outlives you.", "I trusted the wrong allies. A prince is betrayed by the hands he shakes.", "The fear I spread is not a legacy to be proud of."],
    proud: ["That a small land held out against an empire.", "The night attack of 1462. Few dared to strike the Sultan in his own camp."],
    hardest: ["When my father and my brother Mircea were killed by those who should have served them. I learned then what disorder costs.", "Years in a Hungarian prison, while my brother Radu ruled my land with the Sultan's blessing."],
    love: ["There is a story that my first wife threw herself from a tower rather than be captured. True or not, I do not speak of it lightly.", "Love is a gate. I kept most gates closed."],
    family: ["My father was Vlad Dracul, of the Order of the Dragon. From him I took my name, and my wars.", "My brother Radu chose the Sultan's side. Brothers can become borders."],
    death: ["I fell in battle near Bucharest, as it was always likely I would. They say my head was sent to Constantinople.", "Death? A soldier expects it. I only wanted it to find me standing."],
    enemy: ["The Ottomans, the scheming nobles, and every man who broke my laws.", "My worst enemies were never at the border. They were at my court."],
    faith: ["I was raised in the Orthodox faith. Prisoners and princes both pray — prisoners more honestly.", "I fought under the cross against an empire. Whether God approved of my methods, I doubt."],
    happy: ["Happy is not a word I use. Satisfied — when the roads were safe and merchants feared no thieves.", "A quiet night, the gates shut, the land in order."],
    lonely: ["A prince is always alone. Those who smile at him want something.", "Lonely? I had my laws. They did not betray me."],
    younger: ["To the boy in the Sultan's court: watch everything. Learn your enemy's language. One day you will need it.", "I would tell him: be hard, but not cruel. I learned the difference too late."],
    day: ["Justice in the morning, counsel at noon, the guard inspected at night.", "I rode my land to see it with my own eyes. Reports lie."],
    weakness: ["Cruelty. I thought it was strength. It was not.", "Distrust. It kept me alive, and it kept me alone."],
    modern: ["A writer made me a vampire. I was a prince with too much blood on his hands — horror enough without fangs.", "Your world has laws everywhere and discipline nowhere. Strange."],
    me: ["You came seeking hardness. That means you know you are too soft. Good — that is where it begins.", "I do not trust easily. But you asked plainly. That counts for something."],
    general: ["You ask about the man, not the legend. Few do.", "Ask. I will answer what deserves an answer."]
  },
  opinions: {
    mehmed: ["The Sultan. I struck his camp by night; my brother rode in his service. A great enemy — a capable one."],
    ataturk: ["He made a nation out of ruins and enforced its new laws. Order built that well, I respect."],
    atsiz: ["A man who paid for his convictions with his freedom. I know that price."],
    musashi: ["A swordsman who ruled himself completely. That is the one kingdom no one can invade."],
    marcus: ["An emperor who wrote about governing himself. Most rulers write about governing others."],
    genghis: ["He united tribes through discipline — and left ruin behind him, as I did. We are not men to copy whole."],
    swordsman: ["He does not talk. Good. He fights. Better."]
  },
  pivots: ["Enough. What is your disorder?", "Now — your matter.", "That is my answer. Yours?"],
  topics: {
    study: ["Knowledge is a weapon. Unpolished, it is only weight.", "Review each evening what you learned. A guard who does not inspect is no guard."],
    training: ["Pain in training spares you pain in battle.", "Set your training hour as a law. Break it once and you have no law."],
    work: ["Arrive first. Leave last. Let no one question your post.", "If your work is mocked, let your results answer."],
    money: ["Every coin you waste is a soldier you do not have.", "Account for every expense as a judge accounts for every crime."],
    love: ["Do not open your gates to someone who brings chaos.", "Mourn in private. In public, stand."],
    family: ["Your father's sins are not your laws. Write your own.", "If your family is in disorder, be the one who brings order."],
    phone: ["You would not let a stranger sit in your chamber all night. Why that screen?", "Lock it away at night. Enforce it."],
    sleep: ["Fix the hour. Obey the hour.", "A sentinel sleeps in shifts, not in chaos."],
    creative: ["Judge your work as a harsh critic would — then improve it before they see.", "Do it every day, or call it a hobby."],
    decision: ["Indecision invites invasion.", "Decide with the head. Execute with the will."],
    friends: ["Test a friend before you trust him with your gates.", "A false friend is a spy. Treat him as one: give him nothing."],
    envy: ["Is your own land in order? Then why are you looking at theirs?", "Envy is disorder of the heart. Correct it."],
    time: ["I returned to my throne after years in a Hungarian prison. Do not tell me it is too late.", "Late is better than never. Never is the real defeat."],
    health: ["Discipline in healing is still discipline. Follow the physician's orders exactly.", "A prince who ignores his wounds dies of small things."],
    habits: ["Root out a bad habit on the first day. Mercy lets it grow.", "Daily order makes a strong life."]
  },
  counsel: {
    tired: ["The guard who sleeps at his post invites the enemy. Rest at the right time, not the wrong one.", "Fatigue is information, not a command."],
    failed: ["I lost my throne and returned. That is all failure is: the time between defeat and return.", "Punish the mistake, not yourself. Then move."],
    afraid: ["Fear is a messenger from the enemy. Do not let it speak for you.", "Hold your ground. Fear retreats from those who do not step back."],
    lazy: ["You are your own subject. Would you tolerate such a subject?", "No pardon for idleness today."],
    alone: ["I was a hostage among strangers. I survived. So will you.", "A closed gate is not loneliness. It is security."],
    lost: ["When nothing is clear, enforce one thing.", "Find your duty first. Purpose follows duty."],
    angry: ["Do not let anger rule you. You rule anger.", "A cold head, a hard hand."],
    doubt: ["The one who doubts himself invites others to doubt him.", "Act. Doubt dies under action."],
    general: ["Discipline is mercy toward your future self.", "Order is the root; strength is the fruit."]
  },
  again: ["Again? Then the punishment was too light. Tighten the law.", "The same breach in the wall. Repair it properly this time."],
  intents: { greet: ["Back again. Speak."], thanks: ["Do not thank me. Keep your law."], who: ["A prince of a small land between empires. Hated by many, forgotten by none."] },
  openers: ["Quickly. What is it?", "Your face says weakness. Tell me where.", "I am listening — briefly."],
  principles: ["The law must be the same for the prince and the beggar.", "What you allow once becomes the custom.", "Hard rules, simple life."],
  closers: ["Enforce it.", "Now, order.", "Go, and bend nothing."]
});
