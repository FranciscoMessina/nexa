import "dotenv/config"
import postgres from "postgres"

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  const rows = await sql<
    {
      email: string
      display_name: string | null
      headline: string | null
      location: string | null
      description: string | null
      avatar_url: string | null
      representative_image_url: string | null
    }[]
  >`
    SELECT email, display_name, headline, location, description, avatar_url, representative_image_url
    FROM users
    WHERE email LIKE 'eventos@%'
    ORDER BY email
  `

  console.log(JSON.stringify(rows, null, 2))
  await sql.end({ timeout: 5 })
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
