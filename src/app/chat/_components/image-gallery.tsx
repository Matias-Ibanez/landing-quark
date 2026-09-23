"use client";

import { useState } from "react";
import { X, MagnifyingGlass } from "@phosphor-icons/react";

// ---------------------------------------------------------------------------
// ImageGallery — responsive grid of AI-generated marketing images.
// Uses picsum.photos with fixed seeds for deterministic placeholder images.
// ---------------------------------------------------------------------------

interface GalleryImage {
  readonly id: string;
  readonly url: string;
  readonly prompt: string;
  readonly date: string;
}

const MOCK_IMAGES: readonly GalleryImage[] = [
  {
    id: "img-1",
    url: "https://picsum.photos/seed/quark-1/600/600",
    prompt: "Banner minimalista para promo de invierno",
    date: "12 Sep",
  },
  {
    id: "img-2",
    url: "https://picsum.photos/seed/quark-2/600/600",
    prompt: "Story de Instagram para lanzamiento de producto",
    date: "10 Sep",
  },
  {
    id: "img-3",
    url: "https://picsum.photos/seed/quark-3/600/600",
    prompt: "Post de redes sociales estilo flat design",
    date: "8 Sep",
  },
  {
    id: "img-4",
    url: "https://picsum.photos/seed/quark-4/600/600",
    prompt: "Carrusel de fotos para campaña de verano",
    date: "5 Sep",
  },
  {
    id: "img-5",
    url: "https://picsum.photos/seed/quark-5/600/600",
    prompt: "Portada de newsletter semanal",
    date: "3 Sep",
  },
  {
    id: "img-6",
    url: "https://picsum.photos/seed/quark-6/600/600",
    prompt: "Diseño de flyer para evento presencial",
    date: "1 Sep",
  },
  {
    id: "img-7",
    url: "https://picsum.photos/seed/quark-7/600/600",
    prompt: "Gráfico de datos para informe mensual",
    date: "28 Ago",
  },
  {
    id: "img-8",
    url: "https://picsum.photos/seed/quark-8/600/600",
    prompt: "Mockup de producto para e-commerce",
    date: "25 Ago",
  },
] as const;

export function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        {/* section header */}
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80">
              <MagnifyingGlass size={20} weight="duotone" className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-zinc-50">Recursos Generados</h2>
              <p className="text-sm text-zinc-500">{MOCK_IMAGES.length} imágenes creadas con IA</p>
            </div>
          </div>

          {/* grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {MOCK_IMAGES.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedImage(img)}
                className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:border-zinc-700 hover:ring-1 hover:ring-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                {/* image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* hover overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="p-3">
                    <p className="line-clamp-2 text-xs leading-relaxed text-zinc-300">
                      {img.prompt}
                    </p>
                  </div>
                </div>

                {/* date badge — always visible */}
                <div className="absolute right-2 top-2 rounded-md bg-zinc-950/70 px-2 py-0.5 text-[11px] font-medium text-zinc-300 backdrop-blur-sm">
                  {img.date}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── lightbox modal ── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.prompt}
        >
          <div
            className="relative max-h-[85vh] max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-lg bg-zinc-950/70 text-zinc-400 backdrop-blur-sm transition-colors hover:bg-zinc-800 hover:text-zinc-50"
              aria-label="Cerrar vista previa"
            >
              <X size={18} />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.prompt}
              className="max-h-[70vh] w-full object-contain"
            />
            <div className="border-t border-zinc-800 p-4">
              <p className="text-sm text-zinc-300">{selectedImage.prompt}</p>
              <p className="mt-1 text-xs text-zinc-600">{selectedImage.date}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
