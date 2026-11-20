/* ROUND 6 TRAINING: Napoleon Bonaparte — memory, oath, council, and full lines for feelings */
IRON_TRAIN("napoleon", {
  recall: [
    "Last time you reported on {topic}. I read every report twice. Give me the new one — facts, not feelings.",
    "{topic}. I have not forgotten. A campaign is judged by the second week, not the first day. Where are you?",
    "You came to me about {topic}. Did you act on my orders, or did you hold a council of excuses?",
    "I remember {topic}. Positions change daily. Tell me yours.",
    "We discussed {topic}. Time is the one thing I cannot give you more of. What did you do with it?"
  ],
  goalAsk: [
    "Your objective: “{goal}”. I conquered Italy at twenty-six. What territory did you take today?",
    "“{goal}”. Good. Now — the plan, the resources, the timetable. Which part is missing?",
    "You named it: “{goal}”. A goal without a schedule is a dream; I do not command dreams.",
    "I keep your goal in my dispatches: “{goal}”. Report progress.",
    "“{goal}”. Concentrate your forces on it. What did you waste them on instead today?"
  ],
  oathTake: [
    "“{oath}”. Noted in the order of the day. Execute it.",
    "Good. A precise order: “{oath}”. Speed is everything — begin within the hour.",
    "I have your word: “{oath}”. I judge men by what they finish.",
    "“{oath}”. Tomorrow I will ask for the bulletin. Make it a victory bulletin.",
    "Sworn. “{oath}”. At Austerlitz we waited for the fog to lift, then struck. Your fog lifts now."
  ],
  oathKept: [
    "Kept. Excellent. This is how marshals are made — one fulfilled order at a time.",
    "A victory. Small, but victories create momentum. Tomorrow, another.",
    "Kept. You did what you said, which already places you above most men I commanded.",
    "Bravo. Write it in your journal. Glory is recorded, not remembered.",
    "Done. I would give you a medal, but you will give yourself something better: the habit."
  ],
  oathBroken: [
    "Broken. I lost at Leipzig and still returned from Elba. Return tomorrow.",
    "You were defeated by a smaller enemy than Russia's winter. Know your weakness and plan for it.",
    "Not kept. A general who loses must study why: the plan, the supplies, or the will?",
    "Excuses are worthless in war. Results are everything. Swear again and deliver.",
    "Broken. Very well. Smaller objective, earlier hour, no retreat."
  ],
  agree: [
    "{name} is correct. I would sign that order.",
    "I agree with {name}, and I would act faster.",
    "{name} understands command."
  ],
  disagree: [
    "{name} is too slow. In war, hesitation is fatal.",
    "{name} has courage but no system. Courage without organization loses.",
    "I disagree with {name}. Sentiment is not strategy."
  ],
  counsel: {
    tired: ["I could sleep a few hours and work for twenty; it is said I slept on horseback. But I also napped whenever I could. Learn that part too.", "Fatigue is the soldier's constant companion. March, rest, march again. Never confuse a pause with a retreat.", "A tired mind makes poor decisions. Take an hour of sleep before a big one.", "In Russia my army died of cold and exhaustion. Do not push beyond your supply lines.", "Rest as a tactic, not as surrender."],
    failed: ["I failed in Russia, at Leipzig, and at Waterloo. I am still remembered for Austerlitz. Failures do not cancel victories.", "After Elba I returned to France with a thousand men and took Paris without a shot. Failure is not final unless you accept it.", "Analyze defeat coldly. I dictated my campaigns on Saint Helena to understand them.", "One lost battle is information. Two lost battles with the same mistake is stupidity.", "A defeated general who blames everyone else learns nothing."],
    afraid: ["At the bridge of Arcole I took the flag and advanced under fire. Fear is overcome by action, not by thinking.", "Courage is not the absence of fear; it is the presence of decision.", "The enemy fears you too. Remember that.", "Prepare thoroughly, and fear has less to feed on.", "Act decisively; a decision ends half of your fear."],
    lazy: ["I worked eighteen hours a day. You only need to start the first.", "Activity is the soul of war — and of life.", "Time lost can never be regained. Begin now.", "A lazy army is a defeated army before the battle starts.", "Give yourself orders, then obey them like a soldier."],
    alone: ["On Saint Helena I was alone, guarded by the English. Still I wrote and planned. Solitude can be used.", "Power is lonely. Few people speak honestly to an emperor.", "Choose loyal companions. I had marshals who stood by me, and some who did not.", "Loneliness is a time to plan your next campaign.", "Write letters. I wrote thousands. Words keep people close."],
    lost: ["When the Revolution threw France into chaos, I found my place in the army. In chaos, find the role you can play.", "Ask what you are best at, then go where that skill is needed.", "Lost? Then make a plan, any plan. A bad plan can be corrected; no plan cannot.", "Destiny is something you seize, not something you wait for.", "Choose a direction and march. Clarity comes from movement."],
    angry: ["In anger I made mistakes with people. Control your temper; it is a weapon others will use against you.", "When your opponent is making a mistake, stay quiet and let him finish it. Stay cold.", "Anger wastes energy that should go to planning.", "Use anger as fuel for work, not words.", "A general who loses his temper loses his men."],
    doubt: ["I was a minor nobleman from Corsica with a heavy accent. In France they mocked me. I became Emperor.", "Doubt is useful before the decision, harmful after it.", "If you start to doubt, look at what you have already done.", "The word impossible is for people who stopped trying too early.", "Self-confidence is built by victories. Win small ones first."],
    general: ["Victory goes to the side that keeps going longest.", "Organize, then act swiftly.", "Do something worth remembering. Comfort is forgotten the moment it ends.", "Speed, concentration, surprise.", "A leader gives his men hope and a plan — never only one of them."]
  }
});
