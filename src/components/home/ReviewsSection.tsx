import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Maria K.",
    text: "Paras kampaamo Kumpulassa! Satu on todellinen ammattilainen ja aina ystävällinen. Olen käynyt täällä jo vuosia.",
    rating: 5,
  },
  {
    name: "Jukka L.",
    text: "Erinomainen palvelu ja hyvä hinta-laatusuhde. Miesten leikkaus on aina onnistunut täydellisesti.",
    rating: 5,
  },
  {
    name: "Anna S.",
    text: "Viihtyisä ja rauhallinen ilmapiiri. Hiusten värjäys onnistui juuri toivomallani tavalla. Suosittelen lämpimästi!",
    rating: 5,
  },
];

export function ReviewsSection() {
  return (
    <section className="py-16 lg:py-24 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-gold fill-gold" />
              ))}
            </div>
            <span className="text-2xl font-bold text-gold">4.8/5</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-background mb-4">
            Mitä asiakkaamme sanovat
          </h2>
          <p className="text-background/70 max-w-2xl mx-auto">
            Olemme ylpeitä erinomaisesta asiakaspalvelustamme ja tyytyväisistä asiakkaistamme.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-background/10 backdrop-blur-sm rounded-2xl p-8 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-gold/30" />
              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-background/90 mb-6 leading-relaxed">
                "{review.text}"
              </p>
              <p className="font-semibold text-gold">
                {review.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
