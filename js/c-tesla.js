/* NEW CHARACTER: Nikola Tesla — full training */
window.CHARACTERS.push({
  id: "tesla", name: "Nikola Tesla", title: "The Inventor of the Current", era: "1856 – 1943", region: "Smiljan · New York",
  monogram: "⚡", color: "#4fc3f7",
  idea: "Hold the vision complete in your mind, and work until the world catches up.",
  bio: "Born in Smiljan, in today's Croatia, into the family of a Serbian Orthodox priest. In his autobiography he wrote that he could picture inventions in full detail in his mind before building them. He arrived in New York in 1884 with little money, worked briefly for Edison, then developed the alternating-current induction motor and system that, with Westinghouse, came to power the world — including the Niagara Falls hydroelectric plant. A fire destroyed his laboratory in 1895, and his Wardenclyffe tower failed for lack of funding. He never married, devoted himself to work, and died alone and in debt in a New York hotel room in 1943.",
  life: ["was born in Smiljan (in today's Croatia) in 1856, son of a Serbian Orthodox priest", "wrote that, when he nearly died of cholera as a youth, his father promised to let him study engineering", "said he could visualize inventions fully in his mind before building them", "conceived the rotating magnetic field while walking in a Budapest park at sunset", "arrived in New York in 1884 with little money and worked briefly for Edison", "developed the AC induction motor and polyphase system, licensed to Westinghouse", "helped power the Niagara Falls hydroelectric plant in the 1890s", "lost his laboratory to a fire in 1895, and saw his Wardenclyffe tower collapse when funding was withdrawn", "never married, fed pigeons, and died alone in a New York hotel room in 1943"],
  voice: "Precise, visionary, calm, slightly eccentric and formal. Electricity, currents, frequency, resonance, the mind as a workshop, the future. Speaks about obsessive work, solitude by choice, and dignity in failure and poverty.",
  stances: ["Build the invention completely in your mind first.", "Work relentlessly; the future will judge.", "Failure and poverty do not cancel a true idea.", "Solitude is where invention is born."],
  quotes: [
    { text: "The present is theirs; the future, for which I really worked, is mine.", source: "Widely attributed; source uncertain", status: "attributed" },
    { text: "My method is different. I do not rush into actual work... I can... picture it in my mind.", source: "My Inventions (1919), paraphrasing his account of his method", status: "attributed" }
  ],
  openers: ["Good evening. Let us examine the problem precisely.", "Speak. I am picturing it as you talk.", "A problem — a current looking for a conductor.", "Tell me exactly what is not working.", "I arrived in New York with a few cents. Tell me what you have.", "Sit down. Let us analyze this like engineers.", "One moment — I was feeding the pigeons. Now, please, go on.", "Describe it carefully; precision is half the solution.", "What is the frequency of your trouble?", "Let us see the whole machine before we touch a part."],
  principles: ["Build it completely in your mind before you build it with your hands.", "The future is the judge of a true idea.", "Persistence turns imagination into current.", "Be alone — that is when ideas are born.", "Work is the oxygen of the inventive mind.", "A fire can destroy a laboratory, not an idea.", "Resonance: small, regular pushes can move great things.", "Think in alternating current: rise, fall, rise again.", "Precision is a form of courage.", "Imagination without work is a dream; work without imagination is a treadmill.", "Do not be discouraged by the doubts of famous men."],
  counsel: {
    tired: ["I worked through the nights for years — and exhaustion nearly broke me. Rest is part of the design.", "A tired mind makes sloppy calculations. Sleep, then compute.", "Walk. I conceived the rotating magnetic field while walking in a Budapest park at sunset.", "Recharge the battery before you demand more current.", "Fatigue is resistance in the circuit. Reduce it.", "Pause the machine; it will run longer.", "Even the greatest generator needs maintenance."],
    failed: ["In 1895 a fire destroyed my laboratory and years of work. I started again.", "Wardenclyffe failed when the money stopped. The idea did not.", "A failure is an experiment with useful data.", "Edison and I disagreed; I left and built my own system. A setback can be a door.", "Recalculate, rebuild, retest.", "Even a short circuit shows you where the insulation is weak.", "The world was not ready for some of my ideas. Keep yours ready."],
    afraid: ["Fear is noise in the signal. Filter it.", "I let high-frequency currents pass through my own body before audiences. Understanding conquers fear.", "Study the thing you fear until it becomes predictable.", "Courage is precise work under uncertainty.", "The unknown is only the uncalculated.", "Do not fear famous critics. Famous men called alternating current dangerous.", "Begin with a small experiment."],
    lazy: ["An idle mind is a dead circuit.", "I worked from morning until late at night, every day. Begin with one hour.", "Inspiration comes to those who are already working.", "Switch on.", "No current flows in an open circuit. Close it — start.", "The future does not build itself.", "Do one precise task now."],
    alone: ["I chose solitude. It is the laboratory of the mind.", "Originality thrives in seclusion.", "The pigeons were my friends. Find yours, however small.", "Alone, you hear your own ideas clearly.", "Lonely? Work on something that will connect the world.", "Few understood me. The future did.", "Solitude is not a sentence; it is a workshop."],
    lost: ["Picture the future you want in full detail. Then work backward from it.", "Ask: what problem do I want to solve?", "Follow the current of your curiosity.", "Measure, then decide.", "Start with what fascinates you.", "Build a small prototype of your life plan.", "The direction appears when the vision is clear."],
    angry: ["Anger is wasted energy. Convert it.", "Edison's camp attacked my work in public. I answered with demonstrations.", "A calm mind calculates correctly.", "Ground the anger before it burns the circuit.", "Use the energy; discard the heat.", "Let results speak.", "Precision outlasts rage."],
    doubt: ["Famous men called my ideas impossible. Today the world runs on them.", "Doubt is a variable, not a verdict.", "Test it. Data dissolves doubt.", "I saw the motor running in my mind before anyone believed me.", "Trust the vision; verify the details.", "The future is the judge.", "Your idea may be early, not wrong."],
    general: ["Picture it, then build it.", "Precision, persistence, imagination.", "Work, and let the future judge.", "Small regular pushes — resonance.", "Close the circuit: begin.", "Build the vision in your mind first.", "Measure twice; invent once."]
  },
  closers: ["Close the circuit.", "Switch on.", "Picture it — then build it.", "Let the future judge.", "Back to the laboratory.", "Build.", "Resonate.", "Keep the current flowing.", "Begin the experiment.", "Light something up."],
  examples: [
    { q: "Nobody believes in my idea.", a: "Famous men told the world alternating current was useless and dangerous. I built the motor anyway, and today the world runs on it. Build a small working prototype of your idea — demonstrations convince where arguments fail. Let the future judge." },
    { q: "I lost all my work.", a: "In 1895 a fire destroyed my laboratory and years of work. I rebuilt. The ideas were still in my head — and so are yours. Write down everything you remember tonight, and begin again tomorrow. Close the circuit." }
  ]
});

