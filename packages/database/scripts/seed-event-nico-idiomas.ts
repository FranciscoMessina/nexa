import postgres from "postgres"

const EVENT_ID = "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e"
const CREATOR_EMAIL = "nico.pereyra@gmail.com"

/** Mismo criterio que seed-events.source.ts: URLs directas de Unsplash. La primera es la portada. */
const GALLERY_IMAGES = [
  {
    id: "a1000001-0000-4000-8000-000000000001",
    url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "a1000002-0000-4000-8000-000000000002",
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "a1000003-0000-4000-8000-000000000003",
    url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
  },
] as const

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

  const startsAt = new Date("2026-06-19T19:00:00-03:00")

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
        ${"Intercambio de idiomas en Temple Craft Madero"},
        ${"Encuentro para practicar distintos idiomas y compartir culturas con viajeros y locales en Puerto Madero."},
        ${"Temple Craft Madero, Pasaje Peatonal, Juana Manuela Gorriti 867, Puerto Madero, CABA"},
        ${startsAt.toISOString()}::timestamptz,
        ARRAY['arte_y_cultura']::category[],
        ${"Organizo un intercambio de idiomas en Temple Craft Madero e invito especialmente a quienes estén de visita en Buenos Aires. La idea es encontrarnos para charlar en distintos idiomas, compartir culturas y conocer gente nueva en un ambiente relajado."},
        ${"0"},
        ${"ARS"},
        ${""},
        ${0},
        ${"Encuentro en Temple Craft Madero. Todos los niveles e idiomas bienvenidos. Evento comunitario."},
        ${-34.6115},
        ${-58.3625}
      )
    `
  } else {
    await sql`
      UPDATE events
      SET
        created_by_user_id = ${creator.id}::uuid,
        title = ${"Intercambio de idiomas en Temple Craft Madero"},
        summary = ${"Encuentro para practicar distintos idiomas y compartir culturas con viajeros y locales en Puerto Madero."},
        location = ${"Temple Craft Madero, Pasaje Peatonal, Juana Manuela Gorriti 867, Puerto Madero, CABA"},
        starts_at = ${startsAt.toISOString()}::timestamptz,
        category = ARRAY['arte_y_cultura']::category[],
        description = ${"Organizo un intercambio de idiomas en Temple Craft Madero e invito especialmente a quienes estén de visita en Buenos Aires. La idea es encontrarnos para charlar en distintos idiomas, compartir culturas y conocer gente nueva en un ambiente relajado."},
        price_amount = ${"0"},
        price_currency = ${"ARS"},
        price_label = ${""},
        requirements = ${"Encuentro en Temple Craft Madero. Todos los niveles e idiomas bienvenidos. Evento comunitario."},
        latitude = ${-34.6115},
        longitude = ${-58.3625},
        updated_at = NOW()
      WHERE id = ${EVENT_ID}::uuid
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

  console.log(`✓ Evento actualizado con fotos Unsplash (estilo demo)`)
  console.log(`  Galería: ${GALLERY_IMAGES.length} imágenes`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
