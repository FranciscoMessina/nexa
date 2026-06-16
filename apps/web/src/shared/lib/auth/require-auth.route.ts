import { redirect } from "@tanstack/react-router"
import { getCurrentUserFn } from "@/features/auth/auth.functions"

/**
 * Route-level guard: redirects to /login when there is no authenticated user.
 * Use from a route's `beforeLoad`. Data access is already protected server-side;
 * this removes the client-side content flash and adds defense in depth.
 */
export async function requireAuthRoute(): Promise<void> {
  const { user } = await getCurrentUserFn()

  if (!user) {
    throw redirect({ to: "/login" })
  }
}
