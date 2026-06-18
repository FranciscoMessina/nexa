import { createServerFn } from "@tanstack/react-start"

export const getParticipationRequestStateFn = createServerFn({ method: "POST" })
  .inputValidator((data: { eventId: string }) => data)
  .handler(async ({ data }) => {
    const { getParticipationRequestState } = await import("./api/event-participation.server")
    return getParticipationRequestState(data.eventId)
  })

export const submitParticipationRequestFn = createServerFn({ method: "POST" })
  .inputValidator((data: { eventId: string }) => data)
  .handler(async ({ data }) => {
    const { submitParticipationRequest } = await import("./api/event-participation.server")
    return submitParticipationRequest(data.eventId)
  })

export const listPendingParticipationRequestsFn = createServerFn({ method: "POST" })
  .inputValidator((data: { eventId: string }) => data)
  .handler(async ({ data }) => {
    const { listPendingParticipationRequests } = await import("./api/event-participation.server")
    return listPendingParticipationRequests(data.eventId)
  })

export const approveParticipationRequestFn = createServerFn({ method: "POST" })
  .inputValidator((data: { eventId: string; userId: string }) => data)
  .handler(async ({ data }) => {
    const { approveParticipationRequest } = await import("./api/event-participation.server")
    await approveParticipationRequest(data.eventId, data.userId)
    return { ok: true as const }
  })

export const rejectParticipationRequestFn = createServerFn({ method: "POST" })
  .inputValidator((data: { eventId: string; userId: string }) => data)
  .handler(async ({ data }) => {
    const { rejectParticipationRequest } = await import("./api/event-participation.server")
    await rejectParticipationRequest(data.eventId, data.userId)
    return { ok: true as const }
  })
