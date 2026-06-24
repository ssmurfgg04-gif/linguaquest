
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  mode TEXT NOT NULL DEFAULT 'text',
  guest_token TEXT NOT NULL,
  user_id UUID,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);

CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  from_role TEXT NOT NULL CHECK (from_role IN ('ai','me')),
  text TEXT NOT NULL,
  audio_url TEXT,
  hint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.chat_feedback (
  session_id UUID NOT NULL PRIMARY KEY REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  confidence INT NOT NULL DEFAULT 0,
  fluency INT NOT NULL DEFAULT 0,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  improvements JSONB NOT NULL DEFAULT '[]'::jsonb,
  corrections JSONB NOT NULL DEFAULT '[]'::jsonb,
  new_words JSONB NOT NULL DEFAULT '[]'::jsonb,
  encouragement TEXT NOT NULL DEFAULT '',
  real_life_note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_guest ON public.chat_sessions(guest_token);
CREATE INDEX idx_messages_session ON public.chat_messages(session_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_sessions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_feedback TO anon, authenticated;
GRANT ALL ON public.chat_sessions, public.chat_messages, public.chat_feedback TO service_role;

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;

-- Permissive policies (guest mode). Security via unguessable session UUIDs + guest_token.
CREATE POLICY "open chat_sessions" ON public.chat_sessions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "open chat_messages" ON public.chat_messages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "open chat_feedback" ON public.chat_feedback FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
