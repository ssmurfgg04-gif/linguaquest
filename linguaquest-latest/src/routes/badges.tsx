import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BADGES } from "@/data/mock";
import { loadXPState, getLevelName, getLevelEmoji, getLevelProgress, formatXP, type XPState } from "@/lib/xp-system";
import { Sparkles, Flame, Trophy, Target, Lock } from "lucide-react";

export const Route = createFileRoute("/badges")({
  head: () => ({
    meta: [
      { title: "Achievements — Ujuziverse" },
      { name: "description", content: "Track your achievements and earn badges as you learn." },
    ],
  }),
  component: BadgesPage,
});

interface DynamicBadge {
  id: string;
  emoji: string;
  title: string;
  description: string;
  earned: boolean;
  progress?: number; // 0-100
  check: (state: XPState) => boolean;
  progressFn?: (state: XPState) => number;
}

const DYNAMIC_BADGES: DynamicBadge[] = [
  // Original static badges
  { id: "first-words", emoji: "🐣", title: "First Words", description: "Finished your very first chat.", earned: true, check: () => true },
  { id: "kind-words", emoji: "💛", title: "Kind Words", description: "Used a polite phrase three times.", earned: true, check: () => true },
  { id: "streak-3", emoji: "🔥", title: "3-Day Streak", description: "Practiced three days in a row.", earned: false, check: (s) => s.streak >= 3, progressFn: (s) => Math.min(100, (s.streak / 3) * 100) },
  { id: "polyglot", emoji: "🌍", title: "Polyglot", description: "Held a chat fully in German or French.", earned: false, check: () => false, progressFn: () => 0 },
  { id: "presenter", emoji: "🎤", title: "Brave Presenter", description: "Finished a presentation scenario.", earned: false, check: () => false, progressFn: () => 0 },
  { id: "leader", emoji: "🚀", title: "Team Leader", description: "Completed a leadership scenario.", earned: false, check: () => false, progressFn: () => 0 },

  // New XP-based dynamic badges
  { id: "xp-100", emoji: "⚡", title: "XP Hunter", description: "Earn 100 total XP.", earned: false, check: (s) => s.totalXP >= 100, progressFn: (s) => Math.min(100, (s.totalXP / 100) * 100) },
  { id: "xp-500", emoji: "✨", title: "XP Collector", description: "Earn 500 total XP.", earned: false, check: (s) => s.totalXP >= 500, progressFn: (s) => Math.min(100, (s.totalXP / 500) * 100) },
  { id: "xp-1000", emoji: "💎", title: "XP Legend", description: "Earn 1,000 total XP.", earned: false, check: (s) => s.totalXP >= 1000, progressFn: (s) => Math.min(100, (s.totalXP / 1000) * 100) },
  { id: "level-3", emoji: "🌻", title: "Rising Star", description: "Reach Level 3.", earned: false, check: (s) => s.level >= 3, progressFn: (s) => Math.min(100, (s.level / 3) * 100) },
  { id: "level-5", emoji: "🔥", title: "On Fire", description: "Reach Level 5.", earned: false, check: (s) => s.level >= 5, progressFn: (s) => Math.min(100, (s.level / 5) * 100) },
  { id: "level-10", emoji: "🏆", title: "Language Legend", description: "Reach Level 10.", earned: false, check: (s) => s.level >= 10, progressFn: (s) => Math.min(100, (s.level / 10) * 100) },
  { id: "streak-7", emoji: "📅", title: "Week Warrior", description: "Maintain a 7-day streak.", earned: false, check: (s) => s.streak >= 7, progressFn: (s) => Math.min(100, (s.streak / 7) * 100) },
  { id: "streak-30", emoji: "👑", title: "Monthly Master", description: "Maintain a 30-day streak.", earned: false, check: (s) => s.streak >= 30, progressFn: (s) => Math.min(100, (s.streak / 30) * 100) },
  { id: "quiz-perfect", emoji: "🎯", title: "Quiz Master", description: "Get a perfect score on any quiz.", earned: false, check: (s) => s.history.some(e => e.type === "quiz.perfect"), progressFn: () => 0 },
  { id: "match-3stars", emoji: "🃏", title: "Match Pro", description: "Get 3 stars on a word match game.", earned: false, check: (s) => s.history.some(e => e.type === "match.perfect"), progressFn: () => 0 },
  { id: "speak-10", emoji: "🗣️", title: "Voice Star", description: "Complete 10 speaking sessions.", earned: false, check: (s) => s.history.filter(e => e.type.startsWith("speak.")).length >= 10, progressFn: (s) => Math.min(100, (s.history.filter(e => e.type.startsWith("speak.")).length / 10) * 100) },
  { id: "events-50", emoji: "🌟", title: "Dedicated Learner", description: "Complete 50 learning events.", earned: false, check: (s) => s.history.length >= 50, progressFn: (s) => Math.min(100, (s.history.length / 50) * 100) },
];

