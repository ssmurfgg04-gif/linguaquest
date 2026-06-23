import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
const Input = z.object({
  guestToken: z.string().uuid(),
});

export const loadStatsFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("../integrations/supabase/client.server");

    const [sessionsRes, feedbackRes] = await Promise.all([
      supabaseAdmin
        .from("chat_sessions")
        .select("id, finished_at")
        .eq("guest_token", data.guestToken),
      supabaseAdmin
        .from("chat_feedback")
        .select("session_id, confidence, fluency"),
    ]);

    const sessionIds = (sessionsRes.data ?? []).map((s: any) => s.id);
    const feedbackForUser = (feedbackRes.data ?? []).filter((f: any) =>
      sessionIds.includes(f.session_id)
    );

    const sessions = sessionsRes.data ?? [];
    const totalSessions = sessions.length;

    let avgConfidence = 0;
    let avgFluency = 0;
    let totalStars = 0;
    if (feedbackForUser.length > 0) {
      avgConfidence = Math.round(feedbackForUser.reduce((a: number, b: any) => a + (b.confidence ?? 0), 0) / feedbackForUser.length);
      avgFluency = Math.round(feedbackForUser.reduce((a: number, b: any) => a + (b.fluency ?? 0), 0) / feedbackForUser.length);
      totalStars = Math.min(99, Math.round(avgConfidence / 5));
    }

    let streak = 0;
    const dates = sessions
      .filter((s: any) => s.finished_at)
      .map((s: any) => s.finished_at.slice(0, 10))
      .filter(Boolean);
    const uniqueDates = [...new Set(dates)].sort().reverse();
    if (uniqueDates.length > 0) {
      streak = 1;
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);
      if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
        streak = 0;
      } else {
        for (let i = 1; i < uniqueDates.length; i++) {
          const prev = new Date(uniqueDates[i - 1]);
          const curr = new Date(uniqueDates[i]);
          const diff = (prev.getTime() - curr.getTime()) / 86400_000;
          if (diff <= 1.5) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    return {
      sessions: totalSessions,
      stars: totalStars,
      streak,
      confidence: avgConfidence,
      fluency: avgFluency,
    };
  });
