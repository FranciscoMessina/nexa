import { useEffect, useId, useRef, useState } from "react"
import type { EventCoordinates } from "@/features/events/types/event.types"
import {
  geocodeLocation,
  searchLocations,
  type GeocodedPlace,
} from "@/features/events/utils/geocoding.utils"

type EventLocationFieldProps = {
  value: string
  coordinates: EventCoordinates | null
  error?: string
  onChange: (location: string, coordinates: EventCoordinates | null) => void
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
