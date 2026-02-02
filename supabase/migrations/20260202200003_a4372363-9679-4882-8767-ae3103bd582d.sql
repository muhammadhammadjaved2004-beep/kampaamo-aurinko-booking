-- Drop the existing INSERT policy 
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create a new INSERT policy that explicitly allows anonymous users
CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);