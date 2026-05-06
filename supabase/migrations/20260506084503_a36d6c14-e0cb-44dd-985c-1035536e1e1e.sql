-- Restrictive policy on profiles: deny anon, only authenticated owner
CREATE POLICY "Restrict profiles to owner only"
ON public.profiles
AS RESTRICTIVE
FOR SELECT
TO public
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Restrictive policy on sessions: deny all direct access
CREATE POLICY "Restrict sessions - no direct access"
ON public.sessions
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- Restrictive policy on ai_consultations: deny all direct access
CREATE POLICY "Restrict ai_consultations - no direct access"
ON public.ai_consultations
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);