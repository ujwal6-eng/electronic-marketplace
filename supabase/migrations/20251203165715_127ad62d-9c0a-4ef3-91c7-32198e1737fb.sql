-- Phase 8: Additional Security Hardening

-- Fix user_roles - users should only see their own roles
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Fix user_statistics - users should only see their own stats
DROP POLICY IF EXISTS "Users can view all statistics" ON public.user_statistics;
DROP POLICY IF EXISTS "Public can view user statistics" ON public.user_statistics;
CREATE POLICY "Users can view own statistics" ON public.user_statistics
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all statistics" ON public.user_statistics
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Fix profiles - remove the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view basic profile info" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a more restrictive profile policy - users see own, sellers/technicians see public info for business
CREATE POLICY "Users can view profiles for business purposes" ON public.profiles
FOR SELECT USING (
  auth.uid() = id 
  OR public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.stores WHERE owner_id = profiles.id
  )
  OR EXISTS (
    SELECT 1 FROM public.technician_profiles WHERE user_id = profiles.id
  )
);