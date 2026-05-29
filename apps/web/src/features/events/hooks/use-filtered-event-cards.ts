import { useMemo } from "react"
import { getMockEvents } from "@/features/events/data/mock-events"
import type { EventCardData } from "@/features/events/types/event.types"
import { useEventFilters } from "@/features/events/hooks/use-event-filters"
import { useEventCatalogStore } from "@/features/events/stores/event-catalog.store"

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

function parseNeighborhood(location: string): string {
  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)

  return parts.at(-1) ?? ""
}

export function useFilteredEventCards(): Array<EventCardData> {
  const { neighborhood, category, date, eventType } = useEventFilters()
  const userEvents = useEventCatalogStore((state) => state.userEvents)

  return useMemo(() => {
    return getMockEvents().filter((event) => {
      const eventNeighborhood = parseNeighborhood(event.location)

      if (neighborhood !== "all" && eventNeighborhood !== neighborhood) {
        return false
      }

      if (category !== "all" && event.category !== category) {
        return false
      }

      if (!matchesDateFilter(event.date, date)) {
        return false
      }

      if (eventType !== "all" && event.label.type !== eventType) {
        return false
      }

      return true
    })
  }, [category, date, eventType, neighborhood, userEvents])
}
