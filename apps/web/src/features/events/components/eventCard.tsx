import { IconArrowRight, IconCalendarEvent, IconMapPin, IconTag } from "@tabler/icons-react"
import { EventLabel } from "./eventLabel"
import type { EventCardData } from "../types"

type EventCardProps = {
  event: EventCardData
}

function formatEventDate(date: Date | string): string {
  const parsedDate = date instanceof Date ? date : new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return typeof date === "string" ? date : ""
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(parsedDate)
    .replace(",", "")
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#efe6ff] bg-white shadow-[0_22px_70px_-45px_rgba(34,24,71,0.48)]">
      <div className="relative aspect-16/10 overflow-hidden bg-[#111018] sm:aspect-video">
        <img
          alt={event.image.alt}
          className="h-full w-full object-cover transition duration-500 ease-out hover:scale-[1.03]"
          src={event.image.src}
        />

        <div className="absolute inset-0 bg-linear-to-t from-[#120d1d]/92 via-[#120d1d]/32 to-transparent" />

        <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
          <EventLabel {...event.label} />
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-5 px-5 py-5 sm:px-6 sm:py-6">
        <div className="space-y-2">
          <h2
            className="overflow-hidden text-2xl font-bold tracking-tight text-[#1c2341] sm:text-[1.7rem]"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            {event.title}
          </h2>
          <p
            className="max-w-2xl overflow-hidden text-sm leading-6 text-[#66738f] sm:text-[0.98rem]"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {event.summary}
          </p>
        </div>

        <div className="grid gap-3 text-sm text-[#44516f] sm:gap-4">
          <div className="flex items-start gap-3 rounded-2xl bg-[#f7f5ff] px-4 py-3">
            <IconMapPin className="mt-0.5 shrink-0 text-[#8151d6]" size={20} stroke={1.9} />
            <span>{event.location}</span>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-[#f7f5ff] px-4 py-3">
            <IconCalendarEvent className="mt-0.5 shrink-0 text-[#8151d6]" size={20} stroke={1.9} />
            <span>{formatEventDate(event.date)}</span>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-[#f7f5ff] px-4 py-3">
            <IconTag className="mt-0.5 shrink-0 text-[#8151d6]" size={20} stroke={1.9} />
            <span>{event.category}</span>
          </div>
        </div>

        <div className="mt-auto">
          <a
            className="inline-flex items-center gap-3 rounded-2xl border border-[#d8c8ff] px-5 py-3 font-semibold text-[#7446d0] transition hover:border-[#bda4ff] hover:bg-[#faf7ff]"
            href={event.ctaHref ?? "#"}
          >
            <span>{event.ctaText}</span>
            <IconArrowRight size={18} stroke={2} />
          </a>
        </div>
      </div>
    </article>
  )
}
