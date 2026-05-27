import { useMemo } from "react"
import type { EventItem } from "@/features/events/types/event.types"
import { useEventFilters } from "@/features/events/hooks/use-event-filters"
import { mockEvents, toEventItem } from "@/features/events/data/mock-events"

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function matchesDateFilter(startsAt: Date, dateFilter: string): boolean {
  if (dateFilter === "all") {
    return true
  }

  return toDateKey(startsAt) === dateFilter
}

export function useFilteredEvents(): Array<EventItem> {
  const { neighborhood, category, date, eventType } = useEventFilters()

  return useMemo(() => {
    return mockEvents.map(toEventItem).filter((event) => {
      if (neighborhood !== "all" && event.neighborhood !== neighborhood) {
        return false
      }

      if (category !== "all" && event.category !== category) {
        return false
      }

      if (!matchesDateFilter(event.startsAt, date)) {
        return false
      }

      if (eventType !== "all" && event.kind !== eventType) {
        return false
      }

      return true
    })
  }, [category, date, eventType, neighborhood])
}
