import { HeroSection } from "@/features/public-home/components/HeroSection";
import { AudienceSection } from "@/features/public-home/components/AudienceSection";
import { ProductSection } from "@/features/public-home/components/ProductSection";
import { ServicesSection } from "@/features/public-home/components/ServicesSection";  

export default function Home() {
  return (
    <>
      <HeroSection />
      <AudienceSection />
      <ProductSection />
      <ServicesSection />
    </>
  );
}
