import { createServerFn } from "@tanstack/react-start"
import type { LoginPayload } from "./types/auth.types"

export const getSupabaseStatusFn = createServerFn({ method: "GET" }).handler(async () => {
  const { isSupabaseConfigured } = await import("@/shared/lib/supabase/config.server")
  return { configured: isSupabaseConfigured() }
})

export const signInFn = createServerFn({ method: "POST" })
  .inputValidator((data: LoginPayload) => data)
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
