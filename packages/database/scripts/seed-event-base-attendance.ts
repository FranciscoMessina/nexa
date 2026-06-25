import postgres from "postgres"

/** Debe coincidir con apps/web/src/features/events/utils/base-attendance.utils.ts */
const EVENT_BASE_ATTENDANCE: ReadonlyArray<{ id: string; count: number }> = [
  { id: "d6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a", count: 30 },
  { id: "e7f8a9b0-c1d2-4e3f-4a5b-6c7d8e9f0a1b", count: 28 },
  { id: "e4f5a6b7-c8d9-4e0f-1a2b-3c4d5e6f7a8b", count: 26 },
  { id: "f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c", count: 22 },
  { id: "f5a6b7c8-d9e0-4f1a-2b3c-4d5e6f7a8b9c", count: 20 },
  { id: "c7d8e9f0-a1b2-4c3d-9e0f-1a2b3c4d5e6f", count: 12 },
  { id: "d1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5a", count: 11 },
  { id: "f3a4b5c6-d7e8-4f9a-0b1c-2d3e4f5a6b7c", count: 14 },
  { id: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e", count: 13 },
  { id: "a4b8c2d1-6e3f-4a91-9b2c-1f0e8d7c6b5a", count: 10 },
]

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  for (const { id, count } of EVENT_BASE_ATTENDANCE) {
    const updated = await sql<{ title: string | null }[]>`
      UPDATE events
      SET base_attendance_count = ${count}, updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING title
    `

    if (updated[0]) {
      console.log(`✓ ${updated[0].title}: base ${count}`)
    }
  }

  await sql.end({ timeout: 5 })
  console.log("\n✓ Asistencia base aplicada a eventos demo.")
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
