import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Mic, MessageSquare, ArrowRight, Search, Play, BookOpen, Globe, Star, Zap, Users, Target, Award, ChevronDown } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ScenarioCard } from "@/components/ScenarioCard";
import { LevelHeader } from "@/components/LevelHeader";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { CHARACTERS, LANGUAGES, LEVELS, SCENARIOS, USER_STATS, type LanguageCode, type LevelId } from "@/data/mock";
import { getLanguage, setLanguage, getGuestToken } from "@/lib/sessions";
import { loadStatsFn } from "@/lib/stats.functions";
import { isOnboarded } from "@/lib/onboarding";
import { OnboardingOverlay } from "@/components/OnboardingOverlay";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ujuziverse — Learn. Practice. Create. Thrive." },
      { name: "description", content: "Africa's future starts here. Learn new skills. Practice in real-life simulations. Create content. Launch opportunities. Thrive." },
      { property: "og:title", content: "Ujuziverse — Africa's Future Starts Here" },
      { property: "og:description", content: "AI-powered skill building for students, creators, and young professionals across Africa." },
    ],
  }),
  component: Home,
});

function Home() {
  const [onboarded, setOnboarded] = useState(true);

  useEffect(() => {
    setOnboarded(isOnboarded());
  }, []);

  return (
    <div className="min-h-screen">
      {!onboarded && <OnboardingOverlay />}
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <Hero />
        <WhatIsUjuziverse />
        <WhoIsThisFor />
        <Levels />
        <SuccessJourney />
        <Testimonials />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}

function Hero() {
  const [stats, setStats] = useState(USER_STATS);
  const [authUser, setAuthUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try { const raw = localStorage.getItem("lq.auth"); if (raw) setAuthUser(JSON.parse(raw)); } catch {}
    (async () => {
      try {
        const res = await loadStatsFn({ data: { guestToken: getGuestToken() } });
        setStats((s) => ({ ...s, sessions: res.sessions, stars: res.stars, streak: res.streak, confidence: res.confidence, fluency: res.fluency }));
      } catch (e) { console.warn("Failed to load stats", e); }
      setLoading(false);
    })();
  }, []);
  const next = SCENARIOS.find((s) => !s.completed && s.level === stats.level) ?? SCENARIOS[0];
  const displayName = authUser?.name || (stats.sessions > 0 ? "there!" : "");
  return (
    <section className="relative mt-6 sm:mt-10 overflow-hidden rounded-4xl gradient-hero text-white shadow-soft min-h-[480px] flex items-center">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-4 left-8 text-5xl animate-bob">🚀</div>
        <div className="absolute top-10 right-16 text-4xl animate-bob" style={{ animationDelay: "0.5s" }}>🌟</div>
        <div className="absolute bottom-20 left-1/4 text-3xl animate-bob" style={{ animationDelay: "1s" }}>💡</div>
        <div className="absolute bottom-10 right-1/3 text-4xl animate-bob" style={{ animationDelay: "1.5s" }}>🌍</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] opacity-10 select-none">U</div>
      </div>
      <div className="relative w-full p-6 sm:p-12">
        {displayName && (
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5" /> Welcome, {displayName}
          </span>
        )}
        <h1 className="mt-4 text-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-3xl">
          <span className="text-sun">Africa's Future</span><br />
          Starts Here.
        </h1>
        <p className="mt-4 text-white/85 max-w-2xl text-base sm:text-lg">
          Learn new skills. Practice in real-life simulations. Create content.
          Launch opportunities. Thrive.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/scenarios/$scenarioId"
            params={{ scenarioId: next.id }}
            className="inline-flex items-center gap-2 rounded-full bg-white text-coral font-bold px-6 py-3 shadow-pop hover:scale-[1.03] transition-transform"
          >
            Start Free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/simulations"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white font-bold px-6 py-3 hover:bg-white/10 transition-colors"
          >
            <Play className="h-4 w-4" /> Watch Demo
          </Link>
          <LanguageSelector current={getLanguage()} onChange={setLanguage} />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-white/90">
          {loading ? (
            <>
              <div className="h-10 w-20 animate-pulse rounded-lg bg-white/20" />
              <div className="h-10 w-20 animate-pulse rounded-lg bg-white/20" />
              <div className="h-10 w-24 animate-pulse rounded-lg bg-white/20" />
            </>
          ) : (
            <>
              <HeroStat label="Learning Paths" value="50+" />
              <HeroStat label="Simulations" value="500+" />
              <HeroStat label="Built for Africa" value="🌍" />
              <HeroStat label="Schools Ready" value="🏫" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-display text-xl">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-white/70 font-bold leading-tight">{label}</div>
    </div>
  );
}

function WhatIsUjuziverse() {
  const cards = [
    { emoji: "📚", title: "Learn", desc: "AI-powered communication and language coaching.", gradient: "gradient-ocean" },
    { emoji: "🎯", title: "Practice", desc: "Real-world simulations that build confidence.", gradient: "gradient-sunset" },
    { emoji: "🎨", title: "Create", desc: "Build your content, brand, and portfolio.", gradient: "gradient-berry" },
    { emoji: "🚀", title: "Thrive", desc: "Discover opportunities and earn.", gradient: "gradient-meadow" },
  ];
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <section className="mt-20">
      <div className="text-center mb-10">
        <h2 className="text-display text-3xl sm:text-4xl">More Than Learning</h2>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Four pillars. One universe. Your future.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <button
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            className={`relative overflow-hidden rounded-3xl ${c.gradient} text-white p-6 text-left shadow-soft hover:-translate-y-1 transition-all ${expanded === i ? "scale-[1.03] ring-4 ring-white/30" : ""}`}
          >
            <div className="text-4xl mb-2">{c.emoji}</div>
            <h3 className="text-display text-xl">{c.title}</h3>
            <p className={`mt-2 text-white/85 text-sm transition-all ${expanded === i ? "opacity-100 max-h-20" : "opacity-80 max-h-12 line-clamp-2"}`}>
              {c.desc}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

function WhoIsThisFor() {
  const groups = [
    { emoji: "🎒", title: "Students", desc: "Prepare for life beyond school." },
    { emoji: "🎬", title: "Creators", desc: "Turn creativity into income." },
    { emoji: "💼", title: "Young Professionals", desc: "Build confidence and career skills." },
    { emoji: "🏫", title: "Schools", desc: "Track student growth." },
    { emoji: "🤝", title: "NGOs", desc: "Scale youth impact programs." },
    { emoji: "🏦", title: "Financial Institutions", desc: "Empower entrepreneurs and creators." },
  ];
  return (
    <section className="mt-20">
      <h2 className="text-display text-3xl sm:text-4xl text-center mb-8">Who Is This For?</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
        {groups.map((g, i) => (
          <div key={i} className="snap-center shrink-0 w-56 surface-card p-5 border border-border/60 hover:-translate-y-1 hover:shadow-pop transition-all">
            <div className="text-4xl mb-2">{g.emoji}</div>
            <h3 className="font-bold text-lg">{g.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{g.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Levels() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelId | 0>(0);
  const filteredScenarios = SCENARIOS.filter(
    (s) =>
      (s.title.toLowerCase().includes(search.toLowerCase()) || s.summary.toLowerCase().includes(search.toLowerCase()) || s.realLifeSkill.toLowerCase().includes(search.toLowerCase())) &&
      (levelFilter === 0 || s.level === levelFilter)
  );

  return (
    <section className="mt-20">
      <div className="text-center mb-8">
        <h2 className="text-display text-3xl sm:text-4xl">Experience a Simulation</h2>
        <p className="text-muted-foreground mt-2">Choose a real-life scenario. AI guides you. Instant feedback.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scenarios…"
            className="w-full rounded-full border border-border bg-surface pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            aria-label="Search scenarios"
          />
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setLevelFilter(0)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
              levelFilter === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-surface border-border hover:bg-accent"
            }`}
          >
            All
          </button>
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevelFilter(l.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                levelFilter === l.id ? "bg-primary text-primary-foreground border-primary" : "bg-surface border-border hover:bg-accent"
              }`}
            >
              {l.emoji} Level {l.id}
            </button>
          ))}
        </div>
      </div>
      <Link
        to="/simulations"
        className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary font-bold text-sm px-4 py-2 hover:bg-primary/20 transition-colors"
      >
        <Play className="h-3.5 w-3.5" /> Try a Simulation
      </Link>
      <div className="space-y-8">
        {LEVELS.map((level) => {
          if (levelFilter !== 0 && levelFilter !== level.id) return null;
          const scenarios = filteredScenarios.filter((s) => s.level === level.id);
          if (scenarios.length === 0) return null;
          const completed = scenarios.filter((s) => s.completed).length;
          return (
            <div key={level.id}>
              <LevelHeader level={level} completed={completed} total={scenarios.length} />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {scenarios.map((s) => (
                  <ScenarioCard key={s.id} scenario={s} locked={!level.unlocked} />
                ))}
              </div>
            </div>
          );
        })}
        {filteredScenarios.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No scenarios match your search.</p>
        )}
      </div>
    </section>
  );
}

function SuccessJourney() {
  const steps = [
    { emoji: "🔍", title: "Discover", desc: "Find your passion and path." },
    { emoji: "📚", title: "Learn", desc: "Build skills with AI coaching." },
    { emoji: "🎯", title: "Practice", desc: "Real-world simulations." },
    { emoji: "🎨", title: "Create", desc: "Build your portfolio." },
    { emoji: "🚀", title: "Launch", desc: "Share with the world." },
    { emoji: "🌟", title: "Thrive", desc: "Earn and grow." },
  ];
  return (
    <section className="mt-20 surface-card p-8 rounded-3xl border border-border/60">
      <h2 className="text-display text-3xl sm:text-4xl text-center">Your Success Journey</h2>
      <p className="text-muted-foreground text-center mt-2 mb-8">From discovery to thriving — we're with you.</p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 relative">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 sm:flex-col sm:text-center relative z-10">
            <div className="w-12 h-12 rounded-full gradient-sunset text-white flex items-center justify-center text-xl shadow-soft">{s.emoji}</div>
            <div>
              <p className="font-bold text-sm">{s.title}</p>
              <p className="text-xs text-muted-foreground hidden sm:block">{s.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <ChevronDown className="hidden sm:block h-5 w-5 text-muted-foreground rotate-[-90deg] absolute -right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>
        ))}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted hidden sm:block -z-0" />
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    { emoji: "🎒", name: "Amina, 19", role: "Student, Nairobi", quote: "Ujuziverse helped me prepare for my first job interview. The AI feedback was incredible — I felt so much more confident.", gradient: "gradient-ocean" },
    { emoji: "🎬", name: "Kevin, 24", role: "Creator, Lagos", quote: "The creator studio tools are amazing. I planned my entire content calendar and grew my audience by 300%.", gradient: "gradient-sunset" },
    { emoji: "🏫", name: "Sarah Wanjiku", role: "Teacher, Mombasa", quote: "My students' communication skills improved dramatically. The progress tracking helps me see exactly where each learner needs support.", gradient: "gradient-meadow" },
    { emoji: "🤝", name: "James Ochieng", role: "NGO Partner, Kisumu", quote: "We deployed Ujuziverse across 15 youth centers. The impact reports made it easy to show our donors real results.", gradient: "gradient-berry" },
  ];
  return (
    <section className="mt-20">
      <h2 className="text-display text-3xl sm:text-4xl text-center">What People Say</h2>
      <p className="text-muted-foreground text-center mt-2 mb-8">Real stories from the Ujuziverse community.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {testimonials.map((t, i) => (
          <div key={i} className={`relative overflow-hidden rounded-2xl ${t.gradient} text-white p-6 shadow-soft`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">{t.emoji}</div>
              <div>
                <p className="font-bold">{t.name}</p>
                <p className="text-xs text-white/70">{t.role}</p>
              </div>
            </div>
            <p className="text-sm text-white/90 italic">"{t.quote}"</p>
            <div className="mt-3 flex gap-1">
              {[1,2,3,4,5].map((n) => <Star key={n} className="h-4 w-4 fill-current text-sun" />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="mt-20 relative overflow-hidden rounded-4xl gradient-hero text-white p-10 sm:p-16 text-center shadow-soft">
      <div className="absolute -right-10 -bottom-10 text-[15rem] opacity-10 select-none">U</div>
      <h2 className="text-display text-3xl sm:text-5xl relative">Ready to Build Your Future?</h2>
      <p className="mt-3 text-white/85 max-w-lg mx-auto relative">Join thousands across Africa learning, creating, and thriving.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3 relative">
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 rounded-full bg-white text-coral font-bold px-6 py-3 shadow-pop hover:scale-[1.03] transition-transform"
        >
          Start Free <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white font-bold px-6 py-3 hover:bg-white/10 transition-colors"
        >
          Partner With Us
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 pt-10">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🚀</span>
            <span className="text-display text-lg"><span className="text-foreground">Ujuzi</span><span className="text-primary">verse</span></span>
          </div>
          <p className="text-sm text-muted-foreground">Learn. Practice. Create. Thrive.</p>
          <p className="text-xs text-muted-foreground mt-1">Built by Creative Divine Concepts Ltd</p>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-3">Platform</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>UjuziSpeak — AI Language Coach</p>
            <p>UjuziSim — Simulation Lab</p>
            <p>UjuziCreate — Creator Studio</p>
            <p>UjuziMind — Mental Wellness</p>
            <p>UjuziLaunch — Opportunities Hub</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-3">For</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Students</p>
            <p>Creators</p>
            <p>Professionals</p>
            <p>Schools & Institutions</p>
            <p>NGOs & Partners</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-3">Creative Divine Concepts</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Nairobi, Kenya</p>
            <p>+254 733 985142</p>
            <p>info@creativedivineconcepts.com</p>
            <p className="pt-2 text-xs">Mon–Fri 9:00 AM – 5:00 PM</p>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Creative Divine Concepts Ltd. All rights reserved. Ujuziverse is a product of Creative Divine Concepts.</p>
      </div>
    </footer>
  );
}
