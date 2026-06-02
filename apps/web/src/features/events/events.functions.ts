import { createServerFn } from "@tanstack/react-start"
import type { CreateEventInput } from "./types/event-create-input"

export const listEventsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { listEvents } = await import("./api/events.server")
  const eventsList = await listEvents()
  return { events: eventsList }
})

export const getEventByIdFn = createServerFn({ method: "POST" })
  .inputValidator((data: { eventId: string }) => data)
  .handler(async ({ data }) => {
    const { getEventById } = await import("./api/events.server")
    const event = await getEventById(data.eventId)
    return { event }
  })

export const createEventFn = createServerFn({ method: "POST" })
  .inputValidator((data: CreateEventInput) => data)
  .handler(async ({ data }) => {
    const { createEvent } = await import("./api/events.server")
    const event = await createEvent(data)
    return { event }
  })

export const updateEventFn = createServerFn({ method: "POST" })
  .inputValidator((data: { eventId: string; input: CreateEventInput }) => data)
  .handler(async ({ data }) => {
    const { updateEvent } = await import("./api/events.server")
    const event = await updateEvent(data.eventId, data.input)
    return { event }
  })

export const deleteEventFn = createServerFn({ method: "POST" })
  .inputValidator((data: { eventId: string }) => data)
  .handler(async ({ data }) => {
    const { deleteEvent } = await import("./api/events.server")
    const success = await deleteEvent(data.eventId)
    return { success }
  })

export const getMyEventsSectionsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getMyEventsSections } = await import("./api/events.server")
  return getMyEventsSections()
})
