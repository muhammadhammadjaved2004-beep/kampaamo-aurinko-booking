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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, customerName, customerEmail, serviceName, bookingDate, bookingTime }: BookingConfirmationRequest = await req.json();

    if (!customerEmail || !customerName || !serviceName || !bookingDate || !bookingTime) {
      throw new Error("Missing required fields");
    }

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
              <p>Hei <strong>${customerName}</strong>,</p>
              <p>Kiitos ajanvarauksestasi! Varauksesi on vastaanotettu ja odotamme sinua.</p>
              
              <div class="booking-details">
                <h3>📅 Varauksen tiedot</h3>
                <div class="detail-row">
                  <span class="detail-label">Palvelu:</span>
                  <span class="detail-value">${serviceName}</span>
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
    console.log("Booking confirmation email sent:", emailResult);

    if (!emailResponse.ok) {
      throw new Error(emailResult.message || "Failed to send email");
    }

    // Update booking to mark confirmation as sent
    if (bookingId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      await supabase
        .from("bookings")
        .update({ confirmation_sent: true, status: 'confirmed' })
        .eq("id", bookingId);
    }

    return new Response(JSON.stringify({ success: true, data: emailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending booking confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
