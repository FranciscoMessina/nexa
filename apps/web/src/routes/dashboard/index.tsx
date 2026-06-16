import { createFileRoute } from "@tanstack/react-router"
import { DashboardPage } from "@/features/auth"
import { requireAuthRoute } from "@/shared/lib/auth/require-auth.route"

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: () => requireAuthRoute(),
  component: DashboardRoute,
})

function DashboardRoute() {
  return <DashboardPage />
}
