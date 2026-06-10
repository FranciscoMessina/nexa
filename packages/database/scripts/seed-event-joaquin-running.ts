import postgres from "postgres"

const EVENT_ID = "f3a4b5c6-d7e8-4f9a-0b1c-2d3e4f5a6b7c"
const CREATOR_EMAIL = "joaquinsuarez@hotmail.com"

/** Mismo criterio que seed-events.source.ts: URLs directas de Unsplash. La primera es la portada. */
const GALLERY_URLS = [
  "https://images.unsplash.com/photo-1774791581465-a55d8fe6b2db?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1758521959972-83d0bd10a152?auto=format&fit=crop&w=1200&q=80",
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

  const startsAt = new Date("2026-06-27T11:00:00-03:00")

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
        ${"Running en la Costanera de Vicente López"},
        ${"Organizo una clase de running en la costanera de Vicente López. Encuentro en grupo, salida a correr y café en la zona."},
        ${"Vial Costero (Paseo de la Costa), Av. Raúl Ricardo Alfonsín y Laprida, Vicente López"},
        ${startsAt.toISOString()}::timestamptz,
        ARRAY['deportes']::category[],
        ${"Organizo una clase de running en la costanera de Vicente López para quienes quieran conocer cómo entrenamos. Nos encontramos en el punto de encuentro, salimos a correr juntos y después vamos por un café de la zona. Si te copa el deporte y querés sumarte a mis entrenamientos, vení a probar sin compromiso."},
        ${"0"},
        ${"ARS"},
        ${""},
        ${0},
        ${"Ropa cómoda y calzado para correr. Todos los niveles bienvenidos. Encuentro en la costanera. Evento comunitario."},
        ${-34.5262},
        ${-58.4724}
      )
    `
  } else {
    await sql`
      UPDATE events
      SET
        created_by_user_id = ${creator.id}::uuid,
        title = ${"Running en la Costanera de Vicente López"},
        summary = ${"Organizo una clase de running en la costanera de Vicente López. Encuentro en grupo, salida a correr y café en la zona."},
        location = ${"Vial Costero (Paseo de la Costa), Av. Raúl Ricardo Alfonsín y Laprida, Vicente López"},
        starts_at = ${startsAt.toISOString()}::timestamptz,
        category = ARRAY['deportes']::category[],
        description = ${"Organizo una clase de running en la costanera de Vicente López para quienes quieran conocer cómo entrenamos. Nos encontramos en el punto de encuentro, salimos a correr juntos y después vamos por un café de la zona. Si te copa el deporte y querés sumarte a mis entrenamientos, vení a probar sin compromiso."},
        price_amount = ${"0"},
        price_currency = ${"ARS"},
        price_label = ${""},
        requirements = ${"Ropa cómoda y calzado para correr. Todos los niveles bienvenidos. Encuentro en la costanera. Evento comunitario."},
        latitude = ${-34.5262},
        longitude = ${-58.4724},
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
