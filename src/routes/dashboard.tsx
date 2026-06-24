import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { BookOpen, Play, Sparkles, Star, TrendingUp, Award, Bell, ArrowLeft, ChevronRight, Zap, Target, Flame, Mic, Lock } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { USER_STATS, SCENARIOS } from "@/data/mock";
import { getGuestToken } from "@/lib/sessions";
import { loadStatsFn } from "@/lib/stats.functions";
import { loadXPState, claimDailyLogin, getLevelName, getLevelEmoji, getLevelProgress, formatXP, addXP } from "@/lib/xp-system";
import { loadWeeklyGoals, getGoalsProgress, getWeekDaysRemaining, areAllGoalsComplete, trackWeeklyActivity } from "@/lib/weekly-goals";
import { playClick, playXPGain, playLevelUp, playCelebration, hapticMedium, hapticHeavy } from "@/lib/sound-effects";
import { Confetti, XPPopup, LevelUpOverlay } from "@/components/Confetti";
import type { XPState } from "@/lib/xp-system";

const AUTH_KEY = "lq.auth";

interface AuthUser { name: string; email: string; language: string }

function getStoredUser(): AuthUser | null {
  try { const raw = localStorage.getItem(AUTH_KEY); return raw ? JSON.parse(raw) as AuthUser : null; } catch { return null; }
}

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Ujuziverse" },
      { name: "description", content: "Your personal Ujuziverse dashboard. Track progress, continue learning, and explore opportunities." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState(USER_STATS);
  const [xpState, setXpState] = useState<XPState>(() => loadXPState());
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [goals, setGoals] = useState<ReturnType<typeof loadWeeklyGoals>>(() => loadWeeklyGoals());
  const [mounted, setMounted] = useState(false);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const handleLevelUp = useCallback((level: number) => {
    setNewLevel(level);
    setShowLevelUp(true);
    playLevelUp();
    hapticMedium();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredUser();
    setUser(stored);
    if (!stored) { navigate({ to: "/auth" }); return; }
    (async () => {
      try {
        const res = await loadStatsFn({ data: { guestToken: getGuestToken() } });
        setStats((s) => ({ ...s, sessions: res.sessions, stars: res.stars, streak: res.streak, confidence: res.confidence, fluency: res.fluency }));
      } catch (e) { console.warn("Failed to load stats", e); }
    })();

    // Claim daily login bonus
    const result = claimDailyLogin();
    if (result) {
      setXpState(result.state);
      setXpAmount(result.xpGained);
      setShowXP(true);
      playXPGain();
      setTimeout(() => setShowXP(false), 1500);
      if (result.leveledUp) handleLevelUp(result.newLevel);
      setDailyClaimed(true);
    }
  }, []);

  const nextScenario = SCENARIOS.find((s) => !s.completed) ?? SCENARIOS[0];
  const levelProgress = getLevelProgress(xpState);

  const cards = [
    { emoji: "📚", title: "Continue Learning", desc: "Pick up where you left off.", to: `/scenarios/$scenarioId`, params: { scenarioId: nextScenario.id }, gradient: "gradient-ocean" },
    { emoji: "🎬", title: "Start Simulation", desc: "Practice real-life scenarios.", to: "/simulations", params: {}, gradient: "gradient-sunset" },
    { emoji: "🎨", title: "Creator Studio", desc: "Build your content and brand.", to: "/creator-studio", params: {}, gradient: "gradient-berry" },
    { emoji: "🚀", title: "Opportunities", desc: "Scholarships, jobs, funding.", to: "/opportunities", params: {}, gradient: "gradient-meadow" },
    { emoji: "📈", title: "My Growth", desc: "Track your progress and streaks.", to: "/progress", params: {}, gradient: "gradient-ocean" },
    { emoji: "🏆", title: "Achievements", desc: "Badges, levels, leaderboard.", to: "/badges", params: {}, gradient: "gradient-sunset" },
    { emoji: "🔔", title: "Notifications", desc: "Alerts, updates, and reminders.", to: "/community", params: {}, gradient: "gradient-berry" },
  ];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <Confetti show={showConfetti} />
      <XPPopup xp={xpAmount} show={showXP} label={dailyClaimed ? "Daily Bonus!" : undefined} />
      <LevelUpOverlay show={showLevelUp} level={newLevel} onClose={() => setShowLevelUp(false)} />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        {/* Greeting + Level */}
        <section className="mt-6 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-display text-2xl sm:text-3xl">{greeting}, <span className="text-primary">{user?.name ?? stats.name}</span>.</h1>
            <p className="text-muted-foreground text-sm mt-1">What would you like to do today?</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Level Badge */}
            <Link to="/badges" className="relative group">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sun to-sun-foreground flex items-center justify-center text-lg shadow-soft level-badge-glow hover:scale-110 transition-transform">
                {getLevelEmoji(xpState.level)}
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center shadow-pop">
                {xpState.level}
              </div>
            </Link>
            {/* Streak */}
            <Link to="/badges" className="relative">
              <div className="h-12 w-12 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-accent transition-colors">
                <Flame className="h-5 w-5 text-coral" />
              </div>
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-coral text-white text-[10px] font-bold flex items-center justify-center">{xpState.streak || stats.streak}</div>
            </Link>
          </div>
        </section>

        {/* XP Progress Bar */}
        <section className="mt-4 surface-card p-4 rounded-2xl border border-border/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getLevelEmoji(xpState.level)}</span>
              <div>
                <p className="text-sm font-bold">{getLevelName(xpState.level)}</p>
                <p className="text-[10px] text-muted-foreground">Level {xpState.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-sun-foreground flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                {formatXP(xpState.totalXP)} XP
              </p>
              <p className="text-[10px] text-muted-foreground">{xpState.currentLevelXP} / {xpState.nextLevelXP} to next</p>
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
        </section>

        {/* Quick Stats */}
        <section className="mt-3 surface-card p-4 rounded-2xl border border-border/60 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-coral" />
              <span className="font-bold">{xpState.streak || stats.streak} day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-sun-foreground" />
              <span className="font-bold">{formatXP(xpState.totalXP)} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-bold">{stats.confidence}% confidence</span>
            </div>
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-mint-foreground" />
              <span className="font-bold">{stats.fluency}% fluency</span>
            </div>
          </div>
        </section>

        {/* Weekly Goals */}
        <section className="mt-4 surface-card p-4 rounded-2xl border border-border/60">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">🎯 This Week's Goals</h3>
            <div className="flex items-center gap-2">
              <Link to="/share" onClick={() => { playClick(); }} className="text-[10px] text-primary font-bold hover:underline">Share Report</Link>
              <span className="text-[10px] text-muted-foreground">{getWeekDaysRemaining()}d left</span>
            </div>
          </div>
          {(() => {
            const gp = getGoalsProgress(goals);
            const allDone = areAllGoalsComplete(goals);
            return (
              <div className="space-y-2">
                {[
                  { emoji: "🎤", label: "Practice Sessions", ...gp.sessions },
                  { emoji: "✨", label: "XP Earned", ...gp.xp },
                  { emoji: "🧠", label: "Quizzes Done", ...gp.quiz },
                ].map((g, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{g.emoji} {g.label}</span>
                      <span className={`font-bold ${g.pct >= 100 ? "text-mint-foreground" : ""}`}>{g.current}/{g.target}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${g.pct >= 100 ? "bg-mint-foreground" : "bg-primary"}`} style={{ width: `${g.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </section>

        {/* Action Cards */}
        <section className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <Link
              key={i}
              to={c.to}
              {...(Object.keys(c.params).length > 0 ? { params: c.params } : {})}
              onClick={() => { playClick(); hapticMedium(); }}
              className={`relative overflow-hidden rounded-2xl ${c.gradient} text-white p-5 shadow-soft hover:-translate-y-1 hover:shadow-pop transition-all group`}
            >
              <div className="text-3xl mb-2">{c.emoji}</div>
              <h3 className="font-bold">{c.title}</h3>
              <p className="text-xs text-white/80 mt-0.5">{c.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-white/60 group-hover:text-white transition-colors">
                Go <ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}