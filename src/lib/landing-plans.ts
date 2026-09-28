// Launch proposal only: this landing does not sell subscriptions or enforce quotas.
// Validate allowances against measured costs before enabling billing.
export const contentPlans = [
  {
    id: "images", name: "Imágenes", price: 9, images: 30, videos: 0,
    description: "Para mostrar tus productos, novedades y promociones.",
    features: ["Diseños con tus propias fotos", "Publicaciones y carruseles", "Colores y estilo de tu marca", "Imágenes nítidas y archivo editable"],
  },
  {
    id: "video", name: "Imágenes + videos", price: 15, images: 60, videos: 4,
    description: "Para sumar movimiento y contar un poco más.",
    features: ["Todo lo incluido en Imágenes", "Videos de hasta 60 segundos", "Animaciones o clips con tus fotos", "Voz y música opcionales"],
  },
] as const;

export const socialPlan = { name: "Contenido + redes", price: 29, images: 100, videos: 8, accountLimit: 1 } as const;
