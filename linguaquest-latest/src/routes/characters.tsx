import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { CHARACTERS } from "@/data/mock";

export const Route = createFileRoute("/characters")({
  head: () => ({
    meta: [
      { title: "Characters — Ujuziverse" },
      { name: "description", content: "Meet the friendly AI characters who help you practice English, German, and French through real-life conversations." },
      { property: "og:title", content: "Meet the Ujuziverse characters" },
      { property: "og:description", content: "Six personalities, each helping you build a different communication skill." },
    ],
  }),
  component: Characters,
});

function Characters() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <section className="mt-8">
          <h1 className="text-display text-3xl sm:text-4xl">Meet your characters</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Each character has a personality, mood and speaking style. Chat with them to build different real-life communication skills.
          </p>
        </section>

        <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CHARACTERS.map((c) => (
            <div key={c.id} className="surface-card p-5">
              <div className="flex items-center gap-4">
                <CharacterAvatar character={c} size="lg" animate />
                <div>
                  <h2 className="text-display text-xl">{c.name}</h2>
                  <p className="text-sm font-semibold text-primary">{c.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{c.bio}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Tag label="Mood" value={c.mood} />
                <Tag label="Pace" value={c.pace} />
                <Tag label="Accent" value={c.accent} />
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 border border-border/60 px-2 py-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xs font-bold text-foreground mt-0.5 leading-tight">{value}</div>
    </div>
  );
}
