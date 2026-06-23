import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Trophy, Medal, Flame, Star, ArrowLeft, Sparkles, Crown } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LANGUAGES, type LanguageCode } from "@/data/mock";
import { getLanguage } from "@/lib/sessions";
import { getLeaderboard, type LeaderboardEntry } from "@/data/leaderboard";
import { loadXPState } from "@/lib/xp-system";
import { playClick, hapticMedium } from "@/lib/sound-effects";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Ujuziverse" },
      { name: "description", content: "See how you rank among other language learners." },
    ],
  }),
  component: LeaderboardPage,
});

const RANK_COLORS: Record<number, string> = {
  1: "bg-sun/30 border-sun/50 text-sun-foreground",
  2: "bg-muted border-border text-muted-foreground",
  3: "bg-coral/15 border-coral/30 text-coral",
};

function LeaderboardPage() {
  const [language, setLanguage] = useState<LanguageCode>(() => getLanguage());
  const [xpState, setXpState] = useState(loadXPState);
  const [userName, setUserName] = useState("");
  const [userStreak, setUserStreak] = useState(0);

  useEffect(() => {
    const state = loadXPState();
    setXpState(state);
    setUserStreak(state.streak);
    try {
      const raw = localStorage.getItem("lq.auth");
      if (raw) {
        const u = JSON.parse(raw);
        setUserName(u.name || "");
      }
    } catch {}
  }, []);

  const entries = useMemo(
    () => getLeaderboard(language, xpState.totalXP, userName || undefined),
    [language, xpState.totalXP, userName]
  );

  const myEntry = entries.find(e => e.isYou);

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
          <div className="absolute right-5 top-5 text-4xl animate-bob">🏆</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Leaderboard</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">Top Learners</h1>
          <p className="mt-2 text-white/90 max-w-lg">Compete with friends and climb the ranks!</p>
        </section>

        {/* Your Rank Card */}
        {myEntry && (
          <div className="mt-4 surface-card p-4 rounded-2xl border-2 border-primary/40 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-grape text-white flex items-center justify-center text-xl shadow-soft">
                <Crown className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">Your Rank</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-sun-foreground" /> {myEntry.xp} XP</span>
                  <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-coral" /> {userStreak} days</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">#{myEntry.rank}</p>
                <p className="text-[10px] text-muted-foreground">of {entries.length}</p>
              </div>
            </div>
          </div>
        )}

        <section className="mt-6 surface-card p-6">
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { playClick(); hapticMedium(); setLanguage(l.code); }}
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

          {/* Top 3 Podium */}
          {entries.length >= 3 && (
            <div className="mt-6 flex items-end justify-center gap-3">
              {[entries[1], entries[0], entries[2]].map((entry, idx) => {
                const isFirst = idx === 1;
                const height = isFirst ? "h-32" : "h-24";
                return (
                  <div key={entry.rank} className={`flex flex-col items-center ${isFirst ? "-mt-4" : ""}`}>
                    <div className={`text-3xl mb-1 ${isFirst ? "animate-bob" : ""}`}>{entry.avatar}</div>
                    <div className={`w-20 ${height} rounded-t-2xl flex flex-col items-center justify-end pb-3 ${
                      entry.rank === 1 ? "bg-sun/20 border border-sun/30" :
                      entry.rank === 2 ? "bg-muted border border-border" :
                      "bg-coral/10 border border-coral/20"
                    }`}>
                      <p className="text-xs font-bold truncate max-w-full px-1">{entry.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{entry.xp} XP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full List */}
          <div className="mt-6 space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.name + entry.rank}
                className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
                  entry.isYou
                    ? "border-primary bg-primary/5 shadow-soft"
                    : entry.rank <= 3
                    ? RANK_COLORS[entry.rank]
                    : "border-border/60 bg-surface hover:bg-accent/50"
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 shrink-0">
                  {entry.rank <= 3 ? (
                    <Medal className={`h-6 w-6 ${entry.rank === 1 ? "text-sun-foreground" : entry.rank === 2 ? "text-muted-foreground" : "text-coral"}`} />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">{entry.rank}</span>
                  )}
                </div>
                <span className="text-2xl shrink-0">{entry.avatar}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm truncate">
                    {entry.name}
                    {entry.isYou && <span className="text-primary ml-1">(You)</span>}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> {entry.xp} XP</span>
                    <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {entry.streak} days</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-muted-foreground shrink-0">
                  #{entry.rank}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}