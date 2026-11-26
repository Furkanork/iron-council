/* CAMPAIGNS (part 3): Joan's courage, Tesla's deep work, Leonidas's endurance, Rumi's patience. Same shape as campaigns.js. */
window.CAMPAIGNS = (window.CAMPAIGNS || []).concat([
  {
    id: "courage", leader: "joan", title: "The Standard: Fourteen Days of Courage", kind: "Courage",
    about: "One frightening thing every day, small at first and bigger by the end, until fear is something you walk through instead of around.",
    focusQ: "What is the fear you most want to face?", focusHint: "e.g. speaking up in class, asking for a job, phoning someone, being seen", focusDefault: "your fear",
    rules: ["Courage is not the absence of fear. Do each task while afraid; do not wait until you feel ready.", "Never do anything dangerous or unkind to yourself or anyone else. The fear should be about being embarrassed, refused or wrong, not about being hurt.", "Write down, after each task, how big the fear was before (0–10) and after. You will see it shrink.", "If you are facing something truly heavy, take a trusted person with you. A banner is easier to carry when someone walks beside it."],
    start: "I was afraid, and I went anyway. Fear does not leave first; it walks beside you. For fourteen days you will pick the thing in front of you and carry the standard forward, one step at a time.",
    days: [
      { task: "Write down {focus} and everything it makes you imagine going wrong. Then write the most likely outcome.", word: "Name the enemy first. A named fear is half as large." },
      { task: "Do one small uncomfortable thing today: speak first to someone, or say your honest opinion once.", word: "The first step costs the most. Take it small." },
      { task: "Ask for something you have been afraid to ask for, even a tiny thing. A no is allowed.", word: "A refusal has never killed anyone. Asking is the courage." },
      { task: "Do one task you have been putting off because it scares you. Ten minutes is enough to begin.", word: "Begin, and the road appears under your feet." },
      { task: "Say sorry, or say thank you, to someone you have been avoiding.", word: "There is courage in a humble word." },
      { task: "Stand up for something you believe, calmly, in a conversation where you would normally stay quiet.", word: "Speak the truth you carry. Say it without cruelty." },
      { task: "Rest. Write what you have learned from the first six days, and what surprised you.", word: "Even the army rested before the next battle." },
      { task: "Do one step toward {focus}, a real step, however small.", word: "Go at it boldly; do not stand and stare." },
      { task: "Do something where you might look foolish: sing, ask a question aloud, try something you are bad at.", word: "A person who cannot be foolish cannot be brave." },
      { task: "Tell one person your real plan or your real worry, the one you usually hide.", word: "A hidden fear grows in the dark. Bring it into the light." },
      { task: "Take a decision you have been delaying, and decide it before sunset.", word: "To decide is to be free of the weight of deciding." },
      { task: "Face {focus} directly for a longer time than yesterday. Do not look away.", word: "The bigger the step, the smaller the fear behind it." },
      { task: "Help someone else be brave: encourage them, go with them, or stand by them.", word: "Courage spreads from one heart to the next." },
      { task: "Write your own banner: one sentence you will carry into hard days. Then do one last frightening thing.", word: "Carry the standard. Do not put it down." }
    ],
    finish: { great: "You carried the standard for fourteen days. Fear did not leave, and you stopped asking it for permission. Walk on.", good: "Most days you went forward. The ones you missed were only where the road got steep. Take up the banner again.", poor: "It was heavy this time. That is no shame; I was afraid at every step. Begin again with something smaller, and begin today." }
  },
  {
    id: "deepwork", leader: "tesla", title: "The Quiet Laboratory", kind: "Deep work",
    about: "Fourteen days of protected, uninterrupted thinking, a little longer each day, on the one problem that matters.",
    focusQ: "What is the one problem or piece of work you will think about?", focusHint: "e.g. my thesis chapter, the app, a hard maths topic, a design", focusDefault: "your work",
    rules: ["Deep work means one task, phone out of the room, notifications off, no tabs unrelated to it. If you break the rule, restart the timer.", "The blocks below are the minimum. If you stop early because you are tired, write down the time and try again tomorrow; do not pretend.", "Keep a paper notebook beside you for stray thoughts and urges. Write them down and return to the work.", "Sleep counts. A tired mind is not a laboratory."],
    start: "I did my best work in my head before I touched a tool. The mind needs quiet and a clear question. For fourteen days you will build that quiet on purpose, hour by hour, and put it to work on the one thing that matters.",
    days: [
      { task: "One 25-minute block of deep work on {focus}. Phone in another room. Then write down how it went.", word: "Begin with a short silence. The mind needs a trial before a long task." },
      { task: "Two 25-minute blocks with a 5-minute walk between. No screens during the walk.", word: "The best ideas come when the body walks and the mind lets go." },
      { task: "One 40-minute block first thing in the day, before messages.", word: "Give the first hour to the mind; the world can wait." },
      { task: "Write the problem in {focus} as a single clear question, then work on only that question for 40 minutes.", word: "A well-posed question is already half answered." },
      { task: "Two 40-minute blocks. Keep a notebook beside you for distractions.", word: "Write the interruption down; it will still be there later." },
      { task: "Work 40 minutes with no music or noise at all. Notice how it feels.", word: "Silence is not empty; it is full of things not yet thought." },
      { task: "Rest day: no deep work. Walk, sleep, and let the problem turn over in your mind.", word: "The mind keeps working when we stop pushing it." },
      { task: "One 50-minute block and one 25-minute block on {focus}.", word: "Longer now. Hold the thread." },
      { task: "Before you work, picture the finished result in detail for five minutes. Then work 50 minutes.", word: "I saw each machine whole before I built it. See yours." },
      { task: "Two 50-minute blocks, with a real break in between.", word: "Rhythm matters: work hard, rest fully, return." },
      { task: "Do one 60-minute block with nothing but {focus}. If you drift, note it and return.", word: "The hour is where it begins to feel like flight." },
      { task: "Teach or explain the problem aloud to an empty room or a friend for ten minutes, then work 50 minutes on the gap you found.", word: "What you cannot explain, you have not yet understood." },
      { task: "Two 60-minute blocks. Stop every notification. Sleep early tonight.", word: "A rested mind sees what a tired one misses." },
      { task: "One long block, 75 minutes or more, then write down what you made and what you will do with this skill from now on.", word: "You built a laboratory in your head. Keep it open." }
    ],
    finish: { great: "Fourteen days of quiet, and the work shows. You have built the one skill the noisy world is losing. Keep the laboratory open.", good: "Most blocks were kept. The thread is held. Keep the short blocks daily and the long ones when you can.", poor: "The noise won more days than the work. Begin again with the first 25-minute block; the habit is smaller than you think." }
  },
  {
    id: "hotgates", leader: "leonidas", title: "The Hot Gates", kind: "Endurance",
    about: "Fourteen days of holding your post: small hardships you choose, tasks you finish when you want to stop, and one hard thing you do not abandon.",
    focusQ: "What is the post you will hold? (the hard thing you keep coming back to)", focusHint: "e.g. my revision, my training, my job search, caring for someone", focusDefault: "your post",
    rules: ["Endurance is chosen discomfort in a measured dose: cold water, a late finish, a hard last set. Never anything that injures you.", "Do not start the day's task and then quit halfway. Do it all, or do a smaller version completely.", "No complaining aloud today about the task itself. Note it in a notebook if you must.", "Eat, drink and sleep properly. A soldier who starves himself is no use at the pass."],
    start: "At the pass there were three hundred of us and a thousand reasons to leave. We held, because holding was the whole task. For fourteen days you hold your post. Not forever, only today, and again tomorrow.",
    days: [
      { task: "Hold your post: work on {focus} for 30 minutes without stopping, no matter how it feels.", word: "The pass is held one minute at a time." },
      { task: "Finish the task you started yesterday, however you feel about it.", word: "Do not leave the field half won." },
      { task: "End your shower with 30 seconds of cold water. Breathe slowly.", word: "A small cold teaches the body that it can bear more." },
      { task: "Do a hard physical set: one more round than you want to.", word: "The last round is where the pass is held." },
      { task: "Go a whole day without complaining aloud. Count the slips.", word: "A soldier who complains is already half defeated." },
      { task: "Wake up 30 minutes earlier than usual and spend them on {focus}.", word: "Rise before the enemy does." },
      { task: "Rest day: sleep, eat well, check what the post needs tomorrow.", word: "Even a phalanx rotates its tired line to the rear." },
      { task: "Hold your post for 60 minutes of focused work on {focus}. No phone.", word: "Stand your ground. They come in waves." },
      { task: "Do something you have been avoiding because it is long and dull. Finish it.", word: "Endurance is mostly boredom, held." },
      { task: "Skip one comfort for a day (sugar, scrolling, or a snack) and notice the urge pass.", word: "An urge is a wave. It rises, and it falls." },
      { task: "Go for a long walk or ride, 60 minutes or more. Do not turn back early.", word: "The long road is the real training." },
      { task: "Work at {focus} even when you have no mood for it. Do the hardest part first.", word: "Mood is a poor general. Discipline marches anyway." },
      { task: "Help a tired person near you: carry something, finish something, stay beside them.", word: "A line holds because each man holds his neighbour." },
      { task: "Final stand: a long block on {focus}, harder than any so far, then write what you now know you can bear.", word: "Three hundred is enough, if each one holds." }
    ],
    finish: { great: "Fourteen days and you did not leave your post. This is what holds a line. Spartans would take you in.", good: "Most days you held. The missing ones are only where the wind was hard. Stand again.", poor: "The line broke this time. It happens to every army. Re-form at dawn with a smaller post, and hold that." }
  },
  {
    id: "patience", leader: "rumi", title: "The Patient Garden", kind: "Patience",
    about: "Fourteen small practices in waiting, listening and not rushing, for the person who wants everything now.",
    focusQ: "What are you impatient for?", focusHint: "e.g. an answer, results, healing, a reply, a better job", focusDefault: "what you are waiting for",
    rules: ["Patience is not passivity. Each day still has a task, but you do not look at the result today.", "Whenever you feel the urge to check or rush, stop for three slow breaths before you decide.", "Do not compare your pace with anyone else's. A rose and an oak grow on different clocks.", "Be as gentle with yourself as you would be with a small child who is learning."],
    start: "The garden is not planted and harvested on the same day. You are waiting for something, and I will walk with you. For fourteen days you will practise the slow art of waiting well, tending what is in your hands and leaving the rest to time.",
    days: [
      { task: "Sit for five minutes without any screen. Notice what hurries inside you.", word: "Let the water settle and it shows the moon." },
      { task: "Write what you are waiting for in {focus}, and what is in your hands today.", word: "Tend what is yours. Let the rest ripen." },
      { task: "Do one slow thing slowly: a meal, a walk, a cup of tea. Do nothing else while you do it.", word: "Slowness is a way of tasting your life." },
      { task: "When you feel the urge to check, refresh, or ask, wait ten minutes first. Do this all day.", word: "Between the urge and the act, there is a garden." },
      { task: "Listen fully to one person without planning your answer.", word: "Listening is the first form of love." },
      { task: "Plant something, water a plant, or care for a small living thing.", word: "Everything that grows asks for patience." },
      { task: "Rest. Take a long walk or a nap and let the day be empty of results.", word: "The seed grows when you are not looking." },
      { task: "Do a hard task in small calm steps; stop every 20 minutes to breathe.", word: "Hurry is a kind of fear. Breathe, and it softens." },
      { task: "Write a kind letter to yourself from a year from now. What do they say to you about {focus}?", word: "The one who has arrived knows how the road went." },
      { task: "Forgive one small thing today, in a person or in yourself.", word: "Holding a grudge is carrying a hot coal." },
      { task: "Spend one hour with no phone. Let boredom come and see where it leads.", word: "In emptiness the heart begins to speak." },
      { task: "Say to yourself three times: 'I do not need to know yet.' Then do today's work anyway.", word: "Not knowing is the beginning of seeing." },
      { task: "Thank someone for waiting for you, or for something that took them time.", word: "Gratitude turns waiting into company." },
      { task: "Write what the waiting taught you, and one thing you will keep doing slowly for the rest of your life.", word: "What you seek is also seeking you. It arrives in its own time." }
    ],
    finish: { great: "Fourteen days of tending without grasping. The garden is yours now: you may wait well for anything. Peace be with you.", good: "Most days were patient ones. The impatient days are part of the garden too. Come back to it.", poor: "The hurry was strong this time. Be gentle. Begin again with one slow breath, which is all a beginning needs." }
  }
]);
