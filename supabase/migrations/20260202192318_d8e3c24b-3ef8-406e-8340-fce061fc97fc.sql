-- Update the bookings SELECT policy to only allow public users to see booking date/time
-- while admins can see all booking details

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Public can check slot availability" ON public.bookings;

-- Create a more restrictive policy for public slot availability checking
-- This uses a security definer function to limit what anonymous users can see
CREATE OR REPLACE FUNCTION public.get_booked_slots(check_date date)
RETURNS TABLE(booking_time time) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT booking_time 
  FROM public.bookings 
  WHERE booking_date = check_date 
    AND status NOT IN ('cancelled')
$$;

-- Allow public to use the function for availability checking
GRANT EXECUTE ON FUNCTION public.get_booked_slots(date) TO anon;
GRANT EXECUTE ON FUNCTION public.get_booked_slots(date) TO authenticated;

-- Create policy that only allows admins to SELECT all booking data
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add policies to user_roles to prevent unauthorized role manipulation
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));