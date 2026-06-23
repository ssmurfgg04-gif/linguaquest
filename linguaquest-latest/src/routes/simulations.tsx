import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, Play, Star, Clock } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LEVELS, SCENARIOS, type LevelId } from "@/data/mock";
import { useState } from "react";

export const Route = createFileRoute("/simulations")({
  head: () => ({
    meta: [
      { title: "UjuziSim — Simulation Lab | Ujuziverse" },
      { name: "description", content: "Practice real-life scenarios with AI-powered simulations. Job interviews, brand pitches, public speaking, and more." },
    ],
  }),
  component: SimulationsPage,
});

const CATEGORIES = [
  { id: "all", label: "All", emoji: "🎯" },
  { id: "interview", label: "Interviews", emoji: "💼" },
  { id: "speaking", label: "Public Speaking", emoji: "🎤" },
  { id: "customer", label: "Customer Service", emoji: "🤝" },
  { id: "leader", label: "Leadership", emoji: "🚀" },
  { id: "friend", label: "Social Skills", emoji: "👋" },
];

function SimulationsPage() {
  const [cat, setCat] = useState("all");

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-berry text-white p-6 sm:p-10 shadow-soft">
          <div className="absolute right-5 top-5 text-5xl animate-bob">🎬</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">UjuziSim</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">Simulation Lab</h1>
          <p className="mt-2 text-white/85 max-w-lg">Real-world scenarios. AI-powered feedback. Build confidence.</p>
        </section>

        <section className="mt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-bold transition-colors ${
                  cat === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-surface border-border hover:bg-accent"
                }`}
              >
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCENARIOS.filter((s) => {
              if (cat === "all") return true;
              const search = `${s.title} ${s.summary} ${s.realLifeSkill}`.toLowerCase();
              return search.includes(cat);
            }).map((s) => (
              <Link
                key={s.id}
                to="/scenarios/$scenarioId"
                params={{ scenarioId: s.id }}
                className="surface-card p-5 border border-border/60 hover:-translate-y-1 hover:shadow-pop transition-all"
              >
                <div className="text-3xl mb-2">{s.emoji}</div>
                <h3 className="font-bold">{s.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.summary}</p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground font-bold">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.minutes} min</span>
                  <span className="flex items-center gap-1">
                    {[1, 2, 3].map((n) => (
                      <Star key={n} className={`h-3 w-3 ${n <= s.stars ? "text-sun-foreground fill-current" : "text-muted"}`} />
                    ))}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
