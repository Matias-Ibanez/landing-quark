import Link from "next/link";
import { EnvelopeSimple, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { Container } from "@/components/ui/container";
import { site, contactHref } from "@/lib/site";

function Mark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="4.5" r="2.5" fill="currentColor" />
      <circle cx="4.5" cy="15" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="15.5" cy="15" r="2.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-900">
      <Container className="py-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-sm">
            <Link
              href="#"
              className="flex items-center gap-2.5 text-zinc-50"
            >
              <Mark />
              <span className="font-mono text-sm font-semibold uppercase tracking-[0.2em]">
                {site.name}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Agente conversacional y generativo de marketing para PyMEs y
              comercios. {site.tagline}.
            </p>
          </div>

          <div className="flex gap-16">
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
                Contacto
              </p>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href={contactHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
                  >
                    <WhatsappLogo size={16} />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.contactEmail}`}
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
                  >
                    <EnvelopeSimple size={16} />
                    {site.contactEmail}
                  </a>
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
