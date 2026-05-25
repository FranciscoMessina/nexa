import type { EventCardData, EventItem } from "../types/event.types"

export const featuredEvent: EventCardData = {
  id: "3f1f7b2d-7f1e-4d1c-a6e7-3b2a8b1b7d1a",
  label: {
    type: "verified",
    text: "Evento verificado",
  },
  title: "Noche de Vinos en Brutal",
  summary:
    "Un encuentro pensado para compartir, descubrir nuevas etiquetas y conectar con la comunidad en un ambiente relajado.",
  location: "Brutal, Honduras 5862, Palermo",
  date: new Date("2025-06-20T20:00:00"),
  category: "Gastronomía y Bebidas",
  image: {
    src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
    alt: "Personas compartiendo una velada en un bar con luces cálidas y botellas al fondo",
  },
  ctaText: "Ver más detalle",
  ctaHref: "/",

  description:
    "Una velada especial en Brutal donde sommeliers y entusiastas del vino se reúnen para explorar nuevas etiquetas nacionales e importadas. Cada asistente tendrá la oportunidad de catar al menos cuatro variedades distintas acompañadas de una tabla de quesos y fiambres. El evento incluye una charla introductoria sobre maridajes y una sección de preguntas con el enólogo invitado.",
  price: {
    amount: 8500,
    currency: "ARS",
    label: "$8.500 por persona",
  },
  gallery: [
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=1200&q=80",
  ],
  savedCount: 47,
  registrationUrl: "https://passline.com/eventos/noche-de-vinos-en-brutal",
  organizer: {
    name: "Brutal Bar",
    avatarUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=100&q=80",
    verified: true,
    contactEmail: "eventos@brutal.bar",
  },
  requirements:
    "Mayores de 18 años. Se recomienda no consumir alimentos muy condimentados antes del evento.",
  coordinates: {
    lat: -34.5862,
    lng: -58.4326,
  },
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
    summary:
      "Una noche con sets en vivo, pista abierta y propuesta gastronómica para cerrar la semana con música y amigos.",
    location: "Café Tabac, Guatemala 5860, Palermo",
    date: new Date("2025-06-21T18:00:00"),
    category: "Música",
    image: {
      src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
      alt: "DJ tocando en un espacio nocturno con luces cálidas y público alrededor",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/",

    description:
      "Café Tabac abre su pista para una noche de música electrónica con sets en vivo de DJs locales emergentes. La propuesta combina música house y techno con una carta de cócteles de autor y opciones de picada para acompañar. Entrada libre hasta las 21 hs, después por orden de llegada según capacidad.",
    price: {
      amount: 0,
      currency: "ARS",
      label: "Entrada libre",
    },
    gallery: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=1200&q=80",
    ],
    savedCount: 83,
    registrationUrl: undefined,
    organizer: {
      name: "Café Tabac",
      avatarUrl:
        "https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=100&q=80",
      verified: false,
      contactEmail: "info@cafetabac.com.ar",
    },
    requirements: "Mayores de 18 años. Entrada libre hasta las 21 hs.",
    coordinates: {
      lat: -34.586,
      lng: -58.4298,
    },
  },
  {
    id: "c2d1a8f4-6b31-4d5d-8b0d-6a3b5a0f2d44",
    label: {
      type: "verified",
      text: "Evento verificado",
    },
    title: "Cata de Cervezas en Antares",
    summary:
      "Degustación guiada con variedad de estilos, maridajes sugeridos y espacio para conocer procesos de elaboración.",
    location: "Antares Bar, Costa Rica 6028, Palermo",
    date: new Date("2025-06-22T19:30:00"),
    category: "Gastronomía y Bebidas",
    image: {
      src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
      alt: "Vasos de cerveza artesanales servidos sobre una mesa de madera",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/",

    description:
      "Una degustación guiada por el maestro cervecero de Antares donde se recorren seis estilos diferentes: desde una Kolsch refrescante hasta una Imperial Stout de guarda. Cada cerveza viene acompañada de un maridaje sugerido y una breve explicación del proceso de elaboración. Ideal para quienes quieren profundizar su conocimiento cervecero en un ambiente distendido.",
    price: {
      amount: 12000,
      currency: "ARS",
      label: "$12.000 por persona",
    },
    gallery: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505075106905-fb052892c116?auto=format&fit=crop&w=1200&q=80",
    ],
    savedCount: 31,
    registrationUrl: "https://passline.com/eventos/cata-cervezas-antares",
    organizer: {
      name: "Antares Bar",
      avatarUrl:
        "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=100&q=80",
      verified: true,
      contactEmail: "eventos@antaresbar.com.ar",
    },
    requirements:
      "Mayores de 18 años. Se incluyen 6 cervezas de 150 ml cada una y tabla de maridaje.",
    coordinates: {
      lat: -34.587,
      lng: -58.431,
    },
  },
  {
    id: "8b9a0d2c-3f4e-4d1b-9f0a-1c2d3e4f5a6b",
    label: {
      type: "community",
      text: "Evento comunitario",
    },
    title: "Jazz en Vivo en 878 Bar",
    summary:
      "Una sesión íntima con músicos locales, ambientación cálida y una carta pensada para acompañar la velada.",
    location: "878 Bar, Thames 878, Palermo",
    date: new Date("2025-06-27T21:00:00"),
    category: "Música",
    image: {
      src: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80",
      alt: "Banda de jazz tocando en un bar con iluminación tenue",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/",

    description:
      "El mítico 878 Bar abre sus puertas para una sesión de jazz en vivo con el cuarteto de Martín Sued. El repertorio recorre estándares clásicos y composiciones originales en un ambiente íntimo de no más de 50 personas. La carta de la noche incluye cócteles clásicos y una selección de vinos para acompañar.",
    price: {
      amount: 5000,
      currency: "ARS",
      label: "$5.000 por persona (consumición incluida)",
    },
    gallery: [
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470019693664-1d202d2c0907?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504509546545-e000b4a62425?auto=format&fit=crop&w=1200&q=80",
    ],
    savedCount: 62,
    registrationUrl: "https://passline.com/eventos/jazz-878-bar",
    organizer: {
      name: "878 Bar",
      avatarUrl:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=100&q=80",
      verified: false,
      contactEmail: "reservas@878bar.com.ar",
    },
    requirements:
      "Se recomienda reservar lugar con anticipación. El precio incluye una consumición de bienvenida.",
    coordinates: {
      lat: -34.5823,
      lng: -58.4341,
    },
  },
  {
    id: "f0a1b2c3-d4e5-4f67-8a9b-0c1d2e3f4a5b",
    label: {
      type: "community",
      text: "Evento comunitario",
    },
    title: "Club de Lectura en Café Rita",
    summary:
      "Encuentro para comentar una lectura compartida, intercambiar ideas y descubrir nuevas recomendaciones.",
    location: "Café Rita, Armenia 1543, Palermo",
    date: new Date("2025-06-28T16:00:00"),
    category: "Cultura y Educación",
    image: {
      src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
      alt: "Grupo de personas leyendo y conversando en una cafetería",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/",

    description:
      "El Club de Lectura de Café Rita se reúne el último sábado de cada mes para comentar un libro previamente anunciado. Este mes el turno es de 'Las correcciones' de Jonathan Franzen. La dinámica es libre: cada participante puede traer sus anotaciones, preguntas o simplemente escuchar. Se sirve café y medialunas incluidos en la inscripción.",
    price: {
      amount: 2500,
      currency: "ARS",
      label: "$2.500 (café y medialunas incluidos)",
    },
    gallery: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
    ],
    savedCount: 19,
    registrationUrl: undefined,
    organizer: {
      name: "Café Rita",
      avatarUrl:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=100&q=80",
      verified: false,
      contactEmail: "hola@caferita.com.ar",
    },
    requirements:
      "Se recomienda haber leído al menos la mitad del libro. No es excluyente.",
    coordinates: {
      lat: -34.5891,
      lng: -58.4357,
    },
  },
  {
    id: "6d7e8f90-1a2b-4c3d-9e0f-123456789abc",
    label: {
      type: "community",
      text: "Evento comunitario",
    },
    title: "Tarde de Acuarela en La Bicicletaría",
    summary:
      "Actividad guiada para explorar técnicas básicas de acuarela, practicar trazos y salir con una pieza propia.",
    location: "La Bicicletaría, Niceto Vega 5186, Palermo",
    date: new Date("2025-06-29T15:00:00"),
    category: "Arte y Cultura",
    image: {
      src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
      alt: "Mesa de trabajo con pinceles, papeles y acuarelas",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/",

    description:
      "Una tarde de taller de acuarela guiado por la artista Lara Vidal, pensado para personas sin experiencia previa o con conocimientos básicos. Se trabaja sobre papel de acuarela de gramaje profesional y los materiales están incluidos. Al final de la sesión cada participante se lleva su obra terminada. El espacio es luminoso, con música ambiente y mesas compartidas que invitan al intercambio.",
    price: {
      amount: 9000,
      currency: "ARS",
      label: "$9.000 (materiales incluidos)",
    },
    gallery: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587037542529-12a14464ebbb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1200&q=80",
    ],
    savedCount: 38,
    registrationUrl: "https://passline.com/eventos/acuarela-bicicletaria",
    organizer: {
      name: "La Bicicletaría",
      avatarUrl:
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=100&q=80",
      verified: false,
      contactEmail: "talleres@labicicletaria.com.ar",
    },
    requirements:
      "No se requiere experiencia previa. Traer ropa cómoda que pueda mancharse. Materiales provistos por el espacio.",
    coordinates: {
      lat: -34.5844,
      lng: -58.4389,
    },
  },
]

function formatCardDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0")
  const month = date.toLocaleDateString("en-US", { month: "short" })
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  return `${day} ${month} ${year}, ${hours}:${minutes} hs`
}

function parseLocation(
  location: string
): Pick<EventItem, "venue" | "address" | "neighborhood"> {
  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)

  const [venue = location, ...remainingParts] = parts
  const neighborhood = remainingParts.at(-1) ?? ""
  const address = remainingParts.slice(0, -1).join(", ")

  return {
    venue,
    address,
    neighborhood,
  }
}

export function toEventItem(event: EventCardData): EventItem {
  const { venue, address, neighborhood } = parseLocation(event.location)

  return {
    id: event.id,
    title: event.title,
    venue,
    address,
    neighborhood,
    dateLabel: formatCardDate(event.date),
    category: event.category,
    kind: event.label.type,
    imageUrl: event.image.src,
  }
}

export function getMockEventById(eventId: string): EventCardData | undefined {
  return mockEvents.find((event) => event.id === eventId)
}
