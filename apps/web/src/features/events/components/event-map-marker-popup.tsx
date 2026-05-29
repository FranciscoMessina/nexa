import { Link } from "@tanstack/react-router"
import type { EventCardData } from "@/features/events/types/event.types"
import { resolveEventLabel } from "@/features/events/utils/event-label.utils"

function formatMapDate(date: Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

type EventMapMarkerPopupProps = {
  event: EventCardData
}

export function EventMapMarkerPopup({ event }: EventMapMarkerPopupProps) {
  const label = resolveEventLabel(event)
  const isVerified = label.type === "verified"

  return (
    <div className="space-y-2.5 p-1">
      <p
        className={`text-[10px] font-bold tracking-[0.14em] uppercase ${
          isVerified ? "text-emerald-600" : "text-[#e85a2f]"
        }`}
      >
        {label.text}
      </p>
      <p className="text-base font-bold leading-snug text-[#0a2558]">{event.title}</p>
      <p className="text-xs text-[#6b7d9c]">{formatMapDate(event.date)}</p>
      <p className="max-w-[220px] text-xs leading-relaxed text-[#6b7d9c]">{event.location}</p>
      <Link
        className="inline-flex rounded-lg bg-[#5b4bb7] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#4a3d9a]"
        params={{ eventId: event.id }}
        to="/events/$eventId"
      >
        Ver evento
      </Link>
    </div>
  )
}
