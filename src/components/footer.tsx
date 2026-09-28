import Link from "next/link";
import { ChatCircle, Question } from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";
import { Mark } from "@/components/ui/mark";
import { site, chatHref } from "@/lib/site";



export function Footer() {
  return (
    <footer className="border-t border-zinc-900">
      <Container className="py-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-sm">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-zinc-50"
            >
              <Mark />
              <span className="font-mono text-sm font-semibold uppercase tracking-[0.2em]">
                {site.name}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Menos tiempo pensando qué publicar. Más tiempo para tu negocio. QUARK te ayuda a crear contenido que muestre lo que hacés.
            </p>
          </div>

          <div className="flex gap-8 sm:gap-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600">
                Navegación
              </p>
              <ul className="mt-4 space-y-3">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-zinc-400 transition-colors hover:text-zinc-50"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600">
                Empezá con QUARK
              </p>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href={chatHref}
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
                  >
                    <ChatCircle size={16} aria-hidden="true" />
                    Probar QUARK
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
                  >
                    <Question size={16} aria-hidden="true" />
                    Resolver dudas
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-zinc-900 pt-8 sm:flex-row">
          <p className="text-sm text-zinc-600">
            © 2026 {site.name}. Todos los derechos reservados.
          </p>
          <p className="text-sm text-zinc-600">Noroeste Argentino</p>
        </div>
      </Container>
    </footer>
  );
}
