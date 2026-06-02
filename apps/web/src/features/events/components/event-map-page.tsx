import { useEffect, useState } from "react"
import { useRequireAuthentication } from "@/features/auth"
import { EventFilters } from "@/features/events/components/event-filters"
import { EventMapView, isUsingGoogleMaps } from "@/features/events/components/event-map-view"
import { useFilteredEventCards } from "@/features/events/hooks/use-filtered-event-cards"
import { AppShell } from "@/features/home/components/app-shell"
import { MapAreaSkeleton } from "@/shared/components/skeletons/map-area-skeleton"

export function EventMapPage() {
  const { isChecking, isAllowed } = useRequireAuthentication({
    allowedRoles: ["emprendedor", "asistente", "organizador"],
  })
  const [isMapReady, setIsMapReady] = useState(false)
  const { events, isLoading } = useFilteredEventCards()
  const usesGoogleMaps = isUsingGoogleMaps()

  useEffect(() => {
    setIsMapReady(true)
  }, [])

  if (!isChecking && !isAllowed) {
    return null
  }

  return (
    <AppShell>
      <div className="space-y-6" data-testid="event-map-page">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2558] lg:text-4xl">Mapa de eventos</h1>
          <p className="mt-2 text-base text-[#6b7d9c]">
            Explorá los eventos en el mapa. Tocá un pin para ver el detalle.
          </p>
        </div>

        <EventFilters />

        {!usesGoogleMaps ? (
          <p
            className="rounded-xl border border-[#f3dfa8] bg-[#fff8dd] px-4 py-3 text-sm text-[#1a3462]"
            data-testid="map-fallback-notice"
          >
            Mapa alternativo activo. Para ver{" "}
            <span className="font-semibold">Google Maps</span>, agregá{" "}
            <code className="rounded bg-white/80 px-1.5 py-0.5 text-xs">VITE_GOOGLE_MAPS_API_KEY</code>{" "}
            en <code className="rounded bg-white/80 px-1.5 py-0.5 text-xs">apps/web/.env.local</code>.
          </p>
        ) : null}

        <div className="overflow-hidden rounded-[1.75rem] border border-[#e8edf5] bg-white shadow-[0_18px_60px_-44px_rgba(16,43,88,0.24)]">
          <div className="h-[min(70vh,640px)] w-full">
            {!isMapReady || isLoading ? (
              <MapAreaSkeleton />
            ) : events.length === 0 ? (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#6b7d9c]">
                No hay eventos con estos filtros. Probá ampliar la búsqueda.
              </div>
            ) : (
              <EventMapView events={events} />
            )}
          </div>
        </div>

        <p className="text-xs text-[#6b7d9c]">
          {usesGoogleMaps ? (
            <>
              Mapa por{" "}
              <a
                className="font-semibold text-[#5b4bb7] hover:text-[#3f3485]"
                href="https://www.google.com/maps"
                rel="noreferrer"
                target="_blank"
              >
                Google Maps
              </a>
              . Direcciones validadas al publicar (OpenStreetMap).
            </>
          ) : (
            <>
              Mapa estilo{" "}
              <a
                className="font-semibold text-[#5b4bb7] hover:text-[#3f3485]"
                href="https://carto.com/attributions"
                rel="noreferrer"
                target="_blank"
              >
                CARTO
              </a>{" "}
              · datos{" "}
              <a
                className="font-semibold text-[#5b4bb7] hover:text-[#3f3485]"
                href="https://www.openstreetmap.org/copyright"
                rel="noreferrer"
                target="_blank"
              >
                OpenStreetMap
              </a>
              . Direcciones validadas al publicar eventos.
            </>
          )}
        </p>
      </div>
    </AppShell>
  )
}
