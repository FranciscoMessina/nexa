import "@tanstack/react-start/server-only"
import { createSupabaseServerClientWithSession } from "@/shared/lib/supabase/server"
import {
  ensureAppUser,
  toAuthUser,
} from "@/features/auth/api/users.server"
import type { AuthUser, UserRole } from "@/features/auth/types/auth.types"
import { ForbiddenError, UnauthorizedError } from "./errors.server"

export async function getOptionalAppUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseServerClientWithSession()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return null
  }

  const appUser = await ensureAppUser(data.user)
  return toAuthUser(appUser, data.user)
}

export async function requireAppUser(): Promise<AuthUser> {
  const user = await getOptionalAppUser()

  if (!user) {
    throw new UnauthorizedError()
  }

  return user
}

export function requireRole(user: AuthUser, allowedRoles: ReadonlyArray<UserRole>): void {
  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError("Tu rol no tiene permiso para esta acción.")
  }
}
