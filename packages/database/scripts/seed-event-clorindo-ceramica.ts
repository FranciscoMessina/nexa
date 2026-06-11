import postgres from "postgres"

const EVENT_ID = "f5a6b7c8-d9e0-4f1a-2b3c-4d5e6f7a8b9c"
const ORGANIZER_EMAIL = "eventos@clorindo.com.ar"
const ENTREPRENEUR_EMAILS = ["tierrataller@gmail.com"] as const

/** Mismo criterio que seed-events.source.ts: URLs directas de Unsplash. La primera es la portada. */
const GALLERY_IMAGES = [
  {
    id: "c3000001-0000-4000-8000-000000000001",
    url: "https://images.unsplash.com/photo-1767476106330-4e5a0b4dcf94?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "c3000002-0000-4000-8000-000000000002",
    url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "c3000003-0000-4000-8000-000000000003",
    url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
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

  const startsAt = new Date("2026-06-12T17:00:00-03:00")

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
        ${"Taller de cerámica en Clorindo Café"},
        ${"Tarde de cerámica artesanal con Tierra Taller en el patio de Clorindo, Recoleta."},
        ${"Clorindo Café, Talcahuano 1261, Recoleta, CABA"},
        ${startsAt.toISOString()}::timestamptz,
        ARRAY['talleres_y_cursos']::category[],
        ${"Clorindo Café y Tierra Taller convocan una tarde de cerámica artesanal en el patio de la Biblioteca Ricardo Güiraldes. El emprendimiento, especializado en cerámica y objetos decorativos hechos a mano, dicta un workshop abierto para principiantes y aficionados: demostración de técnicas, materiales incluidos y espacio para crear una pieza propia. El café complementa la experiencia con consumiciones en un entorno histórico de Recoleta."},
        ${"0"},
        ${"ARS"},
        ${""},
        ${0},
        ${"No se requiere experiencia previa. Materiales incluidos. Cupo limitado."},
        ${-34.5926},
        ${-58.3934}
      )
    `
  } else {
    await sql`
      UPDATE events
      SET
        created_by_user_id = ${organizer.id}::uuid,
        title = ${"Taller de cerámica en Clorindo Café"},
        summary = ${"Tarde de cerámica artesanal con Tierra Taller en el patio de Clorindo, Recoleta."},
        location = ${"Clorindo Café, Talcahuano 1261, Recoleta, CABA"},
        starts_at = ${startsAt.toISOString()}::timestamptz,
        category = ARRAY['talleres_y_cursos']::category[],
        description = ${"Clorindo Café y Tierra Taller convocan una tarde de cerámica artesanal en el patio de la Biblioteca Ricardo Güiraldes. El emprendimiento, especializado en cerámica y objetos decorativos hechos a mano, dicta un workshop abierto para principiantes y aficionados: demostración de técnicas, materiales incluidos y espacio para crear una pieza propia. El café complementa la experiencia con consumiciones en un entorno histórico de Recoleta."},
        price_amount = ${"0"},
        price_currency = ${"ARS"},
        price_label = ${""},
        requirements = ${"No se requiere experiencia previa. Materiales incluidos. Cupo limitado."},
        latitude = ${-34.5926},
        longitude = ${-58.3934},
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

  console.log(`✓ Evento actualizado: Taller de cerámica en Clorindo Café`)
  console.log(`  Emprendimientos: ${ENTREPRENEUR_EMAILS.join(", ")}`)
  console.log(`  Galería: ${GALLERY_IMAGES.length} imágenes`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
