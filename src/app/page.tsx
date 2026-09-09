import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Integrations } from "@/components/integrations";
import { Problem } from "@/components/problem";
import { HowItWorks } from "@/components/how-it-works";
import { Solution } from "@/components/solution";
import { WhyQuark } from "@/components/why-quark";
import { About } from "@/components/about";
import { Audience } from "@/components/audience";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Integrations />
        <Problem />
        <HowItWorks />
        <Solution />
        <WhyQuark />
        <About />
        <Audience />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
