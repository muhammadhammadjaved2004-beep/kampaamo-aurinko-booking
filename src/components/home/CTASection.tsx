import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-gold-light">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          {t("cta.title")}
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
          {t("cta.description")}
        </p>
        <Button asChild size="xl" className="bg-foreground text-background hover:bg-foreground/90 shadow-elevated hover:scale-105 transition-all">
          <Link to="/ajanvaraus">
            {t("cta.bookNow")}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
