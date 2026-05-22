export type EventLabelData = {
  type: string
  text: string
}

export type EventImage = {
  src: string
  alt: string
}

export type EventCardData = {
  id: string
  label: EventLabelData
  title: string
  summary: string
  location: string
  date: Date | string
  category: string
  image: EventImage
  ctaText: string
  ctaHref?: string
}
