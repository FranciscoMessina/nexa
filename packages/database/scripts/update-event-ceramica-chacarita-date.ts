import postgres from "postgres"

const EVENT_ID = "a1000047-0000-4000-8000-000000000047"
const STARTS_AT = "2026-07-04T16:00:00-03:00"

const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
if (!connectionString) throw new Error("Missing DIRECT_URL")

const sql = postgres(connectionString, { prepare: false, max: 1 })

const updated = await sql`
  UPDATE events
  SET starts_at = ${STARTS_AT}::timestamptz, updated_at = NOW()
  WHERE id = ${EVENT_ID}::uuid
  RETURNING title, starts_at
`

if (!updated[0]) {
  throw new Error("Evento no encontrado")
}

console.log(`✓ ${updated[0].title}`)
console.log(`  ${updated[0].starts_at?.toISOString()}`)

await sql.end({ timeout: 5 })
