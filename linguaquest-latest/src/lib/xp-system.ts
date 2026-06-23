// XP System — Gamification engine for LinguaQuest
// Persistent in localStorage, used across all pages

const XP_KEY = "lq.xp";

const isClient = typeof window !== "undefined";

export interface XPState {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  streak: number;
  lastActiveDate: string; // ISO date string YYYY-MM-DD
  history: XPEvent[];
}

export interface XPEvent {
  id: string;
  type: string;
  label: string;
  xp: number;
  timestamp: number;
}

// XP rewards for different actions
export const XP_REWARDS: Record<string, { xp: number; label: string }> = {
  // Chat & conversation
  "chat.complete":      { xp: 50,  label: "Completed a conversation" },
  "chat.good_score":    { xp: 30,  label: "Great score on feedback" },
  "chat.perfect":       { xp: 50,  label: "Perfect conversation!" },

  // Quiz
  "quiz.complete":      { xp: 30,  label: "Finished a quiz" },
  "quiz.perfect":       { xp: 60,  label: "Perfect quiz score!" },
  "quiz.good":          { xp: 40,  label: "Great quiz score" },

  // Match game
  "match.complete":     { xp: 25,  label: "Completed word match" },
  "match.perfect":      { xp: 50,  label: "Perfect match with 3 stars!" },

  // Speaking
  "speak.practice":     { xp: 20,  label: "Practiced speaking" },
  "speak.great_score":  { xp: 30,  label: "Great speaking score" },

  // Daily
  "daily.login":        { xp: 10,  label: "Daily login bonus" },
  "daily.streak_3":     { xp: 30,  label: "3-day streak bonus!" },
  "daily.streak_7":     { xp: 80,  label: "7-day streak bonus!" },
  "daily.streak_30":    { xp: 200, label: "30-day streak legend!" },

  // Other
  "vocabulary.learn":   { xp: 10,  label: "Learned new vocabulary" },
  "journal.write":      { xp: 15,  label: "Wrote a journal entry" },
  "mood.track":         { xp: 5,   label: "Tracked your mood" },
  "grammar.complete":   { xp: 25,  label: "Completed grammar exercise" },
  "pronunciation.complete": { xp: 25, label: "Completed pronunciation practice" },
};

// Level thresholds: XP needed to reach each level
// Level 1: 0, Level 2: 100, Level 3: 250, etc.
function xpForLevel(level: number): number {
  // Exponential-ish growth that feels achievable for kids
  return Math.floor(50 * Math.pow(level, 1.5));
}

export function calculateLevel(totalXP: number): { level: number; currentLevelXP: number; nextLevelXP: number } {
  let level = 1;
  while (totalXP >= xpForLevel(level + 1)) {
    level++;
  }
  const currentLevelXP = totalXP - xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1) - xpForLevel(level);
  return { level, currentLevelXP, nextLevelXP };
}

const LEVEL_NAMES = [
  "", // Level 0 doesn't exist
  "Beginner Explorer",
  "Curious Learner",
  "Active Speaker",
  "Confident Communicator",
  "Language Champion",
  "Conversation Star",
  "Fluent Friend",
  "Wordsmith",
  "Master Communicator",
  "Language Legend",
];

const LEVEL_EMOJIS = [
  "", "🌱", "🌿", "🌻", "⭐", "🔥", "💎", "🚀", "👑", "🌟", "🏆",
];

export function getLevelName(level: number): string {
  return LEVEL_NAMES[Math.min(level, LEVEL_NAMES.length - 1)] ?? `Level ${level}`;
}

export function getLevelEmoji(level: number): string {
  return LEVEL_EMOJIS[Math.min(level, LEVEL_EMOJIS.length - 1)] ?? "🏆";
}

