export type UserRole = "emprendedor" | "organizador" | "asistente"

export type AuthUser = {
  email: string
  role: UserRole
  displayName: string
}

export type LoginPayload = {
  email: string
  password: string
  remember?: boolean
}

export type AuthContextValue = {
  user: AuthUser | null
  currentUserRole: UserRole | null
  isAuthenticated: boolean
  isHydrated: boolean
  isSubmitting: boolean
  login: (payload: LoginPayload) => Promise<AuthUser>
  logout: () => void
}
