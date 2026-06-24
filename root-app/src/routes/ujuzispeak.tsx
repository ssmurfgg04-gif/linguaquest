import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Mic, MicOff, Star, Flame, Target, Loader2, Zap, History, Sparkles, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { USER_STATS } from "@/data/mock";
import { isSpeechSupported, startListening } from "@/lib/voice";
import { addXP, loadXPState, getLevelEmoji, getLevelName } from "@/lib/xp-system";
import { trackWeeklyActivity } from "@/lib/weekly-goals";
import { playClick, playCorrect, playXPGain, playStartRecording, playStopRecording, hapticMedium, hapticHeavy } from "@/lib/sound-effects";
import { XPPopup, Confetti } from "@/components/Confetti";

export const Route = createFileRoute("/ujuzispeak")({
  head: () => ({
    meta: [
      { title: "UjuziSpeak — AI Language Coach | Ujuziverse" },
      { name: "description", content: "Practice speaking with AI coaching. Improve pronunciation, grammar, confidence, and tone." },
    ],
  }),
  component: UjuziSpeak,
});

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "sw", label: "Swahili", flag: "🇹🇿" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
];

const TOPICS = [
  { emoji: "💼", label: "Job Interview" },
  { emoji: "📊", label: "Brand Pitch" },
  { emoji: "🎤", label: "Public Speaking" },
  { emoji: "📖", label: "Storytelling" },
  { emoji: "🤝", label: "Small Talk" },
  { emoji: "🎓", label: "Academic" },
];

interface PracticeEntry {
  id: string;
  date: string;
  language: string;
  topic: string;
  transcript: string;
  scores: { pronunciation: number; grammar: number; confidence: number; tone: number };
  averageScore: number;
}

const HISTORY_KEY = "lq.speak-history";

function loadHistory(): PracticeEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(entries: PracticeEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(-50)));
  } catch {}
}

function analyzeFeedback(transcript: string, lang: string): { pronunciation: number; grammar: number; confidence: number; tone: number } {
  if (!transcript.trim()) return { pronunciation: 50, grammar: 50, confidence: 50, tone: 50 };

  const words = transcript.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Pronunciation: based on length and completeness
  let pronunciation = 60 + Math.min(30, wordCount * 2);
  if (wordCount > 15) pronunciation += 5;
  if (wordCount > 25) pronunciation += 5;

  // Grammar: basic heuristics
  let grammar = 70;
  const hasPunctuation = /[.!?]$/.test(transcript.trim());
  const hasCapitalStart = /^[A-Z]/.test(transcript.trim());
  if (hasPunctuation) grammar += 5;
  if (hasCapitalStart) grammar += 5;
  if (wordCount >= 5) grammar += 5;
  if (wordCount >= 10) grammar += 5;

  // Confidence: based on word count and variety
  let confidence = 55 + Math.min(30, wordCount * 1.5);
  if (wordCount > 10) confidence += 5;

  // Tone: variety of words
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  let tone = 60 + Math.min(25, uniqueWords.size * 2);
  if (uniqueWords.size > 8) tone += 5;

  return {
    pronunciation: Math.min(98, Math.floor(pronunciation + (Math.random() * 6 - 3))),
    grammar: Math.min(98, Math.floor(grammar + (Math.random() * 6 - 3))),
    confidence: Math.min(98, Math.floor(confidence + (Math.random() * 6 - 3))),
    tone: Math.min(98, Math.floor(tone + (Math.random() * 6 - 3))),
  };
}

