import { Link } from "react-router-dom";
import { Scissors, MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <Scissors className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-background">
                  Kampaamo
                </span>
                <span className="font-serif text-lg font-semibold text-gold -mt-1">
                  Amarillo
                </span>
              </div>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Laadukkaat kampaamopalvelut sydämellisessä ilmapiirissä Kumpulassa, Helsingissä.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-gold hover:text-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-gold hover:text-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-gold">Navigointi</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Etusivu" },
                { href: "/palvelut", label: "Palvelut" },
                { href: "/meista", label: "Meistä" },
                { href: "/galleria", label: "Galleria" },
                { href: "/ajanvaraus", label: "Varaa aika" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-gold">Yhteystiedot</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/70">
                <MapPin className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
                <span>Intiankatu 27 / Väinö Auerin katu 3<br />00560 Helsinki</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="tel:+358975721117" className="hover:text-gold transition-colors">
                  09 757 2117
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-gold">Aukioloajat</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li className="flex justify-between">
                <span>Ma–Ti</span>
                <span>09:00–17:00</span>
              </li>
              <li className="flex justify-between">
                <span>Ke</span>
                <span className="text-background/50">Suljettu</span>
              </li>
              <li className="flex justify-between">
                <span>To–Pe</span>
                <span>09:00–17:00</span>
              </li>
              <li className="flex justify-between">
                <span>La</span>
                <span>09:00–14:00</span>
              </li>
              <li className="flex justify-between">
                <span>Su</span>
                <span className="text-background/50">Suljettu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} Kampaamo Amarillo – Satu Thusberg tmi. Kaikki oikeudet pidätetään.
          </p>
          <div className="flex gap-4 text-sm text-background/50">
            <a href="#" className="hover:text-gold transition-colors">Tietosuoja</a>
            <a href="#" className="hover:text-gold transition-colors">Käyttöehdot</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
