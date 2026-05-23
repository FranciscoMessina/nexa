import { useMemo } from "react"
import { mockEvents } from "@/features/events/data/mock-events"
import { useEventFilters } from "@/features/events/hooks/use-event-filters"
import type { EventItem } from "@/features/events/types/event.types"

function matchesDateFilter(dateLabel: string, dateFilter: string): boolean {
  if (dateFilter === "all") {
    return true
  }

  if (dateFilter === "jun-2025") {
    return dateLabel.includes("Jun 2025")
  }

  if (dateFilter === "jul-2025") {
    return dateLabel.includes("Jul 2025")
  }

  return true
}

export function useFilteredEvents(): EventItem[] {
  const { neighborhood, category, date, eventType } = useEventFilters()

  return useMemo(() => {
    return mockEvents.filter((event) => {
      if (neighborhood !== "all" && event.neighborhood !== neighborhood) {
        return false
      }

      if (category !== "all" && event.category !== category) {
        return false
      }

      if (!matchesDateFilter(event.dateLabel, date)) {
        return false
      }

      if (eventType !== "all" && event.kind !== eventType) {
        return false
      }

      return true
    })
  }, [category, date, eventType, neighborhood])
}
