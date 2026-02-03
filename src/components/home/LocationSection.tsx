import { Clock, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LocationSection() {
  const { t } = useLanguage();

  const hours = [
    { dayKey: "day.monday", time: "09:00–17:00" },
    { dayKey: "day.tuesday", time: "09:00–17:00" },
    { dayKey: "day.wednesday", time: t("day.closed"), closed: true },
    { dayKey: "day.thursday", time: "09:00–17:00" },
    { dayKey: "day.friday", time: "09:00–17:00" },
    { dayKey: "day.saturday", time: "09:00–14:00" },
    { dayKey: "day.sunday", time: t("day.closed"), closed: true },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-elevated h-[400px]">
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
          </div>

          {/* Info */}
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t("location.title")}
            </h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("location.address")}</h3>
                  <p className="text-muted-foreground">
                    Intiankatu 27 / Väinö Auerin katu 3<br />
                    00560 Helsinki (Kumpula)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("location.phone")}</h3>
                  <a href="tel:+358975721117" className="text-primary hover:underline">
                    09 757 2117
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t("location.hours")}</h3>
                  <ul className="space-y-1">
                    {hours.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
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

            <Button asChild variant="gold" size="lg">
              <Link to="/yhteystiedot">
                {t("location.directions")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
