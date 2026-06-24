import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Mic, MessageSquare, Sparkles, Star } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { CHARACTER_BY_ID, LANGUAGES, LEVELS, SCENARIO_BY_ID, type LanguageCode } from "@/data/mock";
import { getLanguage, setLanguage } from "@/lib/sessions";

export const Route = createFileRoute("/scenarios/$scenarioId")({
  head: ({ params }) => {
    const s = SCENARIO_BY_ID[params.scenarioId];
    const title = s ? `${s.title} — Ujuziverse` : "Scenario — Ujuziverse";
    const desc = s ? s.summary : "Practice a real-life conversation in English, German, or French.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: s?.title ?? "Ujuziverse Scenario" },
        { property: "og:description", content: desc },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Scenario not found.
    </div>
  ),
  loader: ({ params }) => {
    const scenario = SCENARIO_BY_ID[params.scenarioId];
    if (!scenario) throw notFound();
    return { scenario };
  },
  component: ScenarioDetail,
});

function ScenarioDetail() {
  const { scenario } = Route.useLoaderData() as { scenario: NonNullable<typeof SCENARIO_BY_ID[string]> };
  const character = CHARACTER_BY_ID[scenario.characterId];
  const level = LEVELS.find((l) => l.id === scenario.level)!;
  const [lang, setLang] = useState<LanguageCode>("en");
  useEffect(() => setLang(getLanguage()), []);
  const updateLang = (l: LanguageCode) => { setLang(l); setLanguage(l); };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to quest
        </Link>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-sunset text-white p-6 sm:p-10 shadow-soft">
          <div className="absolute -right-4 -bottom-4 text-[10rem] opacity-15 leading-none select-none">{scenario.emoji}</div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <CharacterAvatar character={character} size="xl" animate />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">
                Level {level.id} · {level.title}
              </p>
              <h1 className="text-display text-3xl sm:text-4xl mt-1">{scenario.title}</h1>
              <p className="mt-2 text-white/90 max-w-xl">{scenario.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                <Chip>{scenario.minutes} min</Chip>
                <Chip>with {character.name}</Chip>
                <Chip>Skill: {scenario.realLifeSkill}</Chip>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid md:grid-cols-3 gap-4">
          <InfoCard icon={<Sparkles className="h-5 w-5" />} title="What you'll practice">
            {scenario.practiceDescription}
          </InfoCard>
          <InfoCard icon={<MessageSquare className="h-5 w-5" />} title="Tips before you start">
            It's okay to pause. The character will wait. Be yourself!
          </InfoCard>
          <InfoCard icon={<Star className="h-5 w-5" />} title="Earn">
            Up to 3 stars, plus confidence and fluency points.
          </InfoCard>
        </section>

        <section className="mt-8 surface-card p-6">
          <h2 className="text-display text-xl">Choose your language</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => updateLang(l.code)}
                className={`rounded-full px-4 py-2 text-sm font-bold border transition-all ${
                  lang === l.code
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : "bg-surface border-border hover:bg-accent"
                }`}
              >
                {l.flag} {l.nativeLabel}
              </button>
            ))}
          </div>

          <h2 className="text-display text-xl mt-6">Choose how to chat</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <Link
              to="/chat/$scenarioId"
              params={{ scenarioId: scenario.id }}
              search={{ mode: "voice" }}
              className="group relative rounded-2xl gradient-berry text-white p-5 shadow-soft hover:-translate-y-0.5 hover:shadow-pop transition-all"
            >
              <Mic className="h-6 w-6" />
              <h3 className="text-display text-lg mt-3">Voice chat</h3>
              <p className="text-sm text-white/85">Speak naturally — best for real practice.</p>
            </Link>
            <Link
              to="/chat/$scenarioId"
              params={{ scenarioId: scenario.id }}
              search={{ mode: "text" }}
              className="group relative rounded-2xl gradient-ocean text-white p-5 shadow-soft hover:-translate-y-0.5 hover:shadow-pop transition-all"
            >
              <MessageSquare className="h-6 w-6" />
              <h3 className="text-display text-lg mt-3">Text chat</h3>
              <p className="text-sm text-white/85">Type at your own pace.</p>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> About {scenario.minutes} minutes
          </p>
        </section>
      </main>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">{children}</span>;
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="surface-card p-5">
      <div className="h-9 w-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center">{icon}</div>
      <h3 className="text-display text-lg mt-3">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{children}</p>
    </div>
  );
}
