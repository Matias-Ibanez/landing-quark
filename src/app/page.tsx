import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Audience } from "@/components/audience";
import { Problem } from "@/components/problem";
import { HowItWorks } from "@/components/how-it-works";
import { WhyQuark } from "@/components/why-quark";
import { Pricing } from "@/components/pricing";
import { Integrations } from "@/components/integrations";
import { Faq } from "@/components/faq";
import { About } from "@/components/about";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Audience />
        <Problem />
        <HowItWorks />
        <WhyQuark />
        <Pricing />
        <Integrations />
        <Faq />
        <About />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
