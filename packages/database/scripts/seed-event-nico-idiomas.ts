import postgres from "postgres"

const EVENT_ID = "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e"
const CREATOR_EMAIL = "nico.pereyra@gmail.com"

const TITLE = "Intercambio de Idiomas en Nela Café & Arte"
const SUMMARY =
  "Encuentro para practicar distintos idiomas y compartir culturas en Palermo Hollywood."
const LOCATION = "Nela Café & Arte, El Salvador 5847, Palermo Hollywood, CABA"
const DESCRIPTION =
  "Organizo un intercambio de idiomas en Nela Café & Arte e invito especialmente a quienes estén de visita en Buenos Aires. La idea es charlar en distintos idiomas, compartir culturas y conocer gente nueva en un café con ambiente cálido y creativo."
const REQUIREMENTS =
  "Encuentro en Nela Café & Arte. Todos los niveles e idiomas bienvenidos. Evento comunitario."

/** Viernes 3 de julio de 2026, 19:00 (ART) */
const STARTS_AT = "2026-07-03T19:00:00-03:00"
const LATITUDE = -34.5812527
const LONGITUDE = -58.437838

const GALLERY_IMAGES = [
  {
    id: "a1000001-0000-4000-8000-000000000001",
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "a1000002-0000-4000-8000-000000000002",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "a1000003-0000-4000-8000-000000000003",
    url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
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

  const startsAt = new Date(STARTS_AT)

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
        ${TITLE},
        ${SUMMARY},
        ${LOCATION},
        ${startsAt.toISOString()}::timestamptz,
        ARRAY['arte_y_cultura']::category[],
        ${DESCRIPTION},
        ${"0"},
        ${"ARS"},
        ${""},
        ${0},
        ${REQUIREMENTS},
        ${LATITUDE},
        ${LONGITUDE}
      )
    `
  } else {
    await sql`
      UPDATE events
      SET
        created_by_user_id = ${creator.id}::uuid,
        title = ${TITLE},
        summary = ${SUMMARY},
        location = ${LOCATION},
        starts_at = ${startsAt.toISOString()}::timestamptz,
        category = ARRAY['arte_y_cultura']::category[],
        description = ${DESCRIPTION},
        price_amount = ${"0"},
        price_currency = ${"ARS"},
        price_label = ${""},
        requirements = ${REQUIREMENTS},
        latitude = ${LATITUDE},
        longitude = ${LONGITUDE},
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

  console.log(`✓ ${TITLE}`)
  console.log(`  ${STARTS_AT} · ${LOCATION}`)
  console.log(`  Galería: ${GALLERY_IMAGES.length} imágenes`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
