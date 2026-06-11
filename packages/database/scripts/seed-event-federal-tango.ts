import postgres from "postgres"

const EVENT_ID = "e4f5a6b7-c8d9-4e0f-1a2b-3c4d5e6f7a8b"
const ORGANIZER_EMAIL = "eventos@federalbar.com.ar"
const ENTREPRENEUR_EMAILS = ["tangodeesquina@gmail.com", "estudioprisma@gmail.com"] as const

/** Mismo criterio que seed-events.source.ts: URLs directas de Unsplash. La primera es la portada. */
const GALLERY_IMAGES = [
  {
    id: "b2000001-0000-4000-8000-000000000001",
    url: "https://images.unsplash.com/photo-1744280054687-e8b72c1ff390?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "b2000002-0000-4000-8000-000000000002",
    url: "https://images.unsplash.com/photo-1770118292677-e9568c6c904d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "b2000003-0000-4000-8000-000000000003",
    url: "https://images.unsplash.com/photo-1734421989465-47be92f9f126?auto=format&fit=crop&w=1200&q=80",
  },
] as const

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  const organizers = await sql<{ id: string }[]>`
    SELECT id::text FROM users WHERE email = ${ORGANIZER_EMAIL.toLowerCase()} LIMIT 1
  `

  const organizer = organizers[0]
  if (!organizer) {
    throw new Error(`No se encontró organizador ${ORGANIZER_EMAIL}`)
  }

  const entrepreneurIds: string[] = []
  for (const email of ENTREPRENEUR_EMAILS) {
    const rows = await sql<{ id: string }[]>`
      SELECT id::text FROM users WHERE email = ${email.toLowerCase()} LIMIT 1
    `
    const entrepreneur = rows[0]
    if (!entrepreneur) {
      throw new Error(`No se encontró emprendimiento ${email}`)
    }
    entrepreneurIds.push(entrepreneur.id)
  }

  const startsAt = new Date("2026-07-16T22:00:00-03:00")

  const existing = await sql<{ id: string }[]>`
    SELECT id::text FROM events WHERE id = ${EVENT_ID}::uuid LIMIT 1
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
        longitude
      )
      VALUES (
        ${EVENT_ID}::uuid,
        ${organizer.id}::uuid,
        ${"Show de tango en vivo en El Federal Bar"},
        ${"Noche de tango en San Telmo con Tango de Esquina y cobertura de Estudio Prisma. Promo de comida de la casa."},
        ${"El Federal Bar, Carlos Calvo 599 esq. Perú, San Telmo, CABA"},
        ${startsAt.toISOString()}::timestamptz,
        ARRAY['musica']::category[],
        ${"El Federal Bar presenta una noche de tango en vivo con Tango de Esquina, pareja profesional que interpreta exhibiciones de tango tradicional y contemporáneo. Estudio Prisma realiza la cobertura fotográfica del evento. La velada incluye promo de comida, picadas y la propuesta gastronómica emblemática de la casa en uno de los bares notables más históricos de San Telmo."},
        ${"0"},
        ${"ARS"},
        ${""},
        ${0},
        ${"Mayores de 18 años. Consumición mínima. Se recomienda reservar mesa con anticipación."},
        ${-34.622},
        ${-58.3715}
      )
    `
  } else {
    await sql`
      UPDATE events
      SET
        created_by_user_id = ${organizer.id}::uuid,
        title = ${"Show de tango en vivo en El Federal Bar"},
        summary = ${"Noche de tango en San Telmo con Tango de Esquina y cobertura de Estudio Prisma. Promo de comida de la casa."},
        location = ${"El Federal Bar, Carlos Calvo 599 esq. Perú, San Telmo, CABA"},
        starts_at = ${startsAt.toISOString()}::timestamptz,
        category = ARRAY['musica']::category[],
        description = ${"El Federal Bar presenta una noche de tango en vivo con Tango de Esquina, pareja profesional que interpreta exhibiciones de tango tradicional y contemporáneo. Estudio Prisma realiza la cobertura fotográfica del evento. La velada incluye promo de comida, picadas y la propuesta gastronómica emblemática de la casa en uno de los bares notables más históricos de San Telmo."},
        price_amount = ${"0"},
        price_currency = ${"ARS"},
        price_label = ${""},
        requirements = ${"Mayores de 18 años. Consumición mínima. Se recomienda reservar mesa con anticipación."},
        latitude = ${-34.622},
        longitude = ${-58.3715},
        updated_at = NOW()
      WHERE id = ${EVENT_ID}::uuid
    `
  }

  await sql`
    DELETE FROM event_entrepreneurs
    WHERE event_id = ${EVENT_ID}::uuid
  `

  for (const userId of entrepreneurIds) {
    await sql`
      INSERT INTO event_entrepreneurs (event_id, user_id)
      VALUES (${EVENT_ID}::uuid, ${userId}::uuid)
    `
  }

  await sql`
    DELETE FROM event_gallery_images
    WHERE event_id = ${EVENT_ID}::uuid
  `

  for (const image of GALLERY_IMAGES) {
    await sql`
      INSERT INTO event_gallery_images (id, event_id, url)
      VALUES (${image.id}::uuid, ${EVENT_ID}::uuid, ${image.url})
    `
  }

  await sql.end({ timeout: 5 })

  console.log(`✓ Evento actualizado: Show de tango en El Federal Bar`)
  console.log(`  Emprendimientos: ${ENTREPRENEUR_EMAILS.join(", ")}`)
  console.log(`  Galería: ${GALLERY_IMAGES.length} imágenes`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
