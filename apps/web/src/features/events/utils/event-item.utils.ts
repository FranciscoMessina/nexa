import type { EventCardData, EventItem } from "@/features/events/types/event.types"
import { resolveEventLabel } from "@/features/events/utils/event-label.utils"

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
  const { venue, address, neighborhood } = parseLocation(event.location)
  const label = resolveEventLabel(event)

  return {
    id: event.id,
    title: event.title,
    venue,
    address,
    neighborhood,
    startsAt: event.date,
    dateLabel: formatCardDate(event.date),
    category: event.category,
    kind: label.type,
    imageUrl: event.image.src,
  }
}
