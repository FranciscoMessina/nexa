export type EventKind = "verified" | "community"

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
