import "dotenv/config"
import postgres from "postgres"

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  const rows = await sql<{ email: string; role: string; display_name: string | null }[]>`
    SELECT email, role, display_name
    FROM users
    ORDER BY role, email
  `

  for (const row of rows) {
    console.log(`${row.role} | ${row.email} | ${row.display_name ?? "-"}`)
  }

  console.log("---")
  console.log(`Total: ${rows.length}`)

  await sql.end({ timeout: 5 })
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