function UjuziSpeak() {
  const [lang, setLang] = useState("en");
  const [topic, setTopic] = useState(0);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<{ pronunciation: number; grammar: number; confidence: number; tone: number } | null>(null);
  const [aiMessage, setAiMessage] = useState("Hello! I'm your AI language coach. Choose a topic and start speaking. I'll help you improve.");
  const [loading, setLoading] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [history, setHistory] = useState<PracticeEntry[]>(loadHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpState, setXpState] = useState(loadXPState);
  const stopRef = useRef<(() => void) | null>(null);
  const [authUser, setAuthUser] = useState<{ name?: string; language?: string } | null>(null);

  useEffect(() => {
    try { const raw = localStorage.getItem("lq.auth"); if (raw) setAuthUser(JSON.parse(raw)); } catch {}
  }, []);

  const toggleListening = useCallback(() => {
    if (listening) {
      stopRef.current?.();
      stopRef.current = null;
      setListening(false);
      playStopRecording();
      if (transcript.trim()) {
        setLoading(true);
        setTimeout(() => {
          const scores = analyzeFeedback(transcript, lang);
          setFeedback(scores);

          // Generate contextual AI message
          const avg = (scores.pronunciation + scores.grammar + scores.confidence + scores.tone) / 4;
          if (avg >= 80) {
            setAiMessage("Excellent work! Your speaking is strong. Keep pushing for even better results!");
          } else if (avg >= 65) {
            setAiMessage("Good effort! Try speaking a bit more and using complete sentences to improve.");
          } else {
            setAiMessage("Nice start! Don't be shy — try longer sentences and keep practicing daily.");
          }

          // Save to history
          const entry: PracticeEntry = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            language: LANGUAGES.find(l => l.code === lang)?.label ?? lang,
            topic: TOPICS[topic].label,
            transcript,
            scores,
            averageScore: Math.round(avg),
          };
          const newHistory = [entry, ...loadHistory()];
          saveHistory(newHistory);
          setHistory(newHistory);

          // Award XP
          const result = addXP("speak.practice");
          setXpState(result.state);
          let totalXPGained = result.xpGained;
          if (avg >= 75) {
            const bonus = addXP("speak.great_score");
            setXpState(bonus.state);
            totalXPGained += bonus.xpGained;
            setXpAmount(totalXPGained);
          } else {
            setXpAmount(result.xpGained);
          }
          // Track toward weekly goals
          trackWeeklyActivity("xp", totalXPGained);
          setShowXP(true);
          playCorrect();
          hapticMedium();
          if (avg >= 90) {
            setShowConfetti(true);
            hapticHeavy();
            setTimeout(() => setShowConfetti(false), 3000);
          }
          setTimeout(() => setShowXP(false), 1500);

          setLoading(false);
        }, 1500);
      }
      return;
    }
    if (!isSpeechSupported()) {
      setVoiceError("Voice input needs Chrome or Edge. Try switching browsers.");
      return;
    }
    playStartRecording();
    hapticMedium();
    setVoiceError(null);
    setTranscript("");
    setFeedback(null);
    const { stop, started } = startListening(
      lang,
      (text) => {
        setListening(false);
        setTranscript(text);
      },
      (err) => {
        setListening(false);
        setVoiceError(err);
      },
    );
    stopRef.current = stop;
    if (started) setListening(true);
  }, [listening, transcript, lang, topic]);

  const clearHistory = () => {
    saveHistory([]);
    setHistory([]);
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <Confetti show={showConfetti} />
      <XPPopup xp={xpAmount} show={showXP} label="Speaking Practice!" />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <div className="mt-6 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <button
            onClick={() => { setShowHistory(!showHistory); playClick(); }}
            className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            <History className="h-4 w-4" /> {showHistory ? "Practice" : "History"} ({history.length})
          </button>
        </div>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-ocean text-white p-6 sm:p-10 shadow-soft">
          <div className="absolute right-5 top-5 text-5xl animate-bob">🎤</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">UjuziSpeak</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">AI Language Coach</h1>
          <p className="mt-2 text-white/85 max-w-lg">Practice speaking. Get instant AI feedback. Build confidence.</p>
        </section>

        {showHistory ? (
          /* Practice History View */
          <section className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-display text-lg flex items-center gap-2"><History className="h-5 w-5 text-primary" /> Practice History</h2>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-xs text-muted-foreground hover:text-coral flex items-center gap-1">
                  <Trash2 className="h-3 w-3" /> Clear
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="surface-card p-8 rounded-2xl border border-dashed text-center">
                <p className="text-3xl mb-2">🎤</p>
                <p className="font-bold text-sm">No practice sessions yet</p>
                <p className="text-xs text-muted-foreground mt-1">Start speaking to see your history here!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((entry) => (
                  <div key={entry.id} className="surface-card p-4 rounded-xl border border-border/60">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{entry.topic}</span>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{entry.language}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-sun fill-sun" />
                        <span className="text-xs font-bold text-sun-foreground">{entry.averageScore}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic line-clamp-1">"{entry.transcript}"</p>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {(["Pronunciation", "Grammar", "Confidence", "Tone"] as const).map((label, i) => {
                        const val = Object.values(entry.scores)[i];
                        return (
                          <div key={label}>
                            <div className="flex justify-between text-[10px] mb-0.5">
                              <span className="text-muted-foreground">{label.slice(0, 4)}</span>
                              <span className="font-bold">{val}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${val >= 80 ? "bg-mint-foreground" : val >= 65 ? "bg-sun" : "bg-coral"}`}
                                style={{ width: `${val}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 mt-2">{new Date(entry.date).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* Practice View */
          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            <aside className="lg:w-56 shrink-0">
              <div className="surface-card p-4 rounded-2xl border border-border/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Language</h3>
                <div className="space-y-1">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); playClick(); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                        lang === l.code ? "bg-primary/10 text-primary" : "hover:bg-accent text-muted-foreground"
                      }`}
                    >
                      <span>{l.flag}</span> {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="surface-card p-4 rounded-2xl border border-border/60 mt-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><span>{getLevelEmoji(xpState.level)}</span> Level</span>
                    <span className="font-bold">{xpState.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><Sparkles className="h-4 w-4 text-sun-foreground" /> XP</span>
                    <span className="font-bold">{xpState.totalXP}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><Flame className="h-4 w-4 text-coral" /> Streak</span>
                    <span className="font-bold">{xpState.streak || 0} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><Target className="h-4 w-4 text-primary" /> Confidence</span>
                    <span className="font-bold">{USER_STATS.confidence || 0}%</span>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {TOPICS.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTopic(i);
                      playClick();
                      setAiMessage(`Let's practice ${t.label.toLowerCase()}. Introduce yourself and describe your experience.`);
                      setFeedback(null);
                      setTranscript("");
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-bold transition-colors ${
                      topic === i ? "bg-primary text-primary-foreground border-primary" : "bg-surface border-border hover:bg-accent"
                    }`}
                  >
                    <span>{t.emoji}</span> {t.label}
                  </button>
                ))}
              </div>

              <div className="surface-card p-6 rounded-2xl border border-border/60">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full gradient-ocean text-white flex items-center justify-center text-lg shrink-0">🤖</div>
                  <div>
                    <p className="font-bold text-sm">AI Coach</p>
                    <p className="text-sm text-muted-foreground mt-1">{aiMessage}</p>
                  </div>
                </div>

                {transcript && (
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">👤</div>
                    <div>
                      <p className="font-bold text-sm">You</p>
                      <p className="text-sm text-muted-foreground mt-1 italic">"{transcript}"</p>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Loader2 className="h-4 w-4 animate-spin" /> Analyzing your speech…
                  </div>
                )}

                {feedback && (
                  <div className="mb-4 p-4 rounded-xl bg-surface border border-border/60">
                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><Star className="h-4 w-4 text-sun-foreground" /> Feedback</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Pronunciation", value: feedback.pronunciation },
                        { label: "Grammar", value: feedback.grammar },
                        { label: "Confidence", value: feedback.confidence },
                        { label: "Tone", value: feedback.tone },
                      ].map((f) => (
                        <div key={f.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{f.label}</span>
                            <span className="font-bold">{f.value}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${f.value >= 80 ? "bg-mint-foreground" : f.value >= 65 ? "bg-sun" : "bg-coral"}`}
                              style={{ width: `${f.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-4">
                  {voiceError && (
                    <p className="text-xs text-destructive text-center max-w-xs">{voiceError}</p>
                  )}
                  <button
                    onClick={toggleListening}
                    className={`h-16 w-16 rounded-full flex items-center justify-center transition-all shadow-soft ${
                      listening ? "bg-coral text-white scale-110 animate-pulse" : "bg-primary text-primary-foreground hover:scale-105"
                    }`}
                    aria-label={listening ? "Stop recording" : "Start recording"}
                  >
                    {listening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </button>
                </div>
                {listening && <p className="text-center text-xs text-coral font-bold mt-2 animate-pulse">Listening… Tap to stop</p>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}