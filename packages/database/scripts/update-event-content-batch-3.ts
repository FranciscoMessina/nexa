import postgres from "postgres"

const COFI_JAUS_ID = "d6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a"
const FIGURITAS_ID = "a4b8c2d1-6e3f-4a91-9b2c-1f0e8d7c6b5a"
const KIDDO_PAINTING_ID = "a1000045-0000-4000-8000-000000000045"
const VINILOS_VERMU_ID = "a1000017-0000-4000-8000-000000000017"
const MILONGA_ID = "a1000057-0000-4000-8000-000000000057"

const CLOTHING_GALLERY = [
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

  await replaceGallery(sql, COFI_JAUS_ID, CLOTHING_GALLERY)
  console.log("✓ Feria de ropa en Cofi Jaus Palermo — galería de ropa")

  await sql`
    UPDATE events SET
      starts_at = ${new Date("2026-07-13T16:00:00-03:00").toISOString()}::timestamptz,
      updated_at = NOW()
    WHERE id = ${FIGURITAS_ID}::uuid
  `
  console.log("✓ Intercambio de figuritas del Mundial → 13/07/2026 16:00 hs")

  for (const eventId of [KIDDO_PAINTING_ID, VINILOS_VERMU_ID]) {
    const deleted = await sql`
      DELETE FROM events WHERE id = ${eventId}::uuid RETURNING title
    `
    console.log(`✓ Eliminado: ${deleted[0]?.title ?? eventId}`)
  }

  await sql`
    UPDATE events SET
      title = ${"Exhibición de tango en Av. de Mayo"},
      summary = ${"Exhibición de tango en vivo frente al histórico Café Tortoni."},
      description = ${"Café Tortoni presenta una exhibición de tango en Av. de Mayo con pareja en vivo, música tradicional y un formato accesible para quienes quieren acercarse al baile porteño en uno de los emblemas de Monserrat."},
      updated_at = NOW()
    WHERE id = ${MILONGA_ID}::uuid
  `
  console.log("✓ Exhibición de tango en Av. de Mayo")

  await sql.end({ timeout: 5 })
  console.log("Listo.")
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
