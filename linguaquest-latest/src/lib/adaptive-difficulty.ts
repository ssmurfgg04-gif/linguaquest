// Adaptive difficulty — filters/recommends content based on XP level
import { loadXPState } from "./xp-system";

export type DifficultyTier = "beginner" | "intermediate" | "advanced";

/**
 * Map XP level to recommended difficulty tier.
 * Levels 1-3: beginner, 4-6: intermediate, 7+: advanced
 */
export function getDifficultyTier(): DifficultyTier {
  const { level } = loadXPState();
  if (level >= 7) return "advanced";
  if (level >= 4) return "intermediate";
  return "beginner";
}

/**
 * Returns a sort key for difficulty — lower = easier.
 * Used to sort quizzes/games so recommended difficulty appears first.
 */
export function difficultySortKey(difficulty: string | undefined): number {
  const tier = getDifficultyTier();
  const d = difficulty || "beginner";
  const order: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };

  // Put the user's current tier first, then easier, then harder
  const userOrder = order[tier] ?? 0;
  const itemOrder = order[d] ?? 0;

  if (itemOrder === userOrder) return -1;  // Current tier: top priority
  if (itemOrder < userOrder) return 0;     // Easier: second
  return 1;                                 // Harder: last
}

/**
 * Filter an array by difficulty, prioritizing the user's current tier
 * but including one level above for challenge.
 */
export function adaptiveSort<T extends { difficulty?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => difficultySortKey(a.difficulty) - difficultySortKey(b.difficulty));
}