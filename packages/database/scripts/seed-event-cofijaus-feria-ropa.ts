import postgres from "postgres"

const EVENT_ID = "d6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a"
const ORGANIZER_EMAIL = "eventos@cofijaus.com.ar"
const ENTREPRENEUR_EMAILS = [
  "crudo@gmail.com",
  "geiese@gmail.com",
  "nudosur@gmail.com",
  "estudioprisma@gmail.com",
] as const

/** Portada de remeras colgadas + indumentaria en Unsplash. La primera es la portada. */
const GALLERY_IMAGES = [
  {
    id: "d4000001-0000-4000-8000-000000000001",
    url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "d4000002-0000-4000-8000-000000000002",
    url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "d4000003-0000-4000-8000-000000000003",
    url: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
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

  const startsAt = new Date("2026-06-27T14:00:00-03:00")

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
        ${"Feria de Ropa en Cofi Jaus Palermo"},
        ${"Feria de indumentaria con CRUDO, GEIESE y Nudo Sur en Palermo Hollywood. Cobertura de Estudio Prisma y promos de comida de la casa."},
        ${"Cofi Jaus Palermo, Costa Rica 5729, Palermo Hollywood, CABA"},
        ${startsAt.toISOString()}::timestamptz,
        ARRAY['feria_de_emprendedores']::category[],
        ${"Cofi Jaus Palermo convoca una feria de ropa y diseño independiente en su espacio de Palermo Hollywood. CRUDO presenta indumentaria urbana de edición limitada; GEIESE, colecciones cápsula con producción local; y Nudo Sur, piezas textiles artesanales y decoración hecha a mano. Los tres emprendimientos exhiben y venden en stands con probadores. Estudio Prisma realiza la cobertura fotográfica de la jornada. La cafetería suma promos especiales de brunch, pastelería, café de especialidad y consumiciones para quienes visiten la feria."},
        ${"0"},
        ${"ARS"},
        ${""},
        ${0},
        ${"Entrada libre. Venta directa en stands. Promos de gastronomía válidas durante el horario de la feria."},
        ${-34.5889},
        ${-58.4315}
      )
    `
  } else {
    await sql`
      UPDATE events
      SET
        created_by_user_id = ${organizer.id}::uuid,
        title = ${"Feria de Ropa en Cofi Jaus Palermo"},
        summary = ${"Feria de indumentaria con CRUDO, GEIESE y Nudo Sur en Palermo Hollywood. Cobertura de Estudio Prisma y promos de comida de la casa."},
        location = ${"Cofi Jaus Palermo, Costa Rica 5729, Palermo Hollywood, CABA"},
        starts_at = ${startsAt.toISOString()}::timestamptz,
        category = ARRAY['feria_de_emprendedores']::category[],
        description = ${"Cofi Jaus Palermo convoca una feria de ropa y diseño independiente en su espacio de Palermo Hollywood. CRUDO presenta indumentaria urbana de edición limitada; GEIESE, colecciones cápsula con producción local; y Nudo Sur, piezas textiles artesanales y decoración hecha a mano. Los tres emprendimientos exhiben y venden en stands con probadores. Estudio Prisma realiza la cobertura fotográfica de la jornada. La cafetería suma promos especiales de brunch, pastelería, café de especialidad y consumiciones para quienes visiten la feria."},
        price_amount = ${"0"},
        price_currency = ${"ARS"},
        price_label = ${""},
        requirements = ${"Entrada libre. Venta directa en stands. Promos de gastronomía válidas durante el horario de la feria."},
        latitude = ${-34.5889},
        longitude = ${-58.4315},
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

  console.log(`✓ Evento actualizado: Feria de Ropa en Cofi Jaus Palermo`)
  console.log(`  Emprendimientos: ${ENTREPRENEUR_EMAILS.join(", ")}`)
  console.log(`  Galería: ${GALLERY_IMAGES.length} imágenes`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
