import { Layout } from "@/components/layout/Layout";
import { HeroSection, FeaturesSection } from "@/components/home/HeroSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { LocationSection } from "@/components/home/LocationSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <ServicesPreview />
      <ReviewsSection />
      <LocationSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
