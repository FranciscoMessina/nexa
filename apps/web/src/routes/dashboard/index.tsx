import { createFileRoute } from "@tanstack/react-router"
import { DashboardPage } from "@/features/auth"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardRoute,
})

function DashboardRoute() {
  return <DashboardPage />
}
