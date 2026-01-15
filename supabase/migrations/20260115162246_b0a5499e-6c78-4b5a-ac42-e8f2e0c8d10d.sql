-- Drop existing overly permissive RLS policies
DROP POLICY IF EXISTS "Anyone can insert consultations" ON public.ai_consultations;
DROP POLICY IF EXISTS "Anyone can view consultations" ON public.ai_consultations;
DROP POLICY IF EXISTS "Anyone can update consultation ratings" ON public.ai_consultations;

-- Create restrictive policies that deny direct client access
-- All access must go through Edge Functions using service role key

-- No direct INSERT allowed (Edge Functions use service role key)
CREATE POLICY "Deny direct insert - use edge functions"
ON public.ai_consultations
FOR INSERT
WITH CHECK (false);

-- No direct SELECT allowed (Edge Functions use service role key)
CREATE POLICY "Deny direct select - use edge functions"
ON public.ai_consultations
FOR SELECT
USING (false);

-- No direct UPDATE allowed (Edge Functions use service role key)
CREATE POLICY "Deny direct update - use edge functions"
ON public.ai_consultations
FOR UPDATE
USING (false)
WITH CHECK (false);