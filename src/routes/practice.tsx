import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, X, Eye, EyeOff, Brain } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSelector } from "@/components/LanguageSelector";
import { getLanguage } from "@/lib/sessions";
import { LANGUAGES } from "@/data/mock";
import { GAP_PRACTICES_BY_LANGUAGE, type GapPractice } from "@/data/practice";
import { PAGE_HEADINGS } from "@/data/language-headings";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Fill-the-Gap Practice — Ujuziverse" },
      { name: "description", content: "Practice grammar by filling in missing words." },
    ],
  }),
  component: PracticePage,
});

function PracticePage() {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "sw">(getLanguage);
  const lang = LANGUAGES.find((l) => l.code === language);
  const practices = GAP_PRACTICES_BY_LANGUAGE[language] ?? [];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 pb-24">
        <div className="mt-6 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-berry text-white p-6 shadow-soft">
          <div className="absolute right-5 top-5 text-4xl animate-bob">✏️</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Fill-the-Gap</p>
          <h1 className="text-display text-2xl sm:text-3xl mt-1">
            {PAGE_HEADINGS.practiceTitle[language]}
          </h1>
          <p className="mt-1 text-white/85 text-sm max-w-lg">
            {PAGE_HEADINGS.practiceDesc[language]}
          </p>
        </section>

        <div className="mt-5">
          <LanguageSelector current={language} onChange={setLanguage} />
        </div>

        {practices.length === 0 ? (
          <div className="mt-8 text-center py-16 surface-card rounded-2xl border border-dashed">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground font-semibold">No practice exercises for {lang?.label} yet.</p>
            <p className="text-xs text-muted-foreground mt-1">More exercises are coming soon!</p>
          </div>
        ) : (
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {practices.map((p) => (
              <PracticeCard key={p.id} practice={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function PracticeCard({ practice }: { practice: GapPractice }) {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="surface-card p-5 border border-border/60 flex flex-col items-center text-center">
        <span className="text-3xl">{practice.emoji}</span>
        <h3 className="font-bold text-base mt-2">{practice.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{practice.exercises.length} exercises</p>
        <button onClick={() => setStarted(true)} className="mt-3 rounded-full bg-primary text-primary-foreground font-bold px-5 py-2 text-sm shadow-soft hover:scale-105 transition-transform">
          Start
        </button>
      </div>
    );
  }

  return <PracticeBoard practice={practice} onBack={() => setStarted(false)} />;
}

function PracticeBoard({ practice, onBack }: { practice: GapPractice; onBack: () => void }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<("correct" | "wrong" | "skipped")[]>([]);
  const [done, setDone] = useState(false);
  const [lastWrong, setLastWrong] = useState<string | null>(null);

  const ex = practice.exercises[idx];
  const total = practice.exercises.length;

  const check = () => {
    const answer = input.trim().toLowerCase();
    const correct = ex.answer.toLowerCase();
    if (answer !== correct) {
      setLastWrong(ex.answer);
      setInput("");
      return;
    }
    setLastWrong(null);
    setResults((r) => [...r, "correct"]);
    setInput("");
    setRevealed(false);
    if (idx + 1 >= total) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
    }
  };

  const skip = () => {
    setResults((r) => [...r, "skipped"]);
    setLastWrong(null);
    setRevealed(false);
    setInput("");
    if (idx + 1 >= total) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
    }
  };


  const restart = () => {
    setIdx(0);
    setInput("");
    setRevealed(false);
    setResults([]);
    setDone(false);
  };

  if (done) {
    const correct = results.filter((r) => r === "correct").length;
    return (
      <div className="surface-card p-6 border border-border/60 text-center mt-4">
        <span className="text-5xl">🎯</span>
        <h2 className="text-display text-xl mt-2">Practice Complete!</h2>
        <p className="text-3xl font-bold mt-2">{correct}/{total}</p>
        <p className="text-sm text-muted-foreground">correct</p>
        <div className="mt-4 space-y-1 max-h-48 overflow-y-auto">
          {results.map((r, i) => {
            const ex = practice.exercises[i];
            return (
              <div key={i} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl ${
                r === "correct" ? "bg-mint/20 text-mint-foreground" :
                r === "wrong" ? "bg-coral/15 text-coral" : "bg-muted text-muted-foreground"
              }`}>
                {r === "correct" ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
                <span>{r === "correct" ? "Correct" : r === "skipped" ? "Skipped" : `Answer: "${ex.answer}"`}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-3 mt-4">
          <button onClick={restart} className="rounded-full bg-primary text-primary-foreground font-bold px-5 py-2 text-sm shadow-soft hover:scale-105 transition-transform">Try Again</button>
          <button onClick={onBack} className="rounded-full bg-surface border border-border font-bold px-5 py-2 text-sm hover:bg-accent">Back</button>
        </div>
      </div>
    );
  }

  const sentenceParts = ex.sentence.split("___");
  return (
    <div className="surface-card p-6 border border-border/60 mt-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Exercise {idx + 1} of {total}</span>
        <span>Correct: {results.filter((r) => r === "correct").length}</span>
      </div>
      <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${(idx / total) * 100}%` }} />
      </div>

      <p className="mt-4 text-lg leading-relaxed">
        {sentenceParts[0]}
        <span className="inline-block border-b-2 border-dashed border-primary min-w-[80px] px-1 text-primary font-bold">
          {input || "______"}
        </span>
        {sentenceParts[1] || ""}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") check(); }}
          placeholder="Type the missing word…"
          className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button onClick={check} disabled={!input.trim()} className="rounded-full bg-primary text-primary-foreground font-bold px-5 py-2.5 text-sm shadow-soft hover:scale-105 transition-transform disabled:opacity-50">
          Check
        </button>
      </div>

      {lastWrong && (
        <p className="mt-2 text-xs text-coral bg-coral/10 border border-coral/30 rounded-xl px-4 py-2">
          Not quite. The correct word is <strong>"{lastWrong}"</strong>. Try again on the next one!
        </p>
      )}

      <div className="mt-3 flex items-center gap-3 text-xs">
        <button onClick={() => setRevealed(!revealed)} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
          {revealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {revealed ? "Hide hint" : "Show hint"}
        </button>
        <button onClick={skip} className="text-muted-foreground hover:text-foreground">Skip</button>
        {revealed && <span className="text-primary font-bold">Hint: {ex.hint}</span>}
      </div>
    </div>
  );
}
