import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const services = [
  {
    name: "Miesten hiustenleikkuu",
    price: "25 €",
    duration: "30 min",
  },
  {
    name: "Naisten hiustenleikkuu",
    price: "45 €",
    duration: "45 min",
  },
  {
    name: "Lasten hiustenleikkuu",
    price: "20 €",
    duration: "25 min",
  },
  {
    name: "Parran muotoilu",
    price: "15 €",
    duration: "20 min",
  },
  {
    name: "Hiusten värjäys",
    price: "alkaen 65 €",
    duration: "90+ min",
  },
  {
    name: "Kampaus & muotoilu",
    price: "alkaen 35 €",
    duration: "30+ min",
  },
];

export function ServicesPreview() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Palvelumme
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tarjoamme monipuoliset kampaamopalvelut kohtuuhintaan. 
            Jokainen asiakas saa henkilökohtaista palvelua ja ammattitaitoista neuvontaa.
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
                  {service.name}
                </h3>
                <span className="text-lg font-bold text-primary">
                  {service.price}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Kesto: {service.duration}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="gold" size="lg">
            <Link to="/palvelut">
              Katso kaikki palvelut
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
