import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Star, ChevronRight, Scissors, Users, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-salon.jpg";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Salon Amarillo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-gold fill-gold" />
            <span className="text-gold font-medium">{t("hero.rating")}</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t("hero.welcome")}<br />
            <span className="text-gold">{t("hero.salon")}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button asChild variant="hero" size="xl">
              <Link to="/ajanvaraus">
                {t("hero.bookNow")}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl">
              <Link to="/palvelut">
                {t("hero.viewServices")}
              </Link>
            </Button>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              <span>{t("hero.hours")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              <span>Kumpula, Helsinki</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100L1440 100L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 100Z" fill="hsl(45 30% 97%)" />
        </svg>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Scissors,
      title: t("features.professional.title"),
      description: t("features.professional.desc"),
    },
    {
      icon: Users,
      title: t("features.family.title"),
      description: t("features.family.desc"),
    },
    {
      icon: Award,
      title: t("features.quality.title"),
      description: t("features.quality.desc"),
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-warm">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-elevated transition-shadow duration-300 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-gold-light flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
