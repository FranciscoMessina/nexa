import {
  IconArrowRight,
  IconCalendar,
  IconMapPin,
  IconSparkles,
  IconTag,
  IconUser,
} from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { EventBadge } from "@/features/events/components/event-badge"
import type { EventRecommendationPayload } from "@/features/events/api/event-recommendations.server"
import { toEventItem } from "@/features/events/utils/event-item.utils"

type EventRecommendationNoticeProps = {
  recommendation: EventRecommendationPayload
}

export function EventRecommendationNotice({ recommendation }: EventRecommendationNoticeProps) {
  const { event, reason } = recommendation
  const eventItem = toEventItem(event)
  const modalityLabel = event.location.trim() || "Modalidad a confirmar"

  return (
    <section
      aria-label="Recomendación de evento"
      className="overflow-hidden rounded-2xl border border-[#d9e2f0] bg-gradient-to-br from-[#f4f7fb] via-white to-[#faf7f2] shadow-[0_8px_30px_-20px_rgba(15,40,90,0.35)]"
      data-testid="event-recommendation-notice"
    >
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex shrink-0 rounded-xl bg-[#5b4bb7]/10 p-2 text-[#5b4bb7]">
            <IconSparkles size={20} stroke={2} />
          </span>
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-semibold tracking-wide text-[#5b4bb7] uppercase">
              Recomendado para vos
            </p>
            <p className="text-sm text-[#4a6086]">{reason}</p>
          </div>
        </div>

        <Link
          className="group block rounded-xl border border-[#e8edf5] bg-white p-4 transition hover:border-[#7c6fd4] hover:shadow-sm"
          data-testid={`event-recommendation-link-${event.id}`}
          params={{ eventId: event.id }}
          to="/events/$eventId"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-[#0a2558]">{event.title}</h2>
                <EventBadge kind={eventItem.kind} />
              </div>

              <ul className="space-y-2 text-sm text-[#5a6f8f]">
                <li className="flex items-start gap-2">
                  <IconCalendar className="mt-0.5 shrink-0 text-[#8a9bb8]" size={16} stroke={1.8} />
                  <span>{eventItem.dateLabel}</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconTag className="mt-0.5 shrink-0 text-[#8a9bb8]" size={16} stroke={1.8} />
                  <span>{eventItem.category}</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconMapPin className="mt-0.5 shrink-0 text-[#8a9bb8]" size={16} stroke={1.8} />
                  <span>{modalityLabel}</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconUser className="mt-0.5 shrink-0 text-[#8a9bb8]" size={16} stroke={1.8} />
                  <span>{event.organizer.name}</span>
                </li>
              </ul>
            </div>

            <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-[#7c6fd4] px-4 py-2.5 text-sm font-semibold text-[#5b4bb7] transition group-hover:bg-[#f5f3ff]">
              Ver evento
              <IconArrowRight size={16} stroke={2} />
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
