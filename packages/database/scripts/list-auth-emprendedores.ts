import "dotenv/config"
import postgres from "postgres"

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  const rows = await sql<
    {
      id: string
      email: string
      raw_user_meta_data: { role?: string; displayName?: string; display_name?: string } | null
    }[]
  >`
    SELECT id::text, email, raw_user_meta_data
    FROM auth.users
    WHERE email NOT LIKE 'eventos@%'
    ORDER BY email
  `

  for (const row of rows) {
    const meta = row.raw_user_meta_data
    console.log(
      `${row.email} | role=${meta?.role ?? "-"} | name=${meta?.displayName ?? meta?.display_name ?? "-"} | authId=${row.id}`
    )
  }

  await sql.end({ timeout: 5 })
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
