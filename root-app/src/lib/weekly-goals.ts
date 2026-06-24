// Weekly goals & rewards system
const GOALS_KEY = "lq.weekly-goals";
const isClient = typeof window !== "undefined";

export interface WeeklyGoals {
  weekStart: string; // ISO date of Monday
  sessionsTarget: number;
  sessionsCurrent: number;
  xpTarget: number;
  xpCurrent: number;
  quizTarget: number;
  quizCurrent: number;
  claimed: boolean;
  bonusAwarded: boolean;
}

const DEFAULT_TARGETS = { sessionsTarget: 5, xpTarget: 200, quizTarget: 3 };

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
}

const defaultGoals = (): WeeklyGoals => ({
  weekStart: getWeekStart(new Date()),
  ...DEFAULT_TARGETS,
  sessionsCurrent: 0,
  xpCurrent: 0,
  quizCurrent: 0,
  claimed: false,
  bonusAwarded: false,
});

export function loadWeeklyGoals(): WeeklyGoals {
  if (!isClient) return defaultGoals();
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WeeklyGoals;
      const currentWeek = getWeekStart(new Date());
      if (parsed.weekStart === currentWeek) return parsed;
    }
  } catch {}
  return defaultGoals();
}

export function saveWeeklyGoals(goals: WeeklyGoals): void {
  if (!isClient) return;
  try { localStorage.setItem(GOALS_KEY, JSON.stringify(goals)); } catch {}
}

// Track an activity toward weekly goals
export function trackWeeklyActivity(type: "session" | "xp" | "quiz", amount: number = 1): WeeklyGoals {
  if (!isClient) return defaultGoals();
  const goals = loadWeeklyGoals();
  const currentWeek = getWeekStart(new Date());
  if (goals.weekStart !== currentWeek) {
    // Reset for new week
    goals.weekStart = currentWeek;
    goals.sessionsCurrent = 0;
    goals.xpCurrent = 0;
    goals.quizCurrent = 0;
    goals.claimed = false;
    goals.bonusAwarded = false;
  }
  switch (type) {
    case "session": goals.sessionsCurrent += amount; break;
    case "xp": goals.xpCurrent += amount; break;
    case "quiz": goals.quizCurrent += amount; break;
  }
  saveWeeklyGoals(goals);
  return goals;
}

export function areAllGoalsComplete(goals: WeeklyGoals): boolean {
  return goals.sessionsCurrent >= goals.sessionsTarget
    && goals.xpCurrent >= goals.xpTarget
    && goals.quizCurrent >= goals.quizTarget;
}

export function getGoalsProgress(goals: WeeklyGoals) {
  return {
    sessions: { current: goals.sessionsCurrent, target: goals.sessionsTarget, pct: Math.min(100, Math.round((goals.sessionsCurrent / goals.sessionsTarget) * 100)) },
    xp: { current: goals.xpCurrent, target: goals.xpTarget, pct: Math.min(100, Math.round((goals.xpCurrent / goals.xpTarget) * 100)) },
    quiz: { current: goals.quizCurrent, target: goals.quizTarget, pct: Math.min(100, Math.round((goals.quizCurrent / goals.quizTarget) * 100)) },
  };
}

export function getWeekDaysRemaining(): number {
  const now = new Date();
  const day = now.getDay();
  // Days until Sunday (6 = Saturday, 0 = Sunday = end of week)
  return day === 0 ? 0 : 7 - day;
}