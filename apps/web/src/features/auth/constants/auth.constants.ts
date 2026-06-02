import type { UserRole } from "../types/auth.types"

export const MIN_PASSWORD_LENGTH = 8

export class AuthError extends Error {
  code: "invalid-email" | "invalid-password" | "email-taken" | "signup-failed"

  constructor(
    code: "invalid-email" | "invalid-password" | "email-taken" | "signup-failed",
    message: string
  ) {
    super(message)
    this.code = code
  }
}

export const ROLE_OPTIONS: ReadonlyArray<{
  value: UserRole
  label: string
  description: string
}> = [
  {
    value: "asistente",
    label: "Asistente",
    description: "Explorá eventos y confirmá asistencia.",
  },
  {
    value: "organizador",
    label: "Organizador",
    description: "Publicá y gestioná eventos de tu espacio.",
  },
  {
    value: "emprendedor",
    label: "Emprendedor",
    description: "Mostrá tu emprendimiento y participá en eventos.",
  },
]

export function getPostLoginPathForRole(_role: UserRole): "/" {
  return "/"
}
