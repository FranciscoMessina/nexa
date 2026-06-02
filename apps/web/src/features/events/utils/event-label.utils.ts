import type { EventCardData, EventLabel } from "@/features/events/types/event.types"
import type { ProfileKind } from "@/features/profiles/types/profile.types"

const communityLabel: EventLabel = {
  type: "community",
  text: "Evento comunitario",
}

const verifiedLabel: EventLabel = {
  type: "verified",
  text: "Evento verificado",
}

export function isAssistantOrganizerKind(kind: ProfileKind | undefined): boolean {
  return kind === "usuario"
}

/** @deprecated Usar isAssistantOrganizerKind con el kind del perfil organizador */
export function isAssistantOrganizer(profileId: string): boolean {
  void profileId
  return false
}

/** Asistentes → comunitario; bares/cafés verificados → verificado. */
export function resolveEventLabel(
  event: Pick<EventCardData, "label" | "organizer">,
  organizerKind?: ProfileKind
): EventLabel {
  if (organizerKind === "usuario" || isAssistantOrganizer(event.organizer.profileId)) {
    return communityLabel
  }

  if (event.organizer.verified) {
    return verifiedLabel
  }

  return event.label
}

export function withResolvedEventLabel(
  event: EventCardData,
  organizerKind?: ProfileKind
): EventCardData {
  const label = resolveEventLabel(event, organizerKind)

  if (label.type === event.label.type && label.text === event.label.text) {
    return event
  }

  return { ...event, label }
}
