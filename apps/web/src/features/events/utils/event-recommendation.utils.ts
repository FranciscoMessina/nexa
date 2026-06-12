import type { EventCardData } from "../types/event.types"
import { categoryDbToUi } from "./category.mapper"

export type DbCategory =
  | "ropa"
  | "feria_de_emprendedores"
  | "arte_y_cultura"
  | "cine_y_entretenimiento"
  | "deportes"
  | "gastronomia"
  | "musica"
  | "talleres_y_cursos"

export type AttendedEventSnapshot = {
  eventId: string
  categoryDb: Array<DbCategory>
  registeredAt: Date
}

export type EventRecommendationPayload = {
  event: EventCardData
  categoryLabel: string
  reason: string
}

export function startOfToday(reference = new Date()): Date {
  const today = new Date(reference)
  today.setHours(0, 0, 0, 0)
  return today
}

export function resolvePreferredCategory(
  attendedEvents: Array<AttendedEventSnapshot>
): DbCategory | null {
  if (attendedEvents.length === 0) {
    return null
  }

  const sortedByAttendance = [...attendedEvents].sort(
    (left, right) => right.registeredAt.getTime() - left.registeredAt.getTime()
  )

  const fromMostRecent = sortedByAttendance[0]?.categoryDb[0]
  if (fromMostRecent) {
    return fromMostRecent
  }

  const counts = new Map<DbCategory, number>()

  for (const attended of attendedEvents) {
    const category = attended.categoryDb[0]
    if (!category) {
      continue
    }
    counts.set(category, (counts.get(category) ?? 0) + 1)
  }

  let bestCategory: DbCategory | null = null
  let bestCount = 0

  for (const [category, count] of counts) {
    if (count > bestCount) {
      bestCategory = category
      bestCount = count
    }
  }

  return bestCategory
}

export function eventMatchesCategory(event: EventCardData, category: DbCategory): boolean {
  return event.category === categoryDbToUi(category)
}

export function isUpcomingEvent(event: EventCardData, reference = new Date()): boolean {
  return event.date >= startOfToday(reference)
}

export function compareRecommendationCandidates(
  left: EventCardData,
  right: EventCardData
): number {
  const leftVerified = left.label.type === "verified" ? 0 : 1
  const rightVerified = right.label.type === "verified" ? 0 : 1

  if (leftVerified !== rightVerified) {
    return leftVerified - rightVerified
  }

  return left.date.getTime() - right.date.getTime()
}

export function pickRecommendedEvent(
  allEvents: Array<EventCardData>,
  preferredCategory: DbCategory,
  attendingEventIds: ReadonlySet<string>,
  reference = new Date()
): EventCardData | null {
  const candidates = allEvents.filter((event) => {
    if (attendingEventIds.has(event.id)) {
      return false
    }

    if (!isUpcomingEvent(event, reference)) {
      return false
    }

    return eventMatchesCategory(event, preferredCategory)
  })

  if (candidates.length === 0) {
    return null
  }

  return [...candidates].sort(compareRecommendationCandidates)[0] ?? null
}

export function buildRecommendationReason(categoryLabel: string): string {
  return `Te recomendamos este evento porque participaste en eventos de ${categoryLabel}.`
}

export function buildEventRecommendation(
  event: EventCardData,
  category: DbCategory
): EventRecommendationPayload {
  const categoryLabel = categoryDbToUi(category)

  return {
    event,
    categoryLabel,
    reason: buildRecommendationReason(categoryLabel),
  }
}

export function resolveEventRecommendation(
  attendedEvents: Array<AttendedEventSnapshot>,
  allEvents: Array<EventCardData>,
  attendingEventIds: ReadonlySet<string>,
  reference = new Date()
): EventRecommendationPayload | null {
  const preferredCategory = resolvePreferredCategory(attendedEvents)

  if (!preferredCategory) {
    return null
  }

  const recommendedEvent = pickRecommendedEvent(
    allEvents,
    preferredCategory,
    attendingEventIds,
    reference
  )

  if (!recommendedEvent) {
    return null
  }

  return buildEventRecommendation(recommendedEvent, preferredCategory)
}

/** Incluye verificados y comunitarios; prioriza verificados y luego fecha más cercana. */
export function pickEmailRecommendation(
  allEvents: Array<EventCardData>,
  preferredCategory: DbCategory,
  attendingEventIds: ReadonlySet<string>,
  reference = new Date()
): EventCardData | null {
  const candidates = allEvents.filter((event) => {
    if (attendingEventIds.has(event.id)) {
      return false
    }

    if (!isUpcomingEvent(event, reference)) {
      return false
    }

    return eventMatchesCategory(event, preferredCategory)
  })

  if (candidates.length === 0) {
    return null
  }

  return [...candidates].sort(compareRecommendationCandidates)[0] ?? null
}

export function resolveEmailRecommendation(
  attendedEvents: Array<AttendedEventSnapshot>,
  allEvents: Array<EventCardData>,
  attendingEventIds: ReadonlySet<string>,
  reference = new Date()
): EventRecommendationPayload | null {
  const preferredCategory = resolvePreferredCategory(attendedEvents)

  if (!preferredCategory) {
    return null
  }

  const recommendedEvent = pickEmailRecommendation(
    allEvents,
    preferredCategory,
    attendingEventIds,
    reference
  )

  if (!recommendedEvent) {
    return null
  }

  return buildEventRecommendation(recommendedEvent, preferredCategory)
}
