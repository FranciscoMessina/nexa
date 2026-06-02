import { config } from "dotenv"
import path from "node:path"
import { fileURLToPath } from "node:url"
import postgres from "postgres"

const root = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(root, "../../../apps/web/.env.local") })

async function probe(label: string, url: string | undefined) {
  if (!url?.trim()) {
    console.log(`\n${label}: (no definida)`)
    return false
  }

  const host = new URL(url.replace(/^postgresql:/, "http:")).hostname
  console.log(`\n${label} → ${host}`)

  const sql = postgres(url, {
    prepare: false,
    max: 1,
    ssl: "require",
    connect_timeout: 15,
  })

  try {
    const [{ ok }] = await sql<{ ok: number }[]>`select 1 as ok`
    const [{ users }] =
      await sql<{ users: string | null }[]>`select to_regclass('public.users')::text as users`
    console.log(`  ✅ conexión OK (users = ${users ?? "no existe"})`)
    return true
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const code = error instanceof Error && "code" in error ? String(error.code) : ""
    console.log(`  ❌ ${code ? `[${code}] ` : ""}${message}`)
    return false
  } finally {
    await sql.end({ timeout: 2 })
  }
}

const directOk = await probe("DIRECT_URL", process.env.DIRECT_URL)
const databaseOk = await probe("DATABASE_URL", process.env.DATABASE_URL)

if (!directOk) {
  console.log(
    "\nSin DIRECT_URL no podés correr db:migrate. Actualizá apps/web/.env.local desde el dashboard de Supabase."
  )
  process.exit(1)
}

if (!databaseOk) {
  console.log("\nDIRECT_URL funciona pero DATABASE_URL falla. Revisá el Transaction pooler (puerto 6543).")
  process.exit(1)
}

console.log("\nListo para: bun run db:migrate")
