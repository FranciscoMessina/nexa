import postgres from "postgres"

const COFI_JAUS_ID = "d6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a"
const FERIA_ROPA_ARTE_ID = "a1000043-0000-4000-8000-000000000043"
const PUNTO_CAFE_EMAIL = "puntocafe.eventos@gmail.com"

/** Nueva portada: ambiente de café/brunch en Cofi Jaus; el resto mantiene fotos de indumentaria. */
const COFI_JAUS_GALLERY = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
]

async function replaceGallery(
  sql: postgres.Sql,
  eventId: string,
  urls: Array<string>
): Promise<void> {
  await sql`DELETE FROM event_gallery_images WHERE event_id = ${eventId}::uuid`
  for (const [index, url] of urls.entries()) {
    const n = index + 1
    const imageId = `${eventId.slice(0, 8)}-${String(n).padStart(4, "0")}-4000-8000-${String(n).padStart(12, "0")}`
    await sql`
      INSERT INTO event_gallery_images (id, event_id, url)
      VALUES (${imageId}::uuid, ${eventId}::uuid, ${url})
    `
  }
}

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  await replaceGallery(sql, COFI_JAUS_ID, COFI_JAUS_GALLERY)
  console.log("✓ Feria de ropa en Cofi Jaus Palermo — nueva portada")

  const organizers = await sql<{ id: string }[]>`
    SELECT id::text FROM users WHERE email = ${PUNTO_CAFE_EMAIL.toLowerCase()} LIMIT 1
  `

  const organizer = organizers[0]
  if (!organizer) {
    throw new Error(`No se encontró organizador ${PUNTO_CAFE_EMAIL}`)
  }

  await sql`
    UPDATE events
    SET
      created_by_user_id = ${organizer.id}::uuid,
      location = ${"Punto Café, Av. Cabildo 1999, Belgrano, CABA"},
      latitude = ${-34.5564},
      longitude = ${-58.4581},
      summary = ${"Feria de indumentaria y arte independiente en Belgrano, con stands para recorrer y comprar."},
      description = ${"Punto Café abre sus puertas en Belgrano para una feria de ropa y arte con emprendedores locales. Stands para ver colecciones, probar talles y llevarse piezas únicas de diseño independiente, en un formato distendido con café de la casa."},
      updated_at = NOW()
    WHERE id = ${FERIA_ROPA_ARTE_ID}::uuid
  `

  console.log("✓ Feria de ropa y arte → Punto Café, Av. Cabildo 1999, Belgrano")

  await sql.end({ timeout: 5 })
  console.log("Listo.")
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
