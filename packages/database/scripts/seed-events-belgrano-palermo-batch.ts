import { randomUUID } from "node:crypto"
import postgres from "postgres"
import { insertSeedAuthUsers } from "./seed-auth"

type DbCategory =
  | "ropa"
  | "feria_de_emprendedores"
  | "arte_y_cultura"
  | "cine_y_entretenimiento"
  | "deportes"
  | "gastronomia"
  | "musica"
  | "talleres_y_cursos"

type EventSeed = {
  id: string
  title: string
  summary: string
  description: string
  location: string
  startsAt: string
  category: DbCategory
  requirements: string
  priceAmount: string
  priceLabel: string
  baseAttendanceCount: number
  latitude: number
  longitude: number
  organizerEmail: string
  organizerDisplayName: string
  organizerVerified: boolean
  entrepreneurNames: Array<string>
  galleryUrls: Array<string>
}

const ENTREPRENEUR_EMAILS: Record<string, string> = {
  "Bruma Arte": "brumaarte@gmail.com",
  "Estudio Prisma": "estudioprisma@gmail.com",
  "Nudo Sur": "nudosur@gmail.com",
  "Julia Vinyl Club": "juliavinylclub@gmail.com",
  GEIESE: "geiese@gmail.com",
  "Sur en Dos": "surendos@gmail.com",
  CRUDO: "crudo@gmail.com",
  "Tomi Discos": "tomidiscosdj@gmail.com",
  "Tierra Taller": "tierrataller@gmail.com",
  "Tango de Esquina": "tangodeesquina@gmail.com",
  "Club del Vermú": "clubdelvermu@gmail.com",
  "Lautaro Vega": "lautarovegadj@gmail.com",
  "Sol Navarro": "solnavarrodj@gmail.com",
  "Fiambres del Pasaje": "fiambresdelpasaje@gmail.com",
  "Dulce Colegiales": "dulcecolegiales@gmail.com",
  "Wok Chico": "wokchico@gmail.com",
  "Empanadas del Barrio": "empanadasdelbarrio@gmail.com",
}

const GALLERY_DEFAULTS: Record<DbCategory, Array<string>> = {
  musica: [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&w=1200&q=80",
  ],
  feria_de_emprendedores: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
  ],
  talleres_y_cursos: [
    "https://images.unsplash.com/photo-1767476106330-4e5a0b4dcf94?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
  ],
  arte_y_cultura: [
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
  ],
  cine_y_entretenimiento: [
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1606166188517-cc8e6c4d6b67?auto=format&fit=crop&w=1200&q=80",
  ],
  deportes: [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
  ],
  gastronomia: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  ],
  ropa: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
  ],
}

