-- Clean up: Remove the public INSERT policy since we now use RPC for booking creation
-- This improves security as bookings can only be created through the validated RPC function
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;