import postgres from "postgres"

const EMAIL = "luciadiaz@hotmail.com"
const HEADLINE = "Lectura, poesía y encuentros literarios en Recoleta y la Ciudad."
const LOCATION = "Recoleta, CABA"
const DESCRIPTION =
  "Me encanta leer y compartir textos en voz alta. Coordino una comunidad de lectura de poesías y busco espacios íntimos para reunirnos y descubrir nuevas voces."
const INSTAGRAM_HANDLE = "luciadiaz.poesia"

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  const users = await sql<{ id: string }[]>`
    SELECT id::text FROM users WHERE email = ${EMAIL.toLowerCase()} LIMIT 1
  `

  const user = users[0]
  if (!user) {
    throw new Error(`No se encontró usuario ${EMAIL}`)
  }

  await sql`
    UPDATE users
    SET
      headline = ${HEADLINE},
      location = ${LOCATION},
      description = ${DESCRIPTION},
      updated_at = NOW()
    WHERE id = ${user.id}::uuid
  `

  await sql`
    DELETE FROM user_social_links
    WHERE user_id = ${user.id}::uuid AND platform = 'instagram'
  `

  await sql`
    INSERT INTO user_social_links (user_id, platform, handle)
    VALUES (${user.id}::uuid, 'instagram', ${INSTAGRAM_HANDLE})
  `

  await sql.end({ timeout: 5 })
  console.log(`✓ Perfil actualizado: ${EMAIL}`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
