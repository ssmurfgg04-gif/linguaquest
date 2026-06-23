import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, RotateCcw, Clock, Star, Brain, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSelector } from "@/components/LanguageSelector";
import { getLanguage } from "@/lib/sessions";
import { LANGUAGES } from "@/data/mock";
import { MATCH_GAMES_BY_LANGUAGE, type MatchGame, type MatchPair } from "@/data/matching";
import { PAGE_HEADINGS } from "@/data/language-headings";
import { addXP, loadXPState } from "@/lib/xp-system";
import { trackWeeklyActivity } from "@/lib/weekly-goals";
import { playClick, playCardFlip, playMatchFound, playWrong, playCelebration, hapticMedium, hapticHeavy, hapticError } from "@/lib/sound-effects";
import { Confetti, XPPopup, LevelUpOverlay } from "@/components/Confetti";

export const Route = createFileRoute("/games/match")({
  head: () => ({
    meta: [
      { title: "Word Match Game — Ujuziverse" },
      { name: "description", content: "Match words to their translations in this fun memory game." },
    ],
  }),
  component: MatchPage,
});

type Card = { id: string; text: string; pairId: string; side: "word" | "translation" };

function MatchPage() {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "sw">(getLanguage);
  const lang = LANGUAGES.find((l) => l.code === language);
  const games = MATCH_GAMES_BY_LANGUAGE[language] ?? [];

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
          <div className="absolute right-5 top-5 text-4xl animate-bob">🎯</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Word Match</p>
          <h1 className="text-display text-2xl sm:text-3xl mt-1">
            {PAGE_HEADINGS.matchTitle[language]}
          </h1>
          <p className="mt-1 text-white/85 text-sm max-w-lg">
            {PAGE_HEADINGS.matchDesc[language]}
          </p>
        </section>

        <div className="mt-5">
          <LanguageSelector current={language} onChange={setLanguage} />
        </div>

        {games.length === 0 ? (
          <div className="mt-8 text-center py-16 surface-card rounded-2xl border border-dashed">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground font-semibold">No matching games for {lang?.label} yet.</p>
            <p className="text-xs text-muted-foreground mt-1">New games are on the way!</p>
          </div>
        ) : (
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {games.map((game) => (
              <MatchGameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function MatchGameCard({ game }: { game: MatchGame }) {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="surface-card p-5 border border-border/60 flex flex-col items-center text-center">
        <span className="text-3xl">{game.emoji}</span>
        <h3 className="font-bold text-base mt-2">{game.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{game.pairs.length} pairs to match</p>
        <button onClick={() => { setStarted(true); playClick(); hapticMedium(); }} className="mt-3 rounded-full bg-primary text-primary-foreground font-bold px-5 py-2 text-sm shadow-soft hover:scale-105 transition-transform">
          Play
        </button>
      </div>
    );
  }

  return <MatchBoard game={game} onBack={() => setStarted(false)} />;
}

function MatchBoard({ game, onBack }: { game: MatchGame; onBack: () => void }) {
  const [cards, setCards] = useState<Card[]>(() => shuffleCards(game.pairs));
  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [xpState, setXpState] = useState(loadXPState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (matched.length === game.pairs.length * 2 && game.pairs.length > 0) {
      setFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);

      // Calculate stars and award XP
      const pairs = game.pairs.length;
      const stars = moves <= pairs + 2 ? 3 : moves <= pairs * 2 ? 2 : 1;

      setTimeout(() => {
        const result = stars === 3 ? addXP("match.perfect") : addXP("match.complete");
        setXpState(result.state);
        setXpAmount(result.xpGained);
        setShowXP(true);
        setTimeout(() => setShowXP(false), 1500);

        // Track toward weekly goals
        trackWeeklyActivity("xp", result.xpGained);

        playCelebration();
        setShowConfetti(true);
        hapticHeavy();
        setTimeout(() => setShowConfetti(false), 3000);

        if (result.leveledUp) {
          setNewLevel(result.newLevel);
          setShowLevelUp(true);
        }
      }, 200);
    }
  }, [matched.length, game.pairs.length, moves]);

  const handleCardClick = (card: Card) => {
    if (finished || selected.length >= 2 || selected.includes(card.id) || matched.includes(card.id)) return;
    playCardFlip();
    hapticMedium();
    const newSelected = [...selected, card.id];
    setSelected(newSelected);
    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newSelected.map((id) => cards.find((c) => c.id === id)!);
      if (first.pairId === second.pairId && first.side !== second.side) {
        // Match found!
        playMatchFound();
        hapticHeavy();
        setMatched((m) => [...m, first.id, second.id]);
        setSelected([]);
      } else {
        // No match
        playWrong();
        hapticError();
        setTimeout(() => setSelected([]), 800);
      }
    }
  };

  const restart = () => {
    setCards(shuffleCards(game.pairs));
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setFinished(false);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const pairs = game.pairs.length;

  if (finished) {
    const stars = moves <= pairs + 2 ? 3 : moves <= pairs * 2 ? 2 : 1;
    return (
      <div className="col-span-full">
        <Confetti show={showConfetti} />
        <XPPopup xp={xpAmount} show={showXP} label="Match Complete!" />
        <LevelUpOverlay show={showLevelUp} level={newLevel} onClose={() => setShowLevelUp(false)} />

        <div className="surface-card p-6 border border-border/60 text-center">
          <span className="text-5xl">🎉</span>
          <h2 className="text-display text-xl mt-2">All Matched!</h2>
          <div className="flex justify-center gap-1 mt-2">
            {[1, 2, 3].map((s) => (
              <Star key={s} className={`h-6 w-6 ${s <= stars ? "text-sun fill-sun" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          <p className="mt-2 text-sm">Moves: <strong>{moves}</strong></p>
          <p className="text-sm">Time: <strong>{formatTime(timer)}</strong></p>

          {/* XP Earned */}
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-sun/20 text-sun-foreground px-3 py-1 text-sm font-bold">
            <Sparkles className="h-3.5 w-3.5" /> +{xpAmount} XP earned
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <button onClick={() => { restart(); playClick(); }} className="rounded-full bg-primary text-primary-foreground font-bold px-5 py-2 text-sm inline-flex items-center gap-2 shadow-soft hover:scale-105 transition-transform">
              <RotateCcw className="h-4 w-4" /> Play Again
            </button>
            <button onClick={() => { playClick(); onBack(); }} className="rounded-full bg-surface border border-border font-bold px-5 py-2 text-sm hover:bg-accent transition-colors">
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(timer)}</span>
        <span className="font-bold text-sun-foreground">{xpState.totalXP} XP</span>
        <span>Moves: {moves}</span>
        <span>Matched: {matched.length / 2} / {pairs}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => {
          const isSelected = selected.includes(card.id);
          const isMatched = matched.includes(card.id);
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={isMatched}
              className={`aspect-square rounded-2xl border text-xs font-bold flex items-center justify-center text-center p-2 transition-all ${
                isMatched ? "bg-mint/20 border-mint/30 text-mint-foreground opacity-60" :
                isSelected ? "bg-primary text-primary-foreground border-primary scale-105" :
                "bg-surface border-border hover:bg-accent hover:border-foreground/30"
              }`}
            >
              {isMatched ? "✓" : card.text.length > 12 ? card.text.slice(0, 11) + "…" : card.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function shuffleCards(pairs: MatchPair[]): Card[] {
  const cards: Card[] = [];
  pairs.forEach((p, i) => {
    cards.push({ id: `w-${i}`, text: p.word, pairId: `pair-${i}`, side: "word" });
    cards.push({ id: `t-${i}`, text: p.translation, pairId: `pair-${i}`, side: "translation" });
  });
  return cards.sort(() => Math.random() - 0.5);
}