import { useEffect } from "react"
import { useLocation, useNavigate } from "@tanstack/react-router"
import type { UserRole } from "@/features/auth/types/auth.types"
import { getPostLoginPathForRole } from "@/features/auth/api/auth.api"
import { useAuth } from "@/shared/hooks/useAuth"

type RequireAuthenticationOptions = {
  allowedRoles?: Array<UserRole>
}

export function useRedirectAuthenticatedUser(): void {
  const navigate = useNavigate()
  const { isAuthenticated, isHydrated, currentUserRole } = useAuth()

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !currentUserRole) {
      return
    }

    void navigate({ to: getPostLoginPathForRole(currentUserRole) })
  }, [currentUserRole, isAuthenticated, isHydrated, navigate])
}

export function useRequireAuthentication(
  options?: RequireAuthenticationOptions
): {
  isChecking: boolean
  isAllowed: boolean
} {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isHydrated, currentUserRole } = useAuth()
  const allowedRoles = options?.allowedRoles ?? []

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    if (!isAuthenticated && location.pathname !== "/login") {
      void navigate({ to: "/login" })
      return
    }

    if (!currentUserRole || allowedRoles.length === 0) {
      return
    }

    if (!allowedRoles.includes(currentUserRole)) {
      void navigate({ to: getPostLoginPathForRole(currentUserRole) })
    }
  }, [
    allowedRoles,
    currentUserRole,
    isAuthenticated,
    isHydrated,
    location.pathname,
    navigate,
  ])

  const isRoleAllowed =
    allowedRoles.length === 0 ||
    (currentUserRole !== null && allowedRoles.includes(currentUserRole))

  return {
    isChecking: !isHydrated,
    isAllowed: isAuthenticated && isRoleAllowed,
  }
}
