import { AuthError } from "@/features/auth/constants/auth.constants"

export const MIN_PASSWORD_LENGTH = 8

export type PasswordRequirement = {
  id: string
  label: string
  test: (password: string) => boolean
}

export const PASSWORD_REQUIREMENTS: ReadonlyArray<PasswordRequirement> = [
  {
    id: "min-length",
    label: `Al menos ${MIN_PASSWORD_LENGTH} caracteres`,
    test: (password) => password.length >= MIN_PASSWORD_LENGTH,
  },
  {
    id: "uppercase",
    label: "Al menos una letra mayúscula",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "Al menos una letra minúscula",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "Al menos un número",
    test: (password) => /\d/.test(password),
  },
  {
    id: "special",
    label: "Al menos un carácter especial (!@#$…)",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
]

export function getPasswordRequirementResults(
  password: string
): Array<PasswordRequirement & { met: boolean }> {
  return PASSWORD_REQUIREMENTS.map((requirement) => ({
    ...requirement,
    met: requirement.test(password),
  }))
}

export function isPasswordValid(password: string): boolean {
  return PASSWORD_REQUIREMENTS.every((requirement) => requirement.test(password))
}

export function assertPasswordMeetsPolicy(password: string): void {
  if (!isPasswordValid(password)) {
    throw new AuthError(
      "invalid-password",
      "La contraseña no cumple los requisitos de seguridad."
    )
  }
}
