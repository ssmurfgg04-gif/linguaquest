import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Brain, Sparkles, BookOpen, Smile, Target, Sun, Moon, BarChart3, ChevronRight, ChevronDown, ChevronUp, X, Check } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { toast } from "sonner";

const JOURNAL_KEY = "lq.mind.journal";
const MOOD_KEY = "lq.mood.history";

interface JournalEntry { id: string; date: string; text: string; mood?: number; }
interface MoodEntry { date: string; mood: number; }

function getJournal(): JournalEntry[] { try { return JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]"); } catch { return []; } }
function saveJournal(entries: JournalEntry[]) { localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries)); }
function getMoodHistory(): MoodEntry[] { try { return JSON.parse(localStorage.getItem(MOOD_KEY) || "[]"); } catch { return []; } }
function saveMoodHistory(history: MoodEntry[]) { localStorage.setItem(MOOD_KEY, JSON.stringify(history)); }

const TOPIC_CONTENT: Record<string, { tips: string[]; exercise: string; affirmations: string[] }> = {
  "Teen Psychology": {
    tips: [
      "It's normal to feel confused or overwhelmed sometimes — your brain is still developing!",
      "Talking about your feelings doesn't make you weak. It makes you self-aware.",
      "Social media often shows highlight reels, not real life. Don't compare your behind-the-scenes to someone else's stage.",
      "Sleep is not a luxury — teens need 8-10 hours for proper brain function and emotional regulation.",
      "If a friend tells you something private, keeping that trust is one of the most important things you can do.",
    ],
    exercise: "Write down one thing that made you smile today, even if it was small. Then write one thing that stressed you. Now circle which one you gave more attention to — and ask yourself: what if I flipped that balance tomorrow?",
    affirmations: ["My feelings are valid.", "I am learning who I am, and that takes time.", "I don't have to have everything figured out right now."],
  },
  "Self-worth": {
    tips: [
      "Your worth is not measured by likes, followers, or grades. You are valuable just as you are.",
      "Comparing yourself to others is like comparing your chapter 1 to someone else's chapter 20.",
      "When someone criticizes you, it's about THEIR perspective, not YOUR value.",
      "Saying 'no' to things that don't serve you is an act of self-respect, not selfishness.",
      "You deserve the same kindness you give to others — start giving it to yourself.",
    ],
    exercise: "Stand in front of a mirror. Say out loud: 'I am enough. I am growing. I matter.' Notice how your body feels. Do this every morning for a week and journal about what changes.",
    affirmations: ["I am worthy of love and respect.", "My value doesn't decrease because someone can't see it.", "I choose to believe in myself."],
  },
  "Emotional Intelligence": {
    tips: [
      "Name your emotions: 'I feel frustrated' is more powerful than 'I'm fine' when you're not.",
      "Between feeling something and reacting, there's a tiny pause. That pause is where your power lives.",
      "Other people's emotions are not your fault — but how you respond is your responsibility.",
      "Listening without planning your reply is one of the highest forms of respect.",
      "It's okay to feel angry. It's what you do with that anger that matters.",
    ],
    exercise: "Think of a recent situation that upset you. Write down: What happened? What did I feel? What did I do? Now ask: What could I have done differently? What would I tell a friend in the same situation?",
    affirmations: ["I can feel my feelings without being controlled by them.", "I choose how I respond.", "My emotions are signals, not commands."],
  },
  "Confidence Building": {
    tips: [
      "Confidence isn't about being the loudest in the room. It's about being comfortable with who you are.",
      "Your comfort zone is a beautiful place, but nothing ever grows there.",
      "Mistakes are proof that you're trying. Every expert was once a beginner.",
      "Body language affects how you feel: stand tall, shoulders back, chin up — even when nervous.",
      "Preparation builds confidence. The more you practice, the less you fear.",
    ],
    exercise: "Pick one small thing you've been avoiding because it feels scary. Break it into 3 tiny steps. Do just the FIRST step today — that's it. You don't have to finish. Starting IS the progress.",
    affirmations: ["I am capable of handling whatever comes my way.", "I give myself permission to be imperfect and still worthy.", "Every step forward counts, no matter how small."],
  },
  "Goal Setting": {
    tips: [
      "A dream without a plan is just a wish. Write your goals down — it makes them real.",
      "Break big goals into weekly milestones. Small wins keep motivation alive.",
      "Share your goals with one person you trust. Accountability increases follow-through by 65%.",
      "If you fail to plan, you plan to fail. But also: plans can change, and that's okay.",
      "Celebrate progress, not just completion. The journey IS the transformation.",
    ],
    exercise: "Write down ONE goal for this week. Make it specific: not 'study more' but 'study maths for 20 minutes every day before dinner.' Now write the SINGLE biggest thing that could stop you — and one strategy to handle it.",
    affirmations: ["I am committed to my goals.", "Obstacles are detours, not dead ends.", "I have the power to create change in my life."],
  },
  "Daily Affirmations": {
    tips: [
      "Affirmations rewire your brain over time. Repetition creates new neural pathways.",
      "Say them out loud — hearing your own voice makes them more powerful.",
      "The best time for affirmations is right after waking up or just before sleep.",
      "Combine affirmations with deep breathing: breathe in the belief, breathe out the doubt.",
      "Customize affirmations to YOUR life. Generic ones work, but personal ones hit deeper.",
    ],
    exercise: "Create 3 personal affirmations: one about who you ARE, one about what you CAN do, and one about what you DESERVE. Write them on a card and put it where you'll see it every day.",
    affirmations: ["I am becoming the best version of myself.", "Good things are flowing into my life.", "I trust the timing of my journey."],
  },
};

