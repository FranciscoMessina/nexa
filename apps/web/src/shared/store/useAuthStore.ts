import { create } from "zustand"
import { authService } from "@/features/auth/services/auth.service"
import type {
  AuthUser,
  LoginPayload,
  SignUpPayload,
  SignUpResult,
} from "@/features/auth/types/auth.types"

type AuthState = {
  user: AuthUser | null
  isHydrated: boolean
  isSubmitting: boolean
  currentUserRole: AuthUser["role"] | null
  isAuthenticated: boolean
  hydrate: () => Promise<void>
  login: (payload: LoginPayload) => Promise<AuthUser>
  register: (payload: SignUpPayload) => Promise<SignUpResult>
  logout: () => Promise<void>
}

function getInitialAuthState(): Pick<
  AuthState,
  "user" | "isHydrated" | "currentUserRole" | "isAuthenticated"
> {
  if (typeof window === "undefined") {
    return {
      user: null,
      isHydrated: false,
      currentUserRole: null,
      isAuthenticated: false,
    }
  }

  return {
    user: null,
    isHydrated: false,
    currentUserRole: null,
    isAuthenticated: false,
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  ...getInitialAuthState(),
  isSubmitting: false,

  hydrate: async () => {
    try {
      const user = await authService.getCurrentUser()
      set({
        user,
        currentUserRole: user?.role ?? null,
        isAuthenticated: Boolean(user),
        isHydrated: true,
      })
    } catch {
      set({
        user: null,
        currentUserRole: null,
        isAuthenticated: false,
        isHydrated: true,
      })
    }
  },

  login: async (payload: LoginPayload) => {
    set({ isSubmitting: true })
    try {
      const nextUser = await authService.login(payload)
      set({
        user: nextUser,
        currentUserRole: nextUser.role,
        isAuthenticated: true,
        isHydrated: true,
      })
      return nextUser
    } finally {
      set({ isSubmitting: false })
    }
  },

  register: async (payload: SignUpPayload) => {
    set({ isSubmitting: true })
    try {
      const result = await authService.register(payload)

      if (result.status === "session") {
        set({
          user: result.user,
          currentUserRole: result.user.role,
          isAuthenticated: true,
          isHydrated: true,
        })
      }

      return result
    } finally {
      set({ isSubmitting: false })
    }
  },

  logout: async () => {
    await authService.logout()
    set({
      user: null,
      isAuthenticated: false,
      currentUserRole: null,
    })
  },
}))

export type { AuthState }

export default useAuthStore
