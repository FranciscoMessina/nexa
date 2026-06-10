import "dotenv/config"
import postgres from "postgres"

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()

  if (!connectionString) {
    throw new Error("Definí DIRECT_URL o DATABASE_URL en apps/web/.env.local")
  }

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  console.log("Limpiando tablas public (eventos, perfiles demo)...")
  await sql`
    TRUNCATE TABLE event_favorites, event_attendees, event_entrepreneurs, event_gallery_images, events, user_gallery_images, user_social_links, users RESTART IDENTITY CASCADE
  `

  console.log("Limpiando usuarios demo en auth...")
  await sql`DELETE FROM auth.identities`
  const deleted = await sql<{ email: string }[]>`
    DELETE FROM auth.users
    RETURNING email
  `

  console.log(`Eliminados ${deleted.length} usuarios de auth:`)
  for (const row of deleted) {
    console.log(`  - ${row.email}`)
  }

  await sql.end({ timeout: 5 })
  console.log("Listo. La base quedó vacía para datos reales.")
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
