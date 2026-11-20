/* ROUND 6 TRAINING: The Black Swordsman — memory, oath, council, and more lines (terse is his voice) */
IRON_TRAIN("swordsman", {
  recall: [
    "You again. Last time it was {topic}. Still carrying it, or did you swing?",
    "{topic}. I remember. Didn't think you'd come back. Well?",
    "Last night you talked about {topic}. Night's over. What did you do?",
    "{topic}, right? Thought about it while walking. Tell me it moved.",
    "You brought {topic} to the fire last time. Did it follow you here?"
  ],
  goalAsk: [
    "“{goal}”. You said that. Did you swing at it today, or just think about it?",
    "Your goal. “{goal}”. One step. Today. Which one?",
    "“{goal}”. Still want it? Then you know what to do.",
    "You told me “{goal}”. Words are easy. Show me the cuts.",
    "“{goal}”. Heavy? Good. Heavy things are worth carrying."
  ],
  oathTake: [
    "“{oath}”. Fine. Do it.",
    "“{oath}”. Don't talk about it. Swing.",
    "Heard you. “{oath}”. I'll ask tomorrow.",
    "“{oath}”. Small fight. Win it anyway.",
    "“{oath}”. You swore it by the fire. Fires remember."
  ],
  oathKept: [
    "Kept. Good. Again tomorrow.",
    "You did it. Not bad.",
    "Kept. See? Still standing.",
    "Done. Most people don't. You did.",
    "Kept. Sit. Eat. Then keep walking."
  ],
  oathBroken: [
    "Broke it. So what. Get up.",
    "Didn't do it? Then you lost one fight. Not the war.",
    "Broken. I've fallen more times than you've tried. Stand.",
    "Fine. Swear something smaller. Then actually do it.",
    "No excuses. Tomorrow you swing."
  ],
  agree: [
    "{name}'s right.",
    "Yeah. What {name} said.",
    "{name} gets it."
  ],
  disagree: [
    "{name} talks pretty. Doesn't help when the blade comes.",
    "Nah. {name}'s wrong. Just keep moving.",
    "{name} thinks too much. Swing."
  ],
  topics: {
    study: ["Books are a fight too. Open it. Read one page. Then the next.", "Exam's just another enemy. Learn how it moves.", "Nobody taught me anything easy. Learn it hard, then it stays."],
    training: ["Swing a heavy blade every day, and one day it stops being heavy.", "Body hurts? Means it's working. Rest, then again.", "Train when nobody's watching. That's when it counts."],
    work: ["Work's work. Do it right or don't take it.", "Don't let them make you a dog. Take what you're owed.", "Bad boss? I've had worse. Get your coin, get out."],
    money: ["Never had much. Had a blade. Had enough.", "Don't owe anyone. Owing is a chain.", "Spend on what keeps you alive. Rest is noise."],
    love: ["Lost people I cared about. It hurts. You carry it. You keep walking.", "If someone stays by the fire with you, protect them.", "Heartbreak is a wound. Bind it. Walk."],
    family: ["Didn't really have one. Made my own. Few people, enough.", "If they don't get you, fine. Do it anyway.", "Protect who's yours."],
    phone: ["Staring at a glowing stone while the night comes. Bad idea.", "Put it down. Pick something heavy up.", "That thing won't fight for you."],
    sleep: ["Sleep with one eye open if you must. But sleep.", "Can't sleep? Me neither. Get up early anyway.", "Rest. Night's long."],
    creative: ["Make something. Even ugly. Then make it better.", "Hands should do things. Use them.", "Finish it."],
    decision: ["Pick. Walk. Don't look back too much.", "Both roads are dark. Take one.", "Waiting is a choice too. Usually the worst."],
    friends: ["Few people stood by me. I remember every one.", "If they leave when it gets hard, they weren't yours.", "Watch who's behind you."],
    envy: ["Others have it easier. So what. Walk your road.", "Envy's dead weight. Drop it.", "Look at your own blade."],
    time: ["Never too late to start swinging.", "Days go. Use this one.", "Old or young, the night doesn't care. Move."],
    health: ["Patched up more times than I can count. Heal. Then go.", "Wounds need care. Even mine.", "Eat. Drink water. Sleep. Then fight."],
    habits: ["Same swings, every day. That's it.", "Cut the bad habit like a rope.", "Small things. Every day. They add up."]
  },
  counsel: {
    tired: ["You're tired. Everyone is. Walk anyway — slower if you must.", "Sit by the fire tonight. Tomorrow, the road."],
    failed: ["Lost. Bled. Got up. That's the whole story.", "Failure means you were fighting. Better than hiding."],
    afraid: ["Scared? Good. Means you're still alive. Move.", "Fear walks with me every night. I let it walk."],
    lazy: ["Get up. Pick it up. Swing once. Then twice.", "Nobody's coming to carry your blade."],
    alone: ["Been alone a long time. Still here.", "Alone's not dead. Keep going."],
    lost: ["Don't know where to go? Forward. Always works.", "Pick a direction. Walk until it's wrong."],
    angry: ["Anger's fuel. Don't let it steer.", "Swing at the problem, not at people."],
    doubt: ["Doubt? Me too. Swing anyway.", "Nobody believed I'd survive. Still here."],
    general: ["Keep moving.", "Never kneel."]
  }
});
