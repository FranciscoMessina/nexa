import { useEventFiltersStore } from "@/features/events/stores/event-filters.store"

export function useEventFilters() {
  const neighborhood = useEventFiltersStore((state) => state.neighborhood)
  const category = useEventFiltersStore((state) => state.category)
  const date = useEventFiltersStore((state) => state.date)
  const eventType = useEventFiltersStore((state) => state.eventType)
  const setNeighborhood = useEventFiltersStore((state) => state.setNeighborhood)
  const setCategory = useEventFiltersStore((state) => state.setCategory)
  const setDate = useEventFiltersStore((state) => state.setDate)
  const setEventType = useEventFiltersStore((state) => state.setEventType)
  const reset = useEventFiltersStore((state) => state.reset)

  return {
    neighborhood,
    category,
    date,
    eventType,
    setNeighborhood,
    setCategory,
    setDate,
    setEventType,
    reset,
  }
}
