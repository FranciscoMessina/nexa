import "@tanstack/react-start/server-only"
import { and, eq } from "drizzle-orm"
import { eventAttendees, eventFavorites, events } from "@workspace/database"
import { getDb } from "@/shared/lib/db/get-db"
import { getOptionalAppUser, requireAppUser } from "@/shared/lib/auth/session.server"
import { ForbiddenError } from "@/shared/lib/auth/errors.server"
import { resolveDisplayedAttendanceCount } from "../utils/base-attendance.utils"

export type AttendanceState = {
  isAttending: boolean
  attendeeProfileIds: Array<string>
  attendanceCount: number
}

export async function getAttendanceState(eventId: string): Promise<AttendanceState> {
  const database = getDb()
  const [eventRow, attendeeRows] = await Promise.all([
    database
      .select({ baseAttendanceCount: events.baseAttendanceCount })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1),
    database
      .select({ userId: eventAttendees.userId })
      .from(eventAttendees)
      .where(eq(eventAttendees.eventId, eventId)),
  ])

  const authUser = await getOptionalAppUser()
  const attendeeProfileIds = attendeeRows.map((row) => row.userId)
  const baseAttendanceCount = eventRow[0]?.baseAttendanceCount ?? 0

  return {
    isAttending: authUser ? attendeeProfileIds.includes(authUser.id) : false,
    attendeeProfileIds,
    attendanceCount: resolveDisplayedAttendanceCount(
      baseAttendanceCount,
      attendeeProfileIds.length
    ),
  }
}

export async function getAttendingEventIdsForCurrentUser(): Promise<Array<string>> {
  const authUser = await requireAppUser()
  const database = getDb()
  const rows = await database
    .select({ eventId: eventAttendees.eventId })
    .from(eventAttendees)
    .where(eq(eventAttendees.userId, authUser.id))

  return rows.map((row) => row.eventId)
}

export async function toggleAttendance(eventId: string): Promise<AttendanceState> {
  const authUser = await requireAppUser()

  if (authUser.role === "emprendedor") {
    throw new ForbiddenError("Los emprendedores no pueden confirmar asistencia a eventos.")
  }

  const database = getDb()

  const existing = await database
    .select()
    .from(eventAttendees)
    .where(
      and(eq(eventAttendees.eventId, eventId), eq(eventAttendees.userId, authUser.id))
    )
    .limit(1)

  if (existing[0]) {
    await database
      .delete(eventAttendees)
      .where(
        and(eq(eventAttendees.eventId, eventId), eq(eventAttendees.userId, authUser.id))
      )
  } else {
    await database.insert(eventAttendees).values({
      eventId,
      userId: authUser.id,
    })
  }

  return getAttendanceState(eventId)
}

export async function toggleFavorite(eventId: string): Promise<{ favorited: boolean }> {
  const authUser = await requireAppUser()
  const database = getDb()

  const existing = await database
    .select()
    .from(eventFavorites)
    .where(
      and(eq(eventFavorites.eventId, eventId), eq(eventFavorites.userId, authUser.id))
    )
    .limit(1)

  const eventRows = await database
    .select({ favoritesCount: events.favoritesCount })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1)

  const currentCount = eventRows[0]?.favoritesCount ?? 0

  if (existing[0]) {
    await database
      .delete(eventFavorites)
      .where(
        and(eq(eventFavorites.eventId, eventId), eq(eventFavorites.userId, authUser.id))
      )
    await database
      .update(events)
      .set({ favoritesCount: Math.max(0, currentCount - 1) })
      .where(eq(events.id, eventId))

    return { favorited: false }
  }

  await database.insert(eventFavorites).values({
    eventId,
    userId: authUser.id,
  })
  await database
    .update(events)
    .set({ favoritesCount: currentCount + 1 })
    .where(eq(events.id, eventId))

  return { favorited: true }
}
