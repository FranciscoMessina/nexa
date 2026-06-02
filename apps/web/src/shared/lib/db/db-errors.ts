import { DrizzleQueryError } from "drizzle-orm"

function postgresCauseMessage(error: DrizzleQueryError): string {
  const cause = error.cause
  if (cause instanceof Error) {
    return cause.message
  }
  if (typeof cause === "string") {
    return cause
  }
  return ""
}

export function toReadableDbError(error: unknown): Error {
  if (!(error instanceof DrizzleQueryError)) {
    return error instanceof Error ? error : new Error(String(error))
  }

  const cause = postgresCauseMessage(error)

  if (/relation ["']?users["']? does not exist/i.test(cause)) {
    return new Error(
      "Falta el esquema de la base de datos. Desde la raíz del repo ejecutá: bun run db:migrate"
    )
  }

  if (
    /CONNECT_TIMEOUT|ECONNREFUSED|ENOTFOUND|connection/i.test(cause) ||
    /CONNECT_TIMEOUT|ECONNREFUSED|ENOTFOUND/i.test(error.message)
  ) {
    return new Error(
      "No se pudo conectar a PostgreSQL. Revisá DATABASE_URL en apps/web/.env.local (Transaction pooler, puerto 6543, ?pgbouncer=true)."
    )
  }

  if (cause) {
    return new Error(cause)
  }

  return new Error(error.message)
}
