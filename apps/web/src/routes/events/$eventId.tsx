import { createFileRoute } from "@tanstack/react-router"
import { EventDetailPage } from "@/features/events"

export const Route = createFileRoute("/events/$eventId")({
  component: EventDetailRoute,
})

function EventDetailRoute() {
  const { eventId } = Route.useParams()

  return <EventDetailPage eventId={eventId} />
}