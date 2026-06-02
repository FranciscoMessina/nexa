import { config } from "dotenv"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

const root = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(root, "..")

config({ path: path.resolve(packageRoot, "../../apps/web/.env.local") })

const url = process.env.DIRECT_URL?.trim()

if (!url) {
  console.error(
    "❌ DIRECT_URL no está definida en apps/web/.env.local\n" +
      "   Copiá la connection string desde Supabase → Project Settings → Database\n" +
      "   (Session pooler, puerto 5432, usuario postgres.[ref])."
  )
  process.exit(1)
}

const host = (() => {
  try {
    return new URL(url.replace(/^postgresql:/, "http:")).hostname
  } catch {
    return "(url inválida)"
  }
})()

console.log(`→ Conectando a ${host} (DIRECT_URL)…`)

const sql = postgres(url, {
  prepare: false,
  max: 1,
  ssl: "require",
  connect_timeout: 30,
})

const db = drizzle(sql)

try {
  await migrate(db, { migrationsFolder: path.join(packageRoot, "drizzle") })
  console.log("✅ Migraciones aplicadas.")
} catch (error) {
  console.error("\n❌ No se pudieron aplicar las migraciones:\n")

  if (error instanceof Error) {
    console.error(error.message)

    if ("code" in error && typeof error.code === "string") {
      console.error(`   código: ${error.code}`)
    }

    if (/CONNECT_TIMEOUT|ECONNREFUSED|ENOTFOUND/i.test(error.message)) {
      console.error(
        "\nSugerencias:\n" +
          "  • Copiá de nuevo las URLs en Supabase → Settings → Database (mismo proyecto).\n" +
          "  • Si db.[ref].supabase.co falla (ENOTFOUND), usá Session pooler en DIRECT_URL.\n" +
          "  • Verificá que el proyecto no esté pausado y que la contraseña sea correcta.\n" +
          "  • Probá la conexión con: bun run db:check"
      )
    }
  } else {
    console.error(error)
  }

  process.exit(1)
} finally {
  await sql.end({ timeout: 5 })
}
