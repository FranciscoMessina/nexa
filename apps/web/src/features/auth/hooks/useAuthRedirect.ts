import { useEffect } from "react"
import { useLocation, useNavigate } from "@tanstack/react-router"
import type { UserRole } from "@/features/auth/types/auth.types"
import { getPostLoginPathForRole } from "@/features/auth/constants/auth.constants"
import { useAuth } from "@/shared/hooks/useAuth"

type RequireAuthenticationOptions = {
  allowedRoles?: Array<UserRole>
  /** When false, role checks are deferred (e.g. until profile data is loaded). */
  roleCheckReady?: boolean
  /** Public pages (e.g. /perfiles/:id) can render without forcing login. */
  allowGuest?: boolean
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
  const roleCheckReady = options?.roleCheckReady ?? true
  const allowGuest = options?.allowGuest ?? false

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    const isAuthRoute =
      location.pathname === "/login" || location.pathname === "/registro"

    if (!allowGuest && !isAuthenticated && !isAuthRoute) {
      void navigate({ to: "/login" })
      return
    }

    if (!roleCheckReady || !currentUserRole || allowedRoles.length === 0) {
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
    allowGuest,
    navigate,
    roleCheckReady,
  ])

  const isRoleAllowed =
    !roleCheckReady ||
    allowedRoles.length === 0 ||
    (currentUserRole !== null && allowedRoles.includes(currentUserRole))

  return {
    isChecking: allowGuest ? false : !isHydrated,
    isAllowed: allowGuest ? isRoleAllowed : isAuthenticated && isRoleAllowed,
  }
}
