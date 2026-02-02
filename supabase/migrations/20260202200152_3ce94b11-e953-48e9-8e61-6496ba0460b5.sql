-- Drop the existing INSERT policy 
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create a PERMISSIVE INSERT policy that allows anyone to create bookings
-- Note: Using AS PERMISSIVE explicitly (default behavior but being explicit)
CREATE POLICY "Anyone can create bookings"
ON public.bookings
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);