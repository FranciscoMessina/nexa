import {
  IconArrowRight,
  IconCalendar,
  IconMapPin,
  IconTag,
} from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import type { EventItem } from "@/features/events/types/event.types"
import { EventBadge } from "@/features/events/components/event-badge"
import { EventCardImage } from "@/features/events/components/event-card-image"

type EventCardProps = {
  event: EventItem
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article
      className="flex flex-col overflow-hidden rounded-2xl border border-[#e8edf5] bg-white shadow-[0_8px_30px_-20px_rgba(15,40,90,0.35)]"
      data-testid={`event-card-${event.id}`}
    >
      <div className="relative">
        <EventCardImage alt={event.title} src={event.imageUrl} />
        <div className="absolute top-3 left-3 z-10">
          <EventBadge kind={event.kind} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-lg font-bold text-[#0a2558]">{event.title}</h3>

        <ul className="space-y-2 text-sm text-[#5a6f8f]">
          <li className="flex items-start gap-2">
            <IconMapPin className="mt-0.5 shrink-0 text-[#8a9bb8]" size={16} stroke={1.8} />
            <span>
              {event.venue}, {event.address}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <IconCalendar className="mt-0.5 shrink-0 text-[#8a9bb8]" size={16} stroke={1.8} />
            <span>{event.dateLabel}</span>
          </li>
          <li className="flex items-start gap-2">
            <IconTag className="mt-0.5 shrink-0 text-[#8a9bb8]" size={16} stroke={1.8} />
            <span>{event.category}</span>
          </li>
        </ul>

        <Link
          className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#7c6fd4] px-4 py-2.5 text-sm font-semibold text-[#5b4bb7] transition hover:bg-[#f5f3ff]"
          data-testid={`event-detail-button-${event.id}`}
          params={{ eventId: event.id }}
          to="/events/$eventId"
        >
          Ver más detalle
          <IconArrowRight size={16} stroke={2} />
        </Link>
      </div>
    </article>
  )
}
