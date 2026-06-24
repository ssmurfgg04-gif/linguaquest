import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Check, X, RotateCcw, Star, Languages, Brain, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSelector } from "@/components/LanguageSelector";
import { getLanguage } from "@/lib/sessions";
import { LANGUAGES } from "@/data/mock";
import { QUIZZES_BY_LANGUAGE, type Quiz } from "@/data/quizzes";
import { PAGE_HEADINGS } from "@/data/language-headings";
import { addXP, loadXPState, type XPState } from "@/lib/xp-system";
import { trackWeeklyActivity } from "@/lib/weekly-goals";
import { adaptiveSort } from "@/lib/adaptive-difficulty";
import { playClick, playCorrect, playWrong, playCelebration, hapticMedium, hapticHeavy, hapticError } from "@/lib/sound-effects";
import { Confetti, XPPopup, LevelUpOverlay } from "@/components/Confetti";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quizzes — Ujuziverse" },
      { name: "description", content: "Test your language knowledge with fun multiple-choice quizzes." },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "sw">(() => { try { return getLanguage(); } catch { return "en" as const; } });
  const lang = LANGUAGES.find((l) => l.code === language);
  const quizzes = QUIZZES_BY_LANGUAGE[language] ?? [];
  const [xpState, setXpState] = useState<XPState>(() => loadXPState());
  const sortedQuizzes = adaptiveSort(quizzes);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 pb-24">
        <div className="mt-6 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-meadow text-white p-6 shadow-soft">
          <div className="absolute right-5 top-5 text-4xl animate-bob">🧠</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Quizzes</p>
          <h1 className="text-display text-2xl sm:text-3xl mt-1">
            {PAGE_HEADINGS.quizTitle[language]}
          </h1>
          <p className="mt-1 text-white/85 text-sm max-w-lg">
            {PAGE_HEADINGS.quizDesc[language]}
          </p>
        </section>

        <div className="mt-5">
          <LanguageSelector current={language} onChange={setLanguage} />
        </div>

        {quizzes.length === 0 ? (
          <div className="mt-8 text-center py-16 surface-card rounded-2xl border border-dashed">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground font-semibold">No quizzes for {lang?.label} yet.</p>
            <p className="text-xs text-muted-foreground mt-1">New quizzes are on the way — check back soon!</p>
          </div>
        ) : (
          <>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-sun-foreground" />
            <span>Sorted by difficulty — adapts to your level ({xpState.level})</span>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {sortedQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
          </>
        )}
      </main>
    </div>
  );
}

