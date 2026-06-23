import { serverError, ERROR_CODES } from "./app-error";

const MAX_REQUESTS_PER_HOUR = 50;

export async function checkRateLimit(guestToken: string): Promise<void> {
  const { supabaseAdmin } = await import("../integrations/supabase/client.server");
  const since = new Date(Date.now() - 3600_000).toISOString();

  const { data: sessions } = await supabaseAdmin
    .from("chat_sessions")
    .select("id")
    .eq("guest_token", guestToken);
  const ids = (sessions ?? []).map((s: any) => s.id);
  if (ids.length === 0) return;

  const { count, error } = await supabaseAdmin
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .in("session_id", ids)
    .eq("from_role", "me")
    .gte("created_at", since);
  if (error) throw new Error(error.message);
  if ((count ?? 0) >= MAX_REQUESTS_PER_HOUR) {
    serverError(ERROR_CODES.RATE_LIMITED, `Rate limit exceeded (${MAX_REQUESTS_PER_HOUR}/hour). Try again later.`);
  }
}
