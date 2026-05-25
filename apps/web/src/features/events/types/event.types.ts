export type EventKind = "verified" | "community"

export type EventLabel = {
  type: EventKind
  text: string
}

export type EventOrganizer = {
  name: string
  avatarUrl: string
  verified: boolean
  contactEmail: string
}

export type EventPrice = {
  amount: number
  currency: string
  label: string
}

export type EventCoordinates = {
  lat: number
  lng: number
}

export type EventDetailData = {
  id: string
  label: EventLabel
  title: string
  summary: string
  location: string
  date: Date
  category: string
  image: {
    src: string
    alt: string
  }
  ctaText: string
  ctaHref?: string
  description: string
  price: EventPrice
  gallery: Array<string>
  savedCount: number
  registrationUrl?: string
  organizer: EventOrganizer
  requirements: string
  coordinates: EventCoordinates
}

export type EventCardData = EventDetailData

export type EventItem = {
  id: string
  title: string
  venue: string
  address: string
  neighborhood: string
  dateLabel: string
  category: string
  kind: EventKind
  imageUrl: string
}

export type EventFilterOption = {
  value: string
  label: string
}
