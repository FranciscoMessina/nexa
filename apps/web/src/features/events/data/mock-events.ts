import type { EventCardData, EventItem } from "../types/event.types"

type CreateMockEventInput = {
  organizer: EventCardData["organizer"]
  label: EventCardData["label"]
  title: string
  summary: string
  location: string
  date: Date
  category: string
  image: EventCardData["image"]
  ctaText?: string
  ctaHref?: string
  description: string
  price: EventCardData["price"]
  gallery: Array<string>
  registrationUrl?: string
  participatingVentures?: EventCardData["participatingVentures"]
  attendeeProfileIds?: Array<string>
  requirements: string
  coordinates: EventCardData["coordinates"]
}

export const featuredEvent: EventCardData = {
  id: "3f1f7b2d-7f1e-4d1c-a6e7-3b2a8b1b7d1a",
  label: {
    type: "verified",
    text: "Evento verificado",
  },
  title: "Promo de vinos en Brutal",
  summary:
    "Promoción de etiquetas seleccionadas con tabla de quesos y fiambres del bar, y jazz en vivo a cargo de una banda local.",
  location: "Brutal, Callao 1863, Recoleta",
  date: new Date("2025-06-20T20:00:00"),
  category: "Gastronomía",
  image: {
    src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
    alt: "Personas compartiendo una velada en un bar con luces cálidas y botellas al fondo",
  },
  ctaText: "Ver más detalle",
  ctaHref: "/",

  description:
    "Brutal presenta una promo de vinos con degustación de cuatro etiquetas y una tabla de quesos y fiambres preparada por el local. La velada incluye una charla breve de maridaje y música en vivo de Loza Jazz, en un formato íntimo para pocas mesas.",
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
    profileId: "profile-brutal-bar",
    name: "Brutal Bar",
    avatarUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=100&q=80",
    verified: true,
    contactEmail: "eventos@brutal.bar",
  },
  participatingVentures: [{ profileId: "profile-loza-jazz" }],
  requirements:
    "Mayores de 18 años. La promo incluye vinos y tabla de quesos del bar. Música en vivo por emprendimiento invitado.",
  coordinates: {
    lat: -34.5874,
    lng: -58.3928,
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
    title: "DJ Set en Antares",
    summary:
      "Noche íntima en el bar cervecero con set del DJ invitado, cervezas de la casa y picada para cerrar la semana.",
    location: "Antares Bar, Av. Federico Lacroze 3455, Colegiales",
    date: new Date("2025-06-21T22:00:00"),
    category: "Música",
    image: {
      src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      alt: "DJ en un bar con luces cálidas y público reducido",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/",

    description:
      "Antares Bar abre a la noche con un DJ set en formato reducido: música electrónica suave, cervezas artesanales y picada para compartir en mesas. El emprendimiento invitado pone la música; el bar organiza el espacio y la barra. Cupo limitado, sin pista masiva.",
    price: {
      amount: 0,
      currency: "ARS",
      label: "Entrada libre",
    },
    gallery: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    ],
    savedCount: 83,
    registrationUrl: undefined,
    organizer: {
      profileId: "profile-antares-bar",
      name: "Antares Bar",
      avatarUrl:
        "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=100&q=80",
      verified: true,
      contactEmail: "eventos@antaresbar.com.ar",
    },
    participatingVentures: [{ profileId: "profile-dj-mauri-vega" }],
    requirements: "Mayores de 18 años. Cupo limitado. Reserva recomendada.",
    coordinates: {
      lat: -34.5742,
      lng: -58.4478,
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
    location: "Antares Bar, Av. Federico Lacroze 3455, Colegiales",
    date: new Date("2025-06-22T19:30:00"),
    category: "Gastronomía",
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
      profileId: "profile-antares-bar",
      name: "Antares Bar",
      avatarUrl:
        "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=100&q=80",
      verified: true,
      contactEmail: "eventos@antaresbar.com.ar",
    },
    requirements:
      "Mayores de 18 años. Se incluyen 6 cervezas de 150 ml cada una y tabla de maridaje.",
    coordinates: {
      lat: -34.5742,
      lng: -58.4478,
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
    location: "878 Bar, Dique 3, Puerto Madero",
    date: new Date("2025-06-27T21:00:00"),
    category: "Música",
    image: {
      src: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80",
      alt: "Banda de jazz tocando en un bar con iluminación tenue",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/",

    description:
      "878 Bar recibe a Loza Jazz para una sesión íntima de jazz en vivo. El bar organiza la velada y la banda presenta estándares y temas propios para un público reducido, con barra del local y reserva de mesas.",
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
      profileId: "profile-878-bar",
      name: "878 Bar",
      avatarUrl:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=100&q=80",
      verified: false,
      contactEmail: "reservas@878bar.com.ar",
    },
    participatingVentures: [{ profileId: "profile-loza-jazz" }],
    attendeeProfileIds: ["profile-maria-lopez"],
    requirements:
      "Se recomienda reservar lugar con anticipación. El precio incluye una consumición de bienvenida.",
    coordinates: {
      lat: -34.6098,
      lng: -58.3615,
    },
  },
  {
    id: "f0a1b2c3-d4e5-4f67-8a9b-0c1d2e3f4a5b",
    label: {
      type: "community",
      text: "Evento comunitario",
    },
    title: "Club de lectura en Café Rita",
    summary:
      "Encuentro comunitario para comentar una lectura compartida. Lo organiza una persona del barrio; el café solo presta el espacio.",
    location: "Café Rita, Federico Lacroze 2380, Chacarita",
    date: new Date("2025-06-28T16:00:00"),
    category: "Arte y Cultura",
    image: {
      src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
      alt: "Grupo de personas leyendo y conversando en una cafetería",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/",

    description:
      "María López convoca a vecinos y lectores para comentar 'Las correcciones' de Jonathan Franzen en Café Rita. Es un evento comunitario: quien organiza es una usuaria de Nexa que asiste a otros eventos del barrio; el café facilita mesas, café y medialunas con un arancel simbólico.",
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
      profileId: "profile-maria-lopez",
      name: "María López",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      verified: false,
      contactEmail: "maria.lopez@gmail.com",
    },
    requirements:
      "Se recomienda haber leído al menos la mitad del libro. Evento comunitario, no oficial del café.",
    coordinates: {
      lat: -34.5886,
      lng: -58.4542,
    },
  },
  {
    id: "6d7e8f90-1a2b-4c3d-9e0f-123456789abc",
    label: {
      type: "community",
      text: "Evento comunitario",
    },
    title: "Taller de acuarela en Café Walden",
    summary:
      "Taller comunitario de acuarela dictado por un emprendimiento creativo en un café de Villa Crespo.",
    location: "Café Walden, Niceto Vega 5186, Villa Crespo",
    date: new Date("2025-06-29T15:00:00"),
    category: "Talleres y Cursos",
    image: {
      src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
      alt: "Mesa de trabajo con pinceles, papeles y acuarelas",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/",

    description:
      "Estudio Pulso, emprendimiento de arte y talleres, organiza una tarde de acuarela en Café Walden. Incluye materiales, demostración de técnicas básicas y espacio para terminar una pieza propia. El café presta el salón; el formato es comunitario y con cupo acotado.",
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
    registrationUrl: "https://passline.com/eventos/acuarela-cafe-walden",
    organizer: {
      profileId: "profile-estudio-pulso",
      name: "Estudio Pulso",
      avatarUrl:
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=100&q=80",
      verified: false,
      contactEmail: "hola@estudiopulso.mock",
    },
    requirements:
      "No se requiere experiencia previa. Materiales incluidos. Traer ropa que pueda mancharse.",
    coordinates: {
      lat: -34.5968,
      lng: -58.4382,
    },
  },
  {
    id: "b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e",
    label: {
      type: "community",
      text: "Evento comunitario",
    },
    title: "Yoga al Aire Libre en Parque Centenario",
    summary:
      "Clase abierta de yoga para todos los niveles, en un entorno verde al aire libre en Colegiales.",
    location: "Parque Centenario, Av. Patricias Argentinas, Colegiales",
    date: new Date("2025-06-18T10:00:00"),
    category: "Deportes",
    image: {
      src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
      alt: "Grupo de personas practicando yoga al aire libre en una plaza",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/",
    description:
      "María López organiza una clase abierta de yoga en Parque Centenario para vecinos del barrio. Es un evento comunitario, no oficial del espacio público: cupo limitado, traé tu mat o alquilá una en el lugar.",
    price: {
      amount: 0,
      currency: "ARS",
      label: "Entrada libre",
    },
    gallery: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506126613645-ec7dba78f13a?auto=format&fit=crop&w=1200&q=80",
    ],
    savedCount: 54,
    organizer: {
      profileId: "profile-maria-lopez",
      name: "María López",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      verified: false,
      contactEmail: "maria.lopez@gmail.com",
    },
    requirements: "Traer mat o toalla. Ropa cómoda recomendada.",
    coordinates: {
      lat: -34.5756,
      lng: -58.4491,
    },
  },
  {
    id: "e2f3a4b5-c6d7-4e8f-9a0b-1c2d3e4f5a6b",
    label: {
      type: "verified",
      text: "Evento verificado",
    },
    title: "Rock nacional en vivo en Bar Basílico",
    summary:
      "Show de la banda Roots & Calle en un bar clásico de Corrientes. El bar organiza la noche; la banda es el emprendimiento invitado.",
    location: "Bar Basílico, Av. Corrientes 1662, Microcentro",
    date: new Date("2025-06-21T21:00:00"),
    category: "Música",
    image: {
      src: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80",
      alt: "Banda tocando en un bar con iluminación cálida y público sentado",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/",
    description:
      "Bar Basílico presenta a Roots & Calle en un show de rock nacional para un público reducido. El bar cura la velada y la banda, como emprendimiento musical, lleva el repertorio en vivo. Entrada con consumición mínima y mesas numeradas.",
    price: {
      amount: 6000,
      currency: "ARS",
      label: "$6.000 (incluye una consumición)",
    },
    gallery: [
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
    ],
    savedCount: 91,
    organizer: {
      profileId: "profile-bar-basilico",
      name: "Bar Basílico",
      avatarUrl:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=100&q=80",
      verified: true,
      contactEmail: "reservas@barbasilico.mock",
    },
    participatingVentures: [{ profileId: "profile-roots-calle" }],
    attendeeProfileIds: ["profile-maria-lopez"],
    requirements:
      "Mayores de 18 años. Se recomienda llegar antes de las 21 hs.",
    coordinates: {
      lat: -34.6042,
      lng: -58.3856,
    },
  },
  {
    id: "a4b5c6d7-e8f9-4a0b-1c2d-3e4f5a6b7c8d",
    label: {
      type: "community",
      text: "Evento comunitario",
    },
    title: "Pop-up de marcas de ropa en Bar Tabac",
    summary:
      "Feria barrial de indumentaria en el patio del bar: tres marcas de ropa locales y venta directa en stands.",
    location: "Bar Tabac, Guatemala 5860, Palermo",
    date: new Date("2025-06-25T20:00:00"),
    category: "Ferias de Emprendedores",
    image: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      alt: "Ropa exhibida en un pop-up de marcas locales dentro de un patio",
    },
    ctaText: "Ver más detalle",
    ctaHref: "/",
    description:
      "Bar Tabac convoca a marcas de ropa del barrio para un pop-up de indumentaria en el patio. Participan Crudo, Indigo Wear y Urbe Street con piezas limitadas y probadores, mientras el bar ofrece tragos y picadas. Entrada libre, formato comunitario.",
    price: {
      amount: 0,
      currency: "ARS",
      label: "Entrada libre",
    },
    gallery: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1469334031218-f5d0b85e357f?auto=format&fit=crop&w=1200&q=80",
    ],
    savedCount: 41,
    organizer: {
      profileId: "profile-cafe-tabac",
      name: "Bar Tabac",
      avatarUrl:
        "https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=100&q=80",
      verified: false,
      contactEmail: "info@cafetabac.com.ar",
    },
    participatingVentures: [
      { profileId: "profile-crudo" },
      { profileId: "profile-indigo-wear" },
      { profileId: "profile-urbe-street" },
    ],
    requirements:
      "Entrada libre. Venta directa en stands de las marcas participantes.",
    coordinates: {
      lat: -34.586,
      lng: -58.4298,
    },
  },
]

