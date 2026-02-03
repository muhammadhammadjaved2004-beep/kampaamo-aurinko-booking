import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, User, Phone, Mail, Check, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { z } from "zod";

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
  const { t, language } = useLanguage();
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

  // Validation schema for booking form
  const bookingFormSchema = z.object({
    name: z.string().trim().min(2, t("validation.nameTooShort")).max(100, t("validation.nameTooLong")),
    email: z.string().trim().email(t("validation.invalidEmail")).max(255),
    phone: z.string().trim().regex(/^(\+?[0-9\s\-()]{8,20})?$/, t("validation.invalidPhone")),
    notes: z.string().max(500, t("validation.notesTooLong")).optional(),
  });

  // Load services from database
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true });

      if (error) {
        toast.error(t("booking.loadError"));
      } else {
        setServices(data || []);
      }
      setLoadingServices(false);
    };

    fetchServices();
  }, [t]);

  // Fetch booked slots function (reusable)
  const fetchBookedSlots = useCallback(async (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const { data, error } = await supabase
      .rpc("get_booked_slots", { check_date: dateStr });

    if (!error && data) {
      setBookedSlots(data.map((slot: { booking_time: string }) => slot.booking_time));
    }
  }, []);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    fetchBookedSlots(selectedDate);
  }, [selectedDate, fetchBookedSlots]);

  // Real-time subscription for booking updates
  useEffect(() => {
    if (!selectedDate) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    
    const channel = supabase
      .channel('booking-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `booking_date=eq.${dateStr}`,
        },
        (payload) => {
          // When a new booking is inserted for the selected date, update the booked slots
          const newBookingTime = payload.new.booking_time as string;
          setBookedSlots((prev) => {
            if (!prev.includes(newBookingTime)) {
              return [...prev, newBookingTime];
            }
            return prev;
          });
          
          // If the currently selected time was just booked by someone else, deselect it
          if (selectedTime === newBookingTime) {
            setSelectedTime(null);
            toast.error(t("booking.slotJustBooked"));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate, selectedTime, t]);

  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleSubmit = async () => {
    if (!selectedServiceData || !selectedDate || !selectedTime) return;

    // Validate form data with Zod
    const validationResult = bookingFormSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    const validatedData = validationResult.data;
    setIsSubmitting(true);

    try {
      // Create booking using RPC function (bypasses RLS for anonymous users)
      const { data: bookingId, error: bookingError } = await supabase
        .rpc("create_booking", {
          p_service_id: selectedServiceData.id,
          p_customer_name: validatedData.name,
          p_customer_email: validatedData.email,
          p_customer_phone: validatedData.phone || null,
          p_booking_date: selectedDate.toISOString().split('T')[0],
          p_booking_time: selectedTime,
          p_notes: validatedData.notes || null,
        });

      if (bookingError) {
        console.error("Booking error:", bookingError);
        // Handle unique constraint violation (double-booking)
        if (bookingError.code === '23505' || bookingError.message?.includes('unique')) {
          toast.error(t("booking.slotJustBooked"));
          // Refresh available slots
          await fetchBookedSlots(selectedDate);
          setSelectedTime(null);
          return;
        }
        throw bookingError;
      }

      const booking = { id: bookingId };

      // Send confirmation email (fire and forget - don't block on email)
      supabase.functions.invoke("send-booking-confirmation", {
        body: {
          bookingId: booking.id,
          customerName: validatedData.name,
          customerEmail: validatedData.email,
          serviceName: selectedServiceData.name,
          bookingDate: selectedDate.toISOString().split('T')[0],
          bookingTime: selectedTime,
        },
      }).catch(() => {
        // Email failure is non-critical, silently ignore
      });

      setStep(4);
      toast.success(t("booking.success.title"));
    } catch (error: unknown) {
      toast.error(t("booking.error"));
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

  const formatDateShort = (date: Date) => {
    const locale = language === 'fi' ? 'fi-FI' : 'en-US';
    return {
      weekday: date.toLocaleDateString(locale, { weekday: 'short' }),
      day: `${date.getDate()}.${date.getMonth() + 1}`,
    };
  };

  const formatDateLong = (date: Date) => {
    const locale = language === 'fi' ? 'fi-FI' : 'en-US';
    return date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const stepLabels = [
    { num: 1, label: t("booking.step.service") },
    { num: 2, label: t("booking.step.time") },
    { num: 3, label: t("booking.step.details") },
    { num: 4, label: t("booking.step.done") },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 lg:py-16 bg-gradient-warm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("booking.title")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("booking.subtitle")}
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-4 md:gap-8">
            {stepLabels.map((s, index) => (
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
                {t("booking.selectService")}
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
                {t("booking.selectTime")}
              </h2>
              
              {/* Date Selection */}
              <div className="mb-8">
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {t("booking.date")}
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {availableDates.map((date) => {
                    const formatted = formatDateShort(date);
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(null);
                        }}
                        className={`flex-shrink-0 px-4 py-3 rounded-lg text-center border-2 transition-all ${
                          selectedDate?.toDateString() === date.toDateString()
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="text-xs text-muted-foreground uppercase">
                          {formatted.weekday}
                        </div>
                        <div className="font-semibold text-foreground">
                          {formatted.day}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    {t("booking.time")}
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
                      {t("booking.slotsBooked")}
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
                {t("booking.contactInfo")}
              </h2>
              
              {/* Summary */}
              <div className="bg-primary/5 rounded-xl p-4 mb-8 border border-primary/20">
                <h3 className="font-medium text-foreground mb-2">{t("booking.yourBooking")}</h3>
                <p className="text-muted-foreground">
                  <strong>{selectedServiceData?.name}</strong> – {selectedServiceData && formatPrice(selectedServiceData.price)}<br />
                  {selectedDate && formatDateLong(selectedDate)} {t("booking.at")} {selectedTime}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    {t("booking.name")} *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    {t("booking.phone")} *
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
                    {t("booking.email")} *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("booking.notes")}
                  </label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={t("booking.notesPlaceholder")}
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
                {t("booking.success.title")}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t("booking.success.message")} ({formData.email}). 
                {t("booking.success.contact")}
              </p>
              <div className="bg-card rounded-xl p-6 mb-8 max-w-sm mx-auto text-left border border-border">
                <h3 className="font-medium text-foreground mb-4">{t("booking.success.details")}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>{t("booking.success.service")}:</strong> {selectedServiceData?.name}</li>
                  <li><strong>{t("booking.success.day")}:</strong> {selectedDate && formatDateLong(selectedDate)}</li>
                  <li><strong>{t("booking.success.time")}:</strong> {selectedTime}</li>
                  <li><strong>{t("booking.success.name")}:</strong> {formData.name}</li>
                </ul>
              </div>
              <Button asChild variant="gold" size="lg">
                <a href="/">{t("booking.success.home")}</a>
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
                {t("booking.back")}
              </Button>
              <Button
                variant="gold"
                onClick={() => step === 3 ? handleSubmit() : setStep(step + 1)}
                disabled={!canProceed() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("booking.submitting")}
                  </>
                ) : step === 3 ? t("booking.confirm") : t("booking.continue")}
                {!isSubmitting && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
