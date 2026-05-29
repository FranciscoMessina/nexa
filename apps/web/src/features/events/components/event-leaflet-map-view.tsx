import L from "leaflet"
import { useEffect } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import {
  EVENT_MAP_CENTER,
  EVENT_MAP_MARKER_COLORS,
  EVENT_MAP_TILE,
} from "@/features/events/components/event-map.constants"
import { EventMapMarkerPopup } from "@/features/events/components/event-map-marker-popup"
import type { EventCardData } from "@/features/events/types/event.types"
import { resolveEventLabel } from "@/features/events/utils/event-label.utils"
import "leaflet/dist/leaflet.css"
import "./event-map.css"

type EventLeafletMapViewProps = {
  events: Array<EventCardData>
}

function createEventMarkerIcon(isVerified: boolean) {
  const color = isVerified
    ? EVENT_MAP_MARKER_COLORS.verified
    : EVENT_MAP_MARKER_COLORS.community

  return L.divIcon({
    className: "nexa-map-marker",
    html: `<span class="nexa-map-marker__pin" style="--marker-color: ${color}"></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  })
}

function FitMapToEvents({ events }: { events: Array<EventCardData> }) {
  const map = useMap()

  useEffect(() => {
    if (events.length === 0) {
      return
    }

    if (events.length === 1) {
      const event = events[0]
      map.setView([event.coordinates.lat, event.coordinates.lng], 14, { animate: false })
      return
    }

    const bounds = L.latLngBounds(
      events.map((event) => [event.coordinates.lat, event.coordinates.lng] as [number, number])
    )

    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 14, animate: false })
  }, [events, map])

  return null
}

export function EventLeafletMapView({ events }: EventLeafletMapViewProps) {
  return (
    <MapContainer
      center={EVENT_MAP_CENTER}
      className="nexa-leaflet-map h-full w-full rounded-[1.75rem]"
      scrollWheelZoom
      zoom={12}
    >
      <TileLayer
        attribution={EVENT_MAP_TILE.attribution}
        maxZoom={EVENT_MAP_TILE.maxZoom}
        subdomains={EVENT_MAP_TILE.subdomains}
        url={EVENT_MAP_TILE.url}
      />

      <FitMapToEvents events={events} />

      {events.map((event) => {
        const label = resolveEventLabel(event)
        const isVerified = label.type === "verified"

        return (
          <Marker
            icon={createEventMarkerIcon(isVerified)}
            key={event.id}
            position={[event.coordinates.lat, event.coordinates.lng]}
          >
            <Popup className="nexa-map-popup" closeButton={false}>
              <div className="p-3">
                <EventMapMarkerPopup event={event} />
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
