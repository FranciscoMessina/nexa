import { useMemo } from "react"
import type { EventCardData } from "@/features/events/types/event.types"
import { useEventsQuery } from "@/features/events/hooks/events-queries"
import { useEventFilters } from "@/features/events/hooks/use-event-filters"
import { matchesNeighborhoodFilter } from "@/features/events/utils/event-neighborhood.utils"

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

export function useFilteredEventCards(): {
  events: Array<EventCardData>
  isLoading: boolean
  isError: boolean
} {
  const { neighborhood, category, date, eventType } = useEventFilters()
  const { data, isLoading, isError } = useEventsQuery()

  const events = useMemo(() => {
    return (data ?? []).filter((event) => {
      if (!matchesNeighborhoodFilter(event.location, neighborhood)) {
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
  }, [category, data, date, eventType, neighborhood])

  return { events, isLoading, isError }
}
