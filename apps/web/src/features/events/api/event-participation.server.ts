import "@tanstack/react-start/server-only"
import { and, eq } from "drizzle-orm"
import {
  eventEntrepreneurs,
  eventParticipationRequests,
  events,
  users,
} from "@workspace/database"
import { mapUserToProfile } from "@/features/profiles/utils/profile.mapper"
import type { Profile } from "@/features/profiles/types/profile.types"
import { getDb } from "@/shared/lib/db/get-db"
import { ForbiddenError } from "@/shared/lib/auth/errors.server"
import { requireAppUser } from "@/shared/lib/auth/session.server"

export type ParticipationRequestStatus =
  | "none"
  | "pending"
  | "approved"
  | "rejected"
  | "already_participant"

export type ParticipationRequestState = {
  status: ParticipationRequestStatus
  canRequest: boolean
}

export type PendingParticipationRequest = {
  userId: string
  requestedAt: Date
  profile: Profile
}

async function loadEventForParticipation(eventId: string) {
  const database = getDb()
  const row = await database.query.events.findFirst({
    where: eq(events.id, eventId),
    columns: {
      id: true,
      createdByUserId: true,
    },
  })

  return row ?? null
}

async function assertEventOrganizer(eventId: string, userId: string): Promise<void> {
  const event = await loadEventForParticipation(eventId)

  if (!event) {
    throw new ForbiddenError("El evento no existe.")
  }

  if (event.createdByUserId !== userId) {
    throw new ForbiddenError("Solo el organizador del evento puede gestionar solicitudes.")
  }
}

async function isEventParticipant(eventId: string, userId: string): Promise<boolean> {
  const database = getDb()
  const row = await database
    .select()
    .from(eventEntrepreneurs)
    .where(
      and(eq(eventEntrepreneurs.eventId, eventId), eq(eventEntrepreneurs.userId, userId))
    )
    .limit(1)

  return Boolean(row[0])
}

export async function getParticipationRequestState(
  eventId: string
): Promise<ParticipationRequestState> {
  const authUser = await requireAppUser()
  const event = await loadEventForParticipation(eventId)

  if (!event) {
    return { status: "none", canRequest: false }
  }

  if (await isEventParticipant(eventId, authUser.id)) {
    return { status: "already_participant", canRequest: false }
  }

  const database = getDb()
  const requestRow = await database
    .select()
    .from(eventParticipationRequests)
    .where(
      and(
        eq(eventParticipationRequests.eventId, eventId),
        eq(eventParticipationRequests.userId, authUser.id)
      )
    )
    .limit(1)

  const request = requestRow[0]

  if (!request) {
    const canRequest =
      authUser.role === "emprendedor" && event.createdByUserId !== authUser.id

    return { status: "none", canRequest }
  }

  if (request.status === "pending") {
    return { status: "pending", canRequest: false }
  }

  if (request.status === "rejected") {
    const canRequest =
      authUser.role === "emprendedor" && event.createdByUserId !== authUser.id

    return { status: "rejected", canRequest }
  }

  return { status: "approved", canRequest: false }
}

export async function submitParticipationRequest(
  eventId: string
): Promise<ParticipationRequestState> {
  const authUser = await requireAppUser()

  if (authUser.role !== "emprendedor") {
    throw new ForbiddenError("Solo los emprendedores pueden solicitar participar en eventos.")
  }

  const event = await loadEventForParticipation(eventId)

  if (!event) {
    throw new ForbiddenError("El evento no existe.")
  }

  if (event.createdByUserId === authUser.id) {
    throw new ForbiddenError("No podés solicitar participar en tu propio evento.")
  }

  if (await isEventParticipant(eventId, authUser.id)) {
    throw new ForbiddenError("Ya formás parte de este evento.")
  }

  const database = getDb()
  const existing = await database
    .select()
    .from(eventParticipationRequests)
    .where(
      and(
        eq(eventParticipationRequests.eventId, eventId),
        eq(eventParticipationRequests.userId, authUser.id)
      )
    )
    .limit(1)

  const current = existing[0]

  const reviewedAt = new Date()

  if (current) {
    await database
      .update(eventParticipationRequests)
      .set({
        status: "approved",
        reviewedAt,
      })
      .where(
        and(
          eq(eventParticipationRequests.eventId, eventId),
          eq(eventParticipationRequests.userId, authUser.id)
        )
      )
  } else {
    await database.insert(eventParticipationRequests).values({
      eventId,
      userId: authUser.id,
      status: "approved",
      reviewedAt,
    })
  }

  if (!(await isEventParticipant(eventId, authUser.id))) {
    await database.insert(eventEntrepreneurs).values({
      eventId,
      userId: authUser.id,
    })
  }

  return getParticipationRequestState(eventId)
}

