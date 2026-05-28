import { mockEvents, toEventItem } from "@/features/events/data/mock-events"
import type { EventCardData, EventItem } from "@/features/events/types/event.types"
import type { UserRole } from "@/features/auth/types/auth.types"

export type MyEventsCopy = {
  subtitle: string
  upcomingTitle: string
  pastTitle: string
  upcomingEmptyTitle: string
  upcomingEmptyDescription: string
  pastEmptyTitle: string
  pastEmptyDescription: string
}

export type MyEventsSections = {
  upcoming: Array<EventItem>
  past: Array<EventItem>
}

function startOfToday(): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export function getMyEventsCopy(role: UserRole): MyEventsCopy {
  if (role === "organizador") {
    return {
      subtitle: "Eventos que creaste y a los que confirmaste asistencia",
      upcomingTitle: "Próximos",
      pastTitle: "Pasados",
      upcomingEmptyTitle: "No tenés eventos próximos",
      upcomingEmptyDescription:
        "Publicá uno desde Crear evento o explorá el muro y confirmá asistencia.",
      pastEmptyTitle: "No tenés historial de eventos pasados",
      pastEmptyDescription:
        "Cuando terminen los eventos a los que fuiste o los que organizaste, van a aparecer acá.",
    }
  }

  if (role === "emprendedor") {
    return {
      subtitle: "Eventos de tu emprendimiento, los que creaste y a los que vas a asistir",
      upcomingTitle: "Próximos",
      pastTitle: "Pasados",
      upcomingEmptyTitle: "No tenés eventos próximos",
      upcomingEmptyDescription:
        "Creá un evento, sumate a uno del muro o esperá invitaciones de tu emprendimiento.",
      pastEmptyTitle: "No tenés historial de eventos pasados",
      pastEmptyDescription:
        "Los eventos en los que participaste o a los que asististe ya finalizados se listan acá.",
    }
  }

  return {
    subtitle: "Eventos a los que confirmaste que vas a asistir",
    upcomingTitle: "Próximos",
    pastTitle: "Pasados",
    upcomingEmptyTitle: "No tenés eventos próximos",
    upcomingEmptyDescription:
      "Explorá el muro y tocá «Asistir al evento» en los que te interesen.",
    pastEmptyTitle: "No tenés historial de eventos pasados",
    pastEmptyDescription:
      "Los eventos a los que confirmaste asistencia y ya pasaron van a quedar guardados acá.",
  }
}

function uniqueEventsById(events: Array<EventCardData>): Array<EventCardData> {
  const seen = new Set<string>()

  return events.filter((event) => {
    if (seen.has(event.id)) {
      return false
    }

    seen.add(event.id)
    return true
  })
}

function filterEventsForProfile(
  profileId: string,
  role: UserRole,
  attendingEventIds: Array<string>
): Array<EventCardData> {
  const organized = mockEvents.filter((event) => event.organizer.profileId === profileId)
  const attending = mockEvents.filter((event) => attendingEventIds.includes(event.id))

  if (role === "organizador") {
    return uniqueEventsById([...organized, ...attending])
  }

  if (role === "emprendedor") {
    const participating = mockEvents.filter((event) =>
      event.participatingVentures?.some((venture) => venture.profileId === profileId)
    )

    return uniqueEventsById([...organized, ...participating, ...attending])
  }

  return uniqueEventsById([...organized, ...attending])
}

function sortByDate(events: Array<EventItem>): Array<EventItem> {
  return [...events].sort((left, right) => left.startsAt.getTime() - right.startsAt.getTime())
}

export function getMyEventsSections(
  profileId: string | undefined,
  role: UserRole | null,
  attendingEventIds: Array<string>
): MyEventsSections {
  if (!profileId || !role) {
    return { upcoming: [], past: [] }
  }

  const today = startOfToday()
  const cards = filterEventsForProfile(profileId, role, attendingEventIds)
  const items = cards.map(toEventItem)

  return {
    upcoming: sortByDate(items.filter((event) => event.startsAt >= today)),
    past: sortByDate(items.filter((event) => event.startsAt < today)).reverse(),
  }
}

/** @deprecated Usar getMyEventsSections */
export function getMyEventsForUser(
  profileId: string | undefined,
  role: UserRole | null,
  attendingEventIds: Array<string> = []
): Array<EventItem> {
  const { upcoming, past } = getMyEventsSections(profileId, role, attendingEventIds)
  return [...upcoming, ...past]
}