function QuizCard({ quiz }: { quiz: Quiz }) {
  const [started, setStarted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [xpState, setXpState] = useState(loadXPState);

  const question = quiz.questions[qIdx];
  const total = quiz.questions.length;

  const submitAnswer = () => {
    if (selected === null) return;
    const correct = selected === question.correctIndex;
    const newResults = [...results, correct];
    setResults(newResults);
    if (correct) {
      setScore((s) => s + 1);
      playCorrect();
      hapticMedium();
    } else {
      playWrong();
      hapticError();
    }
    if (qIdx + 1 >= total) {
      const finalScore = correct ? score + 1 : score;
      const pct = Math.round((finalScore / total) * 100);

      // Award XP based on score
      setTimeout(() => {
        let result;
        if (pct === 100) {
          result = addXP("quiz.perfect");
        } else if (pct >= 70) {
          result = addXP("quiz.good");
        } else {
          result = addXP("quiz.complete");
        }
        setXpState(result.state);
        setXpAmount(result.xpGained);
        setShowXP(true);
        setTimeout(() => setShowXP(false), 1500);

        // Track quiz completion toward weekly goals
        trackWeeklyActivity("quiz");
        trackWeeklyActivity("xp", result.xpGained);

        if (pct >= 80) {
          playCelebration();
          setShowConfetti(true);
          hapticHeavy();
          setTimeout(() => setShowConfetti(false), 3000);
        }
        if (result.leveledUp) {
          setNewLevel(result.newLevel);
          setShowLevelUp(true);
        }
      }, 300);

      setFinished(true);
    } else {
      setQIdx((i) => i + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setResults([]);
  };

  if (!started) {
    return (
      <div className="surface-card p-5 border border-border/60 flex flex-col items-center text-center">
        <span className="text-3xl">{quiz.emoji}</span>
        <h3 className="font-bold text-base mt-2">{quiz.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{quiz.questions.length} questions</p>
        <button onClick={() => { setStarted(true); playClick(); hapticMedium(); }} className="mt-3 rounded-full bg-primary text-primary-foreground font-bold px-5 py-2 text-sm shadow-soft hover:scale-105 transition-transform">
          Start Quiz
        </button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const stars = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;
    return (
      <div className="col-span-full">
        <Confetti show={showConfetti} />
        <XPPopup xp={xpAmount} show={showXP} label="Quiz Complete!" />
        <LevelUpOverlay show={showLevelUp} level={newLevel} onClose={() => setShowLevelUp(false)} />

        <div className="surface-card p-6 border border-border/60 text-center">
          <span className="text-5xl">{quiz.emoji}</span>
          <h2 className="text-display text-xl mt-2">Quiz Complete!</h2>
          <div className="flex justify-center gap-1 mt-2">
            {[1, 2, 3].map((s) => (
              <Star key={s} className={`h-6 w-6 ${s <= stars ? "text-sun fill-sun" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          <p className="text-3xl font-bold mt-2">{score}/{total}</p>
          <p className="text-sm text-muted-foreground">{pct}% correct</p>

          {/* XP Earned */}
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-sun/20 text-sun-foreground px-3 py-1 text-sm font-bold">
            <Sparkles className="h-3.5 w-3.5" /> +{xpAmount} XP earned
          </div>

          <div className="mt-4 space-y-1 max-h-48 overflow-y-auto">
            {results.map((r, i) => {
              const q = quiz.questions[i];
              return (
                <div key={i} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl ${r ? "bg-mint/20 text-mint-foreground" : "bg-coral/15 text-coral"}`}>
                  {r ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
                  <span className="min-w-0">
                    {r ? "Correct" : `"${q.options[q.correctIndex]}" was the answer`}
                  </span>
                </div>
              );
            })}
          </div>
          <button onClick={() => { restart(); playClick(); }} className="mt-4 rounded-full bg-primary text-primary-foreground font-bold px-5 py-2 text-sm inline-flex items-center gap-2 shadow-soft hover:scale-105 transition-transform">
            <RotateCcw className="h-4 w-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full">
      {/* XP level indicator during quiz */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <div className="flex items-center gap-1">
          <span>{xpState.totalXP > 0 ? `Lvl ${xpState.level}` : ""}</span>
          <span className="font-bold text-sun-foreground">{xpState.totalXP} XP</span>
        </div>
        <span className="font-bold">Question {qIdx + 1} of {total}</span>
        <span>Score: {score}</span>
      </div>
      <div className="mb-3 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((qIdx + 1) / total) * 100}%` }} />
      </div>

      <div className="surface-card p-6 border border-border/60">
        <h2 className="text-display text-lg">{question.question}</h2>
        <div className="mt-4 space-y-2">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => { setSelected(i); playClick(); }}
              className={`w-full text-left rounded-2xl border px-4 py-3 text-sm transition-all ${
                selected === i ? "border-primary bg-primary/10 font-bold scale-[1.02]" : "border-border bg-surface hover:bg-accent"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          onClick={() => { submitAnswer(); }}
          disabled={selected === null}
          className="mt-4 rounded-full bg-primary text-primary-foreground font-bold px-6 py-2.5 text-sm shadow-soft hover:scale-105 transition-transform disabled:opacity-50"
        >
          {qIdx + 1 >= total ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}