import { createFileRoute } from "@tanstack/react-router"
import { EventMapPage } from "@/features/events/components/event-map-page"

export const Route = createFileRoute("/mapa/")({
  component: MapaRoute,
})

function MapaRoute() {
  return <EventMapPage />
}
