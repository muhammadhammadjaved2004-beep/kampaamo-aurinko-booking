import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Services() {
  const { t, language } = useLanguage();

  const services = [
    {
      category: t("servicesPage.category.haircuts"),
      items: [
        { name: t("services.men"), price: "25 €", duration: "30 min", description: language === 'fi' ? "Sisältää pesun ja muotoilun" : "Includes wash and styling" },
        { name: t("services.women"), price: "45 €", duration: "45 min", description: language === 'fi' ? "Sisältää pesun, leikkauksen ja föönauksen" : "Includes wash, cut and blow-dry" },
        { name: t("services.children") + " (<12)", price: "20 €", duration: "25 min", description: language === 'fi' ? "Lapsille sopiva rento palvelu" : "Relaxed service suitable for children" },
        { name: language === 'fi' ? "Otsatukan leikkaus" : "Bangs trim", price: "10 €", duration: "10 min", description: language === 'fi' ? "Nopea otsatukan siistiminen" : "Quick bangs trim" },
      ],
    },
    {
      category: t("servicesPage.category.barber"),
      items: [
        { name: t("services.beard"), price: "15 €", duration: "20 min", description: language === 'fi' ? "Parran siistiminen ja muotoilu" : "Beard trimming and shaping" },
        { name: language === 'fi' ? "Parran ajelu" : "Beard shave", price: "20 €", duration: "25 min", description: language === 'fi' ? "Perinteinen parranajelu" : "Traditional beard shave" },
        { name: language === 'fi' ? "Hiukset + parta" : "Hair + beard", price: "35 €", duration: "45 min", description: language === 'fi' ? "Kokonaisvaltainen miesten paketti" : "Complete men's package" },
      ],
    },
    {
      category: t("servicesPage.category.coloring"),
      items: [
        { name: language === 'fi' ? "Juuriväri" : "Root color", price: "65 €", duration: "90 min", description: language === 'fi' ? "Tyvikasvun värjäys" : "Root growth coloring" },
        { name: language === 'fi' ? "Kokovärjäys lyhyt" : "Full color (short)", price: "75 €", duration: "100 min", description: language === 'fi' ? "Lyhyiden hiusten kokovärjäys" : "Full coloring for short hair" },
        { name: language === 'fi' ? "Kokovärjäys pitkä" : "Full color (long)", price: "95 €", duration: "120 min", description: language === 'fi' ? "Pitkien hiusten kokovärjäys" : "Full coloring for long hair" },
        { name: language === 'fi' ? "Raidat/highlights" : "Highlights", price: t("services.from") + " 85 €", duration: "120+ min", description: language === 'fi' ? "Raitojen teko folio- tai kampatekniikalla" : "Foil or comb technique highlights" },
        { name: language === 'fi' ? "Permanentti" : "Perm", price: t("services.from") + " 80 €", duration: "120+ min", description: language === 'fi' ? "Pysyvä kiharra tai aalto" : "Permanent curls or waves" },
      ],
    },
    {
      category: t("servicesPage.category.styling"),
      items: [
        { name: language === 'fi' ? "Juhlakampaus" : "Special occasion styling", price: t("services.from") + " 50 €", duration: "45+ min", description: language === 'fi' ? "Juhlatilaisuuksiin sopiva kampaus" : "Styling for special occasions" },
        { name: language === 'fi' ? "Morsiuskampaus" : "Bridal styling", price: t("services.from") + " 100 €", duration: "90+ min", description: language === 'fi' ? "Sisältää koekampauksen erikseen sovittavasti" : "Includes trial styling by arrangement" },
        { name: language === 'fi' ? "Föönaus" : "Blow-dry", price: "30 €", duration: "30 min", description: language === 'fi' ? "Hiusten pesu ja föönmuotoilu" : "Wash and blow-dry styling" },
        { name: language === 'fi' ? "Suoristus" : "Straightening", price: "35 €", duration: "40 min", description: language === 'fi' ? "Hiusten pesu ja suoristus" : "Wash and straightening" },
      ],
    },
    {
      category: t("servicesPage.category.treatments"),
      items: [
        { name: language === 'fi' ? "Tehohoito" : "Deep treatment", price: "20 €", duration: "20 min", description: language === 'fi' ? "Syväkosteuttava tai vahvistava hoito" : "Deep moisturizing or strengthening" },
        { name: language === 'fi' ? "Hiuspohjan hoito" : "Scalp treatment", price: "25 €", duration: "25 min", description: language === 'fi' ? "Rauhoittava tai virkistävä hoito" : "Soothing or refreshing treatment" },
        { name: "Olaplex", price: "30 €", duration: "30 min", description: language === 'fi' ? "Hiuksia korjaava erikoishoito" : "Hair repair special treatment" },
      ],
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-warm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("servicesPage.title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("servicesPage.description")}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {services.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8 pb-4 border-b border-border">
                  {category.category}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {category.items.map((service, serviceIndex) => (
                    <div
                      key={serviceIndex}
                      className="group bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                        <span className="text-xl font-bold text-primary whitespace-nowrap ml-4">
                          {service.price}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground/70">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-16 p-6 bg-primary/5 rounded-xl border border-primary/20">
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">{t("servicesPage.note")}</strong> {t("servicesPage.noteText")}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            {t("servicesPage.cta.title")}
          </h2>
          <p className="text-background/70 text-lg mb-8 max-w-xl mx-auto">
            {t("servicesPage.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/ajanvaraus">
                {t("servicesPage.cta.bookOnline")}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="lg">
              <a href="tel:+358975721117">
                {t("servicesPage.cta.call")}: 09 757 2117
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
