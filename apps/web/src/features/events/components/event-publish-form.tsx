import { IconUpload } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { useRef } from "react"
import type { FormEvent } from "react"
import { EventDatePicker } from "@/features/events/components/event-date-picker"
import { splitGallery } from "@/features/events/utils/event-publish.utils"
import { useImageUpload } from "@/features/storage"
import { EventLocationField } from "@/features/events/components/event-location-field"
import { eventCategoryOptions } from "@/features/events/data/event-categories"
import type { EventDraftErrors, EventDraftState } from "@/features/events/utils/event-publish.utils"

type EventPublishFormProps = {
  draft: EventDraftState
  createdEventId: string | null
  errors: EventDraftErrors
  uploadOwnerId: string
  submitLabel?: string
  successMessage?: string
  isSubmitDisabled?: boolean
  onDraftChange: <TKey extends keyof EventDraftState>(
    key: TKey,
    value: EventDraftState[TKey]
  ) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function EventPublishForm({
  draft,
  createdEventId,
  errors,
  uploadOwnerId,
  submitLabel = "Publicar evento",
  successMessage = "Evento publicado",
  isSubmitDisabled = false,
  onDraftChange,
  onSubmit,
}: EventPublishFormProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const { isUploading, error: galleryUploadError, upload } = useImageUpload()

  async function handleGalleryFiles(fileList: FileList | null): Promise<void> {
    if (!fileList || fileList.length === 0) {
      return
    }

    const uploadedUrls: string[] = []

    for (const file of Array.from(fileList)) {
      const publicUrl = await upload(file, "event-gallery", uploadOwnerId)
      if (publicUrl) {
        uploadedUrls.push(publicUrl)
      }
    }

    if (uploadedUrls.length === 0) {
      return
    }

    const existing = splitGallery(draft.gallery)
    const merged = [...existing, ...uploadedUrls].join("\n")
    onDraftChange("gallery", merged)
  }
  return (
    <form
      className="grid gap-4 rounded-[2rem] border border-[#e8edf5] bg-white p-5 shadow-[0_18px_60px_-44px_rgba(16,43,88,0.24)] sm:p-8 md:grid-cols-2"
      data-testid="create-event-form"
      noValidate
      onSubmit={onSubmit}
    >
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

      <div className="md:col-span-2">
        <EventLocationField
          coordinates={draft.coordinates}
          error={errors.location}
          onChange={(location, coordinates) => {
            onDraftChange("location", location)
            onDraftChange("coordinates", coordinates)
          }}
          value={draft.location}
        />
      </div>

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

      <div className="space-y-2 text-sm font-medium text-[#1a3462] md:col-span-2">
        <span>Galería de imágenes</span>
        <input
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          className="sr-only"
          multiple
          onChange={(event) => {
            void handleGalleryFiles(event.target.files)
            event.target.value = ""
          }}
          ref={galleryInputRef}
          type="file"
        />
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-[#d5deed] bg-white px-4 py-2 text-sm font-semibold text-[#1a3462] disabled:opacity-60"
            disabled={isUploading}
            onClick={() => {
              galleryInputRef.current?.click()
            }}
            type="button"
          >
            <IconUpload size={18} stroke={1.8} />
            {isUploading ? "Subiendo…" : "Subir imágenes"}
          </button>
        </div>
        <textarea
          className="min-h-24 w-full rounded-xl border border-[#d5deed] px-4 py-2.5"
          onChange={(event) => {
            onDraftChange("gallery", event.target.value)
          }}
          placeholder="Pegá URLs separadas por coma o salto de línea"
          required
          value={draft.gallery}
        />
        <p className="text-xs font-normal text-[#8a9bb8]">
          Formatos permitidos: JPG, PNG. Máx. 5MB por imagen.
        </p>
        {galleryUploadError ? (
          <span className="block text-xs font-normal text-rose-600">{galleryUploadError}</span>
        ) : null}
        {errors.gallery ? (
          <span className="block text-xs font-normal text-rose-600">{errors.gallery}</span>
        ) : null}
      </div>

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

      <div className="flex flex-wrap items-center gap-3 border-t border-[#edf2f8] pt-2 md:col-span-2">
        <button
          className="inline-flex rounded-xl bg-[#6d5ae6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f4ad4] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitDisabled}
          type="submit"
        >
          {submitLabel}
        </button>

        {createdEventId ? (
          <>
            <span className="text-sm font-semibold text-emerald-700">{successMessage}</span>
            <Link
              className="text-sm font-semibold text-[#5b4bb7] hover:text-[#3f3485]"
              params={{ eventId: createdEventId }}
              to="/events/$eventId"
            >
              Ver evento
            </Link>
            <Link
              className="text-sm font-semibold text-[#5b4bb7] hover:text-[#3f3485]"
              to="/mis-eventos"
            >
              Ir a mis eventos
            </Link>
          </>
        ) : null}
      </div>
    </form>
  )
}
