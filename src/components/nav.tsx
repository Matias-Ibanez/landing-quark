"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react/ssr";
import { Cta } from "@/components/ui/cta";
import { Container } from "@/components/ui/container";
import { Mark } from "@/components/ui/mark";
import { site, chatHref } from "@/lib/site";



export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-zinc-50"
          onClick={() => setOpen(false)}
        >
          <Mark />
          <span className="font-mono text-sm font-semibold uppercase tracking-[0.2em]">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Cta href={chatHref}>
            Probar Gratis
          </Cta>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 md:hidden"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </Container>

      {open ? (
        <div className="border-t border-zinc-900 md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-zinc-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3">
              <Cta href={chatHref} className="w-full">
                Probar Gratis
              </Cta>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
