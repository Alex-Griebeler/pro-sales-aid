ALTER TABLE public.sessions
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);