export function loadXPState(): XPState {
  if (!isClient) {
    return { totalXP: 0, level: 1, currentLevelXP: 0, nextLevelXP: xpForLevel(2), streak: 0, lastActiveDate: "", history: [] };
  }
  try {
    const raw = localStorage.getItem(XP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as XPState;
      // Recalculate level from totalXP in case thresholds changed
      const { level, currentLevelXP, nextLevelXP } = calculateLevel(parsed.totalXP);
      return { ...parsed, level, currentLevelXP, nextLevelXP };
    }
  } catch {}
  return {
    totalXP: 0,
    level: 1,
    currentLevelXP: 0,
    nextLevelXP: xpForLevel(2),
    streak: 0,
    lastActiveDate: "",
    history: [],
  };
}

export function saveXPState(state: XPState): void {
  if (!isClient) return;
  try {
    // Keep only last 100 events to avoid bloating localStorage
    const trimmed = { ...state, history: state.history.slice(-100) };
    localStorage.setItem(XP_KEY, JSON.stringify(trimmed));
  } catch {}
}

export function addXP(eventType: string): { state: XPState; xpGained: number; leveledUp: boolean; newLevel: number } {
  if (!isClient) return { state: loadXPState(), xpGained: 0, leveledUp: false, newLevel: 1 };
  const reward = XP_REWARDS[eventType];
  if (!reward) {
    const state = loadXPState();
    return { state, xpGained: 0, leveledUp: false, newLevel: state.level };
  }

  const state = loadXPState();
  const oldLevel = state.level;
  const newTotalXP = state.totalXP + reward.xp;
  const { level: newLevel, currentLevelXP, nextLevelXP } = calculateLevel(newTotalXP);

  // Check and update streak
  const today = new Date().toISOString().split("T")[0];
  let streak = state.streak;
  if (state.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (state.lastActiveDate === yesterday) {
      streak += 1;
    } else if (state.lastActiveDate !== today) {
      streak = 1;
    }
  }

  const event: XPEvent = {
    id: crypto.randomUUID(),
    type: eventType,
    label: reward.label,
    xp: reward.xp,
    timestamp: Date.now(),
  };

  const newState: XPState = {
    totalXP: newTotalXP,
    level: newLevel,
    currentLevelXP,
    nextLevelXP,
    streak,
    lastActiveDate: today,
    history: [...state.history, event],
  };

  saveXPState(newState);

  // Check for streak bonuses
  if (streak === 3) addXPSilent("daily.streak_3");
  if (streak === 7) addXPSilent("daily.streak_7");
  if (streak === 30) addXPSilent("daily.streak_30");

  return {
    state: newState,
    xpGained: reward.xp,
    leveledUp: newLevel > oldLevel,
    newLevel,
  };
}

// Silent XP add (no return needed, for streak bonuses)
function addXPSilent(eventType: string): void {
  if (!isClient) return;
  const reward = XP_REWARDS[eventType];
  if (!reward) return;
  const state = loadXPState();
  const newTotalXP = state.totalXP + reward.xp;
  const { level, currentLevelXP, nextLevelXP } = calculateLevel(newTotalXP);
  const event: XPEvent = {
    id: crypto.randomUUID(),
    type: eventType,
    label: reward.label,
    xp: reward.xp,
    timestamp: Date.now(),
  };
  saveXPState({ ...state, totalXP: newTotalXP, level, currentLevelXP, nextLevelXP, history: [...state.history, event] });
}

// Claim daily login XP
export function claimDailyLogin(): { state: XPState; xpGained: number; leveledUp: boolean; newLevel: number } | null {
  if (!isClient) return null;
  const state = loadXPState();
  const today = new Date().toISOString().split("T")[0];
  if (state.lastActiveDate === today) return null; // Already claimed
  return addXP("daily.login");
}

// Format XP for display
export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return String(xp);
}

// Get level progress percentage (0-100)
export function getLevelProgress(state: XPState): number {
  if (state.nextLevelXP === 0) return 100;
  return Math.min(100, Math.round((state.currentLevelXP / state.nextLevelXP) * 100));
}