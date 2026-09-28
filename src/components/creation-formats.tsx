import { Images, FilmStrip, ArrowUpRight } from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";

export function CreationFormats() {
  return (
    <section id="que-podes-crear" className="py-14 md:py-24">
      <Container>
        <div className="max-w-3xl"><p className="text-sm text-zinc-400">Más maneras de mostrar lo que hacés</p><h2 className="mt-4 text-balance text-3xl font-medium tracking-tight text-zinc-50 md:text-5xl">Una idea puede ser una imagen.<br />O un video que la cuente.</h2></div>
        <div className="mt-10 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl bg-zinc-100 p-7 text-zinc-950 md:p-9" data-surface="light">
            <Images size={30} aria-hidden="true" /><h3 className="mt-7 text-2xl font-medium tracking-tight">Imágenes y carruseles</h3><p className="mt-3 max-w-[44ch] text-base leading-relaxed text-zinc-600">Para una promoción, un lanzamiento o una historia que necesita varias láminas. Elegís el formato y el diseño se adapta.</p>
            <div className="mt-7 flex items-end gap-3" aria-hidden="true"><div className="flex aspect-square w-[30%] items-end rounded-xl bg-zinc-950 p-3 text-xs text-white">Tu producto.</div><div className="flex aspect-[4/5] w-[30%] items-end rounded-xl bg-zinc-300 p-3 text-xs text-zinc-800">Tu historia.</div><div className="flex aspect-[9/16] w-[23%] items-end rounded-xl bg-zinc-800 p-3 text-xs text-white">Tu estilo.</div></div>
            <p className="mt-5 text-xs text-zinc-600">Publicación cuadrada, vertical o carrusel.</p>
          </article>
          <article className="flex flex-col rounded-3xl bg-zinc-900 p-7 text-zinc-100 md:p-9">
            <FilmStrip size={30} aria-hidden="true" /><h3 className="mt-7 text-2xl font-medium tracking-tight">Videos para contar más</h3><p className="mt-3 max-w-[41ch] text-base leading-relaxed text-zinc-400">Mostrá un producto con movimiento, explicá una idea con animaciones o armá un video corto con clips. Podés sumar voz y música.</p>
            <ul className="mt-7 space-y-3 border-t border-zinc-700 pt-6 text-sm text-zinc-300">{["Videos con tus fotos", "Animaciones para explicar", "Clips cortos con narración"].map(item => <li key={item} className="flex items-center gap-3"><ArrowUpRight size={16} aria-hidden="true" />{item}</li>)}</ul>
            <p className="mt-auto pt-7 text-xs text-zinc-400">QUARK te ayuda a elegir el estilo antes de crear.</p>
          </article>
        </div>
      </Container>
    </section>
  );
}
