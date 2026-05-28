import { useState } from "react"
import type { FormEvent } from "react"
import { useRequireAuthentication } from "@/features/auth"
import { EventPublishForm } from "@/features/events/components/event-publish-form"
import { createMockEvent } from "@/features/events/data/mock-events"
import { AppShell } from "@/features/home/components/app-shell"
import { getMockProfileForEmail } from "@/features/profiles/data/mock-profiles"
import { useAuth } from "@/shared/hooks/useAuth"
import { isAssistantOrganizer } from "@/features/events/utils/event-label.utils"
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
  const { user } = useAuth()
  const { isChecking, isAllowed } = useRequireAuthentication({
    allowedRoles: ["asistente", "organizador", "emprendedor"],
  })
  const organizerProfile = user ? getMockProfileForEmail(user.email) : undefined
  const [draft, setDraft] = useState<EventDraftState>(() =>
    buildInitialEventDraft(organizerProfile?.validationStatus ?? "pending")
  )
  const [createdEventId, setCreatedEventId] = useState<string | null>(null)
  const [draftErrors, setDraftErrors] = useState<EventDraftErrors>({})

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

    if (!user || !organizerProfile) {
      return
    }

    const errors = validateEventDraft(draft)

    if (Object.keys(errors).length > 0) {
      setDraftErrors(errors)
      return
    }

    const gallery = splitGallery(draft.gallery)
    const parsedDate = parseDateInput(draft.date)

    if (
      !draft.title.trim() ||
      !draft.summary.trim() ||
      !draft.location.trim() ||
      !draft.date ||
      !draft.category.trim() ||
      !draft.description.trim() ||
      !parsedDate ||
      gallery.length === 0
    ) {
      return
    }

    const communityOrganizer = isAssistantOrganizer(organizerProfile.id)
    const verifiedOrganizer =
      !communityOrganizer && organizerProfile.validationStatus === "validated"

    const createdEvent = createMockEvent({
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
    })

    setCreatedEventId(createdEvent.id)
    setDraft(
      buildInitialEventDraft(
        organizerProfile.validationStatus,
        organizerProfile.kind,
      ),
    )
    setDraftErrors({})
  }

  if (isChecking) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#faf7f2] p-6">
        <p className="text-[#1a3462]">Cargando...</p>
      </main>
    )
  }

  if (!isAllowed) {
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

        {!organizerProfile ? (
          <div className="rounded-2xl border border-dashed border-[#d5deed] bg-white px-6 py-10 text-center">
            <p className="text-sm text-[#6b7d9c]">
              No encontramos tu perfil. Iniciá sesión con un usuario de demo para publicar eventos.
            </p>
          </div>
        ) : (
          <EventPublishForm
            createdEventId={createdEventId}
            draft={draft}
            errors={draftErrors}
            onDraftChange={handleDraftChange}
            onSubmit={handleCreateEvent}
          />
        )}
      </div>
    </AppShell>
  )
}
