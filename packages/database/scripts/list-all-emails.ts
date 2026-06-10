import "dotenv/config"
import postgres from "postgres"

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  const publicUsers = await sql<{ email: string; role: string; display_name: string | null }[]>`
    SELECT email, role, display_name FROM users ORDER BY email
  `

  const authUsers = await sql<{ email: string }[]>`
    SELECT email FROM auth.users ORDER BY email
  `

  console.log("=== public.users ===")
  for (const row of publicUsers) {
    console.log(`${row.role} | ${row.email} | ${row.display_name ?? "-"}`)
  }
  console.log(`Total public: ${publicUsers.length}`)

  console.log("\n=== auth.users ===")
  for (const row of authUsers) {
    console.log(row.email)
  }
  console.log(`Total auth: ${authUsers.length}`)

  await sql.end({ timeout: 5 })
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
