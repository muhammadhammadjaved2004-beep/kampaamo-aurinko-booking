import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Calendar, Clock, User, Phone, Mail, Check, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Service = Tables<"services">;

// Generate available times
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 16) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Generate dates for next 2 weeks
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    // Skip Wednesdays (3) and Sundays (0)
    if (date.getDay() !== 0 && date.getDay() !== 3) {
      dates.push(date);
    }
  }
  return dates;
};

const availableDates = generateDates();

export default function Booking() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Load services from database
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true });

      if (error) {
        console.error("Error fetching services:", error);
        toast.error("Palveluiden lataus epäonnistui");
      } else {
        setServices(data || []);
      }
      setLoadingServices(false);
    };

    fetchServices();
  }, []);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchBookedSlots = async () => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_time")
        .eq("booking_date", dateStr)
        .neq("status", "cancelled");

      if (!error && data) {
        setBookedSlots(data.map(b => b.booking_time));
      }
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleSubmit = async () => {
    if (!selectedServiceData || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);

    try {
      // Create booking in database
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          service_id: selectedServiceData.id,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone || null,
          booking_date: selectedDate.toISOString().split('T')[0],
          booking_time: selectedTime,
          notes: formData.notes || null,
          status: "pending",
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Send confirmation email
      try {
        const { error: emailError } = await supabase.functions.invoke("send-booking-confirmation", {
          body: {
            bookingId: booking.id,
            customerName: formData.name,
            customerEmail: formData.email,
            serviceName: selectedServiceData.name,
            bookingDate: selectedDate.toISOString().split('T')[0],
            bookingTime: selectedTime,
          },
        });

        if (emailError) {
          console.error("Email sending failed:", emailError);
          // Don't fail the booking if email fails
        }
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }

      setStep(4);
      toast.success("Varaus tehty onnistuneesti!");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error("Varauksen tekeminen epäonnistui. Yritä uudelleen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedService !== null;
      case 2: return selectedDate !== null && selectedTime !== null;
      case 3: return formData.name && formData.phone && formData.email;
      default: return false;
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(0)} €`;
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 lg:py-16 bg-gradient-warm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Varaa aika
          </h1>
          <p className="text-muted-foreground text-lg">
            Valitse palvelu, aika ja täytä yhteystietosi.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-4 md:gap-8">
            {[
              { num: 1, label: "Palvelu" },
              { num: 2, label: "Aika" },
              { num: 3, label: "Tiedot" },
              { num: 4, label: "Valmis" },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center gap-2 md:gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s.num
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                </div>
                <span className={`hidden md:block text-sm ${step >= s.num ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
                {index < 3 && (
                  <div className={`w-8 md:w-16 h-0.5 ${step > s.num ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Steps */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">
                Valitse palvelu
              </h2>
              {loadingServices ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-4 rounded-xl text-left border-2 transition-all duration-300 ${
                        selectedService === service.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-foreground">{service.name}</span>
                        <span className="font-bold text-primary">{formatPrice(service.price)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration_minutes} min</span>
                      </div>
                      {service.description && (
                        <p className="text-xs text-muted-foreground mt-2">{service.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">
                Valitse aika
              </h2>
              
              {/* Date Selection */}
              <div className="mb-8">
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Päivämäärä
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {availableDates.map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime(null); // Reset time when date changes
                      }}
                      className={`flex-shrink-0 px-4 py-3 rounded-lg text-center border-2 transition-all ${
                        selectedDate?.toDateString() === date.toDateString()
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground uppercase">
                        {date.toLocaleDateString('fi-FI', { weekday: 'short' })}
                      </div>
                      <div className="font-semibold text-foreground">
                        {date.getDate()}.{date.getMonth() + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Kellonaika
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {timeSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <button
                          key={time}
                          onClick={() => !isBooked && setSelectedTime(time)}
                          disabled={isBooked}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            isBooked
                              ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed line-through"
                              : selectedTime === time
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                  {bookedSlots.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Yliviivatut ajat ovat jo varattuja.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Contact Information */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">
                Yhteystiedot
              </h2>
              
              {/* Summary */}
              <div className="bg-primary/5 rounded-xl p-4 mb-8 border border-primary/20">
                <h3 className="font-medium text-foreground mb-2">Varauksesi:</h3>
                <p className="text-muted-foreground">
                  <strong>{selectedServiceData?.name}</strong> – {selectedServiceData && formatPrice(selectedServiceData.price)}<br />
                  {selectedDate?.toLocaleDateString('fi-FI', { weekday: 'long', day: 'numeric', month: 'long' })} klo {selectedTime}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nimi *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Etunimi Sukunimi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Puhelin *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="+358 40 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Sähköposti *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="esimerkki@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Lisätiedot (valinnainen)
                  </label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Esim. erityistoiveita palvelusta"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="animate-fade-in text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                Kiitos varauksestasi!
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Olemme vastaanottaneet varauksesi. Lähetämme vahvistuksen sähköpostiisi ({formData.email}). 
                Mikäli sinulla on kysyttävää, ota yhteyttä puhelimitse.
              </p>
              <div className="bg-card rounded-xl p-6 mb-8 max-w-sm mx-auto text-left border border-border">
                <h3 className="font-medium text-foreground mb-4">Varauksen tiedot:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Palvelu:</strong> {selectedServiceData?.name}</li>
                  <li><strong>Päivä:</strong> {selectedDate?.toLocaleDateString('fi-FI', { weekday: 'long', day: 'numeric', month: 'long' })}</li>
                  <li><strong>Aika:</strong> {selectedTime}</li>
                  <li><strong>Nimi:</strong> {formData.name}</li>
                </ul>
              </div>
              <Button asChild variant="gold" size="lg">
                <a href="/">Palaa etusivulle</a>
              </Button>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-8 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className={step === 1 ? "invisible" : ""}
              >
                <ChevronLeft className="w-4 h-4" />
                Takaisin
              </Button>
              <Button
                variant="gold"
                onClick={() => step === 3 ? handleSubmit() : setStep(step + 1)}
                disabled={!canProceed() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Lähetetään...
                  </>
                ) : step === 3 ? "Vahvista varaus" : "Jatka"}
                {!isSubmitting && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
