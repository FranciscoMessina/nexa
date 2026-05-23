import type { AuthUser, LoginPayload, UserRole } from "../types/auth.types"

export const MIN_PASSWORD_LENGTH = 8

const mockUsersByEmail: Readonly<Record<string, AuthUser | undefined>> = {
  "emprendedor@nexa.mock": {
    email: "emprendedor@nexa.mock",
    role: "emprendedor",
    displayName: "Emprendedor",
  },
  "organizador@nexa.mock": {
    email: "organizador@nexa.mock",
    role: "organizador",
    displayName: "Organizador",
  },
  "asistente@nexa.mock": {
    email: "asistente@nexa.mock",
    role: "asistente",
    displayName: "María López",
  },
}

export const mockUserEmails = Object.keys(mockUsersByEmail)

export class AuthError extends Error {
  code: "invalid-email" | "invalid-password"

  constructor(code: "invalid-email" | "invalid-password", message: string) {
    super(message)
    this.code = code
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function isValidPassword(password: string): boolean {
  return password.trim().length >= MIN_PASSWORD_LENGTH
}

export function getPostLoginPathForRole(role: UserRole): "/" | "/dashboard" {
  if (role === "organizador") {
    return "/dashboard"
  }

  return "/"
}

export async function loginMock(payload: LoginPayload): Promise<AuthUser> {
  const normalizedEmail = normalizeEmail(payload.email)
  const user = mockUsersByEmail[normalizedEmail]

  if (!isValidPassword(payload.password)) {
    throw new AuthError(
      "invalid-password",
      `La contrasena debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
    )
  }

  if (!user) {
    throw new AuthError(
      "invalid-email",
      "El correo no coincide con un usuario mock valido."
    )
  }

  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 350)
  })

  return user
}
