import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sparkles, Check, ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LANGUAGES, type LanguageCode } from "@/data/mock";
import { getLanguage, setLanguage } from "@/lib/sessions";
import { getDailyChallenge, type DailyChallenge } from "@/data/challenges";

export const Route = createFileRoute("/daily-challenge")({
  head: () => ({
    meta: [
      { title: "Daily Challenge — Ujuziverse" },
      { name: "description", content: "A new language challenge every day." },
    ],
  }),
  component: DailyChallengePage,
});

const STREAK_KEY = "lq.dailyStreak";

const TYPE_COLORS: Record<string, string> = {
  speaking: "bg-coral/15 text-coral border-coral/30",
  writing: "bg-sky/15 text-sky-foreground border-sky/30",
  vocab: "bg-mint/15 text-mint-foreground border-mint/30",
  grammar: "bg-grape/15 text-grape border-grape/30",
};

function getStreak(): { count: number; lastDate: string } {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"count":0,"lastDate":""}');
  } catch (e) {
    console.warn("Failed to parse streak data", e);
    return { count: 0, lastDate: "" };
  }
}

function saveStreak(count: number, lastDate: string) {
  localStorage.setItem(STREAK_KEY, JSON.stringify({ count, lastDate }));
}

function DailyChallengePage() {
  const [language, setLang] = useState<LanguageCode>(() => getLanguage());
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(getStreak);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setChallenge(getDailyChallenge(new Date(), language));
    setCompleted(localStorage.getItem(`lq.challenge.${today}.${language}`) === "true");
  }, [language]);

  function complete() {
    localStorage.setItem(`lq.challenge.${today}.${language}`, "true");
    setCompleted(true);
    if (streak.lastDate !== today) {
      const isConsecutive = (() => {
        if (!streak.lastDate) return false;
        const last = new Date(streak.lastDate);
        const now = new Date(today);
        const diff = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 1.5;
      })();
      const newCount = isConsecutive ? streak.count + 1 : 1;
      saveStreak(newCount, today);
      setStreak({ count: newCount, lastDate: today });
    }
  }


  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-24">
        <div className="mt-6 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-sunset text-white p-6 shadow-soft">
          <div className="absolute right-5 top-5 text-4xl animate-bob">🎯</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Daily Challenge</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">{today}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
              🔥 {streak.count} day streak
            </span>
          </div>
        </section>

        <section className="mt-6 surface-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setCompleted(false); }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-bold transition-colors ${
                    language === l.code
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface border-border hover:bg-accent"
                  }`}
                >
                  <span>{l.flag}</span>
                  {l.nativeLabel}
                </button>
              ))}
            </div>
          </div>

          {challenge && (
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{challenge.emoji}</span>
                <div>
                  <h2 className="text-display text-2xl">{challenge.title}</h2>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mt-1 ${TYPE_COLORS[challenge.type]}`}>
                    {challenge.type}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-lg leading-relaxed">{challenge.prompt}</p>

              {completed ? (
                <div className="mt-6 rounded-2xl bg-mint/20 border border-mint/30 p-4 text-center">
                  <Check className="h-6 w-6 text-mint-foreground mx-auto" />
                  <p className="text-sm font-bold text-mint-foreground mt-1">Challenge completed today!</p>
                  <p className="text-xs text-muted-foreground mt-1">Come back tomorrow for a new one.</p>
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={complete} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-6 py-2.5 shadow-pop hover:scale-105 transition-transform">
                    <Check className="h-4 w-4" /> Mark as done
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
