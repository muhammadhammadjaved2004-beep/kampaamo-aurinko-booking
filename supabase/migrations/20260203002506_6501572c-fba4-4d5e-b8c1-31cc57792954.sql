-- Drop the existing INSERT policy 
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create INSERT policy that allows PUBLIC (all roles including anon)
CREATE POLICY "Anyone can create bookings"
ON public.bookings
AS PERMISSIVE
FOR INSERT
TO PUBLIC
WITH CHECK (true);