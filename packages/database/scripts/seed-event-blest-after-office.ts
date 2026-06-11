import postgres from "postgres"

const EVENT_ID = "f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c"
const ORGANIZER_EMAIL = "eventos@blest.com.ar"
const ENTREPRENEUR_EMAILS = ["tomidiscosdj@gmail.com"] as const

/** Mismo criterio que seed-events.source.ts: URLs directas de Unsplash. La primera es la portada. */
const GALLERY_IMAGES = [
  {
    id: "f6000001-0000-4000-8000-000000000001",
    url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "f6000002-0000-4000-8000-000000000002",
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "f6000003-0000-4000-8000-000000000003",
    url: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&w=1200&q=80",
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

  const startsAt = new Date("2026-06-04T19:00:00-03:00")

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
        ${"After office con DJ en Blest Recoleta"},
        ${"After office de jueves con Tomi Discos en vinilo. Promos de comida y bebida para quienes salen del trabajo."},
        ${"Blest Recoleta, Pres. Roberto M. Ortiz 1827, Recoleta, CABA"},
        ${startsAt.toISOString()}::timestamptz,
        ARRAY['musica']::category[],
        ${"Blest Recoleta convoca un after office pensado para quienes salen del trabajo: música en vivo a cargo de Tomi Discos, DJ de vinilos especializado en funk, soul y disco. El local ofrece promos de comida y bebida — cervezas artesanales, coctelería y propuesta gastronómica — en un formato distendido para cerrar la jornada laboral en sectores interiores y exteriores de la sede de Recoleta."},
        ${"0"},
        ${"ARS"},
        ${""},
        ${0},
        ${"Mayores de 18 años. Promos de comida y bebida válidas durante el after office."},
        ${-34.5892},
        ${-58.3948}
      )
    `
  } else {
    await sql`
      UPDATE events
      SET
        created_by_user_id = ${organizer.id}::uuid,
        title = ${"After office con DJ en Blest Recoleta"},
        summary = ${"After office de jueves con Tomi Discos en vinilo. Promos de comida y bebida para quienes salen del trabajo."},
        location = ${"Blest Recoleta, Pres. Roberto M. Ortiz 1827, Recoleta, CABA"},
        starts_at = ${startsAt.toISOString()}::timestamptz,
        category = ARRAY['musica']::category[],
        description = ${"Blest Recoleta convoca un after office pensado para quienes salen del trabajo: música en vivo a cargo de Tomi Discos, DJ de vinilos especializado en funk, soul y disco. El local ofrece promos de comida y bebida — cervezas artesanales, coctelería y propuesta gastronómica — en un formato distendido para cerrar la jornada laboral en sectores interiores y exteriores de la sede de Recoleta."},
        price_amount = ${"0"},
        price_currency = ${"ARS"},
        price_label = ${""},
        requirements = ${"Mayores de 18 años. Promos de comida y bebida válidas durante el after office."},
        latitude = ${-34.5892},
        longitude = ${-58.3948},
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

  console.log(`✓ Evento actualizado: After office con DJ en Blest Recoleta`)
  console.log(`  Emprendimientos: ${ENTREPRENEUR_EMAILS.join(", ")}`)
  console.log(`  Galería: ${GALLERY_IMAGES.length} imágenes`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
