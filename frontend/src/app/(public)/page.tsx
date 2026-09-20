import { HeroSection } from "@/features/public-home/components/HeroSection";
import { AudienceSection } from "@/features/public-home/components/AudienceSection";
import { ProductSection } from "@/features/public-home/components/ProductSection";
import { ServicesSection } from "@/features/public-home/components/ServicesSection";
import { HowItWorksSection } from "@/features/public-home/components/HowItWorksSection";
import { DifferentialsSection } from "@/features/public-home/components/DifferentialsSection";
import { ContactSection } from "@/features/public-home/components/ContactSection";
import { PlansSection } from "@/features/public-home/components/PlansSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AudienceSection />
      <ProductSection />
      <ServicesSection />
      <HowItWorksSection />
      <DifferentialsSection />
      <PlansSection />
      <ContactSection />
    </>
  );
}
