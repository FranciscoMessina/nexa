import { Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useRequireAuthentication } from "@/features/auth"
import { EventCard } from "@/features/events/components/event-card"
import { EventDatePicker } from "@/features/events/components/event-date-picker"
import { eventCategoryOptions } from "@/features/events/data/event-categories"
import { createMockEvent } from "@/features/events/data/mock-events"
import { getMyEventsCopy, getMyEventsForUser } from "@/features/events/data/my-events"
import { AppShell } from "@/features/home/components/app-shell"
import { getMockProfileForEmail } from "@/features/profiles/data/mock-profiles"
import { useAuth } from "@/shared/hooks/useAuth"

type EventDraftState = {
  title: string
  summary: string
  location: string
  date: string
  category: string
  imageSrc: string
  description: string
  priceAmount: string
  priceLabel: string
  registrationUrl: string
  requirements: string
  labelType: "verified" | "community"
  labelText: string
  gallery: string
}

type EventDraftErrorField =
  | "title"
  | "summary"
  | "location"
  | "date"
  | "category"
  | "imageSrc"
  | "description"
  | "priceAmount"
  | "priceLabel"
  | "gallery"
  | "requirements"

type EventDraftErrors = Partial<Record<EventDraftErrorField, string>>

const initialDraftState: EventDraftState = {
  title: "",
  summary: "",
  location: "",
  date: "",
  category: "",
  imageSrc: "",
  description: "",
  priceAmount: "",
  priceLabel: "",
  registrationUrl: "",
  requirements: "",
  labelType: "community",
  labelText: "Evento comunitario",
  gallery: "",
}

