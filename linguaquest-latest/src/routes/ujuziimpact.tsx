import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, BarChart3, Users, Award, BookOpen, Download, Mail, TrendingUp, Shield, Clock, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { toast } from "sonner";
import { loadXPState, type XPEvent } from "@/lib/xp-system";

export const Route = createFileRoute("/ujuziimpact")({
  head: () => ({
    meta: [
      { title: "UjuziImpact — Institution Portal | Ujuziverse" },
      { name: "description", content: "Track learner progress, generate impact reports, and manage your institution on Ujuziverse." },
    ],
  }),
  component: UjuziImpact,
});

interface ImpactData {
  totalSessions: number;
  totalXP: number;
  level: number;
  streak: number;
  streakRecord: number;
  quizzesTaken: number;
  quizzesCorrect: number;
  matchGamesPlayed: number;
  speakingSessions: number;
  journalEntries: number;
  moodsTracked: number;
  vocabLearned: number;
  dailyActivity: { date: string; xp: number; events: number }[];
  recentEvents: XPEvent[];
}

function loadImpactData(): ImpactData {
  // Gather all data from localStorage
  const xpState = loadXPState();
  const history = xpState.history;

  // Count activity by type
  let quizzesTaken = 0;
  let quizzesCorrect = 0;
  let matchGamesPlayed = 0;
  let speakingSessions = 0;
  let journalEntries = 0;
  let moodsTracked = 0;
  let vocabLearned = 0;

  history.forEach((e) => {
    if (e.type.startsWith("quiz.")) quizzesTaken++;
    if (e.type === "quiz.perfect" || e.type === "quiz.good") quizzesCorrect++;
    if (e.type.startsWith("match.")) matchGamesPlayed++;
    if (e.type.startsWith("speak.")) speakingSessions++;
    if (e.type === "journal.write") journalEntries++;
    if (e.type === "mood.track") moodsTracked++;
    if (e.type === "vocabulary.learn") vocabLearned++;
  });

  // Load streak record
  let streakRecord = xpState.streak;
  try {
    const saved = localStorage.getItem("lq.streak-record");
    if (saved) streakRecord = Math.max(streakRecord, parseInt(saved, 10));
    if (xpState.streak > streakRecord) {
      streakRecord = xpState.streak;
      localStorage.setItem("lq.streak-record", String(streakRecord));
    }
  } catch {}

  // Group activity by date (last 14 days)
  const dailyActivity: { date: string; xp: number; events: number }[] = [];
  const dateMap = new Map<string, { xp: number; events: number }>();
  history.forEach((e) => {
    const date = new Date(e.timestamp).toISOString().split("T")[0];
    const existing = dateMap.get(date) ?? { xp: 0, events: 0 };
    existing.xp += e.xp;
    existing.events += 1;
    dateMap.set(date, existing);
  });
  // Fill in last 14 days
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
    const data = dateMap.get(d);
    dailyActivity.push({ date: d, xp: data?.xp ?? 0, events: data?.events ?? 0 });
  }

  // Calculate total sessions from various sources
  let totalSessions = quizzesTaken + matchGamesPlayed + speakingSessions;
  try {
    const speakHistory = JSON.parse(localStorage.getItem("lq.speak-history") ?? "[]");
    totalSessions = Math.max(totalSessions, speakHistory.length + quizzesTaken + matchGamesPlayed);
  } catch {}

  return {
    totalSessions,
    totalXP: xpState.totalXP,
    level: xpState.level,
    streak: xpState.streak,
    streakRecord,
    quizzesTaken,
    quizzesCorrect,
    matchGamesPlayed,
    speakingSessions,
    journalEntries,
    moodsTracked,
    vocabLearned,
    dailyActivity,
    recentEvents: history.slice(-10).reverse(),
  };
}

