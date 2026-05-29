import { createFileRoute } from "@tanstack/react-router"
import { EditEventPage } from "@/features/events/components/edit-event-page"

export const Route = createFileRoute("/events/$eventId/editar/")({
  component: EditEventRoute,
})

function EditEventRoute() {
  const { eventId } = Route.useParams()

  return <EditEventPage eventId={eventId} />
}
