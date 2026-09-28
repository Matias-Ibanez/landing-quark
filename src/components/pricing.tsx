import { ArrowRight, Check, Images, FilmStrip, ShareNetwork } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { contentPlans, socialPlan } from "@/lib/landing-plans";
import { chatHref } from "@/lib/site";

export function Pricing() {
  return (
    <section id="planes" className="scroll-mt-20 py-20 md:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-zinc-400">Elegí lo que querés crear</p>
            <h2 className="mt-4 max-w-[20ch] text-balance text-4xl font-medium leading-[1.1] tracking-tight text-zinc-50 md:text-5xl">Buen contenido.<br />Un precio a tu medida.</h2>
          </div>
          <p className="max-w-[33ch] text-base leading-relaxed text-zinc-400">Primero tus imágenes y videos. Si después querés ayuda con tus redes, también hay un plan para eso.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {contentPlans.map((plan, index) => {
            const dark = index === 1;
            const Icon = dark ? FilmStrip : Images;
            return (
              <article key={plan.id} data-surface={dark ? "dark" : "light"} aria-label={`Plan ${plan.name}`} className={`relative flex flex-col rounded-3xl p-7 md:p-9 ${dark ? "border border-zinc-600 bg-zinc-900 text-zinc-50" : "bg-zinc-100 text-zinc-950"}`}>
                <div className="flex items-center justify-between gap-4">
                  <Icon size={28} aria-hidden="true" />
                  <span className={`rounded-full px-3 py-1 text-xs ${dark ? "bg-zinc-800 text-zinc-200" : "bg-zinc-200 text-zinc-700"}`}>{dark ? "Sumá movimiento" : "Empezá por acá"}</span>
                </div>
                <h3 className="mt-7 text-2xl font-medium tracking-tight">{plan.name}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-600"}`}>{plan.description}</p>
                <p className="mt-7 flex items-baseline gap-2"><span className="text-5xl font-medium tracking-tight">US${plan.price}</span><span className={dark ? "text-zinc-400" : "text-zinc-600"}>/ mes</span></p>
                <div className={`mt-7 border-y py-5 ${dark ? "border-zinc-700" : "border-zinc-300"}`}>
                  <p className="text-lg font-medium">Hasta {plan.images} imágenes al mes</p>
                  <p className={`mt-1 text-sm ${dark ? "text-zinc-400" : "text-zinc-600"}`}>{plan.videos ? `+ ${plan.videos} videos al mes` : "Para compartir cuando quieras"}</p>
                </div>
                <ul className="my-7 flex-1 space-y-3">
                  {plan.features.map(feature => <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed"><Check size={18} className="mt-0.5 shrink-0" aria-hidden="true" />{feature}</li>)}
                  <li className="flex items-start gap-3 text-sm leading-relaxed"><Check size={18} className="mt-0.5 shrink-0" aria-hidden="true" />2 rondas de cambios por pieza</li>
                </ul>
                <Link href={chatHref} className={`inline-flex min-h-12 items-center justify-between gap-3 rounded-full px-6 text-sm font-medium transition-colors ${dark ? "bg-zinc-50 text-zinc-950 hover:bg-white" : "bg-zinc-950 text-white hover:bg-zinc-800"}`}>Probar {plan.name.toLowerCase()}<ArrowRight size={18} aria-hidden="true" /></Link>
              </article>
            );
          })}
        </div>

        <article className="mt-6 grid gap-7 rounded-3xl border border-zinc-800 bg-zinc-900/30 p-7 md:p-9 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center" aria-label="Plan Contenido + redes, próximamente">
          <div>
            <p className="flex items-center gap-2 text-xs text-zinc-400"><ShareNetwork size={16} aria-hidden="true" />Próximamente</p>
            <h3 className="mt-3 text-2xl font-medium tracking-tight text-zinc-100">{socialPlan.name}</h3>
            <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-zinc-400">Más contenido y ayuda para organizar y publicar en una cuenta de Instagram.</p>
          </div>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>{socialPlan.images} imágenes + {socialPlan.videos} videos al mes</li>
            <li>Calendario y publicaciones programadas</li>
            <li>Siempre revisás antes de publicar</li>
          </ul>
          <div>
            <p className="flex items-baseline gap-2 text-zinc-100"><span className="text-4xl font-medium tracking-tight">US${socialPlan.price}</span><span className="text-sm text-zinc-400">/ mes</span></p>
            <Link href="#gestion-redes" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-700 px-5 text-sm text-zinc-300 hover:text-white">Conocer el plan<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </article>

        <div className="mt-9 grid gap-5 border-t border-zinc-800 pt-6 md:grid-cols-2">
          <p className="max-w-[57ch] text-sm leading-relaxed text-zinc-400">Para comparar: nuestro plan de imágenes parte de US$9. <a href="https://help.openai.com/en/articles/6950777-what-is" target="_blank" rel="noopener noreferrer" className="underline decoration-zinc-600 underline-offset-4 hover:text-white">ChatGPT Plus cuesta US$20/mes</a>. Son servicios distintos; elegí según lo que necesite tu negocio.</p>
          <p className="max-w-[62ch] text-xs leading-relaxed text-zinc-500">Precios y cantidades propuestos para el lanzamiento, en dólares estadounidenses, antes de impuestos. Cada lámina de un carrusel cuenta como una imagen. La prueba actual no incluye cobros; la gestión de redes todavía no está disponible.</p>
        </div>
      </Container>
    </section>
  );
}
