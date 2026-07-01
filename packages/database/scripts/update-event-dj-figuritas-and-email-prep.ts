import postgres from "postgres"

const DJ_SUNSET_ID = "a1000024-0000-4000-8000-000000000024"
const FIGURITAS_ID = "a4b8c2d1-6e3f-4a91-9b2c-1f0e8d7c6b5a"
const COFFEE_BOOKS_ID = "a1000023-0000-4000-8000-000000000023"
const POESIA_ID = "d1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5a"
const RECIPIENT_EMAIL = "trinidadechevarria_@hotmail.com"

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  const djStartsAt = new Date("2026-07-18T18:30:00-03:00")
  await sql`
    UPDATE events
    SET
      title = ${"DJ Sunset e Soho"},
      starts_at = ${djStartsAt.toISOString()}::timestamptz,
      description = ${"Dársena Bar Palermo presenta DJ Sunset e Soho con Lautaro Vega y Sol Navarro. La propuesta combina electrónica al atardecer, consumiciones del bar y un formato distendido para comenzar la noche en Palermo Soho."},
      updated_at = NOW()
    WHERE id = ${DJ_SUNSET_ID}::uuid
  `
  console.log("✓ DJ Sunset e Soho → 18/07/2026 18:30 hs")

  const figuritasStartsAt = new Date("2026-07-13T16:00:00-03:00")
  await sql`
    UPDATE events
    SET
      starts_at = ${figuritasStartsAt.toISOString()}::timestamptz,
      updated_at = NOW()
    WHERE id = ${FIGURITAS_ID}::uuid
  `
  console.log("✓ Intercambio de figuritas del Mundial → 13/07/2026 16:00 hs")

  const users = await sql<{ id: string }[]>`
    SELECT id::text FROM users WHERE email = ${RECIPIENT_EMAIL.toLowerCase()} LIMIT 1
  `
  const userId = users[0]?.id
  if (!userId) throw new Error(`Usuario no encontrado: ${RECIPIENT_EMAIL}`)

  await sql`
    UPDATE users
    SET accepts_email_communications = true, updated_at = NOW()
    WHERE id = ${userId}::uuid
  `

  await sql`
    DELETE FROM event_attendees
    WHERE user_id = ${userId}::uuid
      AND event_id = ${COFFEE_BOOKS_ID}::uuid
  `

  await sql`
    INSERT INTO event_attendees (event_id, user_id, registered_at)
    VALUES (${POESIA_ID}::uuid, ${userId}::uuid, NOW())
    ON CONFLICT (event_id, user_id) DO UPDATE
    SET registered_at = NOW()
  `

  await sql.end({ timeout: 5 })
  console.log(`✓ Datos listos para recomendar Coffee & Books Club a ${RECIPIENT_EMAIL}`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
