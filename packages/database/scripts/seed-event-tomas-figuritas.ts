import postgres from "postgres"

const EVENT_ID = "a4b8c2d1-6e3f-4a91-9b2c-1f0e8d7c6b5a"
const CREATOR_EMAIL = "tomasferreyra@yahoo.com"

/** Mismo criterio que seed-events.source.ts: URLs directas de Unsplash. La primera es la portada. */
const GALLERY_URLS = [
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=1200&q=80",
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

  const startsAt = new Date("2026-07-13T16:00:00-03:00")

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
        ${"Intercambio de figuritas del Mundial"},
        ${"Encuentro comunitario para intercambiar figuritas del Mundial en Plaza Serrano, Palermo Soho."},
        ${"Plaza Serrano (Plaza Julio Cortázar), Palermo Soho, CABA"},
        ${startsAt.toISOString()}::timestamptz,
        ARRAY['cine_y_entretenimiento']::category[],
        ${"Organizo un intercambio de figuritas del Mundial en Plaza Serrano. Traé tus repetidas, buscá las que te faltan y compartí el mate con otros fanáticos del álbum."},
        ${"0"},
        ${"ARS"},
        ${""},
        ${0},
        ${"Traé tus figuritas repetidas y un marcador para identificar las que te faltan. Encuentro al aire libre. Evento comunitario."},
        ${-34.5889},
        ${-58.4306}
      )
    `
  } else {
    await sql`
      UPDATE events
      SET
        created_by_user_id = ${creator.id}::uuid,
        title = ${"Intercambio de Figuritas del Mundial"},
        summary = ${"Encuentro comunitario para intercambiar figuritas del Mundial en Plaza Serrano, Palermo Soho."},
        location = ${"Plaza Serrano (Plaza Julio Cortázar), Palermo Soho, CABA"},
        starts_at = ${startsAt.toISOString()}::timestamptz,
        category = ARRAY['cine_y_entretenimiento']::category[],
        description = ${"Organizo un intercambio de figuritas del Mundial en Plaza Serrano. Traé tus repetidas, buscá las que te faltan y compartí el mate con otros fanáticos del álbum."},
        price_amount = ${"0"},
        price_currency = ${"ARS"},
        price_label = ${""},
        requirements = ${"Traé tus figuritas repetidas y un marcador para identificar las que te faltan. Encuentro al aire libre. Evento comunitario."},
        latitude = ${-34.5889},
        longitude = ${-58.4306},
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
