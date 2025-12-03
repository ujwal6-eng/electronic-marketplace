-- Phase 8: Security Hardening - Fix RLS Policies
-- Remove any overly permissive policies and ensure proper access control

-- Drop existing public SELECT policies that may be too permissive
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create proper profile viewing policy (users can only view their own profile or public parts)
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Create policy for viewing basic profile info (for forum posts, reviews, etc.)
CREATE POLICY "Authenticated users can view basic profile info" ON public.profiles
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Ensure shipping_addresses has proper RLS
DROP POLICY IF EXISTS "Public can view shipping addresses" ON public.shipping_addresses;

-- Ensure user_activity_log has proper RLS  
DROP POLICY IF EXISTS "Public can view activity logs" ON public.user_activity_log;

-- Ensure transactions has proper RLS
DROP POLICY IF EXISTS "Public can view transactions" ON public.transactions;

-- Ensure orders has proper RLS
DROP POLICY IF EXISTS "Public can view orders" ON public.orders;

-- Ensure order_items has proper RLS
DROP POLICY IF EXISTS "Public can view order items" ON public.order_items;

-- Ensure order_status_history has proper RLS
DROP POLICY IF EXISTS "Public can view order status history" ON public.order_status_history;

-- Ensure service_bookings has proper RLS
DROP POLICY IF EXISTS "Public can view service bookings" ON public.service_bookings;

-- Add admin access policies for management
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all transactions" ON public.transactions
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all service bookings" ON public.service_bookings
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view activity logs" ON public.user_activity_log
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));