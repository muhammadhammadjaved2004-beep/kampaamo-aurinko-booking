-- Create a security definer function to insert bookings
-- This bypasses RLS and allows anonymous users to create bookings
CREATE OR REPLACE FUNCTION public.create_booking(
  p_service_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_booking_date date,
  p_booking_time time,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking_id uuid;
BEGIN
  INSERT INTO public.bookings (
    service_id,
    customer_name,
    customer_email,
    customer_phone,
    booking_date,
    booking_time,
    notes,
    status
  ) VALUES (
    p_service_id,
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_booking_date,
    p_booking_time,
    p_notes,
    'pending'
  )
  RETURNING id INTO v_booking_id;
  
  RETURN v_booking_id;
END;
$$;

-- Grant execute permission to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.create_booking TO anon;
GRANT EXECUTE ON FUNCTION public.create_booking TO authenticated;