import { Container } from "@/components/ui/container";
import { LogoCarousel, type CarouselLogo } from "@/components/ui/logo-carousel";

const platforms: CarouselLogo[] = [
  { name: "Instagram", src: "https://cdn.simpleicons.org/instagram/ffffff" },
  { name: "Facebook", src: "https://cdn.simpleicons.org/facebook/ffffff" },
  // Simple Icons dropped LinkedIn, so this one is served locally.
  { name: "LinkedIn", src: "/logos/linkedin.svg" },
  { name: "WhatsApp", src: "https://cdn.simpleicons.org/whatsapp/ffffff" },
  { name: "Meta", src: "https://cdn.simpleicons.org/meta/ffffff" },
];

export function Integrations() {
  return (
    <section className="border-y border-zinc-900 py-10">
      <Container className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <p className="max-w-[36ch] text-center text-sm text-zinc-500 md:text-left">
          Integraciones previstas mediante APIs oficiales, sujetas a los
          permisos de cada plataforma.
        </p>
        <LogoCarousel logos={platforms} columnCount={3} />
      </Container>
    </section>
  );
}
