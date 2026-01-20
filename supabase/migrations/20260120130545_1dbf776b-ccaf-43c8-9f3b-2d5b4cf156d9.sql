-- Create sessions table for server-side session management
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_sessions_hash ON public.sessions(session_hash);
CREATE INDEX idx_sessions_expires ON public.sessions(expires_at);

-- Enable RLS and deny all direct access (only via service role)
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny all direct access to sessions" ON public.sessions
FOR ALL USING (false);

-- Add session_uuid foreign key to ai_consultations
ALTER TABLE public.ai_consultations
ADD COLUMN session_uuid UUID REFERENCES public.sessions(id) ON DELETE CASCADE;

CREATE INDEX idx_ai_consultations_session_uuid ON public.ai_consultations(session_uuid);

-- Create cleanup function for expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.sessions WHERE expires_at < now();
END;
$$;