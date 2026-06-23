import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Search, Copy, Check, Languages, BookOpen } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSelector } from "@/components/LanguageSelector";
import { getLanguage } from "@/lib/sessions";
import { LANGUAGES } from "@/data/mock";
import { PHRASEBOOK_BY_LANGUAGE, type PhraseCategory } from "@/data/phrasebook";
import { PAGE_HEADINGS } from "@/data/language-headings";

export const Route = createFileRoute("/phrasebook")({
  head: () => ({
    meta: [
      { title: "Phrasebook — Ujuziverse" },
      { name: "description", content: "Browse useful everyday phrases in English, German, French, and Swahili." },
    ],
  }),
  component: PhrasebookPage,
});

function PhrasebookPage() {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "sw">(getLanguage);
  const lang = LANGUAGES.find((l) => l.code === language);
  const book = PHRASEBOOK_BY_LANGUAGE[language];
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

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
          <div className="absolute right-5 top-5 text-4xl animate-bob">📖</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Phrasebook</p>
          <h1 className="text-display text-2xl sm:text-3xl mt-1">
            {PAGE_HEADINGS.phrasebookTitle[language]}
          </h1>
          <p className="mt-1 text-white/85 text-sm max-w-lg">
            {PAGE_HEADINGS.phrasebookDesc[language]}
          </p>
        </section>

        <div className="mt-5">
          <LanguageSelector current={language} onChange={setLanguage} />
        </div>

        {!book ? (
          <div className="mt-8 text-center py-16 surface-card rounded-2xl border border-dashed">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground font-semibold">No phrasebook for {lang?.label} yet.</p>
          </div>
        ) : (
          <>
            <div className="mt-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search phrases…"
                className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="mt-6 space-y-6">
              {book.categories.map((cat) => {
                const filtered = search
                  ? cat.phrases.filter((p) =>
                      p.phrase.toLowerCase().includes(search.toLowerCase()) ||
                      p.translation.toLowerCase().includes(search.toLowerCase())
                    )
                  : cat.phrases;
                if (filtered.length === 0) return null;
                return (
                  <section key={cat.category}>
                    <h2 className="text-display text-lg flex items-center gap-2 mb-3">
                      <span>{cat.emoji}</span> {cat.category}
                    </h2>
                    <div className="space-y-2">
                      {filtered.map((p) => {
                        const uid = `${cat.category}-${p.phrase}`;
                        return (
                          <div key={uid} className="surface-card p-4 border border-border/60 flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-sm">{p.phrase}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{p.translation}</p>
                              {p.usage && <p className="text-[11px] text-primary mt-1 italic">{p.usage}</p>}
                            </div>
                            <button onClick={() => copyText(p.phrase, uid)} className="shrink-0 h-8 w-8 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-accent" aria-label="Copy phrase">
                              {copiedId === uid ? <Check className="h-4 w-4 text-mint-foreground" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
