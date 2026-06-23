
-- Tighten RLS: revoke blanket access. Server functions use service role (admin) and validate guest_token.
DROP POLICY IF EXISTS "Anyone can read sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can insert sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can update sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can delete sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public read sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public write sessions" ON public.chat_sessions;

DROP POLICY IF EXISTS "Anyone can read messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can update messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can delete messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Public read messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Public write messages" ON public.chat_messages;

DROP POLICY IF EXISTS "Anyone can read feedback" ON public.chat_feedback;
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.chat_feedback;
DROP POLICY IF EXISTS "Anyone can update feedback" ON public.chat_feedback;
DROP POLICY IF EXISTS "Anyone can delete feedback" ON public.chat_feedback;
DROP POLICY IF EXISTS "Public read feedback" ON public.chat_feedback;
DROP POLICY IF EXISTS "Public write feedback" ON public.chat_feedback;

-- Drop any remaining policies dynamically (covers any naming variants from prior migrations).
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('chat_sessions','chat_messages','chat_feedback')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Keep RLS enabled. With no policies, anon + authenticated have no direct access.
-- All access is mediated by server functions using the service role,
-- which validate guest_token / user_id before reading or writing.
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;

-- Authenticated owners can read their own sessions/messages/feedback directly (handy for future user-account features).
CREATE POLICY "Owners read own sessions"
  ON public.chat_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Owners read own messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.chat_sessions s
    WHERE s.id = chat_messages.session_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "Owners read own feedback"
  ON public.chat_feedback FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.chat_sessions s
    WHERE s.id = chat_feedback.session_id AND s.user_id = auth.uid()
  ));

-- Revoke direct anon/authenticated write privileges on these tables; service_role still has full access.
REVOKE INSERT, UPDATE, DELETE ON public.chat_sessions FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.chat_messages FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.chat_feedback FROM anon, authenticated;
REVOKE SELECT ON public.chat_sessions FROM anon;
REVOKE SELECT ON public.chat_messages FROM anon;
REVOKE SELECT ON public.chat_feedback FROM anon;
GRANT ALL ON public.chat_sessions TO service_role;
GRANT ALL ON public.chat_messages TO service_role;
GRANT ALL ON public.chat_feedback TO service_role;
