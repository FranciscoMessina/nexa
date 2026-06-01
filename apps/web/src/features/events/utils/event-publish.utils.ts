import type { EventCardData, EventCoordinates, EventKind } from "@/features/events/types/event.types"

export type EventDraftState = {
  title: string
  summary: string
  location: string
  coordinates: EventCoordinates | null
  date: string
  category: string
  description: string
  registrationUrl: string
  requirements: string
  labelType: EventKind
  labelText: string
  gallery: string
}

export type EventDraftErrorField =
  | "title"
  | "summary"
  | "location"
  | "date"
  | "category"
  | "description"
  | "gallery"
  | "requirements"

export type EventDraftErrors = Partial<Record<EventDraftErrorField, string>>

export const initialEventDraftState: EventDraftState = {
  title: "",
  summary: "",
  location: "",
  coordinates: null,
  date: "",
  category: "",
  description: "",
  registrationUrl: "",
  requirements: "",
  labelType: "community",
  labelText: "Evento comunitario",
  gallery: "",
}

export function splitGallery(value: string): Array<string> {
  return value
    .split(/\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(year, month, day, 12, 0, 0, 0)

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export function validateEventDraft(draft: EventDraftState): EventDraftErrors {
  const errors: EventDraftErrors = {}

  if (!draft.title.trim()) {
    errors.title = "Ingresá un título."
  }

  if (!draft.summary.trim()) {
    errors.summary = "Ingresá un resumen."
  }

  if (!draft.location.trim()) {
    errors.location = "Ingresá una ubicación."
  } else if (!draft.coordinates) {
    errors.location = "Seleccioná una dirección sugerida o ingresá una ubicación válida."
  }

  if (!draft.date.trim()) {
    errors.date = "Seleccioná una fecha."
  } else if (!parseDateInput(draft.date)) {
    errors.date = "Usá el formato dd/mm/aaaa."
  }

  if (!draft.category.trim()) {
    errors.category = "Seleccioná una categoría."
  }

  if (!draft.description.trim()) {
    errors.description = "Ingresá una descripción."
  }

  if (!draft.gallery.trim()) {
    errors.gallery = "Pegá URLs o subí al menos una imagen."
  } else if (splitGallery(draft.gallery).length === 0) {
    errors.gallery = "Pegá al menos una URL o imagen válida."
  }

  return errors
}

export function resolveEventLabelForProfile(
  validationStatus: string,
  profileKind?: string,
): {
  type: EventKind
  text: string
} {
  if (profileKind === "usuario") {
    return { type: "community", text: "Evento comunitario" }
  }

  if (validationStatus === "validated") {
    return { type: "verified", text: "Evento verificado" }
  }

  return { type: "community", text: "Evento comunitario" }
}

export function buildInitialEventDraft(
  validationStatus: string,
  profileKind?: string,
): EventDraftState {
  const label = resolveEventLabelForProfile(validationStatus, profileKind)

  return {
    ...initialEventDraftState,
    labelType: label.type,
    labelText: label.text,
  }
}

export function formatDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function buildDraftFromEvent(event: EventCardData): EventDraftState {
  return {
    title: event.title,
    summary: event.summary,
    location: event.location,
    coordinates: event.coordinates,
    date: formatDateInputValue(event.date),
    category: event.category,
    description: event.description,
    registrationUrl: event.registrationUrl ?? "",
    requirements: event.requirements,
    labelType: event.label.type,
    labelText: event.label.text,
    gallery: event.gallery.join("\n"),
  }
}
