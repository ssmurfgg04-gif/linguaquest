import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Flame, Star, Trophy, Sparkles, Share2, Check } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BADGES, LEVELS, SCENARIOS, USER_STATS } from "@/data/mock";
import { getGuestToken } from "@/lib/sessions";
import { loadStatsFn } from "@/lib/stats.functions";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your progress — Ujuziverse" },
      { name: "description", content: "Track your stars, streaks, badges, confidence and fluency on your Ujuziverse journey." },
      { property: "og:title", content: "Your Ujuziverse progress" },
      { property: "og:description", content: "Stars, streaks, badges and growing confidence." },
    ],
  }),
  component: Progress,
});

const STREAK_HISTORY_KEY = "lq.streakHistory";
const STREAK_DAYS = 70;

const STREAK_COLOR: Record<number, string> = {
  0: "bg-muted/30",
  1: "bg-mint/30",
  2: "bg-mint/60",
  3: "bg-mint",
};

const STAT_TONES: Record<string, string> = {
  coral: "from-coral/20 to-coral/5 text-coral",
  sun:   "from-sun/30 to-sun/5 text-sun-foreground",
  mint:  "from-mint/30 to-mint/5 text-mint-foreground",
  grape: "from-grape/25 to-grape/5 text-grape",
};

const METER_BG: Record<string, string> = {
  coral: "gradient-sunset",
  sky: "gradient-ocean",
};

function getStreakHistory(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(STREAK_HISTORY_KEY) || "{}"); } catch { return {}; }
}

