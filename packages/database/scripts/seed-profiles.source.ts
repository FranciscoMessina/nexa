import type { categoryEnum, socialPlatformEnum, userRoleEnum } from "../src/schema/enums"

type DbCategory = (typeof categoryEnum.enumValues)[number]
type DbRole = (typeof userRoleEnum.enumValues)[number]
type DbSocialPlatform = (typeof socialPlatformEnum.enumValues)[number]

export type SeedUserSocialLink = {
  platform: DbSocialPlatform
  handle?: string | null
  url?: string | null
}

/** Datos alineados con `users` + `user_social_links`. `seedKey` no es el UUID de la fila. */
export type SeedUser = {
  seedKey: string
  role: DbRole
  displayName: string
  headline?: string | null
  location?: string | null
  description?: string | null
  avatarUrl?: string | null
  representativeImageUrl?: string | null
  category?: Array<DbCategory>
  validatedAt?: Date | null
  email: string
  phone?: string | null
  birthDate?: string | null
  /** Reemplaza el antiguo `memberSince` de la UI; el mapper lo formatea desde `users.created_at`. */
  createdAt?: Date
  socialLinks: Array<SeedUserSocialLink>
}

export const seedUsers: Array<SeedUser> = [
  {
    seedKey: "profile-maria-lopez",
    role: "asistente",
    displayName: "María López",
    headline:
      "Amante de los eventos, la música y los encuentros que generan experiencias inolvidables.",
    location: "Palermo, CABA",
    description:
      "Amante de los eventos, la música y los encuentros que generan experiencias inolvidables.",
    birthDate: "1998-08-15",
    createdAt: new Date("2024-05-01T12:00:00.000Z"),
    email: "maria.lopez@gmail.com",
    phone: "+54 11 1234 5678",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    socialLinks: [
      { platform: "instagram", handle: "@marialopez" },
      { platform: "facebook", handle: "María López" },
      { platform: "twitter", handle: "@marialopez" },
    ],
  },
  {
    seedKey: "profile-cafe-tabac",
    role: "organizador",
    displayName: "Bar Tabac",
    headline: "Bar de barrio con música, tragos de autor y eventos comunitarios en Palermo.",
    location: "Palermo, CABA",
    category: ["gastronomia"],
    description:
      "Bar Tabac es un bar de barrio en Palermo que combina noches de música, gastronomía de autor y encuentros con emprendimientos locales.",
    email: "info@cafetabac.com.ar",
    avatarUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    validatedAt: new Date("2024-03-01T12:00:00Z"),
    socialLinks: [
      { platform: "instagram", handle: "@cafetabac" },
      { platform: "facebook", handle: "Café Tabac" },
      { platform: "twitter", handle: "@cafetabac" },
      { platform: "youtube", handle: "Café Tabac" },
    ],
  },
  {
    seedKey: "profile-crudo",
    role: "emprendedor",
    displayName: "Crudo",
    headline:
      "Marca de ropa urbana y atemporal. Piezas básicas, materiales de calidad y diseños que trascienden tendencias.",
    location: "Villa Crespo, CABA",
    category: ["ropa"],
    description:
      "Marca de ropa urbana y atemporal. Piezas básicas, materiales de calidad y diseños que trascienden tendencias.",
    avatarUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    email: "hola@crudo.mock",
    socialLinks: [
      { platform: "instagram", handle: "@crudo.ok" },
      { platform: "facebook", handle: "Crudo" },
      { platform: "tiktok", handle: "@crudo.ok" },
      { platform: "pinterest", handle: "Crudo" },
    ],
  },
  {
    seedKey: "profile-brutal-bar",
    role: "organizador",
    displayName: "Brutal Bar",
    headline: "Bar de vinos y experiencias gastronómicas en Recoleta.",
    location: "Recoleta, CABA",
    category: ["gastronomia"],
    description:
      "Brutal Bar propone encuentros alrededor del vino, con catas, maridajes y una carta pensada para compartir.",
    email: "eventos@brutal.bar",
    avatarUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    validatedAt: new Date("2024-03-01T12:00:00Z"),
    socialLinks: [{ platform: "instagram", handle: "@brutalbar" }],
  },
  {
    seedKey: "profile-antares-bar",
    role: "organizador",
    displayName: "Antares Bar",
    headline: "Cervecería y bar con propuestas de degustación y eventos temáticos.",
    location: "Colegiales, CABA",
    category: ["gastronomia"],
    description: "Antares Bar ofrece catas guiadas y eventos para conocer estilos de cerveza artesanal.",
    email: "eventos@antaresbar.com.ar",
    avatarUrl:
      "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    validatedAt: new Date("2024-03-01T12:00:00Z"),
    socialLinks: [{ platform: "instagram", handle: "@antaresbar" }],
  },
  {
    seedKey: "profile-878-bar",
    role: "organizador",
    displayName: "878 Bar",
    headline: "Bar de jazz y música en vivo con ambientación íntima.",
    location: "Puerto Madero, CABA",
    category: ["musica"],
    description: "878 Bar es un espacio clásico de jazz en vivo con vista al dique de Puerto Madero.",
    email: "reservas@878bar.com.ar",
    avatarUrl:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80",
    validatedAt: new Date("2024-03-01T12:00:00Z"),
    socialLinks: [{ platform: "instagram", handle: "@878bar" }],
  },
  {
    seedKey: "profile-cafe-rita",
    role: "organizador",
    displayName: "Café Rita",
    headline: "Cafetería literaria y cultural con club de lectura mensual.",
    location: "Chacarita, CABA",
    category: ["arte_y_cultura"],
    description: "Café Rita reúne a la comunidad lectora con encuentros, café y propuestas culturales.",
    email: "hola@caferita.mock",
    avatarUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
    validatedAt: new Date("2024-03-01T12:00:00Z"),
    socialLinks: [{ platform: "instagram", handle: "@caferita" }],
  },
  {
    seedKey: "profile-estudio-pulso",
    role: "emprendedor",
    displayName: "Estudio Pulso",
    headline: "Talleres de arte y encuentros creativos en espacios del barrio.",
    location: "Villa Crespo, CABA",
    category: ["talleres_y_cursos"],
    description:
      "Estudio Pulso organiza talleres de acuarela, dibujo y arte comunitario en cafés y espacios culturales de CABA.",
    email: "hola@estudiopulso.mock",
    avatarUrl:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ platform: "instagram", handle: "@estudiopulso" }],
  },
  {
    seedKey: "profile-loza-jazz",
    role: "emprendedor",
    displayName: "Loza Jazz",
    headline: "Banda de jazz para veladas íntimas en bares y eventos gastronómicos.",
    location: "CABA",
    category: ["musica"],
    description:
      "Loza Jazz es una banda de jazz que participa en eventos de bares y promos gastronómicas del circuito Nexa.",
    email: "booking@lozajazz.mock",
    avatarUrl:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ platform: "instagram", handle: "@lozajazz" }],
  },
  {
    seedKey: "profile-dj-mauri-vega",
    role: "emprendedor",
    displayName: "Mauri Vega DJ",
    headline: "DJ para sets nocturnos en bares y eventos de barrio.",
    location: "Palermo, CABA",
    category: ["musica"],
    description: "Mauri Vega propone sets electrónicos suaves para bares con formato íntimo y sin multitudes.",
    email: "booking@maurivegadj.mock",
    avatarUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ platform: "instagram", handle: "@maurivegadj" }],
  },
  {
    seedKey: "profile-roots-calle",
    role: "emprendedor",
    displayName: "Roots & Calle",
    headline: "Banda de rock nacional para shows en bares y eventos verificados.",
    location: "Microcentro, CABA",
    category: ["musica"],
    description:
      "Roots & Calle es una banda de rock nacional que participa en noches de música en vivo de bares del centro.",
    email: "booking@rootsycalle.mock",
    avatarUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ platform: "instagram", handle: "@rootsycalle" }],
  },
  {
    seedKey: "profile-indigo-wear",
    role: "emprendedor",
    displayName: "Indigo Wear",
    headline: "Marca de ropa urbana con producción local y ediciones limitadas.",
    location: "Palermo, CABA",
    category: ["ropa"],
    description: "Indigo Wear diseña piezas urbanas en lotes chicos para ferias y pop-ups de emprendedores.",
    email: "hola@indigowear.mock",
    avatarUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ platform: "instagram", handle: "@indigowear" }],
  },
  {
    seedKey: "profile-urbe-street",
    role: "emprendedor",
    displayName: "Urbe Street",
    headline: "Streetwear de barrio con estampas propias y talleres en Villa Crespo.",
    location: "Villa Crespo, CABA",
    category: ["ropa"],
    description: "Urbe Street produce hoodies, remeras y gorras con tiradas cortas para ferias locales.",
    email: "hola@urbestreet.mock",
    avatarUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ platform: "instagram", handle: "@urbestreet" }],
  },
  {
    seedKey: "profile-bar-basilico",
    role: "organizador",
    displayName: "Bar Basílico",
    headline:
      "Bar de rock y música en vivo sobre Av. Corrientes, en el corazón del Microcentro.",
    location: "Microcentro, CABA",
    category: ["musica"],
    description:
      "Bar Basílico es un clásico de Corrientes con shows en vivo, bandas tributo y noches de rock nacional todos los fines de semana.",
    email: "reservas@barbasilico.mock",
    avatarUrl:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    validatedAt: new Date("2024-03-01T12:00:00Z"),
    socialLinks: [{ platform: "instagram", handle: "@barbasilico" }],
  },
  {
    seedKey: "profile-luna-diseño",
    role: "emprendedor",
    displayName: "Luna Diseño",
    headline: "Accesorios artesanales y piezas de diseño independiente.",
    location: "Villa Crespo, CABA",
    category: ["arte_y_cultura"],
    description: "Luna Diseño crea accesorios limitados con materiales recuperados y producción local.",
    email: "hola@lunadiseno.mock",
    avatarUrl:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ platform: "instagram", handle: "@lunadiseno" }],
  },
]
