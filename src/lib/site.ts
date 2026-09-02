export const site = {
  name: "QUARK",
  tagline: "Marketing en piloto automático",
  // TODO: reemplazar con el email real de contacto.
  contactEmail: "hola@quark.example",
  // TODO: reemplazar con el número real de WhatsApp (formato internacional, sin signo +).
  whatsapp: "5490000000000",
  nav: [
    { label: "Producto", href: "#solucion" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Planes", href: "#planes" },
  ],
} as const;

export const contactHref = `https://wa.me/${
  site.whatsapp
}?text=${encodeURIComponent("Hola, quiero una demo de QUARK.")}`;
