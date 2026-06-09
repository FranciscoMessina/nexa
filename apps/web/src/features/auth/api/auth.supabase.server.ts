import "@tanstack/react-start/server-only"
import type { AuthError, User } from "@supabase/supabase-js"
import { deleteCookie, setCookie } from "@tanstack/react-start/server"
import {
  createSupabaseServerClient,
  createSupabaseServerClientWithSession,
  supabaseSessionCookies,
} from "@/shared/lib/supabase/server"
import { getAppBaseUrl } from "@/shared/lib/email/config.server"
import { ensureAppUser, toAuthUser } from "./users.server"
import type { AuthUser, UserRole } from "../types/auth.types"

const USER_ROLES: ReadonlyArray<UserRole> = [
  "emprendedor",
  "organizador",
  "asistente",
]

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole)
}

/**
 * Set user_metadata.role and displayName (or display_name) in Supabase Dashboard
 * when creating users.
 */
export function mapSupabaseUserToAuthUser(user: User): Omit<AuthUser, "id" | "authUserId"> | null {
  const metadata = user.user_metadata as Record<string, unknown> | undefined
  const role = metadata?.role
  const displayName =
    (typeof metadata?.displayName === "string" && metadata.displayName) ||
    (typeof metadata?.display_name === "string" && metadata.display_name) ||
    null

  if (!isUserRole(role) || !displayName?.trim()) {
    return null
  }

  return {
    email: user.email ?? "",
    role,
    displayName: displayName.trim(),
  }
}

function persistSessionCookies(accessToken: string, refreshToken: string): void {
  const secure = process.env.NODE_ENV === "production"

  setCookie(supabaseSessionCookies.access, accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
  })

  setCookie(supabaseSessionCookies.refresh, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
  })
}

function clearSessionCookies(): void {
  deleteCookie(supabaseSessionCookies.access)
  deleteCookie(supabaseSessionCookies.refresh)
}

export type SignUpWithPasswordInput = {
  email: string
  password: string
  displayName: string
  role: UserRole
}

export type SignUpWithPasswordResult = {
  user: AuthUser | null
  needsEmailConfirmation: boolean
  error: AuthError | null
}

export async function signUpWithPassword(
  input: SignUpWithPasswordInput
): Promise<SignUpWithPasswordResult> {
  const supabase = createSupabaseServerClient()
  const email = input.email.trim().toLowerCase()
  const displayName = input.displayName.trim()

  const res = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      emailRedirectTo: `${getAppBaseUrl()}/login`,
      data: {
        role: input.role,
        displayName,
        display_name: displayName,
      },
    },
  })

  if (res.error) {
    return { user: null, needsEmailConfirmation: false, error: res.error }
  }

  const supabaseUser = res.data.user
  const session = res.data.session

  if (!supabaseUser) {
    return { user: null, needsEmailConfirmation: false, error: null }
  }

  if (!session?.access_token || !session.refresh_token) {
    return { user: null, needsEmailConfirmation: true, error: null }
  }

  persistSessionCookies(session.access_token, session.refresh_token)

  const appUser = await ensureAppUser(supabaseUser)
  const authUser = toAuthUser(appUser, supabaseUser)

  return { user: authUser, needsEmailConfirmation: false, error: null }
}

export async function signInWithPassword(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  const supabase = createSupabaseServerClient()
  const res = await supabase.auth.signInWithPassword({ email, password })

  if (res.error) {
    return { user: null, error: res.error }
  }

  const session = res.data.session
  const supabaseUser = res.data.user

  if (!supabaseUser) {
    return { user: null, error: null }
  }

  if (session?.access_token && session.refresh_token) {
    persistSessionCookies(session.access_token, session.refresh_token)
  }

  const appUser = await ensureAppUser(supabaseUser)
  const authUser = toAuthUser(appUser, supabaseUser)

  return { user: authUser, error: null }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  const supabase = await createSupabaseServerClientWithSession()
  const res = await supabase.auth.signOut()
  clearSessionCookies()
  return { error: res.error }
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseServerClientWithSession()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return null
  }

  const appUser = await ensureAppUser(data.user)
  return toAuthUser(appUser, data.user)
}
