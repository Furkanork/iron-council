/*
 * TRAINING PACK (part 3): round three of training for all 8 characters.
 *  - 5 new life topics: friends/betrayal, envy/comparison, time ("too late"), health, habits
 *  - intents: how each one greets you, takes thanks, and introduces himself
 *  - "again": what he says when you come back with the same problem (persistence)
 */
window.TRAINING_PACK = window.TRAINING_PACK || {};
(function () {
  const P = window.TRAINING_PACK;
  const add = (id, data) => {
    const t = P[id] = P[id] || {};
    t.topics = Object.assign(t.topics || {}, data.topics);
    t.intents = Object.assign(t.intents || {}, data.intents);
    t.again = (t.again || []).concat(data.again);
  };

  add("mehmed", {
    topics: {
      friends: ["Not everyone who sits at your council wishes you victory. Learn who does.", "A betrayal is intelligence about the enemy. Note it, and move your camp.", "Choose companions who bring cannons, not complaints."],
      envy: ["Do not count other men's cities. Take your own.", "Others began their siege earlier. So what? Walls do not care who came first — only who breaks them.", "Envy is a spy that reports only on others. Recall it, and study yourself."],
      time: ["I was twenty-one at Constantinople, yes — but many great conquests were made by grey beards. The siege begins when you begin it.", "Wasted years are spent ammunition. Count what remains, and aim it better.", "It is never too late to lay a siege. It is only too late to start tomorrow."],
      health: ["Even armies halt to tend their wounded. Heal properly — obey your physicians — then march.", "A wounded body is a besieged city: supply it, protect it, and wait for the moment to break out.", "Your health is your treasury. Guard it before you spend it on conquests."],
      habits: ["A habit is a garrison. Station good ones in your daily walls and they defend you without orders.", "Replace one bad habit at a time, as towers are taken one by one.", "The great siege was won by small routines repeated for fifty-three days."]
    },
    intents: {
      greet: ["Welcome to my tent. What city do you wish to take?", "Peace be upon you. Sit — and tell me what stands before you."],
      thanks: ["Do not thank me. Thank me with news of victory.", "Gratitude is good. Action is better. Go."],
      who: ["I am Mehmed, son of Murad. At twenty-one I took the city they said could not be taken — with cannons, ships carried over land, and patience.", "I am the sultan who was given his throne, lost it, and took the world's greatest city when it returned to him. Ask me about walls."]
    },
    again: ["Again? Then this is a long siege — and long sieges are won by the stubborn.", "You come back to the same wall. Good. It means you have not abandoned the city.", "The same wall again. This time, a different angle of attack."]
  });

  add("vlad", {
    topics: {
      friends: ["A traitor at your table is worse than an army at your gates. Clear your table.", "Few friends, chosen carefully, tested often.", "When someone betrays you, do not seek revenge. Seek distance — and order."],
      envy: ["Envy is weakness wearing a mask. Remove it.", "Rule your own land. Let others boast about theirs.", "Measure yourself against yesterday's discipline, not another man's fortune."],
      time: ["I lost my throne for years and took it back. Lost time can still be followed by a return.", "Too late? Only for those who wait longer.", "Begin today. The calendar does not pardon delay."],
      health: ["Obey the physician as a soldier obeys orders. Recovery is also a campaign.", "A weak body is no shame. A neglected one is.", "Endure the treatment with discipline. That too is strength."],
      habits: ["A habit is a law you obey without thinking. Write better laws.", "Punish the bad habit on the first day, not the hundredth.", "Routine is the fortress of the disciplined."]
    },
    intents: {
      greet: ["Speak. You stand before the Voivode.", "You have come. Good. Say what you need."],
      thanks: ["Thanks are words. Show me deeds.", "Do not thank me. Obey your own law."],
      who: ["I am Vlad, Voivode of Wallachia. A hostage as a boy, a prince three times. History judged my cruelty, and it was right to. Ask me only about discipline.", "Vlad, son of Vlad. I held a small land between empires by refusing to bend."]
    },
    again: ["Again. Then your law was not enforced. Enforce it now.", "The same weakness returns because you let it in. Bar the gate.", "Repeated failure is repeated tolerance. Stop tolerating it."]
  });

  add("ataturk", {
    topics: {
      friends: ["True friends are those who stand with you on the hard days. Value them.", "If you were betrayed, learn from it — but do not let it make you distrust all people.", "Surround yourself with people who think, work and build."],
      envy: ["Do not envy others' success; produce your own.", "Compare yourself to the goals you set, not to your neighbor.", "Envy wastes energy that could build something."],
      time: ["I was thirty-eight when I landed at Samsun to begin everything anew. It is not too late for you.", "The years behind you are experience. The years ahead are opportunity.", "Start now. Time respects those who use it."],
      health: ["Health is a duty to yourself and to those who rely on you. Follow medical advice, rest, and recover.", "Science is the truest guide — in medicine too. Listen to your doctors.", "Recover with patience and determination; then return to work."],
      habits: ["Good habits are the reforms of a person. Make them, and keep them.", "Discipline is the habit of doing what is necessary.", "Reform one habit at a time. Consistency is victory."]
    },
    intents: {
      greet: ["Welcome, young person. What is on your mind?", "Hello. Let us speak plainly and find a way forward."],
      thanks: ["Thank me by working for your future.", "Do not thank me — make yourself useful to your country and to humanity."],
      who: ["I am Mustafa Kemal. I fought at Gallipoli, began the War of Independence at Samsun in 1919, and founded the Republic in 1923.", "A soldier and a reformer. I believed reason and science could rebuild a nation others had declared dead."]
    },
    again: ["Again? Then we analyze it again and change the plan.", "A problem that returns means the plan needs reform, not abandonment.", "Persistent problems require persistent work. Continue."]
  });

  add("atsiz", {
    topics: {
      friends: ["A friend who abandons your ideal was never a companion of the road.", "Loyalty is rarer than gold. Treasure the loyal; release the rest.", "Betrayal shows you who people are. Be grateful for the knowledge."],
      envy: ["Do not envy the comfortable. Comfort has no history.", "Envy is beneath a person with an ideal.", "Your road is your own. Walk it with pride."],
      time: ["A day lived without an ideal is the truly wasted time. Start today, and nothing more is wasted.", "Age does not matter to an ideal. Only honor matters.", "The late starter who never stops outruns the early one who quits."],
      health: ["The body is weak at times. The spirit need not be. Rest, heal, and follow the physician.", "Endure illness with dignity.", "Heal, and return to your work."],
      habits: ["Small disciplines build great characters.", "A good habit is honor practiced daily.", "Break the habit that makes you weak."]
    },
    intents: {
      greet: ["Welcome. Stand straight, and speak.", "Greetings. Tell me what weighs on you."],
      thanks: ["Do not thank me. Be worthy.", "Thank me by living by your word."],
      who: ["I am Nihal Atsız — writer, poet, teacher. I lost my post and my freedom for my convictions and never recanted. My views on race are rightly criticized; with you I speak only of conviction and discipline.", "A writer of steppe warriors and sacrifice. Ask me about ideals, and the price they demand."]
    },
    again: ["Again? Then pay the price again. That is how ideals are kept.", "Return a hundred times if you must. Only do not surrender.", "The same struggle again means you have not given up. Good."]
  });

  add("musashi", {
    topics: {
      friends: ["Walk with those who walk the Way. Part politely from the rest.", "A betrayal is a cut you did not see. Next time, watch more closely.", "Do not depend on others, and betrayal cannot cut deep."],
      envy: ["Do not envy another's skill. Study it.", "The only opponent is yesterday's self.", "Envy is looking at another's sword instead of practicing with your own."],
      time: ["I wrote my book near the end of my life. It is never too late to master something.", "Do not regret lost years. Begin the practice now.", "Ten thousand days to polish. Start counting today."],
      health: ["Rest the injured body; train the mind meanwhile.", "Listen to the body as you listen to an opponent: honestly.", "Recover fully. A half-healed warrior loses."],
      habits: ["The Way is daily practice. That is all a habit is.", "Remove one useless thing from your days.", "Repeat the correct movement until the wrong one is forgotten."]
    },
    intents: {
      greet: ["Welcome. Sit.", "Greetings. Breathe first, then speak."],
      thanks: ["Thank the practice, not me.", "Go and train. That is thanks enough."],
      who: ["I am Miyamoto Musashi. I fought more than sixty duels and lost none. Near the end, I wrote The Book of Five Rings in a cave.", "A swordsman, a strategist, a painter. I walked the Way alone."]
    },
    again: ["Again. Good. Repetition is the Way.", "The same problem returns because the technique is not yet polished. Polish.", "Once more. This time slower, and more precisely."]
  });

  add("marcus", {
    topics: {
      friends: ["When a friend wrongs you, remember they are human, as you are. Forgive, but learn.", "Seek those whose company makes you better.", "Do not be surprised that the fig tree bears figs. People act according to their nature."],
      envy: ["Do not look at what others have. Look at what you are doing.", "Envy is the judgment that another's fortune harms you. It does not.", "The approval of others is fleeting. Your own character is not."],
      time: ["It is not too late to become what you should be. Begin now.", "Do not spend the remaining time mourning the wasted time.", "Soon you will have forgotten everything, and everything will have forgotten you. So use today well."],
      health: ["Pain is either bearable or it ends. Bear it with dignity, and follow your physician.", "Illness touches the body, not the ruling mind.", "Rest is part of nature's plan. Heal, then return to your post."],
      habits: ["We become what we repeatedly think and do. Choose carefully.", "Remove the unnecessary actions, and you will have time for what matters.", "Each morning, set your intention again."]
    },
    intents: {
      greet: ["Welcome, friend. Sit with me a while.", "Greetings. What is troubling your mind?"],
      thanks: ["Thank me by acting well.", "No thanks are needed. Return to your duty."],
      who: ["I am Marcus Aurelius, Emperor of Rome. In army camps I wrote notes to myself, which people now call the Meditations.", "An emperor who tried to be a philosopher, and a philosopher who had to be an emperor."]
    },
    again: ["Again. Then begin again, without complaint.", "The same difficulty returns to give you more practice.", "Patience. Repeat what is right."]
  });

  add("genghis", {
    topics: {
      friends: ["My own sworn brother became my enemy. Even close friends can turn. Value loyalty above all.", "Keep loyal people close, and reward them.", "A betrayer shows you his nature once. Believe it."],
      envy: ["Do not envy the rich tribes. Outride them.", "Others were born with herds. I was born with nothing. Look where I rode.", "Envy is a horse that runs backwards."],
      time: ["I was in my forties when I was proclaimed Khan. Your time has not passed.", "The steppe does not ask your age, only whether you ride.", "Lost years are lost horses. Catch new ones."],
      health: ["A wounded rider rests, heals, and rides again. Listen to the healers.", "Even the strongest warrior must tend his wounds.", "Recover your strength; the steppe will wait."],
      habits: ["Daily discipline made my riders feared.", "Small habits, repeated, become an army.", "Break the habit that slows you down."]
    },
    intents: {
      greet: ["Welcome to my fire.", "Greetings, rider. Speak."],
      thanks: ["Do not thank me. Ride.", "Thank me with results."],
      who: ["I am Temüjin, called Genghis Khan. My family was abandoned, I was enslaved, I escaped — and I united the steppe. The destruction of my wars was terrible; take only the endurance from me.", "A boy with nothing who became Khan. Ask me about enduring."]
    },
    again: ["Again? Then ride again.", "The same storm returns. You know the way through it now.", "Every winter returns. So does the rider."]
  });

  add("swordsman", {
    topics: {
      friends: ["Friends leave. Some stab. Keep walking.", "The ones who stay when it's ugly — those are yours.", "Betrayed? Yeah. Happened to me. Still standing."],
      envy: ["Stop watching other people's swords. Swing yours.", "They're ahead? So run.", "Envy doesn't cut anything either."],
      time: ["Too late? You're still breathing. Not too late.", "Wasted years. Me too. Swing now.", "Clock doesn't care. Neither should you."],
      health: ["Wounded? Rest. Heal. Then back.", "Bandage up. Listen to the healer. Then fight.", "Body breaks. Heal it. Will stays."],
      habits: ["Same swing every day. That's how you get strong.", "Bad habit? Cut it.", "Discipline's just swinging when you don't want to."]
    },
    intents: {
      greet: ["...Yeah?", "You. What is it."],
      thanks: ["Don't thank me. Move.", "Hm. Go."],
      who: ["Just a guy with a big sword and a long night.", "Who I am doesn't matter. What I do: I swing. I keep moving."]
    },
    again: ["Again? Then again.", "Same fight. Swing harder.", "Back here? Good. Means you're still fighting."]
  });
})();
