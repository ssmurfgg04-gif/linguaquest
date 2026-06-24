import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Share2, Copy, Check, Download, Printer, Sparkles, Flame, Target, BookOpen, Shield } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { loadXPState, getLevelName, getLevelEmoji, getLevelProgress, formatXP } from "@/lib/xp-system";
import { loadWeeklyGoals, getGoalsProgress, getWeekDaysRemaining } from "@/lib/weekly-goals";
import { toast } from "sonner";
import { playClick, hapticMedium } from "@/lib/sound-effects";

export const Route = createFileRoute("/share")({
  head: () => ({
    meta: [
      { title: "Progress Report — Ujuziverse" },
      { name: "description", content: "View and share a learner's progress report." },
    ],
  }),
  component: SharePage,
});

function SharePage() {
  const [copied, setCopied] = useState(false);
  const [xpState, setXpState] = useState(loadXPState);
  const [goals, setGoals] = useState(loadWeeklyGoals);
  const [authUser, setAuthUser] = useState<{ name?: string } | null>(null);
  const [generatedAt] = useState(new Date());

  useEffect(() => {
    try { const raw = localStorage.getItem("lq.auth"); if (raw) setAuthUser(JSON.parse(raw)); } catch {}
  }, []);

  const levelProgress = getLevelProgress(xpState);
  const goalsProgress = getGoalsProgress(goals);
  const daysLeft = getWeekDaysRemaining();

  // Calculate activity from XP history
  const speakingSessions = xpState.history.filter(e => e.type.startsWith("speak.")).length;
  const quizSessions = xpState.history.filter(e => e.type.startsWith("quiz.")).length;
  const matchSessions = xpState.history.filter(e => e.type.startsWith("match.")).length;
  const totalSessions = speakingSessions + quizSessions + matchSessions;

  const handleCopy = () => {
    const report = generateTextReport();
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      playClick();
      hapticMedium();
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${authUser?.name || "Learner"}'s Ujuziverse Report`,
          text: generateTextReport(),
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  const generateTextReport = () => {
    const name = authUser?.name || "Learner";
    return `📋 Ujuziverse Progress Report
━━━━━━━━━━━━━━━━━━━━
👤 ${name}
📊 Level ${xpState.level} — ${getLevelName(xpState.level)}
⭐ ${formatXP(xpState.totalXP)} Total XP
🔥 ${xpState.streak} Day Streak
━━━━━━━━━━━━━━━━━━━━
🎯 Speaking Sessions: ${speakingSessions}
🧠 Quizzes Completed: ${quizSessions}
🎯 Match Games: ${matchSessions}
📚 Total Activities: ${totalSessions}
━━━━━━━━━━━━━━━━━━━━
📅 This Week's Goals:
  Sessions: ${goalsProgress.sessions.current}/${goalsProgress.sessions.target}
  XP: ${goalsProgress.xp.current}/${goalsProgress.xp.target}
  Quizzes: ${goalsProgress.quiz.current}/${goalsProgress.quiz.target}
━━━━━━━━━━━━━━━━━━━━
Generated: ${generatedAt.toLocaleDateString()}
Powered by Ujuziverse 🚀`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-24 print:pb-0">
        <div className="mt-6 flex items-center gap-3">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <div className="ml-auto flex items-center gap-2 print:hidden">
            <button onClick={handleCopy} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface font-bold px-3 py-1.5 text-xs hover:bg-accent transition-colors">
              {copied ? <Check className="h-3 w-3 text-mint-foreground" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button onClick={handleShare} className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground font-bold px-3 py-1.5 text-xs shadow-soft hover:scale-105 transition-transform">
              <Share2 className="h-3 w-3" /> Share
            </button>
            <button onClick={handlePrint} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface font-bold px-3 py-1.5 text-xs hover:bg-accent transition-colors">
              <Printer className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Report Header */}
        <div className="mt-4 surface-card p-6 border border-border/60 print:border-2 print:shadow-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              <div>
                <h1 className="text-display text-xl">Ujuziverse Progress Report</h1>
                <p className="text-xs text-muted-foreground">Generated: {generatedAt.toLocaleDateString()} at {generatedAt.toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" /> Private Report
            </div>
          </div>

          {/* Learner Info */}
          <div className="mt-6 flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-grape text-white flex items-center justify-center text-2xl font-bold shadow-soft">
              {(authUser?.name || "L")[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-lg">{authUser?.name || "Learner"}</h2>
              <p className="text-sm text-muted-foreground">{getLevelEmoji(xpState.level)} Level {xpState.level} — {getLevelName(xpState.level)}</p>
            </div>
          </div>

          {/* Key Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total XP", value: formatXP(xpState.totalXP), icon: Sparkles, color: "text-sun-foreground" },
              { label: "Level", value: String(xpState.level), icon: Target, color: "text-primary" },
              { label: "Streak", value: `${xpState.streak} days`, icon: Flame, color: "text-coral" },
              { label: "Activities", value: String(totalSessions), icon: BookOpen, color: "text-mint-foreground" },
            ].map((s, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-surface border border-border/60">
                <s.icon className={`h-5 w-5 mx-auto ${s.color}`} />
                <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-bold">Level Progress</span>
              <span className="text-sun-foreground font-bold">{levelProgress}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-sun to-primary" style={{ width: `${levelProgress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{xpState.currentLevelXP} / {xpState.nextLevelXP} XP to next level</p>
          </div>

          {/* Activity Breakdown */}
          <div className="mt-6">
            <h3 className="font-bold text-sm mb-3">Activity Breakdown</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: "🎤", label: "Speaking", value: speakingSessions },
                { emoji: "🧠", label: "Quizzes", value: quizSessions },
                { emoji: "🎯", label: "Games", value: matchSessions },
              ].map((a, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-surface border border-border/60">
                  <span className="text-xl">{a.emoji}</span>
                  <p className="font-bold mt-1">{a.value}</p>
                  <p className="text-[10px] text-muted-foreground">{a.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Goals */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">This Week's Goals</h3>
              <span className="text-[10px] text-muted-foreground">{daysLeft} days left</span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Practice Sessions", ...goalsProgress.sessions },
                { label: "XP Earned", ...goalsProgress.xp },
                { label: "Quizzes Done", ...goalsProgress.quiz },
              ].map((g, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{g.label}</span>
                    <span className="font-bold">{g.current}/{g.target}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${g.pct >= 100 ? "bg-mint-foreground" : "bg-primary"}`} style={{ width: `${g.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-border/40 text-center text-xs text-muted-foreground print:mt-4">
            <p>Powered by Ujuziverse — Learn. Practice. Create. Thrive.</p>
          </div>
        </div>
      </main>
    </div>
  );
}