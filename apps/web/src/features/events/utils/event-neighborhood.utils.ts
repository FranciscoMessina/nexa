export const EVENT_NEIGHBORHOOD_OPTIONS = [
  "Palermo",
  "Colegiales",
  "Villa Crespo",
  "Chacarita",
  "Recoleta",
  "San Telmo",
  "Puerto Madero",
  "Microcentro",
] as const

export type EventNeighborhood = (typeof EVENT_NEIGHBORHOOD_OPTIONS)[number]

function stripCitySuffix(location: string): string {
  return location
    .replace(/,?\s*CABA\s*$/i, "")
    .replace(/,?\s*Ciudad Autónoma de Buenos Aires\s*$/i, "")
    .trim()
}

function findKnownNeighborhood(text: string): EventNeighborhood | undefined {
  const normalized = text.toLowerCase()
  const sorted = [...EVENT_NEIGHBORHOOD_OPTIONS].sort(
    (left, right) => right.length - left.length
  )

  return sorted.find((neighborhood) =>
    normalized.includes(neighborhood.toLowerCase())
  )
}

export function extractNeighborhoodFromLocation(location: string): string {
  const cleaned = stripCitySuffix(location.trim())
  const parts = cleaned
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)

  const lastPart = parts.at(-1) ?? ""
  const fromLastPart = findKnownNeighborhood(lastPart)
  if (fromLastPart) {
    return fromLastPart
  }

  const fromFullLocation = findKnownNeighborhood(cleaned)
  if (fromFullLocation) {
    return fromFullLocation
  }

  return lastPart
}

export function matchesNeighborhoodFilter(
  location: string,
  neighborhoodFilter: string
): boolean {
  if (neighborhoodFilter === "all") {
    return true
  }

  return location.toLowerCase().includes(neighborhoodFilter.toLowerCase())
}
