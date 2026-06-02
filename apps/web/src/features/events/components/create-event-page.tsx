import { useState } from "react"
import type { FormEvent } from "react"
import { useRequireAuthentication } from "@/features/auth"
import { EventPublishForm } from "@/features/events/components/event-publish-form"
import { resolveDraftCoordinates } from "@/features/events/components/event-location-field"
import { useCreateEventMutation } from "@/features/events/hooks/events-queries"
import { AppShell } from "@/features/home/components/app-shell"
import { useOwnProfile } from "@/features/profiles/hooks/profiles-queries"
import { useAuth } from "@/shared/hooks/useAuth"
import {
  buildInitialEventDraft,
  parseDateInput,
  splitGallery,
  validateEventDraft,
  type EventDraftErrorField,
  type EventDraftErrors,
  type EventDraftState,
} from "@/features/events/utils/event-publish.utils"

export function CreateEventPage() {
  const { user, isAuthenticated } = useAuth()
  const { isChecking, isAllowed } = useRequireAuthentication({
    allowedRoles: ["asistente", "organizador", "emprendedor"],
  })
  const {
    profile: organizerProfile,
    isResolving: isProfileResolving,
    isResolved: isProfileResolved,
  } = useOwnProfile()
  const createEventMutation = useCreateEventMutation()
  const [draft, setDraft] = useState<EventDraftState>(() =>
    buildInitialEventDraft(
      organizerProfile?.validationStatus === "validated" ? "validated" : "pending",
      organizerProfile?.kind
    )
  )
  const [createdEventId, setCreatedEventId] = useState<string | null>(null)
  const [draftErrors, setDraftErrors] = useState<EventDraftErrors>({})
  const uploadOwnerId = user?.id ?? "draft"

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

  const handleCreateEvent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!user || !organizerProfile) {
      return
    }

    const gallery = splitGallery(draft.gallery)
    const parsedDate = parseDateInput(draft.date)
    const coordinates = await resolveDraftCoordinates(draft.location, draft.coordinates)
    const draftWithCoordinates = { ...draft, coordinates }
    const errors = validateEventDraft(draftWithCoordinates)

    if (Object.keys(errors).length > 0) {
      setDraftErrors(errors)
      return
    }

    if (
      !draft.title.trim() ||
      !draft.summary.trim() ||
      !draft.location.trim() ||
      !draft.date ||
      !draft.category.trim() ||
      !draft.description.trim() ||
      !parsedDate ||
      !coordinates ||
      gallery.length === 0
    ) {
      return
    }

    const communityOrganizer = organizerProfile.kind === "usuario"
    const verifiedOrganizer =
      !communityOrganizer && organizerProfile.validationStatus === "validated"

    const createdEvent = await createEventMutation.mutateAsync({
      organizer: {
        profileId: organizerProfile.id,
        name: organizerProfile.displayName,
        avatarUrl: organizerProfile.avatarUrl,
        verified: verifiedOrganizer,
        contactEmail: user.email,
      },
      label: communityOrganizer
        ? { type: "community", text: "Evento comunitario" }
        : verifiedOrganizer
          ? { type: "verified", text: "Evento verificado" }
          : {
              type: draft.labelType,
              text:
                draft.labelText.trim() ||
                (draft.labelType === "verified"
                  ? "Evento verificado"
                  : "Evento comunitario"),
            },
      title: draft.title,
      summary: draft.summary,
      location: draft.location,
      date: parsedDate,
      category: draft.category,
      image: {
        src: gallery[0],
      },
      description: draft.description,
      gallery,
      registrationUrl: draft.registrationUrl.trim() || undefined,
      requirements: draft.requirements,
      coordinates,
    })

    setCreatedEventId(createdEvent.id)
    setDraft(
      buildInitialEventDraft(
        organizerProfile.validationStatus === "validated" ? "validated" : "pending",
        organizerProfile.kind
      )
    )
    setDraftErrors({})
  }

  if (isChecking || isProfileResolving) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#faf7f2] p-6">
        <p className="text-[#1a3462]">Cargando...</p>
      </main>
    )
  }

  if (!isAllowed) {
    return null
  }

  if (isProfileResolved && !organizerProfile) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl space-y-6" data-testid="create-event-page">
          <div>
            <h1 className="text-3xl font-bold text-[#0a2558] lg:text-4xl">Crear evento</h1>
            <p className="mt-2 text-base text-[#6b7d9c]">
              Completá los datos y publicá tu evento. Aparecerá en el muro y en Mis eventos.
            </p>
          </div>
          <div className="rounded-2xl border border-dashed border-[#d5deed] bg-white px-6 py-10 text-center">
            <p className="text-sm text-[#6b7d9c]">
              {isAuthenticated
                ? "No pudimos cargar tu perfil. Intentá de nuevo en unos minutos."
                : "No encontramos tu perfil. Iniciá sesión para publicar eventos."}
            </p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!organizerProfile) {
    return null
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6" data-testid="create-event-page">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2558] lg:text-4xl">Crear evento</h1>
          <p className="mt-2 text-base text-[#6b7d9c]">
            Completá los datos y publicá tu evento. Aparecerá en el muro y en Mis eventos.
          </p>
        </div>

        <EventPublishForm
          createdEventId={createdEventId}
          draft={draft}
          errors={draftErrors}
          onDraftChange={handleDraftChange}
          onSubmit={handleCreateEvent}
          uploadOwnerId={uploadOwnerId}
        />
      </div>
    </AppShell>
  )
}
