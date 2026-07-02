import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router"
import { EventDetailPage } from "@/features/events"

export const Route = createFileRoute("/events/$eventId")({
  component: EventDetailRoute,
})

function EventDetailRoute() {
  const { eventId } = Route.useParams()
  const isEditRoute = useRouterState({
    select: (state) =>
      state.location.pathname.replace(/\/$/, "").endsWith("/editar"),
  })

  if (isEditRoute) {
    return <Outlet />
  }

  return <EventDetailPage eventId={eventId} />
}