export async function listPendingParticipationRequests(
  eventId: string
): Promise<Array<PendingParticipationRequest>> {
  const authUser = await requireAppUser()
  await assertEventOrganizer(eventId, authUser.id)

  const event = await loadEventForParticipation(eventId)

  if (!event) {
    return []
  }

  const database = getDb()
  const rows = await database
    .select({
      userId: eventParticipationRequests.userId,
      requestedAt: eventParticipationRequests.createdAt,
      user: users,
    })
    .from(eventParticipationRequests)
    .innerJoin(users, eq(eventParticipationRequests.userId, users.id))
    .where(
      and(
        eq(eventParticipationRequests.eventId, eventId),
        eq(eventParticipationRequests.status, "pending")
      )
    )

  return rows.map((row) => ({
    userId: row.userId,
    requestedAt: row.requestedAt,
    profile: mapUserToProfile(row.user),
  }))
}

export async function approveParticipationRequest(
  eventId: string,
  userId: string
): Promise<void> {
  const authUser = await requireAppUser()
  await assertEventOrganizer(eventId, authUser.id)

  const database = getDb()
  const requestRow = await database
    .select()
    .from(eventParticipationRequests)
    .where(
      and(
        eq(eventParticipationRequests.eventId, eventId),
        eq(eventParticipationRequests.userId, userId),
        eq(eventParticipationRequests.status, "pending")
      )
    )
    .limit(1)

  if (!requestRow[0]) {
    throw new ForbiddenError("La solicitud no existe o ya fue gestionada.")
  }

  const reviewedAt = new Date()

  await database
    .update(eventParticipationRequests)
    .set({
      status: "approved",
      reviewedAt,
    })
    .where(
      and(
        eq(eventParticipationRequests.eventId, eventId),
        eq(eventParticipationRequests.userId, userId)
      )
    )

  const existingParticipant = await database
    .select()
    .from(eventEntrepreneurs)
    .where(
      and(eq(eventEntrepreneurs.eventId, eventId), eq(eventEntrepreneurs.userId, userId))
    )
    .limit(1)

  if (!existingParticipant[0]) {
    await database.insert(eventEntrepreneurs).values({
      eventId,
      userId,
    })
  }
}

export async function rejectParticipationRequest(
  eventId: string,
  userId: string
): Promise<void> {
  const authUser = await requireAppUser()
  await assertEventOrganizer(eventId, authUser.id)

  const database = getDb()
  const requestRow = await database
    .select()
    .from(eventParticipationRequests)
    .where(
      and(
        eq(eventParticipationRequests.eventId, eventId),
        eq(eventParticipationRequests.userId, userId),
        eq(eventParticipationRequests.status, "pending")
      )
    )
    .limit(1)

  if (!requestRow[0]) {
    throw new ForbiddenError("La solicitud no existe o ya fue gestionada.")
  }

  await database
    .update(eventParticipationRequests)
    .set({
      status: "rejected",
      reviewedAt: new Date(),
    })
    .where(
      and(
        eq(eventParticipationRequests.eventId, eventId),
        eq(eventParticipationRequests.userId, userId)
      )
    )
}
