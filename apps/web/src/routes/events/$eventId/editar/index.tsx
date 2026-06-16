import { createFileRoute } from "@tanstack/react-router"
import { EditEventPage } from "@/features/events/components/edit-event-page"
import { requireAuthRoute } from "@/shared/lib/auth/require-auth.route"

export const Route = createFileRoute("/events/$eventId/editar/")({
  beforeLoad: () => requireAuthRoute(),
  component: EditEventRoute,
})

function EditEventRoute() {
  const { eventId } = Route.useParams()

  return <EditEventPage eventId={eventId} />
}
