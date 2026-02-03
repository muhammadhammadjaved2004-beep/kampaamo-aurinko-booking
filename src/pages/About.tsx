import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Heart, Award, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Heart,
      titleKey: "about.values.warmth.title",
      descKey: "about.values.warmth.desc",
    },
    {
      icon: Award,
      titleKey: "about.values.expertise.title",
      descKey: "about.values.expertise.desc",
    },
    {
      icon: Users,
      titleKey: "about.values.community.title",
      descKey: "about.values.community.desc",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                {t("about.title")}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {t("about.intro1")}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t("about.intro2")}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-gold-light/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-gold-light flex items-center justify-center">
                    <span className="text-5xl font-serif font-bold text-primary-foreground">S</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                    Satu Thusberg
                  </h3>
                  <p className="text-primary font-medium">
                    {t("about.owner")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            {t("about.values.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-8 bg-card rounded-2xl shadow-soft">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-gold-light flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                  {t(value.titleKey)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(value.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8">
              {t("about.story.title")}
            </h2>
            <div className="space-y-6 text-background/80 text-lg leading-relaxed">
              <p>{t("about.story.p1")}</p>
              <p>{t("about.story.p2")}</p>
              <p>{t("about.story.p3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-gold-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t("about.cta.title")}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            {t("about.cta.description")}
          </p>
          <Button asChild size="xl" className="bg-foreground text-background hover:bg-foreground/90 shadow-elevated hover:scale-105 transition-all">
            <Link to="/ajanvaraus">
              {t("nav.book")}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
