-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  confirmation_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Services: Everyone can view active services (public facing)
CREATE POLICY "Anyone can view active services"
ON public.services FOR SELECT
USING (is_active = true);

-- Bookings: Anyone can create bookings (public booking form)
CREATE POLICY "Anyone can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (true);

-- Bookings: Customers can view their own booking by email (for confirmation page)
CREATE POLICY "Customers can view own bookings by email"
ON public.bookings FOR SELECT
USING (true);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for bookings updated_at
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default services
INSERT INTO public.services (name, description, price, duration_minutes, category) VALUES
('Miesten hiustenleikkaus', 'Klassinen miesten hiustenleikkaus', 25.00, 30, 'miehet'),
('Naisten hiustenleikkaus', 'Naisten hiustenleikkaus ja muotoilu', 45.00, 60, 'naiset'),
('Lasten hiustenleikkaus', 'Alle 12-vuotiaille', 20.00, 30, 'lapset'),
('Parranajo', 'Parranajo ja muotoilu', 15.00, 20, 'miehet'),
('Hiusten värjäys', 'Täysvärjäys', 65.00, 90, 'värjäys'),
('Raidat', 'Raidat ja sävytys', 85.00, 120, 'värjäys'),
('Kampaus', 'Juhlakampaus', 55.00, 60, 'kampaukset'),
('Föönaus', 'Pesu ja föönaus', 30.00, 30, 'naiset');