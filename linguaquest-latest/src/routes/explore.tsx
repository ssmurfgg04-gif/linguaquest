import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mic, Gamepad2, BookOpen, MessageSquare, Sparkles, Brain, Globe, Zap, Users, Star, Target } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { SCENARIOS } from "@/data/mock";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Ujuziverse" },
      { name: "description", content: "Explore all learning paths, simulations, and tools on Ujuziverse." },
    ],
  }),
  component: ExplorePage,
});

const PATHS = [
  { emoji: "🎤", title: "UjuziSpeak", desc: "AI language coach for English, Swahili, French, and more.", to: "/ujuzispeak", gradient: "gradient-ocean", color: "from-sky-500 to-blue-600" },
  { emoji: "🎬", title: "UjuziSim", desc: "Real-world simulation lab with AI feedback.", to: "/simulations", gradient: "gradient-sunset", color: "from-coral to-orange-500" },
  { emoji: "🎨", title: "UjuziCreate", desc: "Creator studio for content and brand building.", to: "/creator-studio", gradient: "gradient-berry", color: "from-purple-500 to-pink-500" },
  { emoji: "🧠", title: "UjuziMind", desc: "Mental wellness, confidence, and personal growth.", to: "/ujuzimind", gradient: "gradient-meadow", color: "from-green-400 to-emerald-600" },
  { emoji: "🚀", title: "UjuziLaunch", desc: "Opportunities hub — scholarships, jobs, funding.", to: "/opportunities", gradient: "gradient-sunset", color: "from-amber-400 to-red-500" },
  { emoji: "🏫", title: "UjuziImpact", desc: "Institution portal for schools and partners.", to: "/ujuziimpact", gradient: "gradient-ocean", color: "from-indigo-500 to-cyan-500" },
  { emoji: "💬", title: "Community", desc: "Connect with learners and creators across Africa.", to: "/community", gradient: "gradient-berry", color: "from-violet-500 to-fuchsia-500" },
  { emoji: "📖", title: "Reading", desc: "Reading comprehension and literacy practice.", to: "/reading", gradient: "gradient-meadow", color: "from-teal-400 to-green-500" },
  { emoji: "🎯", title: "Quiz", desc: "Test your knowledge across all subjects.", to: "/quiz", gradient: "gradient-ocean", color: "from-blue-400 to-indigo-600" },
  { emoji: "🎮", title: "Matching Games", desc: "Fun word-matching and memory challenges.", to: "/games/match", gradient: "gradient-sunset", color: "from-pink-400 to-red-500" },
  { emoji: "📝", title: "Practice", desc: "Writing, speaking, and comprehension exercises.", to: "/practice", gradient: "gradient-meadow", color: "from-green-400 to-lime-600" },
  { emoji: "🏆", title: "Achievements", desc: "Badges, levels, leaderboard, and progress.", to: "/badges", gradient: "gradient-berry", color: "from-amber-400 to-orange-600" },
];

function ExplorePage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="mt-6">
          <h1 className="text-display text-3xl sm:text-4xl">Explore Ujuziverse</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">Discover all the tools, paths, and experiences waiting for you.</p>
        </section>

        <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PATHS.map((p, i) => (
            <Link
              key={i}
              to={p.to}
              className={`relative overflow-hidden rounded-2xl ${p.gradient} text-white p-5 shadow-soft hover:-translate-y-1 hover:shadow-pop transition-all group`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{p.emoji}</span>
                <div>
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="text-xs text-white/80 mt-0.5">{p.desc}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-white/70 group-hover:text-white transition-colors">
                Explore <ArrowLeft className="h-3 w-3 rotate-180" />
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-12 surface-card p-6 rounded-2xl border border-border/60">
          <h2 className="text-display text-xl flex items-center gap-2"><Star className="h-5 w-5 text-sun-foreground" /> Popular Simulations</h2>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SCENARIOS.filter((s) => s.stars >= 2).slice(0, 6).map((s) => (
              <Link
                key={s.id}
                to="/scenarios/$scenarioId"
                params={{ scenarioId: s.id }}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border/40 hover:bg-accent transition-colors"
              >
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <p className="font-bold text-sm">{s.title}</p>
                  <p className="text-[11px] text-muted-foreground">{s.realLifeSkill}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
