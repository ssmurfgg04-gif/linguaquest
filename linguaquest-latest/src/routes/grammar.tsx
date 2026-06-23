import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Wand2,
  Copy,
  Check,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LANGUAGES, type LanguageCode } from "@/data/mock";
import { z } from "zod";
import { correctGrammarFn } from "@/lib/grammar.functions";
import { getLanguage, setLanguage, getGuestToken } from "@/lib/sessions";
import { parseClientError, ERROR_CODES } from "@/lib/app-error";

const ResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  correctedText: z.string(),
  summary: z.string(),
  issues: z.array(z.object({
    original: z.string(),
    suggestion: z.string(),
    type: z.enum(["grammar", "spelling", "punctuation", "word-choice", "style", "agreement", "tense"]),
    explanation: z.string(),
  })),
  vocabBoosts: z.array(z.object({ word: z.string(), meaning: z.string() })),
  sentences: z.array(z.object({
    original: z.string(),
    corrected: z.string(),
    changed: z.boolean(),
    why: z.string(),
  })),
  encouragement: z.string(),
});

export const Route = createFileRoute("/grammar")({
  head: () => ({
    meta: [
      { title: "Grammar Coach — Ujuziverse" },
      {
        name: "description",
        content:
          "Paste any English, German, French, or Swahili writing and get instant, friendly grammar corrections, explanations, and vocabulary boosts.",
      },
    ],
  }),
  component: GrammarPage,
});

type Issue = z.infer<typeof ResultSchema>["issues"][number];
type Sentence = z.infer<typeof ResultSchema>["sentences"][number];
type Result = z.infer<typeof ResultSchema>;

const SAMPLES: Record<LanguageCode, string> = {
  en: "Yesterday i go to the park with my friend and we was playing football, it were really fun but my mom dont let me stay long.",
  de: "Gestern ich gehe in der Park mit meine Freund und wir hat Fußball gespielt, es war sehr lustig aber meine Mutter nicht erlauben lange bleiben.",
  fr: "Hier je vais au parc avec mon ami et nous a joué au foot, c'était très amusant mais ma mère me laisse pas rester longtemps.",
  sw: "Jana mimi nakwenda kwa duka na rafiki yangu, sisi kununua chakula lakini mama yangu hakuwa furaha kwa sababu nimerudi nyumbani kuchelewa.",
};

const TYPE_TONE: Record<Issue["type"], string> = {
  grammar: "bg-coral/15 text-coral border-coral/30",
  spelling: "bg-sun/25 text-sun-foreground border-sun/40",
  punctuation: "bg-sky/15 text-sky-foreground border-sky/30",
  "word-choice": "bg-grape/15 text-grape border-grape/30",
  style: "bg-mint/15 text-mint-foreground border-mint/30",
  agreement: "bg-coral/15 text-coral border-coral/30",
  tense: "bg-grape/15 text-grape border-grape/30",
};

