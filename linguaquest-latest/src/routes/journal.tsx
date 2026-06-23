import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Save, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LANGUAGES, type LanguageCode } from "@/data/mock";
import { getLanguage } from "@/lib/sessions";
import { getJournalEntries, saveJournalEntry, deleteJournalEntry, generateId, type JournalEntry } from "@/data/journal";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Writing Journal — Ujuziverse" },
      { name: "description", content: "Practice writing with free-form journal entries." },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [language, setLanguageState] = useState<LanguageCode>(() => getLanguage());

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  function refresh() {
    setEntries(getJournalEntries());
  }

  function startNew() {
    setEditing({ id: "", title: "", text: "", language, createdAt: "", updatedAt: "" });
    setTitle("");
    setText("");
  }

  function startEdit(entry: JournalEntry) {
    setEditing(entry);
    setTitle(entry.title);
    setText(entry.text);
    setLanguageState(entry.language as LanguageCode);
  }

  function save() {
    if (!title.trim() || !text.trim()) return;
    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: editing?.id || generateId(),
      title: title.trim(),
      text: text.trim(),
      language,
      createdAt: editing?.createdAt || now,
      updatedAt: now,
    };
    saveJournalEntry(entry);
    setEditing(null);
    refresh();
  }

  function remove(id: string) {
    deleteJournalEntry(id);
    if (editing?.id === id) setEditing(null);
    refresh();
  }

  function cancel() {
    setEditing(null);
  }

  const PROMPTS = [
    "Describe your favourite place in the world.",
    "What did you do yesterday? Write 4 sentences.",
    "If you could be any animal, what would you be and why?",
    "Write about your best friend.",
    "What do you want to be when you grow up?",
    "Describe a tradition in your family.",
    "Write a short story about a magical door.",
    "What is something new you learned this week?",
    "Describe your dream school.",
    "Write a letter to your future self.",
  ];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <div className="mt-6 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>

        <section className="mt-4 relative overflow-hidden rounded-3xl gradient-berry text-white p-6 shadow-soft">
          <div className="absolute right-5 top-5 text-4xl animate-bob">✍️</div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">Writing Journal</p>
          <h1 className="text-display text-3xl sm:text-4xl mt-1">Write freely</h1>
          <p className="mt-2 text-white/90 max-w-lg">Practice writing in your target language. Your journal is saved locally.</p>
        </section>

        {editing ? (
          <section className="mt-6 surface-card p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguageState(l.code)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-bold transition-colors ${
                    language === l.code
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface border-border hover:bg-accent"
                  }`}
                >
                  <span>{l.flag}</span>
                  {l.nativeLabel}
                </button>
              ))}
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title…"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-lg font-bold outline-none focus:ring-2 focus:ring-primary/40"
              aria-label="Entry title"
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your journal entry here…"
              rows={10}
              maxLength={5000}
              className="mt-3 w-full resize-y rounded-2xl border border-border bg-background p-4 text-[15px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40"
              aria-label="Journal text"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{text.length} / 5000</span>
              <div className="flex gap-2">
                <button onClick={cancel} className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold hover:bg-accent">
                  Cancel
                </button>
                <button onClick={save} disabled={!title.trim() || !text.trim()} className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground font-bold px-4 py-2 text-sm shadow-pop hover:scale-105 transition-transform disabled:opacity-50">
                  <Save className="h-4 w-4" /> Save
                </button>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{entries.length} entries</p>
              <button onClick={startNew} className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground font-bold px-4 py-2 text-sm shadow-pop hover:scale-105 transition-transform">
                <Plus className="h-4 w-4" /> New entry
              </button>
            </section>

            {entries.length === 0 && (
              <section className="mt-8 surface-card p-8 text-center">
                <p className="text-4xl mb-2">📝</p>
                <p className="text-muted-foreground">No journal entries yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Try one of these prompts:</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {PROMPTS.slice(0, 4).map((p, i) => (
                    <button
                      key={i}
                      onClick={() => { startNew(); setText(p); setTitle(p.split(".")[0]); }}
                      className="rounded-full bg-muted/60 text-xs font-bold px-3 py-1.5 hover:bg-accent text-left"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {entries.length > 0 && (
              <section className="mt-4 space-y-3">
                {entries.map((entry) => (
                  <div key={entry.id} className="surface-card p-4 border border-border/60">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-display text-lg truncate">{entry.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(entry.updatedAt).toLocaleDateString()} · {entry.language}
                          {entry.createdAt !== entry.updatedAt && " (edited)"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{entry.text}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => startEdit(entry)} className="h-8 w-8 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-accent" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => remove(entry.id)} className="h-8 w-8 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-coral/15 hover:text-coral" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
