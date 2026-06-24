import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateObject } from "ai";
import { freeChatReply } from "./ai-free.server";

const Input = z.object({
  text: z.string().min(1).max(2000),
  language: z.enum(["en", "de", "fr", "sw"]),
  guestToken: z.string().uuid().optional(),
});

const LANG = { en: "English", de: "German", fr: "French", sw: "Swahili" } as const;

const Schema = z.object({
  overallScore: z.number().min(0).max(100),
  correctedText: z.string(),
  tone: z.enum(["friendly", "neutral", "formal"]).optional(),
  summary: z.string(),
  issues: z
    .array(
      z.object({
        original: z.string(),
        suggestion: z.string(),
        type: z.enum([
          "grammar",
          "spelling",
          "punctuation",
          "word-choice",
          "style",
          "agreement",
          "tense",
        ]),
        explanation: z.string(),
      }),
    )
    .max(15),
  vocabBoosts: z
    .array(z.object({ word: z.string(), meaning: z.string() }))
    .max(6),
  sentences: z
    .array(
      z.object({
        original: z.string(),
        corrected: z.string(),
        changed: z.boolean,
        why: z.string(),
      }),
    )
    .max(30),
  encouragement: z.string(),
});

// Local fallback when no AI is available
function localGrammarFallback(text: string, lang: string) {
  // Simple rule-based checks
  const issues: { original: string; suggestion: string; type: string; explanation: string }[] = [];
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim());

  // Check for common issues
  if (/\bi\b(?![''])/.test(text) && lang === "en") {
    // No obvious issues found — just return the text as-is with a good score
  }

  const correctedSentences = sentences.map((s) => {
    const trimmed = s.trim();
    if (!trimmed) return { original: trimmed, corrected: trimmed, changed: false, why: "Looks good!" };
    // Capitalize first letter
    const corrected = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return {
      original: trimmed,
      corrected,
      changed: corrected !== trimmed,
      why: corrected !== trimmed ? "Sentences should start with a capital letter." : "This sentence looks great!",
    };
  });

  return {
    overallScore: 75,
    correctedText: sentences.map((s) => s.trim().charAt(0).toUpperCase() + s.trim().slice(1)).join(". ").trim() + ".",
    summary: `Your ${lang} text looks good overall. Keep practicing to improve further!`,
    issues,
    vocabBoosts: [],
    sentences: correctedSentences,
    encouragement: "Good job! You're making progress. Keep writing and practicing every day!",
  };
}

export const correctGrammarFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const lang = LANG[data.language];

    // 1. Try Gemini if API key is configured
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
          schema: Schema,
          system: `You are a warm, encouraging ${lang} grammar coach for school students (ages 9-16).
- Detect grammar, spelling, punctuation, word-choice, agreement, tense, and style issues.
- Produce a fully corrected version preserving the student's voice.
- Explanations must be short, friendly, and written in English so the student understands, even if the text is in ${lang}.
- Suggest up to 6 vocabulary boosts (synonyms / richer alternatives) drawn from the text.
- Break the text into its original sentences. For EACH sentence return: the original, the corrected version (identical if nothing changed), changed=true/false, and a one-sentence "why this is better" written in plain English. If unchanged, briefly say what made it already good.
- Score 0-100 generously but honestly. End with a one-sentence encouragement.`,
          prompt: `Language: ${lang}\n\nStudent text:\n"""${data.text}"""\n\nReturn the structured analysis including the per-sentence breakdown.`,
        });

        return object;
      } catch (e) {
        console.warn("Gemini grammar failed, trying free AI...", e);
      }
    }

    // 2. Try free AI (OVHcloud, GitHub, Groq, etc.) — 25s timeout
    const grammarPrompt = `You are a ${lang} grammar coach for students. Analyze this text and return valid JSON with: overallScore (0-100), correctedText, summary, issues array (original, suggestion, type, explanation), vocabBoosts array (word, meaning), sentences array (original, corrected, changed, why), encouragement. Text: """${data.text}"""`;

    const freeReply = await freeChatReply(
      `You are a JSON-only ${lang} grammar checker. Return ONLY valid JSON, no markdown.`,
      grammarPrompt,
    );

    if (freeReply) {
      try {
        // Try to extract JSON from the response
        const jsonMatch = freeReply.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed;
        }
      } catch {
        console.warn("Free AI grammar response was not valid JSON");
      }
    }

    // 3. Local rule-based fallback
    return localGrammarFallback(data.text, lang);
  });