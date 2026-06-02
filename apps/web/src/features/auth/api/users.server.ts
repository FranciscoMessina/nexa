import "@tanstack/react-start/server-only"
import type { User } from "@supabase/supabase-js"
import { eq } from "drizzle-orm"
import { users } from "@workspace/database"
import { toReadableDbError } from "@/shared/lib/db/db-errors"
import { getDb } from "@/shared/lib/db/get-db"
import type { AuthUser, UserRole } from "../types/auth.types"
import { mapSupabaseUserToAuthUser } from "./auth.supabase.server"

export type AppUserRow = typeof users.$inferSelect

export function toAuthUser(appUser: AppUserRow, supabaseUser: User): AuthUser {
  const mapped = mapSupabaseUserToAuthUser(supabaseUser)

  if (!mapped) {
    throw new Error(
      "Tu cuenta no tiene rol o nombre configurado en Supabase (user_metadata)."
    )
  }

  return {
    id: appUser.id,
    authUserId: appUser.authUserId,
    email: appUser.email,
    role: appUser.role as UserRole,
    displayName: appUser.displayName ?? mapped.displayName,
  }
}

export async function findAppUserByAuthUserId(authUserId: string): Promise<AppUserRow | null> {
  const database = getDb()

  try {
    const rows = await database
      .select()
      .from(users)
      .where(eq(users.authUserId, authUserId))
      .limit(1)

    return rows[0] ?? null
  } catch (error) {
    throw toReadableDbError(error)
  }
}

export async function ensureAppUser(supabaseUser: User): Promise<AppUserRow> {
  const mapped = mapSupabaseUserToAuthUser(supabaseUser)

  if (!mapped) {
    throw new Error(
      "Tu cuenta no tiene rol o nombre configurado en Supabase (user_metadata)."
    )
  }

  const existing = await findAppUserByAuthUserId(supabaseUser.id)

  if (existing) {
    return existing
  }

  const email = (mapped.email || supabaseUser.email)?.trim().toLowerCase()

  if (!email) {
    throw new Error("Tu cuenta no tiene un correo electrónico configurado.")
  }

  const database = getDb()

  let inserted: AppUserRow[]

  try {
    inserted = await database
      .insert(users)
      .values({
        authUserId: supabaseUser.id,
        role: mapped.role,
        displayName: mapped.displayName,
        email,
      })
      .returning()
  } catch (error) {
    throw toReadableDbError(error)
  }

  const row = inserted[0]

  if (!row) {
    throw new Error("No se pudo crear el perfil de usuario en la base de datos.")
  }

  return row
}
