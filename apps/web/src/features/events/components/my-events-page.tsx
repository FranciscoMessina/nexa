import { useState, type FormEvent } from "react"
import { Link } from "@tanstack/react-router"
import { useRequireAuthentication } from "@/features/auth"
import { EventCard } from "@/features/events/components/event-card"
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
  imageAlt: string
  description: string
  priceAmount: string
  priceLabel: string
  registrationUrl: string
  requirements: string
  coordinatesLat: string
  coordinatesLng: string
  labelType: "verified" | "community"
  labelText: string
  gallery: string
}

const initialDraftState: EventDraftState = {
  title: "",
  summary: "",
  location: "",
  date: "",
  category: "",
  imageSrc: "",
  imageAlt: "",
  description: "",
  priceAmount: "",
  priceLabel: "",
  registrationUrl: "",
  requirements: "",
  coordinatesLat: "",
  coordinatesLng: "",
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

export function MyEventsPage() {
  const { user, currentUserRole } = useAuth()
  const { isChecking, isAllowed } = useRequireAuthentication({
    allowedRoles: ["asistente", "organizador", "emprendedor"],
  })
  const [draft, setDraft] = useState<EventDraftState>(initialDraftState)
  const [createdEventId, setCreatedEventId] = useState<string | null>(null)

  const profileId = user ? getMockProfileForEmail(user.email)?.id : undefined

  const events = getMyEventsForUser(profileId, currentUserRole)

  const copy = currentUserRole ? getMyEventsCopy(currentUserRole) : getMyEventsCopy("asistente")

  const handleDraftChange = <K extends keyof EventDraftState>(key: K, value: EventDraftState[K]) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
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

    const priceAmount = Number(draft.priceAmount)
    const coordinatesLat = Number(draft.coordinatesLat)
    const coordinatesLng = Number(draft.coordinatesLng)
    const gallery = splitGallery(draft.gallery)

    if (
      !draft.title.trim() ||
      !draft.summary.trim() ||
      !draft.location.trim() ||
      !draft.date ||
      !draft.category.trim() ||
      !draft.imageSrc.trim() ||
      !draft.imageAlt.trim() ||
      !draft.description.trim() ||
      !draft.priceLabel.trim() ||
      Number.isNaN(priceAmount) ||
      Number.isNaN(coordinatesLat) ||
      Number.isNaN(coordinatesLng) ||
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
      date: new Date(draft.date),
      category: draft.category,
      image: {
        src: draft.imageSrc,
        alt: draft.imageAlt,
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
      coordinates: {
        lat: coordinatesLat,
        lng: coordinatesLng,
      },
    })

    setCreatedEventId(createdEvent.id)
    setDraft(initialDraftState)
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
          <section className="rounded-2xl border border-[#dce5f2] bg-white p-5 shadow-[0_16px_48px_-42px_rgba(15,40,90,0.32)]">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#0a2558]">Publicar evento</h2>
              <p className="mt-1 text-sm text-[#6b7d9c]">
                Cargá todos los datos del evento. Se va a agregar enseguida a este listado.
              </p>
            </div>

            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreateEvent}>
              <label className="space-y-2 text-sm font-medium text-[#1a3462]">
                Título
                <input
                  className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  onChange={(event) => {
                    handleDraftChange("title", event.target.value)
                  }}
                  required
                  value={draft.title}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462]">
                Categoría
                <input
                  className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  onChange={(event) => {
                    handleDraftChange("category", event.target.value)
                  }}
                  required
                  value={draft.category}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462] md:col-span-2">
                Resumen
                <textarea
                  className="min-h-24 w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  onChange={(event) => {
                    handleDraftChange("summary", event.target.value)
                  }}
                  required
                  value={draft.summary}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462] md:col-span-2">
                Ubicación
                <input
                  className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  onChange={(event) => {
                    handleDraftChange("location", event.target.value)
                  }}
                  required
                  value={draft.location}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462]">
                Fecha y hora
                <input
                  className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  onChange={(event) => {
                    handleDraftChange("date", event.target.value)
                  }}
                  required
                  type="datetime-local"
                  value={draft.date}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462]">
                Tipo de evento
                <select
                  className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  onChange={(event) => {
                    const nextType = event.target.value === "verified" ? "verified" : "community"
                    handleDraftChange("labelType", nextType)
                    handleDraftChange(
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
                    handleDraftChange("imageSrc", event.target.value)
                  }}
                  required
                  value={draft.imageSrc}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462]">
                Texto alternativo
                <input
                  className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  onChange={(event) => {
                    handleDraftChange("imageAlt", event.target.value)
                  }}
                  required
                  value={draft.imageAlt}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462] md:col-span-2">
                Descripción
                <textarea
                  className="min-h-28 w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  onChange={(event) => {
                    handleDraftChange("description", event.target.value)
                  }}
                  required
                  value={draft.description}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462]">
                Precio
                <input
                  className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  inputMode="numeric"
                  onChange={(event) => {
                    handleDraftChange("priceAmount", event.target.value)
                  }}
                  required
                  value={draft.priceAmount}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462]">
                Etiqueta de precio
                <input
                  className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  onChange={(event) => {
                    handleDraftChange("priceLabel", event.target.value)
                  }}
                  required
                  value={draft.priceLabel}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462] md:col-span-2">
                Galería de imágenes
                <textarea
                  className="min-h-24 w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  onChange={(event) => {
                    handleDraftChange("gallery", event.target.value)
                  }}
                  placeholder="Pegá URLs separadas por coma o salto de línea"
                  required
                  value={draft.gallery}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462] md:col-span-2">
                Requisitos
                <textarea
                  className="min-h-24 w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  onChange={(event) => {
                    handleDraftChange("requirements", event.target.value)
                  }}
                  required
                  value={draft.requirements}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462]">
                Latitud
                <input
                  className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  inputMode="decimal"
                  onChange={(event) => {
                    handleDraftChange("coordinatesLat", event.target.value)
                  }}
                  required
                  value={draft.coordinatesLat}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462]">
                Longitud
                <input
                  className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  inputMode="decimal"
                  onChange={(event) => {
                    handleDraftChange("coordinatesLng", event.target.value)
                  }}
                  required
                  value={draft.coordinatesLng}
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-[#1a3462] md:col-span-2">
                URL de registro
                <input
                  className="w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
                  onChange={(event) => {
                    handleDraftChange("registrationUrl", event.target.value)
                  }}
                  value={draft.registrationUrl}
                />
              </label>

              <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                <button
                  className="inline-flex rounded-xl bg-[#6d5ae6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f4ad4]"
                  type="submit"
                >
                  Publicar evento
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
          </section>
        ) : null}

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
