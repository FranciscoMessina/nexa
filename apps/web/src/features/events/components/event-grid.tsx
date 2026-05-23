import { EventCard } from "@/features/events/components/event-card"
import { useFilteredEvents } from "@/features/events/hooks/use-filtered-events"

export function EventGrid() {
  const events = useFilteredEvents()

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
        <EventCard event={event} key={event.id} />
      ))}
    </div>
  )
}