export const Route = createFileRoute("/ujuzimind")({
  head: () => ({
    meta: [
      { title: "UjuziMind — Mental Wellness & Growth | Ujuziverse" },
      { name: "description", content: "Mental wellness, confidence building, emotional intelligence, and personal growth tools." },
    ],
  }),
  component: UjuziMind,
});

const TOPICS = [
  { emoji: "🧠", title: "Teen Psychology", desc: "Understand your mind and emotions.", gradient: "gradient-ocean" },
  { emoji: "💖", title: "Self-worth", desc: "Build unshakeable self-esteem.", gradient: "gradient-sunset" },
  { emoji: "🧘", title: "Emotional Intelligence", desc: "Navigate emotions with confidence.", gradient: "gradient-berry" },
  { emoji: "💪", title: "Confidence Building", desc: "Step into your power.", gradient: "gradient-meadow" },
  { emoji: "🎯", title: "Goal Setting", desc: "Define and achieve your goals.", gradient: "gradient-ocean" },
  { emoji: "🌟", title: "Daily Affirmations", desc: "Start your day with positivity.", gradient: "gradient-sunset" },
];

const ALL_AFFIRMATIONS = [
  "You are capable of amazing things.",
  "Your voice matters. Use it.",
  "Every master was once a beginner.",
  "Growth begins outside your comfort zone.",
  "You belong in every room you enter.",
  "Africa's future starts with you.",
  "You are stronger than you think.",
  "Today is full of possibilities.",
  "Your potential is limitless.",
  "You deserve good things.",
  "Mistakes are proof you're trying.",
  "You are enough, just as you are.",
];

