import postgres from "postgres"

const EVENT_ID = "d6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a"

/** Portada: boutique de indumentaria. */
const COVER_URL =
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80"

const GALLERY_URLS = [
  COVER_URL,
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
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
  await replaceGallery(sql, EVENT_ID, GALLERY_URLS)
  await sql.end({ timeout: 5 })
  console.log("✓ Feria de Ropa en Cofi Jaus Palermo — portada con URL pública")
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
