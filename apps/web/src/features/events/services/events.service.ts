import {
  createEventFn,
  deleteEventFn,
  getEventByIdFn,
  getEventRecommendationFn,
  getMyEventsSectionsFn,
  listEventsFn,
  updateEventFn,
} from "../events.functions"
import type { EventRecommendationPayload } from "../api/event-recommendations.server"
import { getAttendingEventIdsFn } from "../attendance.functions"
import type { CreateEventInput } from "../types/event-create-input"
import type { EventCardData } from "../types/event.types"
import type { MyEventsSectionsPayload } from "../api/events.server"

export async function fetchEvents(): Promise<Array<EventCardData>> {
  const { events } = await listEventsFn()
  return events
}

export async function fetchEventById(eventId: string): Promise<EventCardData | null> {
  const { event } = await getEventByIdFn({ data: { eventId } })
  return event
}

export async function createEvent(input: CreateEventInput): Promise<EventCardData> {
  const { event } = await createEventFn({ data: input })
  return event
}

export async function updateEvent(
  eventId: string,
  input: CreateEventInput
): Promise<EventCardData | null> {
  const { event } = await updateEventFn({ data: { eventId, input } })
  return event
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  const { success } = await deleteEventFn({ data: { eventId } })
  return success
}

export async function fetchMyEventsSections(): Promise<MyEventsSectionsPayload> {
  return getMyEventsSectionsFn()
}

export async function fetchAttendingEventIds(): Promise<Array<string>> {
  const { eventIds } = await getAttendingEventIdsFn()
  return eventIds
}

export async function fetchEventRecommendation(): Promise<EventRecommendationPayload | null> {
  const { recommendation } = await getEventRecommendationFn()
  return recommendation
}

export const eventsService = {
  fetchEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchMyEventsSections,
  fetchAttendingEventIds,
  fetchEventRecommendation,
}

export default eventsService
