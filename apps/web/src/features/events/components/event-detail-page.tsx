import {
  IconArrowLeft,
  IconBrandWhatsapp,
  IconBrandX,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
  IconExternalLink,
  IconLink,
  IconMapPin,
  IconPencil,
  IconPhoto,
  IconShare,
  IconShieldCheck,
  IconTag,
  IconTrash,
  IconUserCheck,
  IconUserMinus,
  IconUsers,
} from "@tabler/icons-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { useRequireAuthentication } from "@/features/auth"
import {
  useAttendanceStateQuery,
  useDeleteEventMutation,
  useEventQuery,
  useToggleAttendanceMutation,
} from "@/features/events/hooks/events-queries"
import { canUserManageEvent } from "@/features/events/utils/event-item.utils"
import { resolveEventLabel } from "@/features/events/utils/event-label.utils"
import { AppShell } from "@/features/home/components/app-shell"
import { EventProfileCard } from "@/features/profiles/components/event-profile-card"
import { ProfileAvatar } from "@/features/profiles/components/profile-avatar"
import { useProfileQuery, useProfilesByIdsQuery } from "@/features/profiles/hooks/profiles-queries"
import { EventAttendanceSidebarSkeleton } from "@/shared/components/skeletons/event-attendance-sidebar-skeleton"
import { EventDetailSkeleton } from "@/shared/components/skeletons/event-detail-skeleton"
import { EventProfileCardSkeleton } from "@/shared/components/skeletons/event-profile-card-skeleton"
import { useAuth } from "@/shared/hooks/useAuth"

type EventDetailPageProps = {
  eventId: string
}

type EventBadgeTone = "verified" | "community"

function formatDetailDate(date: Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

function splitParagraphs(text: string): Array<string> {
  return text
    .split(/(?<=\.)\s+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function splitRequirements(text: string): Array<string> {
  return text
    .split(/\n+|;\s+|\.\s+(?=[A-ZÁÉÍÓÚÑ])/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function getMapUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

function getShareUrl(): string {
  if (typeof window === "undefined") {
    return ""
  }

  return window.location.href
}

function GalleryImage({ alt, src }: { alt: string; src: string }) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#fff5ef] to-[#f0f4ff] text-[#8a9bb8]">
        <IconPhoto size={34} stroke={1.5} />
      </div>
    )
  }

  return (
    <img
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
      onError={() => {
        setHasError(true)
      }}
      src={src}
    />
  )
}

function EventToneBadge({ tone }: { tone: EventBadgeTone }) {
  const config = {
    verified: {
      label: "Evento verificado",
      icon: IconShieldCheck,
      className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    },
    community: {
      label: "Evento comunitario",
      icon: IconUsers,
      className: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    },
  } as const

  const { label, icon: Icon, className } = config[tone]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
        className
      )}
    >
      <Icon size={16} stroke={2} />
      {label}
    </span>
  )
}

