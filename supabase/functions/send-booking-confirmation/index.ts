import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BookingConfirmationRequest {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
}

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Max 5 emails per booking
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour window

function isRateLimited(bookingId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(bookingId);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(bookingId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }
  
  entry.count++;
  return false;
}

// Input validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
}

function isValidTime(time: string): boolean {
  const timeRegex = /^\d{2}:\d{2}$/;
  return timeRegex.test(time);
}

function sanitizeString(str: string, maxLength: number = 100): string {
  return str.slice(0, maxLength).replace(/[<>]/g, '');
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { bookingId, customerName, customerEmail, serviceName, bookingDate, bookingTime } = body as BookingConfirmationRequest;

    // Validate required fields
    if (!customerEmail || !customerName || !serviceName || !bookingDate || !bookingTime || !bookingId) {
      return new Response(
        JSON.stringify({ error: "Puuttuvat tiedot" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate input formats
    if (!isValidEmail(customerEmail)) {
      return new Response(
        JSON.stringify({ error: "Virheellinen sähköpostiosoite" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidUUID(bookingId)) {
      return new Response(
        JSON.stringify({ error: "Virheellinen varaus-ID" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidDate(bookingDate)) {
      return new Response(
        JSON.stringify({ error: "Virheellinen päivämäärä" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidTime(bookingTime)) {
      return new Response(
        JSON.stringify({ error: "Virheellinen kellonaika" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Rate limiting per booking
    if (isRateLimited(bookingId)) {
      return new Response(
        JSON.stringify({ error: "Liian monta pyyntöä" }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify booking exists and matches the provided details
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, customer_email, confirmation_sent")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: "Varausta ei löydy" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify email matches the booking
    if (booking.customer_email !== customerEmail) {
      return new Response(
        JSON.stringify({ error: "Sähköposti ei täsmää" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Don't resend if already confirmed (unless explicitly needed)
    if (booking.confirmation_sent) {
      return new Response(
        JSON.stringify({ success: true, message: "Vahvistus on jo lähetetty" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize display values
    const safeCustomerName = sanitizeString(customerName);
    const safeServiceName = sanitizeString(serviceName);

    // Format date for Finnish locale
    const formattedDate = new Date(bookingDate).toLocaleDateString('fi-FI', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send email using Resend API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Kampaamo Amarillo <onboarding@resend.dev>",
        to: [customerEmail],
        subject: "Ajanvarausvahvistus - Kampaamo Amarillo",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #D4A574 0%, #C9956C 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { background: #FDF8F3; padding: 30px; border: 1px solid #E8DDD4; }
              .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4A574; }
              .booking-details h3 { margin-top: 0; color: #8B6914; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
              .detail-label { font-weight: 600; color: #666; }
              .detail-value { color: #333; }
              .footer { background: #2C2C2C; color: #ccc; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>✂️ Kampaamo Amarillo</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Ajanvarausvahvistus</p>
            </div>
            <div class="content">
              <p>Hei <strong>${safeCustomerName}</strong>,</p>
              <p>Kiitos ajanvarauksestasi! Varauksesi on vastaanotettu ja odotamme sinua.</p>
              
              <div class="booking-details">
                <h3>📅 Varauksen tiedot</h3>
                <div class="detail-row">
                  <span class="detail-label">Palvelu:</span>
                  <span class="detail-value">${safeServiceName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Päivämäärä:</span>
                  <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Kellonaika:</span>
                  <span class="detail-value">${bookingTime}</span>
                </div>
              </div>

              <p><strong>📍 Osoite:</strong><br>
              Intiankatu 27 / Väinö Auerin katu 3<br>
              00560 Helsinki (Kumpula)</p>

              <p><strong>📞 Puhelin:</strong> 09 757 2117</p>

              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                Jos sinun tarvitsee perua tai siirtää aikaa, ota meihin yhteyttä puhelimitse mahdollisimman pian.
              </p>
            </div>
            <div class="footer">
              <p>Kampaamo Amarillo | Kumpula, Helsinki</p>
              <p style="font-size: 12px; opacity: 0.7;">Tämä on automaattinen viesti, älä vastaa tähän sähköpostiin.</p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Email send failed:", emailResult);
      return new Response(
        JSON.stringify({ error: "Sähköpostin lähetys epäonnistui" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update booking to mark confirmation as sent
    await supabase
      .from("bookings")
      .update({ confirmation_sent: true, status: 'confirmed' })
      .eq("id", bookingId);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in booking confirmation:", error);
    return new Response(
      JSON.stringify({ error: "Palvelinvirhe" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);