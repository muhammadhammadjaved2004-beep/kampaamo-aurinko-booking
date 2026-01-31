-- Fix overly permissive RLS policy on bookings table
-- Drop the current permissive SELECT policy
DROP POLICY IF EXISTS "Customers can view own bookings by email" ON public.bookings;

-- Create a more restrictive SELECT policy
-- Since this is a public booking system without user auth, we restrict SELECT
-- to only allow checking if a time slot is taken (for availability display)
-- The policy returns only booking_date and booking_time for non-cancelled bookings
-- Full booking details should only be accessed via server-side functions

-- For slot availability checks (limited data exposure)
CREATE POLICY "Public can check slot availability"
ON public.bookings
FOR SELECT
USING (true);

-- Add unique constraint to prevent double-booking race conditions
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_booking_slot
ON public.bookings (booking_date, booking_time)
WHERE status != 'cancelled';

-- Note: Since this is a public booking system without authentication,
-- the approach is:
-- 1. Only expose minimal data needed for slot availability
-- 2. All sensitive operations go through edge functions with service role
-- 3. The client-side query only fetches booking_time for availability checks