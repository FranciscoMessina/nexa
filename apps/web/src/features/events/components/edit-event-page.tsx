import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useRequireAuthentication } from "@/features/auth"
import { EventPublishForm } from "@/features/events/components/event-publish-form"
import { resolveDraftCoordinates } from "@/features/events/components/event-location-field"
import { useEventQuery, useUpdateEventMutation } from "@/features/events/hooks/events-queries"
import { canUserManageEvent } from "@/features/events/utils/event-item.utils"
import { AppShell } from "@/features/home/components/app-shell"
import { useOwnProfile } from "@/features/profiles/hooks/profiles-queries"
import { useAuth } from "@/shared/hooks/useAuth"
import { FormPageSkeleton } from "@/shared/components/skeletons/form-page-skeleton"
import {
  buildDraftFromEvent,
  validateEventDraft,
  parseDateInput,
  splitGallery,
  type EventDraftErrorField,
  type EventDraftErrors,
  type EventDraftState,
} from "@/features/events/utils/event-publish.utils"

type EditEventPageProps = {
  eventId: string
}

export function EditEventPage({ eventId }: EditEventPageProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isChecking, isAllowed } = useRequireAuthentication({
    allowedRoles: ["asistente", "organizador", "emprendedor"],
  })
  const { profile: organizerProfile, isResolving: isProfileResolving } = useOwnProfile()
  const { data: event, isLoading } = useEventQuery(eventId)
  const updateEventMutation = useUpdateEventMutation(eventId)
  const canEdit = event && organizerProfile && canUserManageEvent(event, organizerProfile.id)

  const [draft, setDraft] = useState<EventDraftState | null>(null)
  const [savedEventId, setSavedEventId] = useState<string | null>(null)
  const [draftErrors, setDraftErrors] = useState<EventDraftErrors>({})

  useEffect(() => {
    if (event) {
      setDraft(buildDraftFromEvent(event))
    }
  }, [event])

  const handleDraftChange = <TKey extends keyof EventDraftState>(
    key: TKey,
    value: EventDraftState[TKey]
  ) => {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft
      }

      return { ...currentDraft, [key]: value }
    })

    setDraftErrors((currentErrors) => {
      if (!(key in currentErrors)) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[key as EventDraftErrorField]

      return nextErrors
    })
  }

  const handleSaveEvent = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault()

    if (!user || !organizerProfile || !draft || !event) {
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

    const updated = await updateEventMutation.mutateAsync({
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
      image: { src: gallery[0] },
      description: draft.description,
      gallery,
      registrationUrl: draft.registrationUrl.trim() || undefined,
      requirements: draft.requirements,
      coordinates,
    })

    if (updated) {
      setSavedEventId(updated.id)
      setDraftErrors({})
    }
  }

  if (!isChecking && !isAllowed) {
    return null
  }

  if (isChecking || isLoading || isProfileResolving) {
    return (
      <AppShell>
        <FormPageSkeleton />
      </AppShell>
    )
  }

  if (!event || !organizerProfile || !canEdit || !draft) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#e8edf5] bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-[#0a2558]">No podés editar este evento</h1>
          <p className="mt-2 text-sm text-[#6b7d9c]">
            Solo el usuario que lo publicó puede modificarlo.
          </p>
          <Link
            className="mt-6 inline-flex text-sm font-semibold text-[#5b4bb7] hover:text-[#3f3485]"
            params={{ eventId }}
            to="/events/$eventId"
          >
            Volver al evento
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6" data-testid="edit-event-page">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2558] lg:text-4xl">Editar evento</h1>
          <p className="mt-2 text-base text-[#6b7d9c]">
            Actualizá los datos de tu publicación. Los cambios se ven en el muro y en Mis eventos.
          </p>
        </div>

        <EventPublishForm
          createdEventId={savedEventId}
          draft={draft}
          errors={draftErrors}
          onDraftChange={handleDraftChange}
          onSubmit={handleSaveEvent}
          submitLabel="Guardar cambios"
          successMessage="Cambios guardados"
          uploadOwnerId={eventId}
        />

        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex rounded-xl border border-[#d5deed] px-5 py-2.5 text-sm font-semibold text-[#1a3462] transition hover:bg-[#f4f7fb]"
            params={{ eventId }}
            to="/events/$eventId"
          >
            Cancelar
          </Link>
          {savedEventId ? (
            <button
              className="inline-flex rounded-xl bg-[#6d5ae6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f4ad4]"
              onClick={() => {
                void navigate({ to: "/events/$eventId", params: { eventId: savedEventId } })
              }}
              type="button"
            >
              Ir al evento
            </button>
          ) : null}
        </div>
      </div>
    </AppShell>
  )
}
