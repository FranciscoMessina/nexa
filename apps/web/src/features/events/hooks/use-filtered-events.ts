import { useMemo } from "react"
import type { EventCoordinates, EventItem } from "@/features/events/types/event.types"
import { useEventFilters } from "@/features/events/hooks/use-event-filters"
import { useEventsQuery } from "@/features/events/hooks/events-queries"
import { toEventItem } from "@/features/events/utils/event-item.utils"

function toRadians(value: number): number {
  return (value * Math.PI) / 180
}

function calculateDistanceKm(origin: EventCoordinates, destination: EventCoordinates): number {
  const earthRadiusKm = 6371
  const latDelta = toRadians(destination.lat - origin.lat)
  const lngDelta = toRadians(destination.lng - origin.lng)
  const originLat = toRadians(origin.lat)
  const destinationLat = toRadians(destination.lat)

  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(originLat) * Math.cos(destinationLat) * Math.sin(lngDelta / 2) ** 2

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

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

function sortEventsByDistance(events: Array<EventItem>): Array<EventItem> {
  return [...events].sort((left, right) => {
    const leftDistance = left.distanceKm
    const rightDistance = right.distanceKm

    if (leftDistance == null && rightDistance == null) {
      return 0
    }

    if (leftDistance == null) {
      return 1
    }

    if (rightDistance == null) {
      return -1
    }

    return leftDistance - rightDistance
  })
}

export function useFilteredEvents(userCoordinates?: EventCoordinates | null): {
  events: Array<EventItem>
  isLoading: boolean
  isError: boolean
} {
  const { neighborhood, category, date, eventType } = useEventFilters()
  const { data, isLoading, isError } = useEventsQuery()

  const events = useMemo(() => {
    const filteredEvents = (data ?? [])
      .map(toEventItem)
      .filter((event) => {
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
      .map((event) => ({
        ...event,
        distanceKm:
          userCoordinates && event.hasCoordinates
            ? calculateDistanceKm(userCoordinates, event.coordinates)
            : undefined,
      }))

    if (!userCoordinates) {
      return filteredEvents
    }

    return sortEventsByDistance(filteredEvents)
  }, [category, data, date, eventType, neighborhood, userCoordinates])

  return { events, isLoading, isError }
}