function buildMockEventId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID()
  }

  return `mock-event-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function createMockEvent(input: CreateMockEventInput): EventCardData {
  const event: EventCardData = {
    id: buildMockEventId(),
    label: input.label,
    title: input.title.trim(),
    summary: input.summary.trim(),
    location: input.location.trim(),
    date: input.date,
    category: input.category.trim(),
    image: {
      src: input.image.src.trim(),
      alt: input.image.alt.trim(),
    },
    ctaText: input.ctaText?.trim() || "Ver más detalle",
    ctaHref: input.ctaHref,
    description: input.description.trim(),
    price: {
      amount: input.price.amount,
      currency: input.price.currency.trim(),
      label: input.price.label.trim(),
    },
    gallery: input.gallery.map((image) => image.trim()).filter(Boolean),
    savedCount: 0,
    registrationUrl: input.registrationUrl?.trim() || undefined,
    organizer: input.organizer,
    participatingVentures: input.participatingVentures,
    attendeeProfileIds: input.attendeeProfileIds,
    requirements: input.requirements.trim(),
    coordinates: input.coordinates,
  }

  event.ctaHref = `/events/${event.id}`

  mockEvents.unshift(event)

  return event
}

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
    startsAt: event.date,
    dateLabel: formatCardDate(event.date),
    category: event.category,
    kind: event.label.type,
    imageUrl: event.image.src,
  }
}

export function getMockEventById(eventId: string): EventCardData | undefined {
  return mockEvents.find((event) => event.id === eventId)
}