function Progress() {
  const completed = useMemo(() => SCENARIOS.filter((s) => s.completed).length, []);
  const [stats, setStats] = useState(USER_STATS);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);
  const history = useMemo(() => getStreakHistory(), []);

  useEffect(() => {
    (async () => {
      try {
        const res = await loadStatsFn({ data: { guestToken: getGuestToken() } });
        setStats((s) => ({ ...s, sessions: res.sessions, stars: res.stars, streak: res.streak, confidence: res.confidence, fluency: res.fluency }));
      } catch (e) { console.warn("Failed to load stats", e); }
      setLoading(false);
    })();
  }, []);

  async function shareProgress() {
    const text = `I've been learning on Ujuziverse! 🦜\n🔥 ${stats.streak} day streak\n⭐ ${stats.stars} stars\n💬 ${stats.sessions} sessions\n🏆 ${completed} scenarios done\nConfidence: ${stats.confidence}% · Fluency: ${stats.fluency}%\n\nStart your journey at linguaquest.app!`;
    if (navigator.share) {
      try { await navigator.share({ title: "My Ujuziverse progress", text }); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }

  const today = new Date();
  const streakDates: { date: Date; level: 0 | 1 | 2 | 3 }[] = [];
  for (let i = STREAK_DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const sessionsOnDay = history[key] || 0;
    const level = sessionsOnDay === 0 ? 0 : sessionsOnDay <= 2 ? 1 : sessionsOnDay <= 5 ? 2 : 3;
    streakDates.push({ date: d, level });
  }

  const monthLabels: { label: string; index: number }[] = [];
  let lastMonth = -1;
  streakDates.forEach((sd, i) => {
    const m = sd.date.getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ label: sd.date.toLocaleDateString("en", { month: "short" }), index: i });
      lastMonth = m;
    }
  });

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-display text-3xl sm:text-4xl">Your journey, {stats.name}</h1>
              <p className="text-muted-foreground mt-2">Keep going — every chat is a real-life skill.</p>
            </div>
            <button
              onClick={shareProgress}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold hover:bg-accent"
            >
              {shareCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {shareCopied ? "Copied!" : "Share"}
            </button>
          </div>
        </section>

        <section className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              <div className="surface-card p-6 space-y-3"><div className="h-5 w-20 animate-pulse rounded bg-muted" /><div className="h-8 w-12 animate-pulse rounded bg-muted" /></div>
              <div className="surface-card p-6 space-y-3"><div className="h-5 w-20 animate-pulse rounded bg-muted" /><div className="h-8 w-12 animate-pulse rounded bg-muted" /></div>
              <div className="surface-card p-6 space-y-3"><div className="h-5 w-20 animate-pulse rounded bg-muted" /><div className="h-8 w-12 animate-pulse rounded bg-muted" /></div>
              <div className="surface-card p-6 space-y-3"><div className="h-5 w-20 animate-pulse rounded bg-muted" /><div className="h-8 w-12 animate-pulse rounded bg-muted" /></div>
            </>
          ) : (
            <>
              <StatCard icon={<Flame className="h-5 w-5" />} label="Day streak" value={stats.streak} tone="coral" />
              <StatCard icon={<Star className="h-5 w-5 fill-current" />} label="Stars earned" value={stats.stars} tone="sun" />
              <StatCard icon={<Sparkles className="h-5 w-5" />} label="Sessions" value={stats.sessions} tone="mint" />
              <StatCard icon={<Trophy className="h-5 w-5" />} label="Scenarios done" value={`${completed}/${SCENARIOS.length}`} tone="grape" />
            </>
          )}

        </section>

        <section className="mt-6 surface-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-display text-lg">Practice streak</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-muted/30" /> None</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-mint/30" /> Light</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-mint/60" /> Medium</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-mint" /> High</span>
            </div>
          </div>
          <div className="flex gap-[2px]">
            <div className="flex flex-col gap-[2px]">
              {monthLabels.map((ml) => (
                <div key={ml.index} className="h-3" />
              ))}
            </div>
            <div className="flex gap-[2px] flex-1 overflow-x-auto pb-1">
              {streakDates.map((sd, i) => (
                <div
                  key={i}
                  className={`h-3 min-w-[10px] rounded-sm ${STREAK_COLOR[sd.level]}`}
                  title={`${sd.date.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}: ${history[sd.date.toISOString().split("T")[0]] || 0} session(s)`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid lg:grid-cols-2 gap-6">
          <div className="surface-card p-6">
            <h2 className="text-display text-xl">Skill levels</h2>
            <div className="mt-4 space-y-4">
              <Meter label="Confidence" value={stats.confidence} tone="coral" />
              <Meter label="Fluency"    value={stats.fluency}    tone="sky" />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Confidence grows when you keep speaking. Fluency grows when you try new sentences.
            </p>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-display text-xl">Levels unlocked</h2>
            <ul className="mt-4 space-y-3">
              {LEVELS.map((l) => {
                const total = SCENARIOS.filter((s) => s.level === l.id).length;
                const done = SCENARIOS.filter((s) => s.level === l.id && s.completed).length;
                const pct = total ? Math.round((done / total) * 100) : 0;
                return (
                  <li key={l.id} className="flex items-center gap-4">
                    <div className="text-2xl">{l.emoji}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold">{l.title}</span>
                        <span className={l.unlocked ? "text-muted-foreground" : "text-muted-foreground/60"}>
                          {l.unlocked ? `${done}/${total}` : "Locked"}
                        </span>
                      </div>
                      <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full gradient-sunset" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-display text-2xl">Badges</h2>
            <Link to="/badges" className="text-sm font-bold text-primary hover:underline">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BADGES.slice(0, 6).map((b) => (
              <div
                key={b.id}
                className={`surface-card p-4 text-center ${b.earned ? "" : "opacity-50 grayscale"}`}
                title={b.description}
              >
                <div className="text-4xl">{b.emoji}</div>
                <p className="mt-2 text-display text-sm">{b.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{b.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-6 py-3 shadow-pop hover:scale-[1.03] transition-transform"
          >
            Keep questing →
          </Link>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon, label, value, tone,
}: { icon: React.ReactNode; label: string; value: string | number; tone: "coral" | "sun" | "mint" | "grape" }) {
  return (
    <div className={`surface-card p-5 bg-gradient-to-br ${STAT_TONES[tone]}`}>
      <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider">{icon} {label}</div>
      <div className="text-display text-3xl mt-2 text-foreground">{value}</div>
    </div>
  );
}

function Meter({ label, value, tone }: { label: string; value: number; tone: "coral" | "sky" }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-semibold">
        <span>{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="mt-1 h-3 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${METER_BG[tone]} transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
