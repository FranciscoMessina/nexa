import type { EventCardData, EventItem } from "../types/event.types"
import type { CreateMockEventInput } from "../types/event-create-input"
import { useEventCatalogStore } from "../stores/event-catalog.store"
import { withResolvedEventLabel } from "../utils/event-label.utils"

export type { CreateMockEventInput } from "../types/event-create-input"
export { featuredEvent, seedEvents } from "./seed-events-data"

function formatCardDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0")
  const month = date.toLocaleDateString("en-US", { month: "short" })
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  return `${day} ${month} ${year}, ${hours}:${minutes} hs`
}

function parseLocation(
  location: string
): Pick<EventItem, "venue" | "address" | "neighborhood"> {
  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)

  const [venue = location, ...remainingParts] = parts
  const neighborhood = remainingParts.at(-1) ?? ""
  const address = remainingParts.slice(0, -1).join(", ")

  return {
    venue,
    address,
    neighborhood,
  }
}

export function getMockEvents(): Array<EventCardData> {
  const state = useEventCatalogStore.getState()

  if (typeof window !== "undefined" && !state.isHydrated) {
    state.hydrate()
  }

  return state.getAllEvents()
}

export function createMockEvent(
  createdByProfileId: string,
  input: CreateMockEventInput
): EventCardData {
  const state = useEventCatalogStore.getState()

  if (typeof window !== "undefined" && !state.isHydrated) {
    state.hydrate()
  }

  return state.createEvent(createdByProfileId, input)
}

export function updateMockEvent(
  eventId: string,
  profileId: string,
  input: CreateMockEventInput
): EventCardData | undefined {
  const state = useEventCatalogStore.getState()

  if (typeof window !== "undefined" && !state.isHydrated) {
    state.hydrate()
  }

  return state.updateEvent(eventId, profileId, input)
}

export function deleteMockEvent(eventId: string, profileId: string): boolean {
  const state = useEventCatalogStore.getState()

  if (typeof window !== "undefined" && !state.isHydrated) {
    state.hydrate()
  }

  return state.deleteEvent(eventId, profileId)
}

export function toEventItem(event: EventCardData): EventItem {
  const { venue, address, neighborhood } = parseLocation(event.location)
  const label = withResolvedEventLabel(event)

  return {
    id: event.id,
    title: event.title,
    venue,
    address,
    neighborhood,
    startsAt: event.date,
    dateLabel: formatCardDate(event.date),
    category: event.category,
    kind: label.label.type,
    imageUrl: event.image.src,
  }
}

export function getMockEventById(eventId: string): EventCardData | undefined {
  const state = useEventCatalogStore.getState()

  if (typeof window !== "undefined" && !state.isHydrated) {
    state.hydrate()
  }

  const event = state.getEventById(eventId)

  return event ? withResolvedEventLabel(event) : undefined
}
