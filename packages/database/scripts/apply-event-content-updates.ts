import { createHash, randomUUID } from "node:crypto"
import { mkdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import postgres from "postgres"
import { insertSeedAuthUsers } from "./seed-auth"

const FOOD_GALLERY = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
]

const COFI_JAUS_GALLERY = [
  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
]

const EVENTS_TO_DELETE = [
  "a1000022-0000-4000-8000-000000000022",
  "a1000021-0000-4000-8000-000000000021",
  "a1000018-0000-4000-8000-000000000018",
  "a1000046-0000-4000-8000-000000000046",
  "a1000016-0000-4000-8000-000000000016",
  "a1000013-0000-4000-8000-000000000013",
  "a1000050-0000-4000-8000-000000000050",
  "a1000032-0000-4000-8000-000000000032",
  "a1000031-0000-4000-8000-000000000031",
  "a1000051-0000-4000-8000-000000000051",
  "a1000056-0000-4000-8000-000000000056",
]

type FoodEntrepreneurSeed = {
  email: string
  slug: string
  displayName: string
  headline: string
  location: string
  description: string
  instagramHandle: string
}

const NEW_FOOD_ENTREPRENEURS: Array<FoodEntrepreneurSeed> = [
  {
    email: "fiambresdelpasaje@gmail.com",
    slug: "fiambres-del-pasaje",
    displayName: "Fiambres del Pasaje",
    headline: "Fiambres artesanales y picadas para ferias y eventos.",
    location: "Colegiales, CABA",
    description:
      "Elabora tablas de fiambres, quesos y conservas caseras para ferias gastronómicas y encuentros de barrio.",
    instagramHandle: "fiambresdelpasaje",
  },
  {
    email: "dulcecolegiales@gmail.com",
    slug: "dulce-colegiales",
    displayName: "Dulce Colegiales",
    headline: "Pastelería artesanal con tortas, galletas y dulces de estación.",
    location: "Colegiales, CABA",
    description:
      "Pastelería independiente con propuestas dulces y saladas para ferias, vermuts y eventos gastronómicos.",
    instagramHandle: "dulcecolegiales",
  },
  {
    email: "wokchico@gmail.com",
    slug: "wok-chico",
    displayName: "Wok Chico",
    headline: "Comida china casera en formato feria y pop-up.",
    location: "Palermo, CABA",
    description:
      "Emprendimiento de comida china con empanadas, rollitos y platos calientes para mercados y ferias.",
    instagramHandle: "wokchico.ba",
  },
  {
    email: "empanadasdelbarrio@gmail.com",
    slug: "empanadas-del-barrio",
    displayName: "Empanadas del Barrio",
    headline: "Empanadas artesanales con rellenos clásicos y de autor.",
    location: "Villa Crespo, CABA",
    description:
      "Produce empanadas caseras para ferias gastronómicas, vermuts y encuentros de emprendedores.",
    instagramHandle: "empanadasdelbarrio",
  },
]

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function paletteFromSeed(seed: string): {
  avatarBg: string
  avatarText: string
  repTop: string
  repBottom: string
  repAccent: string
} {
  const hash = createHash("sha256").update(seed).digest("hex")
  const pick = (offset: number) => `#${hash.slice(offset, offset + 6)}`

  return {
    avatarBg: pick(0),
    avatarText: pick(6),
    repTop: pick(12),
    repBottom: pick(18),
    repAccent: pick(24),
  }
}

