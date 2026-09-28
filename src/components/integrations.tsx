import { CalendarDots, CheckCircle, InstagramLogo } from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";

export function Integrations() {
  return (
    <section id="gestion-redes" className="scroll-mt-20 border-y border-zinc-800 bg-zinc-900/20 py-16 md:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm text-zinc-400"><InstagramLogo size={18} aria-hidden="true" />Un próximo paso, cuando lo necesites</p>
            <h2 className="mt-4 max-w-[19ch] text-balance text-3xl font-medium tracking-tight text-zinc-50 md:text-4xl">Creá primero.<br />Sumá tus redes después.</h2>
            <p className="mt-5 max-w-[49ch] text-base leading-relaxed text-zinc-400">No necesitás conectar una cuenta para crear contenido. Si más adelante querés organizar y publicar desde el mismo lugar, el plan Contenido + redes sumará esa ayuda.</p>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4"><CalendarDots size={25} className="shrink-0 text-zinc-400" aria-hidden="true" /><div><h3 className="font-medium text-zinc-100">Prepará tu semana</h3><p className="mt-2 text-sm leading-relaxed text-zinc-400">Calendario y publicaciones programadas para una cuenta de Instagram.</p></div></div>
            <div className="flex gap-4"><CheckCircle size={25} className="shrink-0 text-zinc-400" aria-hidden="true" /><div><h3 className="font-medium text-zinc-100">Vos tenés la última palabra</h3><p className="mt-2 text-sm leading-relaxed text-zinc-400">Revisás cada publicación y autorizás la conexión de tu cuenta.</p></div></div>
            <p className="border-t border-zinc-800 pt-5 text-xs leading-relaxed text-zinc-500">Esta función está en preparación. Hoy podés crear, descargar y compartir tus imágenes y videos por tu cuenta.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
