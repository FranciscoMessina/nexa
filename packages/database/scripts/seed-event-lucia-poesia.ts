import postgres from "postgres"

const EVENT_ID = "d1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5a"
const CREATOR_EMAIL = "luciadiaz@hotmail.com"

/** Mismo criterio que seed-events.source.ts: URLs directas de Unsplash. La primera es la portada. */
const GALLERY_URLS = [
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
]

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  const users = await sql<{ id: string; display_name: string | null }[]>`
    SELECT id::text, display_name
    FROM users
    WHERE email = ${CREATOR_EMAIL.toLowerCase()}
    LIMIT 1
  `

  const creator = users[0]
  if (!creator) {
    throw new Error(`No se encontró usuario ${CREATOR_EMAIL}`)
  }

  const startsAt = new Date("2026-07-07T17:00:00-03:00")

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
        ${creator.id}::uuid,
        ${"Encuentro de lectura de poesías en Clorindo"},
        ${"Encuentro de la comunidad lectora de poesía en Clorindo Café, Recoleta. Abierto a quienes quieran sumarse."},
        ${"Clorindo Café, Talcahuano 1261, Recoleta, CABA"},
        ${startsAt.toISOString()}::timestamptz,
        ARRAY['arte_y_cultura']::category[],
        ${"Organizo un encuentro de lectura de poesías en Clorindo Café para quienes ya forman parte de mi grupo y para quienes quieran acercarse por primera vez. Traé un poema que te guste —propio o de otro autor— y sumate a compartir lecturas en un espacio íntimo."},
        ${"0"},
        ${"ARS"},
        ${""},
        ${0},
        ${"Traé un poema para leer o compartir. Encuentro en Clorindo Café. Evento comunitario."},
        ${-34.5926},
        ${-58.3934}
      )
    `
  } else {
    await sql`
      UPDATE events
      SET
        created_by_user_id = ${creator.id}::uuid,
        title = ${"Encuentro de lectura de poesías en Clorindo"},
        summary = ${"Encuentro de la comunidad lectora de poesía en Clorindo Café, Recoleta. Abierto a quienes quieran sumarse."},
        location = ${"Clorindo Café, Talcahuano 1261, Recoleta, CABA"},
        starts_at = ${startsAt.toISOString()}::timestamptz,
        category = ARRAY['arte_y_cultura']::category[],
        description = ${"Organizo un encuentro de lectura de poesías en Clorindo Café para quienes ya forman parte de mi grupo y para quienes quieran acercarse por primera vez. Traé un poema que te guste —propio o de otro autor— y sumate a compartir lecturas en un espacio íntimo."},
        price_amount = ${"0"},
        price_currency = ${"ARS"},
        price_label = ${""},
        requirements = ${"Traé un poema para leer o compartir. Encuentro en Clorindo Café. Evento comunitario."},
        latitude = ${-34.5926},
        longitude = ${-58.3934},
        updated_at = NOW()
      WHERE id = ${EVENT_ID}::uuid
    `
  }

  await sql`
    DELETE FROM event_gallery_images
    WHERE event_id = ${EVENT_ID}::uuid
  `

  for (const url of GALLERY_URLS) {
    await sql`
      INSERT INTO event_gallery_images (event_id, url)
      VALUES (${EVENT_ID}::uuid, ${url})
    `
  }

  await sql.end({ timeout: 5 })

  console.log(`✓ Evento actualizado con fotos Unsplash (estilo demo)`)
  console.log(`  Galería: ${GALLERY_URLS.length} imágenes`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
