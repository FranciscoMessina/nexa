import { create } from "zustand"
import { seedEvents } from "@/features/events/data/seed-events-data"
import type { CreateMockEventInput } from "@/features/events/types/event-create-input"
import type { EventCardData } from "@/features/events/types/event.types"
import { useEventAttendanceStore } from "@/features/events/stores/event-attendance.store"
import { withResolvedEventLabel } from "@/features/events/utils/event-label.utils"

const STORAGE_KEY = "nexa-user-events"

type StoredEventCardData = Omit<EventCardData, "date"> & { date: string }

function serializeEvent(event: EventCardData): StoredEventCardData {
  return {
    ...event,
    date: event.date.toISOString(),
  }
}

function deserializeEvent(event: StoredEventCardData): EventCardData {
  return {
    ...event,
    date: new Date(event.date),
  }
}

function readStoredUserEvents(): Array<EventCardData> {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as Array<StoredEventCardData>

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.map(deserializeEvent)
  } catch {
    return []
  }
}

function writeStoredUserEvents(events: Array<EventCardData>): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.map(serializeEvent)))
}

function buildMockEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return `mock-event-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

type EventCatalogState = {
  userEvents: Array<EventCardData>
  isHydrated: boolean
  hydrate: () => void
  getAllEvents: () => Array<EventCardData>
  getEventById: (eventId: string) => EventCardData | undefined
  createEvent: (
    createdByProfileId: string,
    input: CreateMockEventInput
  ) => EventCardData
  updateEvent: (
    eventId: string,
    profileId: string,
    input: CreateMockEventInput
  ) => EventCardData | undefined
  deleteEvent: (eventId: string, profileId: string) => boolean
}

export const useEventCatalogStore = create<EventCatalogState>()((set, get) => ({
  userEvents: [],
  isHydrated: false,

  hydrate: () => {
    set({
      userEvents: readStoredUserEvents().map((event) => withResolvedEventLabel(event)),
      isHydrated: true,
    })
  },

  getAllEvents: () => {
    if (!get().isHydrated && typeof window !== "undefined") {
      get().hydrate()
    }

    return [...get().userEvents, ...seedEvents]
  },

  getEventById: (eventId) => {
    return get().getAllEvents().find((event) => event.id === eventId)
  },

  createEvent: (createdByProfileId, input) => {
    const title = input.title.trim()
    const location = input.location.trim()

    const event: EventCardData = withResolvedEventLabel({
      id: buildMockEventId(),
      createdByProfileId,
      label: input.label,
      title,
      summary: input.summary.trim(),
      location,
      date: input.date,
      category: input.category.trim(),
      image: {
        src: input.image.src.trim(),
        alt: `${title} - ${location}`,
      },
      description: input.description.trim(),
      price: input.price ?? { amount: 0, currency: "ARS", label: "" },
      gallery: input.gallery.map((image) => image.trim()).filter(Boolean),
      savedCount: 0,
      registrationUrl: input.registrationUrl?.trim() || undefined,
      organizer: input.organizer,
      participatingVentures: input.participatingVentures,
      attendeeProfileIds: input.attendeeProfileIds,
      requirements: input.requirements.trim(),
      coordinates: input.coordinates ?? { lat: -34.6037, lng: -58.3816 },
    })

    const nextUserEvents = [event, ...get().userEvents]
    writeStoredUserEvents(nextUserEvents)
    set({ userEvents: nextUserEvents })

    return event
  },

  updateEvent: (eventId, profileId, input) => {
    const existing = get().userEvents.find((event) => event.id === eventId)

    if (!existing || existing.createdByProfileId !== profileId) {
      return undefined
    }

    const title = input.title.trim()
    const location = input.location.trim()

    const updated: EventCardData = withResolvedEventLabel({
      ...existing,
      label: input.label,
      title,
      summary: input.summary.trim(),
      location,
      date: input.date,
      category: input.category.trim(),
      image: {
        src: input.image.src.trim(),
        alt: `${title} - ${location}`,
      },
      description: input.description.trim(),
      gallery: input.gallery.map((image) => image.trim()).filter(Boolean),
      registrationUrl: input.registrationUrl?.trim() || undefined,
      requirements: input.requirements.trim(),
      organizer: input.organizer,
    })

    const nextUserEvents = get().userEvents.map((event) =>
      event.id === eventId ? updated : event
    )

    writeStoredUserEvents(nextUserEvents)
    set({ userEvents: nextUserEvents })

    return updated
  },

  deleteEvent: (eventId, profileId) => {
    const existing = get().userEvents.find((event) => event.id === eventId)

    if (!existing || existing.createdByProfileId !== profileId) {
      return false
    }

    const nextUserEvents = get().userEvents.filter((event) => event.id !== eventId)
    writeStoredUserEvents(nextUserEvents)
    set({ userEvents: nextUserEvents })
    useEventAttendanceStore.getState().clearAttendanceForEvent(eventId)

    return true
  },
}))

export function getCatalogEvents(): Array<EventCardData> {
  const state = useEventCatalogStore.getState()

  if (typeof window !== "undefined" && !state.isHydrated) {
    state.hydrate()
  }

  return state.getAllEvents()
}

export function getCatalogEventById(eventId: string): EventCardData | undefined {
  const state = useEventCatalogStore.getState()

  if (typeof window !== "undefined" && !state.isHydrated) {
    state.hydrate()
  }

  return state.getEventById(eventId)
}

export function canUserManageEvent(
  event: Pick<EventCardData, "createdByProfileId">,
  profileId: string | undefined
): boolean {
  return Boolean(profileId && event.createdByProfileId === profileId)
}
