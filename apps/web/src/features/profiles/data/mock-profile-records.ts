import type { Profile } from "@/features/profiles/types/profile.types"

export const mockProfileRecords: Array<Profile> = [
  {
    id: "profile-maria-lopez",
    kind: "usuario",
    displayName: "María López",
    firstName: "María",
    lastName: "López",
    headline:
      "Amante de los eventos, la música y los encuentros que generan experiencias inolvidables.",
    location: "Palermo, CABA",
    city: "Palermo, CABA",
    categoryLabel: "Asistente",
    description:
      "Amante de los eventos, la música y los encuentros que generan experiencias inolvidables.",
    birthDate: "1998-08-15",
    memberSince: "mayo 2024",
    email: "maria.lopez@gmail.com",
    phone: "+54 11 1234 5678",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    socialLinks: [
      { id: "1", platform: "instagram", handle: "@marialopez" },
      { id: "2", platform: "facebook", handle: "María López" },
      { id: "3", platform: "twitter", handle: "@marialopez" },
      { id: "4", platform: "linkedin", handle: "María López" },
    ],
    statusBadge: { label: "Perfil activo", tone: "success" },
  },
  {
    id: "profile-cafe-tabac",
    kind: "organizador",
    displayName: "Bar Tabac",
    headline: "Bar de barrio con música, tragos de autor y eventos comunitarios en Palermo.",
    location: "Palermo, CABA",
    categoryLabel: "Bar / Cultura",
    description:
      "Bar Tabac es un bar de barrio en Palermo que combina noches de música, gastronomía de autor y encuentros con emprendimientos locales.",
    avatarUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [
      { id: "1", platform: "instagram", handle: "@cafetabac" },
      { id: "2", platform: "facebook", handle: "Café Tabac" },
      { id: "3", platform: "twitter", handle: "@cafetabac" },
      { id: "4", platform: "youtube", handle: "Café Tabac" },
    ],
    validationStatus: "validated",
    statusBadge: { label: "Organizador verificado", tone: "success" },
  },
  {
    id: "profile-crudo",
    kind: "emprendimiento",
    displayName: "Crudo",
    headline:
      "Marca de ropa urbana y atemporal. Piezas básicas, materiales de calidad y diseños que trascienden tendencias.",
    location: "Villa Crespo, CABA",
    categoryLabel: "Ropa",
    description:
      "Marca de ropa urbana y atemporal. Piezas básicas, materiales de calidad y diseños que trascienden tendencias.",
    avatarUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [
      { id: "1", platform: "instagram", handle: "@crudo.ok" },
      { id: "2", platform: "facebook", handle: "Crudo" },
      { id: "3", platform: "tiktok", handle: "@crudo.ok" },
      { id: "4", platform: "pinterest", handle: "Crudo" },
    ],
    statusBadge: { label: "Perfil activo", tone: "success" },
  },
  {
    id: "profile-brutal-bar",
    kind: "organizador",
    displayName: "Brutal Bar",
    headline: "Bar de vinos y experiencias gastronómicas en Recoleta.",
    location: "Recoleta, CABA",
    categoryLabel: "Gastronomía",
    description:
      "Brutal Bar propone encuentros alrededor del vino, con catas, maridajes y una carta pensada para compartir.",
    avatarUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ id: "1", platform: "instagram", handle: "@brutalbar" }],
    validationStatus: "validated",
    statusBadge: { label: "Organizador verificado", tone: "success" },
  },
  {
    id: "profile-antares-bar",
    kind: "organizador",
    displayName: "Antares Bar",
    headline: "Cervecería y bar con propuestas de degustación y eventos temáticos.",
    location: "Colegiales, CABA",
    categoryLabel: "Gastronomía",
    description: "Antares Bar ofrece catas guiadas y eventos para conocer estilos de cerveza artesanal.",
    avatarUrl:
      "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ id: "1", platform: "instagram", handle: "@antaresbar" }],
    validationStatus: "validated",
    statusBadge: { label: "Organizador verificado", tone: "success" },
  },
  {
    id: "profile-878-bar",
    kind: "organizador",
    displayName: "878 Bar",
    headline: "Bar de jazz y música en vivo con ambientación íntima.",
    location: "Puerto Madero, CABA",
    categoryLabel: "Música",
    description: "878 Bar es un espacio clásico de jazz en vivo con vista al dique de Puerto Madero.",
    avatarUrl:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ id: "1", platform: "instagram", handle: "@878bar" }],
    validationStatus: "validated",
    statusBadge: { label: "Organizador verificado", tone: "success" },
  },
  {
    id: "profile-cafe-rita",
    kind: "organizador",
    displayName: "Café Rita",
    headline: "Cafetería literaria y cultural con club de lectura mensual.",
    location: "Chacarita, CABA",
    categoryLabel: "Cultura",
    description: "Café Rita reúne a la comunidad lectora con encuentros, café y propuestas culturales.",
    avatarUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ id: "1", platform: "instagram", handle: "@caferita" }],
    validationStatus: "validated",
    statusBadge: { label: "Organizador verificado", tone: "success" },
  },
  {
    id: "profile-estudio-pulso",
    kind: "emprendimiento",
    displayName: "Estudio Pulso",
    headline: "Talleres de arte y encuentros creativos en espacios del barrio.",
    location: "Villa Crespo, CABA",
    categoryLabel: "Talleres y Cursos",
    description:
      "Estudio Pulso organiza talleres de acuarela, dibujo y arte comunitario en cafés y espacios culturales de CABA.",
    avatarUrl:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ id: "1", platform: "instagram", handle: "@estudiopulso" }],
    statusBadge: { label: "Perfil activo", tone: "success" },
  },
  {
    id: "profile-loza-jazz",
    kind: "emprendimiento",
    displayName: "Loza Jazz",
    headline: "Banda de jazz para veladas íntimas en bares y eventos gastronómicos.",
    location: "CABA",
    categoryLabel: "Música",
    description:
      "Loza Jazz es una banda de jazz que participa en eventos de bares y promos gastronómicas del circuito Nexa.",
    avatarUrl:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ id: "1", platform: "instagram", handle: "@lozajazz" }],
    statusBadge: { label: "Perfil activo", tone: "success" },
  },
  {
    id: "profile-dj-mauri-vega",
    kind: "emprendimiento",
    displayName: "Mauri Vega DJ",
    headline: "DJ para sets nocturnos en bares y eventos de barrio.",
    location: "Palermo, CABA",
    categoryLabel: "Música",
    description: "Mauri Vega propone sets electrónicos suaves para bares con formato íntimo y sin multitudes.",
    avatarUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ id: "1", platform: "instagram", handle: "@maurivegadj" }],
    statusBadge: { label: "Perfil activo", tone: "success" },
  },
  {
    id: "profile-roots-calle",
    kind: "emprendimiento",
    displayName: "Roots & Calle",
    headline: "Banda de rock nacional para shows en bares y eventos verificados.",
    location: "Microcentro, CABA",
    categoryLabel: "Música",
    description:
      "Roots & Calle es una banda de rock nacional que participa en noches de música en vivo de bares del centro.",
    avatarUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ id: "1", platform: "instagram", handle: "@rootsycalle" }],
    statusBadge: { label: "Perfil activo", tone: "success" },
  },
  {
    id: "profile-indigo-wear",
    kind: "emprendimiento",
    displayName: "Indigo Wear",
    headline: "Marca de ropa urbana con producción local y ediciones limitadas.",
    location: "Palermo, CABA",
    categoryLabel: "Ropa",
    description: "Indigo Wear diseña piezas urbanas en lotes chicos para ferias y pop-ups de emprendedores.",
    avatarUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ id: "1", platform: "instagram", handle: "@indigowear" }],
    statusBadge: { label: "Perfil activo", tone: "success" },
  },
  {
    id: "profile-urbe-street",
    kind: "emprendimiento",
    displayName: "Urbe Street",
    headline: "Streetwear de barrio con estampas propias y talleres en Villa Crespo.",
    location: "Villa Crespo, CABA",
    categoryLabel: "Ropa",
    description: "Urbe Street produce hoodies, remeras y gorras con tiradas cortas para ferias locales.",
    avatarUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ id: "1", platform: "instagram", handle: "@urbestreet" }],
    statusBadge: { label: "Perfil activo", tone: "success" },
  },
  {
    id: "profile-bar-basilico",
    kind: "organizador",
    displayName: "Bar Basílico",
    headline: "Bar de rock y música en vivo sobre Av. Corrientes, en el corazón del Microcentro.",
    location: "Microcentro, CABA",
    categoryLabel: "Música",
    description:
      "Bar Basílico es un clásico de Corrientes con shows en vivo, bandas tributo y noches de rock nacional todos los fines de semana.",
    avatarUrl:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ id: "1", platform: "instagram", handle: "@barbasilico" }],
    validationStatus: "validated",
    statusBadge: { label: "Organizador verificado", tone: "success" },
  },
  {
    id: "profile-luna-diseño",
    kind: "emprendimiento",
    displayName: "Luna Diseño",
    headline: "Accesorios artesanales y piezas de diseño independiente.",
    location: "Villa Crespo, CABA",
    categoryLabel: "Diseño",
    description: "Luna Diseño crea accesorios limitados con materiales recuperados y producción local.",
    avatarUrl:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=200&q=80",
    representativeImageUrl:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
    socialLinks: [{ id: "1", platform: "instagram", handle: "@lunadiseno" }],
    statusBadge: { label: "Perfil activo", tone: "success" },
  },
]