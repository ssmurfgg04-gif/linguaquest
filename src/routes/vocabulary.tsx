import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Shuffle, RotateCcw, Languages, BookOpen } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSelector } from "@/components/LanguageSelector";
import { getLanguage } from "@/lib/sessions";
import { LANGUAGES } from "@/data/mock";
import { DECKS_BY_LANGUAGE, type VocabDeck } from "@/data/vocabulary";
import { PAGE_HEADINGS } from "@/data/language-headings";

export const Route = createFileRoute("/vocabulary")({
  head: () => ({
    meta: [
      { title: "Vocabulary Flashcards — Ujuziverse" },
      { name: "description", content: "Learn new words with interactive flashcards in English, German, French, and Swahili." },
    ],
  }),
  component: VocabularyPage,
});

function VocabularyPage() {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "sw">(getLanguage);
  const lang = LANGUAGES.find((l) => l.code === language);
  const decks = DECKS_BY_LANGUAGE[language] ?? [];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 pb-24">
        <div className="mt-6 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-sunset text-white p-6 shadow-soft">
          <div className="absolute right-5 top-5 text-4xl animate-bob">🃏</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Flashcards</p>
          <h1 className="text-display text-2xl sm:text-3xl mt-1">
            {PAGE_HEADINGS.vocabTitle[language]}
          </h1>
          <p className="mt-1 text-white/85 text-sm max-w-lg">
            {PAGE_HEADINGS.vocabDesc[language]}
          </p>
        </section>

        <div className="mt-5">
          <LanguageSelector current={language} onChange={setLanguage} />
        </div>

        {decks.length === 0 ? (
          <div className="mt-8 text-center py-16 surface-card rounded-2xl border border-dashed">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground font-semibold">No vocabulary decks for {lang?.label} yet.</p>
            <p className="text-xs text-muted-foreground mt-1">New decks are added regularly — check back soon!</p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {decks.map((deck) => (
                <DeckCard key={deck.id} deck={deck} />
              ))}
            </div>
            <div className="mt-6">
              <FullDeckView decks={decks} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function DeckCard({ deck }: { deck: VocabDeck }) {
  return (
    <div className="surface-card p-4 border border-border/60 flex items-center gap-3">
      <span className="text-3xl">{deck.emoji}</span>
      <div>
        <h3 className="font-bold text-sm">{deck.title}</h3>
        <p className="text-xs text-muted-foreground">{deck.cards.length} words</p>
      </div>
    </div>
  );
}

function FullDeckView({ decks }: { decks: VocabDeck[] }) {
  const [deckIdx, setDeckIdx] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  const deck = decks[deckIdx];
  if (!deck || deck.cards.length === 0) return null;

  const learnedKey = `vocab-learned-${deck.id}`;

  function getLearned(): Set<string> {
    try { return new Set(JSON.parse(localStorage.getItem(learnedKey) || "[]")); } catch (e) { console.warn("Failed to parse learned vocab", e); return new Set(); }
  }

  function saveLearned(ids: Set<string>) {
    localStorage.setItem(learnedKey, JSON.stringify([...ids]));
  }

  const [learned, setLearned] = useState<Set<string>>(getLearned);

  const cards = (shuffled ? [...deck.cards].sort(() => Math.random() - 0.5) : deck.cards)
    .filter((c) => !learned.has(c.word));
  const card = cards[cardIdx];
  const totalUnlearned = cards.length;

  const goNext = () => {
    setFlipped(false);
    setCardIdx((i) => (i + 1) % (cards.length || 1));
  };

  const goPrev = () => {
    setFlipped(false);
    setCardIdx((i) => (i - 1 + (cards.length || 1)) % (cards.length || 1));
  };

  const markLearned = () => {
    if (!card) return;
    const next = new Set(learned);
    next.add(card.word);
    saveLearned(next);
    setLearned(next);
    setFlipped(false);
  };

  const resetDeck = () => {
    localStorage.removeItem(learnedKey);
    setLearned(new Set());
    setCardIdx(0);
    setFlipped(false);
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {decks.map((d, i) => (
          <button
            key={d.id}
            onClick={() => { setDeckIdx(i); setCardIdx(0); setFlipped(false); }}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold border ${
              i === deckIdx ? "bg-primary text-primary-foreground border-primary" : "bg-surface border-border"
            }`}
          >
            {d.emoji} {d.title}
          </button>
        ))}
      </div>

        <div className="mt-4 surface-card p-8 flex flex-col items-center">
          {cards.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-2xl font-bold text-primary">🎉 All done!</p>
              <p className="text-sm text-muted-foreground mt-2">You've learned every word in this deck.</p>
              <button onClick={resetDeck} className="mt-4 rounded-full bg-surface border border-border px-5 py-2 text-xs font-bold hover:bg-accent">
                Reset deck
              </button>
            </div>
          ) : (<>
          <button
            onClick={() => setFlipped(!flipped)}
            className="w-full min-h-[200px] flex flex-col items-center justify-center cursor-pointer rounded-2xl bg-muted/40 p-6 hover:bg-muted/60 transition-colors"
          >
            {!flipped ? (
              <div className="text-center">
                <p className="text-3xl font-bold">{card.word}</p>
                <p className="text-xs text-muted-foreground mt-2">{card.pos}</p>
                <p className="text-xs text-primary mt-6">Tap to reveal translation</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xl font-bold text-primary">{card.translation}</p>
                <p className="text-sm text-muted-foreground mt-3 italic">"{card.example}"</p>
                <p className="text-xs text-primary mt-6">Tap to hide</p>
              </div>
            )}
          </button>

          <div className="mt-4 flex items-center gap-3">
            <button onClick={goPrev} className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-accent" aria-label="Previous card">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-xs text-muted-foreground font-bold min-w-[4rem] text-center">{cardIdx + 1} / {cards.length}</span>
            <button onClick={goNext} className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-accent" aria-label="Next card">
              <ChevronRight className="h-5 w-5" />
            </button>
            <button onClick={() => { setShuffled((s) => !s); setCardIdx(0); setFlipped(false); }} className={`h-10 w-10 rounded-full border flex items-center justify-center hover:bg-accent ${shuffled ? "bg-primary text-primary-foreground border-primary" : "bg-surface border-border"}`} title="Shuffle" aria-label="Shuffle cards">
              <Shuffle className="h-5 w-5" />
            </button>
            <button onClick={resetDeck} className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-accent" title="Reset deck" aria-label="Reset deck">
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>

          {flipped && (
            <div className="mt-4 flex gap-3">
              <button onClick={() => { markLearned(); goNext(); }} className="rounded-full bg-mint text-mint-foreground font-bold px-5 py-2 text-xs shadow-soft hover:scale-105 transition-transform">
                Got it ✓
              </button>
              <button onClick={goNext} className="rounded-full bg-coral/15 text-coral font-bold px-5 py-2 text-xs hover:scale-105 transition-transform">
                Still learning ✗
              </button>
            </div>
          )}
          </>)}
        </div>
    </div>
  );
}
