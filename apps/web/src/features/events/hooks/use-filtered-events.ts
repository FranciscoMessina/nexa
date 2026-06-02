import { useMemo } from "react"
import type { EventItem } from "@/features/events/types/event.types"
import { useEventFilters } from "@/features/events/hooks/use-event-filters"
import { useEventsQuery } from "@/features/events/hooks/events-queries"
import { toEventItem } from "@/features/events/utils/event-item.utils"

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

export function useFilteredEvents(): {
  events: Array<EventItem>
  isLoading: boolean
  isError: boolean
} {
  const { neighborhood, category, date, eventType } = useEventFilters()
  const { data, isLoading, isError } = useEventsQuery()

  const events = useMemo(() => {
    return (data ?? []).map(toEventItem).filter((event) => {
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
  }, [category, data, date, eventType, neighborhood])

  return { events, isLoading, isError }
}
