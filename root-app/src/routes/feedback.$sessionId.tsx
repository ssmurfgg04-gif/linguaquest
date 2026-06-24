import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, ThumbsUp, Wrench, BookOpen, Briefcase, RotateCcw, ArrowRight, Loader2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { CHARACTER_BY_ID, SAMPLE_FEEDBACK, SCENARIO_BY_ID, type FeedbackReport } from "@/data/mock";
import { loadSessionWithFeedback } from "@/lib/sessions";

const CARD_TONES: Record<string, string> = {
  mint:  "bg-mint/15 text-mint-foreground border-mint/30",
  sun:   "bg-sun/25 text-sun-foreground border-sun/40",
  sky:   "bg-sky/15 text-sky-foreground border-sky/30",
  grape: "bg-grape/15 text-grape border-grape/30",
};

export const Route = createFileRoute("/feedback/$sessionId")({
  head: () => ({
    meta: [
      { title: "Feedback — Ujuziverse" },
      { name: "description", content: "See what went well and what to try next in your last Ujuziverse chat." },
    ],
  }),
  component: Feedback,
});

function Feedback() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackReport | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { session, feedback: fb } = await loadSessionWithFeedback(sessionId);
        if (cancelled) return;
        if (session) setScenarioId(session.scenario_id);
        if (fb) {
          setFeedback({
            confidence: fb.confidence,
            fluency: fb.fluency,
            strengths: (fb.strengths as string[]) ?? [],
            improvements: (fb.improvements as string[]) ?? [],
            corrections: (fb.corrections as FeedbackReport["corrections"]) ?? [],
            newWords: (fb.new_words as FeedbackReport["newWords"]) ?? [],
            encouragement: fb.encouragement ?? "",
            realLifeNote: fb.real_life_note ?? "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [sessionId]);

  // Fallback to mock scenario if sessionId looks like a scenario slug (legacy)
  const scenario = scenarioId ? SCENARIO_BY_ID[scenarioId] : SCENARIO_BY_ID[sessionId];
  const character = scenario ? CHARACTER_BY_ID[scenario.characterId] : undefined;
  const f = feedback ?? SAMPLE_FEEDBACK;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Building your feedback…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <section className="mt-8 relative overflow-hidden rounded-3xl gradient-meadow text-white p-8 shadow-soft">
          <div className="absolute right-4 top-4 text-5xl animate-bob">🎉</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Great chat!</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">
            {scenario ? scenario.title : "Session complete"}
          </h1>
          <p className="mt-2 text-white/90 max-w-xl">{f.encouragement}</p>
          {character && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <CharacterAvatar character={character} size="sm" />
              <span className="font-bold">{character.name}</span>
              <span className="text-white/80">· loved chatting with you</span>
            </div>
          )}
        </section>

        <section className="mt-6 grid sm:grid-cols-2 gap-4">
          <ScoreCard label="Confidence" value={f.confidence} tone="coral" />
          <ScoreCard label="Fluency"    value={f.fluency}    tone="sky"   />
        </section>

        <section className="mt-6 grid lg:grid-cols-2 gap-4">
          <Card icon={<ThumbsUp className="h-5 w-5" />} title="What went well" tone="mint">
            <ul className="mt-3 space-y-2 text-sm">
              {f.strengths.map((s, i) => <li key={i} className="flex gap-2"><span>✅</span>{s}</li>)}
            </ul>
          </Card>
          <Card icon={<Wrench className="h-5 w-5" />} title="Try this next time" tone="sun">
            <ul className="mt-3 space-y-2 text-sm">
              {f.improvements.map((s, i) => <li key={i} className="flex gap-2"><span>💡</span>{s}</li>)}
            </ul>
          </Card>
        </section>

        {f.corrections.length > 0 && (
          <section className="mt-6 surface-card p-6">
            <h2 className="text-display text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Small fixes that level up your language
            </h2>
            <ul className="mt-4 space-y-3">
              {f.corrections.map((c, i) => (
                <li key={i} className="rounded-2xl bg-muted/60 p-4 text-sm">
                  <p>
                    <span className="line-through text-muted-foreground">{c.original}</span>{" "}
                    <span className="font-bold text-mint-foreground">→ {c.better}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{c.reason}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6 grid lg:grid-cols-2 gap-4">
          <Card icon={<BookOpen className="h-5 w-5" />} title="New words you learned" tone="sky">
            <div className="mt-3 flex flex-wrap gap-2">
              {f.newWords.map((w) => (
                <span key={w.word} className="rounded-full bg-sky/25 border border-sky/40 px-3 py-1.5 text-xs font-bold text-sky-foreground" title={w.meaning}>
                  {w.word}
                </span>
              ))}
              {f.newWords.length === 0 && (
                <span className="text-xs text-muted-foreground">No new words this round — try a longer chat!</span>
              )}
            </div>
          </Card>
          <Card icon={<Briefcase className="h-5 w-5" />} title="Why this matters in real life" tone="grape">
            <p className="mt-3 text-sm">{f.realLifeNote}</p>
          </Card>
        </section>

        <section className="mt-8 flex flex-wrap gap-3">
          {scenario && (
            <button
              onClick={() => navigate({ to: "/chat/$scenarioId", params: { scenarioId: scenario.id }, search: { mode: "text" } })}
              className="inline-flex items-center gap-2 rounded-full bg-surface border border-border font-bold px-5 py-3 hover:bg-accent"
            >
              <RotateCcw className="h-4 w-4" /> Try again
            </button>
          )}
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-bold px-6 py-3 shadow-pop hover:scale-[1.03] transition-transform"
          >
            Next scenario <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}

function ScoreCard({ label, value, tone }: { label: string; value: number; tone: "coral" | "sky" }) {
  const grad = tone === "coral" ? "gradient-sunset" : "gradient-ocean";
  return (
    <div className="surface-card p-6">
      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-display text-5xl">{value}</span>
        <span className="text-muted-foreground mb-1.5">/ 100</span>
      </div>
      <div className="mt-3 h-3 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${grad}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Card({
  icon, title, tone, children,
}: { icon: React.ReactNode; title: string; tone: "mint" | "sun" | "sky" | "grape"; children: React.ReactNode }) {
  return (
    <div className="surface-card p-6">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${CARD_TONES[tone]}`}>
        {icon} {title}
      </div>
      <div className="text-foreground">{children}</div>
    </div>
  );
}
