import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, X, ArrowLeft, RotateCcw } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { READING_PASSAGES, type ReadingPassage } from "@/data/reading";

export const Route = createFileRoute("/reading")({
  head: () => ({
    meta: [
      { title: "Reading — Ujuziverse" },
      { name: "description", content: "Improve your reading comprehension with short passages." },
    ],
  }),
  component: ReadingPage,
});

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Easy",
  intermediate: "Medium",
  advanced: "Hard",
};
const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-mint/20 text-mint-foreground border-mint/30",
  intermediate: "bg-sun/25 text-sun-foreground border-sun/40",
  advanced: "bg-coral/15 text-coral border-coral/30",
};

function ReadingPage() {
  const [passage, setPassage] = useState<ReadingPassage | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (passage) {
      setAnswers(new Array(passage.questions.length).fill(-1));
      setSubmitted(false);
    }
  }, [passage]);

  function selectAnswer(qIdx: number, optIdx: number) {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  }

  function submit() {
    setSubmitted(true);
  }

  function resetQuiz() {
    setPassage(null);
    setAnswers([]);
    setSubmitted(false);
  }

  const score = submitted && passage
    ? answers.filter((a, i) => a === passage.questions[i].correct).length
    : 0;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <div className="mt-6 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-ocean text-white p-6 shadow-soft">
          <div className="absolute right-5 top-5 text-4xl animate-bob">📖</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Reading Comprehension</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">Read & Understand</h1>
          <p className="mt-2 text-white/90 max-w-lg">Read short passages and answer questions to check your understanding.</p>
        </section>

        {!passage ? (
          <section className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {READING_PASSAGES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPassage(p)}
                className="surface-card p-5 border border-border/60 text-left hover:-translate-y-1 hover:shadow-pop transition-all"
              >
                <span className="text-3xl">{p.emoji}</span>
                <h3 className="text-display text-lg mt-2">{p.title}</h3>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mt-2 ${LEVEL_COLORS[p.level]}`}>
                  {LEVEL_LABELS[p.level]}
                </span>
                <p className="text-xs text-muted-foreground mt-2">{p.questions.length} questions</p>
              </button>
            ))}
          </section>
        ) : (
          <section className="mt-6 surface-card p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{passage.emoji}</span>
                <div>
                  <h2 className="text-display text-xl">{passage.title}</h2>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${LEVEL_COLORS[passage.level]}`}>
                    {LEVEL_LABELS[passage.level]}
                  </span>
                </div>
              </div>
              <button onClick={resetQuiz} className="h-9 w-9 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-accent" title="Pick another passage" aria-label="Pick another passage">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-muted/40 p-4 text-sm leading-relaxed">
              {passage.text}
            </div>

            <div className="mt-6 space-y-5">
              {passage.questions.map((q, qIdx) => (
                <div key={qIdx}>
                  <p className="font-bold text-sm flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">{qIdx + 1}</span>
                    {q.question}
                  </p>
                  <div className="mt-2 grid sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const selected = answers[qIdx] === oIdx;
                      const isCorrect = submitted && q.correct === oIdx;
                      const isWrong = submitted && selected && !isCorrect;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => selectAnswer(qIdx, oIdx)}
                          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm text-left transition-all ${
                            submitted && isCorrect
                              ? "border-mint/40 bg-mint/15 text-mint-foreground"
                              : submitted && isWrong
                              ? "border-coral/40 bg-coral/10 text-coral"
                              : selected
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background hover:bg-accent"
                          }`}
                        >
                          {submitted && isCorrect && <Check className="h-4 w-4 shrink-0 text-mint-foreground" />}
                          {submitted && isWrong && <X className="h-4 w-4 shrink-0 text-coral" />}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!submitted ? (
              <button
                onClick={submit}
                disabled={answers.some((a) => a === -1)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-6 py-2.5 shadow-pop hover:scale-105 transition-transform disabled:opacity-50"
              >
                <Check className="h-4 w-4" /> Check answers
              </button>
            ) : (
              <div className={`mt-6 rounded-2xl p-4 text-center ${
                score === passage.questions.length
                  ? "bg-mint/20 border border-mint/30"
                  : score >= passage.questions.length / 2
                  ? "bg-sun/25 border border-sun/40"
                  : "bg-coral/15 border border-coral/30"
              }`}>
                <p className="text-display text-2xl">{score} / {passage.questions.length}</p>
                <p className={`text-sm font-bold mt-1 ${
                  score === passage.questions.length
                    ? "text-mint-foreground"
                    : score >= passage.questions.length / 2
                    ? "text-sun-foreground"
                    : "text-coral"
                }`}>
                  {score === passage.questions.length ? "Perfect score!" : score >= passage.questions.length / 2 ? "Good job!" : "Keep reading!"}
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
