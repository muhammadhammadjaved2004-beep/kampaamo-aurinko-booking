import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ServicesPreview() {
  const { t } = useLanguage();

  const services = [
    { nameKey: "services.men", price: "25 €", duration: "30 min" },
    { nameKey: "services.women", price: "45 €", duration: "45 min" },
    { nameKey: "services.children", price: "20 €", duration: "25 min" },
    { nameKey: "services.beard", price: "15 €", duration: "20 min" },
    { nameKey: "services.color", price: t("services.from") + " 65 €", duration: "90+ min" },
    { nameKey: "services.styling", price: t("services.from") + " 35 €", duration: "30+ min" },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("services.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("services.description")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-gold transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {t(service.nameKey)}
                </h3>
                <span className="text-lg font-bold text-primary">
                  {service.price}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("services.duration")}: {service.duration}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="gold" size="lg">
            <Link to="/palvelut">
              {t("services.viewAll")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
