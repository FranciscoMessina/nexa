import { IconCheck, IconCircle } from "@tabler/icons-react"
import {
  PASSWORD_REQUIREMENTS,
  getPasswordRequirementResults,
} from "@/features/auth/utils/password-policy.utils"
import { cn } from "@workspace/ui/lib/utils"

type PasswordRequirementsChecklistProps = {
  password: string
  confirmPassword?: string
  className?: string
}

function RequirementRow({
  label,
  met,
}: {
  label: string
  met: boolean
}) {
  return (
    <li
      className={cn(
        "flex items-start gap-2 text-xs transition-colors",
        met ? "text-emerald-700" : "text-[#8ea0bf]"
      )}
    >
      {met ? (
        <IconCheck
          aria-hidden
          className="mt-0.5 shrink-0 text-emerald-600"
          size={14}
          stroke={2.5}
        />
      ) : (
        <IconCircle
          aria-hidden
          className="mt-0.5 shrink-0 text-[#c5d0e6]"
          size={14}
          stroke={1.5}
        />
      )}
      <span>{label}</span>
    </li>
  )
}

export function PasswordRequirementsChecklist({
  password,
  confirmPassword,
  className,
}: PasswordRequirementsChecklistProps) {
  const requirementResults = getPasswordRequirementResults(password)
  const showMatchRequirement =
    confirmPassword !== undefined &&
    (password.length > 0 || confirmPassword.length > 0)
  const passwordsMatch =
    confirmPassword !== undefined &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword

  return (
    <ul
      aria-label="Requisitos de contraseña"
      className={cn("space-y-1.5 rounded-xl bg-[#f7f9fc] px-3 py-2.5", className)}
      data-testid="password-requirements-checklist"
    >
      {requirementResults.map((requirement) => (
        <RequirementRow key={requirement.id} label={requirement.label} met={requirement.met} />
      ))}

      {showMatchRequirement ? (
        <RequirementRow
          label="Las contraseñas coinciden"
          met={passwordsMatch}
        />
      ) : null}
    </ul>
  )
}

export function isPasswordPolicyComplete(
  password: string,
  confirmPassword?: string
): boolean {
  const passwordValid = PASSWORD_REQUIREMENTS.every((requirement) =>
    requirement.test(password)
  )

  if (confirmPassword === undefined) {
    return passwordValid
  }

  return passwordValid && password.length > 0 && password === confirmPassword
}
