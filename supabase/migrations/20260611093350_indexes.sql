-- Add indexes for guest_token lookups used by stats and rate limiter
CREATE INDEX IF NOT EXISTS idx_chat_sessions_guest_token ON public.chat_sessions (guest_token);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_guest_token_finished ON public.chat_sessions (guest_token, finished_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id_created ON public.chat_messages (session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_session_id ON public.chat_feedback (session_id);