function GrammarPage() {
  const [language, setLang] = useState<LanguageCode>(() => getLanguage());
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  function pickLanguage(code: LanguageCode) {
    setLang(code);
    setLanguage(code);
  }

  async function analyze() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await correctGrammarFn({
        data: { text: text.trim(), language, guestToken: getGuestToken() },
      });
      const validated = ResultSchema.parse(res);
      setResult(validated as Result);
    } catch (err) {
      console.error(err);
      const parsed = parseClientError(err);
      if (parsed.code === ERROR_CODES.MISSING_API_KEY) {
        setError("AI service not set up yet — add your Google API key in Netlify env vars.");
      } else if (parsed.code === ERROR_CODES.RATE_LIMITED) {
        setError(parsed.message);
      } else {
        setError("Couldn't analyze right now. Please try again in a moment.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function copyCorrected() {
    if (!result) return;
    await navigator.clipboard.writeText(result.correctedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <section className="mt-8 relative overflow-hidden rounded-3xl gradient-berry text-white p-8 shadow-soft">
          <div className="absolute right-6 top-6 text-5xl animate-bob">✍️</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">
            Grammar Coach
          </p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">
            Polish your writing in seconds
          </h1>
          <p className="mt-2 text-white/90 max-w-xl">
            Paste a sentence, a paragraph, or a whole message. I'll fix
            grammar, explain why, and suggest stronger words — kindly.
          </p>
        </section>

        <section className="mt-6 surface-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => pickLanguage(l.code)}
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
            <button
              onClick={() => setText(SAMPLES[language])}
              className="text-xs font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5" /> Try an example
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Write or paste your ${LANGUAGES.find((l) => l.code === language)?.nativeLabel} text here…`}
            rows={6}
            maxLength={2000}
            aria-label={`Text to check in ${LANGUAGES.find((l) => l.code === language)?.nativeLabel}`}
            className="mt-4 w-full resize-y rounded-2xl border border-border bg-background p-4 text-[15px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{text.length} / 2000</span>
            <button
              onClick={analyze}
              disabled={!text.trim() || loading}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-5 py-2.5 shadow-pop hover:scale-[1.03] transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Checking…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" /> Fix my writing
                </>
              )}
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 text-destructive p-3 text-sm">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        {result && (
          <>
            <section className="mt-6 grid sm:grid-cols-[1fr_auto] gap-4 items-stretch">
              <div className="surface-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-display text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> Corrected
                    version
                  </h2>
                  <button
                    onClick={copyCorrected}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed">
                  {result.correctedText}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {result.summary}
                </p>
              </div>
              <div className="surface-card p-6 sm:w-48 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Writing score
                </p>
                <span className="text-display text-5xl mt-1">
                  {result.overallScore}
                </span>
                <span className="text-muted-foreground text-sm">/ 100</span>
                <div className="mt-3 w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-sunset"
                    style={{ width: `${result.overallScore}%` }}
                  />
                </div>
              </div>
            </section>

            {result.issues.length > 0 && (
              <section className="mt-6 surface-card p-6">
                <h2 className="text-display text-xl">What I changed and why</h2>
                <ul className="mt-4 space-y-3">
                  {result.issues.map((iss, i) => (
                    <li
                      key={i}
                      className="rounded-2xl bg-muted/60 p-4 text-sm"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TYPE_TONE[iss.type]}`}
                        >
                          {iss.type}
                        </span>
                        <p>
                          <span className="line-through text-muted-foreground">
                            {iss.original}
                          </span>{" "}
                          <span className="font-bold text-mint-foreground">
                            → {iss.suggestion}
                          </span>
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {iss.explanation}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {result.vocabBoosts.length > 0 && (
              <section className="mt-6 surface-card p-6">
                <h2 className="text-display text-xl flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-sky-foreground" />
                  Level-up vocabulary
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.vocabBoosts.map((v) => (
                    <span
                      key={v.word}
                      title={v.meaning}
                      className="rounded-full bg-sky/25 border border-sky/40 px-3 py-1.5 text-xs font-bold text-sky-foreground"
                    >
                      {v.word} — <span className="font-normal">{v.meaning}</span>
                    </span>
                  ))}
                </div>
              </section>
            )}

            {result.sentences.length > 0 && (
              <section className="mt-6 surface-card p-6">
                <h2 className="text-display text-xl">Sentence-by-sentence breakdown</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  See exactly what changed in each sentence — and why the new version is better.
                </p>
                <ol className="mt-4 space-y-3">
                  {result.sentences.map((s, i) => (
                    <li
                      key={i}
                      className={`rounded-2xl border p-4 text-sm ${
                        s.changed
                          ? "border-coral/30 bg-coral/5"
                          : "border-mint/30 bg-mint/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border text-xs font-bold">
                          {i + 1}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            s.changed
                              ? "bg-coral/15 text-coral border-coral/30"
                              : "bg-mint/15 text-mint-foreground border-mint/30"
                          }`}
                        >
                          {s.changed ? "Improved" : "Already great"}
                        </span>
                      </div>
                      {s.changed ? (
                        <div className="mt-2 space-y-1">
                          <p>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-2">
                              Before
                            </span>
                            <span className="line-through text-muted-foreground">
                              {s.original}
                            </span>
                          </p>
                          <p>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-mint-foreground mr-2">
                              After
                            </span>
                            <span className="font-semibold">{s.corrected}</span>
                          </p>
                        </div>
                      ) : (
                        <p className="mt-2">{s.corrected}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        <span className="font-bold text-foreground">Why it's better: </span>
                        {s.why}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            )}



            <section className="mt-6 rounded-3xl gradient-meadow text-white p-6 shadow-soft">
              <p className="text-sm font-bold uppercase tracking-wider text-white/80">
                Keep going
              </p>
              <p className="mt-1 text-lg">{result.encouragement}</p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
