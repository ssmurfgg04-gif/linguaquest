import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Globe, Check } from "lucide-react";
import { loadOnboarding, saveOnboarding, completeOnboarding, AVATAR_OPTIONS, type OnboardingData } from "@/lib/onboarding";
import { playClick, playCorrect, playCelebration, hapticMedium, hapticHeavy } from "@/lib/sound-effects";
import { claimDailyLogin } from "@/lib/xp-system";
import { Confetti } from "@/components/Confetti";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "sw", label: "Swahili", flag: "🇹🇿" },
];

export function OnboardingOverlay() {
  const [data, setData] = useState<OnboardingData>(loadOnboarding);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  // If already onboarded, don't show
  if (data.step >= 3) return null;

  const update = (partial: Partial<OnboardingData>) => {
    setData((prev) => {
      const next = { ...prev, ...partial };
      saveOnboarding(next);
      return next;
    });
  };

  const finish = () => {
    completeOnboarding(data.name, data.language, data.avatar);
    playCelebration();
    hapticHeavy();
    setShowConfetti(true);
    claimDailyLogin(); // First day XP bonus
    setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 2000);
  };

  const step = data.step;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
      <Confetti show={showConfetti} />
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md animate-fade-in" />

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${s <= step ? "bg-primary w-8" : "bg-muted w-4"}`}
            />
          ))}
        </div>

        {/* Step 0: Welcome + Name */}
        {step === 0 && (
          <div className="surface-card p-8 border border-border/60 text-center">
            <div className="text-6xl mb-3 animate-bob">🚀</div>
            <h1 className="text-display text-2xl sm:text-3xl">Welcome to Ujuziverse!</h1>
            <p className="text-muted-foreground mt-2 text-sm">Learn languages, practice speaking, and have fun. Let's get started!</p>

            <div className="mt-6">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block text-left">What's your name?</label>
              <input
                autoFocus
                value={data.name}
                onChange={(e) => update({ name: e.target.value })}
                onKeyDown={(e) => { if (e.key === "Enter" && data.name.trim().length >= 2) { playClick(); hapticMedium(); update({ step: 1 }); } }}
                placeholder="Type your name..."
                className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-primary/40 text-center text-lg font-bold"
              />
            </div>

            <button
              onClick={() => { playClick(); hapticMedium(); update({ step: 1 }); }}
              disabled={data.name.trim().length < 2}
              className="mt-6 w-full rounded-full bg-primary text-primary-foreground font-bold px-5 py-3 shadow-pop hover:scale-[1.02] transition-transform disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 1: Pick Avatar */}
        {step === 1 && (
          <div className="surface-card p-8 border border-border/60 text-center">
            <h1 className="text-display text-2xl">Choose your avatar</h1>
            <p className="text-muted-foreground mt-1 text-sm">Pick one that feels like you!</p>

            <div className="mt-6 grid grid-cols-8 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  onClick={() => { playClick(); hapticMedium(); update({ avatar: av }); }}
                  className={`text-2xl p-2 rounded-xl border-2 transition-all ${
                    data.avatar === av ? "border-primary bg-primary/10 scale-110" : "border-border hover:bg-accent"
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="text-4xl">{data.avatar}</div>
              <span className="font-bold text-lg">{data.name}</span>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { playClick(); update({ step: 0 }); }}
                className="flex-1 rounded-full border border-border bg-surface font-bold px-5 py-3 text-sm hover:bg-accent"
              >
                Back
              </button>
              <button
                onClick={() => { playClick(); hapticMedium(); update({ step: 2 }); }}
                className="flex-1 rounded-full bg-primary text-primary-foreground font-bold px-5 py-3 shadow-pop hover:scale-[1.02] transition-transform inline-flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Pick Language */}
        {step === 2 && (
          <div className="surface-card p-8 border border-border/60 text-center">
            <h1 className="text-display text-2xl">What language to learn?</h1>
            <p className="text-muted-foreground mt-1 text-sm">You can always change this later.</p>

            <div className="mt-6 space-y-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { playClick(); hapticMedium(); update({ language: l.code }); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all ${
                    data.language === l.code
                      ? "border-primary bg-primary/10 font-bold scale-[1.02]"
                      : "border-border bg-surface hover:bg-accent"
                  }`}
                >
                  <span className="text-2xl">{l.flag}</span>
                  <span className="text-sm font-semibold">{l.label}</span>
                  {data.language === l.code && <Check className="h-4 w-4 text-primary ml-auto" />}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { playClick(); update({ step: 1 }); }}
                className="flex-1 rounded-full border border-border bg-surface font-bold px-5 py-3 text-sm hover:bg-accent"
              >
                Back
              </button>
              <button
                onClick={() => { playCorrect(); finish(); }}
                className="flex-1 rounded-full bg-primary text-primary-foreground font-bold px-5 py-3 shadow-pop hover:scale-[1.02] transition-transform inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" /> Let's Go!
              </button>
            </div>
          </div>
        )}

        {/* Completion */}
        {step >= 3 && (
          <div className="surface-card p-8 border border-border/60 text-center animate-scale-in">
            <div className="text-6xl mb-3">{data.avatar}</div>
            <h1 className="text-display text-2xl">You're all set, {data.name}!</h1>
            <p className="text-muted-foreground mt-2 text-sm">Taking you to your dashboard...</p>
            <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-progress-bar" style={{ width: "100%" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}