function splitGallery(value: string): Array<string> {
  return value
    .split(/\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(year, month, day, 12, 0, 0, 0)

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

function validateEventDraft(draft: EventDraftState): EventDraftErrors {
  const errors: EventDraftErrors = {}

  if (!draft.title.trim()) {
    errors.title = "Ingresá un título."
  }

  if (!draft.summary.trim()) {
    errors.summary = "Ingresá un resumen."
  }

  if (!draft.location.trim()) {
    errors.location = "Ingresá una ubicación."
  }

  if (!draft.date.trim()) {
    errors.date = "Seleccioná una fecha."
  } else if (!parseDateInput(draft.date)) {
    errors.date = "Usá el formato dd/mm/aaaa."
  }

  if (!draft.category.trim()) {
    errors.category = "Seleccioná una categoría."
  }

  if (!draft.imageSrc.trim()) {
    errors.imageSrc = "Pegá una URL de imagen principal."
  }

  if (!draft.description.trim()) {
    errors.description = "Ingresá una descripción."
  }

  if (!draft.priceAmount.trim()) {
    errors.priceAmount = "Ingresá un precio."
  } else if (Number.isNaN(Number(draft.priceAmount))) {
    errors.priceAmount = "El precio debe ser un número."
  }

  if (!draft.priceLabel.trim()) {
    errors.priceLabel = "Ingresá una etiqueta de precio."
  }

  if (!draft.gallery.trim()) {
    errors.gallery = "Pegá al menos una URL de imagen."
  } else if (splitGallery(draft.gallery).length === 0) {
    errors.gallery = "Pegá al menos una URL de imagen válida."
  }


  return errors
}

type EventPublishModalProps = {
  draft: EventDraftState
  createdEventId: string | null
  errors: EventDraftErrors
  isOpen: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onDraftChange: <TKey extends keyof EventDraftState>(
    key: TKey,
    value: EventDraftState[TKey]
  ) => void
}

function EventPublishModal({
  draft,
  createdEventId,
  errors,
  isOpen,
  onClose,
  onSubmit,
  onDraftChange,
}: EventPublishModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="presentation">
      <button
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />

      <section
        aria-labelledby="publish-event-title"
        aria-modal="true"
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[#dce5f2] bg-white shadow-[0_30px_120px_-50px_rgba(10,37,88,0.5)]"
        role="dialog"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#e8edf5] px-5 py-4 sm:px-6">
          <div>
            <h2 id="publish-event-title" className="text-xl font-bold text-[#0a2558]">
              Publicar evento
            </h2>
            <p className="mt-1 text-sm text-[#6b7d9c]">
              Cargá todos los datos del evento y se agregará enseguida al listado.
            </p>
          </div>

          <button
            className="rounded-full border border-[#d5deed] px-3 py-1.5 text-sm font-semibold text-[#1a3462] transition hover:bg-[#f4f7fb]"
            onClick={onClose}
            type="button"
          >
            Cerrar
          </button>
        </div>

        <div className="max-h-[calc(100svh-7rem)] overflow-y-auto p-5 sm:p-6">
          <form className="grid gap-4 md:grid-cols-2" noValidate onSubmit={onSubmit}>
            <label className="space-y-2 text-sm font-medium text-[#1a3462]">
              Título
              <input
                className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                onChange={(event) => {
                  onDraftChange("title", event.target.value)
                }}
                required
                value={draft.title}
              />
              {errors.title ? <span className="block text-xs font-normal text-rose-600">{errors.title}</span> : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-[#1a3462]">
              Categoría
              <select
                className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                onChange={(event) => {
                  onDraftChange("category", event.target.value)
                }}
                required
                value={draft.category}
              >
                <option value="">Seleccioná una categoría</option>
                {eventCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category ? (
                <span className="block text-xs font-normal text-rose-600">{errors.category}</span>
              ) : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-[#1a3462] md:col-span-2">
              Resumen
              <textarea
                className="min-h-24 w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                onChange={(event) => {
                  onDraftChange("summary", event.target.value)
                }}
                required
                value={draft.summary}
              />
              {errors.summary ? (
                <span className="block text-xs font-normal text-rose-600">{errors.summary}</span>
              ) : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-[#1a3462] md:col-span-2">
              Ubicación
              <input
                className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                onChange={(event) => {
                  onDraftChange("location", event.target.value)
                }}
                required
                value={draft.location}
              />
              {errors.location ? (
                <span className="block text-xs font-normal text-rose-600">{errors.location}</span>
              ) : null}
            </label>

            <div className="space-y-2 text-sm font-medium text-[#1a3462]">
              <EventDatePicker
                emptyValue=""
                label="Fecha"
                error={errors.date}
                onChange={(value) => {
                  onDraftChange("date", value)
                }}
                placeholder="dd/mm/aaaa"
                testId="event-date-input"
                value={draft.date}
              />
            </div>

            <label className="space-y-2 text-sm font-medium text-[#1a3462]">
              Tipo de evento
              <select
                className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                onChange={(event) => {
                  const nextType = event.target.value === "verified" ? "verified" : "community"
                  onDraftChange("labelType", nextType)
                  onDraftChange(
                    "labelText",
                    nextType === "verified" ? "Evento verificado" : "Evento comunitario"
                  )
                }}
                value={draft.labelType}
              >
                <option value="community">Comunitario</option>
                <option value="verified">Verificado</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-[#1a3462]">
              Imagen principal
              <input
                className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                onChange={(event) => {
                  onDraftChange("imageSrc", event.target.value)
                }}
                required
                value={draft.imageSrc}
              />
              {errors.imageSrc ? (
                <span className="block text-xs font-normal text-rose-600">{errors.imageSrc}</span>
              ) : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-[#1a3462] md:col-span-2">
              Descripción
              <textarea
                className="min-h-28 w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                onChange={(event) => {
                  onDraftChange("description", event.target.value)
                }}
                required
                value={draft.description}
              />
              {errors.description ? (
                <span className="block text-xs font-normal text-rose-600">{errors.description}</span>
              ) : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-[#1a3462]">
              Precio
              <input
                className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                inputMode="numeric"
                onChange={(event) => {
                  onDraftChange("priceAmount", event.target.value)
                }}
                required
                value={draft.priceAmount}
              />
              {errors.priceAmount ? (
                <span className="block text-xs font-normal text-rose-600">{errors.priceAmount}</span>
              ) : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-[#1a3462]">
              Etiqueta de precio
              <input
                className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                onChange={(event) => {
                  onDraftChange("priceLabel", event.target.value)
                }}
                required
                value={draft.priceLabel}
              />
              {errors.priceLabel ? (
                <span className="block text-xs font-normal text-rose-600">{errors.priceLabel}</span>
              ) : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-[#1a3462] md:col-span-2">
              Galería de imágenes
              <textarea
                className="min-h-24 w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                onChange={(event) => {
                  onDraftChange("gallery", event.target.value)
                }}
                placeholder="Pegá URLs separadas por coma o salto de línea"
                required
                value={draft.gallery}
              />
              {errors.gallery ? (
                <span className="block text-xs font-normal text-rose-600">{errors.gallery}</span>
              ) : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-[#1a3462] md:col-span-2">
              Requisitos
              <textarea
                className="min-h-24 w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                onChange={(event) => {
                  onDraftChange("requirements", event.target.value)
                }}
                value={draft.requirements}
              />
              {errors.requirements ? (
                <span className="block text-xs font-normal text-rose-600">{errors.requirements}</span>
              ) : null}
            </label>

            <label className="space-y-2 text-sm font-medium text-[#1a3462] md:col-span-2">
              URL de registro
              <input
                className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                onChange={(event) => {
                  onDraftChange("registrationUrl", event.target.value)
                }}
                value={draft.registrationUrl}
              />
            </label>

            <div className="md:col-span-2 flex flex-wrap items-center gap-3 border-t border-[#edf2f8] pt-2">
              <button
                className="inline-flex rounded-xl bg-[#6d5ae6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f4ad4]"
                type="submit"
              >
                Publicar evento
              </button>

              <button
                className="rounded-xl border border-[#d5deed] px-5 py-2.5 text-sm font-semibold text-[#1a3462] transition hover:bg-[#f4f7fb]"
                onClick={onClose}
                type="button"
              >
                Cancelar
              </button>

              {createdEventId ? (
                <Link
                  className="text-sm font-semibold text-[#5b4bb7] hover:text-[#3f3485]"
                  params={{ eventId: createdEventId }}
                  to="/events/$eventId"
                >
                  Abrir último evento creado
                </Link>
              ) : null}
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export function MyEventsPage() {
  const { user, currentUserRole } = useAuth()
  const { isChecking, isAllowed } = useRequireAuthentication({
    allowedRoles: ["asistente", "organizador", "emprendedor"],
  })
  const [draft, setDraft] = useState<EventDraftState>(initialDraftState)
  const [createdEventId, setCreatedEventId] = useState<string | null>(null)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [draftErrors, setDraftErrors] = useState<EventDraftErrors>({})

  const profileId = user ? getMockProfileForEmail(user.email)?.id : undefined

  const events = getMyEventsForUser(profileId, currentUserRole)

  const copy = currentUserRole ? getMyEventsCopy(currentUserRole) : getMyEventsCopy("asistente")

  const handleDraftChange = <TKey extends keyof EventDraftState>(
    key: TKey,
    value: EventDraftState[TKey]
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))

    setDraftErrors((currentErrors) => {
      if (!(key in currentErrors)) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[key as EventDraftErrorField]

      return nextErrors
    })
  }

  const handleCreateEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (currentUserRole !== "organizador" || !user) {
      return
    }

    const organizerProfile = getMockProfileForEmail(user.email)

    if (!organizerProfile) {
      return
    }

    const errors = validateEventDraft(draft)

    if (Object.keys(errors).length > 0) {
      setDraftErrors(errors)
      return
    }

    const priceAmount = Number(draft.priceAmount)
    const gallery = splitGallery(draft.gallery)
    const parsedDate = parseDateInput(draft.date)

    if (
      !draft.title.trim() ||
      !draft.summary.trim() ||
      !draft.location.trim() ||
      !draft.date ||
      !draft.category.trim() ||
      !draft.imageSrc.trim() ||
      !draft.description.trim() ||
      !draft.priceLabel.trim() ||
      Number.isNaN(priceAmount) ||
      !parsedDate ||
      gallery.length === 0
    ) {
      return
    }

    const createdEvent = createMockEvent({
      organizer: {
        profileId: organizerProfile.id,
        name: organizerProfile.displayName,
        avatarUrl: organizerProfile.avatarUrl,
        verified: true,
        contactEmail: user.email,
      },
      label: {
        type: draft.labelType,
        text: draft.labelText.trim() || (draft.labelType === "verified" ? "Evento verificado" : "Evento comunitario"),
      },
      title: draft.title,
      summary: draft.summary,
      location: draft.location,
      date: parsedDate,
      category: draft.category,
      image: {
        src: draft.imageSrc,
      },
      ctaText: "Ver más detalle",
      ctaHref: `/events/${createdEventId ?? ""}`,
      description: draft.description,
      price: {
        amount: priceAmount,
        currency: "ARS",
        label: draft.priceLabel,
      },
      gallery,
      registrationUrl: draft.registrationUrl.trim() || undefined,
      requirements: draft.requirements,
    })

    setCreatedEventId(createdEvent.id)
    setDraft(initialDraftState)
    setDraftErrors({})
    setIsPublishModalOpen(false)
  }

  if (isChecking) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#f4f6fa] p-6">
        <p className="text-[#1a3462]">Cargando tus eventos...</p>
      </main>
    )
  }

  if (!isAllowed) {
    return null
  }

  return (
    <AppShell>
      <div className="space-y-6" data-testid="my-events-page">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2558] lg:text-4xl">Mis eventos</h1>
          <p className="mt-2 text-base text-[#6b7d9c]">{copy.subtitle}</p>
        </div>

        {currentUserRole === "organizador" ? (
          <button
            className="inline-flex rounded-xl bg-[#6d5ae6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f4ad4]"
            onClick={() => {
              setIsPublishModalOpen(true)
            }}
            type="button"
          >
            Publicar evento
          </button>
        ) : null}

        <EventPublishModal
          createdEventId={createdEventId}
          draft={draft}
          errors={draftErrors}
          isOpen={isPublishModalOpen}
          onClose={() => {
            setIsPublishModalOpen(false)
            setDraftErrors({})
            setDraft(initialDraftState)
            setCreatedEventId(null)
          }}
          onDraftChange={handleDraftChange}
          onSubmit={handleCreateEvent}
        />

        {events.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed border-[#d5deed] bg-white px-6 py-16 text-center"
            data-testid="my-events-empty"
          >
            <p className="text-lg font-semibold text-[#1a3462]">{copy.emptyTitle}</p>
            <p className="mt-2 text-sm text-[#6b7d9c]">{copy.emptyDescription}</p>
            {currentUserRole === "asistente" ? (
              <Link
                className="mt-6 inline-flex rounded-xl bg-[#6d5ae6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f4ad4]"
                to="/"
              >
                Explorar eventos
              </Link>
            ) : null}
          </div>
        ) : (
          <div
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            data-testid="my-events-grid"
          >
            {events.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
