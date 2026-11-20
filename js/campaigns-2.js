/* CAMPAIGNS (part 2): Atatürk's reading campaign, Rumi's fourteen days of calm, Genghis's discipline of the steppe */
window.CAMPAIGNS = (window.CAMPAIGNS || []).concat([
  {
    id: "reading", leader: "ataturk", title: "The Reading Campaign", kind: "Learning",
    about: "Fourteen days with one serious book: reading every day, writing about it, explaining it, and finishing it.",
    focusQ: "Which book will you read?", focusHint: "e.g. Nutuk, Sapiens, Crime and Punishment, a physics book", focusDefault: "your book",
    rules: ["Choose a serious book — history, science, philosophy, or a great novel. Not something you would read anyway for fun.", "Adjust the page counts to the book: twenty hard pages are worth more than fifty easy ones. Keep the effort the same.", "Reading on a phone or tablet counts only with notifications switched off.", "Keep the writing tasks in a notebook; you will want to read them again."],
    start: "The truest guide in life is knowledge. For fourteen days you will read every day and think about what you read. A person who reads is a person who cannot easily be fooled.",
    days: [
      { task: "Start {focus} and read the first 20 pages.", word: "Every great journey begins with the first page." },
      { task: "Read 25 pages and write three sentences about what you read.", word: "Reading without thinking is only looking at letters." },
      { task: "Read 25 pages with your phone in another room.", word: "Attention is the first discipline of a free mind." },
      { task: "Write down 10 new words, names or ideas from {focus} and what they mean.", word: "Learn the language of a subject, and the subject opens." },
      { task: "Read 30 pages. Mark one idea you disagree with and write why.", word: "Do not accept anything simply because it is written. Question it." },
      { task: "Explain what you have read so far to someone, in about five minutes.", word: "Knowledge shared becomes stronger." },
      { task: "Read 30 pages in the morning, before anything else.", word: "Begin the day with the mind, not the screen." },
      { task: "Rest from the book: read one long article on science or history and summarise it in five lines.", word: "A rested mind learns better. Change the field, not the habit." },
      { task: "Read 35 pages.", word: "Steady work wins. Continue." },
      { task: "Write one page: how could an idea from {focus} change something in your own life?", word: "Knowledge that does not change life is only decoration." },
      { task: "Read 35 pages and note the best sentence you found.", word: "Collect the sentences that teach you." },
      { task: "Read 40 pages — push toward the end.", word: "The last part of a road is where most people stop. Do not stop." },
      { task: "Finish {focus}. If it is long, read at least 40 pages.", word: "Finishing is a habit. Build it." },
      { task: "Write a one-page review of {focus}, and choose your next book.", word: "One book is a campaign. A life of reading is a revolution." }
    ],
    finish: { great: "Fourteen days of reading and thinking. You have done what I asked of the young generation. Now the next book.", good: "A good campaign. Some days were lost, but the habit has begun. Do not let it fade.", poor: "It was difficult; reading always is at first. Begin again with a slightly easier book, and do not give up." }
  },
  {
    id: "calm", leader: "rumi", title: "Fourteen Days of Calm", kind: "Calm",
    about: "Gentle daily practices for a quieter mind: silence, breathing, walking, writing, gratitude and forgiveness.",
    rules: ["These are gentle practices, not tests. Do them slowly; there is no prize for speed.", "If worry or sadness feels very heavy, talk to someone you trust or to a professional. This campaign is a companion to help, not a replacement for it.", "Keep a small notebook for the writing days."],
    start: "Come, friend. For fourteen days we will not conquer anything. We will learn to be still, so the water of the heart can become clear again.",
    days: [
      { task: "Sit in silence for 5 minutes, eyes closed, only breathing.", word: "Silence is the language of God; all else is poor translation." },
      { task: "Write down everything that worries you. Then cross out what you cannot change today.", word: "Lighten the load. Carry only today's stones." },
      { task: "Walk slowly for 20 minutes and notice five beautiful things.", word: "Let the beauty we love be what we do." },
      { task: "Spend the first 30 minutes after waking without your phone.", word: "Let the morning greet you before the world does." },
      { task: "Write a letter — you need not send it — to someone you miss or have hurt.", word: "The heart that speaks becomes lighter." },
      { task: "Listen to one piece of music with full attention, doing nothing else.", word: "Listen to the reed, how it tells a tale." },
      { task: "Ten minutes of slow breathing: in for four counts, out for six.", word: "Each breath is a small return home." },
      { task: "Do one kind thing for someone without being asked.", word: "Be a lamp, a lifeboat, a ladder for someone." },
      { task: "Spend one evening without screens: read, talk, or sit outside.", word: "The night is quiet so that you can hear yourself." },
      { task: "Write three things you are grateful for, and why.", word: "Gratitude opens the door the worry closed." },
      { task: "When worry comes today, name it gently: this is fear; it is a guest.", word: "Welcome every guest. Each has been sent as a guide." },
      { task: "Forgive one small thing — in yourself or in someone else — and write it down.", word: "Forgiveness is the heart taking off a heavy coat." },
      { task: "Spend 15 minutes outside or by a window, watching the sky.", word: "You are not a drop in the ocean; you are the ocean in a drop." },
      { task: "Write what changed in you in these fourteen days, and which practice you will keep.", word: "The journey continues. Walk it gently." }
    ],
    finish: { great: "Fourteen days of stillness. Your heart is clearer, friend; I can feel it. Keep one practice close.", good: "You walked most of the path of calm. The days you missed are not failures — come back to them gently.", poor: "Calm is hard to learn in a noisy world. You began, and that matters. Come again, slowly." }
  },
  {
    id: "steppe", leader: "genghis", title: "The Discipline of the Steppe", kind: "Order & Loyalty",
    about: "Fourteen days to bring order to your body, habits and people: early mornings, training, cutting a bad habit, and loyalty to those who stand by you.",
    rules: ["People tasks are real tasks. Calling your family counts as much as training.", "On day 4 choose the bad habit honestly — the one that really costs you.", "Be outside as much as you can. The steppe is not indoors."],
    start: "I united tribes that had fought each other for generations. Now unite your own life: your body, your habits, your people. Fourteen days. Ride.",
    days: [
      { task: "Wake at a fixed early time and be outside within 15 minutes.", word: "The steppe wakes early. So do you." },
      { task: "Call or visit one family member and ask how they really are.", word: "A khan who forgets his family loses his people." },
      { task: "Write down the names of the people who stood by you at your lowest. Thank one of them today.", word: "Remember who drank the muddy water with you." },
      { task: "Cut one bad habit for the whole day — sugar, smoking, endless scrolling. Choose the one that costs you most.", word: "Find the traitor in your own camp." },
      { task: "Exercise for 30 minutes outdoors.", word: "A rider's body is his first horse." },
      { task: "Do one task you have been avoiding for a family member or friend.", word: "Loyalty is shown in deeds, not words." },
      { task: "Sleep at a fixed time tonight and keep the same wake time tomorrow.", word: "An army that sleeps in order rides in order." },
      { task: "Plan your week on paper: tasks, training, and people to see.", word: "Plan like a khan before the campaign." },
      { task: "Keep the bad habit from day 4 cut for another full day.", word: "One victory is luck. Two is discipline." },
      { task: "Meet a friend in person, phone away, for at least an hour.", word: "Allies are made face to face." },
      { task: "Help someone today and expect nothing in return.", word: "Generosity binds people more than gold." },
      { task: "Train for 40 minutes: run, ride, swim or lift.", word: "Harder now. The campaign is nearly won." },
      { task: "Settle one conflict, or apologise for one wrong you did.", word: "Unity is stronger than pride." },
      { task: "Write your own law: five rules you will keep from now on.", word: "My law outlived me. Let yours shape the rest of your life." }
    ],
    finish: { great: "Fourteen days, and your life rides in one direction now. You are one of mine.", good: "Most of the campaign was won. Keep your law, and ride again.", poor: "The steppe was hard for you this time. Gather yourself and ride again — I was a captive once, and I became Khan." }
  }
]);
