import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";
import { toast } from "sonner";

const hours = [
  { day: "Maanantai", time: "09:00–17:00" },
  { day: "Tiistai", time: "09:00–17:00" },
  { day: "Keskiviikko", time: "Suljettu", closed: true },
  { day: "Torstai", time: "09:00–17:00" },
  { day: "Perjantai", time: "09:00–17:00" },
  { day: "Lauantai", time: "09:00–14:00" },
  { day: "Sunnuntai", time: "Suljettu", closed: true },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Viesti lähetetty! Otamme sinuun yhteyttä pian.");
    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-warm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Yhteystiedot
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ota meihin yhteyttä tai tule käymään. Löydät meidät Kumpulan sydämestä.
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
                  Yhteystietomme
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Osoite</h3>
                      <p className="text-muted-foreground">
                        Intiankatu 27 / Väinö Auerin katu 3<br />
                        00560 Helsinki
                      </p>
                      <p className="text-sm text-primary mt-2">
                        Kumpulan alueella, hyvät julkiset yhteydet
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Puhelin</h3>
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
                      <h3 className="font-semibold text-foreground mb-3">Aukioloajat</h3>
                      <ul className="space-y-2">
                        {hours.map((item) => (
                          <li key={item.day} className="flex justify-between text-sm max-w-[200px]">
                            <span className="text-muted-foreground">{item.day}</span>
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

              {/* Yritystiedot */}
              <div className="p-6 bg-card rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-3">Yritystiedot</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>Yritys:</strong> Satu Thusberg tmi</li>
                  <li><strong>Toiminimi:</strong> Kampaamo Amarillo</li>
                  <li><strong>Toimiala:</strong> Parturi- ja kampaamopalvelut</li>
                </ul>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                Lähetä viesti
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Nimi *
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Etunimi Sukunimi"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Sähköposti *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="esimerkki@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Puhelin
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
                    Viesti *
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    placeholder="Kirjoita viestisi tähän..."
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Käsittelemme tietojasi luottamuksellisesti GDPR-säädösten mukaisesti.
                </p>
                <Button type="submit" variant="gold" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Lähetetään..." : "Lähetä viesti"}
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.5!2d24.9603!3d60.2053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNjDCsDEyJzE5LjEiTiAyNMKwNTcnMzcuMSJF!5e0!3m2!1sfi!2sfi!4v1600000000000!5m2!1sfi!2sfi"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Kampaamo Amarillo sijainti"
        />
      </section>
    </Layout>
  );
}
