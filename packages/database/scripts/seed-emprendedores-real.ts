import { randomUUID } from "node:crypto"
import { mkdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import postgres from "postgres"
import { insertSeedAuthUsers } from "./seed-auth"

type EmprendedorSeed = {
  email: string
  slug: string
  displayName: string
  headline: string
  location: string
  category: string
  description: string
  instagramHandle: string
  avatarBg: string
  avatarText: string
  repTop: string
  repBottom: string
  repAccent: string
}

const EMPRENDEDORES: Array<EmprendedorSeed> = [
  {
    email: "crudo@gmail.com",
    slug: "crudo",
    displayName: "CRUDO",
    headline:
      "Marca de indumentaria urbana enfocada en diseño contemporáneo y prendas de edición limitada.",
    location: "Palermo, CABA",
    category: "ropa",
    description:
      "CRUDO es una marca independiente de ropa que apuesta por siluetas amplias, materiales de calidad y una estética minimalista. Participa en ferias de diseño, eventos de moda y encuentros de emprendedores creativos.",
    instagramHandle: "crudo",
    avatarBg: "#111111",
    avatarText: "#f5f0e8",
    repTop: "#1a1a1a",
    repBottom: "#3d3d3d",
    repAccent: "#f5f0e8",
  },
  {
    email: "geiese@gmail.com",
    slug: "geiese",
    displayName: "GEIESE",
    headline: "Marca de diseño independiente que combina moda urbana y producción local.",
    location: "Palermo, CABA",
    category: "ropa",
    description:
      "GEIESE desarrolla colecciones cápsula y prendas de diseño con foco en la identidad de marca y la producción local. Participa en ferias de diseño, pop-ups y colaboraciones con artistas.",
    instagramHandle: "geiese",
    avatarBg: "#2c2c2c",
    avatarText: "#e8dcc8",
    repTop: "#1f1f1f",
    repBottom: "#4a4a4a",
    repAccent: "#e8dcc8",
  },
  {
    email: "solnavarrodj@gmail.com",
    slug: "sol-navarro",
    displayName: "Sol Navarro",
    headline: "DJ especializada en house y electrónica melódica para eventos sociales y culturales.",
    location: "Palermo, CABA",
    category: "musica",
    description:
      "Sol crea sets orientados a sunsets, after offices y eventos de comunidad. Su estilo combina house, organic house y melodic house.",
    instagramHandle: "solnavarro.dj",
    avatarBg: "#1a1033",
    avatarText: "#ff6b9d",
    repTop: "#12082a",
    repBottom: "#3d1f5c",
    repAccent: "#ff6b9d",
  },
  {
    email: "lautarovegadj@gmail.com",
    slug: "lautaro-vega",
    displayName: "Lautaro Vega",
    headline: "DJ de música electrónica con foco en progressive house y deep house.",
    location: "Chacarita, CABA",
    category: "musica",
    description:
      "Lautaro participa en eventos boutique, bares y encuentros privados, generando experiencias musicales relajadas y elegantes.",
    instagramHandle: "lautarovega.dj",
    avatarBg: "#0d1b2a",
    avatarText: "#7fdbff",
    repTop: "#0a1520",
    repBottom: "#1b3a4b",
    repAccent: "#7fdbff",
  },
  {
    email: "tomidiscosdj@gmail.com",
    slug: "tomi-discos",
    displayName: "Tomi Discos",
    headline: "DJ de vinilos especializado en funk, soul y disco.",
    location: "San Telmo, CABA",
    category: "musica",
    description:
      "Tomi realiza sesiones exclusivamente en vinilo para bares, cafeterías y eventos culturales, ofreciendo una experiencia musical auténtica y curada.",
    instagramHandle: "tomidiscos",
    avatarBg: "#3d2c1e",
    avatarText: "#f4a261",
    repTop: "#2a1f15",
    repBottom: "#5c4033",
    repAccent: "#f4a261",
  },
  {
    email: "juliavinylclub@gmail.com",
    slug: "julia-vinyl-club",
    displayName: "Julia Vinyl Club",
    headline: "Curadora musical y DJ de vinilos para eventos culturales y gastronómicos.",
    location: "Recoleta, CABA",
    category: "musica",
    description:
      "Julia combina jazz, funk, soul y clásicos internacionales en formatos íntimos ideales para cafés, galerías y bares.",
    instagramHandle: "juliavinylclub",
    avatarBg: "#2b1d3d",
    avatarText: "#c9b8ff",
    repTop: "#1a1228",
    repBottom: "#4a3560",
    repAccent: "#c9b8ff",
  },
  {
    email: "tangodeesquina@gmail.com",
    slug: "tango-de-esquina",
    displayName: "Tango de Esquina",
    headline: "Pareja profesional de tango para eventos culturales y privados.",
    location: "San Telmo, CABA",
    category: "arte_y_cultura",
    description:
      "Dúo artístico especializado en exhibiciones de tango tradicional y contemporáneo para bares, centros culturales y eventos corporativos.",
    instagramHandle: "tangodeesquina",
    avatarBg: "#1a0a0a",
    avatarText: "#c41e3a",
    repTop: "#120606",
    repBottom: "#4a1010",
    repAccent: "#c41e3a",
  },
  {
    email: "surendos@gmail.com",
    slug: "sur-en-dos",
    displayName: "Sur en Dos",
    headline: "Pareja de tango escenario con propuestas participativas para eventos.",
    location: "San Telmo, CABA",
    category: "arte_y_cultura",
    description:
      "Además de realizar exhibiciones, ofrecen clases introductorias y experiencias interactivas para el público.",
    instagramHandle: "surendos.tango",
    avatarBg: "#150808",
    avatarText: "#d4af37",
    repTop: "#0f0505",
    repBottom: "#3d2010",
    repAccent: "#d4af37",
  },
  {
    email: "brumaarte@gmail.com",
    slug: "bruma-arte",
    displayName: "Bruma Arte",
    headline: "Estudio de arte contemporáneo enfocado en pintura abstracta.",
    location: "Villa Crespo, CABA",
    category: "arte_y_cultura",
    description:
      "Produce obras originales, cuadros por encargo y exposiciones para eventos culturales y corporativos.",
    instagramHandle: "brumaarte",
    avatarBg: "#4a5568",
    avatarText: "#f7f5f2",
    repTop: "#e8e4df",
    repBottom: "#b8b0a8",
    repAccent: "#4a5568",
  },
  {
    email: "estudiolienzo@gmail.com",
    slug: "estudio-lienzo",
    displayName: "Estudio Lienzo",
    headline: "Proyecto artístico dedicado a ilustración y arte visual.",
    location: "Palermo, CABA",
    category: "arte_y_cultura",
    description:
      "Crea piezas originales, láminas decorativas y obras para exhibiciones y ferias de diseño.",
    instagramHandle: "estudiolienzo",
    avatarBg: "#e07a5f",
    avatarText: "#faf7f2",
    repTop: "#faf7f2",
    repBottom: "#f2d4c8",
    repAccent: "#e07a5f",
  },
  {
    email: "tierrataller@gmail.com",
    slug: "tierra-taller",
    displayName: "Tierra Taller",
    headline: "Taller de cerámica artesanal y objetos decorativos.",
    location: "Chacarita, CABA",
    category: "talleres_y_cursos",
    description:
      "Produce piezas únicas hechas a mano y organiza workshops abiertos para principiantes y aficionados.",
    instagramHandle: "tierrataller",
    avatarBg: "#5c4033",
    avatarText: "#f5ebe0",
    repTop: "#c4a882",
    repBottom: "#8b6914",
    repAccent: "#5c4033",
  },
  {
    email: "nudosur@gmail.com",
    slug: "nudo-sur",
    displayName: "Nudo Sur",
    headline: "Emprendimiento de decoración textil y macramé.",
    location: "Caballito, CABA",
    category: "feria_de_emprendedores",
    description:
      "Diseña objetos decorativos artesanales para hogares, eventos y espacios comerciales.",
    instagramHandle: "nudosur",
    avatarBg: "#8b7355",
    avatarText: "#f5f0eb",
    repTop: "#f5f0eb",
    repBottom: "#d4c4b0",
    repAccent: "#8b7355",
  },
  {
    email: "estudioprisma@gmail.com",
    slug: "estudio-prisma",
    displayName: "Estudio Prisma",
    headline: "Estudio de fotografía para marcas, eventos y retratos.",
    location: "Palermo, CABA",
    category: "arte_y_cultura",
    description:
      "Especializado en cobertura de eventos, fotografía de producto y contenido para redes sociales.",
    instagramHandle: "estudioprisma",
    avatarBg: "#0f0f0f",
    avatarText: "#ffffff",
    repTop: "#1a1a1a",
    repBottom: "#404040",
    repAccent: "#ffffff",
  },
  {
    email: "lozajazz@gmail.com",
    slug: "loza-jazz",
    displayName: "Loza Jazz",
    headline: "Banda de jazz para veladas íntimas en bares y eventos gastronómicos.",
    location: "San Telmo, CABA",
    category: "musica",
    description:
      "Loza Jazz es una banda de jazz que participa en eventos de bares, vermuterías y promos gastronómicas del circuito Nexa.",
    instagramHandle: "lozajazz",
    avatarBg: "#1a1033",
    avatarText: "#d4af37",
    repTop: "#12082a",
    repBottom: "#2a1f4a",
    repAccent: "#d4af37",
  },
  {
    email: "clubdelvermu@gmail.com",
    slug: "club-del-vermu",
    displayName: "Club del Vermú",
    headline: "Experiencias gastronómicas centradas en vermut y maridajes.",
    location: "San Telmo, CABA",
    category: "gastronomia",
    description:
      "Organiza degustaciones, catas y encuentros gastronómicos para grupos y eventos privados.",
    instagramHandle: "clubdelvermu",
    avatarBg: "#722f37",
    avatarText: "#f4e4bc",
    repTop: "#4a1c24",
    repBottom: "#722f37",
    repAccent: "#f4e4bc",
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
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase()
}

async function generateAvatar(
  outputPath: string,
  label: string,
  bg: string,
  textColor: string
): Promise<void> {
  const initials = initialsFor(label)
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="${bg}"/>
      <circle cx="256" cy="256" r="200" fill="none" stroke="${textColor}" stroke-width="3" opacity="0.35"/>
      <text x="256" y="280" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="96" font-weight="700" fill="${textColor}">${escapeXml(initials)}</text>
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

async function ensurePublicUser(
  sql: postgres.Sql,
  authUserId: string,
  email: string,
  displayName: string
): Promise<string> {
  const existing = await sql<{ id: string }[]>`
    SELECT id::text FROM users WHERE auth_user_id = ${authUserId}::uuid OR email = ${email.toLowerCase()} LIMIT 1
  `

  if (existing[0]) {
    return existing[0].id
  }

  const inserted = await sql<{ id: string }[]>`
    INSERT INTO users (auth_user_id, role, display_name, email)
    VALUES (${authUserId}::uuid, 'emprendedor', ${displayName}, ${email.toLowerCase()})
    RETURNING id::text
  `

  const userId = inserted[0]?.id
  if (!userId) {
    throw new Error(`No se pudo crear usuario público para ${email}`)
  }

  return userId
}

async function upsertEmprendedorProfile(
  sql: postgres.Sql,
  userId: string,
  input: EmprendedorSeed,
  avatarUrl: string,
  representativeImageUrl: string
): Promise<void> {
  await sql`
    UPDATE users
    SET
      display_name = ${input.displayName},
      headline = ${input.headline},
      location = ${input.location},
      description = ${input.description},
      category = ARRAY[${input.category}]::category[],
      avatar_url = ${avatarUrl},
      representative_image_url = ${representativeImageUrl},
      updated_at = NOW()
    WHERE id = ${userId}::uuid
  `

  await sql`
    DELETE FROM user_social_links
    WHERE user_id = ${userId}::uuid AND platform = 'instagram'
  `

  await sql`
    INSERT INTO user_social_links (user_id, platform, handle)
    VALUES (${userId}::uuid, 'instagram', ${input.instagramHandle})
  `
}

async function ensureAuthUser(sql: postgres.Sql, profile: EmprendedorSeed): Promise<string> {
  const existing = await sql<{ id: string }[]>`
    SELECT id::text FROM auth.users WHERE email = ${profile.email.toLowerCase()} LIMIT 1
  `

  if (existing[0]) {
    return existing[0].id
  }

  const authUserId = randomUUID()

  await insertSeedAuthUsers(sql, [
    {
      id: authUserId,
      email: profile.email.toLowerCase(),
      displayName: profile.displayName,
      role: "emprendedor",
      canSignIn: false,
    },
  ])

  return authUserId
}

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })
  const publicRoot = path.resolve(import.meta.dir, "../../../apps/web/public/profiles")

  for (const profile of EMPRENDEDORES) {
    const authUserId = await ensureAuthUser(sql, profile)

    const dir = path.join(publicRoot, profile.slug)
    await mkdir(dir, { recursive: true })

    const avatarPath = path.join(dir, "avatar.png")
    const representativePath = path.join(dir, "representative.jpg")

    await generateAvatar(avatarPath, profile.displayName, profile.avatarBg, profile.avatarText)
    await generateRepresentative(
      representativePath,
      profile.displayName,
      profile.headline,
      profile.repTop,
      profile.repBottom,
      profile.repAccent
    )

    const avatarUrl = `/profiles/${profile.slug}/avatar.png`
    const representativeImageUrl = `/profiles/${profile.slug}/representative.jpg`

    const userId = await ensurePublicUser(sql, authUserId, profile.email, profile.displayName)

    await upsertEmprendedorProfile(sql, userId, profile, avatarUrl, representativeImageUrl)

    await sql`
      UPDATE auth.users
      SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || ${sql.json({
        role: "emprendedor",
        displayName: profile.displayName,
        display_name: profile.displayName,
      })}
      WHERE id = ${authUserId}::uuid
    `

    console.log(`✓ ${profile.displayName} (${profile.email})`)
  }

  await sql.end({ timeout: 5 })
  console.log("Listo.")
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
