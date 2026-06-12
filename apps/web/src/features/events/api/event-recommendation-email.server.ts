import "@tanstack/react-start/server-only"
import { eq } from "drizzle-orm"
import { eventAttendees, eventRecommendationDeliveries, users } from "@workspace/database"
import { getDb } from "@/shared/lib/db/get-db"
import { sendEmail } from "@/shared/lib/email/send-email.server"
import { getAppBaseUrl } from "@/shared/lib/email/config.server"
import { listEvents } from "./events.server"
import {
  resolveEmailRecommendation,
  type AttendedEventSnapshot,
  type DbCategory,
  type EventRecommendationPayload,
} from "../utils/event-recommendation.utils"
import { buildEventRecommendationEmail } from "../email/event-recommendation-email.template"

export type RecommendationEmailSkipReason =
  | "missing_email"
  | "communications_disabled"
  | "no_attendance_history"
  | "no_recommendation"

export type RecommendationEmailSendResult =
  | {
      status: "sent"
      userId: string
      eventId: string
      email: string
      deliveryId: string
      recommendation: EventRecommendationPayload
    }
  | {
      status: "skipped"
      userId: string
      reason: RecommendationEmailSkipReason
    }
  | {
      status: "failed"
      userId: string
      eventId?: string
      email?: string
      deliveryId?: string
      error: string
    }

async function loadAttendedEventsForUser(userId: string): Promise<Array<AttendedEventSnapshot>> {
  const database = getDb()
  const rows = await database.query.eventAttendees.findMany({
    where: eq(eventAttendees.userId, userId),
    with: {
      event: true,
    },
  })

  return rows
    .filter((row) => row.event)
    .map((row) => ({
      eventId: row.eventId,
      categoryDb: (row.event?.category ?? []) as Array<DbCategory>,
      registeredAt: row.registeredAt,
    }))
}


async function loadAttendingEventIds(userId: string): Promise<Set<string>> {
  const database = getDb()
  const rows = await database.query.eventAttendees.findMany({
    where: eq(eventAttendees.userId, userId),
  })

  return new Set(rows.map((row) => row.eventId))
}

export async function resolveEmailRecommendationForUser(
  userId: string
): Promise<EventRecommendationPayload | null> {
  const [attendedEvents, allEvents, attendingEventIds] = await Promise.all([
    loadAttendedEventsForUser(userId),
    listEvents(),
    loadAttendingEventIds(userId),
  ])

  if (attendedEvents.length === 0) {
    return null
  }

  return resolveEmailRecommendation(attendedEvents, allEvents, attendingEventIds)
}

export async function sendEventRecommendationEmailForUser(
  userId: string
): Promise<RecommendationEmailSendResult> {
  const database = getDb()
  const user = await database.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!user) {
    return {
      status: "failed",
      userId,
      error: "Usuario no encontrado.",
    }
  }

  const email = user.email?.trim().toLowerCase()

  if (!email) {
    return {
      status: "skipped",
      userId,
      reason: "missing_email",
    }
  }

  if (!user.acceptsEmailCommunications) {
    return {
      status: "skipped",
      userId,
      reason: "communications_disabled",
    }
  }

  const attendedEvents = await loadAttendedEventsForUser(userId)

  if (attendedEvents.length === 0) {
    return {
      status: "skipped",
      userId,
      reason: "no_attendance_history",
    }
  }

  const [allEvents, attendingEventIds] = await Promise.all([
    listEvents(),
    loadAttendingEventIds(userId),
  ])

  const recommendation = resolveEmailRecommendation(attendedEvents, allEvents, attendingEventIds)

  if (!recommendation) {
    return {
      status: "skipped",
      userId,
      reason: "no_recommendation",
    }
  }

  const inserted = await database
    .insert(eventRecommendationDeliveries)
    .values({
      userId,
      eventId: recommendation.event.id,
      channel: "email",
      status: "pending",
      recommendationReason: recommendation.reason,
    })
    .onConflictDoUpdate({
      target: [
        eventRecommendationDeliveries.userId,
        eventRecommendationDeliveries.eventId,
        eventRecommendationDeliveries.channel,
      ],
      set: {
        status: "pending",
        recommendationReason: recommendation.reason,
        sentAt: null,
      },
    })
    .returning()

  const deliveryId = inserted[0]?.id

  if (!deliveryId) {
    return {
      status: "failed",
      userId,
      eventId: recommendation.event.id,
      email,
      error: "No se pudo registrar el envío de la recomendación.",
    }
  }

  const eventUrl = `${getAppBaseUrl()}/events/${recommendation.event.id}`
  const recipientName = user.displayName?.trim() || "vecino/a"
  const emailContent = buildEventRecommendationEmail({
    recipientName,
    event: recommendation.event,
    categoryLabel: recommendation.categoryLabel,
    reason: recommendation.reason,
    eventUrl,
  })

  try {
    await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    })

    await database
      .update(eventRecommendationDeliveries)
      .set({
        status: "sent",
        sentAt: new Date(),
        recommendationReason: recommendation.reason,
      })
      .where(eq(eventRecommendationDeliveries.id, deliveryId))

    return {
      status: "sent",
      userId,
      eventId: recommendation.event.id,
      email,
      deliveryId,
      recommendation,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido al enviar email."

    await database
      .update(eventRecommendationDeliveries)
      .set({
        status: "failed",
        recommendationReason: recommendation.reason,
      })
      .where(eq(eventRecommendationDeliveries.id, deliveryId))

    return {
      status: "failed",
      userId,
      eventId: recommendation.event.id,
      email,
      deliveryId,
      error: message,
    }
  }
}

export async function sendEventRecommendationEmailsBatch(options?: {
  userId?: string
  email?: string
}): Promise<Array<RecommendationEmailSendResult>> {
  const database = getDb()

  const eligibleUsers = await database.query.users.findMany({
    where: options?.userId
      ? eq(users.id, options.userId)
      : eq(users.acceptsEmailCommunications, true),
  })

  const filteredUsers = eligibleUsers.filter((user) => {
    if (options?.email) {
      return user.email.trim().toLowerCase() === options.email.trim().toLowerCase()
    }

    return true
  })

  const results: Array<RecommendationEmailSendResult> = []

  for (const user of filteredUsers) {
    results.push(await sendEventRecommendationEmailForUser(user.id))
  }

  return results
}
