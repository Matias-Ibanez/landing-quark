import ScrollMorphHero from "@/components/ui/scroll-morph-hero";

export function ContentShowcase() {
  return (
    <ScrollMorphHero compact>
      <div className="mx-auto max-w-lg px-6 text-center">
        <p className="text-sm text-zinc-400">Tu producto. Tu estilo.</p>
        <h2 className="mt-4 text-balance text-3xl font-medium leading-tight tracking-tight text-zinc-50 md:text-5xl">De una foto,<br />muchas ideas.</h2>
        <p className="mx-auto mt-5 max-w-[32ch] text-sm leading-relaxed text-zinc-300 md:text-base">Una promoción, un lanzamiento o un carrusel. Usá tus fotos para contar lo que hace especial a tu negocio.</p>
        <p className="mt-6 text-xs text-zinc-500">Fotos ilustrativas de distintos rubros.</p>
      </div>
    </ScrollMorphHero>
  );
}
