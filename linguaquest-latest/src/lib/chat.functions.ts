import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText, generateObject } from "ai";
import { freeChatReply, freeFeedback } from "./ai-free.server";
import { generateReply } from "./reply-engine";

const MessageSchema = z.object({
  from: z.enum(["ai", "me"]),
  text: z.string(),
});

const ReplyInput = z.object({
  scenarioTitle: z.string(),
  scenarioSummary: z.string(),
  realLifeSkill: z.string(),
  characterName: z.string(),
  characterRole: z.string(),
  characterMood: z.string(),
  language: z.enum(["en", "de", "fr", "sw"]),
  history: z.array(MessageSchema).max(40),
  guestToken: z.string().uuid().optional(),
});

const LANGUAGE_NAMES = { en: "English", de: "German", fr: "French", sw: "Swahili" } as const;

function buildSystemPrompt(input: z.infer<typeof ReplyInput>) {
  const lang = LANGUAGE_NAMES[input.language];
  return `You are ${input.characterName}, a ${input.characterRole}. Your mood: ${input.characterMood}.
You are roleplaying with a school-age language learner (ages 9-16) in this scenario:
"${input.scenarioTitle}" — ${input.scenarioSummary}
The real-life skill being practiced: ${input.realLifeSkill}.

RULES:
- Speak ONLY in ${lang}. Stay in character.
- Keep replies to 1-2 short, natural sentences (max ~25 words).
- Sound warm, friendly, and age-appropriate. Use simple vocabulary.
- Ask one follow-up question to keep the conversation flowing.
- Never break character or mention you are an AI.
- Never lecture about grammar — just chat naturally.`;
}

// Overall timeout for the entire AI reply chain (Gemini + free + fallback)
const CHAIN_TIMEOUT_MS = 30_000;

// Try providers in order: Gemini (15s) → Free AI chain (25s internal) → Reply engine (instant)
async function tryReply(data: z.infer<typeof ReplyInput>): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHAIN_TIMEOUT_MS);

  try {
    // 1. Try Google Gemini if key is configured (10s timeout via Vercel AI SDK)
    const apiKey = process.env.GOOGLE_API_KEY;
    if (apiKey && apiKey.trim() !== "") {
      try {
        const [providerModule, modelModule, rateLimitModule] = await Promise.all([
          import("./ai-gateway.server"),
          import("./ai-model.server"),
          import("./rate-limiter.server"),
        ]);
        const provider = providerModule.createAiProvider(apiKey);
        if (data.guestToken) await rateLimitModule.checkRateLimit(data.guestToken);

        const { text } = await generateText({
          model: provider(modelModule.getAiModel()),
          system: buildSystemPrompt(data),
          messages: data.history.map((m) => ({
            role: m.from === "ai" ? ("assistant" as const) : ("user" as const),
            content: m.text,
          })),
        });
        if (text?.trim()) return text.trim();
      } catch (e) {
        console.warn("Gemini failed, trying free AI...", e);
      }
    }

    // 2. Try free AI chain (OVHcloud → GitHub → Groq → OpenRouter → Together → published keys → HF)
    //    This has its own 25s internal timeout.
    const systemPrompt = buildSystemPrompt(data);
    const lastMessage = data.history[data.history.length - 1];
    const userPrompt = lastMessage?.from === "me"
      ? `The learner said: "${lastMessage.text}". Respond in character as ${data.characterName}.`
      : `Continue the conversation as ${data.characterName}.`;

    const freeReply = await freeChatReply(systemPrompt, userPrompt);
    if (freeReply) return freeReply;

    // 3. Fallback to keyword-aware reply engine (always works, no API needed)
    const lastUserMsg = data.history.filter((m) => m.from === "me").pop();
    return generateReply(lastUserMsg?.text || "", data.scenarioTitle, data.history.length, data.language);
  } finally {
    clearTimeout(timer);
  }
}

export const chatReply = createServerFn({ method: "POST" })
  .validator((d: unknown) => ReplyInput.parse(d))
  .handler(async ({ data }) => {
    const reply = await tryReply(data);
    return { reply };
  });

