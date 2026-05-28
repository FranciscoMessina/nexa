import type { EventCardData, EventLabel } from "@/features/events/types/event.types"
import { getMockProfileById } from "@/features/profiles/data/mock-profiles"

const communityLabel: EventLabel = {
  type: "community",
  text: "Evento comunitario",
}

const verifiedLabel: EventLabel = {
  type: "verified",
  text: "Evento verificado",
}

export function isAssistantOrganizer(profileId: string): boolean {
  const profile = getMockProfileById(profileId)
  return profile?.kind === "usuario"
}

/** Asistentes → comunitario; bares/cafés verificados → verificado (sin mirar emprendimientos invitados). */
export function resolveEventLabel(event: Pick<EventCardData, "label" | "organizer">): EventLabel {
  if (isAssistantOrganizer(event.organizer.profileId)) {
    return communityLabel
  }

  if (event.organizer.verified) {
    return verifiedLabel
  }

  return event.label
}

export function withResolvedEventLabel(event: EventCardData): EventCardData {
  const label = resolveEventLabel(event)

  if (label.type === event.label.type && label.text === event.label.text) {
    return event
  }

  return { ...event, label }
}
