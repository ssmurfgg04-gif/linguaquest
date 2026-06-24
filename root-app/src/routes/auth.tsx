import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, Lock, Loader2, AlertCircle, Check, Globe, Mic } from "lucide-react";
import type { LanguageCode } from "@/data/mock";

const AUTH_KEY = "lq.auth";

interface AuthUser { name: string; email: string; language: LanguageCode; journey: string; }

const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "sw", label: "Swahili", flag: "🇹🇿" },
];

function getStoredUser(): AuthUser | null {
  try { const raw = localStorage.getItem(AUTH_KEY); return raw ? JSON.parse(raw) as AuthUser : null; } catch { return null; }
}

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign up — Ujuziverse" },
      { name: "description", content: "Choose your journey and create your free Ujuziverse account." },
    ],
  }),
  component: Auth,
});

const JOURNEYS = [
  { id: "student", emoji: "🎒", title: "Student", desc: "Prepare for life beyond school." },
  { id: "creator", emoji: "🎬", title: "Creator", desc: "Turn creativity into income." },
  { id: "professional", emoji: "💼", title: "Professional", desc: "Build confidence and career skills." },
  { id: "school", emoji: "🏫", title: "School", desc: "Track student growth and progress." },
  { id: "ngo", emoji: "🤝", title: "NGO", desc: "Scale youth impact programs." },
  { id: "corporate", emoji: "🏦", title: "Corporate Partner", desc: "Empower entrepreneurs and creators." },
];

const COUNTRIES = [
  "Kenya", "Nigeria", "South Africa", "Ghana", "Uganda", "Tanzania", "Rwanda", "Ethiopia",
  "Egypt", "Morocco", "Zambia", "Zimbabwe", "Senegal", "Ivory Coast", "Botswana", "Other",
];

function Auth() {
  const navigate = useNavigate();
  const existing = getStoredUser();
  const [step, setStep] = useState<"journey" | "form">("journey");
  const [journey, setJourney] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguageState] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  function selectJourney(id: string) {
    setJourney(id);
    setStep("form");
  }

  function validate(): string | null {
    if (!email.includes("@") || !email.includes(".")) return "Enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (name.trim().length < 2) return "Enter your name.";
    const validCountries = COUNTRIES.map((c) => c.toLowerCase());
    if (country && !validCountries.includes(country.toLowerCase())) return "Select a valid country.";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const user: AuthUser = {
        name: name.trim(),
        email,
        language: (language as LanguageCode) || "en",
        journey,
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      setLoading(false);
      setSignedIn(true);
      setTimeout(() => navigate({ to: "/dashboard" }), 1200);
    }, 800);
  }

  function handleSignOut() {
    localStorage.removeItem(AUTH_KEY);
    setSignedIn(false);
    setStep("journey");
    setJourney("");
    setName(""); setEmail(""); setCountry(""); setPassword("");
  }

  if (signedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-3"><Check className="h-12 w-12 text-mint-foreground mx-auto" /></div>
          <h1 className="text-display text-2xl text-foreground">Welcome to Ujuziverse!</h1>
          <p className="text-sm text-muted-foreground mt-1">Taking you to your dashboard…</p>
        </div>
      </div>
    );
  }

  if (existing && step === "journey") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="absolute top-6 left-6">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
        <div className="w-full max-w-md surface-card p-8 border border-border/60 text-center">
          <div className="flex justify-center text-4xl mb-2">🚀</div>
          <h1 className="text-display text-xl">Welcome back, <span className="text-primary">{existing.name}</span></h1>
          <p className="text-sm text-muted-foreground mt-1">{existing.email} · {existing.journey}</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/dashboard" className="w-full rounded-full bg-primary text-primary-foreground font-bold px-5 py-3 shadow-pop hover:scale-[1.02] transition-transform text-center">
              Go to Dashboard
            </Link>
            <button onClick={handleSignOut} className="w-full rounded-full border border-border bg-surface font-bold px-5 py-3 text-sm hover:bg-accent">
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "journey") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="absolute top-6 left-6">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🚀</div>
            <h1 className="text-display text-3xl">Choose Your Journey</h1>
            <p className="text-muted-foreground mt-1">Tell us who you are so we can tailor your experience.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {JOURNEYS.map((j) => (
              <button
                key={j.id}
                onClick={() => selectJourney(j.id)}
                className="surface-card p-5 rounded-2xl border border-border/60 text-left hover:-translate-y-1 hover:shadow-pop hover:border-primary/40 transition-all group"
              >
                <div className="text-3xl mb-2">{j.emoji}</div>
                <h3 className="font-bold group-hover:text-primary transition-colors">{j.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{j.desc}</p>
              </button>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground underline">Maybe later, take me home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="absolute top-6 left-6">
        <button onClick={() => setStep("journey")} className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="w-full max-w-md surface-card p-8 border border-border/60">
        <div className="text-center mb-4">
          <div className="text-lg font-bold text-primary capitalize">{journey}</div>
          <h1 className="text-display text-2xl mt-1">Create your account</h1>
          <p className="text-sm text-muted-foreground">Free forever. No credit card needed.</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <Field icon={<span className="text-base">😊</span>} placeholder="Your name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <Field icon={<Mail className="h-4 w-4" />} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 focus-within:ring-4 focus-within:ring-ring/40">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm appearance-none"
            >
              <option value="">Select your country</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 focus-within:ring-4 focus-within:ring-ring/40">
            <Mic className="h-4 w-4 text-muted-foreground" />
            <select
              value={language}
              onChange={(e) => setLanguageState(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm appearance-none"
            >
              <option value="">Language to practice</option>
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
            </select>
          </div>
          <Field icon={<Lock className="h-4 w-4" />} placeholder="Password (min 6 chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && (
            <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary text-primary-foreground font-bold px-5 py-3 shadow-pop hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Free forever. No credit card needed.
        </p>
      </div>
    </div>
  );
}

function Field({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 focus-within:ring-4 focus-within:ring-ring/40">
      <span className="text-muted-foreground">{icon}</span>
      <input {...props} className="flex-1 bg-transparent outline-none text-sm" />
    </div>
  );
}