function UjuziMind() {
  const [mood, setMood] = useState<number | null>(null);
  const [journalText, setJournalText] = useState("");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [affirmation, setAffirmation] = useState(() => ALL_AFFIRMATIONS[Math.floor(Math.random() * ALL_AFFIRMATIONS.length)]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [affirmationLiked, setAffirmationLiked] = useState(false);
  const [moodSaved, setMoodSaved] = useState(false);

  useEffect(() => {
    setJournalEntries(getJournal());
    setMoodHistory(getMoodHistory());
  }, []);

  const handleMoodSelect = (i: number) => {
    setMood(i);
    setMoodSaved(false);
  };

  const saveMood = () => {
    if (mood === null) return;
    const today = new Date().toISOString().split("T")[0];
    const updated = moodHistory.filter((e) => e.date !== today);
    updated.push({ date: today, mood });
    saveMoodHistory(updated);
    setMoodHistory(updated);
    setMoodSaved(true);
    toast("Mood logged!", { description: "Tracking your feelings helps you understand yourself better." });
  };

  const saveJournalEntry = () => {
    if (!journalText.trim()) return;
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      text: journalText.trim(),
      mood: mood ?? undefined,
    };
    const updated = [entry, ...journalEntries];
    saveJournal(updated);
    setJournalEntries(updated);
    setJournalText("");
    toast("Reflection saved!", { description: "Your thoughts are saved. Come back anytime to review them." });
  };

  const deleteJournalEntry = (id: string) => {
    const updated = journalEntries.filter((e) => e.id !== id);
    saveJournal(updated);
    setJournalEntries(updated);
  };

  const newAffirmation = () => {
    setAffirmation(ALL_AFFIRMATIONS[Math.floor(Math.random() * ALL_AFFIRMATIONS.length)]);
    setAffirmationLiked(false);
  };

  const moodEmojis = ["😢", "😟", "😐", "🙂", "😄"];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-meadow text-white p-6 sm:p-10 shadow-soft">
          <div className="absolute right-5 top-5 text-5xl animate-bob">🧠</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">UjuziMind</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">Mental Wellness & Growth</h1>
          <p className="mt-2 text-white/85 max-w-lg">Build confidence, emotional intelligence, and a healthy mindset.</p>
        </section>

        {/* Daily Affirmation Card */}
        <div className="mt-6 surface-card p-6 rounded-2xl border border-border/60 text-center">
          <Sun className="h-8 w-8 text-sun-foreground mx-auto" />
          <p className="mt-3 text-lg font-bold italic">&ldquo;{affirmation}&rdquo;</p>
          <p className="text-xs text-muted-foreground mt-2">Daily Affirmation</p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={() => setAffirmationLiked(!affirmationLiked)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold border transition-all ${
                affirmationLiked ? "bg-coral/15 text-coral border-coral/30" : "bg-surface border-border hover:bg-accent"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${affirmationLiked ? "fill-current" : ""}`} />
              {affirmationLiked ? "Loved" : "Love this"}
            </button>
            <button
              onClick={newAffirmation}
              className="inline-flex items-center gap-1 rounded-full bg-surface border border-border px-3 py-1.5 text-xs font-bold hover:bg-accent transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" /> New one
            </button>
          </div>
        </div>

        {/* Explore Topics — now functional */}
        <section className="mt-8">
          <h2 className="text-display text-xl flex items-center gap-2"><Brain className="h-5 w-5 text-primary" /> Explore Topics</h2>
          <div className="mt-4 space-y-3">
            {TOPICS.map((t, i) => {
              const isExpanded = expandedTopic === t.title;
              const content = TOPIC_CONTENT[t.title];
              return (
                <div key={i} className={`rounded-2xl border overflow-hidden transition-all ${isExpanded ? "border-primary/40 shadow-pop" : "border-border/60"}`}>
                  <button
                    onClick={() => setExpandedTopic(isExpanded ? null : t.title)}
                    className={`w-full relative overflow-hidden ${t.gradient} text-white p-5 text-left transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{t.emoji}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{t.title}</h3>
                        <p className="text-xs text-white/80 mt-0.5">{t.desc}</p>
                      </div>
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </button>
                  {isExpanded && content && (
                    <div className="p-5 bg-surface space-y-5">
                      <div>
                        <h4 className="font-bold text-sm flex items-center gap-1.5 mb-2"><Sparkles className="h-4 w-4 text-sun-foreground" /> Tips</h4>
                        <ul className="space-y-2">
                          {content.tips.map((tip, ti) => (
                            <li key={ti} className="flex gap-2 text-sm text-muted-foreground">
                              <span className="text-primary font-bold shrink-0">{ti + 1}.</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl bg-muted/40 p-4">
                        <h4 className="font-bold text-sm flex items-center gap-1.5 mb-2"><Target className="h-4 w-4 text-coral" /> Try This Exercise</h4>
                        <p className="text-sm leading-relaxed">{content.exercise}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm flex items-center gap-1.5 mb-2"><Heart className="h-4 w-4 text-coral" /> Affirmations for This Topic</h4>
                        <div className="space-y-1.5">
                          {content.affirmations.map((a, ai) => (
                            <div key={ai} className="rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm italic text-foreground/80">
                              &ldquo;{a}&rdquo;
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Mood Tracker + Journal */}
        <section className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="surface-card p-6 rounded-2xl border border-border/60">
            <h3 className="font-bold flex items-center gap-2"><Smile className="h-5 w-5 text-sun-foreground" /> How are you feeling?</h3>
            <div className="flex gap-3 mt-4 justify-center">
              {moodEmojis.map((e, i) => (
                <button
                  key={i}
                  onClick={() => handleMoodSelect(i)}
                  className={`text-3xl p-2 rounded-xl transition-all ${mood === i ? "scale-125 bg-primary/10 ring-2 ring-primary" : "hover:scale-110"}`}
                >
                  {e}
                </button>
              ))}
            </div>
            {mood !== null && (
              <div className="mt-3 text-center">
                <p className="text-sm font-medium">{moodEmojis[mood]} {["Really struggling", "A bit down", "Okay", "Feeling good", "Amazing!"][mood]}</p>
                {!moodSaved && (
                  <button
                    onClick={saveMood}
                    className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground font-bold text-xs px-4 py-2 shadow-soft hover:scale-105 transition-transform"
                  >
                    <Check className="h-3 w-3" /> Save my mood
                  </button>
                )}
                {moodSaved && <p className="text-xs text-mint-foreground mt-2 font-bold">Saved! Track daily to see your patterns.</p>}
              </div>
            )}

            {/* Mood history mini chart */}
            {moodHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/40">
                <p className="text-xs font-bold text-muted-foreground mb-2">Recent moods</p>
                <div className="flex gap-1 flex-wrap">
                  {moodHistory.slice(-14).map((e, i) => (
                    <div key={i} className="text-lg" title={`${e.date}: ${moodEmojis[e.mood]}`}>
                      {moodEmojis[e.mood]}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="surface-card p-6 rounded-2xl border border-border/60">
            <h3 className="font-bold flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Reflection Journal</h3>
            <p className="text-sm text-muted-foreground mt-2">Write down your thoughts, goals, and reflections.</p>
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="What's on your mind today?"
              rows={3}
              className="mt-3 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
            <button
              onClick={saveJournalEntry}
              disabled={!journalText.trim()}
              className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground font-bold text-sm px-4 py-2 shadow-soft hover:scale-105 transition-transform disabled:opacity-50"
            >
              Save <ChevronRight className="h-3 w-3" />
            </button>

            {/* Show recent entries */}
            {journalEntries.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/40 space-y-2 max-h-48 overflow-y-auto">
                <p className="text-xs font-bold text-muted-foreground">Recent entries ({journalEntries.length})</p>
                {journalEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="rounded-xl bg-muted/40 p-3 group relative">
                    <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                    <p className="text-sm mt-0.5">{entry.text.length > 80 ? entry.text.slice(0, 80) + "..." : entry.text}</p>
                    <button
                      onClick={() => deleteJournalEntry(entry.id)}
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-surface border border-border flex items-center justify-center text-muted-foreground hover:text-coral hover:border-coral/30 opacity-0 group-hover:opacity-100 transition-all"
                      aria-label="Delete entry"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}