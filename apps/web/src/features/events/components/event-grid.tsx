import { EventCard } from "@/features/events/components/event-card"
import { useFilteredEvents } from "@/features/events/hooks/use-filtered-events"
import { useCurrentLocation } from "@/shared/hooks/use-current-location"
import { EventGridSkeleton } from "@/shared/components/skeletons/event-grid-skeleton"

type EventGridProps = {
  showDistance?: boolean
}

export function EventGrid({ showDistance = false }: EventGridProps) {
  const { coordinates } = useCurrentLocation(showDistance)
  const { events, isLoading, isError } = useFilteredEvents(showDistance ? coordinates : null)

  if (isLoading) {
    return <EventGridSkeleton />
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-16 text-center">
        <p className="text-sm text-rose-700">No se pudieron cargar los eventos.</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div
        className="rounded-2xl border border-dashed border-[#d5deed] bg-white px-6 py-16 text-center"
        data-testid="event-grid-empty"
      >
        <p className="text-lg font-semibold text-[#1a3462]">No hay eventos con esos filtros</p>
        <p className="mt-2 text-sm text-[#6b7d9c]">
          Probá cambiando los filtros o limpiándolos para ver más resultados.
        </p>
      </div>
    )
  }

  return (
    <div
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      data-testid="event-grid"
    >
      {events.map((event) => (
        <EventCard event={event} key={event.id} showDistance={showDistance} />
      ))}
    </div>
  )
}
