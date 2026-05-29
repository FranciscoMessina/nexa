import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps"
import { useEffect, useMemo, useState } from "react"
import {
  googleMapsApiKey,
  googleMapsMapId,
} from "@/features/events/config/google-maps.config"
import { EVENT_MAP_CENTER } from "@/features/events/components/event-map.constants"
import { EventMapMarkerPopup } from "@/features/events/components/event-map-marker-popup"
import type { EventCardData } from "@/features/events/types/event.types"
import { resolveEventLabel } from "@/features/events/utils/event-label.utils"

type EventGoogleMapViewProps = {
  events: Array<EventCardData>
}

function FitGoogleMapToEvents({ events }: { events: Array<EventCardData> }) {
  const map = useMap()

  useEffect(() => {
    if (!map || events.length === 0) {
      return
    }

    const mapsApi = window.google?.maps

    if (!mapsApi) {
      return
    }

    if (events.length === 1) {
      const event = events[0]
      map.setCenter({ lat: event.coordinates.lat, lng: event.coordinates.lng })
      map.setZoom(14)
      return
    }

    const bounds = new mapsApi.LatLngBounds()

    for (const event of events) {
      bounds.extend({ lat: event.coordinates.lat, lng: event.coordinates.lng })
    }

    map.fitBounds(bounds, 56)
  }, [events, map])

  return null
}

export function EventGoogleMapView({ events }: EventGoogleMapViewProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId),
    [events, selectedEventId]
  )

  const defaultCenter = useMemo(
    () => ({ lat: EVENT_MAP_CENTER[0], lng: EVENT_MAP_CENTER[1] }),
    []
  )

  return (
    <APIProvider apiKey={googleMapsApiKey}>
      <Map
        className="h-full w-full rounded-[1.75rem]"
        defaultCenter={defaultCenter}
        defaultZoom={12}
        disableDefaultUI={false}
        fullscreenControl={false}
        gestureHandling="greedy"
        mapId={googleMapsMapId}
        mapTypeControl={false}
        streetViewControl={false}
      >
        <FitGoogleMapToEvents events={events} />

        {events.map((event) => {
          const label = resolveEventLabel(event)
          const isVerified = label.type === "verified"

          return (
            <AdvancedMarker
              key={event.id}
              onClick={() => {
                setSelectedEventId(event.id)
              }}
              position={{ lat: event.coordinates.lat, lng: event.coordinates.lng }}
              title={event.title}
            >
              <Pin
                background={isVerified ? "#10b981" : "#ff6b3d"}
                borderColor={isVerified ? "#047857" : "#c2410c"}
                glyphColor="#ffffff"
              />
            </AdvancedMarker>
          )
        })}

        {selectedEvent ? (
          <InfoWindow
            onCloseClick={() => {
              setSelectedEventId(null)
            }}
            position={{
              lat: selectedEvent.coordinates.lat,
              lng: selectedEvent.coordinates.lng,
            }}
          >
            <EventMapMarkerPopup event={selectedEvent} />
          </InfoWindow>
        ) : null}
      </Map>
    </APIProvider>
  )
}
