import { db } from "@workspace/database"

export function getDb() {
  if (!db) {
    throw new Error(
      "DATABASE_URL no está configurada. Agregala en apps/web/.env.local y ejecutá bun run db:migrate."
    )
  }

  return db
}
