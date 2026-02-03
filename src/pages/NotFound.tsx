import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-6xl md:text-8xl font-bold text-primary mb-4">
            404
          </h1>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t("notFound.title")}
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            {t("notFound.description")}
          </p>
          <Button asChild variant="gold" size="lg">
            <Link to="/">{t("notFound.home")}</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
