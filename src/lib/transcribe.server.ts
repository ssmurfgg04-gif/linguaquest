import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const OVH_BASE = "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1";
const WHISPER_MODEL = "whisper-large-v3";
const TIMEOUT_MS = 15_000;

const LANG_MAP: Record<string, string> = {
  en: "en",
  de: "de",
  fr: "fr",
  sw: "sw",
};

const TranscriptInput = z.object({
  audioBase64: z.string().min(1),
  mimeType: z.string().min(1),
  language: z.enum(["en", "de", "fr", "sw"]),
});

export const transcribeAudio = createServerFn({ method: "POST" })
  .validator((d: unknown) => TranscriptInput.parse(d))
  .handler(async ({ data }) => {
    const audioBuffer = Buffer.from(data.audioBase64, "base64");
    const langCode = LANG_MAP[data.language] ?? "en";
    const body = new FormData();
    body.append("file", new Blob([audioBuffer], { type: data.mimeType }), `audio.${data.mimeType.split("/")[1]?.split(";")[0] ?? "webm"}`);
    body.append("model", WHISPER_MODEL);
    body.append("language", langCode);
    body.append("response_format", "text");

    const headers: Record<string, string> = {};
    const apiKey = process.env.OVH_AI_ENDPOINTS_ACCESS_TOKEN;
    if (apiKey?.trim()) headers["Authorization"] = `Bearer ${apiKey}`;

    const res = await fetch(`${OVH_BASE}/audio/transcriptions`, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`Whisper ${res.status}: ${errBody.slice(0, 200)}`);
    }

    const text = await res.text();
    return { transcript: text.trim() };
  });
