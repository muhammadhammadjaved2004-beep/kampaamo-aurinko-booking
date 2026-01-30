import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Heart, Award, Users } from "lucide-react";

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                Meistä
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Kampaamo Amarillo on Kumpulassa sijaitseva perheyritys, joka on palvellut 
                helsinkiläisiä jo yli 20 vuoden ajan. Meidän filosofiamme perustuu 
                henkilökohtaiseen palveluun, ammattitaitoon ja aitoon välittämiseen 
                jokaisesta asiakkaasta.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Uskomme, että jokainen asiakas ansaitsee yksilöllistä huomiota ja 
                räätälöityjä ratkaisuja. Siksi kuuntelemme tarkasti toiveitasi ja 
                yhdistämme ne ammattitaitoomme luodaksemme juuri sinulle sopivan tyylin.
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
                    Omistaja & Kampaaja
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
            Meidän arvomme
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Sydämellisyys",
                description: "Jokainen asiakas on meille tärkeä. Luomme lämpimän ja tervetulleen ilmapiirin, jossa voit rentoutua ja nauttia palvelusta.",
              },
              {
                icon: Award,
                title: "Ammattitaito",
                description: "Yli 20 vuoden kokemus ja jatkuva kouluttautuminen takaavat laadukkaan lopputuloksen joka kerta.",
              },
              {
                icon: Users,
                title: "Yhteisöllisyys",
                description: "Olemme osa Kumpulan yhteisöä ja tunnemme monet asiakkaamme nimeltä. Tämä on enemmän kuin kampaamo – se on kohtaamispaikka.",
              },
            ].map((value, index) => (
              <div key={index} className="text-center p-8 bg-card rounded-2xl shadow-soft">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-gold-light flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
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
              Meidän tarina
            </h2>
            <div className="space-y-6 text-background/80 text-lg leading-relaxed">
              <p>
                Kampaamo Amarillo sai alkunsa unelmasta luoda paikka, jossa jokainen 
                asiakas voi tuntea olonsa erityiseksi. Satu Thusberg aloitti uransa 
                kampaajana 90-luvulla ja perusti oman liikkeensä Kumpulaan, alueelle 
                joka on lähellä hänen sydäntään.
              </p>
              <p>
                Vuosien varrella liikkeemme on kasvanut ja kehittynyt, mutta 
                perusarvomme ovat pysyneet samoina: laadukas palvelu, aito 
                välittäminen ja ammattitaitoinen työ. Monet asiakkaistamme ovat 
                käyneet meillä jo vuosikymmeniä, ja näemme monen perheen lasten 
                kasvavan.
              </p>
              <p>
                Nimemme "Amarillo" tarkoittaa espanjaksi keltaista – aurinkoa, 
                lämpöä ja iloa. Haluamme tuoda jokaiseen päivään ripauksen 
                aurinkoa ja hyvää mieltä.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-gold-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Tule tutustumaan meihin
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Varaa aikasi ja koe itse Amarillon lämmin tunnelma.
          </p>
          <Button asChild size="xl" className="bg-foreground text-background hover:bg-foreground/90 shadow-elevated hover:scale-105 transition-all">
            <Link to="/ajanvaraus">
              Varaa aika
              <ChevronRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
