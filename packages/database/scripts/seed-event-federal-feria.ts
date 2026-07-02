import postgres from "postgres"

const EVENT_ID = "fd04ee94-b82a-4efa-930f-1ef3505a64aa"
const ORGANIZER_EMAIL = "eventos@federalbar.com.ar"
const ENTREPRENEUR_EMAILS = [
  "crudo@gmail.com",
  "geiese@gmail.com",
  "brumaarte@gmail.com",
  "estudiolienzo@gmail.com",
] as const

const GALLERY_IMAGES = [
  {
    id: "fd04ee94-0001-4000-8000-000000000001",
    url: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "fd04ee94-0002-4000-8000-000000000002",
    url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "fd04ee94-0003-4000-8000-000000000003",
    url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
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

  const startsAt = new Date("2026-07-31T14:00:00-03:00")

  await sql`
    UPDATE events
    SET
      created_by_user_id = ${organizer.id}::uuid,
      title = ${"Tarde de Feria en El Federal Bar"},
      summary = ${"Feria de ropa y arte independiente con CRUDO, GEIESE, Bruma Arte y Estudio Lienzo. Promos gastronómicas de la casa en San Telmo."},
      location = ${"El Federal Bar, Carlos Calvo 599 esq. Perú, San Telmo, CABA"},
      starts_at = ${startsAt.toISOString()}::timestamptz,
      category = ARRAY['feria_de_emprendedores']::category[],
      description = ${"El Federal Bar abre sus puertas para una tarde de feria con emprendimientos de indumentaria y arte. CRUDO y GEIESE exhiben diseño independiente y prendas de edición limitada; Bruma Arte y Estudio Lienzo suman piezas artísticas y propuestas visuales en stands para recorrer y comprar.\nLa jornada incluye promos de comida, picadas porteñas y la carta emblemática del bar en uno de los espacios más históricos de San Telmo. Formato distendido para descubrir creadores locales mientras disfrutás de la propuesta gastronómica del local."},
      price_amount = ${"0"},
      price_currency = ${"ARS"},
      price_label = ${""},
      requirements = ${"Entrada libre. Venta directa en stands. Promos de gastronomía válidas durante el horario de la feria. Mayores de 18 años."},
      latitude = ${-34.6196019},
      longitude = ${-58.3742346},
      base_attendance_count = ${24},
      updated_at = NOW()
    WHERE id = ${EVENT_ID}::uuid
  `

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

  console.log("✓ Evento actualizado: Tarde de Feria en El Federal Bar")
  console.log(`  Emprendimientos: ${ENTREPRENEUR_EMAILS.join(", ")}`)
  console.log(`  Fecha: 31/07/2026 14:00 hs`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
