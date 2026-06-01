import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema"

type Database = PostgresJsDatabase<typeof schema>

const globalForDb = globalThis as unknown as {
  db: Database | null | undefined
  sql: ReturnType<typeof postgres> | undefined
}

function createDb(): Database | null {
  const connectionString = process.env.DATABASE_URL?.trim()
  if (!connectionString) {
    return null
  }

  const sql =
    globalForDb.sql ??
    postgres(connectionString, {
      prepare: false,
      max: 1,
    })

  if (process.env.NODE_ENV !== "production") {
    globalForDb.sql = sql
  }

  return drizzle(sql, { schema })
}

export const db = globalForDb.db ?? createDb()

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim())
}