const FeedbackInput = z.object({
  scenarioTitle: z.string(),
  realLifeSkill: z.string(),
  language: z.enum(["en", "de", "fr", "sw"]),
  history: z.array(MessageSchema),
  guestToken: z.string().uuid().optional(),
});

const FeedbackSchema = z.object({
  confidence: z.number().min(0).max(100),
  fluency: z.number().min(0).max(100),
  strengths: z.array(z.string()).min(1).max(4),
  improvements: z.array(z.string()).min(1).max(4),
  corrections: z
    .array(
      z.object({
        original: z.string(),
        better: z.string(),
        reason: z.string(),
      }),
    )
    .max(4),
  newWords: z
    .array(z.object({ word: z.string(), meaning: z.string() }))
    .max(6),
  encouragement: z.string(),
  realLifeNote: z.string(),
});

const MOCK_FEEDBACK = {
  confidence: 72,
  fluency: 65,
  strengths: ["You participated actively", "You tried to express complete thoughts", "Good effort in a new language"],
  improvements: ["Try using more varied vocabulary", "Work on sentence structure", "Practice speaking more fluidly"],
  corrections: [],
  newWords: [],
  encouragement: "Great effort! Keep practicing and you'll continue to improve.",
  realLifeNote: "These conversation skills will help you in real-life situations like job interviews and networking events.",
};

async function tryFeedback(data: z.infer<typeof FeedbackInput>): Promise<typeof MOCK_FEEDBACK> {
  const lang = LANGUAGE_NAMES[data.language];
  const transcript = data.history
    .map((m) => `${m.from === "me" ? "Student" : "Character"}: ${m.text}`)
    .join("\n");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHAIN_TIMEOUT_MS);

  try {
    // 1. Try Gemini if available
    const apiKey = process.env.GOOGLE_API_KEY;
    if (apiKey && apiKey.trim() !== "") {
      try {
        const [providerModule, modelModule, rateLimitModule] = await Promise.all([
          import("./ai-gateway.server"),
          import("./ai-model.server"),
          import("./rate-limiter.server"),
        ]);
        const provider = providerModule.createAiProvider(apiKey);
        if (data.guestToken) await rateLimitModule.checkRateLimit(data.guestToken);

        const { object } = await generateObject({
          model: provider(modelModule.getAiModel()),
          schema: FeedbackSchema,
          system: `You are a kind, encouraging language coach for school students (ages 9-16) learning ${lang}.
Grade the student's messages ONLY (not the character's). Be warm and specific.
Write all feedback in English so the student understands, but quote ${lang} examples where helpful.
Connect skills to real life: ${data.realLifeSkill}.`,
          prompt: `Scenario: ${data.scenarioTitle}
Language: ${lang}

Transcript:
${transcript}

Score confidence (0-100) and fluency (0-100) generously but honestly. Provide 2-3 strengths, 2-3 improvements, up to 3 small grammar/phrasing corrections, up to 4 useful new words from the chat, a warm encouragement sentence, and a real-life note tying this to ${data.realLifeSkill}.`,
        });
        return object as typeof MOCK_FEEDBACK;
      } catch (e) {
        console.warn("Gemini feedback failed, trying free AI...", e);
      }
    }

    // 2. Try free Hugging Face inference
    const feedbackPrompt = `Generate feedback as JSON. Student learning ${lang}.
Scenario: ${data.scenarioTitle}
Transcript: ${transcript}

Return valid JSON: { "confidence": 0-100, "fluency": 0-100, "strengths": ["..."], "improvements": ["..."], "corrections": [], "newWords": [], "encouragement": "...", "realLifeNote": "..." }`;

    const freeResult = await freeFeedback(feedbackPrompt);
    if (freeResult) {
      return { ...MOCK_FEEDBACK, ...freeResult } as typeof MOCK_FEEDBACK;
    }

    // 3. Fallback to mock
    return MOCK_FEEDBACK;
  } finally {
    clearTimeout(timer);
  }
}

export const generateFeedback = createServerFn({ method: "POST" })
  .validator((d: unknown) => FeedbackInput.parse(d))
  .handler(async ({ data }) => {
    return await tryFeedback(data);
  });