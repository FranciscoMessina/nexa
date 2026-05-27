import { createFileRoute } from "@tanstack/react-router"
import { MyEventsPage } from "@/features/events/components/my-events-page"

export const Route = createFileRoute("/mis-eventos/")({
  component: MisEventosRoute,
})

function MisEventosRoute() {
  return <MyEventsPage />
}