const EVENTS: Array<EventSeed> = [
  {
    id: "a1000012-0000-4000-8000-000000000012",
    title: "Noche de juegos de mesa en Café Registrado",
    summary:
      "Encuentro abierto para jugar juegos de mesa modernos acompañado de café de especialidad.",
    description:
      "Café Registrado convoca una noche de juegos de mesa modernos en Belgrano. El espacio propone mesas abiertas, café de especialidad y una dinámica distendida para conocer gente mientras se juega. Ideal para quienes buscan un plan entre semana con propuesta social y gastronómica.",
    location: "Café Registrado, Av. Crámer 1701, Belgrano, CABA",
    startsAt: "2026-07-03T19:30:00-03:00",
    category: "cine_y_entretenimiento",
    requirements: "Evento para mayores de 18 años.",
    priceAmount: "0",
    priceLabel: "",
    baseAttendanceCount: 21,
    latitude: -34.5588,
    longitude: -58.4552,
    organizerEmail: "eventos.registrado@gmail.com",
    organizerDisplayName: "Café Registrado",
    organizerVerified: true,
    entrepreneurNames: [],
    galleryUrls: GALLERY_DEFAULTS.cine_y_entretenimiento,
  },
  {
    id: "a1000014-0000-4000-8000-000000000014",
    title: "Workshop de acuarela",
    summary: "Taller práctico de acuarela para principiantes.",
    description:
      "Punto Café y Bruma Arte organizan un workshop de acuarela pensado para principiantes. La jornada incluye materiales, demostración de técnicas básicas y espacio para experimentar con color y composición en un ambiente relajado del café.",
    location: "Punto Café, Av. Cabildo 1999, Belgrano, CABA",
    startsAt: "2026-07-05T16:00:00-03:00",
    category: "talleres_y_cursos",
    requirements: "Materiales incluidos.",
    priceAmount: "12000",
    priceLabel: "$12.000",
    baseAttendanceCount: 18,
    latitude: -34.5564,
    longitude: -58.4581,
    organizerEmail: "puntocafe.eventos@gmail.com",
    organizerDisplayName: "Punto Café",
    organizerVerified: true,
    entrepreneurNames: ["Bruma Arte"],
    galleryUrls: GALLERY_DEFAULTS.talleres_y_cursos,
  },
  {
    id: "a1000015-0000-4000-8000-000000000015",
    title: "Sunset & Vinyl",
    summary: "Tarde de vinilos con cervezas artesanales.",
    description:
      "Baum Belgrano propone una tarde de Sunset & Vinyl con selección en vinilo a cargo de Julia Vinyl Club. El encuentro combina cervezas artesanales, música curada y un ambiente al aire libre para cerrar la semana en el barrio.",
    location: "Baum Belgrano, Av. del Libertador 5823, Belgrano, CABA",
    startsAt: "2026-07-10T18:30:00-03:00",
    category: "musica",
    requirements: "Mayores de 18 años.",
    priceAmount: "0",
    priceLabel: "",
    baseAttendanceCount: 31,
    latitude: -34.5549,
    longitude: -58.4435,
    organizerEmail: "baumbelgrano@gmail.com",
    organizerDisplayName: "Baum Belgrano",
    organizerVerified: true,
    entrepreneurNames: ["Julia Vinyl Club"],
    galleryUrls: GALLERY_DEFAULTS.musica,
  },
  {
    id: "a1000019-0000-4000-8000-000000000019",
    title: "Taller de velas artesanales",
    summary: "Workshop de velas artesanales con técnicas básicas y materiales incluidos.",
    description:
      "LAB Tostadores de Café y Tierra Taller proponen un taller de velas artesanales en Palermo. La experiencia incluye materiales, demostración de técnicas básicas y la posibilidad de llevarse una pieza hecha en el encuentro.",
    location: "LAB Tostadores de Café, Costa Rica 5722, Palermo Hollywood, CABA",
    startsAt: "2026-07-07T17:00:00-03:00",
    category: "talleres_y_cursos",
    requirements: "Materiales incluidos.",
    priceAmount: "0",
    priceLabel: "",
    baseAttendanceCount: 20,
    latitude: -34.5879,
    longitude: -58.4272,
    organizerEmail: "eventos@labtostadores.com.ar",
    organizerDisplayName: "LAB Tostadores de Café",
    organizerVerified: true,
    entrepreneurNames: ["Tierra Taller"],
    galleryUrls: GALLERY_DEFAULTS.talleres_y_cursos,
  },
  {
    id: "a1000020-0000-4000-8000-000000000020",
    title: "After Office Indie",
    summary: "After office con música en vinilo para cerrar la jornada laboral.",
    description:
      "La Fernetería Palermo convoca un after office indie con Tomi Discos en vinilo. El local propone promos de bebidas y un ambiente relajado para quienes buscan un plan entre semana con música curada en Palermo Hollywood.",
    location: "La Fernetería Palermo, Av. Santa Fe 5125, Palermo Hollywood, CABA",
    startsAt: "2026-07-08T19:00:00-03:00",
    category: "musica",
    requirements: "Mayores de 18 años.",
    priceAmount: "0",
    priceLabel: "",
    baseAttendanceCount: 34,
    latitude: -34.5868,
    longitude: -58.4255,
    organizerEmail: "eventos@laferneteria.com.ar",
    organizerDisplayName: "La Fernetería Palermo",
    organizerVerified: true,
    entrepreneurNames: ["Tomi Discos"],
    galleryUrls: GALLERY_DEFAULTS.musica,
  },
  {
    id: "a1000023-0000-4000-8000-000000000023",
    title: "Coffee & Books Club",
    summary: "Club de lectura informal con café de especialidad.",
    description:
      "LAB Tostadores de Café propone un encuentro de Coffee & Books Club para compartir lecturas, recomendaciones y charlas en torno a libros en un ambiente relajado de Palermo Hollywood.",
    location: "LAB Tostadores de Café, Costa Rica 5722, Palermo Hollywood, CABA",
    startsAt: "2026-07-14T17:00:00-03:00",
    category: "arte_y_cultura",
    requirements: "Entrada libre. Se sugiere traer un libro para recomendar.",
    priceAmount: "0",
    priceLabel: "",
    baseAttendanceCount: 18,
    latitude: -34.5879,
    longitude: -58.4272,
    organizerEmail: "eventos@labtostadores.com.ar",
    organizerDisplayName: "LAB Tostadores de Café",
    organizerVerified: true,
    entrepreneurNames: [],
    galleryUrls: GALLERY_DEFAULTS.arte_y_cultura,
  },
  {
    id: "a1000024-0000-4000-8000-000000000024",
    title: "DJ Sunset",
    summary: "Sunset con DJ set al aire libre en Palermo Soho.",
    description:
      "Dársena Bar Palermo presenta un DJ Sunset con Lautaro Vega y Sol Navarro. La propuesta combina electrónica al atardecer, consumiciones del bar y un formato distendido para comenzar la noche en Palermo.",
    location: "Dársena Bar Palermo, Honduras 5701, Palermo Soho, CABA",
    startsAt: "2026-07-11T18:30:00-03:00",
    category: "musica",
    requirements: "Mayores de 18 años.",
    priceAmount: "0",
    priceLabel: "",
    baseAttendanceCount: 29,
    latitude: -34.5895,
    longitude: -58.4328,
    organizerEmail: "eventos@darsenabar.com.ar",
    organizerDisplayName: "Dársena Bar Palermo",
    organizerVerified: true,
    entrepreneurNames: ["Lautaro Vega", "Sol Navarro"],
    galleryUrls: GALLERY_DEFAULTS.musica,
  },
  {
    id: "a1000025-0000-4000-8000-000000000025",
    title: "Picnic & Yoga",
    summary: "Encuentro al aire libre de yoga y picnic en el parque.",
    description:
      "Organizo un picnic con clase de yoga al aire libre en Parque Las Heras. Traé tu mat o toalla, ropa cómoda y ganas de compartir un rato activo y distendido al aire libre. Evento comunitario.",
    location: "Parque Las Heras, Av. Las Heras y Av. del Libertador, CABA",
    startsAt: "2026-07-06T10:00:00-03:00",
    category: "deportes",
    requirements: "Traer mat o toalla. Ropa cómoda. Encuentro al aire libre. Evento comunitario.",
    priceAmount: "0",
    priceLabel: "",
    baseAttendanceCount: 17,
    latitude: -34.5742,
    longitude: -58.4015,
    organizerEmail: "agustinarios@gmail.com",
    organizerDisplayName: "Agustina Ríos",
    organizerVerified: false,
    entrepreneurNames: [],
    galleryUrls: GALLERY_DEFAULTS.deportes,
  },
  {
    id: "a1000026-0000-4000-8000-000000000026",
    title: "Clase abierta de fotografía",
    summary: "Introducción a fotografía en exteriores con práctica guiada.",
    description:
      "Jardín Botánico convoca una clase abierta de fotografía en exteriores con Estudio Prisma. La propuesta incluye nociones básicas de composición, luz natural y práctica guiada entre los senderos del jardín.",
    location: "Jardín Botánico Carlos Thays, Av. Santa Fe 3951, Palermo, CABA",
    startsAt: "2026-07-08T11:00:00-03:00",
    category: "talleres_y_cursos",
    requirements: "Traer cámara o celular.",
    priceAmount: "0",
    priceLabel: "",
    baseAttendanceCount: 22,
    latitude: -34.5821,
    longitude: -58.4203,
    organizerEmail: "eventos@jardinbotanico.eventos@gmail.com",
    organizerDisplayName: "Jardín Botánico",
    organizerVerified: true,
    entrepreneurNames: ["Estudio Prisma"],
    galleryUrls: GALLERY_DEFAULTS.talleres_y_cursos,
  },
  {
    id: "a1000027-0000-4000-8000-000000000027",
    title: "Feria gastronómica",
    summary: "Feria con propuestas gastronómicas y emprendimientos locales.",
    description:
      "Plaza Italia convoca una feria gastronómica con emprendimientos de comida artesanal. Fiambres del Pasaje, Dulce Colegiales, Wok Chico y Club del Vermú participan con propuestas para degustar y descubrir sabores en un encuentro al aire libre de la zona.",
    location: "Plaza Italia, Av. Santa Fe y Av. Coronel Díaz, Palermo, CABA",
    startsAt: "2026-07-15T12:00:00-03:00",
    category: "gastronomia",
    requirements: "Entrada libre. Venta de productos en stands.",
    priceAmount: "0",
    priceLabel: "",
    baseAttendanceCount: 39,
    latitude: -34.5783,
    longitude: -58.4182,
    organizerEmail: "eventos@plazaitalia.eventos@gmail.com",
    organizerDisplayName: "Plaza Italia",
    organizerVerified: true,
    entrepreneurNames: ["Club del Vermú", "Fiambres del Pasaje", "Dulce Colegiales", "Wok Chico"],
    galleryUrls: GALLERY_DEFAULTS.gastronomia,
  },
  {
    id: "a1000028-0000-4000-8000-000000000028",
    title: "Taller de collage",
    summary: "Taller creativo de collage para principiantes.",
    description:
      "Lado V Café y Bruma Arte organizan un taller de collage en Palermo. La jornada incluye materiales, ejercicios guiados y espacio para crear piezas personales en un ambiente relajado del café.",
    location: "Lado V Café, Scalabrini Ortiz 1333, Palermo, CABA",
    startsAt: "2026-07-09T16:00:00-03:00",
    category: "talleres_y_cursos",
    requirements: "Materiales incluidos.",
    priceAmount: "0",
    priceLabel: "",
    baseAttendanceCount: 15,
    latitude: -34.5848,
    longitude: -58.4155,
    organizerEmail: "eventos@ladovcafe.com.ar",
    organizerDisplayName: "Lado V Café",
    organizerVerified: true,
    entrepreneurNames: ["Bruma Arte"],
    galleryUrls: GALLERY_DEFAULTS.talleres_y_cursos,
  },
  {
    id: "a1000029-0000-4000-8000-000000000029",
    title: "Intercambio cultural",
    summary: "Encuentro para compartir tradiciones, idiomas y experiencias.",
    description:
      "Organizo un intercambio cultural en el Jardín Botánico para conocer gente de distintos lugares y compartir experiencias en un formato abierto y distendido. Evento comunitario.",
    location: "Jardín Botánico Carlos Thays, Av. Santa Fe 3951, Palermo, CABA",
    startsAt: "2026-07-17T18:00:00-03:00",
    category: "arte_y_cultura",
    requirements: "Todos los intereses bienvenidos. Encuentro al aire libre. Evento comunitario.",
    priceAmount: "0",
    priceLabel: "",
    baseAttendanceCount: 20,
    latitude: -34.5821,
    longitude: -58.4203,
    organizerEmail: "nico.pereyra@gmail.com",
    organizerDisplayName: "Nico Pereyra",
    organizerVerified: false,
    entrepreneurNames: [],
    galleryUrls: GALLERY_DEFAULTS.arte_y_cultura,
  },
  {
    id: "a1000030-0000-4000-8000-000000000030",
    title: "Noche de Tango & Vermú",
    summary: "Velada de tango en vivo con degustación de vermuts.",
    description:
      "Milión presenta una noche de tango y vermú en Recoleta. Tango de Esquina interpreta exhibiciones en vivo y Club del Vermú suma una propuesta de degustación para acompañar la velada en uno de los bares más reconocidos de la zona.",
    location: "Milión, Paraná 1042, Recoleta, CABA",
    startsAt: "2026-07-18T21:00:00-03:00",
    category: "musica",
    requirements: "Mayores de 18 años. Consumición mínima. Se recomienda reservar.",
    priceAmount: "0",
    priceLabel: "",
    baseAttendanceCount: 27,
    latitude: -34.5958,
    longitude: -58.3925,
    organizerEmail: "eventos@milion.com.ar",
    organizerDisplayName: "Milión",
    organizerVerified: true,
    entrepreneurNames: ["Tango de Esquina", "Club del Vermú"],
    galleryUrls: GALLERY_DEFAULTS.musica,
  },
  {
    id: "a1000033-0000-4000-8000-000000000033",
    title: "Jazz & Wine Night",
    summary: "Noche de jazz en vinilo con maridaje de vinos.",
    description:
      "The Shelter Coffee presenta una Jazz & Wine Night con selección musical de Julia Vinyl Club. El café propone una velada íntima con jazz en vinilo y opciones de maridaje en Recoleta.",
    location: "The Shelter Coffee, Av. Callao 1494, Recoleta, CABA",
    startsAt: "2026-07-21T20:00:00-03:00",
    category: "musica",
    requirements: "Mayores de 18 años.",
    priceAmount: "0",
    priceLabel: "",
    baseAttendanceCount: 26,
    latitude: -34.5938,
    longitude: -58.3928,
    organizerEmail: "eventos@thesheltercoffee.com.ar",
    organizerDisplayName: "The Shelter Coffee",
    organizerVerified: true,
    entrepreneurNames: ["Julia Vinyl Club"],
    galleryUrls: GALLERY_DEFAULTS.musica,
  },
]

