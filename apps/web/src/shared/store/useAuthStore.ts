import { create } from "zustand"
import type { AuthUser, LoginPayload } from "@/features/auth/types/auth.types"
import { loginMock } from "@/features/auth/api/auth.api"

const STORAGE_KEY = "nexa-auth-user"

type AuthState = {
  user: AuthUser | null
  isHydrated: boolean
  isSubmitting: boolean
  currentUserRole: AuthUser["role"] | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<AuthUser>
  logout: () => void
}

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (
      parsed &&
      typeof parsed.email === "string" &&
      typeof parsed.displayName === "string" &&
      typeof parsed.role === "string"
    ) {
      return parsed as AuthUser
    }
  } catch {
    // ignore
  }

  return null
}

export const useAuthStore = create<AuthState>()((set) => {
  const stored = readStoredUser()

  return {
    user: stored,
    isHydrated: true,
    isSubmitting: false,
    currentUserRole: stored?.role ?? null,
    isAuthenticated: !!stored,

    login: async (payload: LoginPayload) => {
      set({ isSubmitting: true })
      try {
        const nextUser = await loginMock(payload)
        set({
          user: nextUser,
          currentUserRole: nextUser.role,
          isAuthenticated: true,
        })
        if (typeof window !== "undefined" && payload.remember) {
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
          } catch {
            // ignore storage errors
          }
        }

        return nextUser
      } finally {
        set({ isSubmitting: false })
      }
    },

    logout: () => {
      set({ user: null, isAuthenticated: false, currentUserRole: null })
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(STORAGE_KEY)
        } catch {
          // ignore
        }
      }
    },
  }
})

export type { AuthState }

export default useAuthStore
