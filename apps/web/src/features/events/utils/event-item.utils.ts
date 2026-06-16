import { withResolvedEventLabel } from "./event-label.utils"
import type { EventCardData, EventItem } from "../types/event.types"

function formatCardDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0")
  const month = date.toLocaleDateString("en-US", { month: "short" })
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  return `${day} ${month} ${year}, ${hours}:${minutes} hs`
}

function parseLocation(
  location: string
): Pick<EventItem, "venue" | "address" | "neighborhood"> {
  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)

  const [venue = location, ...remainingParts] = parts
  const neighborhood = remainingParts.at(-1) ?? ""
  const address = remainingParts.slice(0, -1).join(", ")

  return {
    venue,
    address,
    neighborhood,
  }
}

export function toEventItem(event: EventCardData): EventItem {
  const resolved = withResolvedEventLabel(event)
  const { venue, address, neighborhood } = parseLocation(resolved.location)

  return {
    id: resolved.id,
    title: resolved.title,
    venue,
    address,
    neighborhood,
    startsAt: resolved.date,
    dateLabel: formatCardDate(resolved.date),
    category: resolved.category,
    kind: resolved.label.type,
    imageUrl: resolved.image.src,
    coordinates: resolved.coordinates,
    hasCoordinates: resolved.hasCoordinates,
  }
}

export function canUserManageEvent(
  event: Pick<EventCardData, "createdByProfileId">,
  profileId: string | undefined
): boolean {
  return Boolean(profileId && event.createdByProfileId === profileId)
}
