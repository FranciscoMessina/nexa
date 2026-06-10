import postgres from "postgres"

const EVENT_ID = "c7d8e9f0-a1b2-4c3d-9e0f-1a2b3c4d5e6f"
const CREATOR_EMAIL = "agustinarios@gmail.com"

/** Mismo criterio que seed-events.source.ts: URLs directas de Unsplash. La primera es la portada. */
const GALLERY_URLS = [
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
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

  const startsAt = new Date("2026-07-04T10:00:00-03:00")

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
        ${"Clase de yoga abierta en Plaza Francia"},
        ${"Clase gratuita de yoga al aire libre para todos los niveles, en Plaza Francia, Recoleta."},
        ${"Plaza Francia, Av. del Libertador y Av. Pueyrredón, Recoleta, CABA"},
        ${startsAt.toISOString()}::timestamptz,
        ARRAY['deportes']::category[],
        ${"Te invito a una clase abierta de yoga en Plaza Francia. Traé tu mat o toalla y ropa cómoda: vamos a practicar al aire libre, con una propuesta accesible para principiantes y para quienes ya tienen experiencia."},
        ${"0"},
        ${"ARS"},
        ${""},
        ${0},
        ${"Traer mat o toalla. Ropa cómoda recomendada. Encuentro al aire libre. Evento comunitario."},
        ${-34.5883},
        ${-58.3922}
      )
    `
  } else {
    await sql`
      UPDATE events
      SET
        created_by_user_id = ${creator.id}::uuid,
        title = ${"Clase de yoga abierta en Plaza Francia"},
        summary = ${"Clase gratuita de yoga al aire libre para todos los niveles, en Plaza Francia, Recoleta."},
        location = ${"Plaza Francia, Av. del Libertador y Av. Pueyrredón, Recoleta, CABA"},
        starts_at = ${startsAt.toISOString()}::timestamptz,
        category = ARRAY['deportes']::category[],
        description = ${"Te invito a una clase abierta de yoga en Plaza Francia. Traé tu mat o toalla y ropa cómoda: vamos a practicar al aire libre, con una propuesta accesible para principiantes y para quienes ya tienen experiencia."},
        price_amount = ${"0"},
        price_currency = ${"ARS"},
        price_label = ${""},
        requirements = ${"Traer mat o toalla. Ropa cómoda recomendada. Encuentro al aire libre. Evento comunitario."},
        latitude = ${-34.5883},
        longitude = ${-58.3922},
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
