import type { LanguageCode } from "@/data/mock";
import {
  createSessionFn,
  saveMessageFn,
  finishSessionFn,
  saveFeedbackFn,
  loadSessionFn,
} from "@/lib/sessions.functions";

const GUEST_KEY = "lq.guestToken";

export function getGuestToken(): string {
  if (typeof window === "undefined") return "00000000-0000-0000-0000-000000000000";
  let t = localStorage.getItem(GUEST_KEY);
  if (!t || !/^[0-9a-f-]{36}$/i.test(t)) {
    t = crypto.randomUUID();
    localStorage.setItem(GUEST_KEY, t);
  }
  return t;
}

const LANG_KEY = "lq.language";

export function getLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem(LANG_KEY) as LanguageCode) || "en";
}

export function setLanguage(code: LanguageCode) {
  if (typeof window !== "undefined") localStorage.setItem(LANG_KEY, code);
}

export async function createSession(args: {
  scenarioId: string;
  characterId: string;
  language: LanguageCode;
  mode: "voice" | "text";
}) {
  const res = await createSessionFn({
    data: { ...args, guestToken: getGuestToken() },
  });
  return res.id;
}

export async function saveMessage(args: {
  sessionId: string;
  from: "ai" | "me";
  text: string;
  hint?: string;
}) {
  await saveMessageFn({
    data: {
      sessionId: args.sessionId,
      guestToken: getGuestToken(),
      from: args.from,
      text: args.text,
      hint: args.hint,
    },
  });
}

export async function finishSession(sessionId: string) {
  await finishSessionFn({ data: { sessionId, guestToken: getGuestToken() } });
}

export async function saveFeedback(
  sessionId: string,
  fb: {
    confidence: number;
    fluency: number;
    strengths: string[];
    improvements: string[];
    corrections: { original: string; better: string; reason: string }[];
    newWords: { word: string; meaning: string }[];
    encouragement: string;
    realLifeNote: string;
  },
) {
  await saveFeedbackFn({
    data: { sessionId, guestToken: getGuestToken(), feedback: fb },
  });
}

export async function loadSessionWithFeedback(sessionId: string) {
  return await loadSessionFn({
    data: { sessionId, guestToken: getGuestToken() },
  });
}