async function ensureOrganizer(
  sql: postgres.Sql,
  input: {
    email: string
    displayName: string
    verified: boolean
    location: string
    headline: string
  }
): Promise<string> {
  const email = input.email.toLowerCase()

  const existingPublic = await sql<{ id: string; auth_user_id: string }[]>`
    SELECT id::text, auth_user_id::text
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `

  if (existingPublic[0]) {
    if (input.verified) {
      await sql`
        UPDATE users
        SET
          validated_at = COALESCE(validated_at, NOW()),
          display_name = COALESCE(display_name, ${input.displayName}),
          updated_at = NOW()
        WHERE id = ${existingPublic[0].id}::uuid
      `
    }
    return existingPublic[0].id
  }

  let authUserId: string
  const existingAuth = await sql<{ id: string }[]>`
    SELECT id::text FROM auth.users WHERE email = ${email} LIMIT 1
  `

  if (existingAuth[0]) {
    authUserId = existingAuth[0].id
  } else {
    authUserId = randomUUID()
    await insertSeedAuthUsers(sql, [
      {
        id: authUserId,
        email,
        displayName: input.displayName,
        role: "organizador",
        canSignIn: true,
      },
    ])
  }

  const inserted = await sql<{ id: string }[]>`
    INSERT INTO users (
      auth_user_id,
      role,
      display_name,
      headline,
      location,
      email,
      validated_at
    )
    VALUES (
      ${authUserId}::uuid,
      'organizador',
      ${input.displayName},
      ${input.headline},
      ${input.location},
      ${email},
      ${input.verified ? new Date() : null}
    )
    RETURNING id::text
  `

  const userId = inserted[0]?.id
  if (!userId) {
    throw new Error(`No se pudo crear organizador ${email}`)
  }

  return userId
}

