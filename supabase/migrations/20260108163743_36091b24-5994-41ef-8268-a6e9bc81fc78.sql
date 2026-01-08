-- Fix: Remove overly permissive INSERT policy and use service role bypass instead
-- The webhook will use service_role key which bypasses RLS
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;