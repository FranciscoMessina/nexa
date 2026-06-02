export type UserRole = "emprendedor" | "organizador" | "asistente"

export type AuthUser = {
  id: string
  authUserId: string
  email: string
  role: UserRole
  displayName: string
}

export type LoginPayload = {
  email: string
  password: string
  remember?: boolean
}

export type SignUpPayload = {
  email: string
  password: string
  displayName: string
  role: UserRole
  remember?: boolean
}

export type SignUpResult =
  | { status: "session"; user: AuthUser }
  | { status: "email_confirmation"; email: string }

export type AuthContextValue = {
  user: AuthUser | null
  currentUserRole: UserRole | null
  isAuthenticated: boolean
  isHydrated: boolean
  isSubmitting: boolean
  login: (payload: LoginPayload) => Promise<AuthUser>
  register: (payload: SignUpPayload) => Promise<SignUpResult>
  logout: () => Promise<void>
}
