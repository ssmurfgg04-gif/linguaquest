import type { LanguageCode } from "./mock";

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  language: LanguageCode;
  stars: number;
  streak: number;
  sessions: number;
  xp?: number;
  isYou?: boolean;
}

const AVATARS = ["🦁", "🐯", "🐻", "🐼", "🐨", "🦊", "🐰", "🐸", "🦉", "🐝", "🐳", "🦋"];

const FRIEND_SEEDS: Record<string, { name: string; avatar: string }[]> = {
  en: [
    { name: "Alex", avatar: "🦁" }, { name: "Maya", avatar: "🦋" }, { name: "James", avatar: "🐯" },
    { name: "Sophie", avatar: "🦊" }, { name: "Daniel", avatar: "🐻" }, { name: "Emma", avatar: "🐝" },
    { name: "Lucas", avatar: "🐼" }, { name: "Olivia", avatar: "🐸" }, { name: "Ethan", avatar: "🦉" },
    { name: "Ava", avatar: "🐰" }, { name: "Noah", avatar: "🐘" }, { name: "Isabella", avatar: "🦜" },
  ],
  de: [
    { name: "Lena", avatar: "🦋" }, { name: "Finn", avatar: "🦁" }, { name: "Hannah", avatar: "🐰" },
    { name: "Max", avatar: "🐯" }, { name: "Lea", avatar: "🐝" }, { name: "Jonas", avatar: "🐻" },
    { name: "Marie", avatar: "🦊" }, { name: "Felix", avatar: "🐼" }, { name: "Emilia", avatar: "🐸" },
    { name: "Paul", avatar: "🦉" }, { name: "Mia", avatar: "🐘" }, { name: "Erik", avatar: "🦜" },
  ],
  fr: [
    { name: "Léo", avatar: "🦁" }, { name: "Chloé", avatar: "🦋" }, { name: "Hugo", avatar: "🐯" },
    { name: "Camille", avatar: "🐰" }, { name: "Nathan", avatar: "🐻" }, { name: "Sarah", avatar: "🐝" },
    { name: "Tom", avatar: "🐼" }, { name: "Léa", avatar: "🦊" }, { name: "Maxime", avatar: "🐸" },
    { name: "Manon", avatar: "🦉" }, { name: "Lucas", avatar: "🐘" }, { name: "Jade", avatar: "🦜" },
  ],
  sw: [
    { name: "Juma", avatar: "🦁" }, { name: "Aisha", avatar: "🦋" }, { name: "Baraka", avatar: "🐯" },
    { name: "Zuri", avatar: "🐰" }, { name: "Kito", avatar: "🐻" }, { name: "Amara", avatar: "🐝" },
    { name: "Imani", avatar: "🐼" }, { name: "Neema", avatar: "🦊" }, { name: "Safiya", avatar: "🐸" },
    { name: "Kofi", avatar: "🦉" }, { name: "Asha", avatar: "🐘" }, { name: "Farhan", avatar: "🦜" },
  ],
};

export function getLeaderboard(language: LanguageCode, userXP?: number, userName?: string): LeaderboardEntry[] {
  const friends = FRIEND_SEEDS[language] || FRIEND_SEEDS.en;

  // Generate consistent scores based on name hash (so they don't change every render)
  const entries: LeaderboardEntry[] = friends.map((f, i) => {
    const hash = f.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const baseXP = Math.max(50, 800 - i * 60 + (hash % 40));
    return {
      rank: 0,
      name: f.name,
      avatar: f.avatar,
      language,
      stars: Math.max(1, Math.floor(baseXP / 10)),
      streak: Math.max(0, 20 - i * 1.5 + (hash % 5)),
      sessions: Math.max(1, Math.floor(baseXP / 15)),
      xp: baseXP,
    };
  });

  // Add the user if they have XP
  if (userXP !== undefined && userXP > 0 && userName) {
    entries.push({
      rank: 0,
      name: userName,
      avatar: "⭐",
      language,
      stars: Math.floor(userXP / 10),
      streak: 0, // Will be filled from XP state
      sessions: Math.floor(userXP / 15),
      xp: userXP,
      isYou: true,
    });
  }

  // Sort by XP descending and assign ranks
  entries.sort((a, b) => (b.xp || 0) - (a.xp || 0));
  entries.forEach((e, i) => { e.rank = i + 1; });

  return entries;
}