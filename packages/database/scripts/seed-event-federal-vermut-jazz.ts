import postgres from "postgres"

const EVENT_ID = "16eb2fcc-bc94-4afa-8730-74c76fe784bd"
const ORGANIZER_EMAIL = "eventos@federalbar.com.ar"
const ENTREPRENEUR_EMAILS = ["lozajazz@gmail.com"] as const

const GALLERY_IMAGES = [
  {
    id: "16eb2fcc-0001-4000-8000-000000000001",
    url: "https://images.unsplash.com/photo-1589824769965-d2bdab6dfe57?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w5ODU3NDl8MHwxfHNlYXJjaHwxfHx2ZXJtb3V0aCUyMGFwZXJpdGl2byUyMGdsYXNzZXN8ZW58MHwwfHx8MTc4MjQxMzI1MHww&ixlib=rb-4.1.0&q=80&w=1200&auto=format",
  },
  {
    id: "16eb2fcc-0002-4000-8000-000000000002",
    url: "https://images.unsplash.com/photo-1668431456021-dc83abe07992?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w5ODU3NDl8MHwxfHNlYXJjaHwyfHx2ZXJtb3V0aCUyMGFwZXJpdGl2byUyMGdsYXNzZXN8ZW58MHwwfHx8MTc4MjQxMzI1MHww&ixlib=rb-4.1.0&q=80&w=1200&auto=format",
  },
  {
    id: "16eb2fcc-0003-4000-8000-000000000003",
    url: "https://images.unsplash.com/photo-1593433855865-6046a14605b9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w5ODU3NDl8MHwxfHNlYXJjaHwzfHx2ZXJtb3V0aCUyMGFwZXJpdGl2byUyMGdsYXNzZXN8ZW58MHwwfHx8MTc4MjQxMzI1MHww&ixlib=rb-4.1.0&q=80&w=1200&auto=format",
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

  const startsAt = new Date("2026-06-22T12:00:00-03:00")

  await sql`
    UPDATE events
    SET
      created_by_user_id = ${organizer.id}::uuid,
      title = ${"Vermut & Jazz en El Federal Bar"},
      summary = ${"Jazz en vivo con Loza Jazz, vermutería y picadas porteñas en un bar histórico de San Telmo."},
      location = ${"El Federal Bar, Carlos Calvo 599 esq. Perú, San Telmo, CABA"},
      starts_at = ${startsAt.toISOString()}::timestamptz,
      category = ARRAY['musica']::category[],
      description = ${"El Federal Bar invita a una noche especial de jazz en vivo con Loza Jazz en pleno corazón de San Telmo. La propuesta combina música en formato íntimo, vermutería clásica, picadas porteñas y platos tradicionales de la casa.\nLa velada está pensada para vecinos, turistas y amantes de los planes culturales que buscan disfrutar de una experiencia diferente en uno de los bares más emblemáticos de Buenos Aires.\nDurante la noche habrá una selección musical de jazz a cargo de Loza Jazz, promociones de vermut y opciones gastronómicas para compartir."},
      requirements = ${"Mayores de 18 años. Se recomienda reservar mesa con anticipación. Consumición mínima durante el evento."},
      latitude = ${-34.6196019},
      longitude = ${-58.3742346},
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

  console.log("✓ Evento actualizado: Vermut & Jazz en El Federal Bar")
  console.log(`  Emprendimientos: ${ENTREPRENEUR_EMAILS.join(", ")}`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
