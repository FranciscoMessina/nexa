import type { EventCardData } from "../types"

export const featuredEvent: EventCardData = {
  id: "3f1f7b2d-7f1e-4d1c-a6e7-3b2a8b1b7d1a",
  label: {
    type: "verified",
    text: "Evento verificado",
  },
  title: "Noche de Vinos en Brutal",
  location: "Brutal, Honduras 5862, Palermo",
  date: new Date("2025-06-20T20:00:00"),
  category: "Gastronomía y Bebidas",
  image: {
    src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
    alt: "Personas compartiendo una velada en un bar con luces cálidas y botellas al fondo",
  },
  ctaText: "Ver más detalle",
  ctaHref: "/dashboard",
}

export const mockEvents: Array<EventCardData> = [
  featuredEvent,
  {
    id: "a7d4e6d1-2b8f-4d5f-9b73-0d6b0e6d9a11",
    label: {
      type: "community",
      text: "Evento comunitario",
    },
    title: "DJ Set en Café Tabac",
    location: "Café Tabac, Guatemala 5860, Palermo",
    date: new Date("2025-06-21T18:00:00"),
    category: "Música",
    image: {
      src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
      alt: "DJ tocando en un espacio nocturno con luces cálidas y público alrededor",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/dashboard",
  },
  {
    id: "c2d1a8f4-6b31-4d5d-8b0d-6a3b5a0f2d44",
    label: {
      type: "verified",
      text: "Evento verificado",
    },
    title: "Cata de Cervezas en Antares",
    location: "Antares Bar, Costa Rica 6028, Palermo",
    date: new Date("2025-06-22T19:30:00"),
    category: "Gastronomía y Bebidas",
    image: {
      src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
      alt: "Vasos de cerveza artesanales servidos sobre una mesa de madera",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/dashboard",
  },
  {
    id: "8b9a0d2c-3f4e-4d1b-9f0a-1c2d3e4f5a6b",
    label: {
      type: "community",
      text: "Evento comunitario",
    },
    title: "Jazz en Vivo en 878 Bar",
    location: "878 Bar, Thames 878, Palermo",
    date: new Date("2025-06-27T21:00:00"),
    category: "Música",
    image: {
      src: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80",
      alt: "Banda de jazz tocando en un bar con iluminación tenue",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/dashboard",
  },
  {
    id: "f0a1b2c3-d4e5-4f67-8a9b-0c1d2e3f4a5b",
    label: {
      type: "community",
      text: "Evento comunitario",
    },
    title: "Club de Lectura en Café Rita",
    location: "Café Rita, Armenia 1543, Palermo",
    date: new Date("2025-06-28T16:00:00"),
    category: "Cultura y Educación",
    image: {
      src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
      alt: "Grupo de personas leyendo y conversando en una cafetería",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/dashboard",
  },
  {
    id: "6d7e8f90-1a2b-4c3d-9e0f-123456789abc",
    label: {
      type: "community",
      text: "Evento comunitario",
    },
    title: "Tarde de Acuarela en La Bicicletaría",
    location: "La Bicicletaría, Niceto Vega 5186, Palermo",
    date: new Date("2025-06-29T15:00:00"),
    category: "Arte y Cultura",
    image: {
      src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
      alt: "Mesa de trabajo con pinceles, papeles y acuarelas",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/dashboard",
  },
]