function UjuziImpact() {
  const [data, setData] = useState<ImpactData | null>(null);

  useEffect(() => {
    setData(loadImpactData());
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
          <div className="mt-16 text-center py-16">
            <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-3 text-sm text-muted-foreground">Loading your impact data...</p>
          </div>
        </main>
      </div>
    );
  }

  const avgQuizScore = data.quizzesTaken > 0 ? Math.round((data.quizzesCorrect / data.quizzesTaken) * 100) : 0;
  const maxDailyXP = Math.max(...data.dailyActivity.map(d => d.xp), 1);
  const totalActiveDays = data.dailyActivity.filter(d => d.xp > 0).length;

  const metrics = [
    { label: "Total XP", value: data.totalXP.toLocaleString(), color: "text-sun-foreground", change: `Level ${data.level}`, icon: Sparkles },
    { label: "Sessions", value: String(data.totalSessions), color: "text-primary", change: `${totalActiveDays} active days`, icon: BarChart3 },
    { label: "Avg Quiz Score", value: `${avgQuizScore}%`, color: "text-mint-foreground", change: `${data.quizzesTaken} quizzes`, icon: Award },
    { label: "Best Streak", value: `${data.streakRecord} days`, color: "text-coral", change: `Current: ${data.streak}`, icon: TrendingUp },
  ];

  const activities = [
    { emoji: "🎤", label: "Speaking", value: data.speakingSessions, color: "bg-primary" },
    { emoji: "🧠", label: "Quizzes", value: data.quizzesTaken, color: "bg-meadow" },
    { emoji: "🎯", label: "Match Games", value: data.matchGamesPlayed, color: "bg-sunset" },
    { emoji: "📓", label: "Journal", value: data.journalEntries, color: "bg-berry" },
    { emoji: "😊", label: "Mood Checks", value: data.moodsTracked, color: "bg-ocean" },
    { emoji: "📖", label: "Vocab", value: data.vocabLearned, color: "bg-hero" },
  ];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-ocean text-white p-6 sm:p-10 shadow-soft">
          <div className="absolute right-5 top-5 text-5xl animate-bob">🏫</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">UjuziImpact</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">Your Impact</h1>
          <p className="mt-2 text-white/85 max-w-lg">Real-time data from your learning journey. Every XP point tells a story.</p>
        </section>

        {/* Key Metrics — now data-driven */}
        <section className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((m, i) => (
            <div key={i} className="surface-card p-4 rounded-xl border border-border/60">
              <div className="flex items-center justify-between mb-1">
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </div>
              <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">{m.change}</p>
            </div>
          ))}
        </section>

        {/* Activity Breakdown */}
        <section className="mt-8">
          <h2 className="text-display text-lg flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Activity Breakdown</h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {activities.map((a, i) => (
              <div key={i} className="surface-card p-4 rounded-xl border border-border/60 text-center">
                <span className="text-2xl">{a.emoji}</span>
                <p className="text-xl font-bold mt-1">{a.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{a.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 14-Day Activity Chart */}
        <section className="mt-8">
          <h2 className="text-display text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> 14-Day Activity</h2>
          <div className="mt-4 surface-card p-5 rounded-xl border border-border/60">
            <div className="flex items-end gap-1.5 h-32">
              {data.dailyActivity.map((d, i) => {
                const height = maxDailyXP > 0 ? Math.max(4, (d.xp / maxDailyXP) * 100) : 4;
                const hasActivity = d.xp > 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-md transition-all ${hasActivity ? "bg-primary" : "bg-muted"}`}
                      style={{ height: `${height}%` }}
                      title={`${d.date}: ${d.xp} XP, ${d.events} events`}
                    />
                    {i % 2 === 0 && (
                      <span className="text-[9px] text-muted-foreground">{d.date.slice(5)}</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>14 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </section>

        {/* Recent XP Events */}
        {data.recentEvents.length > 0 && (
          <section className="mt-8">
            <h2 className="text-display text-lg flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Recent Activity</h2>
            <div className="mt-4 space-y-2">
              {data.recentEvents.map((e) => (
                <div key={e.id} className="surface-card p-3 rounded-xl border border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-sun-foreground" />
                    <span className="text-sm font-semibold">{e.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-sun-foreground">+{e.xp} XP</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(e.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Programs (kept as sample) */}
        <section className="mt-8">
          <h2 className="text-display text-lg flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Suggested Focus Areas</h2>
          <div className="mt-4 space-y-3">
            {[
              { emoji: "🎤", title: "Speaking Practice", desc: `${data.speakingSessions} sessions completed`, completion: Math.min(100, data.speakingSessions * 10), learners: 1 },
              { emoji: "🧠", title: "Quiz Mastery", desc: `${avgQuizScore}% average accuracy`, completion: avgQuizScore, learners: 1 },
              { emoji: "🎯", title: "Vocabulary Building", desc: `${data.vocabLearned} words learned`, completion: Math.min(100, data.vocabLearned * 5), learners: 1 },
              { emoji: "🔥", title: "Consistency", desc: `${totalActiveDays} active out of 14 days`, completion: Math.round((totalActiveDays / 14) * 100), learners: 1 },
            ].map((p, i) => (
              <div key={i} className="surface-card p-4 rounded-xl border border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <p className="font-bold text-sm">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-mint-foreground">{p.completion}%</p>
                    <p className="text-[10px] text-muted-foreground">progress</p>
                  </div>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-mint-foreground transition-all" style={{ width: `${p.completion}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => toast("Report downloading…", { description: "Your impact report is being generated and will be ready shortly. 📊" })}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-5 py-2.5 shadow-pop hover:scale-105 transition-transform text-sm"
          >
            <Download className="h-4 w-4" /> Download Report
          </button>
          <button
            onClick={() => toast("Invite users", { description: "Share your institution code with learners to join your program. ✉️" })}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface font-bold px-5 py-2.5 hover:bg-accent transition-colors text-sm"
          >
            <Mail className="h-4 w-4" /> Invite Users
          </button>
          <Link to="/partner" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface font-bold px-5 py-2.5 hover:bg-accent transition-colors text-sm">
            <Shield className="h-4 w-4" /> Request Demo
          </Link>
        </section>
      </main>
    </div>
  );
}