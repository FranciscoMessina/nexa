import "@tanstack/react-start/server-only"
import { desc, eq } from "drizzle-orm"
import {
  eventAttendees,
  eventEntrepreneurs,
  eventGalleryImages,
  events,
} from "@workspace/database"
import type { UserRole } from "@/features/auth/types/auth.types"
import { getDb } from "@/shared/lib/db/get-db"
import { ForbiddenError } from "@/shared/lib/auth/errors.server"
import { requireAppUser } from "@/shared/lib/auth/session.server"
import type { CreateEventInput } from "../types/event-create-input"
import type { EventCardData } from "../types/event.types"
import {
  type EventWithRelations,
  mapCreateInputToEventValues,
  mapEventRowToCardData,
} from "../utils/events.mapper"

const eventWithRelations = {
  createdBy: true,
  galleryImages: true,
  entrepreneurs: {
    with: {
      user: true,
    },
  },
  attendees: true,
} as const

async function loadEventById(eventId: string): Promise<EventWithRelations | null> {
  const database = getDb()
  const row = await database.query.events.findFirst({
    where: eq(events.id, eventId),
    with: eventWithRelations,
  })

  return row ?? null
}

export async function listEvents(): Promise<Array<EventCardData>> {
  const database = getDb()
  const rows = await database.query.events.findMany({
    with: eventWithRelations,
    orderBy: [desc(events.startsAt)],
  })

  return rows.map(mapEventRowToCardData)
}

export async function getEventById(eventId: string): Promise<EventCardData | null> {
  const row = await loadEventById(eventId)
  return row ? mapEventRowToCardData(row) : null
}

async function replaceEventGallery(eventId: string, urls: Array<string>): Promise<void> {
  const database = getDb()
  await database.delete(eventGalleryImages).where(eq(eventGalleryImages.eventId, eventId))

  if (urls.length === 0) {
    return
  }

  await database.insert(eventGalleryImages).values(
    urls.map((url) => ({
      eventId,
      url,
    }))
  )
}

async function replaceEventEntrepreneurs(
  eventId: string,
  userIds: Array<string>
): Promise<void> {
  const database = getDb()
  await database.delete(eventEntrepreneurs).where(eq(eventEntrepreneurs.eventId, eventId))

  if (userIds.length === 0) {
    return
  }

  await database.insert(eventEntrepreneurs).values(
    userIds.map((userId) => ({
      eventId,
      userId,
    }))
  )
}

export async function createEvent(input: CreateEventInput): Promise<EventCardData> {
  const authUser = await requireAppUser()
  const { event, galleryUrls, entrepreneurUserIds } = mapCreateInputToEventValues(
    input,
    authUser.id
  )

  const database = getDb()
  const inserted = await database.insert(events).values(event).returning()
  const created = inserted[0]

  if (!created) {
    throw new Error("No se pudo crear el evento.")
  }

  await replaceEventGallery(created.id, galleryUrls)
  await replaceEventEntrepreneurs(created.id, entrepreneurUserIds)

  const full = await loadEventById(created.id)

  if (!full) {
    throw new Error("No se pudo cargar el evento creado.")
  }

  return mapEventRowToCardData(full)
}

export async function updateEvent(
  eventId: string,
  input: CreateEventInput
): Promise<EventCardData | null> {
  const authUser = await requireAppUser()
  const existing = await loadEventById(eventId)

  if (!existing || existing.createdByUserId !== authUser.id) {
    throw new ForbiddenError("Solo podés editar eventos que publicaste.")
  }

  const { event, galleryUrls, entrepreneurUserIds } = mapCreateInputToEventValues(
    input,
    authUser.id
  )

  const database = getDb()
  await database.update(events).set(event).where(eq(events.id, eventId))
  await replaceEventGallery(eventId, galleryUrls)
  await replaceEventEntrepreneurs(eventId, entrepreneurUserIds)

  const full = await loadEventById(eventId)
  return full ? mapEventRowToCardData(full) : null
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  const authUser = await requireAppUser()
  const existing = await loadEventById(eventId)

  if (!existing || existing.createdByUserId !== authUser.id) {
    throw new ForbiddenError("Solo podés eliminar eventos que publicaste.")
  }

  const database = getDb()
  await database.delete(events).where(eq(events.id, eventId))
  return true
}

function startOfToday(): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

function uniqueEventsById(eventsList: Array<EventCardData>): Array<EventCardData> {
  const seen = new Set<string>()
  return eventsList.filter((event) => {
    if (seen.has(event.id)) {
      return false
    }
    seen.add(event.id)
    return true
  })
}

async function getAttendingEventIdsForUser(userId: string): Promise<Array<string>> {
  const database = getDb()
  const rows = await database.query.eventAttendees.findMany({
    where: eq(eventAttendees.userId, userId),
  })
  return rows.map((row) => row.eventId)
}

function filterEventsForUser(
  allEvents: Array<EventCardData>,
  userId: string,
  role: UserRole,
  attendingEventIds: Array<string>
): Array<EventCardData> {
  const organized = allEvents.filter((event) => event.organizer.profileId === userId)
  const attending = allEvents.filter((event) => attendingEventIds.includes(event.id))

  if (role === "organizador") {
    return uniqueEventsById([...organized, ...attending])
  }

  if (role === "emprendedor") {
    const participating = allEvents.filter((event) =>
      event.participatingVentures?.some((venture) => venture.profileId === userId)
    )
    return uniqueEventsById([...organized, ...participating, ...attending])
  }

  return uniqueEventsById([...organized, ...attending])
}

export type MyEventsSectionsPayload = {
  upcoming: Array<EventCardData>
  past: Array<EventCardData>
}

export async function getMyEventsSections(): Promise<MyEventsSectionsPayload> {
  const authUser = await requireAppUser()
  // listEvents() still over-fetches all events plus relations; future work should
  // push per-user filtering into the query to avoid loading everything into JS.
  const allEvents = await listEvents()
  const attendingEventIds = await getAttendingEventIdsForUser(authUser.id)
  const cards = filterEventsForUser(allEvents, authUser.id, authUser.role, attendingEventIds)
  const today = startOfToday()

  const upcoming = cards
    .filter((event) => event.date >= today)
    .sort((left, right) => left.date.getTime() - right.date.getTime())

  const past = cards
    .filter((event) => event.date < today)
    .sort((left, right) => right.date.getTime() - left.date.getTime())

  return { upcoming, past }
}