export function EventDetailPage({ eventId }: EventDetailPageProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isChecking, isAllowed } = useRequireAuthentication({
    allowedRoles: ["emprendedor", "asistente", "organizador"],
  })
  const { data: event, isLoading: isEventLoading } = useEventQuery(eventId)
  const { data: attendanceState, isResolving: isAttendanceResolving } =
    useAttendanceStateQuery(eventId)
  const toggleAttendance = useToggleAttendanceMutation(eventId)
  const deleteEventMutation = useDeleteEventMutation()
  const ventureIds = event?.participatingVentures?.map((venture) => venture.profileId) ?? []
  const { data: organizerProfile, isResolving: isOrganizerResolving } = useProfileQuery(
    event?.organizer.profileId
  )
  const { data: participatingProfiles = [], isResolving: isVenturesResolving } =
    useProfilesByIdsQuery(ventureIds)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [linkCopied, setLinkCopied] = useState(false)

  const attendanceCount = attendanceState?.attendanceCount ?? 0
  const attending = attendanceState?.isAttending ?? false

  if (!isChecking && !isAllowed) {
    return null
  }

  if (isChecking || isEventLoading) {
    return (
      <AppShell>
        <EventDetailSkeleton />
      </AppShell>
    )
  }

  if (!event) {
    return (
      <AppShell>
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b4bb7] transition hover:text-[#3f3485]"
            to="/"
          >
            <IconArrowLeft size={16} stroke={2} />
            Volver al muro de eventos
          </Link>

          <div className="rounded-[2rem] border border-[#e8edf5] bg-white p-8 shadow-[0_16px_50px_-42px_rgba(12,35,75,0.35)]">
            <h1 className="text-3xl font-bold text-[#1e1b4b]">Evento no encontrado</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#64748b]">
              El evento solicitado no existe o ya no está disponible en este momento.
            </p>
          </div>
        </div>
      </AppShell>
    )
  }

  const eventLabel = resolveEventLabel(event)
  const galleryImages = event.gallery.slice(0, 5)
  const activeImage = galleryImages[activeImageIndex] ?? event.image.src
  const shareUrl = getShareUrl()
  const mapUrl = getMapUrl(event.coordinates.lat, event.coordinates.lng)
  const canManageEvent = canUserManageEvent(event, user?.id)
  const isOwnEvent = user?.id === event.organizer.profileId
  const attendanceLabel =
    attendanceCount === 1
      ? "1 persona confirmó que va a asistir"
      : `${attendanceCount} personas confirmaron que van a asistir`
  const descriptionParagraphs = splitParagraphs(event.description)
  const requirementItems = splitRequirements(event.requirements)
  const goToImage = (nextIndex: number) => {
    if (galleryImages.length === 0) {
      return
    }

    const boundedIndex = (nextIndex + galleryImages.length) % galleryImages.length
    setActiveImageIndex(boundedIndex)
  }

  const handleShare = async (channel: "whatsapp" | "x" | "copy") => {
    if (channel === "copy") {
      if (!shareUrl || typeof navigator === "undefined") {
        return
      }

      await navigator.clipboard.writeText(shareUrl)
      setLinkCopied(true)
      return
    }

    const text = encodeURIComponent(`${event.title} - ${shareUrl}`)
    const url =
      channel === "whatsapp"
        ? `https://wa.me/?text=${text}`
        : `https://twitter.com/intent/tweet?text=${text}`

    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b4bb7] transition hover:text-[#3f3485]"
          to="/"
        >
          <IconArrowLeft size={16} stroke={2} />
          Volver al muro de eventos
        </Link>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[2rem] border border-[#e8edf5] bg-white shadow-[0_18px_60px_-40px_rgba(16,43,88,0.28)]">
              <div className="relative aspect-video bg-[#e8edf5]">
                <GalleryImage alt={event.image.alt} src={activeImage} />

                {galleryImages.length > 1 ? (
                  <>
                    <button
                      className="absolute top-1/2 left-4 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#102b58] shadow-lg transition hover:scale-105 hover:bg-white"
                      data-testid="event-gallery-prev"
                      onClick={() => {
                        goToImage(activeImageIndex - 1)
                      }}
                      type="button"
                    >
                      <IconChevronLeft size={20} stroke={2.2} />
                    </button>

                    <button
                      className="absolute top-1/2 right-4 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#102b58] shadow-lg transition hover:scale-105 hover:bg-white"
                      data-testid="event-gallery-next"
                      onClick={() => {
                        goToImage(activeImageIndex + 1)
                      }}
                      type="button"
                    >
                      <IconChevronRight size={20} stroke={2.2} />
                    </button>
                  </>
                ) : null}
              </div>

              <div className="space-y-4 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {galleryImages.map((image, index) => (
                      <button
                        className={cn(
                          "h-2.5 rounded-full transition-all",
                          index === activeImageIndex
                            ? "w-8 bg-[#f97316]"
                            : "w-2.5 bg-[#d7deea] hover:bg-[#b9c4d6]"
                        )}
                        aria-label={`Ver imagen ${index + 1}`}
                        key={image}
                        onClick={() => {
                          setActiveImageIndex(index)
                        }}
                        type="button"
                      />
                    ))}
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a9bb8]">
                    {activeImageIndex + 1} / {galleryImages.length}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {galleryImages.map((image, index) => (
                    <button
                      className={cn(
                        "group overflow-hidden rounded-2xl border transition",
                        index === activeImageIndex
                          ? "border-[#f97316] ring-2 ring-[#f97316]/20"
                          : "border-[#e8edf5] hover:border-[#cfd9ea]"
                      )}
                      key={image}
                      onClick={() => {
                        setActiveImageIndex(index)
                      }}
                      type="button"
                    >
                      <div className="aspect-4/3 bg-[#eef3fb]">
                        <img
                          alt={`${event.title} - imagen ${index + 1}`}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          src={image}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6 rounded-[2rem] border border-[#e8edf5] bg-white p-6 shadow-[0_18px_60px_-44px_rgba(16,43,88,0.24)] sm:p-8">
              <EventToneBadge tone={eventLabel.type} />

              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-[#1e1b4b] sm:text-4xl">
                    {event.title}
                  </h1>
                  <p className="mt-3 text-base leading-7 text-[#51617d]">{event.summary}</p>
                </div>

                <div className="grid gap-3 text-sm text-[#4c5d77] sm:grid-cols-2">
                  <a
                    className="inline-flex items-start gap-2 rounded-2xl border border-[#edf2f8] bg-[#f9fbff] p-4 transition hover:border-[#d6e0ee] hover:bg-white"
                    href={mapUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <IconMapPin className="mt-0.5 shrink-0 text-[#8a9bb8]" size={18} stroke={1.8} />
                    <span>
                      <span className="block font-semibold text-[#1e1b4b]">Ubicación</span>
                      <span className="block">{event.location}</span>
                      <span className="mt-1 inline-flex items-center gap-1 font-semibold text-[#f97316]">
                        Ver en mapa <IconExternalLink size={14} stroke={2} />
                      </span>
                    </span>
                  </a>

                  <div className="inline-flex items-start gap-2 rounded-2xl border border-[#edf2f8] bg-[#f9fbff] p-4">
                    <IconCalendar className="mt-0.5 shrink-0 text-[#8a9bb8]" size={18} stroke={1.8} />
                    <span>
                      <span className="block font-semibold text-[#1e1b4b]">Fecha y hora</span>
                      <span className="block">{formatDetailDate(event.date)} hs</span>
                    </span>
                  </div>

                  <div className="inline-flex items-start gap-2 rounded-2xl border border-[#edf2f8] bg-[#f9fbff] p-4 sm:col-span-2">
                    <IconTag className="mt-0.5 shrink-0 text-[#8a9bb8]" size={18} stroke={1.8} />
                    <span>
                      <span className="block font-semibold text-[#1e1b4b]">Categoría</span>
                      <span className="block">{event.category}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#1e1b4b]">Acerca del evento</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-[#51617d]">
                  {descriptionParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#1e1b4b]">Requisitos e información</h2>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[#51617d]">
                  {requirementItems.map((requirement) => (
                    <li className="flex items-start gap-3" key={requirement}>
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#f97316]" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#1e1b4b]">Organizador</h2>

                <div className="mt-4">
                  {isOrganizerResolving ? (
                    <EventProfileCardSkeleton testId="event-organizer-profile-card-skeleton" />
                  ) : organizerProfile ? (
                    <EventProfileCard
                      profile={organizerProfile}
                      subtitle={event.organizer.contactEmail}
                      testId="event-organizer-profile-card"
                    />
                  ) : (
                    <div className="rounded-[1.75rem] border border-[#e8edf5] bg-[#fbfcff] p-4 sm:p-5">
                      <div className="flex items-center gap-4">
                        <ProfileAvatar
                          alt={event.organizer.name}
                          size="sm"
                          src={event.organizer.avatarUrl}
                        />
                        <div>
                          <h3 className="text-base font-bold text-[#1e1b4b]">{event.organizer.name}</h3>
                          <a
                            className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#5b4bb7]"
                            href={`mailto:${event.organizer.contactEmail}`}
                          >
                            <IconLink size={15} stroke={1.9} />
                            {event.organizer.contactEmail}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {ventureIds.length > 0 ? (
                <div>
                  <h2 className="text-xl font-bold text-[#1e1b4b]">Emprendimientos participantes</h2>
                  <div className="mt-4 space-y-3">
                    {isVenturesResolving
                      ? ventureIds.map((ventureId) => (
                          <EventProfileCardSkeleton
                            key={ventureId}
                            testId={`event-venture-profile-skeleton-${ventureId}`}
                          />
                        ))
                      : participatingProfiles.map((ventureProfile) => (
                          <EventProfileCard
                            key={ventureProfile.id}
                            profile={ventureProfile}
                            testId={`event-venture-profile-${ventureProfile.id}`}
                          />
                        ))}
                  </div>
                </div>
              ) : null}
            </section>
          </div>

          <aside className="xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-[2rem] border border-[#e8edf5] bg-white p-5 shadow-[0_18px_60px_-44px_rgba(16,43,88,0.3)]">
              <div className="space-y-4">
                {isAttendanceResolving ? (
                  <EventAttendanceSidebarSkeleton
                    showAttendAction={!isOwnEvent && Boolean(user)}
                  />
                ) : (
                  <>
                    <div
                      className="rounded-2xl bg-[#f9fbff] p-4 text-sm text-[#51617d]"
                      data-testid="event-attendance-count"
                    >
                      <div className="flex items-center gap-2 font-semibold text-[#1e1b4b]">
                        <IconUsers size={18} stroke={1.9} />
                        {attendanceLabel}
                      </div>
                    </div>

                    {!isOwnEvent && user ? (
                      attending ? (
                        <button
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#d5deed] bg-white px-5 py-3.5 text-sm font-semibold text-[#1a3462] transition hover:-translate-y-0.5 hover:bg-[#f4f7fb]"
                          data-testid="event-decline-attendance-button"
                          onClick={() => {
                            void toggleAttendance.mutateAsync()
                          }}
                          type="button"
                        >
                          <IconUserMinus size={16} stroke={2} />
                          No asistir al evento
                        </button>
                      ) : (
                        <button
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f97316] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_-18px_rgba(249,115,22,0.75)] transition hover:-translate-y-0.5 hover:bg-[#ea680f]"
                          data-testid="event-attend-button"
                          onClick={() => {
                            void toggleAttendance.mutateAsync()
                          }}
                          type="button"
                        >
                          <IconUserCheck size={16} stroke={2} />
                          Asistir al evento
                        </button>
                      )
                    ) : null}

                    {attending ? (
                      <p className="text-center text-xs text-[#6b7d9c]">
                        Este evento aparece en{" "}
                        <Link
                          className="font-semibold text-[#5b4bb7] hover:text-[#3f3485]"
                          to="/mis-eventos"
                        >
                          Mis eventos
                        </Link>
                        .
                      </p>
                    ) : null}
                  </>
                )}

                {canManageEvent ? (
                  <div className="space-y-3 border-t border-[#edf2f8] pt-4">
                    <p className="text-sm font-semibold text-[#1e1b4b]">Tu publicación</p>
                    <Link
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#d5deed] bg-white px-5 py-3.5 text-sm font-semibold text-[#1a3462] transition hover:bg-[#f4f7fb]"
                      data-testid="event-edit-button"
                      params={{ eventId: event.id }}
                      to="/events/$eventId/editar"
                    >
                      <IconPencil size={16} stroke={2} />
                      Editar evento
                    </Link>
                    <button
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                      data-testid="event-delete-button"
                      onClick={() => {
                        if (!user) {
                          return
                        }

                        const confirmed = window.confirm(
                          "¿Eliminar este evento? Se quitará del muro y de Mis eventos."
                        )

                        if (!confirmed) {
                          return
                        }

                        void deleteEventMutation.mutateAsync(event.id).then(() => {
                          void navigate({ to: "/mis-eventos" })
                        })
                      }}
                      type="button"
                    >
                      <IconTrash size={16} stroke={2} />
                      Eliminar evento
                    </button>
                  </div>
                ) : null}

                <div className="pt-2">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1e1b4b]">
                    <IconShare size={18} stroke={1.8} />
                    Compartir
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e8edf5] px-3 py-2.5 text-xs font-semibold text-[#1e1b4b] transition hover:border-[#c7d3e6] hover:bg-[#fafcff]"
                      onClick={() => {
                        void handleShare("whatsapp")
                      }}
                      type="button"
                    >
                      <IconBrandWhatsapp size={15} stroke={1.9} />
                      WhatsApp
                    </button>

                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e8edf5] px-3 py-2.5 text-xs font-semibold text-[#1e1b4b] transition hover:border-[#c7d3e6] hover:bg-[#fafcff]"
                      onClick={() => {
                        void handleShare("x")
                      }}
                      type="button"
                    >
                      <IconBrandX size={15} stroke={1.9} />
                      Twitter
                    </button>

                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e8edf5] px-3 py-2.5 text-xs font-semibold text-[#1e1b4b] transition hover:border-[#c7d3e6] hover:bg-[#fafcff]"
                      onClick={() => {
                        void handleShare("copy")
                      }}
                      type="button"
                    >
                      <IconCopy size={15} stroke={1.9} />
                      {linkCopied ? "Link copiado" : "Copiar link"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}