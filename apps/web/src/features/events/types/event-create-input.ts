import type { EventCardData } from "@/features/events/types/event.types"

export type CreateMockEventInput = {
  organizer: EventCardData["organizer"]
  label: EventCardData["label"]
  title: string
  summary: string
  location: string
  date: Date
  category: string
  image: {
    src: string
  }
  description: string
  price?: EventCardData["price"]
  gallery: Array<string>
  registrationUrl?: string
  participatingVentures?: EventCardData["participatingVentures"]
  attendeeProfileIds?: Array<string>
  requirements: string
  coordinates?: EventCardData["coordinates"]
}
