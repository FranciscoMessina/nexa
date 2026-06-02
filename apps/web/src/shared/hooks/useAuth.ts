import type { AuthState } from "@/shared/store/useAuthStore"
import type { AuthContextValue } from "@/features/auth/types/auth.types"
import useAuthStore from "@/shared/store/useAuthStore"

export function useAuth(): AuthContextValue {
  const user = useAuthStore((s: AuthState) => s.user)
  const isHydrated = useAuthStore((s: AuthState) => s.isHydrated)
  const isSubmitting = useAuthStore((s: AuthState) => s.isSubmitting)
  const currentUserRole = useAuthStore((s: AuthState) => s.currentUserRole)
  const isAuthenticated = useAuthStore((s: AuthState) => s.isAuthenticated)
  const login = useAuthStore((s: AuthState) => s.login)
  const register = useAuthStore((s: AuthState) => s.register)
  const logout = useAuthStore((s: AuthState) => s.logout)

  return {
    user,
    currentUserRole,
    isAuthenticated,
    isHydrated,
    isSubmitting,
    login,
    register,
    logout,
  }
}
