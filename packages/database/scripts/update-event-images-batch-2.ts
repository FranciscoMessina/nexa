import postgres from "postgres"

const PAINTING_GALLERY = [
  "https://images.unsplash.com/photo-1602806273007-e5a04e9c5aa6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1612743140645-cd448eac75f4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
]

const CLOTHING_ART_GALLERY = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
]

const FORMAL_VERMU_GALLERY = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1510812431401-41d2bd272135?auto=format&fit=crop&w=1200&q=80",
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

  const tallerId = "a1000038-0000-4000-8000-000000000038"
  await sql`
    UPDATE events SET
      title = ${"Taller de pintura en Estudio Dorrego"},
      summary = ${"Taller práctico de pintura con demostración en vivo en Estudio Dorrego."},
      description = ${"Estudio Dorrego convoca un taller de pintura con demostración en vivo y espacio para practicar técnicas básicas. La propuesta combina observación, ejercicios guiados y materiales de apoyo en un entorno de estudio en Colegiales."},
      requirements = ${"Traer materiales propios."},
      updated_at = NOW()
    WHERE id = ${tallerId}::uuid
  `
  await replaceGallery(sql, tallerId, PAINTING_GALLERY)
  console.log("✓ Taller de pintura en Estudio Dorrego")

  const feriaId = "a1000043-0000-4000-8000-000000000043"
  await replaceGallery(sql, feriaId, CLOTHING_ART_GALLERY)
  console.log("✓ Feria de ropa y arte — galería")

  const vermuId = "a1000041-0000-4000-8000-000000000041"
  await replaceGallery(sql, vermuId, FORMAL_VERMU_GALLERY)
  console.log("✓ Noche de vermú y stands en Conde — galería")

  await sql.end({ timeout: 5 })
  console.log("Listo.")
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
