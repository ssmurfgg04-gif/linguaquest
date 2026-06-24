// Mock data for the UI shell. Replace with backend later.

export type LanguageCode = "en" | "de" | "fr" | "sw";

export const LANGUAGES: { code: LanguageCode; label: string; flag: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English",   flag: "🇬🇧" },
  { code: "de", label: "German",  nativeLabel: "Deutsch",   flag: "🇩🇪" },
  { code: "fr", label: "French",  nativeLabel: "Français",  flag: "🇫🇷" },
  { code: "sw", label: "Swahili", nativeLabel: "Kiswahili", flag: "🇰🇪" },
];

export const LANGUAGE_LABEL: Record<LanguageCode, string> = {
  en: "English",
  de: "German",
  fr: "French",
  sw: "Swahili",
};

export type CharacterId =
  | "amara"     // friendly friend
  | "mwalimu"   // helpful teacher
  | "kito"      // classmate
  | "zuri"      // team leader
  | "baraka"    // curious customer
  | "imani";    // interviewer

export interface Character {
  id: CharacterId;
  name: string;
  role: string;
  emoji: string;
  gradient: "sunset" | "ocean" | "berry" | "meadow" | "hero";
  mood: string;
  pace: "Calm" | "Lively" | "Steady" | "Quick";
  accent: string;
  bio: string;
}

export const CHARACTERS: Character[] = [
  {
    id: "amara",
    name: "Amara",
    role: "Friendly Friend",
    emoji: "🌻",
    gradient: "sunset",
    mood: "Warm & playful",
    pace: "Calm",
    accent: "Neutral",
    bio: "Loves stories about pets, weekends and favourite snacks. Always ready to start a chat.",
  },
  {
    id: "mwalimu",
    name: "Mwalimu Juma",
    role: "Helpful Teacher",
    emoji: "📚",
    gradient: "ocean",
    mood: "Patient & kind",
    pace: "Steady",
    accent: "East African",
    bio: "Helps you raise your hand in class, ask great questions and explain your thinking.",
  },
  {
    id: "kito",
    name: "Kito",
    role: "Classmate",
    emoji: "🎒",
    gradient: "meadow",
    mood: "Curious & fun",
    pace: "Lively",
    accent: "Neutral",
    bio: "Your study buddy for group projects, lunch breaks and giggly classroom moments.",
  },
  {
    id: "zuri",
    name: "Zuri",
    role: "Team Leader",
    emoji: "🚀",
    gradient: "berry",
    mood: "Confident",
    pace: "Quick",
    accent: "Neutral",
    bio: "Practice leading a team, sharing ideas in meetings, and motivating friends.",
  },
  {
    id: "baraka",
    name: "Baraka",
    role: "Curious Customer",
    emoji: "🛍️",
    gradient: "sunset",
    mood: "Friendly & inquisitive",
    pace: "Steady",
    accent: "East African",
    bio: "Walks into your imaginary shop with smart questions. Great for entrepreneurs.",
  },
  {
    id: "imani",
    name: "Imani",
    role: "Interviewer",
    emoji: "🎤",
    gradient: "hero",
    mood: "Encouraging",
    pace: "Calm",
    accent: "Neutral",
    bio: "A friendly interviewer for your dream future job. Helps you sound confident.",
  },
];

export const CHARACTER_BY_ID: Record<string, Character> = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c]),
);

export type LevelId = 1 | 2 | 3 | 4;

export interface Level {
  id: LevelId;
  title: string;
  theme: string;
  gradient: Character["gradient"];
  emoji: string;
  unlocked: boolean;
}

export const LEVELS: Level[] = [
  { id: 1, title: "Social Confidence",  theme: "Make friends and share who you are", gradient: "sunset", emoji: "🌈", unlocked: true },
  { id: 2, title: "School Communication", theme: "Speak up in class with courage",     gradient: "ocean",  emoji: "🏫", unlocked: true },
  { id: 3, title: "Leadership",          theme: "Lead, persuade and solve problems",   gradient: "meadow", emoji: "🚀", unlocked: false },
  { id: 4, title: "Future Readiness",    theme: "Interviews, business, public speaking", gradient: "berry", emoji: "🌟", unlocked: false },
];

export interface Scenario {
  id: string;
  level: LevelId;
  title: string;
  summary: string;
  characterId: CharacterId;
  minutes: number;
  stars: 0 | 1 | 2 | 3;
  completed: boolean;
  realLifeSkill: string;
  emoji: string;
  practiceDescription: string;
}

