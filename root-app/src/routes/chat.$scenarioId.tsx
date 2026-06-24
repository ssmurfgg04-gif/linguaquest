import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, Mic, Send, Sparkles, Lightbulb, Loader2 } from "lucide-react";
import { z } from "zod";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { CHARACTER_BY_ID, LANGUAGE_LABEL, SCENARIO_BY_ID, type Character } from "@/data/mock";
import { chatReply, generateFeedback } from "@/lib/chat.functions";
import {
  createSession,
  finishSession,
  getGuestToken,
  getLanguage,
  saveFeedback,
  saveMessage,
} from "@/lib/sessions";
import { isSpeechSupported, startListening, speakText, loadBrowserVoices } from "@/lib/voice";
import { generateOpener, generateReply } from "@/lib/reply-engine";
import { trackWeeklyActivity } from "@/lib/weekly-goals";
import { addXP } from "@/lib/xp-system";

const searchSchema = z.object({
  mode: z.enum(["voice", "text"]).default("text"),
});

type UiMessage = { id: string; from: "ai" | "me"; text: string; hint?: string };

export const Route = createFileRoute("/chat/$scenarioId")({
  validateSearch: searchSchema,
  head: ({ params }) => {
    const s = SCENARIO_BY_ID[params.scenarioId];
    return {
      meta: [
        { title: s ? `Chat: ${s.title} — Ujuziverse` : "Chat — Ujuziverse" },
        { name: "description", content: s?.summary ?? "Practice a real-life conversation." },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Scenario not found.
    </div>
  ),
  loader: ({ params }) => {
    const scenario = SCENARIO_BY_ID[params.scenarioId];
    if (!scenario) throw notFound();
    return { scenario };
  },
  component: ChatScreen,
});

function ChatScreen() {
  const { scenario } = Route.useLoaderData() as { scenario: NonNullable<typeof SCENARIO_BY_ID[string]> };
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const character = CHARACTER_BY_ID[scenario.characterId];

  const [language] = useState(() => getLanguage());
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const stopListeningRef = useRef<(() => void) | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Ref to always hold the latest send function — avoids stale closure in voice recording callback
  const sendRef = useRef<(text?: string) => Promise<void>>(async () => {});

  // Init session and AI opener
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let sid: string | null = null;
      try {
        const id = await createSession({
          scenarioId: scenario.id,
          characterId: scenario.characterId,
          language,
          mode,
        });
        if (cancelled) return;
        sid = id;
        setSessionId(id);

        // Get AI opener — try server, then reply engine
        setIsAiTyping(true);
        let openerText: string | null = null;

        try {
          const { reply } = await chatReply({
            data: {
              scenarioTitle: scenario.title,
              scenarioSummary: scenario.summary,
              realLifeSkill: scenario.realLifeSkill,
              characterName: character.name,
              characterRole: character.role,
              characterMood: character.mood,
              language,
              guestToken: getGuestToken(),
              history: [{ from: "me", text: "(start the conversation with a warm greeting)" }],
            },
          });
          openerText = reply;
        } catch {}

        openerText = openerText || generateOpener(scenario.title, language);
        if (cancelled) return;
        const aiMsg: UiMessage = { id: `ai-${Date.now()}`, from: "ai", text: openerText };
        setMessages([aiMsg]);
        setIsAiTyping(false);
        if (sid) saveMessage({ sessionId: sid, from: "ai", text: aiMsg.text }).catch(() => {});
      } catch (err) {
        console.error("Session init failed, using local fallback:", err);
        if (!cancelled) {
          const fallbackId = crypto.randomUUID();
          sid = fallbackId;
          setSessionId(fallbackId);
          const fb: UiMessage = { id: `ai-${Date.now()}`, from: "ai", text: generateOpener(scenario.title, language) };
          setMessages([fb]);
          setIsAiTyping(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isAiTyping]);

  useEffect(() => {
    inputRef.current?.focus();
    // Cleanup voice recording listener on unmount
    return () => {
      stopListeningRef.current?.();
      stopListeningRef.current = null;
    };
  }, []);

  const send = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? "").trim();
    if (!text || !sessionId || isAiTyping) return;
    const my: UiMessage = { id: `m-${Date.now()}`, from: "me", text };
    // Build next message list and update state
    let nextMessages: UiMessage[] = [];
    setMessages((prev) => {
      nextMessages = [...prev, my];
      return nextMessages;
    });
    setInput("");
    setIsAiTyping(true);
    try { await saveMessage({ sessionId, from: "me", text }); } catch { /* db unavailable */ }

    try {
      let reply: string | null = null;

      // Try server AI chain (Gemini → OVHcloud → free keys → HuggingFace → reply engine)
      try {
        const { reply: serverReply } = await chatReply({
            data: {
              scenarioTitle: scenario.title,
              scenarioSummary: scenario.summary,
              realLifeSkill: scenario.realLifeSkill,
              characterName: character.name,
              characterRole: character.role,
              characterMood: character.mood,
              language,
              guestToken: getGuestToken(),
              history: nextMessages.map((m) => ({ from: m.from, text: m.text })),
            },
          });
          reply = serverReply;
        } catch {}

      reply = reply || generateReply(text, scenario.title, nextMessages.length, language);
      const ai: UiMessage = { id: `ai-${Date.now()}`, from: "ai", text: reply };
      setMessages((m) => [...m, ai]);
      try { await saveMessage({ sessionId, from: "ai", text: reply }); } catch { /* db unavailable */ }
    } catch (err) {
      console.error(err);
      const fallbackText = generateReply(text, scenario.title, nextMessages.length, language);
      setMessages((m) => [...m, { id: `ai-${Date.now()}`, from: "ai", text: fallbackText }]);
    } finally {
      setIsAiTyping(false);
      inputRef.current?.focus();
    }
  }, [sessionId, isAiTyping, scenario, character, language]);
  // Keep ref in sync so voice recording always uses the latest send
  sendRef.current = send;

  const finish = async () => {
    if (!sessionId || finishing) return;
    setFinishing(true);
    try {
      await finishSession(sessionId);
      // Track session toward weekly goals
      trackWeeklyActivity("session");
      addXP("chat.complete");
      const fb = await generateFeedback({
        data: {
          scenarioTitle: scenario.title,
          realLifeSkill: scenario.realLifeSkill,
          language,
          guestToken: getGuestToken(),
          history: messages.map((m) => ({ from: m.from, text: m.text })),
        },
      });
      await saveFeedback(sessionId, fb);
    } catch (err) {
      console.error(err);
      setSaveError("Feedback couldn't be saved");
    } finally {
      navigate({ to: "/feedback/$sessionId", params: { sessionId: sessionId! } });
    }
  };

  // Load browser TTS voices once on mount (fallback if cloud TTS unavailable)
  useEffect(() => { loadBrowserVoices().catch(() => {}); }, []);

  // Speak AI replies aloud in voice mode
  useEffect(() => {
    if (mode !== "voice" || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.from !== "ai" || typeof window === "undefined") return;
    speakText(last.text, language).catch(() => {});
  }, [messages, mode, language]);

  // Voice recording toggle — uses sendRef to avoid stale closures
  const toggleRecording = useCallback(() => {
    if (recording) {
      stopListeningRef.current?.();
      stopListeningRef.current = null;
      setRecording(false);
      return;
    }
    if (!isSpeechSupported()) {
      setVoiceError("Voice input needs Chrome or Edge. Switch to text mode.");
      return;
    }
    setVoiceError(null);
    const { stop, started } = startListening(
      language,
      (transcript) => {
        setRecording(false);
        setInput(transcript);
        // Use ref to always call the latest send — avoids stale closure bug
        const trimmed = transcript.trim();
        if (trimmed) {
          sendRef.current(trimmed).catch((err) => {
            console.error("Voice send failed:", err);
          });
        }
      },
      (err) => {
        setRecording(false);
        setVoiceError(err);
      },
    );
    stopListeningRef.current = stop;
    if (started) setRecording(true);
  }, [recording, language]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 h-16 flex items-center justify-between gap-3">
          <Link
            to="/scenarios/$scenarioId"
            params={{ scenarioId: scenario.id }}
            className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <CharacterAvatar character={character} size="sm" />
            <div className="leading-tight">
              <p className="text-sm font-bold">{character.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {scenario.title} · {LANGUAGE_LABEL[language]}
              </p>
            </div>
          </div>
          <button
            onClick={finish}
            disabled={finishing || messages.length < 2}
            className="rounded-full bg-primary text-primary-foreground font-bold text-sm px-4 py-2 shadow-soft hover:scale-105 transition-transform disabled:opacity-50"
          >
            {finishing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Finish"}
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-6 flex flex-col">
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-1 bg-muted rounded-full p-1 text-xs font-bold">
            <button
              onClick={() => navigate({ to: ".", search: { mode: "text" } })}
              className={`px-3 py-1.5 rounded-full ${mode === "text" ? "bg-surface shadow-soft" : "text-muted-foreground"}`}
            >
              💬 Text
            </button>
            <button
              onClick={() => navigate({ to: ".", search: { mode: "voice" } })}
              className={`px-3 py-1.5 rounded-full ${mode === "voice" ? "bg-surface shadow-soft" : "text-muted-foreground"}`}
            >
              🎤 Voice
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-2">
          <span className="text-[10px] font-bold text-mint bg-mint/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> AI ready
          </span>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.length === 0 && !isAiTyping && (
            <div className="text-center text-sm text-muted-foreground py-12">
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Setting up your chat…
            </div>
          )}
          {messages.map((msg) => (
            <Bubble key={msg.id} message={msg} character={character} />
          ))}
          {isAiTyping && <TypingBubble character={character} />}
        </div>

        {saveError && (
          <div className="mt-2 text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-1.5 text-center">
            {saveError}
          </div>
        )}
        {mode === "voice" ? (
          <VoiceBar recording={recording} onToggle={toggleRecording} voiceError={voiceError} characterName={character.name} />
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); send(input.trim()); }}
            className="mt-4 flex items-center gap-2 surface-card p-2 border border-border/60"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Reply to ${character.name}…`}
              className="flex-1 bg-transparent outline-none px-3 py-2 text-base"
            />
            <button
              type="submit"
              disabled={!input.trim() || isAiTyping}
              className="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft hover:scale-105 transition-transform disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

function Bubble({ message, character }: { message: UiMessage; character: Character }) {
  const isMe = message.from === "me";
  return (
    <div className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe && <CharacterAvatar character={character} size="sm" />}
      <div className={`max-w-[80%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={
            isMe
              ? "rounded-3xl rounded-br-md px-4 py-2.5 gradient-sunset text-white shadow-soft"
              : "rounded-3xl rounded-bl-md px-4 py-2.5 bg-surface border border-border shadow-card"
          }
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>
        {message.hint && (
          <div className="text-[11px] text-mint-foreground bg-mint/20 border border-mint/30 px-2 py-1 rounded-full inline-flex items-center gap-1">
            <Lightbulb className="h-3 w-3" /> {message.hint}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingBubble({ character }: { character: Character }) {
  return (
    <div className="flex gap-2">
      <CharacterAvatar character={character} size="sm" />
      <div className="rounded-3xl rounded-bl-md px-4 py-3 bg-surface border border-border shadow-card flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-muted-foreground animate-bob"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function VoiceBar({ recording, onToggle, voiceError, characterName }: { recording: boolean; onToggle: () => void; voiceError: string | null; characterName: string }) {
  const supported =
    typeof window !== "undefined" && isSpeechSupported();
  return (
    <div className="mt-4 surface-card p-6 flex flex-col items-center gap-3 border border-border/60">
      <p className="text-sm text-muted-foreground">
        {!supported
          ? "Voice input not supported on this browser."
          : recording
            ? `Listening… speak to ${characterName}`
            : "Tap the mic and start speaking"}
      </p>
      {voiceError && (
        <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-1.5 text-center max-w-xs">
          {voiceError}
        </p>
      )}
      <button
        onClick={onToggle}
        disabled={!supported}
        className="relative h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-pop hover:scale-105 transition-transform disabled:opacity-40"
        aria-label={recording ? "Stop recording" : "Start recording"}
      >
        {recording && <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />}
        <Mic className="h-8 w-8 relative" />
      </button>
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <Sparkles className="h-3 w-3" /> Browser voice — works in Chrome & Edge.
      </p>
    </div>
  );
}
