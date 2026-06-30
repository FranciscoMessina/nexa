import { createHash } from "node:crypto"
import { mkdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import postgres from "postgres"

type UserRow = {
  id: string
  email: string
  displayName: string
  headline: string | null
  role: string
}

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

function slugFromEmail(email: string): string {
  const local = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return local || "usuario"
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
      <text x="160" y="390" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="${accent}">${escapeXml(title.slice(0, 40))}</text>
      <text x="160" y="470" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="${accent}" opacity="0.85">${escapeXml(headline.slice(0, 72))}${headline.length > 72 ? "…" : ""}</text>
    </svg>
  `

  await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(outputPath)
}

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })
  const publicRoot = path.resolve(import.meta.dir, "../../../apps/web/public/profiles")

  const users = await sql<UserRow[]>`
    SELECT
      id::text,
      email,
      display_name AS "displayName",
      headline,
      role::text AS role
    FROM users
    WHERE avatar_url IS NULL
       OR representative_image_url IS NULL
       OR avatar_url = ''
       OR representative_image_url = ''
    ORDER BY role, display_name
  `

  let updated = 0

  for (const user of users) {
    const slug = slugFromEmail(user.email)
    const dir = path.join(publicRoot, slug)
    await mkdir(dir, { recursive: true })

    const avatarPath = path.join(dir, "avatar.png")
    const representativePath = path.join(dir, "representative.jpg")
    const colors = paletteFromSeed(user.email)
    const headline = user.headline?.trim() || user.displayName

    await generateAvatar(avatarPath, user.displayName, colors.avatarBg, colors.avatarText)
    await generateRepresentative(
      representativePath,
      user.displayName,
      headline,
      colors.repTop,
      colors.repBottom,
      colors.repAccent
    )

    const avatarUrl = `/profiles/${slug}/avatar.png`
    const representativeImageUrl = `/profiles/${slug}/representative.jpg`

    await sql`
      UPDATE users
      SET
        avatar_url = ${avatarUrl},
        representative_image_url = ${representativeImageUrl},
        updated_at = NOW()
      WHERE id = ${user.id}::uuid
    `

    updated += 1
    console.log(`✓ ${user.displayName} (${user.role})`)
  }

  await sql.end({ timeout: 5 })
  console.log(`\n✓ Imágenes generadas para ${updated} perfiles.`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
