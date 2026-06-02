import type {
  eventAttendees,
  eventEntrepreneurs,
  eventGalleryImages,
  events,
  users,
} from "@workspace/database"
import type { CreateEventInput } from "../types/event-create-input"
import type { EventCardData, EventLabel } from "../types/event.types"
import { primaryCategoryDbToUi, categoryUiToDb } from "./category.mapper"
import { mapUserToProfile } from "@/features/profiles/utils/profile.mapper"
import type { AppUserRow } from "@/features/auth/api/users.server"

type EventRow = typeof events.$inferSelect
type UserRow = typeof users.$inferSelect
type GalleryRow = typeof eventGalleryImages.$inferSelect
type EntrepreneurRow = typeof eventEntrepreneurs.$inferSelect & { user?: UserRow | null }
type AttendeeRow = typeof eventAttendees.$inferSelect

export type EventWithRelations = EventRow & {
  createdBy: UserRow
  galleryImages: Array<GalleryRow>
  entrepreneurs: Array<EntrepreneurRow>
  attendees: Array<AttendeeRow>
}

const verifiedLabel: EventLabel = {
  type: "verified",
  text: "Evento verificado",
}

const communityLabel: EventLabel = {
  type: "community",
  text: "Evento comunitario",
}

function defaultLabelForOrganizer(organizer: EventCardData["organizer"]): EventLabel {
  if (organizer.verified) {
    return verifiedLabel
  }

  return communityLabel
}

export function resolveEventLabelFromOrganizer(
  organizer: EventCardData["organizer"],
  storedLabel?: EventLabel,
  organizerRole?: "asistente" | "organizador" | "emprendedor"
): EventLabel {
  if (organizerRole === "asistente") {
    return communityLabel
  }

  if (organizer.verified) {
    return verifiedLabel
  }

  return storedLabel ?? communityLabel
}

function mapOrganizer(user: UserRow): EventCardData["organizer"] {
  return {
    profileId: user.id,
    name: user.displayName ?? "Organizador",
    avatarUrl: user.avatarUrl ?? "",
    verified: Boolean(user.validatedAt),
    contactEmail: user.email,
  }
}

export function mapEventRowToCardData(event: EventWithRelations): EventCardData {
  const sortedGallery = [...event.galleryImages].sort((left, right) =>
    left.id.localeCompare(right.id)
  )
  const coverUrl = sortedGallery[0]?.url ?? ""
  const galleryUrls = sortedGallery.map((image) => image.url).filter(Boolean)
  const organizer = mapOrganizer(event.createdBy)
  const label = defaultLabelForOrganizer(organizer)
  const resolvedLabel = resolveEventLabelFromOrganizer(
    organizer,
    label,
    event.createdBy.role as "asistente" | "organizador" | "emprendedor"
  )

  return {
    id: event.id,
    createdByProfileId: event.createdByUserId,
    label: resolvedLabel,
    title: event.title ?? "",
    summary: event.summary ?? "",
    location: event.location ?? "",
    date: event.startsAt ?? new Date(),
    category: primaryCategoryDbToUi(event.category as Parameters<typeof primaryCategoryDbToUi>[0]),
    image: {
      src: coverUrl,
      alt: `${event.title ?? "Evento"} - ${event.location ?? ""}`,
    },
    description: event.description ?? "",
    price: {
      amount: Number(event.priceAmount ?? 0),
      currency: event.priceCurrency ?? "ARS",
      label: event.priceLabel ?? "",
    },
    gallery: galleryUrls,
    savedCount: event.favoritesCount ?? 0,
    registrationUrl: event.registrationUrl ?? undefined,
    organizer,
    participatingVentures: event.entrepreneurs.map((row) => ({
      profileId: row.userId,
    })),
    attendeeProfileIds: event.attendees.map((row) => row.userId),
    requirements: event.requirements ?? "",
    coordinates: {
      lat: event.latitude ?? -34.6037,
      lng: event.longitude ?? -58.3816,
    },
  }
}

export function mapCreateInputToEventValues(
  input: CreateEventInput,
  createdByUserId: string
) {
  const imageUrls = [
    input.image.src.trim(),
    ...input.gallery.map((url) => url.trim()).filter(Boolean),
  ].filter(Boolean)

  const uniqueUrls = [...new Set(imageUrls)]

  return {
    event: {
      createdByUserId,
      title: input.title.trim(),
      summary: input.summary.trim(),
      location: input.location.trim(),
      startsAt: input.date,
      category: [categoryUiToDb(input.category.trim())],
      description: input.description.trim(),
      priceAmount: String(input.price?.amount ?? 0),
      priceCurrency: input.price?.currency ?? "ARS",
      priceLabel: input.price?.label ?? "",
      registrationUrl: input.registrationUrl?.trim() || null,
      requirements: input.requirements.trim(),
      latitude: input.coordinates?.lat ?? null,
      longitude: input.coordinates?.lng ?? null,
    },
    galleryUrls: uniqueUrls,
    entrepreneurUserIds:
      input.participatingVentures?.map((venture) => venture.profileId) ?? [],
  }
}

export function mapUserRowToOrganizer(user: AppUserRow): EventCardData["organizer"] {
  const profile = mapUserToProfile(user)
  return {
    profileId: user.id,
    name: profile.displayName,
    avatarUrl: profile.avatarUrl,
    verified: profile.validationStatus === "validated",
    contactEmail: profile.email,
  }
}
