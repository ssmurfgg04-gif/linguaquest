import type { LanguageCode } from "./mock";

export interface DailyChallenge {
  date: string;
  language: LanguageCode;
  title: string;
  prompt: string;
  type: "speaking" | "writing" | "vocab" | "grammar";
  emoji: string;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const CHALLENGE_POOL: Omit<DailyChallenge, "date" | "language">[] = [
  { title: "Morning greeting", prompt: "Say 'Good morning' and ask how someone's night was.", type: "speaking", emoji: "🌅" },
  { title: "Order food", prompt: "Order your favourite meal at a restaurant.", type: "speaking", emoji: "🍜" },
  { title: "Describe your family", prompt: "Write 3 sentences about your family.", type: "writing", emoji: "👨‍👩‍👧" },
  { title: "5 new words", prompt: "Learn 5 new words related to weather.", type: "vocab", emoji: "🌤️" },
  { title: "Fix this sentence", prompt: "Correct: 'Yesterday I go to school.'", type: "grammar", emoji: "✏️" },
  { title: "Ask directions", prompt: "Ask for directions to the library.", type: "speaking", emoji: "🗺️" },
  { title: "Your weekend", prompt: "Write 3 sentences about your weekend plans.", type: "writing", emoji: "📝" },
  { title: "Colours quiz", prompt: "Name 5 colours and an object for each.", type: "vocab", emoji: "🎨" },
  { title: "Past tense fix", prompt: "Correct: 'She run to the park yesterday.'", type: "grammar", emoji: "🔄" },
  { title: "Introduce a friend", prompt: "Introduce your best friend to someone new.", type: "speaking", emoji: "🤝" },
  { title: "My favourite food", prompt: "Describe your favourite meal and why you love it.", type: "writing", emoji: "🍕" },
  { title: "Emotions vocab", prompt: "Name 5 emotions and when you feel each.", type: "vocab", emoji: "😊" },
  { title: "Plural fix", prompt: "Correct: 'I have two cat and three dog.'", type: "grammar", emoji: "📚" },
  { title: "Shop conversation", prompt: "Ask how much something costs and say thank you.", type: "speaking", emoji: "🛍️" },
  { title: "Describe your home", prompt: "Write 4 sentences about your house or room.", type: "writing", emoji: "🏠" },
  { title: "Body parts", prompt: "Name 8 body parts in your target language.", type: "vocab", emoji: "🦶" },
  { title: "Article fix", prompt: "Correct: 'I saw a elephant at the zoo.'", type: "grammar", emoji: "📖" },
  { title: "Make a request", prompt: "Politely ask someone to help you with homework.", type: "speaking", emoji: "🙏" },
  { title: "Describe a photo", prompt: "Describe a photo of your favourite place.", type: "writing", emoji: "📸" },
  { title: "Numbers 1-20", prompt: "Count from 1 to 20 in your target language.", type: "vocab", emoji: "🔢" },
  { title: "Preposition fix", prompt: "Correct: 'The book is on the table.' vs 'The cat is in the roof.'", type: "grammar", emoji: "📍" },
  { title: "Apologise", prompt: "Apologise for being late and explain why.", type: "speaking", emoji: "😅" },
  { title: "My hobby", prompt: "Write 4 sentences about what you love doing.", type: "writing", emoji: "🎯" },
  { title: "Clothes vocab", prompt: "Name 7 items of clothing.", type: "vocab", emoji: "👕" },
  { title: "Subject-verb fix", prompt: "Correct: 'He go to school every day.'", type: "grammar", emoji: "✅" },
];

export function getDailyChallenge(date: Date = new Date(), language: LanguageCode = "en"): DailyChallenge {
  const daySeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const idx = Math.floor(seededRandom(daySeed) * CHALLENGE_POOL.length);
  const base = CHALLENGE_POOL[idx];
  return {
    ...base,
    date: date.toISOString().split("T")[0],
    language,
  };
}
