import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { createEventInputSchema } from "./validation/event.schema"

export const listEventsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { listEvents } = await import("./api/events.server")
  const eventsList = await listEvents()
  return { events: eventsList }
})

export const getEventByIdFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ eventId: z.string().min(1) }).parse(data)
  )
  .handler(async ({ data }) => {
    const { getEventById } = await import("./api/events.server")
    const event = await getEventById(data.eventId)
    return { event }
  })

export const createEventFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createEventInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { createEvent } = await import("./api/events.server")
    const event = await createEvent(data)
    return { event }
  })

export const updateEventFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        eventId: z.string().min(1),
        input: createEventInputSchema,
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const { updateEvent } = await import("./api/events.server")
    const event = await updateEvent(data.eventId, data.input)
    return { event }
  })

export const deleteEventFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ eventId: z.string().min(1) }).parse(data)
  )
  .handler(async ({ data }) => {
    const { deleteEvent } = await import("./api/events.server")
    const success = await deleteEvent(data.eventId)
    return { success }
  })

export const getMyEventsSectionsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getMyEventsSections } = await import("./api/events.server")
  return getMyEventsSections()
})

export const getEventRecommendationFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getEventRecommendationForCurrentUser } = await import(
    "./api/event-recommendations.server"
  )
  const recommendation = await getEventRecommendationForCurrentUser()
  return { recommendation }
})

export const sendEventRecommendationEmailsFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: unknown) =>
      z
        .object({
          secret: z.string().optional(),
          userId: z.string().optional(),
          email: z.string().email().optional(),
        })
        .parse(data ?? {})
  )
  .handler(async ({ data }) => {
    const expectedSecret = process.env.RECOMMENDATION_EMAIL_CRON_SECRET?.trim()

    if (!expectedSecret || data.secret !== expectedSecret) {
      throw new Error("No autorizado para ejecutar el envío de recomendaciones.")
    }

    const { sendEventRecommendationEmailsBatch } = await import(
      "./api/event-recommendation-email.server"
    )

    const results = await sendEventRecommendationEmailsBatch({
      userId: data.userId,
      email: data.email,
    })

    return { results }
  })
