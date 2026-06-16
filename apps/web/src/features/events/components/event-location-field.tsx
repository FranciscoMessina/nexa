import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
  useMap as useGoogleMap,
} from "@vis.gl/react-google-maps"
import L from "leaflet"
import { useEffect, useId, useRef, useState } from "react"
import { MapContainer, Marker, TileLayer, useMap as useLeafletMap } from "react-leaflet"
import {
  EVENT_MAP_CENTER,
  EVENT_MAP_MARKER_COLORS,
  EVENT_MAP_TILE,
} from "@/features/events/components/event-map.constants"
import {
  googleMapsApiKey,
  googleMapsMapId,
  isGoogleMapsEnabled,
} from "@/features/events/config/google-maps.config"
import type { EventCoordinates } from "@/features/events/types/event.types"
import {
  geocodeLocation,
  searchLocations,
  type GeocodedPlace,
} from "@/features/events/utils/geocoding.utils"
import "leaflet/dist/leaflet.css"
import "./event-map.css"

type EventLocationFieldProps = {
  value: string
  coordinates: EventCoordinates | null
  error?: string
  onChange: (location: string, coordinates: EventCoordinates | null) => void
}

const locationMarkerIcon = L.divIcon({
  className: "nexa-map-marker",
  html: `<span class="nexa-map-marker__pin" style="--marker-color: ${EVENT_MAP_MARKER_COLORS.community}"></span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

function SyncLeafletLocationMap({ coordinates }: { coordinates: EventCoordinates | null }) {
  const map = useLeafletMap()

  useEffect(() => {
    if (!coordinates) {
      map.setView(EVENT_MAP_CENTER, 11, { animate: false })
      return
    }

    map.setView([coordinates.lat, coordinates.lng], 15, { animate: false })
  }, [coordinates, map])

  return null
}

function SyncGoogleLocationMap({ coordinates }: { coordinates: EventCoordinates | null }) {
  const map = useGoogleMap()

  useEffect(() => {
    if (!map) {
      return
    }

    if (!coordinates) {
      map.setCenter({ lat: EVENT_MAP_CENTER[0], lng: EVENT_MAP_CENTER[1] })
      map.setZoom(11)
      return
    }

    map.setCenter({ lat: coordinates.lat, lng: coordinates.lng })
    map.setZoom(15)
  }, [coordinates, map])

  return null
}

function EventLocationLeafletMap({ coordinates }: { coordinates: EventCoordinates | null }) {
  return (
    <MapContainer
      center={EVENT_MAP_CENTER}
      className="nexa-leaflet-map h-full w-full"
      scrollWheelZoom={false}
      zoom={11}
    >
      <TileLayer
        attribution={EVENT_MAP_TILE.attribution}
        maxZoom={EVENT_MAP_TILE.maxZoom}
        subdomains={EVENT_MAP_TILE.subdomains}
        url={EVENT_MAP_TILE.url}
      />
      <SyncLeafletLocationMap coordinates={coordinates} />
      {coordinates ? (
        <Marker icon={locationMarkerIcon} position={[coordinates.lat, coordinates.lng]} />
      ) : null}
    </MapContainer>
  )
}

function EventLocationGoogleMap({ coordinates }: { coordinates: EventCoordinates | null }) {
  return (
    <APIProvider apiKey={googleMapsApiKey}>
      <Map
        className="h-full w-full"
        defaultCenter={{ lat: EVENT_MAP_CENTER[0], lng: EVENT_MAP_CENTER[1] }}
        defaultZoom={11}
        disableDefaultUI={false}
        fullscreenControl={false}
        gestureHandling="greedy"
        mapId={googleMapsMapId}
        mapTypeControl={false}
        streetViewControl={false}
      >
        <SyncGoogleLocationMap coordinates={coordinates} />
        {coordinates ? (
          <AdvancedMarker position={{ lat: coordinates.lat, lng: coordinates.lng }}>
            <Pin
              background={EVENT_MAP_MARKER_COLORS.community}
              borderColor="#c2410c"
              glyphColor="#ffffff"
            />
          </AdvancedMarker>
        ) : null}
      </Map>
    </APIProvider>
  )
}

export function EventLocationField({
  value,
  coordinates,
  error,
  onChange,
}: EventLocationFieldProps) {
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState<Array<GeocodedPlace>>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const trimmed = value.trim()

    if (trimmed.length < 3) {
      setSuggestions([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timeoutId = window.setTimeout(() => {
      void searchLocations(trimmed)
        .then((results) => {
          setSuggestions(results)
          setIsOpen(results.length > 0)
        })
        .finally(() => {
          setIsSearching(false)
        })
    }, 400)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [value])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
    }
  }, [])

  function handleSelect(place: GeocodedPlace) {
    onChange(place.label, { lat: place.lat, lng: place.lng })
    setSuggestions([])
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="relative space-y-2" ref={containerRef}>
        <label className="text-sm font-medium text-[#1a3462]" htmlFor="event-location-input">
          Ubicación
        </label>
        <input
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={isOpen}
          autoComplete="off"
          className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
          id="event-location-input"
          onChange={(event) => {
            onChange(event.target.value, null)
          }}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true)
            }
          }}
          placeholder="Ej: Guatemala 5860, Palermo"
          required
          role="combobox"
          value={value}
        />
        {isSearching ? (
          <p className="text-xs text-[#6b7d9c]">Buscando direcciones...</p>
        ) : null}
        {coordinates ? (
          <p className="text-xs font-medium text-emerald-700" data-testid="event-location-verified">
            Ubicación validada en el mapa.
          </p>
        ) : (
          <p className="text-xs text-[#6b7d9c]">
            Escribí al menos 3 caracteres y elegí una sugerencia, o publicá y validamos la dirección.
          </p>
        )}
        {error ? <span className="block text-xs font-normal text-rose-600">{error}</span> : null}

        {isOpen && suggestions.length > 0 ? (
          <ul
            className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-[#d5deed] bg-white py-1 shadow-lg"
            id={listId}
            role="listbox"
          >
            {suggestions.map((place) => (
              <li key={`${place.lat}-${place.lng}-${place.label}`} role="option">
                <button
                  className="w-full px-4 py-2.5 text-left text-sm text-[#1a3462] hover:bg-[#f4f7fb]"
                  onMouseDown={(event) => {
                    event.preventDefault()
                    handleSelect(place)
                  }}
                  type="button"
                >
                  {place.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-[#d5deed] bg-[#f4f7fb] shadow-[0_18px_40px_-36px_rgba(16,43,88,0.35)]">
        <div className="flex items-center justify-between border-b border-[#e2e8f3] px-4 py-3">
          <span className="text-sm font-semibold text-[#1a3462]">Mapa</span>
          <span className="text-xs text-[#6b7d9c]">
            {coordinates ? "Pin actualizado" : "Esperando ubicación"}
          </span>
        </div>
        <div className="relative h-72">
          {isGoogleMapsEnabled() ? (
            <EventLocationGoogleMap coordinates={coordinates} />
          ) : (
            <EventLocationLeafletMap coordinates={coordinates} />
          )}
          {!coordinates ? (
            <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-xl bg-white/92 px-3 py-2 text-xs text-[#50627f] shadow-sm backdrop-blur">
              Elegí una dirección de la lista para ver el pin en el mapa.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export async function resolveDraftCoordinates(
  location: string,
  coordinates: EventCoordinates | null
): Promise<EventCoordinates | null> {
  if (coordinates) {
    return coordinates
  }

  const geocoded = await geocodeLocation(location)

  if (!geocoded) {
    return null
  }

  return { lat: geocoded.lat, lng: geocoded.lng }
}
