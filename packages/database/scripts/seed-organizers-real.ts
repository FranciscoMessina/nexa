import { mkdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import postgres from "postgres"

type OrganizerSeed = {
  email: string
  slug: string
  displayName: string
  headline: string
  instagramHandle?: string
  avatarLabel?: string
  avatarBg: string
  avatarText: string
  repTop: string
  repBottom: string
  repAccent: string
  repDecoration: "beer" | "coffee" | "cocktail" | "historic" | "ocean" | "music" | "art" | "artdeco" | "minimal"
}

const ORGANIZERS: Array<OrganizerSeed> = [
  {
    email: "eventos@blest.com.ar",
    slug: "blest",
    displayName: "Blest Recoleta",
    headline:
      "Cerveza artesanal patagónica con propuesta gastronómica, coctelería y eventos en Recoleta.",
    instagramHandle: "blestrecoleta",
    avatarLabel: "BL",
    avatarBg: "#1e3d1a",
    avatarText: "#c8e6a0",
    repTop: "#142810",
    repBottom: "#2d5016",
    repAccent: "#a8d45a",
    repDecoration: "beer",
  },
  {
    email: "eventos@clorindo.com.ar",
    slug: "clorindo",
    displayName: "Clorindo Café",
    headline:
      "Café de especialidad escondido en un patio histórico de Recoleta, ideal para encuentros, brunch y eventos culturales.",
    instagramHandle: "clorindo.ba",
    avatarLabel: "CL",
    avatarBg: "#6b6b63",
    avatarText: "#f5f0e8",
    repTop: "#4a4a44",
    repBottom: "#8b8b83",
    repAccent: "#c45c3e",
    repDecoration: "minimal",
  },
  {
    email: "eventos@cofijaus.com.ar",
    slug: "cofi-jaus",
    displayName: "Cofi Jaus Palermo",
    headline:
      "Cafetería de especialidad con propuesta de brunch, pastelería y espacios pensados para trabajar, reunirse y generar comunidad en Palermo.",
    instagramHandle: "cofijaus",
    avatarLabel: "Cofi",
    avatarBg: "#4a3728",
    avatarText: "#f5e6d3",
    repTop: "#3d2b1f",
    repBottom: "#6f4e37",
    repAccent: "#f5e6d3",
    repDecoration: "coffee",
  },
  {
    email: "eventos@federalbar.com.ar",
    slug: "federal-bar",
    displayName: "El Federal Bar",
    headline:
      "Bar histórico de San Telmo con cocina porteña, vermutería y una de las esquinas más emblemáticas de Buenos Aires.",
    instagramHandle: "bar_el_federal",
    avatarLabel: "EF",
    avatarBg: "#3d2314",
    avatarText: "#d4af37",
    repTop: "#1a0f0a",
    repBottom: "#722f37",
    repAccent: "#d4af37",
    repDecoration: "historic",
  },
  {
    email: "eventos@kraken.com.ar",
    slug: "kraken",
    displayName: "Kraken Bar",
    headline:
      "Bar al aire libre frente al río en Puerto Madero, con gastronomía, coctelería, música y una de las vistas más icónicas de la ciudad.",
    instagramHandle: "krakenbaroficial",
    avatarLabel: "K",
    avatarBg: "#0a1628",
    avatarText: "#00b4d8",
    repTop: "#050d18",
    repBottom: "#0a2540",
    repAccent: "#00b4d8",
    repDecoration: "ocean",
  },
  {
    email: "eventos@mimobar.com.ar",
    slug: "mimo",
    displayName: "Mimo Bar",
    headline:
      "Bar gastronómico de Palermo con una propuesta moderna de cocina, coctelería y experiencias sociales en un ambiente íntimo y de diseño.",
    avatarLabel: "Mimo",
    avatarBg: "#c45c3e",
    avatarText: "#faf7f2",
    repTop: "#8b3a2a",
    repBottom: "#e07a5f",
    repAccent: "#faf7f2",
    repDecoration: "cocktail",
  },
  {
    email: "eventos@moksha.com.ar",
    slug: "moksha",
    displayName: "Moksha Café Studio",
    headline:
      "Cafetería de especialidad y espacio creativo de Palermo Hollywood que combina gastronomía, arte, comunidad y experiencias culturales.",
    instagramHandle: "moksha_coffee",
    avatarLabel: "Moksha",
    avatarBg: "#5c6b4a",
    avatarText: "#f5f0eb",
    repTop: "#3d4a32",
    repBottom: "#6b7c5c",
    repAccent: "#e8dcc8",
    repDecoration: "coffee",
  },
  {
    email: "eventos@nelacafe.com.ar",
    slug: "nela",
    displayName: "Nela Café & Arte",
    headline:
      "Cafetería de especialidad y espacio cultural que combina gastronomía, arte y comunidad en un entorno cálido y creativo de Palermo.",
    instagramHandle: "nelabergoc",
    avatarLabel: "Nela",
    avatarBg: "#8b6914",
    avatarText: "#faf7f2",
    repTop: "#5c4a2a",
    repBottom: "#c4714a",
    repAccent: "#faf7f2",
    repDecoration: "art",
  },
  {
    email: "eventos@pistaurbana.com.ar",
    slug: "pista-urbana",
    displayName: "Pista Urbana",
    headline:
      "Espacio cultural emblemático de San Telmo dedicado a la música en vivo, el tango, el folklore y las expresiones artísticas independientes.",
    instagramHandle: "pista_urbana",
    avatarLabel: "PU",
    avatarBg: "#5c2a2a",
    avatarText: "#f4e4bc",
    repTop: "#3d1818",
    repBottom: "#8b3a3a",
    repAccent: "#f4e4bc",
    repDecoration: "music",
  },
  {
    email: "eventos@presidentebar.com.ar",
    slug: "presidente",
    displayName: "Presidente Bar",
    headline:
      "Bar de coctelería de autor reconocido internacionalmente, ubicado en Recoleta y considerado uno de los referentes de la escena gastronómica de Buenos Aires.",
    instagramHandle: "presidentebar",
    avatarLabel: "P",
    avatarBg: "#0a0a0a",
    avatarText: "#d4af37",
    repTop: "#050505",
    repBottom: "#1a1510",
    repAccent: "#d4af37",
    repDecoration: "artdeco",
  },
  {
    email: "eventos@temple.com.ar",
    slug: "temple",
    displayName: "Temple Craft Madero",
    headline:
      "Bar cervecero con amplia oferta gastronómica, cerveza artesanal y eventos sociales.",
    instagramHandle: "templepuertomadero",
    avatarLabel: "Temple",
    avatarBg: "#1a1410",
    avatarText: "#d4a017",
    repTop: "#0f0c08",
    repBottom: "#3d2e14",
    repAccent: "#d4a017",
    repDecoration: "beer",
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

function decorationSvg(type: OrganizerSeed["repDecoration"], accent: string): string {
  switch (type) {
    case "beer":
      return `
        <ellipse cx="1380" cy="680" rx="90" ry="120" fill="${accent}" opacity="0.15"/>
        <ellipse cx="1380" cy="620" rx="70" ry="18" fill="${accent}" opacity="0.25"/>
        <circle cx="1360" cy="600" r="8" fill="${accent}" opacity="0.4"/>
        <circle cx="1400" cy="595" r="6" fill="${accent}" opacity="0.35"/>
      `
    case "coffee":
      return `
        <ellipse cx="1350" cy="650" rx="80" ry="50" fill="${accent}" opacity="0.12"/>
        <path d="M1310 620 Q1350 580 1390 620 L1385 680 Q1350 710 1315 680 Z" fill="${accent}" opacity="0.2"/>
        <ellipse cx="1350" cy="615" rx="35" ry="8" fill="${accent}" opacity="0.35"/>
      `
    case "cocktail":
      return `
        <path d="M1330 720 L1370 580 L1410 720 Z" fill="none" stroke="${accent}" stroke-width="3" opacity="0.3"/>
        <line x1="1370" y1="720" x2="1370" y2="760" stroke="${accent}" stroke-width="4" opacity="0.25"/>
        <circle cx="1370" cy="650" r="12" fill="${accent}" opacity="0.2"/>
      `
    case "historic":
      return `
        <rect x="1280" y="560" width="180" height="220" fill="${accent}" opacity="0.06" rx="4"/>
        <rect x="1300" y="580" width="30" height="50" fill="${accent}" opacity="0.2"/>
        <rect x="1360" y="580" width="30" height="50" fill="${accent}" opacity="0.2"/>
        <rect x="1420" y="580" width="30" height="50" fill="${accent}" opacity="0.2"/>
      `
    case "ocean":
      return `
        <path d="M1200 750 Q1280 700 1360 750 T1520 750" fill="none" stroke="${accent}" stroke-width="4" opacity="0.25"/>
        <path d="M1180 780 Q1260 730 1340 780 T1500 780" fill="none" stroke="${accent}" stroke-width="3" opacity="0.18"/>
        <circle cx="1400" cy="600" r="60" fill="${accent}" opacity="0.08"/>
      `
    case "music":
      return `
        <circle cx="1360" cy="640" r="50" fill="${accent}" opacity="0.1"/>
        <rect x="1410" y="580" width="8" height="120" fill="${accent}" opacity="0.25" rx="4"/>
        <circle cx="1414" cy="575" r="14" fill="${accent}" opacity="0.3"/>
        <circle cx="1414" cy="705" r="10" fill="${accent}" opacity="0.25"/>
      `
    case "art":
      return `
        <rect x="1280" y="580" width="100" height="120" fill="none" stroke="${accent}" stroke-width="4" opacity="0.25"/>
        <circle cx="1330" cy="640" r="30" fill="${accent}" opacity="0.15"/>
        <path d="M1290 680 L1350 600 L1370 660" fill="none" stroke="${accent}" stroke-width="3" opacity="0.2"/>
      `
    case "artdeco":
      return `
        <path d="M1280 560 L1450 560 L1365 720 Z" fill="${accent}" opacity="0.08"/>
        <rect x="1330" y="600" width="70" height="4" fill="${accent}" opacity="0.4"/>
        <rect x="1345" y="620" width="40" height="4" fill="${accent}" opacity="0.3"/>
        <rect x="1355" y="640" width="20" height="4" fill="${accent}" opacity="0.25"/>
      `
    default:
      return `
        <rect x="1280" y="560" width="160" height="160" fill="${accent}" opacity="0.06" transform="rotate(12 1360 640)"/>
      `
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
  accent: string,
  decoration: OrganizerSeed["repDecoration"]
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
      ${decorationSvg(decoration, accent)}
      <rect x="120" y="320" width="8" height="260" fill="${accent}" opacity="0.9"/>
      <text x="160" y="390" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="${accent}">${escapeXml(title)}</text>
      <text x="160" y="470" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="${accent}" opacity="0.85">${escapeXml(headline.slice(0, 72))}${headline.length > 72 ? "…" : ""}</text>
    </svg>
  `

  await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(outputPath)
}

async function upsertOrganizerImages(
  sql: postgres.Sql,
  userId: string,
  avatarUrl: string,
  representativeImageUrl: string,
  instagramHandle?: string
): Promise<void> {
  await sql`
    UPDATE users
    SET
      avatar_url = ${avatarUrl},
      representative_image_url = ${representativeImageUrl},
      updated_at = NOW()
    WHERE id = ${userId}::uuid
  `

  if (instagramHandle) {
    await sql`
      DELETE FROM user_social_links
      WHERE user_id = ${userId}::uuid AND platform = 'instagram'
    `

    await sql`
      INSERT INTO user_social_links (user_id, platform, handle)
      VALUES (${userId}::uuid, 'instagram', ${instagramHandle})
    `
  }
}

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })
  const publicRoot = path.resolve(import.meta.dir, "../../../apps/web/public/profiles")

  for (const profile of ORGANIZERS) {
    const userRows = await sql<{ id: string; display_name: string | null; headline: string | null }[]>`
      SELECT id::text, display_name, headline
      FROM users
      WHERE email = ${profile.email.toLowerCase()}
      LIMIT 1
    `

    const user = userRows[0]
    if (!user) {
      console.warn(`⚠ Sin usuario público: ${profile.email}`)
      continue
    }

    const authRows = await sql<{ id: string }[]>`
      SELECT id::text FROM auth.users WHERE email = ${profile.email.toLowerCase()} LIMIT 1
    `
    const authUser = authRows[0]

    const dir = path.join(publicRoot, profile.slug)
    await mkdir(dir, { recursive: true })

    const avatarPath = path.join(dir, "avatar.png")
    const representativePath = path.join(dir, "representative.jpg")

    const avatarLabel = profile.avatarLabel ?? profile.displayName
    const repTitle = user.display_name ?? profile.displayName
    const repHeadline = user.headline ?? profile.headline

    await generateAvatar(avatarPath, avatarLabel, profile.avatarBg, profile.avatarText)
    await generateRepresentative(
      representativePath,
      repTitle,
      repHeadline,
      profile.repTop,
      profile.repBottom,
      profile.repAccent,
      profile.repDecoration
    )

    const avatarUrl = `/profiles/${profile.slug}/avatar.png`
    const representativeImageUrl = `/profiles/${profile.slug}/representative.jpg`

    await upsertOrganizerImages(sql, user.id, avatarUrl, representativeImageUrl, profile.instagramHandle)

    if (authUser) {
      await sql`
        UPDATE auth.users
        SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || ${sql.json({
          role: "organizador",
          displayName: repTitle,
          display_name: repTitle,
        })}
        WHERE id = ${authUser.id}::uuid
      `
    }

    console.log(`✓ ${repTitle} (${profile.email})`)
  }

  await sql.end({ timeout: 5 })
  console.log("Listo.")
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
