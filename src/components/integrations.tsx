import Image from "next/image";
import { Container } from "@/components/ui/container";

const platforms = [
  { name: "Instagram", slug: "instagram" },
  { name: "Facebook", slug: "facebook" },
  { name: "LinkedIn", slug: "linkedin" },
  { name: "WhatsApp", slug: "whatsapp" },
  { name: "Meta", slug: "meta" },
];

export function Integrations() {
  return (
    <section className="border-y border-zinc-900 py-12">
      <Container className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          Conectado con
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10">
          {platforms.map((platform) => (
            <Image
              key={platform.slug}
              src={`https://cdn.simpleicons.org/${platform.slug}/ffffff`}
              alt={platform.name}
              width={20}
              height={20}
              unoptimized
              className="h-5 w-5 opacity-40 transition-opacity duration-300 hover:opacity-90"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
