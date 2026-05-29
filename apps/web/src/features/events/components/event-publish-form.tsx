import { Link } from "@tanstack/react-router"
import type { FormEvent } from "react"
import { EventDatePicker } from "@/features/events/components/event-date-picker"
import { EventLocationField } from "@/features/events/components/event-location-field"
import { eventCategoryOptions } from "@/features/events/data/event-categories"
import type { EventDraftErrors, EventDraftState } from "@/features/events/utils/event-publish.utils"

type EventPublishFormProps = {
  draft: EventDraftState
  createdEventId: string | null
  errors: EventDraftErrors
  submitLabel?: string
  successMessage?: string
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
  submitLabel = "Publicar evento",
  successMessage = "Evento publicado",
  onDraftChange,
  onSubmit,
}: EventPublishFormProps) {
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

      <div className="flex flex-wrap items-center gap-3 border-t border-[#edf2f8] pt-2 md:col-span-2">
        <button
          className="inline-flex rounded-xl bg-[#6d5ae6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f4ad4]"
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
