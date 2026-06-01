import type { UploadImageInput } from "../types/storage.types"

function getFileExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase()
  if (fromName && ["jpg", "jpeg", "png"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName
  }

  if (file.type === "image/png") {
    return "png"
  }

  return "jpg"
}

export function buildStoragePath(input: UploadImageInput): string {
  const ext = getFileExtension(input.file)
  const { ownerId, kind } = input

  if (kind === "avatar") {
    return `profiles/${ownerId}/avatar.${ext}`
  }

  if (kind === "representative") {
    return `profiles/${ownerId}/representative.${ext}`
  }

  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  return `events/${ownerId}/${uniqueId}.${ext}`
}
