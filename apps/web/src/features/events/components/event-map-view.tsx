import { EventGoogleMapView } from "@/features/events/components/event-google-map-view"
import { EventLeafletMapView } from "@/features/events/components/event-leaflet-map-view"
import { isGoogleMapsEnabled } from "@/features/events/config/google-maps.config"
import type { EventCardData } from "@/features/events/types/event.types"

type EventMapViewProps = {
  events: Array<EventCardData>
}

export function EventMapView({ events }: EventMapViewProps) {
  if (isGoogleMapsEnabled()) {
    return <EventGoogleMapView events={events} />
  }

  return <EventLeafletMapView events={events} />
}

export function isUsingGoogleMaps(): boolean {
  return isGoogleMapsEnabled()
}
