import "dotenv/config"
import postgres from "postgres"

type OrganizerProfileInput = {
  email: string
  displayName: string
  category: string
  location: string
  headline: string
  description: string
  instagramHandle?: string
  websiteUrl?: string
  representativeImageUrl?: string
  avatarUrl?: string
}

async function updateOrganizerProfile(
  sql: postgres.Sql,
  input: OrganizerProfileInput
): Promise<void> {
  const description = input.websiteUrl
    ? `${input.description.trim()}\n\nSitio web: ${input.websiteUrl}`
    : input.description.trim()

  const users = await sql<{ id: string }[]>`
    SELECT id FROM users WHERE email = ${input.email.toLowerCase()} LIMIT 1
  `

  const user = users[0]
  if (!user) {
    throw new Error(`No se encontró organizador con email ${input.email}`)
  }

  await sql`
    UPDATE users
    SET
      display_name = ${input.displayName},
      headline = ${input.headline},
      location = ${input.location},
      description = ${description},
      category = ARRAY[${input.category}]::category[],
      representative_image_url = COALESCE(${input.representativeImageUrl ?? null}, representative_image_url),
      avatar_url = COALESCE(${input.avatarUrl ?? null}, avatar_url),
      updated_at = NOW()
    WHERE id = ${user.id}::uuid
  `

  if (input.instagramHandle) {
    await sql`
      DELETE FROM user_social_links
      WHERE user_id = ${user.id}::uuid AND platform = 'instagram'
    `
    await sql`
      INSERT INTO user_social_links (user_id, platform, handle)
      VALUES (${user.id}::uuid, 'instagram', ${input.instagramHandle})
    `
  }

  console.log(`Perfil actualizado: ${input.displayName} (${input.email})`)
}

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  await updateOrganizerProfile(sql, {
    email: "eventos@blest.com.ar",
    displayName: "Blest Recoleta",
    category: "gastronomia",
    location: "Recoleta, CABA — Presidente Roberto M. Ortiz 1827",
    headline:
      "Cerveza artesanal patagónica con propuesta gastronómica, coctelería y eventos en Recoleta.",
    description:
      "Blest Recoleta es una de las sedes urbanas más grandes de la marca patagónica de cerveza artesanal Blest. El espacio combina una amplia propuesta gastronómica con producción y servicio de cerveza artesanal, coctelería y eventos sociales. Cuenta con sectores interiores y exteriores, mesas para grupos grandes y una estética moderna orientada a encuentros sociales, after offices y eventos corporativos.",
    instagramHandle: "blestrecoleta",
    websiteUrl: "https://cervezablest.com.ar/inicio/",
  })

  await sql.end({ timeout: 5 })
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
