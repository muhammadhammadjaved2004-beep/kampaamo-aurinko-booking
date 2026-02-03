import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { MapPin, Phone, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hours = [
    { dayKey: "day.monday", time: "09:00–17:00" },
    { dayKey: "day.tuesday", time: "09:00–17:00" },
    { dayKey: "day.wednesday", time: t("day.closed"), closed: true },
    { dayKey: "day.thursday", time: "09:00–17:00" },
    { dayKey: "day.friday", time: "09:00–17:00" },
    { dayKey: "day.saturday", time: "09:00–14:00" },
    { dayKey: "day.sunday", time: t("day.closed"), closed: true },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(t("contact.form.success"));
    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-warm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  {t("contact.info.title")}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{t("contact.address.label")}</h3>
                      <p className="text-muted-foreground">
                        Intiankatu 27 / Väinö Auerin katu 3<br />
                        00560 Helsinki
                      </p>
                      <p className="text-sm text-primary mt-2">
                        {t("contact.address.detail")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{t("location.phone")}</h3>
                      <a href="tel:+358975721117" className="text-primary text-lg hover:underline">
                        09 757 2117
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">{t("location.hours")}</h3>
                      <ul className="space-y-2">
                        {hours.map((item, index) => (
                          <li key={index} className="flex justify-between text-sm max-w-[200px]">
                            <span className="text-muted-foreground">{t(item.dayKey)}</span>
                            <span className={item.closed ? "text-muted-foreground/50" : "text-foreground font-medium"}>
                              {item.time}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="p-6 bg-card rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-3">{t("contact.businessInfo")}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>{t("contact.company")}:</strong> Satu Thusberg tmi</li>
                  <li><strong>{t("contact.tradeName")}:</strong> Salon Amarillo</li>
                  <li><strong>{t("contact.industry")}:</strong> {t("contact.industryValue")}</li>
                </ul>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                {t("contact.form.title")}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.form.name")} *
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.form.email")} *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.form.phone")}
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+358 40 123 4567"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.form.message")} *
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    placeholder={t("contact.form.messagePlaceholder")}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("contact.form.privacy")}
                </p>
                <Button type="submit" variant="gold" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? t("contact.form.sending") : t("contact.form.send")}
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-[400px] lg:h-[500px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.5!2d24.9603!3d60.2053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNjDCsDEyJzE5LjEiTiAyNMKwNTcnMzcuMSJF!5e0!3m2!1sen!2sfi!4v1600000000000!5m2!1sen!2sfi"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Salon Amarillo location"
        />
      </section>
    </Layout>
  );
}
