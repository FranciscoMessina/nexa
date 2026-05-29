export type GeocodedPlace = {
  label: string
  lat: number
  lng: number
}

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org"
const PHOTON_BASE = "https://photon.komoot.io/api"
const NEXA_USER_AGENT = "NexaEvents/1.0 (local demo; contact: nexa@example.com)"

/** Área aproximada de CABA y alrededores para priorizar resultados. */
const CABA_CENTER = { lat: -34.6037, lng: -58.3816 }

type PhotonFeature = {
  properties: {
    name?: string
    street?: string
    housenumber?: string
    city?: string
    state?: string
    country?: string
  }
  geometry: {
    coordinates: [number, number]
  }
}

type NominatimResult = {
  display_name: string
  lat: string
  lon: string
}

function formatPhotonLabel(feature: PhotonFeature): string {
  const { name, street, housenumber, city, state } = feature.properties
  const streetLine = [street, housenumber].filter(Boolean).join(" ")
  const parts = [name, streetLine, city, state].filter(Boolean)

  return parts.join(", ")
}

export async function searchLocations(query: string): Promise<Array<GeocodedPlace>> {
  const trimmed = query.trim()

  if (trimmed.length < 3) {
    return []
  }

  const params = new URLSearchParams({
    q: `${trimmed}, Buenos Aires, Argentina`,
    lat: String(CABA_CENTER.lat),
    lon: String(CABA_CENTER.lng),
    limit: "6",
    lang: "es",
  })

  const response = await fetch(`${PHOTON_BASE}/?${params.toString()}`)

  if (!response.ok) {
    return []
  }

  const data = (await response.json()) as { features: Array<PhotonFeature> }

  return data.features
    .map((feature) => {
      const [lng, lat] = feature.geometry.coordinates
      const label = formatPhotonLabel(feature)

      if (!label || Number.isNaN(lat) || Number.isNaN(lng)) {
        return null
      }

      return { label, lat, lng }
    })
    .filter((place): place is GeocodedPlace => place !== null)
}

export async function geocodeLocation(query: string): Promise<GeocodedPlace | null> {
  const trimmed = query.trim()

  if (!trimmed) {
    return null
  }

  const suggestions = await searchLocations(trimmed)

  if (suggestions.length > 0) {
    return suggestions[0]
  }

  const params = new URLSearchParams({
    q: `${trimmed}, Buenos Aires, Argentina`,
    format: "json",
    limit: "1",
    countrycodes: "ar",
  })

  const response = await fetch(`${NOMINATIM_BASE}/search?${params.toString()}`, {
    headers: {
      "Accept-Language": "es",
      "User-Agent": NEXA_USER_AGENT,
    },
  })

  if (!response.ok) {
    return null
  }

  const results = (await response.json()) as Array<NominatimResult>
  const match = results[0]

  if (!match) {
    return null
  }

  const lat = Number(match.lat)
  const lng = Number(match.lon)

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null
  }

  return {
    label: match.display_name,
    lat,
    lng,
  }
}
