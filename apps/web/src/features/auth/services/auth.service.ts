import { AuthError as SupabaseAuthError } from "@supabase/supabase-js"
import { AuthError } from "../constants/auth.constants"
import {
  getCurrentUserFn,
  getSupabaseStatusFn,
  signInFn,
  signOutFn,
  signUpFn,
} from "../auth.functions"
import type { AuthUser, LoginPayload, SignUpPayload, SignUpResult } from "../types/auth.types"

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
      typeof (parsed as AuthUser).id === "string" &&
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

function mapSupabaseAuthError(error: unknown, context: "login" | "signup" = "login"): AuthError {
  if (error instanceof SupabaseAuthError) {
    const message = error.message.toLowerCase()

    if (
      message.includes("already registered") ||
      message.includes("already exists") ||
      message.includes("user already")
    ) {
      return new AuthError(
        "email-taken",
        "Ya existe una cuenta con ese correo. Iniciá sesión o usá otro email."
      )
    }

    if (message.includes("invalid login credentials") || message.includes("invalid email")) {
      return new AuthError(
        "invalid-email",
        context === "signup"
          ? "El correo no es válido o ya está en uso."
          : "El correo o la contraseña no son válidos."
      )
    }

    if (message.includes("password")) {
      return new AuthError("invalid-password", "La contraseña no cumple los requisitos mínimos.")
    }

    return new AuthError(
      context === "signup" ? "signup-failed" : "invalid-email",
      error.message
    )
  }

  if (error instanceof Error) {
    return new AuthError(
      context === "signup" ? "signup-failed" : "invalid-email",
      error.message
    )
  }

  return new AuthError(
    context === "signup" ? "signup-failed" : "invalid-email",
    context === "signup" ? "No se pudo crear la cuenta." : "No se pudo iniciar sesión."
  )
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
  if (!(await isSupabaseConfiguredOnServer())) {
    throw new AuthError(
      "invalid-email",
      "Supabase no está configurado. Revisá SUPABASE_URL y SUPABASE_ANON_KEY."
    )
  }

  return loginWithSupabase(payload)
}

async function register(payload: SignUpPayload): Promise<SignUpResult> {
  if (!(await isSupabaseConfiguredOnServer())) {
    throw new AuthError(
      "signup-failed",
      "Supabase no está configurado. Revisá SUPABASE_URL y SUPABASE_ANON_KEY."
    )
  }

  try {
    const result = await signUpFn({ data: payload })

    if (result.status === "session") {
      persistUser(result.user, payload.remember)
    }

    return result
  } catch (error) {
    throw mapSupabaseAuthError(error, "signup")
  }
}

async function logout(): Promise<void> {
  if (await isSupabaseConfiguredOnServer()) {
    await signOutFn()
  }

  clearStoredUser()
}

async function getCurrentUser(): Promise<AuthUser | null> {
  if (await isSupabaseConfiguredOnServer()) {
    const { user } = await getCurrentUserFn()
    if (user) {
      return user
    }
  }

  return readStoredUser()
}

function getCachedUser(): AuthUser | null {
  return readStoredUser()
}

export const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getCachedUser,
  hydrateFromSession: getCurrentUser,
}

export default authService
