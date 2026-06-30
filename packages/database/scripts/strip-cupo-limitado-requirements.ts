import postgres from "postgres"

function stripCupoLimitado(requirements: string): string {
  const lines = requirements
    .split("\n")
    .map((line) =>
      line
        .replace(/\s*[Cc]upos?\s+limitados?[^.]*\.?\s*/gi, " ")
        .replace(/\s{2,}/g, " ")
        .trim()
        .replace(/^[.,\s]+|[.,\s]+$/g, "")
    )
    .filter((line) => line.length > 0)

  return lines.join("\n").trim()
}

async function main(): Promise<void> {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error("Missing DIRECT_URL")

  const sql = postgres(connectionString, { prepare: false, max: 1 })

  const rows = await sql<{ id: string; requirements: string | null }[]>`
    SELECT id::text, requirements
    FROM events
    WHERE requirements IS NOT NULL
      AND (
        requirements ILIKE ${"%cupo%limitad%"}
        OR requirements ILIKE ${"%cupos limitad%"}
      )
  `

  let updated = 0
  for (const row of rows) {
    const current = row.requirements ?? ""
    const next = stripCupoLimitado(current)
    if (next === current) continue

    await sql`
      UPDATE events
      SET requirements = ${next}, updated_at = NOW()
      WHERE id = ${row.id}::uuid
    `
    updated += 1
  }

  await sql.end({ timeout: 5 })
  console.log(`✓ Requisitos actualizados en ${updated} eventos (${rows.length} con cupo limitado).`)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
