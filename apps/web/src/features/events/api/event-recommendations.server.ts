import "@tanstack/react-start/server-only"
import { eq } from "drizzle-orm"
import { eventAttendees } from "@workspace/database"
import { getDb } from "@/shared/lib/db/get-db"
import { requireAppUser } from "@/shared/lib/auth/session.server"
import { listEvents } from "./events.server"
import {
  resolveEventRecommendation,
  type AttendedEventSnapshot,
  type DbCategory,
  type EventRecommendationPayload,
} from "../utils/event-recommendation.utils"

export type { EventRecommendationPayload }

export async function getEventRecommendationForCurrentUser(): Promise<EventRecommendationPayload | null> {
  const authUser = await requireAppUser()
  const database = getDb()

  const [allEvents, attendanceRows] = await Promise.all([
    listEvents(),
    database.query.eventAttendees.findMany({
      where: eq(eventAttendees.userId, authUser.id),
      with: {
        event: true,
      },
    }),
  ])

  const attendedEvents: Array<AttendedEventSnapshot> = attendanceRows
    .filter((row) => row.event)
    .map((row) => ({
      eventId: row.eventId,
      categoryDb: (row.event?.category ?? []) as Array<DbCategory>,
      registeredAt: row.registeredAt,
    }))

  const attendingEventIds = new Set(attendanceRows.map((row) => row.eventId))

  return resolveEventRecommendation(attendedEvents, allEvents, attendingEventIds)
}