export const SCENARIOS: Scenario[] = [
  // Level 1
  { id: "meet-new-friend",   level: 1, title: "Meeting a New Friend",    summary: "Start a friendly conversation at the playground.",        characterId: "amara",   minutes: 5, stars: 3, completed: true,  realLifeSkill: "Making friends",          emoji: "👋", practiceDescription: "Greetings, asking names, sharing interests, and showing warmth when meeting someone new." },
  { id: "introduce-yourself",level: 1, title: "Introducing Yourself",    summary: "Share your name, hobbies, and a fun fact.",               characterId: "amara",   minutes: 4, stars: 2, completed: true,  realLifeSkill: "Personal branding",       emoji: "😊", practiceDescription: "Talking about yourself clearly — your name, what you enjoy, and what makes you unique." },
  { id: "play-with-friends", level: 1, title: "Playing with Friends",    summary: "Invite a friend to a game and agree on rules together.",  characterId: "kito",    minutes: 6, stars: 1, completed: false, realLifeSkill: "Cooperation",             emoji: "⚽", practiceDescription: "Making suggestions, agreeing on rules, and using friendly language to have fun together." },
  { id: "talk-hobbies",      level: 1, title: "Talking About Hobbies",   summary: "Tell a friend what you love doing after school.",         characterId: "kito",    minutes: 5, stars: 0, completed: false, realLifeSkill: "Self-expression",         emoji: "🎨", practiceDescription: "Describing your favourite activities, asking about others' hobbies, and finding common interests." },
  // Level 2
  { id: "ask-teacher",       level: 2, title: "Asking a Teacher for Help", summary: "Politely ask for help when you don't understand.",      characterId: "mwalimu", minutes: 6, stars: 0, completed: false, realLifeSkill: "Seeking support",         emoji: "✋", practiceDescription: "Raising your hand, asking clear questions, and showing respect when you need help in class." },
  { id: "participate-class", level: 2, title: "Participating in Class",   summary: "Share your opinion in a class discussion.",              characterId: "mwalimu", minutes: 7, stars: 0, completed: false, realLifeSkill: "Speaking up",             emoji: "🙋", practiceDescription: "Sharing your ideas in a group, agreeing or politely disagreeing, and building on others' points." },
  { id: "group-project",     level: 2, title: "Group Project",            summary: "Divide tasks with your team and agree on a plan.",       characterId: "kito",    minutes: 8, stars: 0, completed: false, realLifeSkill: "Teamwork",                emoji: "🧩", practiceDescription: "Suggesting roles, dividing work fairly, and encouraging teammates to contribute." },
  { id: "short-presentation",level: 2, title: "Giving a Short Presentation", summary: "Present a topic clearly in 3 minutes.",               characterId: "imani",   minutes: 8, stars: 0, completed: false, realLifeSkill: "Presenting",              emoji: "🎤", practiceDescription: "Organising your thoughts, speaking clearly, and answering questions with confidence." },
  // Level 3
  { id: "organize-team",     level: 3, title: "Organizing a Team",        summary: "Lead a small team and assign roles.",                    characterId: "zuri",    minutes: 9, stars: 0, completed: false, realLifeSkill: "Leadership",              emoji: "🧭", practiceDescription: "Delegating tasks, motivating a team, and making decisions that include everyone's strengths." },
  { id: "explain-ideas",     level: 3, title: "Explaining Ideas",         summary: "Pitch an idea so anyone can understand it.",             characterId: "zuri",    minutes: 8, stars: 0, completed: false, realLifeSkill: "Communicating clearly",   emoji: "💡", practiceDescription: "Breaking down complex ideas, using examples, and checking that your listener understands." },
  { id: "solve-problems",    level: 3, title: "Solving Problems",         summary: "Work through a disagreement with a teammate.",           characterId: "zuri",    minutes: 9, stars: 0, completed: false, realLifeSkill: "Problem-solving",         emoji: "🛠️", practiceDescription: "Listening to different perspectives, finding compromises, and keeping conversations respectful." },
  { id: "debates",           level: 3, title: "Debates",                  summary: "Defend your point politely and listen back.",            characterId: "imani",   minutes: 10, stars: 0, completed: false, realLifeSkill: "Critical thinking",       emoji: "⚖️", practiceDescription: "Making arguments with evidence, responding to counterpoints, and disagreeing respectfully." },
  // Level 4
  { id: "meet-new-people",   level: 4, title: "Meeting New People",       summary: "Introduce yourself in a new community.",                 characterId: "amara",   minutes: 7, stars: 0, completed: false, realLifeSkill: "Networking",              emoji: "🤝", practiceDescription: "Starting conversations with strangers, making a good first impression, and finding common ground." },
  { id: "public-speaking",   level: 4, title: "Public Speaking",          summary: "Speak to a crowd with calm and energy.",                 characterId: "imani",   minutes: 12, stars: 0, completed: false, realLifeSkill: "Stage confidence",        emoji: "🎙️", practiceDescription: "Managing nerves, projecting your voice, using gestures, and connecting with a larger audience." },
  { id: "entrepreneurship",  level: 4, title: "Entrepreneurship",         summary: "Pitch your small business idea.",                        characterId: "baraka",  minutes: 10, stars: 0, completed: false, realLifeSkill: "Business mindset",        emoji: "💼", practiceDescription: "Explaining what your business does, why it matters, and convincing others to support it." },
  { id: "customer-interaction", level: 4, title: "Customer Interaction",  summary: "Help a customer find the perfect product.",              characterId: "baraka",  minutes: 8, stars: 0, completed: false, realLifeSkill: "Service skills",          emoji: "🛒", practiceDescription: "Understanding customer needs, making recommendations, and handling questions with a smile." },
  { id: "professional-convo",level: 4, title: "Professional Conversations", summary: "Have a polite, clear chat with a colleague.",         characterId: "imani",   minutes: 8, stars: 0, completed: false, realLifeSkill: "Workplace skills",        emoji: "🗂️", practiceDescription: "Using professional tone, following up on tasks, and building good working relationships." },
  { id: "job-interview",     level: 4, title: "Job Interview",            summary: "Answer interview questions about your strengths.",       characterId: "imani",   minutes: 12, stars: 0, completed: false, realLifeSkill: "Career readiness",        emoji: "🏆", practiceDescription: "Answering common interview questions, highlighting your strengths, and asking thoughtful questions back." },
];

