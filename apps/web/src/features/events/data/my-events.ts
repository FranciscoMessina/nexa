import { mockEvents, toEventItem } from "@/features/events/data/mock-events"
import type { EventCardData, EventItem } from "@/features/events/types/event.types"
import type { UserRole } from "@/features/auth/types/auth.types"

export type MyEventsCopy = {
  subtitle: string
  emptyTitle: string
  emptyDescription: string
}

export function getMyEventsCopy(role: UserRole): MyEventsCopy {
  if (role === "organizador") {
    return {
      subtitle: "Eventos oficiales que creaste",
      emptyTitle: "Todavía no creaste eventos",
      emptyDescription:
        "Cuando publiques un evento oficial, vas a verlo acá para gestionarlo y compartirlo.",
    }
  }

  if (role === "emprendedor") {
    return {
      subtitle: "Eventos en los que participa tu emprendimiento",
      emptyTitle: "Sin participación en eventos",
      emptyDescription:
        "Cuando tu emprendimiento sea invitado a un evento, lo vas a encontrar en esta sección.",
    }
  }

  return {
    subtitle: "Eventos a los que asistirás",
    emptyTitle: "No tenés eventos confirmados",
    emptyDescription:
      "Explorá el muro de eventos y sumate a los que te interesen para verlos acá.",
  }
}

function filterEventsForProfile(profileId: string, role: UserRole): Array<EventCardData> {
  if (role === "organizador") {
    return mockEvents.filter((event) => event.organizer.profileId === profileId)
  }

  if (role === "emprendedor") {
    return mockEvents.filter((event) =>
      event.participatingVentures?.some((venture) => venture.profileId === profileId)
    )
  }

  return mockEvents.filter((event) => event.attendeeProfileIds?.includes(profileId))
}

export function getMyEventsForUser(
  profileId: string | undefined,
  role: UserRole | null
): Array<EventItem> {
  if (!profileId || !role) {
    return []
  }

  return filterEventsForProfile(profileId, role)
    .map(toEventItem)
    .sort((left, right) => left.startsAt.getTime() - right.startsAt.getTime())
}