async function resolveOrganizerId(
  sql: postgres.Sql,
  event: EventSeed
): Promise<string> {
  const email = event.organizerEmail.toLowerCase()

  const existing = await sql<{ id: string; role: string }[]>`
    SELECT id::text, role
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `

  if (existing[0]) {
    if (event.organizerVerified && existing[0].role === "organizador") {
      await sql`
        UPDATE users
        SET validated_at = COALESCE(validated_at, NOW()), updated_at = NOW()
        WHERE id = ${existing[0].id}::uuid
      `
    }
    return existing[0].id
  }

  return ensureOrganizer(sql, {
    email,
    displayName: event.organizerDisplayName,
    verified: event.organizerVerified,
    location: event.location.split(",").slice(-2).join(",").trim(),
    headline: `Organizador de eventos en ${event.location.split(",")[0]?.trim() ?? "CABA"}.`,
  })
}

async function resolveEntrepreneurIds(
  sql: postgres.Sql,
  names: Array<string>
): Promise<Array<string>> {
  const ids: Array<string> = []

  for (const name of names) {
    const email = ENTREPRENEUR_EMAILS[name]
    if (!email) {
      throw new Error(`Emprendimiento desconocido: ${name}`)
    }

    const rows = await sql<{ id: string }[]>`
      SELECT id::text FROM users WHERE email = ${email.toLowerCase()} LIMIT 1
    `
    const user = rows[0]
    if (!user) {
      throw new Error(`No se encontró emprendimiento ${name} (${email})`)
    }
    ids.push(user.id)
  }

  return ids
}

