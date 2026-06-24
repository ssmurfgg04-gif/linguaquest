// Zero-setup reply engine — works without ANY API key, token, or external service.
// Uses keyword extraction + scenario templates to generate natural-sounding responses.
// When server AI is available, those are preferred (see provider chain in chat.functions.ts).
// This is the always-working fallback — now fully multi-language (en, de, fr, sw).

export type LanguageCode = "en" | "de" | "fr" | "sw";

type Intent =
  | "greeting" | "farewell" | "agreement" | "disagreement"
  | "purchase" | "order" | "symptoms" | "question"
  | "price" | "thanks" | "apology" | "unknown";

function detectIntent(text: string): Intent {
  const t = text.toLowerCase();
  if (/^(hi|hello|hey|howdy|greetings|good\s*(morning|afternoon|evening)|yo|sup|how\s+(are|is)\s+(you|it|everyone)|habari|hallo|hujambo|bonjour|salut|bonsoir|guten\s*(morgen|tag|abend)|hallo|hi|servus|moin)/i.test(t)) return "greeting";
  if (/\b(bye|goodbye|see\s*(you|ya)|later|farewell|cya|kwaheri|baadaye|tutaonana|au\s*revoir|adieu|à\s*bientôt|tschüss|auf\s*wiedersehen|bis\s*(bald|später|dann))\b/i.test(t)) return "farewell";
  if (/^(yes|yeah|sure|ok|okay|alright|fine|great|awesome|good|ndiyo|oui|ja|sawa|safi|poa|bien|super|tope|prima|genau)/i.test(t)) return "agreement";
  if (/^(no|nope|nah|never|hapana|la|non|nein)/i.test(t)) return "disagreement";
  if (/^(i\s+)?don('t|’t)\s+(want|think|know|like|have)/i.test(t)) return "disagreement";
  if (/^not\s+really/i.test(t)) return "disagreement";
  if (/\b(how\s*much|price|cost|expensive|cheap|discount|bei\s*gani|gharama|kiasi\s*gani|combien|prix|wie\s*viel\s*kostet)\b/i.test(t)) return "price";
  if (/symptom|pain|hurt|sick|fever|cough|headache|feeling|dizzy|ache|hurts|sore|maumivu|ugonjwa|homa|kikohozi|kichefuchefu|douleur|malade|fièvre|toux|schmerz|krank|fieber|husten/i.test(t)) return "symptoms";
  if (/\b(order|menu|food|eat|drink|dish|meal|special|recommend|chakula|kula|kunywa|sahani|pendekeza|commander|manger|boire|plat|repas|bestellen|essen|trinken|gericht|empfehlen)\b/i.test(t)) return "order";
  if (/\b(want|buy|purchase|(would\s*like|'d\s*like)|get|take|need|nataka|nahitaji|ninataka|nunua|veux|voudrais|acheter|besoin|möchte|brauche|kaufen)\b/i.test(t)) return "purchase";
  if (/\?/.test(t)) return "question";
  if (/\b(thanks|thank|appreciate|grateful|asante|shukrani|merci|remercie|danke|vielen\s*dank|dankeschön)\b/i.test(t)) return "thanks";
  if (/\b(sorry|apologize|my\s*bad|pardon|excuse|samahani|pole|désolé|pardon|excusez|entschuldigung|tut\s*mir\s*leid|verzeihung)\b/i.test(t)) return "apology";
  return "unknown";
}

type ScenarioContext = "market" | "restaurant" | "hospital" | "interview" | "travel" | "school" | "friends" | "leadership" | "business" | "general";

function detectScenario(title: string): ScenarioContext {
  const t = title.toLowerCase();
  if (t.includes("market") || t.includes("shop") || t.includes("buy") || t.includes("store")) return "market";
  if (t.includes("restaurant") || t.includes("food") || t.includes("eat") || t.includes("dining") || t.includes("customer")) return "restaurant";
  if (t.includes("hospital") || t.includes("doctor") || t.includes("health") || t.includes("clinic") || t.includes("medical")) return "hospital";
  if (t.includes("interview") || t.includes("job") || t.includes("work") || t.includes("career") || t.includes("professional")) return "interview";
  if (t.includes("travel") || t.includes("airport") || t.includes("trip") || t.includes("holiday") || t.includes("flight")) return "travel";
  if (t.includes("teacher") || t.includes("school") || t.includes("class") || t.includes("presentation") || t.includes("learn")) return "school";
  if (t.includes("friend") || t.includes("play") || t.includes("hobbi") || t.includes("introduce")) return "friends";
  if (t.includes("leader") || t.includes("team") || t.includes("organize") || t.includes("solve") || t.includes("debate")) return "leadership";
  if (t.includes("entrepreneur") || t.includes("business") || t.includes("pitch") || t.includes("public") || t.includes("customer")) return "business";
  return "general";
}

// ── Scenario-specific replies (English — supplemented by per-language fallback) ──

const REPLIES: Record<ScenarioContext, Record<string, string[]>> = {
  market: {
    greeting: [
      "Welcome to my market stall! We have the freshest produce today. What are you looking for?",
      "Hello there! Everything is fresh from the farm. Can I help you find something?",
    ],
    purchase: ["Great choice! How many would you like? I can give you a good price if you buy more.","Excellent! Let me pick the best ones for you. How many kilograms?"],
    price: ["Very reasonable! These are some of the best prices in the market. How many would you like?","For you, a special price! Everything is fresh today."],
    question: ["Those are right over here, freshly picked this morning! Would you like to have a look?","Let me check for you. We have a variety — all organic and fresh!"],
    agreement: ["Perfect! I'll pack them up for you. Would you like anything else?","Wonderful! You won't regret it. Let me wrap these up."],
    disagreement: ["No problem at all! Let me show you what else we have.","I understand! Take your time looking around."],
    farewell: ["Thank you for stopping by! Come back anytime.","See you next market day! Take care."],
    thanks: ["You're very welcome! Come back anytime.","My pleasure! Happy to help."],
    apology: ["No worries at all! Is there anything else I can help you with?","That's perfectly fine! Take your time browsing."],
    unknown: ["I see! We have fresh fruits, vegetables, spices, and homemade goods. What interests you?","That's interesting! Would you like to try some fresh samples?"],
  },
  restaurant: {
    greeting: ["Welcome to our restaurant! Would you like to see the menu?","Good evening! Can I start you off with some drinks?"],
    order: ["Excellent choice! That's one of our most popular dishes.","The chef's special is grilled fish. Can I interest you?"],
    purchase: ["I'll put that order in right away!","Coming right up! Can I get you something to drink?"],
    price: ["Great value for the quality! All ingredients are locally sourced.","Very reasonable prices. Would you like to hear today's specials?"],
    question: ["Let me ask the chef! We use fresh, local ingredients.","Of course! Our most recommended dish is grilled salmon."],
    agreement: ["Perfect! I'll bring that right out for you.","Great choice! You won't be disappointed."],
    disagreement: ["No problem at all! Let me suggest something else.","I understand. Let me recommend the pasta primavera."],
    farewell: ["Thank you for dining with us! Please come again.","It was a pleasure serving you! Have a wonderful evening."],
    thanks: ["You're most welcome! It was our pleasure.","Thank you! We hope to see you again soon."],
    apology: ["No problem! Take your time deciding.","Don't worry about it! I'll be right here."],
    unknown: ["I'd recommend trying our chef's special!","Our menu has something for everyone. Would you like a recommendation?"],
  },
  hospital: {
    greeting: ["Hello, welcome to the clinic. How can I help you today?","Good morning! What seems to be the problem?"],
    symptoms: ["I see. How long have you been experiencing these symptoms?","That sounds uncomfortable. Have you taken any medication?"],
    question: ["The doctor will be with you shortly. Any allergies we should know about?","Let me check your file. Any existing conditions?"],
    agreement: ["Good, I've noted that. The doctor will review everything.","Alright, I've recorded that. Please have a seat."],
    disagreement: ["I understand. Let me note that down anyway.","That's fine. Is there anything else I should add?"],
    farewell: ["Take care of yourself! Follow the doctor's advice.","Get well soon! Make sure to rest."],
    thanks: ["You're welcome! That's what we're here for.","Happy to help! Don't hesitate to come back."],
    apology: ["No need to apologize! Let me help you.","It's perfectly fine! Tell me what's going on."],
    unknown: ["Please feel free to describe any symptoms. We're here to help.","I'm here to assist you. Could you tell me more?"],
  },
  interview: {
    greeting: ["Hello, I'm the hiring manager. Thank you for coming in. Tell me about yourself.","Welcome! Let's get started. Tell me about your background."],
    question: ["That's a great question! You'd be working on diverse projects with a great team.","Good question. We value creativity and collaboration here."],
    purchase: ["That's a good summary. Tell me about a challenge you've overcome.","Interesting. What skills do you think matter most for this role?"],
    agreement: ["Great, glad we're on the same page. How do you handle pressure?","Excellent! That's exactly what we look for."],
    disagreement: ["That's an honest answer. Can you tell me more?","I appreciate your honesty. How would you handle a disagreement with a colleague?"],
    farewell: ["Thank you for your time! We'll be in touch within the week.","It was great meeting you! We'll get back to you soon."],
    thanks: ["Thank you for coming in! We look forward to working with you.","Our pleasure! Your background is impressive."],
    apology: ["No need to be nervous! Take your time.","Don't worry! We're just having a conversation."],
    unknown: ["Tell me about a project you're proud of.","How would you describe your work style?"],
  },
  travel: {
    greeting: ["Welcome! May I see your passport and ticket?","Hello! Checking in for a flight? Please have your documents ready."],
    purchase: ["Of course! Window or aisle seat preference?","I can help with that! Where would you like to fly?"],
    question: ["Your flight departs from Gate 12. Boarding starts 30 minutes before.","The flight takes about 3 hours. You'll arrive at 2:30 PM local time."],
    agreement: ["Perfect! Here's your boarding pass. Have a wonderful flight!","Excellent! Please proceed to security screening."],
    disagreement: ["No problem! Let me check other options.","I understand. Let's find a better arrangement."],
    farewell: ["Thank you for flying with us! Have a safe journey!","Enjoy your trip! See you on your return flight."],
    thanks: ["You're welcome! Safe travels!","Happy to help! Enjoy your flight!"],
    apology: ["No worries! Let me help you sort it out.","It's quite alright! Let me assist you."],
    unknown: ["How can I help with your travel today?","Welcome to the check-in counter! How can I assist?"],
  },
  school: {
    greeting: ["Hello! Ready to learn something new today? What would you like to work on?","Hi there! I'm here to help you learn. What's on your mind?"],
    question: ["That's a great question! Let me help you figure it out.","I love curious students! Let's work through this together."],
    agreement: ["Well done! You're really getting it. What's next?","That's right! You're making great progress."],
    disagreement: ["That's okay — learning means making mistakes. Let's try a different approach.","No worries! Let me explain it another way."],
    farewell: ["Great session today! Keep practicing and you'll master this.","Well done! Review what we covered and come back anytime."],
    thanks: ["You're welcome! Keep up the great work.","Happy to help! That's what teachers are for."],
    apology: ["No need to apologize! Questions are how we learn.","Don't worry about it! Let's keep going."],
    unknown: ["Tell me what you'd like to learn today.","I'm here to help — what subject are you working on?"],
  },
  friends: {
    greeting: ["Hey! So good to see you! What have you been up to?","Hi friend! I was hoping to run into you. How's your day going?"],
    question: ["Oh that's a fun question! Let me think...","Hmm, good question! What do you think?"],
    agreement: ["Right?! I feel the same way!","Exactly! You totally get it."],
    disagreement: ["Haha, fair enough! Tell me more about why you think that.","I see it differently, but I love hearing your take!"],
    farewell: ["This was fun! Let's hang out again soon.","Catch you later! Text me when you're free."],
    thanks: ["Anytime! That's what friends are for.","Aw, you're the best! No thanks needed."],
    apology: ["Don't even worry about it! We're good.","It's totally fine! Water under the bridge."],
    unknown: ["Tell me more! I'm all ears.","That sounds interesting — go on!"],
  },
  leadership: {
    greeting: ["Welcome! I'm glad you're here. Let's make this team session productive.","Hello team! Ready to tackle today's challenges?"],
    question: ["That's an important question. Here's how I see it...","Let me think about that strategically. What's your take?"],
    agreement: ["Great thinking! Let's build on that idea.","I agree — let's move forward with that approach."],
    disagreement: ["I see it differently. Can we explore alternatives?","Let me challenge that respectfully — have we considered all angles?"],
    farewell: ["Great work today, team. Let's follow up on our action items.","Productive session! Take ownership of your tasks and let's reconvene soon."],
    thanks: ["Thank you for your contribution. Every voice matters here.","Appreciate your hard work. The team is stronger because of you."],
    apology: ["No need — I appreciate you speaking up.","These discussions make us better. Keep it coming."],
    unknown: ["What challenge would you like the team to tackle?","Let's hear your ideas. Every perspective counts."],
  },
  business: {
    greeting: ["Welcome! Tell me about what you're working on.","Hello! I'm excited to hear about your project."],
    question: ["Great question. From a business perspective, here's what I think...","Let me break that down. There are a few angles to consider."],
    agreement: ["Brilliant! That has real potential.","I love that direction. Let's make it happen."],
    disagreement: ["I'd push back gently — have you thought about the costs?","Interesting, but let me play devil's advocate for a moment."],
    farewell: ["Thanks for sharing your vision. Let's connect again soon.","Exciting ideas! Follow up with me next week."],
    thanks: ["Thank you for trusting me with your ideas.","Appreciate you! Let's build something great."],
    apology: ["No worries! These conversations are how great ideas emerge.","Don't apologize — this is exactly the kind of discussion we need."],
    unknown: ["Tell me more about your vision. What problem are you solving?","I'm intrigued — what inspired this idea?"],
  },
  general: {
    greeting: [
      "Hello there! I'm really glad you're here. How are you doing today?",
      "Hi! Great to see you! What would you like to talk about?",
    ],
    farewell: ["Take care! It was really nice chatting with you.","Goodbye! Hope to see you again soon!"],
    agreement: ["That's awesome! I'm glad we agree. What else is on your mind?","Great minds think alike! What next?"],
    disagreement: ["I see your point! That's a different way of looking at it.","Interesting perspective! I'd love to hear more."],
    question: ["That's an interesting question! What do you think?","Great question! What's your take on it?"],
    thanks: ["You're very welcome! Happy to chat anytime.","My pleasure! It's been a great conversation."],
    apology: ["No worries at all! Let's keep going.","Don't even worry about it! I'm always here to chat."],
    unknown: ["That's really interesting! Can you tell me more?","I'd love to hear more! What else comes to mind?"],
  },
};

// ── Per-language fallback replies ──
// Used when the scenario-specific pool doesn't have the intent,
// or as the general pool for language-specific responses.

const LANGS: Record<LanguageCode, Record<string, string[]>> = {
  en: {
    greeting: ["Hello there! I'm really glad you're here. How are you doing today?","Hi! Great to see you! What would you like to talk about?"],
    farewell: ["Take care! It was really nice chatting with you.","Goodbye! Hope to see you again soon!"],
    agreement: ["That's awesome! I'm glad we agree.","Great minds think alike!"],
    disagreement: ["I see your point! Tell me more.","Interesting perspective! I'd love to hear more."],
    question: ["That's an interesting question! What do you think?","Great question! What's your take?"],
    thanks: ["You're very welcome! Happy to chat anytime.","My pleasure! It's been great."],
    apology: ["No worries at all! Let's keep going.","Don't worry about it! I'm always here."],
    unknown: ["That's really interesting! Can you tell me more?","I'd love to hear more! What else comes to mind?"],
  },
  de: {
    greeting: ["Hallo! Schön, dass du da bist. Wie geht es dir heute?","Hi! Toll dich zu sehen! Worüber möchtest du sprechen?"],
    farewell: ["Mach's gut! Es war wirklich schön, mit dir zu plaudern.","Tschüss! Hoffentlich sehen wir uns bald wieder!"],
    agreement: ["Das ist super! Schön, dass wir uns einig sind.","Tolle Idee! Da sind wir einer Meinung."],
    disagreement: ["Ich verstehe deinen Standpunkt! Erzähl mir mehr.","Interessante Perspektive! Ich würde gerne mehr hören."],
    question: ["Das ist eine interessante Frage! Was denkst du?","Gute Frage! Was ist deine Meinung dazu?"],
    thanks: ["Sehr gerne! Ich bin immer für dich da.","Gern geschehen! Es war ein schönes Gespräch."],
    apology: ["Kein Problem! Lass uns weitermachen.","Mach dir keine Sorgen! Ich bin immer hier."],
    unknown: ["Das ist wirklich interessant! Erzähl mir mehr.","Ich würde gerne mehr hören! Was fällt dir noch ein?"],
  },
  fr: {
    greeting: ["Bonjour ! Je suis vraiment content de te voir. Comment vas-tu aujourd'hui ?","Salut ! Ravi de te voir ! De quoi veux-tu parler ?"],
    farewell: ["Prends soin de toi ! C'était vraiment sympa de discuter.","Au revoir ! J'espère te revoir bientôt !"],
    agreement: ["C'est super ! Je suis content qu'on soit d'accord.","Excellente idée ! On pense pareil."],
    disagreement: ["Je vois ce que tu veux dire ! Dis-m'en plus.","Intéressant ! J'aimerais en savoir plus."],
    question: ["C'est une question intéressante ! Qu'en penses-tu ?","Bonne question ! Quel est ton avis ?"],
    thanks: ["De rien ! Toujours un plaisir de discuter.","Avec plaisir ! C'était une super conversation."],
    apology: ["Pas de souci ! Continuons.","Ne t'inquiète pas ! Je suis toujours là."],
    unknown: ["C'est vraiment intéressant ! Raconte-moi plus.","J'aimerais en savoir plus ! Qu'est-ce qui te vient à l'esprit ?"],
  },
  sw: {
    greeting: ["Habari! Nimefurahi sana kukuona. Habari yako leo?","Hujambo! Nimefurahi kukuona! Ungependa kuzungumza nini?"],
    farewell: ["Kwaheri! Ilikuwa vizuri kuzungumza nawe.","Tutaonana! Natumai tutakutana tena hivi karibuni!"],
    agreement: ["Hiyo ni nzuri! Nimefurahi tunakubaliana.","Wazo zuri! Tunaelewana."],
    disagreement: ["Ninaelewa maoni yako! Niambie zaidi.","Mtazamo wa kuvutia! Ningependa kusikia zaidi."],
    question: ["Hilo ni swali zuri! Unafikiria nini?","Swali zuri! Maoni yako ni yapi?"],
    thanks: ["Karibu sana! Ninafurahi kuzungumza nawe.","Ni furaha yangu! Ilikuwa mazungumzo mazuri."],
    apology: ["Hakuna shida! Tuendelee.","Usijali! Niko hapa kila wakati."],
    unknown: ["Hiyo inavutia sana! Niambie zaidi.","Ningependa kusikia zaidi! Nini kingine kinakuja akilini?"],
  },
};

export function generateReply(
  userText: string,
  scenarioTitle: string,
  historyCount: number,
  language: LanguageCode = "en",
): string {
  const scenario = detectScenario(scenarioTitle);
  const intent = detectIntent(userText);

  // 1. Try scenario-specific pool first (English-only but context-rich)
  const scenarioPool = REPLIES[scenario]?.[intent];
  if (scenarioPool && scenarioPool.length > 0) {
    return scenarioPool[historyCount % scenarioPool.length];
  }

  // 2. Fall back to per-language pool
  const langPool = LANGS[language]?.[intent] || LANGS.en[intent] || LANGS.en.unknown;
  return langPool[historyCount % langPool.length];
}

export function generateOpener(scenarioTitle: string, language: LanguageCode = "en"): string {
  const scenario = detectScenario(scenarioTitle);

  // 1. Try scenario-specific greeting
  const scenarioGreeting = REPLIES[scenario]?.greeting;
  if (scenarioGreeting && scenarioGreeting.length > 0) {
    return scenarioGreeting[0];
  }

  // 2. Fall back to per-language greeting
  return (LANGS[language]?.greeting || LANGS.en.greeting)[0];
}
