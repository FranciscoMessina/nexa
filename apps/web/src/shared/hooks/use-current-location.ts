import { useEffect, useState } from "react"
import type { EventCoordinates } from "@/features/events/types/event.types"

type UseCurrentLocationResult = {
  coordinates: EventCoordinates | null
  isLoading: boolean
  isUnavailable: boolean
}

export function useCurrentLocation(enabled = true): UseCurrentLocationResult {
  const [coordinates, setCoordinates] = useState<EventCoordinates | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [isUnavailable, setIsUnavailable] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setCoordinates(null)
      setIsUnavailable(false)
      setIsLoading(false)
      return
    }

    if (!("geolocation" in navigator)) {
      setIsUnavailable(true)
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsLoading(false)
      },
      () => {
        setIsUnavailable(true)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }, [enabled])

  return {
    coordinates,
    isLoading,
    isUnavailable,
  }
}
