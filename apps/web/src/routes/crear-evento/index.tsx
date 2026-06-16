import { createFileRoute } from "@tanstack/react-router"
import { CreateEventPage } from "@/features/events/components/create-event-page"
import { requireAuthRoute } from "@/shared/lib/auth/require-auth.route"

export const Route = createFileRoute("/crear-evento/")({
  beforeLoad: () => requireAuthRoute(),
  component: CrearEventoRoute,
})

function CrearEventoRoute() {
  return <CreateEventPage />
}
