import postgres from "postgres"

const EVENT_ID = "e7f8a9b0-c1d2-4e3f-4a5b-6c7d8e9f0a1b"
const ORGANIZER_EMAIL = "eventos@blest.com.ar"
const ENTREPRENEUR_EMAILS = ["solnavarrodj@gmail.com", "lautarovegadj@gmail.com"] as const

/** Mismo criterio que seed-events.source.ts: URLs directas de Unsplash. La primera es la portada. */
const GALLERY_IMAGES = [
  {
    id: "e5000001-0000-4000-8000-000000000001",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "e5000002-0000-4000-8000-000000000002",
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "e5000003-0000-4000-8000-000000000003",
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

  const startsAt = new Date("2026-07-25T22:00:00-03:00")

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
        ${"DJ Set en Vivo en Blest Recoleta"},
        ${"Noche de música con Sol Navarro y Lautaro Vega. Promos de cervezas artesanales y picadas de la casa."},
        ${"Blest Recoleta, Pres. Roberto M. Ortiz 1827, Recoleta, CABA"},
        ${startsAt.toISOString()}::timestamptz,
        ARRAY['musica']::category[],
        ${"Blest Recoleta presenta una noche de música en vivo con dos DJ sets en secuencia. Sol Navarro abre la velada con house y electrónica melódica; Lautaro Vega cierra con progressive house y deep house. El local arma la propuesta con promos de cervezas artesanales y picadas para compartir en mesas, en sectores interiores y exteriores de la sede de Recoleta."},
        ${"0"},
        ${"ARS"},
        ${""},
        ${0},
        ${"Mayores de 18 años. Promos de cerveza y picadas válidas durante el evento."},
        ${-34.5892},
        ${-58.3948}
      )
    `
  } else {
    await sql`
      UPDATE events
      SET
        created_by_user_id = ${organizer.id}::uuid,
        title = ${"DJ Set en Vivo en Blest Recoleta"},
        summary = ${"Noche de música con Sol Navarro y Lautaro Vega. Promos de cervezas artesanales y picadas de la casa."},
        location = ${"Blest Recoleta, Pres. Roberto M. Ortiz 1827, Recoleta, CABA"},
        starts_at = ${startsAt.toISOString()}::timestamptz,
        category = ARRAY['musica']::category[],
        description = ${"Blest Recoleta presenta una noche de música en vivo con dos DJ sets en secuencia. Sol Navarro abre la velada con house y electrónica melódica; Lautaro Vega cierra con progressive house y deep house. El local arma la propuesta con promos de cervezas artesanales y picadas para compartir en mesas, en sectores interiores y exteriores de la sede de Recoleta."},
        price_amount = ${"0"},
        price_currency = ${"ARS"},
        price_label = ${""},
        requirements = ${"Mayores de 18 años. Promos de cerveza y picadas válidas durante el evento."},
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

  console.log(`✓ Evento actualizado: DJ Set en Vivo en Blest Recoleta`)
  console.log(`  Emprendimientos: ${ENTREPRENEUR_EMAILS.join(", ")}`)
  console.log(`  Galería: ${GALLERY_IMAGES.length} imágenes`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
