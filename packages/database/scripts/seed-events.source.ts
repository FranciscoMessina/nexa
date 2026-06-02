import type { categoryEnum } from "../src/schema/enums"

type DbCategory = (typeof categoryEnum.enumValues)[number]

/** Datos alineados con `events`, `event_gallery_images`, `event_entrepreneurs` y `event_attendees`. */
export type SeedEvent = {
  id: string
  createdBySeedKey: string
  title: string
  summary: string
  location: string
  startsAt: Date
  endsAt?: Date | null
  category: Array<DbCategory>
  description: string
  priceAmount: string
  priceCurrency: string
  priceLabel: string
  favoritesCount: number
  registrationUrl?: string | null
  requirements: string
  latitude: number
  longitude: number
  galleryUrls: Array<string>
  entrepreneurSeedKeys?: Array<string>
  attendeeSeedKeys?: Array<string>
}

/** 3 eventos en mayo (ya pasaron) y el resto en junio, respecto a «hoy» en el año actual. */
function demoDate(month: number, day: number, hour = 20, minute = 0): Date {
  const year = new Date().getFullYear()
  return new Date(year, month - 1, day, hour, minute, 0, 0)
}

export const seedEvents: Array<SeedEvent> = [
  {
    id: "3f1f7b2d-7f1e-4d1c-a6e7-3b2a8b1b7d1a",
    createdBySeedKey: "profile-brutal-bar",
    title: "Promo de vinos en Brutal",
    summary:
      "Promoción de etiquetas seleccionadas con tabla de quesos y fiambres del bar, y jazz en vivo a cargo de una banda local.",
    location: "Brutal, Callao 1863, Recoleta",
    startsAt: demoDate(6, 6, 20),
    category: ["gastronomia"],
    description:
      "Brutal presenta una promo de vinos con degustación de cuatro etiquetas y una tabla de quesos y fiambres preparada por el local. La velada incluye una charla breve de maridaje y música en vivo de Loza Jazz, en un formato íntimo para pocas mesas.",
    priceAmount: "0",
    priceCurrency: "ARS",
    priceLabel: "",
    favoritesCount: 47,
    registrationUrl: "https://passline.com/eventos/noche-de-vinos-en-brutal",
    requirements:
      "Mayores de 18 años. La promo incluye vinos y tabla de quesos del bar. Música en vivo por emprendimiento invitado.",
    latitude: -34.5874,
    longitude: -58.3928,
    galleryUrls: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=1200&q=80",
    ],
    entrepreneurSeedKeys: ["profile-loza-jazz"],
  },
  {
    id: "a7d4e6d1-2b8f-4d5f-9b73-0d6b0e6d9a11",
    createdBySeedKey: "profile-antares-bar",
    title: "DJ Set en Antares",
    summary:
      "Noche íntima en el bar cervecero con set del DJ invitado, cervezas de la casa y picada para cerrar la semana.",
    location: "Antares Bar, Av. Federico Lacroze 3455, Colegiales",
    startsAt: demoDate(6, 12, 22),
    category: ["musica"],
    description:
      "Antares Bar abre a la noche con un DJ set en formato reducido: música electrónica suave, cervezas artesanales y picada para compartir en mesas. El emprendimiento invitado pone la música; el bar organiza el espacio y la barra, sin pista masiva.",
    priceAmount: "0",
    priceCurrency: "ARS",
    priceLabel: "",
    favoritesCount: 83,
    requirements: "Mayores de 18 años.",
    latitude: -34.5742,
    longitude: -58.4478,
    galleryUrls: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    ],
    entrepreneurSeedKeys: ["profile-dj-mauri-vega"],
  },
  {
    id: "c2d1a8f4-6b31-4d5d-8b0d-6a3b5a0f2d44",
    createdBySeedKey: "profile-antares-bar",
    title: "Cata de Cervezas en Antares",
    summary:
      "Degustación guiada con variedad de estilos, maridajes sugeridos y espacio para conocer procesos de elaboración.",
    location: "Antares Bar, Av. Federico Lacroze 3455, Colegiales",
    startsAt: demoDate(5, 20, 19, 30),
    category: ["gastronomia"],
    description:
      "Una degustación guiada por el maestro cervecero de Antares donde se recorren seis estilos diferentes: desde una Kolsch refrescante hasta una Imperial Stout de guarda. Cada cerveza viene acompañada de un maridaje sugerido y una breve explicación del proceso de elaboración. Ideal para quienes quieren profundizar su conocimiento cervecero en un ambiente distendido.",
    priceAmount: "0",
    priceCurrency: "ARS",
    priceLabel: "",
    favoritesCount: 31,
    registrationUrl: "https://passline.com/eventos/cata-cervezas-antares",
    requirements:
      "Mayores de 18 años. Se incluyen 6 cervezas de 150 ml cada una y tabla de maridaje.",
    latitude: -34.5742,
    longitude: -58.4478,
    galleryUrls: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505075106905-fb052892c116?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "8b9a0d2c-3f4e-4d1b-9f0a-1c2d3e4f5a6b",
    createdBySeedKey: "profile-878-bar",
    title: "Jazz en Vivo en 878 Bar",
    summary:
      "Una sesión íntima con músicos locales, ambientación cálida y una carta pensada para acompañar la velada.",
    location: "878 Bar, Dique 3, Puerto Madero",
    startsAt: demoDate(6, 15, 21),
    category: ["musica"],
    description:
      "878 Bar recibe a Loza Jazz para una sesión íntima de jazz en vivo. El bar organiza la velada y la banda presenta estándares y temas propios para un público reducido, con barra del local.",
    priceAmount: "0",
    priceCurrency: "ARS",
    priceLabel: "",
    favoritesCount: 62,
    registrationUrl: "https://passline.com/eventos/jazz-878-bar",
    requirements: "Incluye una consumición de bienvenida.",
    latitude: -34.6098,
    longitude: -58.3615,
    galleryUrls: [
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470019693664-1d202d2c0907?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504509546545-e000b4a62425?auto=format&fit=crop&w=1200&q=80",
    ],
    entrepreneurSeedKeys: ["profile-loza-jazz"],
    attendeeSeedKeys: ["profile-maria-lopez"],
  },
  {
    id: "f0a1b2c3-d4e5-4f67-8a9b-0c1d2e3f4a5b",
    createdBySeedKey: "profile-maria-lopez",
    title: "Club de lectura en Café Rita",
    summary:
      "Encuentro comunitario para comentar una lectura compartida. Lo organiza una persona del barrio; el café solo presta el espacio.",
    location: "Café Rita, Federico Lacroze 2380, Chacarita",
    startsAt: demoDate(5, 15, 16),
    category: ["arte_y_cultura"],
    description:
      "María López convoca a vecinos y lectores para comentar 'Las correcciones' de Jonathan Franzen en Café Rita. Es un evento comunitario: quien organiza es una usuaria de Nexa que asiste a otros eventos del barrio; el café facilita mesas, café y medialunas con un arancel simbólico.",
    priceAmount: "0",
    priceCurrency: "ARS",
    priceLabel: "",
    favoritesCount: 19,
    requirements:
      "Se recomienda haber leído al menos la mitad del libro. Evento comunitario, no oficial del café.",
    latitude: -34.5886,
    longitude: -58.4542,
    galleryUrls: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "6d7e8f90-1a2b-4c3d-9e0f-123456789abc",
    createdBySeedKey: "profile-estudio-pulso",
    title: "Taller de acuarela en Café Walden",
    summary:
      "Taller comunitario de acuarela dictado por un emprendimiento creativo en un café de Villa Crespo.",
    location: "Café Walden, Niceto Vega 5186, Villa Crespo",
    startsAt: demoDate(6, 24, 15),
    category: ["talleres_y_cursos"],
    description:
      "Estudio Pulso, emprendimiento de arte y talleres, organiza una tarde de acuarela en Café Walden. Incluye materiales, demostración de técnicas básicas y espacio para terminar una pieza propia. El café presta el salón en formato comunitario.",
    priceAmount: "0",
    priceCurrency: "ARS",
    priceLabel: "",
    favoritesCount: 38,
    registrationUrl: "https://passline.com/eventos/acuarela-cafe-walden",
    requirements:
      "No se requiere experiencia previa. Materiales incluidos. Traer ropa que pueda mancharse.",
    latitude: -34.5968,
    longitude: -58.4382,
    galleryUrls: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e",
    createdBySeedKey: "profile-maria-lopez",
    title: "Yoga al Aire Libre en Parque Centenario",
    summary:
      "Clase abierta de yoga para todos los niveles, en un entorno verde al aire libre en Colegiales.",
    location: "Parque Centenario, Av. Patricias Argentinas, Colegiales",
    startsAt: demoDate(5, 10, 10),
    category: ["deportes"],
    description:
      "María López organiza una clase abierta de yoga en Parque Centenario para vecinos del barrio. Es un evento comunitario, no oficial del espacio público: traé tu mat o alquilá una en el lugar.",
    priceAmount: "0",
    priceCurrency: "ARS",
    priceLabel: "",
    favoritesCount: 54,
    requirements: "Traer mat o toalla. Ropa cómoda recomendada.",
    latitude: -34.5756,
    longitude: -58.4491,
    galleryUrls: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "e2f3a4b5-c6d7-4e8f-9a0b-1c2d3e4f5a6b",
    createdBySeedKey: "profile-bar-basilico",
    title: "Banda de Rock en vivo en Bar Basílico",
    summary:
      "Noche de rock nacional en Corrientes con Roots & Calle, banda de rock nacional invitada. El bar organiza la velada; la banda presenta su repertorio en vivo.",
    location: "Bar Basílico, Av. Corrientes 1662, Microcentro",
    startsAt: demoDate(6, 21, 21),
    category: ["musica"],
    description:
      "Bar Basílico presenta a Roots & Calle, banda de rock nacional, en un show íntimo para público reducido. El dúo porteño recorre clásicos y temas propios del rock nacional argentino. El bar cura la noche; la banda, como emprendimiento musical, lleva el show en vivo. Entrada con consumición mínima y mesas numeradas.",
    priceAmount: "0",
    priceCurrency: "ARS",
    priceLabel: "",
    favoritesCount: 91,
    requirements:
      "Mayores de 18 años. Se recomienda llegar antes de las 21 hs.",
    latitude: -34.6042,
    longitude: -58.3856,
    galleryUrls: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    ],
    entrepreneurSeedKeys: ["profile-roots-calle"],
    attendeeSeedKeys: ["profile-maria-lopez"],
  },
  {
    id: "a4b5c6d7-e8f9-4a0b-1c2d-3e4f5a6b7c8d",
    createdBySeedKey: "profile-cafe-tabac",
    title: "Pop-up de marcas de ropa en Bar Tabac",
    summary:
      "Feria barrial de indumentaria en el patio del bar: tres marcas de ropa locales y venta directa en stands.",
    location: "Bar Tabac, Guatemala 5860, Palermo",
    startsAt: demoDate(6, 28, 20),
    category: ["feria_de_emprendedores"],
    description:
      "Bar Tabac convoca a marcas de ropa del barrio para un pop-up de indumentaria en el patio. Participan Crudo, Indigo Wear y Urbe Street con piezas limitadas y probadores, mientras el bar ofrece tragos y picadas. Entrada libre, formato comunitario.",
    priceAmount: "0",
    priceCurrency: "ARS",
    priceLabel: "",
    favoritesCount: 41,
    requirements:
      "Entrada libre. Venta directa en stands de las marcas participantes.",
    latitude: -34.586,
    longitude: -58.4298,
    galleryUrls: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    ],
    entrepreneurSeedKeys: [
      "profile-crudo",
      "profile-indigo-wear",
      "profile-urbe-street",
    ],
  },
]
