import "dotenv/config"
import postgres from "postgres"

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  const before = await sql<{ email: string; avatar_url: string | null; representative_image_url: string | null }[]>`
    SELECT email, avatar_url, representative_image_url
    FROM users
    WHERE avatar_url IS NOT NULL OR representative_image_url IS NOT NULL
  `

  console.log(`Usuarios con fotos (${before.length}):`)
  for (const row of before) {
    console.log(`  - ${row.email}`)
    if (row.avatar_url) console.log(`      avatar: ${row.avatar_url}`)
    if (row.representative_image_url) console.log(`      representative: ${row.representative_image_url}`)
  }

  const updated = await sql<{ email: string }[]>`
    UPDATE users
    SET
      avatar_url = NULL,
      representative_image_url = NULL,
      updated_at = NOW()
    WHERE avatar_url IS NOT NULL OR representative_image_url IS NOT NULL
    RETURNING email
  `

  console.log(`\nFotos eliminadas de ${updated.length} usuarios.`)

  await sql.end({ timeout: 5 })
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