function BadgesPage() {
  const [xpState, setXpState] = useState<XPState>(loadXPState);

  useEffect(() => {
    // Refresh periodically (in case user earned something in another tab)
    const handler = () => setXpState(loadXPState());
    window.addEventListener("focus", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("focus", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  // Evaluate which dynamic badges are earned
  const badges = DYNAMIC_BADGES.map(b => ({
    ...b,
    earned: b.earned || b.check(xpState),
    progress: b.progressFn ? b.progressFn(xpState) : undefined,
  }));

  const earned = badges.filter((b) => b.earned).length;
  const levelProgress = getLevelProgress(xpState);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <section className="mt-8 relative overflow-hidden rounded-3xl gradient-ocean text-white p-6 shadow-soft">
          <div className="absolute right-5 top-5 text-4xl animate-bob">🏆</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Achievements</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">Your badges</h1>
          <p className="mt-2 text-white/90 max-w-lg">
            Every conversation and practice session earns you XP. Collect badges and level up!
          </p>
          <div className="mt-4 flex items-center gap-3 text-sm flex-wrap">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 font-bold">
              {earned} / {badges.length} earned
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-bold">
              {formatXP(xpState.totalXP)} XP total
            </span>
          </div>
        </section>

        {/* Level & XP Section */}
        <section className="mt-6 surface-card p-5 rounded-2xl border border-border/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-sun to-sun-foreground flex items-center justify-center text-2xl shadow-soft level-badge-glow">
                {getLevelEmoji(xpState.level)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{getLevelName(xpState.level)}</h3>
                <p className="text-xs text-muted-foreground">Level {xpState.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-sun-foreground flex items-center gap-1">
                <Sparkles className="h-5 w-5" />
                {formatXP(xpState.totalXP)}
              </p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sun to-primary transition-all duration-700 relative overflow-hidden"
              style={{ width: `${levelProgress}%` }}
            >
              <div className="absolute inset-0 xp-bar-shimmer" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
            <span>Level {xpState.level}</span>
            <span>{xpState.currentLevelXP} / {xpState.nextLevelXP} XP to Level {xpState.level + 1}</span>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mt-4 grid grid-cols-3 gap-3">
          <div className="surface-card p-3 rounded-xl border border-border/60 text-center">
            <Flame className="h-5 w-5 text-coral mx-auto" />
            <p className="text-lg font-bold mt-1">{xpState.streak}</p>
            <p className="text-[10px] text-muted-foreground">Day Streak</p>
          </div>
          <div className="surface-card p-3 rounded-xl border border-border/60 text-center">
            <Target className="h-5 w-5 text-primary mx-auto" />
            <p className="text-lg font-bold mt-1">{xpState.history.length}</p>
            <p className="text-[10px] text-muted-foreground">Activities</p>
          </div>
          <div className="surface-card p-3 rounded-xl border border-border/60 text-center">
            <Trophy className="h-5 w-5 text-sun-foreground mx-auto" />
            <p className="text-lg font-bold mt-1">{earned}</p>
            <p className="text-[10px] text-muted-foreground">Badges</p>
          </div>
        </section>

        {/* Badges Grid */}
        <section className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`surface-card p-5 border text-center transition-all ${
                badge.earned
                  ? "border-mint/40 hover:-translate-y-1 hover:shadow-pop"
                  : "border-border/40 opacity-70"
              }`}
            >
              <div className={`text-5xl mb-2 ${badge.earned ? "" : "grayscale"}`}>
                {badge.emoji}
              </div>
              <h3 className="text-display text-lg">{badge.title}</h3>
              <p className="text-xs mt-1 text-muted-foreground">
                {badge.description}
              </p>

              {/* Progress bar for incomplete badges */}
              {!badge.earned && badge.progress !== undefined && badge.progress > 0 ? (
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${badge.progress}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{Math.round(badge.progress)}%</p>
                </div>
              ) : badge.earned ? (
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-mint/20 text-mint-foreground border border-mint/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  Earned
                </span>
              ) : (
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  <Lock className="h-2.5 w-2.5" /> Locked
                </span>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}