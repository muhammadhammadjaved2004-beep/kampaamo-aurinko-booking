import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";

const services = [
  {
    category: "Hiustenleikkaukset",
    items: [
      { name: "Miesten hiustenleikkuu", price: "25 €", duration: "30 min", description: "Sisältää pesun ja muotoilun" },
      { name: "Naisten hiustenleikkuu", price: "45 €", duration: "45 min", description: "Sisältää pesun, leikkauksen ja föönauksen" },
      { name: "Lasten hiustenleikkuu (alle 12v)", price: "20 €", duration: "25 min", description: "Lapsille sopiva rento palvelu" },
      { name: "Otsatukan leikkaus", price: "10 €", duration: "10 min", description: "Nopea otsatukan siistiminen" },
    ],
  },
  {
    category: "Parturipalvelut",
    items: [
      { name: "Parran muotoilu", price: "15 €", duration: "20 min", description: "Parran siistiminen ja muotoilu" },
      { name: "Parran ajelu", price: "20 €", duration: "25 min", description: "Perinteinen parranajelu" },
      { name: "Hiukset + parta", price: "35 €", duration: "45 min", description: "Kokonaisvaltainen miesten paketti" },
    ],
  },
  {
    category: "Värjäykset & käsittelyt",
    items: [
      { name: "Juuriväri", price: "65 €", duration: "90 min", description: "Tyvikasvun värjäys" },
      { name: "Kokovärjäys lyhyt", price: "75 €", duration: "100 min", description: "Lyhyiden hiusten kokovärjäys" },
      { name: "Kokovärjäys pitkä", price: "95 €", duration: "120 min", description: "Pitkien hiusten kokovärjäys" },
      { name: "Raidat/highlights", price: "alkaen 85 €", duration: "120+ min", description: "Raitojen teko folio- tai kampatekniikalla" },
      { name: "Permanentti", price: "alkaen 80 €", duration: "120+ min", description: "Pysyvä kiharra tai aalto" },
    ],
  },
  {
    category: "Kampaukset & muotoilu",
    items: [
      { name: "Juhlakampaus", price: "alkaen 50 €", duration: "45+ min", description: "Juhlatilaisuuksiin sopiva kampaus" },
      { name: "Morsiuskampaus", price: "alkaen 100 €", duration: "90+ min", description: "Sisältää koekampauksen erikseen sovittavasti" },
      { name: "Föönaus", price: "30 €", duration: "30 min", description: "Hiusten pesu ja föönmuotoilu" },
      { name: "Suoristus", price: "35 €", duration: "40 min", description: "Hiusten pesu ja suoristus" },
    ],
  },
  {
    category: "Hoidot",
    items: [
      { name: "Tehohoito", price: "20 €", duration: "20 min", description: "Syväkosteuttava tai vahvistava hoito" },
      { name: "Hiuspohjan hoito", price: "25 €", duration: "25 min", description: "Rauhoittava tai virkistävä hoito" },
      { name: "Olaplex-hoito", price: "30 €", duration: "30 min", description: "Hiuksia korjaava erikoishoito" },
    ],
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-warm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Palvelut & Hinnasto
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tarjoamme laajan valikoiman kampaamopalveluita koko perheelle. 
            Kaikki hinnat sisältävät ammattitaitoisen konsultaation.
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
              <strong className="text-foreground">Huom:</strong> Hinnat ovat suuntaa-antavia ja voivat vaihdella hiusten pituuden ja paksuuden mukaan. 
              Pyydämme vahvistamaan lopullisen hinnan varauksen yhteydessä tai paikan päällä. 
              Pitkille ja erityisen paksuille hiuksille voidaan lisätä lisämaksu.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Haluatko varata ajan?
          </h2>
          <p className="text-background/70 text-lg mb-8 max-w-xl mx-auto">
            Varaa aika helposti verkossa tai soita meille suoraan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/ajanvaraus">
                Varaa aika verkossa
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="lg">
              <a href="tel:+358975721117">
                Soita: 09 757 2117
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
