import { createFileRoute } from "@tanstack/react-router"
import { MyEventsPage } from "@/features/events/components/my-events-page"
import { requireAuthRoute } from "@/shared/lib/auth/require-auth.route"

export const Route = createFileRoute("/mis-eventos/")({
  beforeLoad: () => requireAuthRoute(),
  component: MisEventosRoute,
})

function MisEventosRoute() {
  return <MyEventsPage />
}
