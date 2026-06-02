import { createServerFn } from "@tanstack/react-start"

export const getAttendanceStateFn = createServerFn({ method: "POST" })
  .inputValidator((data: { eventId: string }) => data)
  .handler(async ({ data }) => {
    const { getAttendanceState } = await import("./api/event-attendance.server")
    return getAttendanceState(data.eventId)
  })

export const toggleAttendanceFn = createServerFn({ method: "POST" })
  .inputValidator((data: { eventId: string }) => data)
  .handler(async ({ data }) => {
    const { toggleAttendance } = await import("./api/event-attendance.server")
    return toggleAttendance(data.eventId)
  })

export const getAttendingEventIdsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getAttendingEventIdsForCurrentUser } = await import("./api/event-attendance.server")
  const eventIds = await getAttendingEventIdsForCurrentUser()
  return { eventIds }
})
