import { createFileRoute } from "@tanstack/react-router"
import { CreateEventPage } from "@/features/events/components/create-event-page"

export const Route = createFileRoute("/crear-evento/")({
  component: CrearEventoRoute,
})

function CrearEventoRoute() {
  return <CreateEventPage />
}
