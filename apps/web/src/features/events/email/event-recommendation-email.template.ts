import type { EventCardData } from "../types/event.types"

export const EVENT_RECOMMENDATION_EMAIL_SUBJECT = "Tenemos un evento recomendado para vos"

type BuildEventRecommendationEmailInput = {
  recipientName: string
  event: EventCardData
  categoryLabel: string
  reason: string
  eventUrl: string
}

function formatEventDateTime(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0")
  const month = date.toLocaleDateString("es-AR", { month: "long" })
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  return `${day} de ${month} de ${year}, ${hours}:${minutes} hs`
}

function resolveModalityLabel(location: string): string {
  const trimmed = location.trim()
  return trimmed.length > 0 ? trimmed : "Modalidad a confirmar"
}

export function buildEventRecommendationEmail(
  input: BuildEventRecommendationEmailInput
): { subject: string; html: string; text: string } {
  const modalityLabel = resolveModalityLabel(input.event.location)
  const dateLabel = formatEventDateTime(input.event.date)
  const verifiedLabel =
    input.event.label.type === "verified" ? "Evento verificado" : "Evento comunitario"

  const text = [
    `Hola ${input.recipientName},`,
    "",
    input.reason,
    "",
    `Evento: ${input.event.title}`,
    `Fecha y horario: ${dateLabel}`,
    `Categoría: ${input.categoryLabel}`,
    `Ubicación o modalidad: ${modalityLabel}`,
    `Organizador: ${input.event.organizer.name}`,
    `Estado: ${verifiedLabel}`,
    "",
    `Ver detalle: ${input.eventUrl}`,
    "",
    "— Equipo Nexa",
  ].join("\n")

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f3660; line-height: 1.5; max-width: 560px;">
      <p>Hola ${input.recipientName},</p>
      <p>${input.reason}</p>
      <div style="border: 1px solid #d9e2f0; border-radius: 12px; padding: 16px; margin: 16px 0; background: #f8f9fc;">
        <p style="margin: 0 0 8px;"><strong>${input.event.title}</strong></p>
        <p style="margin: 0 0 4px;"><strong>Fecha y horario:</strong> ${dateLabel}</p>
        <p style="margin: 0 0 4px;"><strong>Categoría:</strong> ${input.categoryLabel}</p>
        <p style="margin: 0 0 4px;"><strong>Ubicación o modalidad:</strong> ${modalityLabel}</p>
        <p style="margin: 0 0 4px;"><strong>Organizador:</strong> ${input.event.organizer.name}</p>
        <p style="margin: 0;"><strong>${verifiedLabel}</strong></p>
      </div>
      <p>
        <a href="${input.eventUrl}" style="display: inline-block; background: #5b4bb7; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 10px; font-weight: 600;">
          Ver detalle del evento
        </a>
      </p>
      <p style="color: #6b7d9c; font-size: 13px;">— Equipo Nexa</p>
    </div>
  `.trim()

  return {
    subject: EVENT_RECOMMENDATION_EMAIL_SUBJECT,
    html,
    text,
  }
}
