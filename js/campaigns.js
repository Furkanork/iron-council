/* CAMPAIGNS — 14-day programs led by one member. Each day's task becomes that day's oath, sworn to the leader. */
window.CAMPAIGNS = [
  {
    id: "way", leader: "musashi", title: "Fourteen Days of the Way", kind: "Discipline",
    about: "Small, exact daily practices. By the end, discipline is no longer a decision — it is a habit.",
    start: "You have chosen the Way. For fourteen days, you will do one small thing each day, completely. Do nothing which is of no use.",
    days: [
      { task: "Wake at a fixed time and make your bed immediately.", word: "The first cut of the day decides the rest." },
      { task: "Work 25 minutes on your most important task with the phone in another room.", word: "One opponent at a time." },
      { task: "Clean and order your desk or workspace completely.", word: "A warrior's tools are always ready." },
      { task: "Write down three things you did badly yesterday, and one fix for each.", word: "See clearly, without excuses." },
      { task: "Two focused sessions of 25 minutes on your main work.", word: "Repeat the cut." },
      { task: "Walk 30 minutes without your phone, paying attention to everything you see.", word: "The eye of perception is stronger than the eye of sight." },
      { task: "Do nothing useless for one full evening: no scrolling, no aimless videos.", word: "Do nothing which is of no use." },
      { task: "Practice one skill you want to master for 45 minutes.", word: "A thousand days to forge; ten thousand to polish. Today is one." },
      { task: "Finish one task you have been postponing for more than a week.", word: "Strike the opening before it closes." },
      { task: "Wake 30 minutes earlier and use that time for your main work.", word: "While others sleep, the Way is quiet." },
      { task: "Three focused sessions of 25 minutes on your main work.", word: "Your stance is steadier now. Lengthen the practice." },
      { task: "Teach or explain something you have learned to someone else.", word: "From one thing, know ten thousand things." },
      { task: "Spend one hour in complete focus on your hardest task.", word: "Face the strongest opponent with a calm mind." },
      { task: "Write what you learned in these fourteen days, and the one practice you will keep forever.", word: "The Way does not end. It continues tomorrow." }
    ],
    finish: { great: "Fourteen days, and you kept nearly all of them. You are not the same person who began. Keep one practice forever.", good: "You walked most of the Way. The days you fell are lessons; the days you kept are your new stance.", poor: "You began, and you finished. Many do not. Walk it again — the second time, the Way is shorter." }
  },
  {
    id: "exam", leader: "napoleon", title: "The Exam Campaign", kind: "Study",
    about: "Two weeks of organized study: objectives, timetables, reviews and a final assault. For any exam.",
    start: "A campaign is won before the battle. For fourteen days you will study like an army moves: with a plan, with speed, and without wasted hours.",
    days: [
      { task: "List every topic on your exam and mark each as strong, weak or unknown.", word: "Know the terrain before you march." },
      { task: "Make a 14-day study timetable, hour by hour, and put it on your wall.", word: "Organize first; victories follow." },
      { task: "Study your weakest topic for 90 minutes.", word: "Attack the weakest point of the enemy line — your own." },
      { task: "Solve 20 practice questions and correct every mistake.", word: "Every error found now is a battle won later." },
      { task: "Two 50-minute study blocks with the phone in another room.", word: "Concentrate your forces." },
      { task: "Review everything from days 3 and 4 without notes, then check.", word: "An army that does not consolidate its gains loses them." },
      { task: "Take a timed practice test on one subject, under exam conditions.", word: "Rehearse the battle." },
      { task: "Rest well: one light review hour, a walk, and sleep before 11.", word: "Even the Guard rests before the great battle." },
      { task: "Study your second-weakest topic for 90 minutes.", word: "Now the next weak point." },
      { task: "Write a one-page summary of a whole subject from memory.", word: "If you cannot write it, you do not command it." },
      { task: "Solve 30 practice questions, mixed topics, and correct them.", word: "Speed and precision." },
      { task: "Take a full timed practice exam.", word: "This is your Austerlitz rehearsal." },
      { task: "Fix every mistake from yesterday's exam and review those topics.", word: "Study your defeats more than your victories." },
      { task: "Light review of your summaries, prepare your materials, and sleep early.", word: "The plan is made. Tomorrow, execute it calmly." }
    ],
    finish: { great: "A campaign executed with discipline. Whatever the result, you prepared like a marshal. Now go and win.", good: "A solid campaign, with some lost days. You know where the weak points are — fix them before the battle.", poor: "The campaign was hard and you lost many days. But you know more than when you began. Plan again, smaller and stricter." }
  },
  {
    id: "agoge", leader: "leonidas", title: "The Agoge", kind: "Body",
    about: "Fourteen days of training the body — walking, bodyweight work, cold discipline, sleep. Adjust to your own health.",
    start: "Spartan boys trained for years. You will train for fourteen days. No complaints. Listen to your body; push it, do not break it.",
    days: [
      { task: "Walk or run 20 minutes. Then 3 sets of as many push-ups as you can do with good form.", word: "Begin." },
      { task: "3 sets of 15 squats and a 30-second plank, three times.", word: "Legs carry the shield." },
      { task: "Go to bed before 11 and wake at the same time as yesterday.", word: "Sleep is training." },
      { task: "Walk or run 30 minutes.", word: "Spartans marched." },
      { task: "Push-ups, squats and planks: 4 rounds.", word: "More." },
      { task: "Eat no sugar or junk food for the whole day. Drink water.", word: "Spartans ate plain food." },
      { task: "Rest day: stretch for 20 minutes and walk outside.", word: "Rest. Then war." },
      { task: "Walk or run 35 minutes, the last 5 minutes faster.", word: "Push the end." },
      { task: "Finish your shower with 30 seconds of cold water.", word: "Discomfort is training." },
      { task: "5 rounds: 10 push-ups, 15 squats, 30-second plank.", word: "Harder." },
      { task: "No screens for the last hour before sleep.", word: "Discipline at night, strength in the morning." },
      { task: "Walk or run 40 minutes.", word: "Endure." },
      { task: "Test day: count your maximum push-ups and compare with day 1.", word: "Measure the warrior." },
      { task: "Choose the one training habit you will keep, and do it today.", word: "The agoge never ends. Keep training." }
    ],
    finish: { great: "You held the line for fourteen days. Spartan.", good: "Most days held. Train again. Stronger.", poor: "You broke formation often. But you finished. Begin again." }
  },
  {
    id: "stoic", leader: "marcus", title: "The Stoic Fortnight", kind: "Mind",
    about: "Daily Stoic exercises for a calmer, steadier mind: control, perspective, gratitude, reflection.",
    start: "For fourteen days, we will train the mind as athletes train the body. Each morning a small exercise; each evening, a short review.",
    days: [
      { task: "Write two lists: what is in your control today, and what is not.", word: "Some things are within our power; others are not. Begin there." },
      { task: "Each morning, write: today I may meet difficult people. I will not let them disturb my character.", word: "Prepare the mind before the day." },
      { task: "In the evening, write what you did well, what badly, and what you left undone.", word: "Review the day as a judge, not an enemy." },
      { task: "Go one full day without complaining out loud.", word: "Complaint changes nothing; action does." },
      { task: "Write down three things you are grateful for, and why.", word: "Remember what you have, not only what you lack." },
      { task: "When something annoys you today, pause and ask: is this in my control?", word: "It is not things that disturb us, but our judgments about them." },
      { task: "Do one kind act for someone without telling anyone.", word: "We were born to work together." },
      { task: "Spend 15 minutes imagining your life from above — your city, your country, the earth.", word: "See how small the things that trouble you are." },
      { task: "Do the task you are avoiding most, first thing.", word: "At dawn, when you do not want to rise, remember you were born to work." },
      { task: "Write a letter to yourself about how you want to be remembered.", word: "Live each day as if it were your last — calmly, not in panic." },
      { task: "Spend a day eating simply and spending nothing unnecessary.", word: "Practice having less, so you fear losing less." },
      { task: "When you feel anger today, wait ten breaths before you speak.", word: "Anger is a brief madness, the old writers said. Wait." },
      { task: "Read a few pages of a philosophy book and write one idea you will keep.", word: "Return to your principles daily." },
      { task: "Write the three principles you will live by from now on.", word: "Waste no more time arguing what a good person should be. Be one." }
    ],
    finish: { great: "Fourteen days of governing yourself. Keep the evening review; it is the heart of it all.", good: "A good fortnight. The days you failed show you where to practice next.", poor: "It was hard to keep. That is normal; the mind is the hardest thing to train. Begin again, gently." }
  },
  {
    id: "build", leader: "tesla", title: "The Builder's Sprint", kind: "Create",
    about: "Fourteen days to finish one real project — code, writing, art, music or anything you make.",
    start: "Every invention is first an image in the mind. For fourteen days, we will turn one image into a working thing. Choose your project.",
    days: [
      { task: "Write a one-paragraph description of what you will build, and what 'finished' means.", word: "Define the machine before you build it." },
      { task: "Picture the finished project in detail for 10 minutes, then write or sketch it.", word: "I built my motors in my mind first." },
      { task: "Break the project into 10 or more small, concrete steps.", word: "Every great machine is many small parts." },
      { task: "Work 60 minutes on the first step.", word: "Close the circuit." },
      { task: "Work 60 minutes, and keep a short log of what you did.", word: "Record everything. Memory is unreliable." },
      { task: "Build the simplest possible working version of one part.", word: "A small working model beats a grand drawing." },
      { task: "Work 90 minutes with no distractions.", word: "Focus is current. Do not let it leak." },
      { task: "Show your work to one person and write down their reaction.", word: "Test under real conditions." },
      { task: "Fix or improve the weakest part.", word: "Find the faulty connection." },
      { task: "Work 90 minutes on the next step.", word: "Persistence is a form of power." },
      { task: "Cut one feature you do not need.", word: "Simplicity is precision." },
      { task: "Work 2 hours. Aim to have everything working by tonight.", word: "Push the voltage." },
      { task: "Polish: fix small errors, clean up, make it presentable.", word: "Precision in the details." },
      { task: "Finish it and share or save the final version.", word: "An idea is worth nothing until it runs." }
    ],
    finish: { great: "It works. You built something real in fourteen days. Now — the next invention.", good: "A working prototype, with some lost days. Finish the last parts this week.", poor: "The circuit opened many times. But you have more than you had. Start a smaller sprint." }
  }
];