async function generateAvatar(
  outputPath: string,
  label: string,
  bg: string,
  textColor: string
): Promise<void> {
  const text = label.length <= 4 ? label : initialsFor(label)
  const fontSize = text.length <= 2 ? 96 : text.length === 3 ? 72 : 56
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="${bg}"/>
      <circle cx="256" cy="256" r="200" fill="none" stroke="${textColor}" stroke-width="3" opacity="0.35"/>
      <text x="256" y="280" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" fill="${textColor}">${escapeXml(text)}</text>
    </svg>
  `

  await sharp(Buffer.from(svg)).png().toFile(outputPath)
}

async function generateRepresentative(
  outputPath: string,
  title: string,
  headline: string,
  top: string,
  bottom: string,
  accent: string
): Promise<void> {
  const svg = `
    <svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${top}"/>
          <stop offset="100%" stop-color="${bottom}"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#bg)"/>
      <circle cx="1320" cy="180" r="120" fill="${accent}" opacity="0.12"/>
      <circle cx="220" cy="720" r="180" fill="${accent}" opacity="0.08"/>
      <rect x="120" y="320" width="8" height="260" fill="${accent}" opacity="0.9"/>
      <text x="160" y="390" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="${accent}">${escapeXml(title)}</text>
      <text x="160" y="470" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="${accent}" opacity="0.85">${escapeXml(headline.slice(0, 72))}${headline.length > 72 ? "…" : ""}</text>
    </svg>
  `

  await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(outputPath)
}

async function ensureFoodEntrepreneur(
  sql: postgres.Sql,
  publicRoot: string,
  seed: FoodEntrepreneurSeed
): Promise<string> {
  const email = seed.email.toLowerCase()

  const existing = await sql<{ id: string }[]>`
    SELECT id::text FROM users WHERE email = ${email} LIMIT 1
  `
  if (existing[0]) {
    return existing[0].id
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
        displayName: seed.displayName,
        role: "emprendedor",
        canSignIn: false,
      },
    ])
  }

  const palette = paletteFromSeed(email)
  const dir = path.join(publicRoot, seed.slug)
  await mkdir(dir, { recursive: true })

  const avatarPath = path.join(dir, "avatar.png")
  const representativePath = path.join(dir, "representative.jpg")

  await generateAvatar(avatarPath, seed.displayName, palette.avatarBg, palette.avatarText)
  await generateRepresentative(
    representativePath,
    seed.displayName,
    seed.headline,
    palette.repTop,
    palette.repBottom,
    palette.repAccent
  )

  const avatarUrl = `/profiles/${seed.slug}/avatar.png`
  const representativeImageUrl = `/profiles/${seed.slug}/representative.jpg`

  const inserted = await sql<{ id: string }[]>`
    INSERT INTO users (
      auth_user_id,
      role,
      display_name,
      headline,
      location,
      email,
      description,
      category,
      avatar_url,
      representative_image_url
    )
    VALUES (
      ${authUserId}::uuid,
      'emprendedor',
      ${seed.displayName},
      ${seed.headline},
      ${seed.location},
      ${email},
      ${seed.description},
      ARRAY['gastronomia']::category[],
      ${avatarUrl},
      ${representativeImageUrl}
    )
    RETURNING id::text
  `

  const userId = inserted[0]?.id
  if (!userId) {
    throw new Error(`No se pudo crear emprendedor ${email}`)
  }

  await sql`
    DELETE FROM user_social_links
    WHERE user_id = ${userId}::uuid AND platform = 'instagram'
  `
  await sql`
    INSERT INTO user_social_links (user_id, platform, handle)
    VALUES (${userId}::uuid, 'instagram', ${seed.instagramHandle})
  `

  return userId
}

async function userIdByEmail(sql: postgres.Sql, email: string): Promise<string> {
  const rows = await sql<{ id: string }[]>`
    SELECT id::text FROM users WHERE email = ${email.toLowerCase()} LIMIT 1
  `
  const user = rows[0]
  if (!user) {
    throw new Error(`Usuario no encontrado: ${email}`)
  }
  return user.id
}

async function replaceEntrepreneurs(
  sql: postgres.Sql,
  eventId: string,
  emails: Array<string>
): Promise<void> {
  await sql`DELETE FROM event_entrepreneurs WHERE event_id = ${eventId}::uuid`
  for (const email of emails) {
    const userId = await userIdByEmail(sql, email)
    await sql`
      INSERT INTO event_entrepreneurs (event_id, user_id)
      VALUES (${eventId}::uuid, ${userId}::uuid)
      ON CONFLICT DO NOTHING
    `
  }
}

async function replaceGallery(
  sql: postgres.Sql,
  eventId: string,
  urls: Array<string>
): Promise<void> {
  await sql`DELETE FROM event_gallery_images WHERE event_id = ${eventId}::uuid`
  for (const [index, url] of urls.entries()) {
    const n = index + 1
    const segment = String(n).padStart(4, "0")
    const last = String(n).padStart(12, "0")
    const imageId = `${eventId.slice(0, 8)}-${segment}-4000-8000-${last}`
    await sql`
      INSERT INTO event_gallery_images (id, event_id, url)
      VALUES (${imageId}::uuid, ${eventId}::uuid, ${url})
    `
  }
}

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })
  const publicRoot = path.resolve(import.meta.dir, "../../../apps/web/public/profiles")

  console.log("Creando emprendimientos gastronómicos…")
  const foodIds: Record<string, string> = {}
  for (const seed of NEW_FOOD_ENTREPRENEURS) {
    foodIds[seed.email] = await ensureFoodEntrepreneur(sql, publicRoot, seed)
    console.log(`  ✓ ${seed.displayName}`)
  }

  console.log("\nEliminando eventos…")
  for (const eventId of EVENTS_TO_DELETE) {
    const deleted = await sql`
      DELETE FROM events WHERE id = ${eventId}::uuid RETURNING title
    `
    console.log(`  ✓ ${deleted[0]?.title ?? eventId}`)
  }

  const maxRow = await sql<{ max: Date | null }[]>`
    SELECT MAX(starts_at) AS max FROM events WHERE starts_at IS NOT NULL
  `
  const maxDate = maxRow[0]?.max ?? new Date()
  const featuredStartsAt = new Date(maxDate.getTime() + 24 * 60 * 60 * 1000)

  console.log("\nActualizando eventos…")

  const a1000043 = "a1000043-0000-4000-8000-000000000043"
  await sql`
    UPDATE events SET
      title = ${"Feria de ropa y arte"},
      summary = ${"Feria de indumentaria y arte independiente en Belgrano, con stands para recorrer y comprar."},
      description = ${"Punto Café abre sus puertas en Belgrano para una feria de ropa y arte con emprendedores locales. Stands para ver colecciones, probar talles y llevarse piezas únicas de diseño independiente, en un formato distendido con café de la casa."},
      location = ${"Punto Café, Av. Cabildo 1999, Belgrano, CABA"},
      latitude = ${-34.5564},
      longitude = ${-58.4581},
      category = ARRAY['feria_de_emprendedores']::category[],
      updated_at = NOW()
    WHERE id = ${a1000043}::uuid
  `
  await replaceEntrepreneurs(sql, a1000043, [
    "geiese@gmail.com",
    "surendos@gmail.com",
    "estudiolienzo@gmail.com",
  ])
  console.log("  ✓ Feria de ropa y arte")

  const a1000041 = "a1000041-0000-4000-8000-000000000041"
  await sql`
    UPDATE events SET
      title = ${"Noche de vermú y stands en Conde"},
      summary = ${"Vermut, gastronomía y stands de ropa y arte en Palermo."},
      description = ${"Noche de vermú en Conde con degustaciones y consumiciones especiales. Sumá una vuelta por los stands de emprendimientos de ropa y arte que acompañan la jornada: piezas para ver y comprar en un ambiente nocturno distendido."},
      category = ARRAY['gastronomia']::category[],
      updated_at = NOW()
    WHERE id = ${a1000041}::uuid
  `
  await replaceEntrepreneurs(sql, a1000041, [
    "clubdelvermu@gmail.com",
    "geiese@gmail.com",
    "brumaarte@gmail.com",
    "estudiolienzo@gmail.com",
  ])
  console.log("  ✓ Noche de vermú y stands en Conde")

  const a1000037 = "a1000037-0000-4000-8000-000000000037"
  await replaceEntrepreneurs(sql, a1000037, [
    "estudioprisma@gmail.com",
    "tomasferreyra@yahoo.com",
  ])
  console.log("  ✓ Noche de stand-up (Tomas Ferreyra agregado)")

  const a1000036 = "a1000036-0000-4000-8000-000000000036"
  await sql`
    UPDATE events SET
      title = ${"Feria de comida en Pasaje Colegiales"},
      summary = ${"Feria gastronómica con fiambres, pastelería, comida china y más en Colegiales."},
      description = ${"Pasaje Colegiales se llena de sabores: emprendimientos de comida artesanal con propuestas para degustar y llevar. Fiambres, pastelería, empanadas y comida china en un encuentro de barrio para recorrer stand por stand."},
      category = ARRAY['gastronomia']::category[],
      updated_at = NOW()
    WHERE id = ${a1000036}::uuid
  `
  await replaceEntrepreneurs(sql, a1000036, [
    "fiambresdelpasaje@gmail.com",
    "dulcecolegiales@gmail.com",
    "wokchico@gmail.com",
    "empanadasdelbarrio@gmail.com",
  ])
  await replaceGallery(sql, a1000036, FOOD_GALLERY)
  console.log("  ✓ Feria de comida en Pasaje Colegiales")

  const cofiJaus = "d6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a"
  await replaceGallery(sql, cofiJaus, COFI_JAUS_GALLERY)
  console.log("  ✓ Cofi Jaus — galería con portada de café/brunch")

  const a1000044 = "a1000044-0000-4000-8000-000000000044"
  await sql`
    UPDATE events SET
      title = ${"Noche de juegos de cartas en Kansas"},
      summary = ${"Torneo relajado de juegos de cartas modernos con cena."},
      description = ${"Kansas Bar propone una noche de juegos de cartas modernos en mesas abiertas. Formato distendido para jugar, conocer gente y cenar con la propuesta gastronómica del bar."},
      updated_at = NOW()
    WHERE id = ${a1000044}::uuid
  `
  console.log("  ✓ Noche de juegos de cartas en Kansas")

  const a1000045 = "a1000045-0000-4000-8000-000000000045"
  await sql`
    UPDATE events SET
      title = ${"Taller de pintura"},
      summary = ${"Artistas pintan en vivo con música ambiental."},
      updated_at = NOW()
    WHERE id = ${a1000045}::uuid
  `
  console.log("  ✓ Taller de pintura")

  const a1000047 = "a1000047-0000-4000-8000-000000000047"
  await sql`
    UPDATE events SET
      starts_at = ${featuredStartsAt.toISOString()}::timestamptz,
      updated_at = NOW()
    WHERE id = ${a1000047}::uuid
  `
  console.log(`  ✓ Taller cerámica Chacarita → ${featuredStartsAt.toISOString()}`)

  const a1000027 = "a1000027-0000-4000-8000-000000000027"
  await sql`
    UPDATE events SET
      description = ${"Plaza Italia convoca una feria gastronómica con emprendimientos de comida artesanal. Fiambres del Pasaje, Dulce Colegiales, Wok Chico y Club del Vermú participan con propuestas para degustar y descubrir sabores en un encuentro al aire libre."},
      updated_at = NOW()
    WHERE id = ${a1000027}::uuid
  `
  await replaceEntrepreneurs(sql, a1000027, [
    "clubdelvermu@gmail.com",
    "fiambresdelpasaje@gmail.com",
    "dulcecolegiales@gmail.com",
    "wokchico@gmail.com",
  ])
  console.log("  ✓ Feria gastronómica — emprendimientos de comida")

  const a1000048 = "a1000048-0000-4000-8000-000000000048"
  await sql`
    UPDATE events SET
      title = ${"Clase de baile en Colegiales"},
      summary = ${"Clase participativa de baile en un encuentro de barrio en Colegiales."},
      description = ${"Clase de baile abierta en Colegiales: ejercicios guiados, música en vivo y espacio para practicar en un formato accesible para distintos niveles. Encuentro de barrio para moverse y conocer gente."},
      location = ${"Pasaje Colegiales, Av. Federico Lacroze y Av. Dorrego, Colegiales, CABA"},
      category = ARRAY['arte_y_cultura']::category[],
      updated_at = NOW()
    WHERE id = ${a1000048}::uuid
  `
  await replaceEntrepreneurs(sql, a1000048, ["tangodeesquina@gmail.com"])
  console.log("  ✓ Clase de baile en Colegiales")

  await sql.end({ timeout: 5 })
  console.log("\nListo.")
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
