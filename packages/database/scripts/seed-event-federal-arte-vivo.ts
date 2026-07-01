import postgres from "postgres"

const EVENT_ID = "c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f"
const ORGANIZER_EMAIL = "eventos@federalbar.com.ar"
const ENTREPRENEUR_EMAILS = ["brumaarte@gmail.com"] as const

const GALLERY_IMAGES = [
  {
    id: "c1d2e3f4-0001-4000-8000-000000000001",
    url: "https://images.unsplash.com/photo-1602806273007-e5a04e9c5aa6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "c1d2e3f4-0002-4000-8000-000000000002",
    url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "c1d2e3f4-0003-4000-8000-000000000003",
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
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

  const startsAt = new Date("2026-07-30T19:00:00-03:00")

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
        longitude,
        base_attendance_count
      )
      VALUES (
        ${EVENT_ID}::uuid,
        ${organizer.id}::uuid,
        ${"Muestra de arte en vivo en El Federal Bar"},
        ${"Performance de pintura en vivo con Bruma Arte y promos gastronómicas de la casa en San Telmo."},
        ${"El Federal Bar, Carlos Calvo 599 esq. Perú, San Telmo, CABA"},
        ${startsAt.toISOString()}::timestamptz,
        ARRAY['arte_y_cultura']::category[],
        ${"El Federal Bar presenta una velada de arte en vivo con Bruma Arte, que realiza una performance de pintura frente al público en el salón del bar. La propuesta combina la experiencia artística con promos de comida, picadas porteñas y platos tradicionales de la casa.\nIdeal para quienes buscan un plan cultural distinto en uno de los bares más emblemáticos de San Telmo, con la posibilidad de conocer el proceso creativo de la artista mientras disfrutan de la propuesta gastronómica del local."},
        ${"0"},
        ${"ARS"},
        ${""},
        ${0},
        ${"Mayores de 18 años. Consumición mínima. Se recomienda reservar mesa con anticipación."},
        ${-34.6196019},
        ${-58.3742346},
        ${22}
      )
    `
  } else {
    await sql`
      UPDATE events
      SET
        created_by_user_id = ${organizer.id}::uuid,
        title = ${"Muestra de arte en vivo en El Federal Bar"},
        summary = ${"Performance de pintura en vivo con Bruma Arte y promos gastronómicas de la casa en San Telmo."},
        location = ${"El Federal Bar, Carlos Calvo 599 esq. Perú, San Telmo, CABA"},
        starts_at = ${startsAt.toISOString()}::timestamptz,
        category = ARRAY['arte_y_cultura']::category[],
        description = ${"El Federal Bar presenta una velada de arte en vivo con Bruma Arte, que realiza una performance de pintura frente al público en el salón del bar. La propuesta combina la experiencia artística con promos de comida, picadas porteñas y platos tradicionales de la casa.\nIdeal para quienes buscan un plan cultural distinto en uno de los bares más emblemáticos de San Telmo, con la posibilidad de conocer el proceso creativo de la artista mientras disfrutan de la propuesta gastronómica del local."},
        price_amount = ${"0"},
        price_currency = ${"ARS"},
        price_label = ${""},
        requirements = ${"Mayores de 18 años. Consumición mínima. Se recomienda reservar mesa con anticipación."},
        latitude = ${-34.6196019},
        longitude = ${-58.3742346},
        base_attendance_count = ${22},
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

  console.log("✓ Evento creado/actualizado: Muestra de arte en vivo en El Federal Bar")
  console.log(`  Emprendimientos: ${ENTREPRENEUR_EMAILS.join(", ")}`)
  console.log(`  Fecha: 30/07/2026 19:00 hs`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
