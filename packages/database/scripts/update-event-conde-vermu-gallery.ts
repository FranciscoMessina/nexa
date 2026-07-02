import postgres from "postgres"

const EVENT_ID = "a1000041-0000-4000-8000-000000000041"

/** Portada vermú + arte en galería y bar. */
const GALLERY_URLS = [
  "https://images.unsplash.com/photo-1589824769965-d2bdab6dfe57?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1602806273007-e5a04e9c5aa6?auto=format&fit=crop&w=1200&q=80",
]

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  await sql`
    UPDATE events
    SET
      category = ARRAY['feria_de_emprendedores']::category[],
      updated_at = NOW()
    WHERE id = ${EVENT_ID}::uuid
  `

  await sql`DELETE FROM event_gallery_images WHERE event_id = ${EVENT_ID}::uuid`

  for (const [index, url] of GALLERY_URLS.entries()) {
    const n = index + 1
    const imageId = `${EVENT_ID.slice(0, 8)}-${String(n).padStart(4, "0")}-4000-8000-${String(n).padStart(12, "0")}`
    await sql`
      INSERT INTO event_gallery_images (id, event_id, url)
      VALUES (${imageId}::uuid, ${EVENT_ID}::uuid, ${url})
    `
  }

  await sql.end({ timeout: 5 })
  console.log("✓ Noche de vermú y stands en Conde — feria de emprendedores + galería arte/vermú")
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
