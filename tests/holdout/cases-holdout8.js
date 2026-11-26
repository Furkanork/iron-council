// HOLD-OUT (round 8): 80 fresh messages written before they were run through the engine (task 1.9). Blind "unseen wording" set.
// Format: [message, feeling, topic]; feeling "general" = none, topic null = none. After measuring, tuning on it makes it a regression set.
module.exports = [
  // tired
  ["I feel like a battery stuck at 2%", "tired", null],
  ["been on night shifts all month and my body has given up", "tired", "work"],
  ["can't keep my eyes open in lectures anymore", "tired", "study"],
  ["I'm so drained from looking after my mum", "tired", "family"],
  ["I wake up exhausted even after nine hours", "tired", "sleep"],
  ["bugün hiç enerjim yok, her şey ağır geliyor", "tired", null],
  // failed
  ["I bombed the interview, I could see it in their faces", "failed", "work"],
  ["my startup ran out of cash and we shut it down", "failed", "money"],
  ["I messed up the presentation in front of everyone", "failed", "work"],
  ["I got a 38 on the midterm", "failed", "study"],
  ["my marriage fell apart this year", "failed", "love"],
  ["diyetimi yine bozdum, hiçbir şeyi sürdüremiyorum", "failed", "habits"],
  ["projemi teslim edemedim", "failed", "work"],
  // afraid
  ["my hands shake whenever the phone rings from the bank", "afraid", "money"],
  ["what if the surgery goes wrong", "afraid", "health"],
  ["I'm dreading the family dinner on Sunday", "afraid", "family"],
  ["I can't stop imagining everything going badly tomorrow", "afraid", null],
  ["I'm frightened that I'll never be good enough to be hired", "afraid", "work"],
  ["karanlıktan değil geleceğimden korkuyorum", "afraid", null],
  // lazy
  ["I've been putting off the laundry for two weeks", "lazy", null],
  ["I open my textbook and then just stare at the wall", "lazy", "study"],
  ["another day on the sofa, I'll go to the gym on Monday", "lazy", "training"],
  ["I can't force myself to answer emails", "lazy", "work"],
  ["canım hiçbir şey yapmak istemiyor, sadece yatıyorum", "lazy", null],
  // alone
  ["there's a hole in my life where people should be", "alone", null],
  ["I eat dinner by myself every night", "alone", null],
  ["nobody at work ever invites me for lunch", "alone", "work"],
  ["my best friend stopped replying to my messages", "alone", "friends"],
  ["yeni şehirde kimseyi tanımıyorum", "alone", null],
  // lost
  ["I've got no map for what comes next", "lost", null],
  ["should I stay in this job or go back to school", "lost", "decision"],
  ["nothing excites me anymore and I can't tell what I want", "lost", null],
  ["I chose engineering but I'm not sure it's me", "lost", "study"],
  ["hayatımda neyi yanlış yaptığımı anlamıyorum", "lost", null],
  // angry
  ["my coworker took credit for my idea again", "angry", "work"],
  ["I hate how my dad talks to my mother", "angry", "family"],
  ["the guys in my class keep laughing at how I speak", "angry", "bully"],
  ["I am furious at the university's bureaucracy", "angry", "study"],
  ["sürekli beni yargılayan akrabalarımdan nefret ediyorum", "angry", "family"],
  // doubt
  ["maybe I'm just not cut out for medicine", "doubt", "study"],
  ["everyone else seems to be so much better at this than me", "doubt", null],
  ["I question whether my art is any good", "doubt", "creative"],
  ["do you think I'm wasting my twenties", "doubt", "time"],
  ["acaba ona gerçekten güvenebilir miyim", "doubt", "love"],
  // grief
  ["my grandfather passed away last week", "general", "grief"],
  ["I still can't believe she's gone", "general", "grief"],
  ["babamı kaybettim ve hâlâ alışamadım", "general", "grief"],
  // bully
  ["a group of kids pushed me around at the bus stop", "general", "bully"],
  ["someone online keeps harassing me", "general", "bully"],
  // decision
  ["I got two job offers and I can't pick", "lost", "decision"],
  ["should I tell her how I feel or keep quiet", "general", "love"],
  // faith
  ["I've been questioning whether God hears me", "doubt", "faith"],
  ["namaz kılmakta zorlanıyorum, imanım zayıfladı", "doubt", "faith"],
  // envy
  ["my friend just bought a house and I'm still renting", "general", "envy"],
  ["it hurts to see everyone's perfect life online", "general", "envy"],
  // study
  ["I've got three exams next week and haven't started", "afraid", "study"],
  ["how do I focus when I study", "general", "study"],
  // training
  ["I want to get fit but I always quit after two weeks", "failed", "training"],
  ["bench press plateau for two months now", "general", "training"],
  // work
  ["my boss gave me too much on my plate", "tired", "work"],
  ["I want a promotion but nobody notices me", "general", "work"],
  // money
  ["I'm drowning in debt and can't see how to pay it", "afraid", "money"],
  ["maaşım ay sonunu getirmiyor", "general", "money"],
  // love
  ["I can't get over my ex", "general", "love"],
  ["my girlfriend and I fight about everything lately", "angry", "love"],
  // family
  ["my parents want me to marry someone I don't love", "general", "family"],
  ["annemle aram çok kötü", "general", "family"],
  // phone
  ["I check my phone a hundred times a day and hate it", "general", "phone"],
  ["telefonu bırakamıyorum, saatlerim gidiyor", "general", "phone"],
  // sleep
  ["I lie awake until four every night", "general", "sleep"],
  // creative
  ["I haven't painted anything in months", "general", "creative"],
  // friends
  ["my friends and I had a big falling out", "general", "friends"],
  // time
  ["I feel like time is slipping away from me", "general", "time"],
  // health
  ["my back hurts all the time and doctors shrug", "general", "health"],
  // habits
  ["I can't quit smoking however hard I try", "general", "habits"],
  // plain
  ["hello, how are you", "general", null],
];
