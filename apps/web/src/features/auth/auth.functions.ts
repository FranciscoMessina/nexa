import { createServerFn } from "@tanstack/react-start"
import { loginSchema, signUpSchema } from "./validation/auth.schema"
import type { SignUpResult } from "./types/auth.types"

export const getSupabaseStatusFn = createServerFn({ method: "GET" }).handler(async () => {
  const { isSupabaseConfigured } = await import("@/shared/lib/supabase/config.server")
  return { configured: isSupabaseConfigured() }
})

export const signInFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const { signInWithPassword } = await import("./api/auth.supabase.server")
    const { user, error } = await signInWithPassword(data.email, data.password)

    if (error) {
      throw error
    }

    if (!user) {
      throw new Error(
        "Tu cuenta no tiene rol o nombre configurado en Supabase (user_metadata)."
      )
    }

    return user
  })

export const signUpFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => signUpSchema.parse(data))
  .handler(async ({ data }): Promise<SignUpResult> => {
    const { assertPasswordMeetsPolicy } = await import(
      "./utils/password-policy.utils"
    )
    assertPasswordMeetsPolicy(data.password)

    const { signUpWithPassword } = await import("./api/auth.supabase.server")
    const { user, needsEmailConfirmation, error } = await signUpWithPassword({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
      role: data.role,
    })

    if (error) {
      throw error
    }

    if (needsEmailConfirmation) {
      return {
        status: "email_confirmation",
        email: data.email.trim().toLowerCase(),
      }
    }

    if (!user) {
      throw new Error("No se pudo crear la cuenta. Intentá nuevamente.")
    }

    return { status: "session", user }
  })

export const signOutFn = createServerFn({ method: "POST" }).handler(async () => {
  const { signOut } = await import("./api/auth.supabase.server")
  await signOut()
  return { success: true as const }
})

export const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const { isSupabaseConfigured } = await import("@/shared/lib/supabase/config.server")

  if (!isSupabaseConfigured()) {
    return { user: null }
  }

  const { getSessionUser } = await import("./api/auth.supabase.server")
  const user = await getSessionUser()
  return { user }
})

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getOptionalAppUser } = await import("@/shared/lib/auth/session.server")
  const user = await getOptionalAppUser()
  return { user }
})
