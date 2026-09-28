import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { BusinessStory } from "@/components/business-story";
import { CreationFormats } from "@/components/creation-formats";
import { ContentShowcase } from "@/components/content-showcase";
import { HowItWorks } from "@/components/how-it-works";
import { Pricing } from "@/components/pricing";
import { Integrations } from "@/components/integrations";
import { Faq } from "@/components/faq";
import { About } from "@/components/about";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="quark-landing">
      <Nav />
      <main>
        <Hero />
        <BusinessStory />
        <HowItWorks />
        <CreationFormats />
        <ContentShowcase />
        <Pricing />
        <Integrations />
        <Faq />
        <About />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