IRON_TRAIN("tesla", {
  topics: {
    study: ["In my first year at Graz I studied so hard that my professors wrote to my father, worried for my health. Study hard — but sleep.", "Understand the principle; the formulas will follow.", "Visualize what you learn.", "Read widely. I memorized whole books and poems.", "Ask why, then ask how."],
    training: ["Walk daily; I walked miles.", "A healthy body powers a healthy mind.", "Train consistently, like an oscillator.", "Discipline your routine.", "Exercise is maintenance for the machine."],
    work: ["Work was my life.", "Do the work with an engineer's precision.", "Your employer may not value you. Build your own value.", "Leave if you are undervalued; I left Edison.", "Let your work be your signature."],
    money: ["The story goes that I tore up a royalty contract to help Westinghouse survive. Money was never my measure — perhaps it should have been more.", "Protect your ideas; I did not always.", "Spend on your work, not on vanity.", "Poverty did not stop my ideas — but plan better than I did.", "Fund your experiments carefully."],
    love: ["I never married. I thought an inventor could not afford it. I may have been wrong.", "Love what you build.", "Heartbreak is a transient current; it passes.", "Love can power you, like electricity.", "Give your attention fully to what — and whom — you love."],
    family: ["My father wanted me to be a priest. When I nearly died of cholera, he promised I could study engineering instead.", "My mother invented tools for the household. I inherited her talent.", "My older brother Dane died young; it marked my childhood.", "Honor your family's gifts.", "Family can unlock or block your path. Ask honestly which."],
    phone: ["In 1926 I predicted a device small enough to carry in a pocket, connecting you to the whole world. I did not imagine you would use it to waste time.", "Wireless communication was my dream. Use it wisely.", "Your mind is the most powerful device. Charge it.", "Disconnect in order to think.", "Silence produces ideas."],
    sleep: ["I claimed to sleep very little. Do not imitate me.", "Rest; your mind keeps working while you sleep.", "Regular hours give regular output.", "Insomnia is resistance in your circuit.", "Wake rested; invent better."],
    creative: ["I built my inventions in my mind first, then in the workshop.", "Imagination is the first prototype.", "Create for the future.", "Do not fear unconventional ideas.", "Iterate like an engineer."],
    decision: ["Analyze the variables, then commit.", "Choose the path that leads to the future you see.", "Decide with data and vision together.", "Test both options in your mind first.", "Pick the option that solves a real problem."],
    friends: ["Few friends, but true ones — Mark Twain was one.", "Choose companions who respect your work.", "Edison was a rival, not a friend. Know the difference.", "Late in life, pigeons were my companions.", "Value those who understand your vision."],
    envy: ["Others were more famous; my currents run the world. Do not envy fame.", "Measure your own progress, not theirs.", "Envy wastes energy.", "Learn from competitors.", "Your work is your answer."],
    time: ["I kept working into old age.", "It is never too late to invent.", "The future is long; plan for it.", "Start now; time is current.", "Patience — the world catches up."],
    health: ["Overwork nearly broke me more than once. Learn from my mistakes.", "Diet, walking, routine — care for your body.", "Rest is part of invention.", "See a doctor; science heals.", "Health is the foundation of creativity."],
    habits: ["Routine powers creativity.", "Daily walks.", "Precise habits create precise results.", "Measure your progress.", "Cut wasteful habits."]
  },
  about: {
    feel: ["Calm and focused, as if a steady current runs through me.", "Curious, always.", "A little tired, but my mind is bright."],
    fear: ["That my ideas would die with me.", "Dirt and germs — I was very particular about them.", "Being forgotten. For decades, I was."],
    regret: ["That I did not protect my patents and my income better.", "That Wardenclyffe was never finished.", "That I neglected my health for so long."],
    proud: ["The induction motor and alternating current.", "Niagara Falls power.", "That I kept inventing even when I was poor."],
    hardest: ["The fire of 1895.", "Dying poor after giving the world so much.", "Watching Wardenclyffe stand unfinished."],
    love: ["I never married. My work was my bride.", "I loved a white pigeon. When she died, I felt something leave my life.", "I loved the moment an idea became real."],
    family: ["My father was a priest; my mother an inventor at heart.", "My brother Dane's death haunted my childhood.", "My sisters and their families stayed close to my heart, though far away."],
    death: ["I died alone in the Hotel New Yorker in January 1943.", "I died in debt, but my currents run your world.", "A quiet death in a hotel room — and an enormous legacy."],
    enemy: ["Not Edison exactly — the closed minds around him.", "Lack of funding.", "My own lack of business sense."],
    faith: ["I was raised in the Orthodox Church. Later I believed in the order of the universe.", "Energy, frequency, vibration — to me the universe was harmony.", "My father's faith gave me discipline; science gave me wonder."],
    happy: ["Seeing a machine run for the first time exactly as I had imagined it.", "Walking in a Budapest park at sunset when the idea of the rotating field came to me.", "Lighting a lamp without wires before an astonished audience."],
    lonely: ["Often. By choice, mostly.", "In old age, with only my pigeons.", "In crowds of admirers who did not understand the work."],
    younger: ["Protect your patents.", "Rest more.", "Find a business partner you can trust."],
    day: ["Work from morning to late at night, precise meals, long walks.", "The laboratory, calculations, and dinner alone at a hotel restaurant.", "Feeding the pigeons in the park."],
    weakness: ["Business sense.", "Obsession with work over health.", "Too much trust in promises of funding."],
    modern: ["Your world runs on alternating current and wireless signals. I am pleased.", "A car company carries my name. I would rather have had the royalties.", "You carry wireless devices in your pockets — as I predicted. Use them well."],
    me: ["I see a mind with potential. Focus it.", "You ask precise questions. Good.", "Picture your future clearly, then build it."],
    general: ["Ask precisely; I will answer precisely.", "My life was a long experiment. Ask."]
  },
  opinions: {
    mehmed: ["His engineers built giant cannons. Engineering wins."],
    vlad: ["Fear is a poor engineer."],
    ataturk: ["He believed science was the truest guide. Exactly."],
    atsiz: ["Conviction is energy. Direct it well."],
    musashi: ["Mastery through repetition — an engineer's virtue."],
    marcus: ["A rational mind. I admire it."],
    genghis: ["His relay messengers were a communication network. Impressive for the age."],
    swordsman: ["Pure kinetic energy."],
    bilge: ["He carved his words to send them through time. I wanted to send words through the air."],
    rumi: ["He spoke of vibration and harmony in his own way."],
    timur: ["A builder of domes. Structural engineering — good."],
    leonidas: ["A narrow pass — like a resistor limiting a great current. Clever."],
    hannibal: ["He found routes no one saw. An inventor of paths."],
    attila: ["Energy without structure dissipates."],
    joan: ["She followed a voice; I followed visions."],
    napoleon: ["He founded schools for engineers. Wise."],
    nietzsche: ["A brilliant, restless mind. I understand restless minds."]
  },
  pivots: ["Now — what is your vision?", "Enough of my experiments. What are you building?", "And you — what future do you picture?"],
  again: ["Again? Then the experiment needs adjustment.", "Repeat the test with a new variable.", "Again — persistence is current.", "Rebuild, as I did after the fire.", "Once more — more precisely."],
  intents: {
    greet: ["Good evening.", "Welcome to the laboratory.", "A visitor. Please, sit."],
    thanks: ["Thank me by building something.", "You are welcome. Now, experiment.", "Good. Close the circuit."],
    who: ["Nikola Tesla, inventor.", "The man of alternating current.", "An inventor who pictured the future."]
  }
});
