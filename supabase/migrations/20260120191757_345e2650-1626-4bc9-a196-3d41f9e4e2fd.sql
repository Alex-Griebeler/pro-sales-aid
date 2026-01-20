-- Fix 1: Add PERMISSIVE SELECT policy so authenticated users can read their own profile
-- (The existing RESTRICTIVE policy alone blocks all access - need a PERMISSIVE grant)
CREATE POLICY "Allow authenticated users to view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Fix 2: Add INSERT policy to restrict profile creation to authenticated users only
-- Profile creation should only happen via the handle_new_user trigger (service role)
-- But we add a policy for authenticated users creating their own profile as a fallback
CREATE POLICY "Allow authenticated users to insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);