import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { X } from "lucide-react";

// Placeholder gallery images
const galleryImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop", alt: "Kampaamotilat", category: "Tilat" },
  { id: 2, src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop", alt: "Naisten kampaus", category: "Kampaukset" },
  { id: 3, src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=600&fit=crop", alt: "Miesten leikkaus", category: "Leikkaukset" },
  { id: 4, src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=600&fit=crop", alt: "Hiusten värjäys", category: "Värjäykset" },
  { id: 5, src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&h=600&fit=crop", alt: "Parturituoli", category: "Tilat" },
  { id: 6, src: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&h=600&fit=crop", alt: "Juhlakampaus", category: "Kampaukset" },
  { id: 7, src: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&h=600&fit=crop", alt: "Naisten tyyli", category: "Leikkaukset" },
  { id: 8, src: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&h=600&fit=crop", alt: "Värikäs tulos", category: "Värjäykset" },
];

const categories = ["Kaikki", "Tilat", "Leikkaukset", "Kampaukset", "Värjäykset"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("Kaikki");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredImages = selectedCategory === "Kaikki"
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-warm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Galleria
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tutustu töihimme ja tilojemme tunnelmaan. Jokainen kuva kertoo tarinan ammattitaidostamme ja intohimostamme.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <button
                key={image.id}
                onClick={() => setLightboxImage(image.src)}
                className="group relative aspect-square overflow-hidden rounded-xl shadow-soft hover:shadow-elevated transition-all duration-300"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.alt}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              Ei kuvia tässä kategoriassa.
            </p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-white hover:text-gold transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightboxImage.replace("w=600&h=600", "w=1200&h=1200")}
            alt="Suurennettu kuva"
            className="max-w-full max-h-[90vh] rounded-lg shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Layout>
  );
}
