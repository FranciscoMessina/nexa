import type { AuthChangeEvent, Subscription } from "@supabase/supabase-js"
import { AuthError as SupabaseAuthError } from "@supabase/supabase-js"
import { AuthError, loginMock } from "../api/auth.api"
import {
  getSessionFn,
  getSupabaseStatusFn,
  signInFn,
  signOutFn,
} from "../auth.functions"
import type { AuthUser, LoginPayload } from "../types/auth.types"

const STORAGE_KEY = "nexa-auth-user"

let supabaseConfiguredCache: boolean | null = null

async function isSupabaseConfiguredOnServer(): Promise<boolean> {
  if (supabaseConfiguredCache !== null) {
    return supabaseConfiguredCache
  }

  const status = await getSupabaseStatusFn()
  supabaseConfiguredCache = status.configured
  return status.configured
}

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof (parsed as AuthUser).email === "string" &&
      typeof (parsed as AuthUser).displayName === "string" &&
      typeof (parsed as AuthUser).role === "string"
    ) {
      return parsed as AuthUser
    }
  } catch {
    // ignore
  }

  return null
}

function persistUser(user: AuthUser, remember?: boolean): void {
  if (typeof window === "undefined" || !remember) return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } catch {
    // ignore
  }
}

function clearStoredUser(): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

function mapSupabaseAuthError(error: unknown): AuthError {
  if (error instanceof SupabaseAuthError) {
    const message = error.message.toLowerCase()

    if (message.includes("invalid login credentials") || message.includes("invalid email")) {
      return new AuthError("invalid-email", "El correo o la contraseña no son válidos.")
    }

    if (message.includes("password")) {
      return new AuthError("invalid-password", "La contraseña no es válida.")
    }

    return new AuthError("invalid-email", error.message)
  }

  if (error instanceof Error) {
    return new AuthError("invalid-email", error.message)
  }

  return new AuthError("invalid-email", "No se pudo iniciar sesión.")
}

async function loginWithSupabase(payload: LoginPayload): Promise<AuthUser> {
  try {
    const user = await signInFn({ data: payload })
    persistUser(user, payload.remember)
    return user
  } catch (error) {
    throw mapSupabaseAuthError(error)
  }
}

async function login(payload: LoginPayload): Promise<AuthUser> {
  if (await isSupabaseConfiguredOnServer()) {
    return loginWithSupabase(payload)
  }

  const user = await loginMock(payload)
  persistUser(user, payload.remember)
  return user
}

async function logout(): Promise<void> {
  if (await isSupabaseConfiguredOnServer()) {
    await signOutFn()
  }

  clearStoredUser()
}

async function getCurrentUser(): Promise<AuthUser | null> {
  if (await isSupabaseConfiguredOnServer()) {
    const { user } = await getSessionFn()
    if (user) {
      return user
    }
  }

  return readStoredUser()
}

function subscribeToAuthChanges(
  handler: (event: AuthChangeEvent, user: AuthUser | null) => void
): Subscription {
  void handler
  return {
    id: "server-auth-subscription",
    callback: () => undefined,
    unsubscribe: () => undefined,
  }
}

export const authService = {
  login,
  logout,
  getCurrentUser,
  subscribeToAuthChanges,
}

export default authService
