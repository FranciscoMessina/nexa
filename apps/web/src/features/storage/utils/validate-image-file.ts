import { StorageValidationError } from "../types/storage.types"

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png"])
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png"])

export function validateImageFile(file: File): void {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? ""

  if (!ALLOWED_MIME_TYPES.has(file.type) && !ALLOWED_EXTENSIONS.has(extension)) {
    throw new StorageValidationError("Formatos permitidos: JPG o PNG.")
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new StorageValidationError("La imagen no puede superar 5MB.")
  }
}