export const SCENARIO_BY_ID: Record<string, Scenario> = Object.fromEntries(
  SCENARIOS.map((s) => [s.id, s]),
);

export interface Badge {
  id: string;
  emoji: string;
  title: string;
  description: string;
  earned: boolean;
}

export const BADGES: Badge[] = [
  { id: "first-words",  emoji: "🐣", title: "First Words",       description: "Finished your very first chat.",       earned: true },
  { id: "kind-words",   emoji: "💛", title: "Kind Words",        description: "Used a polite phrase three times.",    earned: true },
  { id: "streak-3",     emoji: "🔥", title: "3-Day Streak",      description: "Practiced three days in a row.",       earned: true },
  { id: "polyglot",     emoji: "🌍", title: "Polyglot",          description: "Held a chat fully in German or French.", earned: false },
  { id: "presenter",    emoji: "🎤", title: "Brave Presenter",   description: "Finished a presentation scenario.",    earned: false },
  { id: "leader",       emoji: "🚀", title: "Team Leader",       description: "Completed a leadership scenario.",     earned: false },
];

export interface ChatMessage {
  id: string;
  from: "ai" | "me";
  text: string;
  hint?: string;
}

export const SAMPLE_CHAT: ChatMessage[] = [
  { id: "m1", from: "ai", text: "Hi! I'm Amara. I just moved to your school. What's your name?" },
  { id: "m2", from: "me", text: "Hi Amara! My name is Sam. Nice to meet you!" },
  { id: "m3", from: "ai", text: "Nice to meet you too, Sam! What do you like to do after school?" },
  { id: "m4", from: "me", text: "I like drawing and playing football. Do you like sports?" },
  { id: "m5", from: "ai", text: "Yes! Football is my favourite. Maybe we can play together this weekend?", hint: "Try answering with: 'That sounds fun, I'd love to.'" },
];

export interface FeedbackReport {
  confidence: number; // 0-100
  fluency: number;    // 0-100
  newWords: { word: string; meaning: string }[];
  strengths: string[];
  improvements: string[];
  encouragement: string;
  realLifeNote: string;
  corrections: { original: string; better: string; reason: string }[];
}

export const SAMPLE_FEEDBACK: FeedbackReport = {
  confidence: 82,
  fluency: 74,
  newWords: [
    { word: "favourite", meaning: "the one you like most" },
    { word: "weekend",   meaning: "Saturday and Sunday" },
  ],
  strengths: [
    "You greeted Amara warmly.",
    "You asked a question back — great conversation skill!",
    "Your sentences were clear and friendly.",
  ],
  improvements: [
    "Try adding one more detail when you answer.",
    "Practice the phrase 'I'd love to' for invitations.",
  ],
  encouragement:
    "Brilliant chat, Sam! You sounded warm and curious — exactly how new friendships begin.",
  realLifeNote:
    "Starting friendly conversations is the same skill you'll use later when joining a new team, club, or workplace.",
  corrections: [
    { original: "I like draw", better: "I like drawing", reason: "After 'like', verbs end in -ing." },
  ],
};

export const USER_STATS = {
  name: "",
  ageGroup: "" as string,
  language: "en" as LanguageCode,
  stars: 0,
  streak: 0,
  sessions: 0,
  confidence: 0,
  fluency: 0,
  level: 1 as LevelId,
};