async function upsertEvent(sql: postgres.Sql, event: EventSeed): Promise<void> {
  const organizerId = await resolveOrganizerId(sql, event)
  const entrepreneurIds = await resolveEntrepreneurIds(sql, event.entrepreneurNames)
  const startsAt = new Date(event.startsAt)

  const existing = await sql<{ id: string }[]>`
    SELECT id::text FROM events WHERE id = ${event.id}::uuid LIMIT 1
  `

  if (!existing[0]) {
    await sql`
      INSERT INTO events (
        id,
        created_by_user_id,
        title,
        summary,
        location,
        starts_at,
        category,
        description,
        price_amount,
        price_currency,
        price_label,
        favorites_count,
        requirements,
        latitude,
        longitude,
        base_attendance_count
      )
      VALUES (
        ${event.id}::uuid,
        ${organizerId}::uuid,
        ${event.title},
        ${event.summary},
        ${event.location},
        ${startsAt.toISOString()}::timestamptz,
        ARRAY[${event.category}]::category[],
        ${event.description},
        ${event.priceAmount},
        ${"ARS"},
        ${event.priceLabel},
        ${0},
        ${event.requirements},
        ${event.latitude},
        ${event.longitude},
        ${event.baseAttendanceCount}
      )
    `
  } else {
    await sql`
      UPDATE events
      SET
        created_by_user_id = ${organizerId}::uuid,
        title = ${event.title},
        summary = ${event.summary},
        location = ${event.location},
        starts_at = ${startsAt.toISOString()}::timestamptz,
        category = ARRAY[${event.category}]::category[],
        description = ${event.description},
        price_amount = ${event.priceAmount},
        price_currency = ${"ARS"},
        price_label = ${event.priceLabel},
        requirements = ${event.requirements},
        latitude = ${event.latitude},
        longitude = ${event.longitude},
        base_attendance_count = ${event.baseAttendanceCount},
        updated_at = NOW()
      WHERE id = ${event.id}::uuid
    `
  }

  await sql`DELETE FROM event_entrepreneurs WHERE event_id = ${event.id}::uuid`
  for (const userId of entrepreneurIds) {
    await sql`
      INSERT INTO event_entrepreneurs (event_id, user_id)
      VALUES (${event.id}::uuid, ${userId}::uuid)
    `
  }

  await sql`DELETE FROM event_gallery_images WHERE event_id = ${event.id}::uuid`

  for (const [index, url] of event.galleryUrls.entries()) {
    const n = index + 1
    const segment = String(n).padStart(4, "0")
    const last = String(n).padStart(12, "0")
    const imageId = `${event.id.slice(0, 8)}-${segment}-4000-8000-${last}`
    await sql`
      INSERT INTO event_gallery_images (id, event_id, url)
      VALUES (${imageId}::uuid, ${event.id}::uuid, ${url})
    `
  }
}

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  for (const event of EVENTS) {
    await upsertEvent(sql, event)
    console.log(`✓ ${event.title}`)
  }

  await sql.end({ timeout: 5 })
  console.log(`\n✓ ${EVENTS.length} eventos aplicados.`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
