import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "fi" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.about": "About",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",
    "nav.book": "Book Now",
    
    // Hero
    "hero.rating": "4.8/5 rating from our customers",
    "hero.welcome": "Welcome to",
    "hero.salon": "Salon Amarillo",
    "hero.description": "Quality salon services in a warm atmosphere in Kumpula. With over 20 years of experience, we offer personalized service and professional hair care for the whole family.",
    "hero.bookNow": "Book Now",
    "hero.viewServices": "View Services",
    "hero.hours": "Mon–Fri 9–17, Sat 9–14",
    
    // Features
    "features.professional.title": "Professional Service",
    "features.professional.desc": "Over 20 years of experience in haircuts and treatments",
    "features.family.title": "For the Whole Family",
    "features.family.desc": "We serve women, men, and children all in one place",
    "features.quality.title": "Quality Guarantee",
    "features.quality.desc": "We use only quality products and modern techniques",
    
    // Services Preview
    "services.title": "Our Services",
    "services.description": "We offer comprehensive salon services at reasonable prices. Every customer receives personalized service and professional advice.",
    "services.men": "Men's Haircut",
    "services.women": "Women's Haircut",
    "services.children": "Children's Haircut",
    "services.beard": "Beard Styling",
    "services.color": "Hair Coloring",
    "services.styling": "Styling",
    "services.duration": "Duration",
    "services.from": "from",
    "services.viewAll": "View All Services",
    
    // Reviews
    "reviews.title": "What Our Customers Say",
    "reviews.description": "We are proud of our excellent customer service and satisfied customers.",
    "review1.text": "Best salon in Kumpula! Satu is a true professional and always friendly. I've been coming here for years.",
    "review2.text": "Excellent service and great value for money. Men's cuts are always perfect.",
    "review3.text": "Cozy and calm atmosphere. Hair coloring turned out exactly as I wanted. Highly recommend!",
    
    // Location
    "location.title": "Find Us",
    "location.address": "Address",
    "location.phone": "Phone",
    "location.hours": "Opening Hours",
    "location.directions": "Contact & Directions",
    
    // Days
    "day.monday": "Monday",
    "day.tuesday": "Tuesday",
    "day.wednesday": "Wednesday",
    "day.thursday": "Thursday",
    "day.friday": "Friday",
    "day.saturday": "Saturday",
    "day.sunday": "Sunday",
    "day.closed": "Closed",
    
    // CTA
    "cta.title": "Ready for a New Look?",
    "cta.description": "Book your appointment today and let us take care of your hair. The first step to a new style is just a click away.",
    "cta.bookNow": "Book Now",
    
    // Booking
    "booking.title": "Book Appointment",
    "booking.subtitle": "Select a service, time, and fill in your contact information.",
    "booking.step.service": "Service",
    "booking.step.time": "Time",
    "booking.step.details": "Details",
    "booking.step.done": "Done",
    "booking.selectService": "Select a Service",
    "booking.selectTime": "Select Time",
    "booking.date": "Date",
    "booking.time": "Time",
    "booking.contactInfo": "Contact Information",
    "booking.yourBooking": "Your booking:",
    "booking.at": "at",
    "booking.name": "Name",
    "booking.phone": "Phone",
    "booking.email": "Email",
    "booking.notes": "Additional notes (optional)",
    "booking.notesPlaceholder": "E.g., special requests for the service",
    "booking.back": "Back",
    "booking.continue": "Continue",
    "booking.confirm": "Confirm Booking",
    "booking.submitting": "Submitting...",
    "booking.success.title": "Thank You for Your Booking!",
    "booking.success.message": "We have received your booking. We will send a confirmation to your email",
    "booking.success.contact": "If you have any questions, please contact us by phone.",
    "booking.success.details": "Booking Details:",
    "booking.success.service": "Service",
    "booking.success.day": "Day",
    "booking.success.time": "Time",
    "booking.success.name": "Name",
    "booking.success.home": "Return to Home",
    "booking.slotsBooked": "Crossed-out times are already booked.",
    "booking.slotJustBooked": "This time was just booked. Please select another time.",
    "booking.error": "Booking failed. Please try again.",
    "booking.loadError": "Failed to load services",
    
    // Validation
    "validation.nameTooShort": "Name is too short",
    "validation.nameTooLong": "Name is too long",
    "validation.invalidEmail": "Invalid email address",
    "validation.invalidPhone": "Invalid phone number",
    "validation.notesTooLong": "Notes are too long",
    
    // Services Page
    "servicesPage.title": "Services & Prices",
    "servicesPage.description": "We offer a wide range of salon services for the whole family. All prices include a professional consultation.",
    "servicesPage.category.haircuts": "Haircuts",
    "servicesPage.category.barber": "Barber Services",
    "servicesPage.category.coloring": "Coloring & Treatments",
    "servicesPage.category.styling": "Styling",
    "servicesPage.category.treatments": "Treatments",
    "servicesPage.note": "Note:",
    "servicesPage.noteText": "Prices are indicative and may vary depending on hair length and thickness. Please confirm the final price when booking or on-site. Additional charges may apply for long and very thick hair.",
    "servicesPage.cta.title": "Want to Book an Appointment?",
    "servicesPage.cta.description": "Book online easily or call us directly.",
    "servicesPage.cta.bookOnline": "Book Online",
    "servicesPage.cta.call": "Call",
    
    // About Page
    "about.title": "About Us",
    "about.intro1": "Salon Amarillo is a family business located in Kumpula, serving Helsinki residents for over 20 years. Our philosophy is based on personalized service, professionalism, and genuine care for each customer.",
    "about.intro2": "We believe every customer deserves individual attention and tailored solutions. That's why we listen carefully to your wishes and combine them with our expertise to create a style that suits you.",
    "about.owner": "Owner & Hairdresser",
    "about.values.title": "Our Values",
    "about.values.warmth.title": "Warmth",
    "about.values.warmth.desc": "Every customer is important to us. We create a warm and welcoming atmosphere where you can relax and enjoy the service.",
    "about.values.expertise.title": "Expertise",
    "about.values.expertise.desc": "Over 20 years of experience and continuous training guarantee quality results every time.",
    "about.values.community.title": "Community",
    "about.values.community.desc": "We are part of the Kumpula community and know many of our customers by name. This is more than a salon – it's a meeting place.",
    "about.story.title": "Our Story",
    "about.story.p1": "Salon Amarillo was born from a dream to create a place where every customer can feel special. Satu Thusberg started her career as a hairdresser in the 90s and founded her own salon in Kumpula, an area close to her heart.",
    "about.story.p2": "Over the years, our salon has grown and evolved, but our core values remain the same: quality service, genuine care, and professional work. Many of our customers have been visiting us for decades, and we've watched many families' children grow up.",
    "about.story.p3": 'Our name "Amarillo" means yellow in Spanish – sunshine, warmth, and joy. We want to bring a touch of sunshine and good mood to every day.',
    "about.cta.title": "Come Meet Us",
    "about.cta.description": "Book your appointment and experience Amarillo's warm atmosphere.",
    
    // Contact Page
    "contact.title": "Contact",
    "contact.subtitle": "Get in touch or visit us. Find us in the heart of Kumpula.",
    "contact.info.title": "Contact Information",
    "contact.address.label": "Address",
    "contact.address.detail": "Kumpula area, good public transport connections",
    "contact.businessInfo": "Business Information",
    "contact.company": "Company",
    "contact.tradeName": "Trade name",
    "contact.industry": "Industry",
    "contact.industryValue": "Barber and salon services",
    "contact.form.title": "Send a Message",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.phone": "Phone",
    "contact.form.message": "Message",
    "contact.form.messagePlaceholder": "Write your message here...",
    "contact.form.privacy": "We handle your information confidentially in accordance with GDPR regulations.",
    "contact.form.send": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.form.success": "Message sent! We will contact you soon.",
    
    // Gallery
    "gallery.title": "Gallery",
    "gallery.description": "Explore our work and the atmosphere of our space. Every image tells a story of our craftsmanship and passion.",
    "gallery.all": "All",
    "gallery.spaces": "Spaces",
    "gallery.cuts": "Haircuts",
    "gallery.styles": "Styles",
    "gallery.colors": "Colors",
    "gallery.empty": "No images in this category.",
    
    // Footer
    "footer.description": "Quality salon services in a warm atmosphere in Kumpula, Helsinki.",
    "footer.navigation": "Navigation",
    "footer.contact": "Contact",
    "footer.hours": "Opening Hours",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    
    // 404
    "notFound.title": "Page Not Found",
    "notFound.description": "The page you're looking for doesn't exist or has been moved.",
    "notFound.home": "Return to Home",
  },
  fi: {
    // Navigation
    "nav.home": "Etusivu",
    "nav.services": "Palvelut",
    "nav.about": "Meistä",
    "nav.gallery": "Galleria",
    "nav.contact": "Yhteystiedot",
    "nav.book": "Varaa aika",
    
    // Hero
    "hero.rating": "4.8/5 arvosana asiakkailtamme",
    "hero.welcome": "Tervetuloa",
    "hero.salon": "Kampaamo Amarilloon",
    "hero.description": "Laadukkaat kampaamopalvelut sydämellisessä ilmapiirissä Kumpulassa. Yli 20 vuoden kokemuksella tarjoamme henkilökohtaista palvelua ja ammattitaitoisia hiushoitoja koko perheelle.",
    "hero.bookNow": "Varaa aika nyt",
    "hero.viewServices": "Katso palvelut",
    "hero.hours": "Ma–Pe 9–17, La 9–14",
    
    // Features
    "features.professional.title": "Ammattimainen Palvelu",
    "features.professional.desc": "Yli 20 vuoden kokemus hiustenleikkuista ja -hoidoista",
    "features.family.title": "Koko Perheelle",
    "features.family.desc": "Palvelemme naiset, miehet ja lapset kaikki samassa paikassa",
    "features.quality.title": "Laatutakuu",
    "features.quality.desc": "Käytämme vain laadukkaita tuotteita ja moderneja tekniikoita",
    
    // Services Preview
    "services.title": "Palvelumme",
    "services.description": "Tarjoamme monipuoliset kampaamopalvelut kohtuuhintaan. Jokainen asiakas saa henkilökohtaista palvelua ja ammattitaitoista neuvontaa.",
    "services.men": "Miesten hiustenleikkuu",
    "services.women": "Naisten hiustenleikkuu",
    "services.children": "Lasten hiustenleikkuu",
    "services.beard": "Parran muotoilu",
    "services.color": "Hiusten värjäys",
    "services.styling": "Kampaus & muotoilu",
    "services.duration": "Kesto",
    "services.from": "alkaen",
    "services.viewAll": "Katso kaikki palvelut",
    
    // Reviews
    "reviews.title": "Mitä asiakkaamme sanovat",
    "reviews.description": "Olemme ylpeitä erinomaisesta asiakaspalvelustamme ja tyytyväisistä asiakkaistamme.",
    "review1.text": "Paras kampaamo Kumpulassa! Satu on todellinen ammattilainen ja aina ystävällinen. Olen käynyt täällä jo vuosia.",
    "review2.text": "Erinomainen palvelu ja hyvä hinta-laatusuhde. Miesten leikkaus on aina onnistunut täydellisesti.",
    "review3.text": "Viihtyisä ja rauhallinen ilmapiiri. Hiusten värjäys onnistui juuri toivomallani tavalla. Suosittelen lämpimästi!",
    
    // Location
    "location.title": "Löydä meidät",
    "location.address": "Osoite",
    "location.phone": "Puhelin",
    "location.hours": "Aukioloajat",
    "location.directions": "Yhteystiedot ja ajo-ohjeet",
    
    // Days
    "day.monday": "Maanantai",
    "day.tuesday": "Tiistai",
    "day.wednesday": "Keskiviikko",
    "day.thursday": "Torstai",
    "day.friday": "Perjantai",
    "day.saturday": "Lauantai",
    "day.sunday": "Sunnuntai",
    "day.closed": "Suljettu",
    
    // CTA
    "cta.title": "Valmis uuteen ilmeeseen?",
    "cta.description": "Varaa aikasi jo tänään ja anna meidän huolehtia hiuksistasi. Ensimmäinen askel uuteen tyyliin on vain klikkauksen päässä.",
    "cta.bookNow": "Varaa aika nyt",
    
    // Booking
    "booking.title": "Varaa aika",
    "booking.subtitle": "Valitse palvelu, aika ja täytä yhteystietosi.",
    "booking.step.service": "Palvelu",
    "booking.step.time": "Aika",
    "booking.step.details": "Tiedot",
    "booking.step.done": "Valmis",
    "booking.selectService": "Valitse palvelu",
    "booking.selectTime": "Valitse aika",
    "booking.date": "Päivämäärä",
    "booking.time": "Kellonaika",
    "booking.contactInfo": "Yhteystiedot",
    "booking.yourBooking": "Varauksesi:",
    "booking.at": "klo",
    "booking.name": "Nimi",
    "booking.phone": "Puhelin",
    "booking.email": "Sähköposti",
    "booking.notes": "Lisätiedot (valinnainen)",
    "booking.notesPlaceholder": "Esim. erityistoiveita palvelusta",
    "booking.back": "Takaisin",
    "booking.continue": "Jatka",
    "booking.confirm": "Vahvista varaus",
    "booking.submitting": "Lähetetään...",
    "booking.success.title": "Kiitos varauksestasi!",
    "booking.success.message": "Olemme vastaanottaneet varauksesi. Lähetämme vahvistuksen sähköpostiisi",
    "booking.success.contact": "Mikäli sinulla on kysyttävää, ota yhteyttä puhelimitse.",
    "booking.success.details": "Varauksen tiedot:",
    "booking.success.service": "Palvelu",
    "booking.success.day": "Päivä",
    "booking.success.time": "Aika",
    "booking.success.name": "Nimi",
    "booking.success.home": "Palaa etusivulle",
    "booking.slotsBooked": "Yliviivatut ajat ovat jo varattuja.",
    "booking.slotJustBooked": "Tämä aika on juuri varattu. Valitse toinen aika.",
    "booking.error": "Varauksen tekeminen epäonnistui. Yritä uudelleen.",
    "booking.loadError": "Palveluiden lataus epäonnistui",
    
    // Validation
    "validation.nameTooShort": "Nimi on liian lyhyt",
    "validation.nameTooLong": "Nimi on liian pitkä",
    "validation.invalidEmail": "Virheellinen sähköpostiosoite",
    "validation.invalidPhone": "Virheellinen puhelinnumero",
    "validation.notesTooLong": "Lisätiedot ovat liian pitkät",
    
    // Services Page
    "servicesPage.title": "Palvelut & Hinnasto",
    "servicesPage.description": "Tarjoamme laajan valikoiman kampaamopalveluita koko perheelle. Kaikki hinnat sisältävät ammattitaitoisen konsultaation.",
    "servicesPage.category.haircuts": "Hiustenleikkaukset",
    "servicesPage.category.barber": "Parturipalvelut",
    "servicesPage.category.coloring": "Värjäykset & käsittelyt",
    "servicesPage.category.styling": "Kampaukset & muotoilu",
    "servicesPage.category.treatments": "Hoidot",
    "servicesPage.note": "Huom:",
    "servicesPage.noteText": "Hinnat ovat suuntaa-antavia ja voivat vaihdella hiusten pituuden ja paksuuden mukaan. Pyydämme vahvistamaan lopullisen hinnan varauksen yhteydessä tai paikan päällä. Pitkille ja erityisen paksuille hiuksille voidaan lisätä lisämaksu.",
    "servicesPage.cta.title": "Haluatko varata ajan?",
    "servicesPage.cta.description": "Varaa aika helposti verkossa tai soita meille suoraan.",
    "servicesPage.cta.bookOnline": "Varaa aika verkossa",
    "servicesPage.cta.call": "Soita",
    
    // About Page
    "about.title": "Meistä",
    "about.intro1": "Kampaamo Amarillo on Kumpulassa sijaitseva perheyritys, joka on palvellut helsinkiläisiä jo yli 20 vuoden ajan. Meidän filosofiamme perustuu henkilökohtaiseen palveluun, ammattitaitoon ja aitoon välittämiseen jokaisesta asiakkaasta.",
    "about.intro2": "Uskomme, että jokainen asiakas ansaitsee yksilöllistä huomiota ja räätälöityjä ratkaisuja. Siksi kuuntelemme tarkasti toiveitasi ja yhdistämme ne ammattitaitoomme luodaksemme juuri sinulle sopivan tyylin.",
    "about.owner": "Omistaja & Kampaaja",
    "about.values.title": "Meidän arvomme",
    "about.values.warmth.title": "Sydämellisyys",
    "about.values.warmth.desc": "Jokainen asiakas on meille tärkeä. Luomme lämpimän ja tervetulleen ilmapiirin, jossa voit rentoutua ja nauttia palvelusta.",
    "about.values.expertise.title": "Ammattitaito",
    "about.values.expertise.desc": "Yli 20 vuoden kokemus ja jatkuva kouluttautuminen takaavat laadukkaan lopputuloksen joka kerta.",
    "about.values.community.title": "Yhteisöllisyys",
    "about.values.community.desc": "Olemme osa Kumpulan yhteisöä ja tunnemme monet asiakkaamme nimeltä. Tämä on enemmän kuin kampaamo – se on kohtaamispaikka.",
    "about.story.title": "Meidän tarina",
    "about.story.p1": "Kampaamo Amarillo sai alkunsa unelmasta luoda paikka, jossa jokainen asiakas voi tuntea olonsa erityiseksi. Satu Thusberg aloitti uransa kampaajana 90-luvulla ja perusti oman liikkeensä Kumpulaan, alueelle joka on lähellä hänen sydäntään.",
    "about.story.p2": "Vuosien varrella liikkeemme on kasvanut ja kehittynyt, mutta perusarvomme ovat pysyneet samoina: laadukas palvelu, aito välittäminen ja ammattitaitoinen työ. Monet asiakkaistamme ovat käyneet meillä jo vuosikymmeniä, ja näemme monen perheen lasten kasvavan.",
    "about.story.p3": 'Nimemme "Amarillo" tarkoittaa espanjaksi keltaista – aurinkoa, lämpöä ja iloa. Haluamme tuoda jokaiseen päivään ripauksen aurinkoa ja hyvää mieltä.',
    "about.cta.title": "Tule tutustumaan meihin",
    "about.cta.description": "Varaa aikasi ja koe itse Amarillon lämmin tunnelma.",
    
    // Contact Page
    "contact.title": "Yhteystiedot",
    "contact.subtitle": "Ota meihin yhteyttä tai tule käymään. Löydät meidät Kumpulan sydämestä.",
    "contact.info.title": "Yhteystietomme",
    "contact.address.label": "Osoite",
    "contact.address.detail": "Kumpulan alueella, hyvät julkiset yhteydet",
    "contact.businessInfo": "Yritystiedot",
    "contact.company": "Yritys",
    "contact.tradeName": "Toiminimi",
    "contact.industry": "Toimiala",
    "contact.industryValue": "Parturi- ja kampaamopalvelut",
    "contact.form.title": "Lähetä viesti",
    "contact.form.name": "Nimi",
    "contact.form.email": "Sähköposti",
    "contact.form.phone": "Puhelin",
    "contact.form.message": "Viesti",
    "contact.form.messagePlaceholder": "Kirjoita viestisi tähän...",
    "contact.form.privacy": "Käsittelemme tietojasi luottamuksellisesti GDPR-säädösten mukaisesti.",
    "contact.form.send": "Lähetä viesti",
    "contact.form.sending": "Lähetetään...",
    "contact.form.success": "Viesti lähetetty! Otamme sinuun yhteyttä pian.",
    
    // Gallery
    "gallery.title": "Galleria",
    "gallery.description": "Tutustu töihimme ja tilojemme tunnelmaan. Jokainen kuva kertoo tarinan ammattitaidostamme ja intohimostamme.",
    "gallery.all": "Kaikki",
    "gallery.spaces": "Tilat",
    "gallery.cuts": "Leikkaukset",
    "gallery.styles": "Kampaukset",
    "gallery.colors": "Värjäykset",
    "gallery.empty": "Ei kuvia tässä kategoriassa.",
    
    // Footer
    "footer.description": "Laadukkaat kampaamopalvelut sydämellisessä ilmapiirissä Kumpulassa, Helsingissä.",
    "footer.navigation": "Navigointi",
    "footer.contact": "Yhteystiedot",
    "footer.hours": "Aukioloajat",
    "footer.rights": "Kaikki oikeudet pidätetään.",
    "footer.privacy": "Tietosuoja",
    "footer.terms": "Käyttöehdot",
    
    // 404
    "notFound.title": "Sivua ei löydy",
    "notFound.description": "Etsimääsi sivua ei ole olemassa tai se on siirretty.",
    "notFound.home": "Palaa etusivulle",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
