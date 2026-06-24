import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const guestTokenSchema = z.string().uuid();

const createSessionInput = z.object({
  scenarioId: z.string().min(1).max(120),
  characterId: z.string().min(1).max(120),
  language: z.enum(["en", "de", "fr", "sw"]),
  mode: z.enum(["voice", "text"]),
  guestToken: guestTokenSchema,
});

export const createSessionFn = createServerFn({ method: "POST" })
  .inputValidator((data) => createSessionInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("chat_sessions")
      .insert({
        scenario_id: data.scenarioId,
        character_id: data.characterId,
        language: data.language,
        mode: data.mode,
        guest_token: data.guestToken,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

async function assertSessionOwnership(sessionId: string, guestToken: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("chat_sessions")
    .select("id, guest_token")
    .eq("id", sessionId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || data.guest_token !== guestToken) {
    throw new Error("Not authorized for this session");
  }
}

const saveMessageInput = z.object({
  sessionId: z.string().uuid(),
  guestToken: guestTokenSchema,
  from: z.enum(["ai", "me"]),
  text: z.string().min(1).max(4000),
  hint: z.string().max(500).optional(),
});

export const saveMessageFn = createServerFn({ method: "POST" })
  .inputValidator((data) => saveMessageInput.parse(data))
  .handler(async ({ data }) => {
    await assertSessionOwnership(data.sessionId, data.guestToken);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("chat_messages").insert({
      session_id: data.sessionId,
      from_role: data.from,
      text: data.text,
      hint: data.hint ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const finishSessionInput = z.object({
  sessionId: z.string().uuid(),
  guestToken: guestTokenSchema,
});

export const finishSessionFn = createServerFn({ method: "POST" })
  .inputValidator((data) => finishSessionInput.parse(data))
  .handler(async ({ data }) => {
    await assertSessionOwnership(data.sessionId, data.guestToken);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("chat_sessions")
      .update({ finished_at: new Date().toISOString() })
      .eq("id", data.sessionId);
    return { ok: true };
  });

const correctionSchema = z.object({
  original: z.string().max(500),
  better: z.string().max(500),
  reason: z.string().max(500),
});
const newWordSchema = z.object({
  word: z.string().max(120),
  meaning: z.string().max(500),
});

const saveFeedbackInput = z.object({
  sessionId: z.string().uuid(),
  guestToken: guestTokenSchema,
  feedback: z.object({
    confidence: z.number().min(0).max(100),
    fluency: z.number().min(0).max(100),
    strengths: z.array(z.string().max(500)).max(20),
    improvements: z.array(z.string().max(500)).max(20),
    corrections: z.array(correctionSchema).max(20),
    newWords: z.array(newWordSchema).max(30),
    encouragement: z.string().max(1000),
    realLifeNote: z.string().max(1000),
  }),
});

export const saveFeedbackFn = createServerFn({ method: "POST" })
  .inputValidator((data) => saveFeedbackInput.parse(data))
  .handler(async ({ data }) => {
    await assertSessionOwnership(data.sessionId, data.guestToken);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const fb = data.feedback;
    const { error } = await supabaseAdmin.from("chat_feedback").upsert({
      session_id: data.sessionId,
      confidence: Math.round(fb.confidence),
      fluency: Math.round(fb.fluency),
      strengths: fb.strengths,
      improvements: fb.improvements,
      corrections: fb.corrections,
      new_words: fb.newWords,
      encouragement: fb.encouragement,
      real_life_note: fb.realLifeNote,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const loadSessionInput = z.object({
  sessionId: z.string().uuid(),
  guestToken: guestTokenSchema,
});

export const loadSessionFn = createServerFn({ method: "POST" })
  .inputValidator((data) => loadSessionInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: session, error: sErr } = await supabaseAdmin
      .from("chat_sessions")
      .select("*")
      .eq("id", data.sessionId)
      .maybeSingle();
    if (sErr) throw new Error(sErr.message);
    if (!session || session.guest_token !== data.guestToken) {
      return { session: null, feedback: null, messages: [] as any[] };
    }
    const [feedback, messages] = await Promise.all([
      supabaseAdmin.from("chat_feedback").select("*").eq("session_id", data.sessionId).maybeSingle(),
      supabaseAdmin
        .from("chat_messages")
        .select("*")
        .eq("session_id", data.sessionId)
        .order("created_at"),
    ]);
    return {
      session,
      feedback: feedback.data,
      messages: messages.data ?? [],
    };
  });
